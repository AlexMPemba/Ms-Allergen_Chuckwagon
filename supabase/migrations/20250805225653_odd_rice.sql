/*
  # Ajouter l'allemand et le néerlandais aux langues supportées

  1. Modifications
    - Mise à jour de la contrainte de vérification pour inclure 'de' (allemand) et 'nl' (néerlandais)
    - Les langues supportées sont maintenant : fr, en, es, it, de, nl, pt

  2. Sécurité
    - Aucun changement aux politiques RLS existantes
    - La contrainte assure l'intégrité des données
*/

-- Supprimer l'ancienne contrainte de langue
ALTER TABLE dishes DROP CONSTRAINT IF EXISTS dishes_langue_check;

-- Ajouter la nouvelle contrainte avec l'allemand et le néerlandais
ALTER TABLE dishes ADD CONSTRAINT dishes_langue_check 
  CHECK (langue = ANY (ARRAY['fr'::text, 'en'::text, 'es'::text, 'it'::text, 'de'::text, 'nl'::text, 'pt'::text]));