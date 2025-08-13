/*
  # Ajouter l'historique des modifications

  1. Nouvelles Tables
    - `dish_modifications`
      - `id` (uuid, primary key)
      - `dish_id` (uuid, foreign key vers dishes)
      - `user_id` (uuid, foreign key vers auth.users)
      - `user_email` (text, email de l'utilisateur)
      - `action_type` (text, type d'action: 'created', 'updated', 'deleted')
      - `changes` (jsonb, détails des modifications)
      - `created_at` (timestamp)

  2. Sécurité
    - Enable RLS sur `dish_modifications` table
    - Add policy pour les utilisateurs authentifiés

  3. Trigger
    - Trigger automatique pour enregistrer les modifications
*/

-- Créer la table des modifications
CREATE TABLE IF NOT EXISTS dish_modifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id uuid REFERENCES dishes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  user_email text NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('created', 'updated', 'deleted')),
  changes jsonb,
  created_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE dish_modifications ENABLE ROW LEVEL SECURITY;

-- Politique pour les utilisateurs authentifiés
CREATE POLICY "Utilisateurs authentifiés peuvent voir les modifications"
  ON dish_modifications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Utilisateurs authentifiés peuvent ajouter des modifications"
  ON dish_modifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_dish_modifications_dish_id ON dish_modifications(dish_id);
CREATE INDEX IF NOT EXISTS idx_dish_modifications_created_at ON dish_modifications(created_at DESC);

-- Fonction pour enregistrer les modifications
CREATE OR REPLACE FUNCTION log_dish_modification()
RETURNS TRIGGER AS $$
DECLARE
  user_email_val text;
  changes_json jsonb := '{}';
BEGIN
  -- Récupérer l'email de l'utilisateur
  SELECT email INTO user_email_val
  FROM auth.users
  WHERE id = auth.uid();

  -- Si pas d'utilisateur connecté, utiliser 'system'
  IF user_email_val IS NULL THEN
    user_email_val := 'system';
  END IF;

  -- Gérer les différents types d'actions
  IF TG_OP = 'INSERT' THEN
    -- Création d'un nouveau plat
    changes_json := jsonb_build_object(
      'nom', NEW.nom,
      'categorie', NEW.categorie,
      'langue', NEW.langue,
      'ingredients', NEW.ingredients,
      'allergenes', NEW.allergenes,
      'image_url', NEW.image_url
    );
    
    INSERT INTO dish_modifications (dish_id, user_id, user_email, action_type, changes)
    VALUES (NEW.id, auth.uid(), user_email_val, 'created', changes_json);
    
    RETURN NEW;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Modification d'un plat existant
    changes_json := '{}';
    
    -- Comparer chaque champ et noter les changements
    IF OLD.nom != NEW.nom THEN
      changes_json := changes_json || jsonb_build_object('nom', jsonb_build_object('old', OLD.nom, 'new', NEW.nom));
    END IF;
    
    IF OLD.categorie != NEW.categorie THEN
      changes_json := changes_json || jsonb_build_object('categorie', jsonb_build_object('old', OLD.categorie, 'new', NEW.categorie));
    END IF;
    
    IF OLD.langue != NEW.langue THEN
      changes_json := changes_json || jsonb_build_object('langue', jsonb_build_object('old', OLD.langue, 'new', NEW.langue));
    END IF;
    
    IF OLD.ingredients != NEW.ingredients THEN
      changes_json := changes_json || jsonb_build_object('ingredients', jsonb_build_object('old', OLD.ingredients, 'new', NEW.ingredients));
    END IF;
    
    IF OLD.allergenes != NEW.allergenes THEN
      changes_json := changes_json || jsonb_build_object('allergenes', jsonb_build_object('old', OLD.allergenes, 'new', NEW.allergenes));
    END IF;
    
    IF (OLD.image_url IS NULL AND NEW.image_url IS NOT NULL) OR 
       (OLD.image_url IS NOT NULL AND NEW.image_url IS NULL) OR
       (OLD.image_url != NEW.image_url) THEN
      changes_json := changes_json || jsonb_build_object('image_url', jsonb_build_object('old', OLD.image_url, 'new', NEW.image_url));
    END IF;
    
    -- Insérer seulement s'il y a des changements
    IF changes_json != '{}' THEN
      INSERT INTO dish_modifications (dish_id, user_id, user_email, action_type, changes)
      VALUES (NEW.id, auth.uid(), user_email_val, 'updated', changes_json);
    END IF;
    
    RETURN NEW;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Suppression d'un plat
    changes_json := jsonb_build_object(
      'nom', OLD.nom,
      'categorie', OLD.categorie,
      'langue', OLD.langue
    );
    
    INSERT INTO dish_modifications (dish_id, user_id, user_email, action_type, changes)
    VALUES (OLD.id, auth.uid(), user_email_val, 'deleted', changes_json);
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
DROP TRIGGER IF EXISTS dish_modification_trigger ON dishes;
CREATE TRIGGER dish_modification_trigger
  AFTER INSERT OR UPDATE OR DELETE ON dishes
  FOR EACH ROW EXECUTE FUNCTION log_dish_modification();