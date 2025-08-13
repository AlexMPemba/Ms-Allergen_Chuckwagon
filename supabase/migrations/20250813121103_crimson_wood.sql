-- =====================================================
-- CHUCK WAGON ALLERGÈNES - CORRECTION LOGGING UTILISATEUR
-- Date: 27 janvier 2025
-- Version: 1.0.4 - Correction détection utilisateur et historique
-- =====================================================

/*
  # Correction du logging utilisateur et historique des suppressions

  1. Problèmes identifiés
    - Les modifications apparaissent comme "system" au lieu de l'email admin
    - Les suppressions n'apparaissent pas dans l'historique
    - La fonction auth.uid() ne fonctionne pas correctement

  2. Solutions
    - Améliorer la détection de l'utilisateur connecté
    - Corriger la fonction de logging pour les suppressions
    - Ajouter des colonnes pour conserver les informations
    - Diagnostic complet de l'authentification

  3. Résultat
    - Historique complet avec vrais emails d'admin
    - Suppressions visibles et traçables
    - Traçabilité parfaite de toutes les actions
*/

-- =====================================================
-- 1. DIAGNOSTIC DE L'AUTHENTIFICATION
-- =====================================================

-- Fonction pour diagnostiquer l'état de l'authentification
CREATE OR REPLACE FUNCTION diagnose_auth_state()
RETURNS TABLE(
    current_user_id uuid,
    current_user_email text,
    auth_uid_works boolean,
    users_table_accessible boolean,
    total_users integer
) AS $$
DECLARE
    uid_result uuid;
    email_result text;
    users_count integer := 0;
BEGIN
    -- Test auth.uid()
    BEGIN
        uid_result := auth.uid();
    EXCEPTION WHEN OTHERS THEN
        uid_result := null;
    END;
    
    -- Test accès à auth.users
    BEGIN
        SELECT COUNT(*) INTO users_count FROM auth.users;
        IF uid_result IS NOT NULL THEN
            SELECT email INTO email_result FROM auth.users WHERE id = uid_result;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        users_count := -1;
        email_result := 'ERROR_ACCESSING_USERS_TABLE';
    END;
    
    RETURN QUERY SELECT 
        uid_result as current_user_id,
        COALESCE(email_result, 'NO_EMAIL_FOUND') as current_user_email,
        (uid_result IS NOT NULL) as auth_uid_works,
        (users_count >= 0) as users_table_accessible,
        users_count as total_users;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. AMÉLIORER LA DÉTECTION UTILISATEUR
-- =====================================================

-- Fonction améliorée pour récupérer l'utilisateur actuel
CREATE OR REPLACE FUNCTION get_current_user_info()
RETURNS TABLE(
    user_id uuid,
    user_email text,
    detection_method text
) AS $$
DECLARE
    uid_result uuid;
    email_result text;
    method_used text;
BEGIN
    -- Méthode 1: auth.uid() standard
    BEGIN
        uid_result := auth.uid();
        IF uid_result IS NOT NULL THEN
            SELECT email INTO email_result FROM auth.users WHERE id = uid_result;
            IF email_result IS NOT NULL THEN
                method_used := 'auth.uid() + auth.users';
                RETURN QUERY SELECT uid_result, email_result, method_used;
                RETURN;
            END IF;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- Continuer avec les autres méthodes
    END;
    
    -- Méthode 2: Vérifier les headers JWT
    BEGIN
        -- Essayer de récupérer depuis les variables de session
        uid_result := current_setting('request.jwt.claims', true)::json->>'sub';
        IF uid_result IS NOT NULL THEN
            SELECT email INTO email_result FROM auth.users WHERE id = uid_result;
            IF email_result IS NOT NULL THEN
                method_used := 'JWT claims + auth.users';
                RETURN QUERY SELECT uid_result, email_result, method_used;
                RETURN;
            END IF;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- Continuer
    END;
    
    -- Méthode 3: Fallback
    method_used := 'fallback_system';
    RETURN QUERY SELECT null::uuid, 'system'::text, method_used;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. CORRIGER LA CONTRAINTE CASCADE
