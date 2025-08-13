-- =====================================================
-- CHUCK WAGON ALLERGÈNES - CONFIGURATION NOUVELLE BASE
-- Date: 27 janvier 2025
-- Version: 1.0.1 - Migration nouvelle base Supabase
-- =====================================================

/*
  # Configuration complète nouvelle base de données

  1. Tables principales
    - `dishes` : Table des plats avec toutes les informations
    - `dish_modifications` : Historique des modifications

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques de lecture publique et écriture authentifiée
    - Historique complet des modifications

  3. Fonctionnalités
    - Triggers automatiques pour updated_at et logging
    - Index de performance
    - Contraintes de validation
    - Données de test pour vérification
*/

-- =====================================================
-- 1. TABLE PRINCIPALE : DISHES
-- =====================================================

CREATE TABLE IF NOT EXISTS dishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  categorie text NOT NULL CHECK (categorie = ANY (ARRAY[
    'entrées'::text, 
    'plats'::text, 
    'desserts'::text, 
    'sauces'::text, 
    'huiles'::text, 
    'salades'::text, 
    'garnitures'::text, 
    'fromages'::text
  ])),
  langue text NOT NULL CHECK (langue = ANY (ARRAY[
    'fr'::text, 
    'en'::text, 
    'es'::text, 
    'it'::text, 
    'de'::text, 
    'nl'::text, 
    'pt'::text
  ])),
  ingredients text[] DEFAULT '{}'::text[],
  allergenes text[] DEFAULT '{}'::text[],
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 2. TABLE HISTORIQUE : DISH_MODIFICATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS dish_modifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id uuid,
  user_id uuid,
  user_email text NOT NULL,
  action_type text NOT NULL CHECK (action_type = ANY (ARRAY[
    'created'::text, 
    'updated'::text, 
    'deleted'::text
  ])),
  changes jsonb,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 3. FOREIGN KEYS
-- =====================================================

-- Lien vers la table dishes (avec CASCADE pour suppression)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'dish_modifications_dish_id_fkey'
  ) THEN
    ALTER TABLE dish_modifications 
    ADD CONSTRAINT dish_modifications_dish_id_fkey 
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Lien vers auth.users (si la table existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'auth') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'dish_modifications_user_id_fkey'
    ) THEN
      ALTER TABLE dish_modifications 
      ADD CONSTRAINT dish_modifications_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id);
    END IF;
  END IF;
END $$;

-- =====================================================
-- 4. INDEX POUR PERFORMANCE
-- =====================================================

-- Index sur dish_id pour les requêtes de modifications par plat
CREATE INDEX IF NOT EXISTS idx_dish_modifications_dish_id 
ON dish_modifications(dish_id);

-- Index sur created_at pour l'historique chronologique
CREATE INDEX IF NOT EXISTS idx_dish_modifications_created_at 
ON dish_modifications(created_at DESC);

-- =====================================================
-- 5. FONCTION DE MISE À JOUR AUTOMATIQUE
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_dishes_updated_at ON dishes;
CREATE TRIGGER update_dishes_updated_at 
    BEFORE UPDATE ON dishes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. FONCTION DE LOGGING AUTOMATIQUE
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

-- Trigger pour logger automatiquement toutes les modifications
DROP TRIGGER IF EXISTS dish_modification_trigger ON dishes;
CREATE TRIGGER dish_modification_trigger
    AFTER INSERT OR UPDATE OR DELETE ON dishes
    FOR EACH ROW EXECUTE FUNCTION log_dish_modification();

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS sur la table dishes
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique (anonyme et authentifié)
DROP POLICY IF EXISTS "Lecture publique des plats" ON dishes;
CREATE POLICY "Lecture publique des plats" 
    ON dishes FOR SELECT 
    TO anon, authenticated 
    USING (true);

-- Politique de gestion complète pour les utilisateurs authentifiés
DROP POLICY IF EXISTS "Gestion des plats pour les utilisateurs authentifiés" ON dishes;
CREATE POLICY "Gestion des plats pour les utilisateurs authentifiés" 
    ON dishes FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Activer RLS sur la table dish_modifications
ALTER TABLE dish_modifications ENABLE ROW LEVEL SECURITY;

-- Politique de lecture pour les utilisateurs authentifiés
DROP POLICY IF EXISTS "Utilisateurs authentifiés peuvent voir les modifications" ON dish_modifications;
CREATE POLICY "Utilisateurs authentifiés peuvent voir les modifications"
    ON dish_modifications FOR SELECT
    TO authenticated
    USING (true);

