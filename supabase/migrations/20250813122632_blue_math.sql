-- =====================================================
-- CHUCK WAGON ALLERGÈNES - NOUVEAU SYSTÈME DE CATÉGORIES
-- Date: 27 janvier 2025
-- Version: 2.0.0 - Ajout des sous-catégories
-- =====================================================

/*
  # Nouveau système de catégories avec sous-catégories

  1. Nouvelles colonnes
    - Ajouter `sous_categorie` à la table dishes
    - Mettre à jour les contraintes pour les nouvelles catégories

  2. Nouvelles catégories
    - Entrées (avec 5 sous-catégories)
    - Plats (sans sous-catégorie)
    - Desserts (avec 3 sous-catégories)
    - Sauces (avec 2 sous-catégories)
    - Accompagnements, Garniture, Fromages, Huiles (sans sous-catégorie)
    - Natama, Halal, Casher, Boissons chaudes (nouvelles catégories)

  3. Migration des données
    - Mapper les anciennes catégories vers les nouvelles
    - Conserver toutes les données existantes
*/

-- =====================================================
-- 1. AJOUTER LA COLONNE SOUS_CATEGORIE
-- =====================================================

-- Ajouter la colonne sous_categorie si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dishes' AND column_name = 'sous_categorie'
  ) THEN
    ALTER TABLE dishes ADD COLUMN sous_categorie text;
    RAISE NOTICE '✅ Colonne sous_categorie ajoutée';
  ELSE
    RAISE NOTICE 'ℹ️ Colonne sous_categorie existe déjà';
  END IF;
END $$;

-- =====================================================
-- 2. SUPPRIMER L'ANCIENNE CONTRAINTE DE CATÉGORIE
-- =====================================================

-- Supprimer l'ancienne contrainte
ALTER TABLE dishes DROP CONSTRAINT IF EXISTS dishes_categorie_check;

-- =====================================================
-- 3. AJOUTER LA NOUVELLE CONTRAINTE AVEC TOUTES LES CATÉGORIES
-- =====================================================

-- Nouvelle contrainte avec toutes les catégories exactes
ALTER TABLE dishes ADD CONSTRAINT dishes_categorie_check 
  CHECK (categorie = ANY (ARRAY[
    'Entrées'::text,
    'Plats'::text,
    'Desserts'::text,
    'Sauces'::text,
    'Accompagnements'::text,
    'Garniture'::text,
    'Fromages'::text,
    'Huiles'::text,
    'Natama'::text,
    'Halal'::text,
    'Casher'::text,
    'Boissons chaudes'::text
  ]));

-- =====================================================
-- 4. AJOUTER LA CONTRAINTE POUR LES SOUS-CATÉGORIES
-- =====================================================

-- Contrainte pour les sous-catégories valides
ALTER TABLE dishes ADD CONSTRAINT dishes_sous_categorie_check 
  CHECK (
    sous_categorie IS NULL OR
    sous_categorie = ANY (ARRAY[
      -- Sous-catégories pour Entrées
      'Bar à Salades'::text,
      'Charcuterie'::text,
      'Produits de la mer'::text,
      'Soupes'::text,
      'Assortiment de graines et fruits secs'::text,
      -- Sous-catégories pour Desserts
      'Desserts fruités'::text,
      'Glaces'::text,
      'Gâteau d''anniversaire'::text,
      -- Sous-catégories pour Sauces
      'Sauces condiment'::text,
      'Sauces salade'::text
    ])
  );

-- =====================================================
-- 5. MIGRATION DES DONNÉES EXISTANTES
-- =====================================================