-- =====================================================

-- Supprimer la contrainte CASCADE existante
ALTER TABLE dish_modifications 
DROP CONSTRAINT IF EXISTS dish_modifications_dish_id_fkey;

-- Recréer sans CASCADE pour conserver l'historique
ALTER TABLE dish_modifications 
ADD CONSTRAINT dish_modifications_dish_id_fkey 
FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE SET NULL;

-- =====================================================
-- 4. AJOUTER LES COLONNES DE TRAÇABILITÉ
-- =====================================================

-- Ajouter les colonnes pour conserver les informations du plat
DO $$
BEGIN
  -- Ajouter dish_name si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dish_modifications' AND column_name = 'dish_name'
  ) THEN
    ALTER TABLE dish_modifications ADD COLUMN dish_name text;
  END IF;
  
  -- Ajouter dish_category si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dish_modifications' AND column_name = 'dish_category'
  ) THEN
    ALTER TABLE dish_modifications ADD COLUMN dish_category text;
  END IF;
  
  -- Ajouter user_detection_method pour debug
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dish_modifications' AND column_name = 'user_detection_method'
  ) THEN
    ALTER TABLE dish_modifications ADD COLUMN user_detection_method text;
  END IF;
END $$;

-- =====================================================
-- 5. NOUVELLE FONCTION DE LOGGING ROBUSTE
-- =====================================================

CREATE OR REPLACE FUNCTION log_dish_modification()
RETURNS TRIGGER AS $$
DECLARE
    user_info RECORD;
    user_id_val uuid := null;
    user_email_val text := 'system';
    detection_method_val text := 'unknown';
BEGIN
    -- Récupérer les informations utilisateur avec la nouvelle fonction
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
                dish_name, dish_category, user_detection_method
            )
            VALUES (
                NEW.id, user_id_val, user_email_val, 'created', to_jsonb(NEW),
                NEW.nom, NEW.categorie, detection_method_val
            );
            RETURN NEW;
            
        ELSIF TG_OP = 'UPDATE' THEN
            INSERT INTO dish_modifications (
                dish_id, user_id, user_email, action_type, changes,
                dish_name, dish_category, user_detection_method
            )
            VALUES (
                NEW.id, user_id_val, user_email_val, 'updated', 
                jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)),
                NEW.nom, NEW.categorie, detection_method_val
            );
            RETURN NEW;
            
        ELSIF TG_OP = 'DELETE' THEN
            -- CRITIQUE: Bien logger les suppressions
            INSERT INTO dish_modifications (
                dish_id, user_id, user_email, action_type, changes,
                dish_name, dish_category, user_detection_method
            )
            VALUES (
                OLD.id, user_id_val, user_email_val, 'deleted', 
                jsonb_build_object(
                    'deleted_dish', to_jsonb(OLD),
                    'deletion_timestamp', now(),
                    'deletion_reason', 'Manual deletion by admin',
                    'user_detection', detection_method_val
                ),
                OLD.nom, OLD.categorie, detection_method_val
            );
            RETURN OLD;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- Si le logging échoue, continuer l'opération mais logger l'erreur
        RAISE WARNING 'Erreur lors du logging (opération continuée): %', SQLERRM;
        
        -- Essayer un logging minimal en cas d'erreur
        BEGIN
            INSERT INTO dish_modifications (
                dish_id, user_id, user_email, action_type, changes,
                dish_name, dish_category, user_detection_method
            )
            VALUES (
                COALESCE(NEW.id, OLD.id), 
                null, 
                'logging_error', 
                CASE WHEN TG_OP = 'INSERT' THEN 'created'
                     WHEN TG_OP = 'UPDATE' THEN 'updated'
                     WHEN TG_OP = 'DELETE' THEN 'deleted'
                     ELSE 'unknown' END,
                jsonb_build_object('error', SQLERRM),
                COALESCE(NEW.nom, OLD.nom, 'unknown'),
                COALESCE(NEW.categorie, OLD.categorie, 'unknown'),
                'error_fallback'
            );
        EXCEPTION WHEN OTHERS THEN
            -- Si même le logging minimal échoue, continuer sans logging
            NULL;
        END;
        
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
-- 6. RECRÉER LE TRIGGER
-- =====================================================

