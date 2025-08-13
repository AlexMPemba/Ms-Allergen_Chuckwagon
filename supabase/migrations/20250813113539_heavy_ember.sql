-- =====================================================
-- CHUCK WAGON ALLERGÈNES - MIGRATION SIMPLE ET ROBUSTE
-- Date: 27 janvier 2025
-- Version: 1.0.2 - Setup propre nouvelle base
-- =====================================================

/*
  # Configuration base de données Chuck Wagon - Version Simple

  1. Tables principales
    - `dishes` : Table des plats
    - `dish_modifications` : Historique des modifications

  2. Sécurité
    - RLS activé
    - Politiques de sécurité

  3. Fonctionnalités
    - Triggers automatiques
    - Index de performance
    - Données de test
*/

-- =====================================================
-- 1. CRÉATION TABLE DISHES
-- =====================================================

CREATE TABLE dishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  categorie text NOT NULL,
  langue text NOT NULL,
  ingredients text[] DEFAULT '{}',
  allergenes text[] DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ajouter les contraintes après création
ALTER TABLE dishes ADD CONSTRAINT dishes_categorie_check 
  CHECK (categorie = ANY (ARRAY[
    'entrées'::text, 
    'plats'::text, 
    'desserts'::text, 
    'sauces'::text, 
    'huiles'::text, 
    'salades'::text, 
    'garnitures'::text, 
    'fromages'::text
  ]));

ALTER TABLE dishes ADD CONSTRAINT dishes_langue_check 
  CHECK (langue = ANY (ARRAY[
    'fr'::text, 
    'en'::text, 
    'es'::text, 
    'it'::text, 
    'de'::text, 
    'nl'::text, 
    'pt'::text
  ]));

-- =====================================================
-- 2. CRÉATION TABLE DISH_MODIFICATIONS
-- =====================================================

CREATE TABLE dish_modifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id uuid,
  user_id uuid,
  user_email text NOT NULL,
  action_type text NOT NULL,
  changes jsonb,
  created_at timestamptz DEFAULT now()
);

-- Ajouter les contraintes après création
ALTER TABLE dish_modifications ADD CONSTRAINT dish_modifications_action_type_check 
  CHECK (action_type = ANY (ARRAY[
    'created'::text, 
    'updated'::text, 
    'deleted'::text
  ]));

-- Ajouter les foreign keys
ALTER TABLE dish_modifications 
  ADD CONSTRAINT dish_modifications_dish_id_fkey 
  FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE;

-- =====================================================
-- 3. INDEX POUR PERFORMANCE
-- =====================================================

CREATE INDEX idx_dish_modifications_dish_id ON dish_modifications(dish_id);
CREATE INDEX idx_dish_modifications_created_at ON dish_modifications(created_at DESC);

-- =====================================================
-- 4. FONCTION UPDATE_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER update_dishes_updated_at 
    BEFORE UPDATE ON dishes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. FONCTION DE LOGGING
-- =====================================================

CREATE OR REPLACE FUNCTION log_dish_modification()
RETURNS TRIGGER AS $$
DECLARE
    user_email_val text;
BEGIN
    -- Récupérer l'email de l'utilisateur connecté
    SELECT email INTO user_email_val 
    FROM auth.users 
    WHERE id = auth.uid();
    
    IF TG_OP = 'INSERT' THEN
        INSERT INTO dish_modifications (dish_id, user_id, user_email, action_type, changes)
        VALUES (NEW.id, auth.uid(), COALESCE(user_email_val, 'system'), 'created', to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO dish_modifications (dish_id, user_id, user_email, action_type, changes)
        VALUES (NEW.id, auth.uid(), COALESCE(user_email_val, 'system'), 'updated', 
                jsonb_build_object(
                    'old', to_jsonb(OLD),
                    'new', to_jsonb(NEW)
                ));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO dish_modifications (dish_id, user_id, user_email, action_type, changes)
        VALUES (OLD.id, auth.uid(), COALESCE(user_email_val, 'system'), 'deleted', to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour logging
CREATE TRIGGER dish_modification_trigger
    AFTER INSERT OR UPDATE OR DELETE ON dishes
    FOR EACH ROW EXECUTE FUNCTION log_dish_modification();

-- =====================================================
-- 6. ROW LEVEL SECURITY
-- =====================================================

-- Activer RLS
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dish_modifications ENABLE ROW LEVEL SECURITY;

-- Politiques pour dishes
CREATE POLICY "Lecture publique des plats" 
    ON dishes FOR SELECT 
    TO anon, authenticated 
    USING (true);

CREATE POLICY "Gestion des plats pour les utilisateurs authentifiés" 
    ON dishes FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Politiques pour dish_modifications
CREATE POLICY "Utilisateurs authentifiés peuvent voir les modifications"
    ON dish_modifications FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Utilisateurs authentifiés peuvent ajouter des modifications"
    ON dish_modifications FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 7. STORAGE POUR IMAGES
-- =====================================================

-- Créer le bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('dish-images', 'dish-images', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques storage
CREATE POLICY "Upload d'images pour tous"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'dish-images');

CREATE POLICY "Lecture publique des images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'dish-images');

CREATE POLICY "Suppression des images pour les utilisateurs authentifiés"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'dish-images');

-- =====================================================
-- 8. DONNÉES DE TEST
-- =====================================================

-- Insérer 3 plats de test
INSERT INTO dishes (nom, categorie, langue, ingredients, allergenes, image_url) VALUES
(
  'Salade César', 
  'salades', 
  'fr', 
  ARRAY['salade', 'parmesan', 'croûtons', 'sauce césar']::text[], 
  ARRAY['Lait', 'Gluten']::text[], 
  'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'Steak frites', 
  'plats', 
  'fr', 
  ARRAY['bœuf', 'pommes de terre', 'huile']::text[], 
  ARRAY[]::text[], 
  'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'Tarte aux pommes', 
  'desserts', 
  'fr', 
  ARRAY['pomme', 'pâte brisée', 'sucre', 'beurre']::text[], 
  ARRAY['Gluten', 'Lait']::text[], 
  'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
);

-- =====================================================
-- 9. VÉRIFICATIONS FINALES
-- =====================================================

-- Vérifier que tout fonctionne
DO $$
DECLARE
  dishes_count integer;
  modifications_count integer;
BEGIN
  -- Compter les plats
  SELECT COUNT(*) INTO dishes_count FROM dishes;
  
  -- Compter les modifications
  SELECT COUNT(*) INTO modifications_count FROM dish_modifications;
  
  -- Messages de succès
  RAISE NOTICE '';
  RAISE NOTICE '🎉 MIGRATION CHUCK WAGON RÉUSSIE !';
  RAISE NOTICE '';
  RAISE NOTICE '📊 RÉSUMÉ :';
  RAISE NOTICE '   ✅ Tables créées : dishes, dish_modifications';
  RAISE NOTICE '   ✅ Plats de test : % plats', dishes_count;
  RAISE NOTICE '   ✅ Modifications : % entrées', modifications_count;
  RAISE NOTICE '   ✅ RLS : Activé sur toutes les tables';
  RAISE NOTICE '   ✅ Storage : Bucket dish-images configuré';
  RAISE NOTICE '';
  RAISE NOTICE '📝 PROCHAINES ÉTAPES :';
  RAISE NOTICE '   1. Créer un utilisateur admin dans Authentication > Users';
  RAISE NOTICE '   2. Tester la connexion à /administration';
  RAISE NOTICE '   3. Utiliser "Réinitialiser menu complet" pour ajouter tous les plats';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 BASE DE DONNÉES PRÊTE !';
END $$;

-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================