-- Mapper les anciennes catégories vers les nouvelles
UPDATE dishes SET 
  categorie = CASE 
    WHEN categorie = 'entrées' THEN 'Entrées'
    WHEN categorie = 'plats' THEN 'Plats'
    WHEN categorie = 'desserts' THEN 'Desserts'
    WHEN categorie = 'sauces' THEN 'Sauces'
    WHEN categorie = 'salades' THEN 'Entrées'  -- Mapper salades vers Entrées
    WHEN categorie = 'garnitures' THEN 'Garniture'
    WHEN categorie = 'fromages' THEN 'Fromages'
    WHEN categorie = 'huiles' THEN 'Huiles'
    WHEN categorie = 'accompagnements' THEN 'Accompagnements'
    WHEN categorie = 'natama' THEN 'Natama'
    ELSE categorie
  END,
  sous_categorie = CASE 
    WHEN categorie = 'salades' THEN 'Bar à Salades'  -- Mapper les salades vers Bar à Salades
    ELSE NULL
  END
WHERE categorie IN ('entrées', 'plats', 'desserts', 'sauces', 'salades', 'garnitures', 'fromages', 'huiles', 'accompagnements', 'natama');

-- =====================================================
-- 6. METTRE À JOUR LA TABLE DISH_MODIFICATIONS
-- =====================================================

-- Ajouter la colonne sous_categorie à l'historique aussi
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dish_modifications' AND column_name = 'dish_sous_category'
  ) THEN
    ALTER TABLE dish_modifications ADD COLUMN dish_sous_category text;
    RAISE NOTICE '✅ Colonne dish_sous_category ajoutée à l''historique';
  END IF;
END $$;

-- =====================================================
-- 7. METTRE À JOUR LA FONCTION DE LOGGING
-- =====================================================

-- Fonction de logging mise à jour pour inclure les sous-catégories
CREATE OR REPLACE FUNCTION log_dish_modification()
RETURNS TRIGGER AS $$
DECLARE
    user_info RECORD;
    user_id_val uuid := null;
    user_email_val text := 'system';
    detection_method_val text := 'unknown';
BEGIN
    -- Récupérer les informations utilisateur
    BEGIN
        SELECT * INTO user_info FROM get_current_user_info() LIMIT 1;
        user_id_val := user_info.user_id;
        user_email_val := COALESCE(user_info.user_email, 'system');
        detection_method_val := COALESCE(user_info.detection_method, 'unknown');
    EXCEPTION WHEN OTHERS THEN
        user_id_val := null;
        user_email_val := 'system_error';
        detection_method_val := 'error: ' || SQLERRM;
    END;
    
    -- Logging selon le type d'opération
    BEGIN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO dish_modifications (
                dish_id, user_id, user_email, action_type, changes,
                dish_name, dish_category, dish_sous_category, user_detection_method
            )
            VALUES (
                NEW.id, user_id_val, user_email_val, 'created', to_jsonb(NEW),
                NEW.nom, NEW.categorie, NEW.sous_categorie, detection_method_val
            );
            RETURN NEW;
            
        ELSIF TG_OP = 'UPDATE' THEN
            INSERT INTO dish_modifications (
                dish_id, user_id, user_email, action_type, changes,
                dish_name, dish_category, dish_sous_category, user_detection_method
            )
            VALUES (
                NEW.id, user_id_val, user_email_val, 'updated', 
                jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)),
                NEW.nom, NEW.categorie, NEW.sous_categorie, detection_method_val
            );
            RETURN NEW;
            
        ELSIF TG_OP = 'DELETE' THEN
            INSERT INTO dish_modifications (
                dish_id, user_id, user_email, action_type, changes,
                dish_name, dish_category, dish_sous_category, user_detection_method
            )
            VALUES (
                OLD.id, user_id_val, user_email_val, 'deleted', 
                jsonb_build_object(
                    'deleted_dish', to_jsonb(OLD),
                    'deletion_timestamp', now(),
                    'deletion_reason', 'Manual deletion by admin'
                ),
                OLD.nom, OLD.categorie, OLD.sous_categorie, detection_method_val
            );
            RETURN OLD;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Erreur lors du logging: %', SQLERRM;
        IF TG_OP = 'DELETE' THEN
            RETURN OLD;
        ELSE
            RETURN NEW;
        END IF;
    END;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. FONCTION DE TEST AVEC NOUVELLES CATÉGORIES
-- =====================================================

