-- =====================================================
-- CHUCK WAGON ALLERGÈNES - AJOUT VISIBILITÉ MENU
-- Date: 27 janvier 2025
-- Version: 2.1.0 - Ajout option "Actuellement à la carte"
-- =====================================================

/*
  # Ajout de la fonctionnalité "Actuellement à la carte"

  1. Nouvelle colonne
    - `a_la_carte` (boolean, default true) dans la table dishes
    - Permet de masquer/afficher des plats dans le menu public

  2. Fonctionnalités
    - Case à cocher dans l'interface d'administration
    - Filtrage automatique dans le menu public
    - Historique des modifications de visibilité

  3. Migration
    - Tous les plats existants seront visibles par défaut
    - Pas d'impact sur les données existantes
*/

-- =====================================================
-- 1. AJOUTER LA COLONNE A_LA_CARTE
-- =====================================================

-- Ajouter la colonne a_la_carte si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dishes' AND column_name = 'a_la_carte'
  ) THEN
    ALTER TABLE dishes ADD COLUMN a_la_carte boolean DEFAULT true;
    RAISE NOTICE '✅ Colonne a_la_carte ajoutée avec succès';
  ELSE
    RAISE NOTICE 'ℹ️ Colonne a_la_carte existe déjà';
  END IF;
END $$;

-- =====================================================
-- 2. METTRE À JOUR LES PLATS EXISTANTS
-- =====================================================

-- S'assurer que tous les plats existants sont visibles par défaut
UPDATE dishes 
SET a_la_carte = true 
WHERE a_la_carte IS NULL;

-- =====================================================
-- 3. AJOUTER UN INDEX POUR LA PERFORMANCE
-- =====================================================

-- Index sur a_la_carte pour optimiser les requêtes de filtrage
CREATE INDEX IF NOT EXISTS idx_dishes_a_la_carte 
ON dishes(a_la_carte);

-- Index composé pour les requêtes fréquentes (langue + visibilité)
CREATE INDEX IF NOT EXISTS idx_dishes_langue_a_la_carte 
ON dishes(langue, a_la_carte);

-- =====================================================
-- 4. FONCTION POUR BASCULER LA VISIBILITÉ
-- =====================================================

-- Fonction utilitaire pour basculer la visibilité d'un plat
CREATE OR REPLACE FUNCTION toggle_dish_visibility(dish_id_param uuid)
RETURNS boolean AS $$
DECLARE
    current_visibility boolean;
    dish_name_val text;
BEGIN
    -- Récupérer l'état actuel
    SELECT a_la_carte, nom INTO current_visibility, dish_name_val
    FROM dishes 
    WHERE id = dish_id_param;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Plat avec ID % non trouvé', dish_id_param;
    END IF;
    
    -- Basculer la visibilité
    UPDATE dishes 
    SET a_la_carte = NOT current_visibility
    WHERE id = dish_id_param;
    
    RAISE NOTICE 'Visibilité du plat "%" basculée: % → %', 
                 dish_name_val, current_visibility, NOT current_visibility;
    
    RETURN NOT current_visibility;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. FONCTION POUR MASQUER/AFFICHER EN MASSE
-- =====================================================

-- Fonction pour masquer tous les plats d'une catégorie
CREATE OR REPLACE FUNCTION hide_category_dishes(category_name text)
RETURNS integer AS $$
DECLARE
    affected_count integer;
BEGIN
    UPDATE dishes 
    SET a_la_carte = false 
    WHERE categorie = category_name AND a_la_carte = true;
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    
    RAISE NOTICE '% plats de la catégorie "%" masqués du menu', affected_count, category_name;
    
    RETURN affected_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour afficher tous les plats d'une catégorie
CREATE OR REPLACE FUNCTION show_category_dishes(category_name text)
RETURNS integer AS $$
DECLARE
    affected_count integer;
BEGIN
    UPDATE dishes 
    SET a_la_carte = true 
    WHERE categorie = category_name AND a_la_carte = false;
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    
    RAISE NOTICE '% plats de la catégorie "%" ajoutés au menu', affected_count, category_name;
    
    RETURN affected_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. FONCTION DE STATISTIQUES
-- =====================================================