-- Politique d'insertion pour les utilisateurs authentifiés
DROP POLICY IF EXISTS "Utilisateurs authentifiés peuvent ajouter des modifications" ON dish_modifications;
CREATE POLICY "Utilisateurs authentifiés peuvent ajouter des modifications"
    ON dish_modifications FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 8. STORAGE POUR LES IMAGES (OPTIONNEL)
-- =====================================================

-- Créer le bucket pour les images si il n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'dish-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('dish-images', 'dish-images', true);
  END IF;
EXCEPTION
  WHEN others THEN
    -- Ignorer l'erreur si storage n'est pas disponible
    NULL;
END $$;

-- Politiques pour le storage (si disponible)
DO $$
BEGIN
  -- Politique pour l'upload d'images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Upload d''images pour tous'
  ) THEN
    EXECUTE 'CREATE POLICY "Upload d''images pour tous"
      ON storage.objects
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (bucket_id = ''dish-images'')';
  END IF;

  -- Politique pour la lecture des images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Lecture publique des images'
  ) THEN
    EXECUTE 'CREATE POLICY "Lecture publique des images"
      ON storage.objects
      FOR SELECT
      TO anon, authenticated
      USING (bucket_id = ''dish-images'')';
  END IF;

  -- Politique pour la suppression des images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Suppression des images pour les utilisateurs authentifiés'
  ) THEN
    EXECUTE 'CREATE POLICY "Suppression des images pour les utilisateurs authentifiés"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (bucket_id = ''dish-images'')';
  END IF;
EXCEPTION
  WHEN others THEN
    -- Ignorer l'erreur si storage n'est pas disponible
    NULL;
END $$;

-- =====================================================
-- 9. DONNÉES DE TEST POUR VÉRIFICATION
-- =====================================================

-- Insérer quelques plats de test si la table est vide
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM dishes LIMIT 1) THEN
    INSERT INTO dishes (nom, categorie, langue, ingredients, allergenes, image_url) VALUES
    ('Salade César', 'salades', 'fr', ARRAY['salade', 'parmesan', 'croûtons', 'sauce césar'], ARRAY['Lait', 'Gluten'], 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'),
    ('Steak frites', 'plats', 'fr', ARRAY['bœuf', 'pommes de terre', 'huile'], ARRAY[], 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400'),
    ('Tarte aux pommes', 'desserts', 'fr', ARRAY['pomme', 'pâte brisée', 'sucre', 'beurre'], ARRAY['Gluten', 'Lait'], 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400');
    
    RAISE NOTICE 'Données de test ajoutées : 3 plats créés';
  ELSE
    RAISE NOTICE 'Des plats existent déjà, pas d''ajout de données de test';
  END IF;
END $$;

-- =====================================================
-- 10. VÉRIFICATIONS FINALES
-- =====================================================

-- Vérifier que les tables existent et afficher un résumé
DO $$
DECLARE
  dishes_count integer;
  modifications_count integer;
BEGIN
  -- Compter les plats
  SELECT COUNT(*) INTO dishes_count FROM dishes;
  
  -- Compter les modifications
  SELECT COUNT(*) INTO modifications_count FROM dish_modifications;
  
  -- Vérifications
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dishes') THEN
    RAISE EXCEPTION 'ERREUR: Table dishes non créée !';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dish_modifications') THEN
    RAISE EXCEPTION 'ERREUR: Table dish_modifications non créée !';
  END IF;
  
  -- Messages de succès
  RAISE NOTICE '🎉 BASE DE DONNÉES CHUCK WAGON CONFIGURÉE AVEC SUCCÈS !';
  RAISE NOTICE '📊 Résumé :';
  RAISE NOTICE '   - Tables créées : dishes, dish_modifications';
  RAISE NOTICE '   - Plats en base : %', dishes_count;
  RAISE NOTICE '   - Modifications : %', modifications_count;
  RAISE NOTICE '   - RLS : Activé sur toutes les tables';
  RAISE NOTICE '   - Triggers : update_updated_at, log_modifications';
  RAISE NOTICE '   - Index : Optimisés pour les performances';
  RAISE NOTICE '🚀 Prêt pour la production !';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Prochaines étapes :';
  RAISE NOTICE '   1. Créer un utilisateur admin dans Authentication > Users';
  RAISE NOTICE '   2. Tester la connexion à /administration';
  RAISE NOTICE '   3. Utiliser "Réinitialiser menu complet" pour ajouter tous les plats';
END $$;

-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================