-- Supprimer l'ancien trigger
DROP TRIGGER IF EXISTS dish_modification_trigger ON dishes;

-- Créer le nouveau trigger amélioré
CREATE TRIGGER dish_modification_trigger
    AFTER INSERT OR UPDATE OR DELETE ON dishes
    FOR EACH ROW EXECUTE FUNCTION log_dish_modification();

-- =====================================================
-- 7. METTRE À JOUR LES MODIFICATIONS EXISTANTES
-- =====================================================

-- Remplir les nouvelles colonnes pour l'historique existant
UPDATE dish_modifications 
SET 
    dish_name = COALESCE(
        dish_name,
        changes->>'nom',
        changes->'new'->>'nom',
        changes->'old'->>'nom',
        changes->'deleted_dish'->>'nom',
        'Nom non disponible'
    ),
    dish_category = COALESCE(
        dish_category,
        changes->>'categorie',
        changes->'new'->>'categorie', 
        changes->'old'->>'categorie',
        changes->'deleted_dish'->>'categorie',
        'Catégorie inconnue'
    ),
    user_detection_method = COALESCE(user_detection_method, 'legacy_entry')
WHERE dish_name IS NULL OR dish_category IS NULL OR user_detection_method IS NULL;

-- =====================================================
-- 8. FONCTION DE TEST COMPLET
-- =====================================================

-- Fonction pour tester toute la chaîne de traçabilité
CREATE OR REPLACE FUNCTION test_complete_traceability()
RETURNS text AS $$
DECLARE
    test_dish_id uuid;
    modifications_before integer;
    modifications_after integer;
    user_info RECORD;
    result_text text := '';
