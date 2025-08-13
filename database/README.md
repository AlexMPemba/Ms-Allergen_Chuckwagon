# 🗄️ BASE DE DONNÉES CHUCK WAGON ALLERGÈNES

## 🎯 **Reconstruction automatique de la base de données**

Ce dossier contient tout le nécessaire pour reconstruire une base de données complètement fonctionnelle sur un nouveau projet Supabase.

## 📁 **Fichiers inclus**

### **`schema.sql`** - Schéma complet
- ✅ **Tables** : `dishes` et `dish_modifications`
- ✅ **Contraintes** : Validation des catégories et langues
- ✅ **Index** : Performance optimisée
- ✅ **RLS** : Row Level Security activé
- ✅ **Politiques** : Sécurité configurée
- ✅ **Triggers** : Logging automatique
- ✅ **Fonctions** : Utilitaires intégrées
- ✅ **Données de test** : 3 plats pour vérifier

## 🚀 **Instructions d'installation**

### **1. Nouveau projet Supabase**
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Attendre que le projet soit prêt (2-3 minutes)

### **2. Exécuter le schéma**
1. Aller dans **SQL Editor**
2. Cliquer **"New query"**
3. **Copier-coller TOUT** le contenu de `schema.sql`
4. Cliquer **"Run"** (▶️)
5. Vérifier qu'il n'y a pas d'erreurs

### **3. Créer un utilisateur admin**
1. Aller dans **Authentication** > **Users**
2. Cliquer **"Add user"**
3. Remplir :
   - **Email** : votre-email@example.com
   - **Password** : mot-de-passe-fort
   - **Email Confirm** : ✅ Cocher
4. Cliquer **"Create user"**

### **4. Configurer l'application**
```env
# .env
VITE_SUPABASE_URL=https://votre-nouveau-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-nouvelle-cle-anon
```

### **5. Tester l'installation**
1. Démarrer l'application : `npm run dev`
2. Se connecter à l'administration
3. Vérifier que les 3 plats de test s'affichent
4. Utiliser **"Réinitialiser menu complet"** pour ajouter tous les plats

## ✅ **Vérifications post-installation**

### **Tables créées** :
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- Résultat attendu : dishes, dish_modifications
```

### **RLS activé** :
```sql
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN ('dishes', 'dish_modifications');
-- Résultat attendu : rowsecurity = true pour les deux tables
```

### **Données de test** :
```sql
SELECT COUNT(*) FROM dishes;
-- Résultat attendu : 3 plats
```

## 🔧 **Fonctionnalités incluses**

### **🔒 Sécurité**
- **RLS activé** sur toutes les tables
- **Politiques** : Lecture publique, écriture authentifiée
- **Validation** : Contraintes sur catégories et langues
- **Historique** : Logging automatique des modifications

### **⚡ Performance**
- **Index** sur dish_id et created_at
- **Triggers optimisés** pour updated_at
- **Fonctions PL/pgSQL** efficaces

### **📊 Données**
- **8 catégories** : entrées, plats, desserts, etc.
- **7 langues** : fr, en, es, it, de, nl, pt
- **14 allergènes** : Gluten, Œufs, Lait, etc.
- **Historique complet** : Qui, quand, quoi

## 🆘 **Dépannage**

### **Erreur "relation already exists"**
```sql
-- Supprimer les tables existantes avant de relancer
DROP TABLE IF EXISTS dish_modifications CASCADE;
DROP TABLE IF EXISTS dishes CASCADE;
```

### **Erreur de permissions**
- Vérifier que vous êtes connecté comme propriétaire du projet
- Utiliser l'éditeur SQL de Supabase (pas un client externe)

### **RLS bloque les requêtes**
- Vérifier qu'un utilisateur est créé dans Authentication
- Tester la connexion dans l'application

## 🎯 **Résultat final**

Après installation, vous aurez :
- ✅ **Base de données complète** et sécurisée
- ✅ **Historique des modifications** fonctionnel
- ✅ **Utilisateur admin** prêt à utiliser
- ✅ **Application** entièrement fonctionnelle
- ✅ **Menu complet** (117 plats) disponible

**🚀 Votre duplicata/export sera 100% indépendant !**