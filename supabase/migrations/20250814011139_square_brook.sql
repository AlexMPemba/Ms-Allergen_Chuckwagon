-- =====================================================
-- CHUCK WAGON ALLERGÈNES - AJOUT SOUS-CATÉGORIE SALADES COMPOSÉES
-- Date: 27 janvier 2025
-- Version: 2.0.1 - Ajout nouvelle sous-catégorie
-- =====================================================

/*
  # Ajout de la sous-catégorie "Salades Composées"

  1. Problème
    - Impossible de sauvegarder des plats avec la sous-catégorie "Salades Composées"
    - La contrainte de validation ne reconnaît pas cette nouvelle sous-catégorie

  2. Solution
    - Mettre à jour la contrainte dishes_sous_categorie_check
    - Ajouter "Salades Composées" à la liste des sous-catégories valides

  3. Résultat
    - Possibilité de créer des plats avec cette sous-catégorie
    - Validation correcte dans l'interface d'administration
*/

-- =====================================================
-- 1. SUPPRIMER L'ANCIENNE CONTRAINTE
-- =====================================================

-- Supprimer la contrainte existante pour les sous-catégories
ALTER TABLE dishes DROP CONSTRAINT IF EXISTS dishes_sous_categorie_check;

-- =====================================================
-- 2. AJOUTER LA NOUVELLE CONTRAINTE AVEC SALADES COMPOSÉES
-- =====================================================

-- Nouvelle contrainte incluant "Salades Composées"
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
      'Salades Composées'::text,  -- NOUVELLE SOUS-CATÉGORIE
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
-- 3. TEST DE LA NOUVELLE CONTRAINTE
-- =====================================================

-- Fonction pour tester la nouvelle sous-catégorie
CREATE OR REPLACE FUNCTION test_salades_composees()
RETURNS text AS $$
DECLARE
    test_dish_id uuid;
    result_text text := '';
BEGIN
    result_text := '🧪 TEST SOUS-CATÉGORIE SALADES COMPOSÉES' || E'\n';
    result_text := result_text || '=======================================' || E'\n';
    
    -- Test création avec la nouvelle sous-catégorie
    BEGIN
        INSERT INTO dishes (nom, categorie, sous_categorie, langue, ingredients, allergenes)
        VALUES ('Test Salade Composée', 'Entrées', 'Salades Composées', 'fr', ARRAY['test']::text[], ARRAY[]::text[])
        RETURNING id INTO test_dish_id;
        
        result_text := result_text || '✅ Création avec "Salades Composées": OK' || E'\n';
        
        -- Nettoyer le test
        DELETE FROM dishes WHERE id = test_dish_id;
        result_text := result_text || '✅ Test nettoyé' || E'\n';
        
    EXCEPTION WHEN OTHERS THEN
        result_text := result_text || '❌ Création avec "Salades Composées": ' || SQLERRM || E'\n';
    END;
    
    result_text := result_text || '=======================================' || E'\n';
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exécuter le test
SELECT test_salades_composees();

-- =====================================================
-- 4. MESSAGES DE SUCCÈS
-- =====================================================

DO $$
DECLARE
    total_dishes integer;
    entrees_dishes integer;
BEGIN
    -- Compter les plats
    SELECT COUNT(*) INTO total_dishes FROM dishes;
    SELECT COUNT(*) INTO entrees_dishes FROM dishes WHERE categorie = 'Entrées';
    
    -- Messages de succès
    RAISE NOTICE '';
    RAISE NOTICE '🎉 SOUS-CATÉGORIE "SALADES COMPOSÉES" AJOUTÉE !';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 ÉTAT ACTUEL :';
    RAISE NOTICE '   ✅ Total plats : % plats', total_dishes;
    RAISE NOTICE '   ✅ Plats Entrées : % plats', entrees_dishes;
    RAISE NOTICE '   ✅ Contrainte mise à jour avec nouvelle sous-catégorie';
    RAISE NOTICE '';
    RAISE NOTICE '📋 SOUS-CATÉGORIES ENTRÉES DISPONIBLES :';
    RAISE NOTICE '   • Bar à Salades';
    RAISE NOTICE '   • Charcuterie';
    RAISE NOTICE '   • Produits de la mer';
    RAISE NOTICE '   • Soupes';
    RAISE NOTICE '   • Assortiment de graines et fruits secs';
    RAISE NOTICE '   • Salades Composées (NOUVEAU)';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 VOUS POUVEZ MAINTENANT :';
    RAISE NOTICE '   1. Créer des plats avec sous-catégorie "Salades Composées"';
    RAISE NOTICE '   2. Les sauvegarder sans erreur';
    RAISE NOTICE '   3. Les voir dans la navigation par sous-catégories';
    RAISE NOTICE '';
    RAISE NOTICE '✅ PROBLÈME RÉSOLU !';
END $$;

-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================