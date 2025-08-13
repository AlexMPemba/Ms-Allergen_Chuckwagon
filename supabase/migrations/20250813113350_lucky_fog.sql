@@ .. @@
 -- Insérer quelques plats de test si la table est vide
 DO $$
 BEGIN
   IF NOT EXISTS (SELECT 1 FROM dishes LIMIT 1) THEN
     INSERT INTO dishes (nom, categorie, langue, ingredients, allergenes, image_url) VALUES
     ('Salade César', 'salades', 'fr', ARRAY['salade', 'parmesan', 'croûtons', 'sauce césar'], ARRAY['Lait', 'Gluten'], 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'),
-    ('Steak frites', 'plats', 'fr', ARRAY['bœuf', 'pommes de terre', 'huile'], ARRAY[], 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400'),
+    ('Steak frites', 'plats', 'fr', ARRAY['bœuf', 'pommes de terre', 'huile'], ARRAY[]::text[], 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400'),
     ('Tarte aux pommes', 'desserts', 'fr', ARRAY['pomme', 'pâte brisée', 'sucre', 'beurre'], ARRAY['Gluten', 'Lait'], 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400');