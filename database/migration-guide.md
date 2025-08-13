# 🔄 GUIDE DE MIGRATION ET EXPORT

## 🎯 **Scénarios de migration**

Ce guide couvre tous les cas d'usage pour migrer ou exporter le projet Chuck Wagon Allergènes.

## 📋 **Scénario 1 : Duplicata sur même compte**

### **Objectif** : Créer une copie indépendante pour tests/développement

```bash
# 1. Dupliquer le code
git clone <repo-original> chuck-wagon-test
cd chuck-wagon-test

# 2. Nouveau projet Supabase
# - Nom : chuck-wagon-test
# - Même compte, projet différent

# 3. Exécuter schema.sql dans le nouveau projet

# 4. Nouvelles variables d'environnement
VITE_SUPABASE_URL=https://nouveau-projet.supabase.co
VITE_SUPABASE_ANON_KEY=nouvelle-cle

# 5. Test indépendant
npm run dev
```

## 📋 **Scénario 2 : Export vers autre compte**

### **Objectif** : Transférer le projet vers un autre compte Supabase

```bash
# 1. Exporter le code complet
zip -r chuck-wagon-export.zip . -x node_modules/\* .git/\*

# 2. Compte destinataire :
# - Créer nouveau projet Supabase
# - Exécuter schema.sql
# - Créer utilisateur admin

# 3. Configuration
# - Nouvelles variables d'environnement
# - Test de connexion

# 4. Migration des données (optionnel)
# - Export depuis ancien projet
# - Import dans nouveau projet
```

## 📋 **Scénario 3 : Sauvegarde complète**

### **Objectif** : Backup complet pour archivage/restauration

```bash
# 1. Backup du code
git archive --format=zip --output=chuck-wagon-backup.zip HEAD

# 2. Backup de la base de données
# Supabase Dashboard > Settings > Database > Backup
# Télécharger le dump SQL

# 3. Backup des images (si utilisées)
# Supabase Storage > dish-images > Download all

# 4. Documentation
# Inclure ce guide et les instructions
```

## 🗄️ **Migration des données**

### **Export depuis projet source** :
```sql
-- 1. Export des plats
COPY dishes TO '/tmp/dishes_export.csv' WITH CSV HEADER;

-- 2. Export de l'historique
COPY dish_modifications TO '/tmp/modifications_export.csv' WITH CSV HEADER;

-- 3. Export des utilisateurs (si nécessaire)
-- Via Supabase Dashboard > Authentication > Users > Export
```

### **Import vers projet destination** :
```sql
-- 1. Vider les tables (si nécessaire)
TRUNCATE dish_modifications, dishes CASCADE;

-- 2. Import des plats
COPY dishes FROM '/tmp/dishes_export.csv' WITH CSV HEADER;

-- 3. Import de l'historique
COPY dish_modifications FROM '/tmp/modifications_export.csv' WITH CSV HEADER;
```

## ⚙️ **Configuration post-migration**

### **1. Variables d'environnement** :
```env
# Ancien projet
VITE_SUPABASE_URL=https://ancien-projet.supabase.co
VITE_SUPABASE_ANON_KEY=ancienne-cle

# Nouveau projet
VITE_SUPABASE_URL=https://nouveau-projet.supabase.co
VITE_SUPABASE_ANON_KEY=nouvelle-cle
```

### **2. Utilisateurs admin** :
```bash
# Créer dans Authentication > Users
Email: admin@chuckwagon.com
Password: MotDePasseSecurise123!
Email Confirm: ✅ Activé
```

### **3. Test de fonctionnement** :
- [ ] Connexion à l'administration
- [ ] Ajout d'un plat de test
- [ ] Modification d'un plat
- [ ] Suppression d'un plat
- [ ] Vérification de l'historique
- [ ] Test multilingue
- [ ] Test responsive

## 🔒 **Sécurité lors de la migration**

### **Bonnes pratiques** :
1. **Nouvelles clés API** : Ne jamais réutiliser les anciennes
2. **Nouveaux mots de passe** : Changer tous les mots de passe admin
3. **Test d'isolation** : Vérifier que les projets sont indépendants
4. **Sauvegarde** : Toujours sauvegarder avant migration

### **Vérification d'isolation** :
```bash
# Test 1 : Ajouter un plat dans le projet A
# Vérifier qu'il n'apparaît PAS dans le projet B

# Test 2 : Modifier un utilisateur dans le projet A
# Vérifier qu'il n'est PAS affecté dans le projet B

# Test 3 : Supprimer des données dans le projet A
# Vérifier que le projet B reste intact
```

## 📊 **Checklist de migration**

### **Avant migration** :
- [ ] Backup complet du projet source
- [ ] Export des données importantes
- [ ] Documentation des configurations
- [ ] Test de l'application source

### **Pendant migration** :
- [ ] Nouveau projet Supabase créé
- [ ] Schema.sql exécuté sans erreurs
- [ ] Variables d'environnement configurées
- [ ] Utilisateur admin créé

### **Après migration** :
- [ ] Application démarre sans erreurs
- [ ] Connexion admin fonctionne
- [ ] CRUD des plats opérationnel
- [ ] Historique des modifications actif
- [ ] Interface multilingue fonctionnelle
- [ ] Tests sur différents navigateurs

## 🎯 **Résultats attendus**

### **Migration réussie** :
✅ **Projet indépendant** : Aucune dépendance avec l'original  
✅ **Base de données isolée** : Modifications sans impact mutuel  
✅ **Fonctionnalités complètes** : Toutes les features opérationnelles  
✅ **Sécurité maintenue** : RLS et authentification actifs  
✅ **Performance optimale** : Index et triggers fonctionnels  

### **En cas de problème** :
1. **Vérifier les logs** Supabase Dashboard > Logs
2. **Tester les requêtes** SQL Editor
3. **Contrôler les politiques** RLS
4. **Valider les variables** d'environnement
5. **Consulter ce guide** pour dépannage

**🚀 Votre migration sera un succès complet !**