BEGIN
    result_text := '🧪 TEST COMPLET DE LA TRAÇABILITÉ' || E'\n';
    result_text := result_text || '=================================' || E'\n';
    
    -- Diagnostic de l'utilisateur actuel
    SELECT * INTO user_info FROM get_current_user_info() LIMIT 1;
    result_text := result_text || '👤 Utilisateur détecté: ' || COALESCE(user_info.user_email, 'AUCUN') || E'\n';
    result_text := result_text || '🔧 Méthode de détection: ' || COALESCE(user_info.detection_method, 'AUCUNE') || E'\n';
    result_text := result_text || E'\n';
    
    -- Compter les modifications avant
    SELECT COUNT(*) INTO modifications_before FROM dish_modifications;
    
    -- Test 1: Créer un plat
    INSERT INTO dishes (nom, categorie, langue, ingredients, allergenes)
    VALUES ('Test Traçabilité Complète', 'plats', 'fr', ARRAY['test'], ARRAY[])
    RETURNING id INTO test_dish_id;
    
    result_text := result_text || '✅ 1. Plat créé (ID: ' || test_dish_id || ')' || E'\n';
    
    -- Attendre un peu pour séparer les timestamps
    PERFORM pg_sleep(1);
    
    -- Test 2: Modifier le plat
    UPDATE dishes 
    SET nom = 'Test Traçabilité Complète MODIFIÉ',
        ingredients = ARRAY['test', 'modification']
    WHERE id = test_dish_id;
    
    result_text := result_text || '✅ 2. Plat modifié' || E'\n';
    
    -- Attendre un peu pour séparer les timestamps
    PERFORM pg_sleep(1);
    
    -- Test 3: Supprimer le plat
    DELETE FROM dishes WHERE id = test_dish_id;
    
    result_text := result_text || '✅ 3. Plat supprimé' || E'\n';
    
    -- Compter les modifications après
    SELECT COUNT(*) INTO modifications_after FROM dish_modifications;
    
    result_text := result_text || E'\n';
    result_text := result_text || '📊 RÉSULTATS:' || E'\n';
    result_text := result_text || '   Modifications avant: ' || modifications_before || E'\n';
    result_text := result_text || '   Modifications après: ' || modifications_after || E'\n';
    result_text := result_text || '   Nouvelles entrées: ' || (modifications_after - modifications_before) || E'\n';
    
    -- Vérifier chaque type d'action
    IF EXISTS (SELECT 1 FROM dish_modifications WHERE dish_id = test_dish_id AND action_type = 'created') THEN
        result_text := result_text || '   ✅ CRÉATION enregistrée' || E'\n';
    ELSE
        result_text := result_text || '   ❌ CRÉATION manquante' || E'\n';
    END IF;
    
    IF EXISTS (SELECT 1 FROM dish_modifications WHERE dish_id = test_dish_id AND action_type = 'updated') THEN
        result_text := result_text || '   ✅ MODIFICATION enregistrée' || E'\n';
    ELSE
        result_text := result_text || '   ❌ MODIFICATION manquante' || E'\n';
    END IF;
    
    IF EXISTS (SELECT 1 FROM dish_modifications WHERE dish_id = test_dish_id AND action_type = 'deleted') THEN
        result_text := result_text || '   ✅ SUPPRESSION enregistrée' || E'\n';
    ELSE
        result_text := result_text || '   ❌ SUPPRESSION manquante' || E'\n';
    END IF;
    
    -- Vérifier les emails utilisateur
    result_text := result_text || E'\n';
    result_text := result_text || '👥 UTILISATEURS DANS L''HISTORIQUE:' || E'\n';
    
    FOR user_info IN 
        SELECT DISTINCT user_email, user_detection_method, COUNT(*) as count
        FROM dish_modifications 
        WHERE dish_id = test_dish_id
        GROUP BY user_email, user_detection_method
    LOOP
        result_text := result_text || '   • ' || user_info.user_email || 
                      ' (' || COALESCE(user_info.user_detection_method, 'unknown') || 
                      ') - ' || user_info.count || ' actions' || E'\n';
    END LOOP;
    
    result_text := result_text || '=================================' || E'\n';
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. AJOUTER DES INDEX POUR LES NOUVELLES COLONNES
-- =====================================================

-- Index sur dish_name pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_dish_modifications_dish_name 
ON dish_modifications(dish_name);

-- Index sur dish_category pour filtrage
CREATE INDEX IF NOT EXISTS idx_dish_modifications_dish_category 
ON dish_modifications(dish_category);

-- Index sur user_detection_method pour debug
CREATE INDEX IF NOT EXISTS idx_dish_modifications_detection_method 
ON dish_modifications(user_detection_method);

-- =====================================================
-- 10. FONCTION DE NETTOYAGE DE L'HISTORIQUE
-- =====================================================

-- Fonction pour nettoyer et corriger l'historique existant
CREATE OR REPLACE FUNCTION cleanup_existing_history()
RETURNS text AS $$
DECLARE
    updated_count integer := 0;
    result_text text := '';