-- Fonction pour tester les nouvelles catégories
CREATE OR REPLACE FUNCTION test_new_categories()
RETURNS text AS $$
DECLARE
    test_dish_id uuid;
    result_text text := '';
BEGIN
    result_text := '🧪 TEST DES NOUVELLES CATÉGORIES' || E'\n';
    result_text := result_text || '===============================' || E'\n';
    
    -- Test création avec sous-catégorie
    BEGIN
        INSERT INTO dishes (nom, categorie, sous_categorie, langue, ingredients, allergenes)
        VALUES ('Test Nouvelle Catégorie', 'Entrées', 'Bar à Salades', 'fr', ARRAY['test']::text[], ARRAY[]::text[])
        RETURNING id INTO test_dish_id;
        
        result_text := result_text || '✅ Création avec sous-catégorie: OK' || E'\n';
        
        -- Nettoyer
        DELETE FROM dishes WHERE id = test_dish_id;
        
    EXCEPTION WHEN OTHERS THEN
        result_text := result_text || '❌ Création avec sous-catégorie: ' || SQLERRM || E'\n';
    END;
    
    -- Test création sans sous-catégorie
    BEGIN
        INSERT INTO dishes (nom, categorie, langue, ingredients, allergenes)
        VALUES ('Test Sans Sous-Catégorie', 'Plats', 'fr', ARRAY['test']::text[], ARRAY[]::text[])
        RETURNING id INTO test_dish_id;
        
        result_text := result_text || '✅ Création sans sous-catégorie: OK' || E'\n';
        
        -- Nettoyer
        DELETE FROM dishes WHERE id = test_dish_id;
        
    EXCEPTION WHEN OTHERS THEN
        result_text := result_text || '❌ Création sans sous-catégorie: ' || SQLERRM || E'\n';
    END;
    
    result_text := result_text || '===============================' || E'\n';
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exécuter le test
SELECT test_new_categories();

-- =====================================================
-- 9. MESSAGES DE SUCCÈS
-- =====================================================

DO $$
DECLARE
    total_dishes integer;
    categories_count integer;
    subcategories_count integer;
BEGIN
    -- Compter les plats
    SELECT COUNT(*) INTO total_dishes FROM dishes;
    
    -- Compter les catégories distinctes
    SELECT COUNT(DISTINCT categorie) INTO categories_count FROM dishes;
    
    -- Compter les sous-catégories distinctes
    SELECT COUNT(DISTINCT sous_categorie) INTO subcategories_count 
    FROM dishes WHERE sous_categorie IS NOT NULL;
    
    -- Messages de succès
    RAISE NOTICE '';
    RAISE NOTICE '🎉 NOUVEAU SYSTÈME DE CATÉGORIES IMPLÉMENTÉ !';
    RAISE NOTICE '==========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 STATISTIQUES :';
    RAISE NOTICE '   ✅ Total plats : % plats', total_dishes;
    RAISE NOTICE '   ✅ Catégories actives : % catégories', categories_count;
    RAISE NOTICE '   ✅ Sous-catégories actives : % sous-catégories', subcategories_count;
    RAISE NOTICE '';
    RAISE NOTICE '📋 NOUVELLES CATÉGORIES DISPONIBLES :';
    RAISE NOTICE '   • Entrées (5 sous-catégories)';
    RAISE NOTICE '   • Plats (sans sous-catégorie)';
    RAISE NOTICE '   • Desserts (3 sous-catégories)';
    RAISE NOTICE '   • Sauces (2 sous-catégories)';
    RAISE NOTICE '   • Accompagnements, Garniture, Fromages, Huiles';
    RAISE NOTICE '   • Natama, Halal, Casher, Boissons chaudes';
    RAISE NOTICE '';
    RAISE NOTICE '🔄 MIGRATION DES DONNÉES :';
    RAISE NOTICE '   ✅ Anciennes catégories mappées vers nouvelles';
    RAISE NOTICE '   ✅ Salades → Entrées / Bar à Salades';
    RAISE NOTICE '   ✅ Contraintes mises à jour';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 PRÊT POUR L''INTERFACE !';
END $$;

-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================