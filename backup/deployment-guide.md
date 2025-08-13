# 🚀 GUIDE DE DÉPLOIEMENT
**Chuck Wagon Allergènes - Version 1.0.0**

## 📋 PRÉ-REQUIS

### **Comptes nécessaires**
- [ ] Compte Supabase (gratuit)
- [ ] Compte Netlify (gratuit) 
- [ ] Compte GitHub (optionnel)

### **Outils requis**
- [ ] Node.js 18+ installé
- [ ] NPM ou Yarn
- [ ] Git (optionnel)

## 🗄️ CONFIGURATION SUPABASE

### **1. Créer le projet Supabase**
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Choisir une région proche
4. Noter l'URL et la clé API

### **2. Configurer la base de données**
```sql
-- Copier et exécuter le contenu de backup/database-schema.sql
-- dans l'éditeur SQL de Supabase
```

### **3. Créer un utilisateur admin**
1. Aller dans Authentication > Users
2. Cliquer "Add user"
3. Entrer email et mot de passe
4. Confirmer l'utilisateur

### **4. Configurer le Storage (optionnel)**
1. Aller dans Storage
2. Créer un bucket "dish-images"
3. Rendre public si nécessaire

## ⚙️ CONFIGURATION LOCALE

### **1. Variables d'environnement**
Créer un fichier `.env` :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-publique
```

### **2. Installation des dépendances**
```bash
npm install
```

### **3. Test en local**
```bash
npm run dev
```

## 🌐 DÉPLOIEMENT NETLIFY

### **Méthode 1 : Drag & Drop**
1. Construire le projet :
   ```bash
   npm run build
   ```
2. Aller sur [netlify.com](https://netlify.com)
3. Glisser le dossier `dist` sur Netlify
4. Configurer les variables d'environnement

### **Méthode 2 : Git (recommandée)**
1. Pousser le code sur GitHub
2. Connecter le repo à Netlify
3. Configuration build :
   - **Build command :** `npm run build`
   - **Publish directory :** `dist`
4. Ajouter les variables d'environnement

### **3. Variables d'environnement Netlify**
Dans Site settings > Environment variables :
```
VITE_SUPABASE_URL = https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY = votre-cle-anon-publique
```

### **4. Configuration des redirections**
Créer `public/_redirects` :
```
/*    /index.html   200
```

## ✅ VÉRIFICATION POST-DÉPLOIEMENT

### **Tests fonctionnels**
- [ ] Page d'accueil charge correctement
- [ ] Sélection des langues fonctionne
- [ ] Navigation entre les pages
- [ ] Recherche et filtrage
- [ ] Affichage des détails de plats
- [ ] Connexion administration
- [ ] Ajout/modification de plats

### **Tests de performance**
- [ ] Temps de chargement < 3s
- [ ] Images s'affichent correctement
- [ ] Responsive sur mobile
- [ ] Pas d'erreurs console

## 🔧 MAINTENANCE

### **Ajout de contenu**
1. Se connecter à `/administration`
2. Utiliser l'interface d'ajout de plats
3. Vérifier l'affichage public

### **Mise à jour du code**
1. Modifier le code localement
2. Tester avec `npm run dev`
3. Pousser sur GitHub
4. Netlify redéploie automatiquement

### **Sauvegarde des données**
1. Exporter depuis Supabase Dashboard
2. Sauvegarder régulièrement
3. Tester la restauration

## 🆘 DÉPANNAGE

### **Problèmes courants**

#### **"Supabase non configuré"**
- Vérifier les variables d'environnement
- Vérifier l'URL Supabase (doit finir par .supabase.co)
- Vérifier la clé API

#### **"Erreur d'authentification"**
- Créer un utilisateur dans Supabase Auth
- Vérifier email/mot de passe
- Vérifier les politiques RLS

#### **"Plats non visibles"**
- Vérifier la langue des plats en base
- Vérifier les politiques RLS
- Vérifier les contraintes de catégorie

#### **"Images ne s'affichent pas"**
- Utiliser des URLs Pexels valides
- Vérifier la configuration CORS
- Tester les URLs manuellement

### **Logs et debugging**
- Console navigateur (F12)
- Supabase Dashboard > Logs
- Netlify Functions logs
- Network tab pour les requêtes

## 📞 SUPPORT

### **Documentation**
- [Supabase Docs](https://supabase.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [React Router Docs](https://reactrouter.com)

### **Communauté**
- Supabase Discord
- Netlify Community
- Stack Overflow

---

**🎯 Déploiement réussi = Application prête pour la production !**