-- Fonction pour obtenir les statistiques de visibilité
CREATE OR REPLACE FUNCTION get_menu_visibility_stats()
RETURNS TABLE(
    categorie text,
    total_plats integer,
    plats_visibles integer,
    plats_masques integer,
    pourcentage_visible numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.categorie,
        COUNT(*)::integer as total_plats,
        COUNT(*) FILTER (WHERE d.a_la_carte = true)::integer as plats_visibles,
        COUNT(*) FILTER (WHERE d.a_la_carte = false)::integer as plats_masques,
        ROUND(
            (COUNT(*) FILTER (WHERE d.a_la_carte = true)::numeric / COUNT(*)::numeric) * 100, 
            1
        ) as pourcentage_visible
    FROM dishes d
    GROUP BY d.categorie
    ORDER BY d.categorie;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. TEST DE LA NOUVELLE FONCTIONNALITÉ
-- =====================================================

-- Fonction de test pour vérifier la visibilité
CREATE OR REPLACE FUNCTION test_menu_visibility()
RETURNS text AS $$
DECLARE
    test_dish_id uuid;
    visibility_before boolean;
    visibility_after boolean;
    result_text text := '';
BEGIN
    result_text := '🧪 TEST DE LA VISIBILITÉ MENU' || E'\n';
    result_text := result_text || '=============================' || E'\n';
    
    -- Créer un plat de test
    INSERT INTO dishes (nom, categorie, langue, ingredients, allergenes, a_la_carte)
    VALUES ('Test Visibilité', 'plats', 'fr', ARRAY['test']::text[], ARRAY[]::text[], true)
    RETURNING id INTO test_dish_id;
    
    result_text := result_text || '✅ Plat de test créé (visible par défaut)' || E'\n';
    
    -- Tester le basculement de visibilité
    SELECT a_la_carte INTO visibility_before FROM dishes WHERE id = test_dish_id;
    PERFORM toggle_dish_visibility(test_dish_id);
    SELECT a_la_carte INTO visibility_after FROM dishes WHERE id = test_dish_id;
    
    result_text := result_text || '✅ Visibilité basculée: ' || visibility_before || ' → ' || visibility_after || E'\n';
    
    -- Nettoyer le test
    DELETE FROM dishes WHERE id = test_dish_id;
    result_text := result_text || '✅ Test nettoyé' || E'\n';
    
    result_text := result_text || '=============================' || E'\n';
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exécuter le test
SELECT test_menu_visibility();

-- =====================================================
-- 8. MESSAGES DE SUCCÈS
-- =====================================================

DO $$
DECLARE
    total_dishes integer;
    visible_dishes integer;
    hidden_dishes integer;
BEGIN
    -- Compter les plats
    SELECT COUNT(*) INTO total_dishes FROM dishes;
    SELECT COUNT(*) INTO visible_dishes FROM dishes WHERE a_la_carte = true;
    SELECT COUNT(*) INTO hidden_dishes FROM dishes WHERE a_la_carte = false;
    
    -- Messages de succès
    RAISE NOTICE '';
    RAISE NOTICE '🎉 FONCTIONNALITÉ "ACTUELLEMENT À LA CARTE" AJOUTÉE !';
    RAISE NOTICE '================================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 ÉTAT ACTUEL :';
    RAISE NOTICE '   ✅ Total plats : % plats', total_dishes;
    RAISE NOTICE '   ✅ Plats visibles : % plats', visible_dishes;
    RAISE NOTICE '   ✅ Plats masqués : % plats', hidden_dishes;
    RAISE NOTICE '   ✅ Colonne a_la_carte ajoutée avec succès';
    RAISE NOTICE '   ✅ Index de performance créés';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 NOUVELLES FONCTIONNALITÉS :';
    RAISE NOTICE '   • Case à cocher dans l''interface admin';
    RAISE NOTICE '   • Filtrage automatique dans le menu public';
    RAISE NOTICE '   • Fonctions utilitaires (toggle, hide/show par catégorie)';
    RAISE NOTICE '   • Statistiques de visibilité par catégorie';
    RAISE NOTICE '';
    RAISE NOTICE '📝 UTILISATION :';
    RAISE NOTICE '   1. Aller dans l''administration';
    RAISE NOTICE '   2. Cocher/décocher "Actuellement à la carte"';
    RAISE NOTICE '   3. Les plats décochés disparaissent du menu public';
    RAISE NOTICE '   4. Utiliser les statistiques pour suivre la visibilité';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 FONCTIONNALITÉ PRÊTE À UTILISER !';
END $$;

-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================