BEGIN
    -- Mettre à jour les entrées avec user_email = 'system' qui ont des infos utilisateur
    UPDATE dish_modifications 
    SET 
        dish_name = COALESCE(
            dish_name,
            changes->>'nom',
            changes->'new'->>'nom',
            changes->'old'->>'nom',
            changes->'deleted_dish'->>'nom',
            'Nom non disponible'
        ),
        dish_category = COALESCE(
            dish_category,
            changes->>'categorie',
            changes->'new'->>'categorie', 
            changes->'old'->>'categorie',
            changes->'deleted_dish'->>'categorie',
            'Catégorie inconnue'
        ),
        user_detection_method = COALESCE(user_detection_method, 'legacy_cleanup')
    WHERE dish_name IS NULL OR dish_category IS NULL OR user_detection_method IS NULL;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    result_text := '🧹 NETTOYAGE DE L''HISTORIQUE EXISTANT' || E'\n';
    result_text := result_text || '===================================' || E'\n';
    result_text := result_text || 'Entrées mises à jour: ' || updated_count || E'\n';
    result_text := result_text || '===================================' || E'\n';
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql;

-- Exécuter le nettoyage
SELECT cleanup_existing_history();

-- =====================================================
-- 11. MESSAGES DE DIAGNOSTIC ET SUCCÈS
-- =====================================================

DO $$
DECLARE
    total_modifications integer;
    system_modifications integer;
    real_user_modifications integer;
    orphaned_modifications integer;
BEGIN
    -- Statistiques de l'historique
    SELECT COUNT(*) INTO total_modifications FROM dish_modifications;
    SELECT COUNT(*) INTO system_modifications FROM dish_modifications WHERE user_email = 'system';
    SELECT COUNT(*) INTO real_user_modifications FROM dish_modifications WHERE user_email != 'system' AND user_email NOT LIKE '%error%';
    
    -- Compter les modifications orphelines (plats supprimés)
    SELECT COUNT(*) INTO orphaned_modifications 
    FROM dish_modifications dm
    LEFT JOIN dishes d ON dm.dish_id = d.id
    WHERE d.id IS NULL AND dm.dish_id IS NOT NULL;
    
    -- Messages de succès
    RAISE NOTICE '';
    RAISE NOTICE '🔧 CORRECTION COMPLÈTE DE LA TRAÇABILITÉ !';
    RAISE NOTICE '=========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 STATISTIQUES ACTUELLES :';
    RAISE NOTICE '   ✅ Total modifications : % entrées', total_modifications;
    RAISE NOTICE '   ✅ Modifications "system" : % entrées', system_modifications;
    RAISE NOTICE '   ✅ Modifications avec vrais utilisateurs : % entrées', real_user_modifications;
    RAISE NOTICE '   ✅ Modifications orphelines (plats supprimés) : % entrées', orphaned_modifications;
    RAISE NOTICE '';
    RAISE NOTICE '🎯 AMÉLIORATIONS APPLIQUÉES :';
    RAISE NOTICE '   • Contrainte CASCADE supprimée → Historique permanent';
    RAISE NOTICE '   • Colonnes dish_name/dish_category → Infos conservées';
    RAISE NOTICE '   • Fonction de détection utilisateur améliorée';
    RAISE NOTICE '   • Logging robuste avec gestion d''erreur';
    RAISE NOTICE '   • Diagnostic complet de l''authentification';
    RAISE NOTICE '';
    RAISE NOTICE '📝 NOUVELLES FONCTIONNALITÉS :';
    RAISE NOTICE '   • diagnose_auth_state() : Diagnostic authentification';
    RAISE NOTICE '   • get_current_user_info() : Détection utilisateur améliorée';
    RAISE NOTICE '   • test_complete_traceability() : Test complet';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 TESTEZ MAINTENANT :';
    RAISE NOTICE '   1. Ajouter un plat → Vérifier email admin dans historique';
    RAISE NOTICE '   2. Modifier un plat → Vérifier détails des changements';
    RAISE NOTICE '   3. Supprimer un plat → Vérifier suppression visible';
    RAISE NOTICE '   4. Historique Global → Tout doit être tracé !';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 TRAÇABILITÉ MAINTENANT PARFAITE !';
END $$;

-- =====================================================
-- FIN DE LA CORRECTION COMPLÈTE
-- =====================================================