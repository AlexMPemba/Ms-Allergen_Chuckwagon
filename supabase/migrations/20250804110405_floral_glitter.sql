/*
  # Création de la table des plats avec stockage photos

  1. Nouvelles Tables
    - `dishes`
      - `id` (uuid, primary key)
      - `nom` (text, nom du plat)
      - `categorie` (text, catégorie du plat)
      - `langue` (text, langue du plat)
      - `ingredients` (text[], liste des ingrédients)
      - `allergenes` (text[], liste des allergènes)
      - `image_url` (text, URL de l'image stockée)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Enable RLS sur la table `dishes`
    - Politique pour permettre la lecture publique
    - Politique pour permettre l'écriture aux utilisateurs authentifiés

  3. Stockage
    - Bucket `dish-images` pour stocker les photos
    - Politiques de sécurité pour l'upload et l'accès aux images
*/

-- Créer la table des plats
CREATE TABLE IF NOT EXISTS dishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  categorie text NOT NULL CHECK (categorie IN ('entrées', 'plats', 'desserts', 'sauces', 'huiles', 'salades', 'garnitures', 'fromages')),
  langue text NOT NULL CHECK (langue IN ('fr', 'en', 'es', 'pt', 'it')),
  ingredients text[] DEFAULT '{}',
  allergenes text[] DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture publique
CREATE POLICY "Lecture publique des plats"
  ON dishes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Politique pour l'écriture (création, modification, suppression)
CREATE POLICY "Gestion des plats pour les utilisateurs authentifiés"
  ON dishes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Créer le bucket pour les images
INSERT INTO storage.buckets (id, name, public)
VALUES ('dish-images', 'dish-images', true)
ON CONFLICT (id) DO NOTHING;

-- Politique pour l'upload d'images
CREATE POLICY "Upload d'images pour tous"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'dish-images');

-- Politique pour la lecture des images
CREATE POLICY "Lecture publique des images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'dish-images');

-- Politique pour la suppression des images
CREATE POLICY "Suppression des images pour les utilisateurs authentifiés"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'dish-images');

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_dishes_updated_at
  BEFORE UPDATE ON dishes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();