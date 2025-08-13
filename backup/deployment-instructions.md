# 🚀 INSTRUCTIONS DE DÉPLOIEMENT COMPLÈTES
**Chuck Wagon Allergènes - Version 1.0.1**

## 📋 PRÉREQUIS

### **Comptes nécessaires**
- [ ] Compte Supabase (gratuit) - [supabase.com](https://supabase.com)
- [ ] Compte Netlify (gratuit) - [netlify.com](https://netlify.com)
- [ ] Compte GitHub (optionnel) - [github.com](https://github.com)

### **Outils requis**
- [ ] Node.js 18+ - [nodejs.org](https://nodejs.org)
- [ ] NPM (inclus avec Node.js)
- [ ] Git (optionnel) - [git-scm.com](https://git-scm.com)
- [ ] Éditeur de code (VS Code recommandé)

## 🗄️ ÉTAPE 1 : CONFIGURATION SUPABASE

### **1.1 Créer le projet Supabase**
1. Aller sur [supabase.com](https://supabase.com)
2. Cliquer "Start your project"
3. Se connecter avec GitHub/Google
4. Cliquer "New project"
5. Choisir :
   - **Name** : `chuck-wagon-allergenes`
   - **Database Password** : Générer un mot de passe fort
   - **Region** : Choisir la plus proche (Europe West pour la France)
6. Cliquer "Create new project"
7. **Attendre 2-3 minutes** que le projet soit prêt

### **1.2 Récupérer les clés API**
1. Dans le dashboard Supabase, aller dans **Settings** > **API**
2. Noter ces informations :
   ```
   Project URL: https://xxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### **1.3 Configurer la base de données**
1. Aller dans **SQL Editor**
2. Cliquer "New query"
3. **Copier-coller TOUT le contenu** du fichier `backup/database-schema-complete.sql`
4. Cliquer "Run" (▶️)
5. Vérifier qu'il n'y a pas d'erreurs
6. Aller dans **Table Editor** pour vérifier que les tables `dishes` et `dish_modifications` existent

### **1.4 Créer un utilisateur admin**
1. Aller dans **Authentication** > **Users**
2. Cliquer "Add user"
3. Remplir :
   - **Email** : `tomy.marie94@gmail.com` (ou votre email)
   - **Password** : Choisir un mot de passe fort
   - **Email Confirm** : ✅ Cocher (pour éviter la confirmation)
4. Cliquer "Create user"

### **1.5 Configurer le Storage (optionnel)**
1. Aller dans **Storage**
2. Cliquer "Create bucket"
3. Nom : `dish-images`
4. **Public bucket** : ✅ Cocher
5. Cliquer "Create bucket"

## ⚙️ ÉTAPE 2 : CONFIGURATION LOCALE

### **2.1 Préparer le projet**
```bash
# Créer le dossier du projet
mkdir chuck-wagon-allergenes
cd chuck-wagon-allergenes

# Initialiser le projet Vite + React + TypeScript
npm create vite@latest . -- --template react-ts

# Installer les dépendances de base
npm install

# Installer les dépendances spécifiques du projet
npm install @supabase/supabase-js@^2.53.0 react-router-dom@^7.7.1 lucide-react@^0.344.0 uuid@^11.1.0
npm install @types/react-router-dom@^5.3.3 @types/uuid@^10.0.0 --save-dev

# Installer Tailwind CSS
npm install tailwindcss@^3.4.1 autoprefixer@^10.4.18 postcss@^8.4.35 --save-dev
npx tailwindcss init -p
```

### **2.2 Copier les fichiers du backup**
Copier tous les fichiers de cette sauvegarde dans votre projet :

```
src/
├── components/ (tous les fichiers .tsx)
├── data/
├── hooks/
├── lib/
├── types/
├── utils/
├── App.tsx
├── main.tsx
└── index.css

public/
├── chuck-wagon-official-logo.png
└── (autres fichiers)

Configuration :
├── package.json (fusionner les dépendances)
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── tsconfig.app.json
```

### **2.3 Variables d'environnement**
Créer un fichier `.env` à la racine :
```env
VITE_SUPABASE_URL=https://votre-projet-id.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-publique
```

**⚠️ Remplacer par vos vraies valeurs Supabase !**

### **2.4 Test en local**
```bash
# Démarrer le serveur de développement
npm run dev

# Ouvrir http://localhost:5173
# Vérifier que l'application fonctionne
```

### **2.5 Vérifications**
- [ ] Page d'accueil s'affiche avec sélection des langues
- [ ] Navigation fonctionne (français → avertissement → menu)
- [ ] Connexion admin fonctionne avec votre email/mot de passe
- [ ] Interface admin s'affiche sans erreurs

## 🌐 ÉTAPE 3 : DÉPLOIEMENT NETLIFY

### **3.1 Préparer le build**
```bash
# Tester le build de production
npm run build

# Vérifier que le dossier 'dist' est créé
ls dist/

# Tester le build localement
npm run preview
```

### **3.2 Méthode A : Drag & Drop (Simple)**
1. Aller sur [netlify.com](https://netlify.com)
2. Se connecter avec GitHub/Google
3. Glisser-déposer le dossier `dist` sur la zone "Deploy"
4. Attendre le déploiement
5. Noter l'URL générée (ex: `https://amazing-name-123456.netlify.app`)

### **3.3 Méthode B : Git (Recommandée)**
```bash
# Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit - Chuck Wagon Allergènes"

# Pousser sur GitHub
git remote add origin https://github.com/votre-username/chuck-wagon-allergenes.git
git push -u origin main
```

1. Sur Netlify, cliquer "Add new site" > "Import an existing project"
2. Choisir "GitHub" et autoriser l'accès
3. Sélectionner votre repository `chuck-wagon-allergenes`
4. Configuration :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - **Node version** : 18
5. Cliquer "Deploy site"

### **3.4 Variables d'environnement Netlify**
1. Dans votre site Netlify, aller dans **Site settings** > **Environment variables**
2. Ajouter :
   ```
   VITE_SUPABASE_URL = https://votre-projet-id.supabase.co
   VITE_SUPABASE_ANON_KEY = votre-cle-anon-publique
   ```
3. Cliquer "Save"
4. **Redéployer** le site : **Deploys** > **Trigger deploy** > **Deploy site**

### **3.5 Configuration des redirections**
Créer le fichier `public/_redirects` :
```
/*    /index.html   200
```

Puis redéployer.

## ✅ ÉTAPE 4 : VÉRIFICATION POST-DÉPLOIEMENT

### **4.1 Tests fonctionnels**
- [ ] **Page d'accueil** : Sélection des langues fonctionne
- [ ] **Navigation** : Français → Avertissement → Menu
- [ ] **Recherche** : Recherche de plats fonctionne
- [ ] **Catégories** : Navigation par catégories
- [ ] **Détail plat** : Affichage ingrédients/allergènes
- [ ] **Administration** : Connexion avec votre email
- [ ] **CRUD** : Ajout/modification/suppression de plats
- [ ] **Responsive** : Test sur mobile/tablet

### **4.2 Tests de performance**
- [ ] **Temps de chargement** < 3 secondes
- [ ] **Images** s'affichent correctement
- [ ] **Pas d'erreurs** dans la console (F12)
- [ ] **Lighthouse score** > 80

### **4.3 Tests multilingues**
- [ ] **7 langues** disponibles sur la page d'accueil
- [ ] **Traductions** correctes dans chaque langue
- [ ] **Allergènes** traduits automatiquement
- [ ] **Navigation** cohérente dans toutes les langues

## 🍽️ ÉTAPE 5 : AJOUT DU CONTENU

### **5.1 Menu de base (optionnel)**
1. Se connecter à l'administration : `https://votre-site.netlify.app/administration`
2. Utiliser email/mot de passe créés dans Supabase
3. Cliquer "Réinitialiser menu complet" pour ajouter 80+ plats de base

### **5.2 Nouveau menu A2**
1. Dans l'interface admin, cliquer "Ajouter menu A2"
2. Confirmer l'ajout des 37 nouveaux plats
3. Vérifier que tous les plats sont ajoutés correctement

### **5.3 Ajout manuel de plats**
1. Cliquer "Ajouter un plat"
2. Remplir le formulaire :
   - **Nom** : Nom du plat
   - **Catégorie** : Choisir dans la liste
   - **Langue** : fr (français)
   - **Ingrédients** : Utiliser l'auto-complétion
   - **Allergènes** : Sélection multiple
   - **Image** : URL Pexels (optionnel)
3. Cliquer "Ajouter le plat"

## 🔧 ÉTAPE 6 : MAINTENANCE

### **6.1 Mise à jour du contenu**
- **Ajout de plats** : Interface admin
- **Modification** : Cliquer sur l'icône "Edit"
- **Suppression** : Cliquer sur l'icône "Delete"
- **Historique** : Bouton "Historique" pour voir les modifications

### **6.2 Mise à jour du code**
```bash
# Modifier le code localement
# Tester avec npm run dev
# Pousser sur GitHub
git add .
git commit -m "Description des modifications"
git push

# Netlify redéploie automatiquement
```

### **6.3 Sauvegarde des données**
1. **Supabase Dashboard** > **Settings** > **Database**
2. Cliquer "Backup" pour créer une sauvegarde
3. Télécharger le fichier SQL
4. Stocker en lieu sûr

## 🆘 DÉPANNAGE

### **Problèmes courants**

#### **"Supabase non configuré"**
- ✅ Vérifier les variables d'environnement
- ✅ URL doit finir par `.supabase.co`
- ✅ Clé API doit faire 100+ caractères
- ✅ Redéployer après modification des variables

#### **"Erreur d'authentification"**
- ✅ Vérifier que l'utilisateur existe dans Supabase Auth
- ✅ Tester email/mot de passe
- ✅ Vérifier que l'email est confirmé

#### **"Plats non visibles"**
- ✅ Vérifier que les plats ont la bonne langue (`fr`)
- ✅ Contrôler les politiques RLS dans Supabase
- ✅ Vérifier les contraintes de catégorie

#### **"Images ne s'affichent pas"**
- ✅ Utiliser des URLs Pexels valides
- ✅ Tester les URLs dans un navigateur
- ✅ Vérifier la configuration CORS

#### **"Build échoue"**
- ✅ Vérifier les erreurs TypeScript
- ✅ Installer toutes les dépendances
- ✅ Vérifier la version de Node.js (18+)

### **Logs et debugging**
- **Frontend** : Console navigateur (F12 > Console)
- **Backend** : Supabase Dashboard > Logs
- **Build** : Netlify Dashboard > Deploys > Deploy log
- **Network** : F12 > Network pour les requêtes API

## 📞 SUPPORT

### **Documentation officielle**
- [Supabase Docs](https://supabase.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### **Communautés**
- Supabase Discord
- Netlify Community
- Stack Overflow
- GitHub Issues

---

## 🎯 CHECKLIST FINALE

### **Avant de considérer le déploiement terminé :**

#### **Configuration**
- [ ] Projet Supabase créé et configuré
- [ ] Base de données avec tables `dishes` et `dish_modifications`
- [ ] RLS activé et politiques configurées
- [ ] Utilisateur admin créé
- [ ] Variables d'environnement configurées

#### **Code**
- [ ] Tous les fichiers copiés depuis le backup
- [ ] Dépendances installées (`npm install`)
- [ ] Build réussi (`npm run build`)
- [ ] Tests locaux OK (`npm run dev`)

#### **Déploiement**
- [ ] Site déployé sur Netlify
- [ ] Variables d'environnement configurées sur Netlify
- [ ] Redirections configurées (`_redirects`)
- [ ] URL personnalisée (optionnel)

#### **Tests**
- [ ] Navigation complète testée
- [ ] Administration fonctionnelle
- [ ] Ajout/modification/suppression de plats
- [ ] Multilingue (7 langues)
- [ ] Responsive (mobile/desktop)
- [ ] Performance acceptable

#### **Contenu**
- [ ] Menu de base ajouté (optionnel)
- [ ] Menu A2 ajouté (37 plats)
- [ ] Images fonctionnelles
- [ ] Traductions correctes

---

**🎉 FÉLICITATIONS !**

Votre application Chuck Wagon Allergènes est maintenant **100% opérationnelle** !

**🔗 URLs importantes :**
- **Site public** : `https://votre-site.netlify.app`
- **Administration** : `https://votre-site.netlify.app/administration`
- **Supabase Dashboard** : `https://app.supabase.com/project/votre-projet-id`

**🤠 Chuck Wagon Café - Prêt à servir !** 🍽️✨