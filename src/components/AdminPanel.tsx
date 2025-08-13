import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Check, Upload, Image, RefreshCw, LogIn, LogOut, User, Search, History, Clock, UserCheck, ChefHat, Settings, AlertTriangle } from 'lucide-react';
import { useDishes } from '../hooks/useDishes';
import { supabase, DishModification } from '../lib/supabase';
import IngredientInput from './IngredientInput';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { dishes, loading, error, addDish, updateDish, deleteDish, resetToDefault, addAdditionalItems, duplicateSaladsToEntrees, refreshDishes } = useDishes();
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [editingDish, setEditingDish] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<Dish>>({});
  const [viewingHistory, setViewingHistory] = useState<string | null>(null);
  const [dishHistory, setDishHistory] = useState<DishModification[]>([]);
  const [newDish, setNewDish] = useState<Partial<Dish>>({
    nom: '',
    categorie: 'plats',
    ingredients: [],
    allergenes: [],
    image: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // États pour le pop-up de confirmation
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    type: 'create' | 'update';
    data: any;
    originalData?: any;
    dishId?: string;
  } | null>(null);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState<string | false>(false);

  // Gestion des langues multiples
  const handleLanguageToggle = (language: string, isEditing = false, dishId?: string) => {
    if (isEditing && dishId) {
      // Pour l'édition d'un plat existant
      const currentLanguages = editingData.langues || [editingData.langue || 'fr'];
      const newLanguages = currentLanguages.includes(language)
        ? currentLanguages.filter(l => l !== language)
        : [...currentLanguages, language];
      
      // S'assurer qu'au moins une langue est sélectionnée
      if (newLanguages.length > 0) {
        setEditingData({ 
          ...editingData, 
          langues: newLanguages,
          langue: newLanguages[0] // Garder la première langue comme langue principale
        });
      }
    } else {
      // Pour l'ajout d'un nouveau plat
      const currentLanguages = newDish.langues || ['fr'];
      const newLanguages = currentLanguages.includes(language)
        ? currentLanguages.filter(l => l !== language)
        : [...currentLanguages, language];
      
      // S'assurer qu'au moins une langue est sélectionnée
      if (newLanguages.length > 0) {
        setNewDish({ 
          ...newDish, 
          langues: newLanguages,
          langue: newLanguages[0] // Garder la première langue comme langue principale
        });
      }
    }
  };
  // États d'authentification
  const [user, setUser] = useState<any>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);

  // Vérifier l'état d'authentification au chargement
  React.useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fonction de connexion
  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          showError('Email ou mot de passe incorrect. Vérifiez vos identifiants.');
        } else if (error.message.includes('Email not confirmed')) {
          showError('Email non confirmé. Vérifiez votre boîte mail.');
        } else {
          showError(`Erreur de connexion: ${error.message}`);
        }
        console.error('Erreur d\'authentification:', error);
        return;
      }
      
      setUser(data.user);
      showSuccess();
      setShowLoginForm(false);
      setLoginEmail('');
      setLoginPassword('');
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      showError('Erreur de connexion. Vérifiez votre configuration Supabase.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDuplicateSalads = async () => {
    if (window.confirm('Voulez-vous dupliquer tous les plats de la catégorie "salades" vers "entrées" ?')) {
      try {
        await duplicateSaladsToEntrees();
        alert('Duplication des salades vers entrées réussie !');
      } catch (error) {
        console.error('Erreur lors de la duplication:', error);
        alert('Erreur lors de la duplication des salades');
      }
    }
  };
  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      showSuccess();
    } catch (err) {
      showError('Erreur de déconnexion');
    }
  };

  const handleAllergenToggle = (allergen: string, isEditing = false) => {
    if (isEditing) {
      const currentAllergens = editingData.allergenes || [];
      const newAllergens = currentAllergens.includes(allergen)
        ? currentAllergens.filter(a => a !== allergen)
        : [...currentAllergens, allergen];
      setEditingData({ ...editingData, allergenes: newAllergens });
    } else {
      const currentAllergens = newDish.allergenes || [];
      const newAllergens = currentAllergens.includes(allergen)
        ? currentAllergens.filter(a => a !== allergen)
        : [...currentAllergens, allergen];
      setNewDish({ ...newDish, allergenes: newAllergens });
    }
  };

  const handleAddDish = async () => {
    if (!newDish.nom) return;
    
    // Préparer les données pour la confirmation
    const dishData = {
      nom: newDish.nom!,
      categorie: newDish.categorie as Category,
      langue: 'fr' as Language,
      ingredients: newDish.ingredients || [],
      allergenes: newDish.allergenes || [],
      image: newDish.image?.trim() || undefined
    };

    // Afficher le pop-up de confirmation
    setConfirmationData({
      type: 'create',
      data: dishData
    });
    setShowConfirmation(true);
  };

  const confirmAddDish = async () => {
    if (!confirmationData || confirmationData.type !== 'create') return;
    
    try {
      console.log('🍽️ Ajout du plat en français:', confirmationData.data);
      await addDish(confirmationData.data);
      
      console.log('✅ Plat ajouté avec succès');
      setNewDish({
        nom: '',
        categorie: 'plats',
        langue: 'fr', // Réinitialiser en français
        ingredients: [],
        allergenes: [],
        image: ''
      });
      setIsAddingDish(false);
      showSuccess();
      setShowConfirmation(false);
      setConfirmationData(null);
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      showError('Erreur lors de l\'ajout du plat');
    }
  };

  const handleDeleteDish = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      try {
        await deleteDish(id);
        showSuccess();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showError('Erreur lors de la suppression du plat');
      }
    }
  };

  const handleEditDish = (dish: Dish) => {
    setEditingDish(dish.id);
    setEditingData({
      nom: dish.nom,
      categorie: dish.categorie,
      langue: dish.langue,
      langues: [dish.langue], // Initialiser avec la langue actuelle
      ingredients: dish.ingredients,
      allergenes: dish.allergenes,
      image: dish.image
    });
  };

  const handleSaveEdit = async () => {
    if (!editingDish || !editingData.nom) return;
    
    // Récupérer les données originales
    const originalDish = dishes.find(d => d.id === editingDish);
    if (!originalDish) return;

    // Préparer les données pour la confirmation
    setConfirmationData({
      type: 'update',
      data: editingData,
      originalData: originalDish,
      dishId: editingDish
    });
    setShowConfirmation(true);
  };

  const confirmSaveEdit = async () => {
    if (!confirmationData || confirmationData.type !== 'update' || !confirmationData.dishId) return;
    
    try {
      console.log('💾 Tentative de sauvegarde:', editingDish, editingData);
      
      const updateData = {
        ...confirmationData.data,
        ingredients: editingData.ingredients || [],
        image: confirmationData.data.image?.trim() || undefined
      };
      console.log('📝 Données à sauvegarder:', updateData);
      await updateDish(confirmationData.dishId, updateData);
      setEditingDish(null);
      setEditingData({});
      showSuccess();
      setShowConfirmation(false);
      setConfirmationData(null);
      console.log('✅ Sauvegarde terminée avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      showError('Erreur lors de la mise à jour du plat');
    }
  };

  const handleCancelEdit = () => {
    setEditingDish(null);
    setEditingData({});
  };

  const cancelConfirmation = () => {
    setShowConfirmation(false);
    setConfirmationData(null);
  };

  const handleResetToDefault = async () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les plats aux valeurs par défaut ? Cette action est irréversible.')) {
      try {
        await resetToDefault();
        showSuccess();
      } catch (error) {
        console.error('Erreur lors de la réinitialisation:', error);
        showError('Erreur lors de la réinitialisation');
      }
    }
  };

  const showSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const showError = (message: string) => {
    setShowErrorMessage(message);
    setTimeout(() => setShowErrorMessage(false), 5000);
  };

  // Voir l'historique d'un plat
  const handleViewHistory = async (dishId: string) => {
    try {
      const history = await loadDishModifications(dishId);
      setDishHistory(history);
      setViewingHistory(dishId);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      showError('Erreur lors du chargement de l\'historique');
    }
  };

  // Fermer l'historique
  const handleCloseHistory = () => {
    setViewingHistory(null);
    setDishHistory([]);
  };

  // Formater les changements pour l'affichage
  const formatChanges = (changes: any, actionType: string) => {
    if (actionType === 'created') {
      return (
        <div className="text-sm text-green-700">
          <p><strong>Plat créé :</strong> {changes.nom}</p>
          <p><strong>Catégorie :</strong> {changes.categorie}</p>
          <p><strong>Langue :</strong> {changes.langue}</p>
        </div>
      );
    }

    if (actionType === 'deleted') {
      return (
        <div className="text-sm text-red-700">
          <p><strong>Plat supprimé :</strong> {changes.nom}</p>
        </div>
      );
    }

    if (actionType === 'updated') {
      return (
        <div className="text-sm space-y-1">
          {Object.entries(changes).map(([field, change]: [string, any]) => (
            <div key={field} className="border-l-2 border-blue-300 pl-2">
              <p className="font-medium text-blue-800 capitalize">{field} :</p>
              <p className="text-red-600">Ancien : {Array.isArray(change.old) ? change.old.join(', ') : change.old || 'Vide'}</p>
              <p className="text-green-600">Nouveau : {Array.isArray(change.new) ? change.new.join(', ') : change.new || 'Vide'}</p>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour extraire le nom du plat depuis les modifications
  const getDishNameFromModification = (mod: DishModification) => {
    console.log('🔍 [DISH_NAME] Analyse modification:', {
      id: mod.id,
      action_type: mod.action_type,
      changes: mod.changes,
      dish_id: mod.dish_id
    });

    // Pour les créations et suppressions, le nom est directement dans changes
    if (mod.action_type === 'created' || mod.action_type === 'deleted') {
      const name = mod.changes?.nom;
      console.log('🔍 [DISH_NAME] Nom pour', mod.action_type, ':', name);
      return name || 'Nom non disponible';
    }

    // Pour les modifications, chercher dans les changements
    if (mod.action_type === 'updated') {
      // Si le nom a été modifié, prendre la nouvelle valeur
      if (mod.changes?.nom?.new) {
        console.log('🔍 [DISH_NAME] Nom modifié (nouveau):', mod.changes.nom.new);
        return mod.changes.nom.new;
      }
      // Si le nom a été modifié, prendre l'ancienne valeur
      if (mod.changes?.nom?.old) {
        console.log('🔍 [DISH_NAME] Nom modifié (ancien):', mod.changes.nom.old);
        return mod.changes.nom.old;
      }
      
      // Sinon, chercher le nom du plat actuel dans la liste des plats
      const currentDish = dishes.find(d => d.id === mod.dish_id);
      if (currentDish) {
        console.log('🔍 [DISH_NAME] Nom trouvé dans plats actuels:', currentDish.nom);
        return currentDish.nom;
      }
      
      // Dernière tentative : chercher dans tous les champs de changes
      const allChanges = Object.values(mod.changes || {});
      for (const change of allChanges) {
        if (typeof change === 'object' && change?.old && typeof change.old === 'string') {
          // Peut-être que c'est le nom dans un autre champ
          console.log('🔍 [DISH_NAME] Tentative depuis autre champ:', change.old);
        }
      }
    }

    console.log('🔍 [DISH_NAME] Aucun nom trouvé, retour par défaut');
    return 'Nom non disponible';
  };

  // Liste des allergènes disponibles
  const availableAllergens = [
    'Gluten', 'Œufs', 'Lait', 'Fruits à coque', 'Arachides',
    'Soja', 'Poisson', 'Crustacés', 'Mollusques', 'Céleri',
    'Moutarde', 'Sésame', 'Sulfites', 'Lupin'
  ];

  const languages: Language[] = ['fr', 'en', 'es', 'it', 'de', 'nl', 'pt'];
  const categories: Category[] = ['entrées', 'plats', 'desserts', 'sauces', 'huiles', 'salades', 'garnitures', 'fromages'];

  // Filtrer les plats selon la recherche
  const filteredDishes = dishes.filter(dish => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      dish.nom.toLowerCase().includes(searchLower) ||
      dish.categorie.toLowerCase().includes(searchLower) ||
      dish.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchLower)) ||
      dish.allergenes.some(allergen => allergen.toLowerCase().includes(searchLower))
    );

    return matchesSearch;
  });

  return (
    <div className="min-h-screen western-bg">
      {/* Header */}
      <div className="western-card shadow-sm border-b-4 border-amber-800">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            {/* Titre centré sur mobile */}
            <div className="flex items-center justify-center sm:justify-start">
              <h1 className="text-xl sm:text-xl md:text-2xl western-title text-center">ADMINISTRATION</h1>
            </div>
            
            {/* Bouton retour */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center space-x-2 text-amber-800 hover:text-amber-900 transition-colors western-subtitle bg-amber-100 hover:bg-amber-200 px-3 py-2 rounded-lg border border-amber-300 sm:bg-transparent sm:border-0 sm:px-0 sm:py-0"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm">Retour</span>
            </button>
              
            {/* Statut d'authentification */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {user ? (
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <div className="flex items-center space-x-2 bg-green-100 border border-green-600 rounded-lg px-3 py-2 w-full sm:w-auto justify-center sm:justify-start">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    <span className="text-sm text-green-800 font-medium truncate max-w-48">{user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center space-x-1 text-amber-600 hover:text-amber-800 text-sm bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-lg border border-amber-300 w-full sm:w-auto sm:bg-transparent sm:border-0 sm:px-0 sm:py-0"
                  >
                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="flex items-center justify-center space-x-2 western-btn px-4 py-2 rounded-lg text-sm w-full sm:w-auto"
                >
                  <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Se connecter</span>
                </button>
              )}
              
              {loading && (
                <div className="flex items-center justify-center space-x-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-300 w-full sm:w-auto sm:bg-transparent sm:border-0">
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span className="text-sm">Chargement...</span>
                </div>
              )}
              {showSuccessMessage && (
                <div className="flex items-center justify-center space-x-2 bg-green-100 border border-green-600 rounded-lg px-3 py-2 w-full sm:w-auto">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <span className="text-sm text-green-800 font-medium">Sauvegardé !</span>
                </div>
              )}
              {showErrorMessage && (
                <div className="flex items-center justify-center space-x-2 bg-red-100 border border-red-600 rounded-lg px-3 py-2 w-full sm:w-auto">
                  <X className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                  <span className="text-sm text-red-800 font-medium truncate max-w-48">{showErrorMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:max-w-6xl sm:mx-auto sm:px-4 py-4 sm:py-8">
        {/* Formulaire de connexion */}
        {showLoginForm && !user && (
          <div className="western-card rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold western-subtitle">Connexion administrateur</h2>
              <button
                onClick={() => setShowLoginForm(false)}
                className="text-amber-600 hover:text-amber-800"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium western-subtitle mb-2">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500 text-base"
                  placeholder="votre@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium western-subtitle mb-2">Mot de passe</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500 text-base"
                  placeholder="Votre mot de passe"
                />
              </div>
            </div>
            
            <button
              onClick={handleLogin}
              disabled={isLoggingIn || !loginEmail || !loginPassword}
              className="w-full flex items-center justify-center space-x-2 western-btn px-6 py-3 rounded-lg transition-colors disabled:opacity-50 text-base"
            >
              {isLoggingIn ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              <span>{isLoggingIn ? 'Connexion...' : 'Se connecter'}</span>
            </button>
          </div>
        )}

        {/* Message si non connecté */}
        {!user && !showLoginForm && (
          <div className="western-card rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 text-center">
            <User className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold western-subtitle mb-3">Authentification requise</h2>
            <p className="text-base text-amber-700 mb-4">
              Vous devez être connecté pour accéder aux fonctions d'administration.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800 text-left">
              <p><strong>💡 Note :</strong> Vous devez d'abord créer un compte utilisateur dans votre tableau de bord Supabase :</p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Allez dans votre projet Supabase</li>
                <li>Section "Authentication" → "Users"</li>
                <li>Cliquez "Add user" pour créer un compte</li>
                <li>Utilisez ces identifiants pour vous connecter ici</li>
              </ol>
            </div>
            <button
              onClick={() => setShowLoginForm(true)}
              className="western-btn px-6 py-3 rounded-lg text-base w-full sm:w-auto"
            >
              Se connecter
            </button>
          </div>
        )}

        {user && (
          <>
            {/* Actions Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {!isAddingDish && (
                  <button
                    onClick={() => setIsAddingDish(true)}
                    className="flex items-center justify-center space-x-2 western-btn px-4 py-3 rounded-lg transition-colors text-base w-full sm:w-auto"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Ajouter un plat</span>
                  </button>
                )}
                <button
                  onClick={handleDuplicateSalads}
                  className="western-btn px-4 py-2 rounded-lg text-sm"
                >
                  Dupliquer salades → entrées
                </button>
                <button
                  onClick={() => navigate('/admin/history')}
                  className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors text-base border-2 border-purple-800 w-full sm:w-auto"
                >
                  <History className="h-5 w-5" />
                  <span>Historique global</span>
                </button>
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="western-card rounded-lg shadow-sm p-4 mb-4 sm:mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                <span className="text-sm font-medium western-subtitle">Recherche</span>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Rechercher un plat, ingrédient, allergène..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500 text-base"
                />
              </div>
            </div>

            {/* Formulaire d'ajout */}
            {isAddingDish && (
              <div className="western-card rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold western-subtitle">Ajouter un nouveau plat</h2>
                  <button
                    onClick={() => setIsAddingDish(false)}
                    className="text-amber-600 hover:text-amber-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium western-subtitle mb-2">Nom du plat</label>
                    <input
                      type="text"
                      value={newDish.nom}
                      onChange={(e) => setNewDish({ ...newDish, nom: e.target.value })}
                      className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500 text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium western-subtitle mb-2">Catégorie</label>
                    <select
                      value={newDish.categorie}
                      onChange={(e) => setNewDish({ ...newDish, categorie: e.target.value as Category })}
                      className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500 text-base"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="western-subtitle">{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium western-subtitle mb-2">Photo du plat</label>
                    <input
                      type="url"
                      value={newDish.image || ''}
                      onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                      placeholder="https://images.pexels.com/photos/..."
                      className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500 text-base"
                    />
                    {newDish.image && (
                      <div className="mt-2">
                        <img
                          src={newDish.image}
                          alt="Aperçu"
                          className="w-full max-w-xs h-32 object-cover rounded-lg border-2 border-amber-600 mx-auto"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium western-subtitle mb-2">Ingrédients</label>
                    <IngredientInput
                      value={newDish.ingredients || []}
                      onChange={(ingredients) => setNewDish({ ...newDish, ingredients })}
                      placeholder="Rechercher et ajouter des ingrédients..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium western-subtitle mb-2">Allergènes</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200 max-h-48 overflow-y-auto">
                      {availableAllergens.map(allergen => (
                        <label key={allergen} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-amber-100 rounded">
                          <input
                            type="checkbox"
                            checked={newDish.allergenes?.includes(allergen) || false}
                            onChange={() => handleAllergenToggle(allergen)}
                            className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                          />
                          <span className="text-sm western-subtitle">{allergen}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddDish}
                  className="w-full flex items-center justify-center space-x-2 western-btn px-6 py-3 rounded-lg transition-colors text-base"
                >
                  <Save className="h-4 w-4" />
                  <span>Sauvegarder</span>
                </button>
              </div>
            )}

            {/* Dishes List */}
            <div className="western-card rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-amber-200 bg-amber-50">
                <h2 className="text-lg font-semibold western-subtitle">
                  Liste des plats ({filteredDishes.length})
                </h2>
              </div>
              
              <div className="divide-y divide-amber-200 min-h-[70vh] max-h-[80vh] overflow-y-auto">
                {filteredDishes.map(dish => (
                  <div key={dish.id} className="p-4 hover:bg-amber-50 transition-colors">
                    {editingDish === dish.id ? (
                      // Mode édition
                      <div className="space-y-3">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium western-subtitle mb-2">Nom du plat</label>
                            <input
                              type="text"
                              value={editingData.nom || ''}
                              onChange={(e) => setEditingData({ ...editingData, nom: e.target.value })}
                              className="w-full p-2 western-input rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium western-subtitle mb-2">Catégorie</label>
                            <select
                              value={editingData.categorie || ''}
                              onChange={(e) => setEditingData({ ...editingData, categorie: e.target.value as Category })}
                              className="w-full p-2 western-input rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                            >
                              {categories.map(cat => (
                                <option key={cat} value={cat} className="western-subtitle">{cat}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium western-subtitle mb-2">Photo du plat</label>
                            <input
                              type="url"
                              value={editingData.image || ''}
                              onChange={(e) => setEditingData({ ...editingData, image: e.target.value })}
                              placeholder="https://images.pexels.com/photos/..."
                              className="w-full p-2 western-input rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                            />
                            {editingData.image && (
                              <div className="mt-2">
                                <img
                                  src={editingData.image}
                                  alt="Aperçu"
                                  className="w-full max-w-xs h-24 object-cover rounded-lg border-2 border-amber-600 mx-auto"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium western-subtitle mb-2">Ingrédients</label>
                            <IngredientInput
                              value={editingData.ingredients || []}
                              onChange={(ingredients) => setEditingData({ ...editingData, ingredients })}
                              placeholder="Rechercher et ajouter des ingrédients..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium western-subtitle mb-2">Allergènes</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 p-2 bg-amber-50 rounded-lg border border-amber-200 max-h-32 overflow-y-auto">
                              {availableAllergens.map(allergen => (
                                <label key={allergen} className="flex items-center space-x-1 cursor-pointer p-1 hover:bg-amber-100 rounded text-xs">
                                  <input
                                    type="checkbox"
                                    checked={editingData.allergenes?.includes(allergen) || false}
                                    onChange={() => handleAllergenToggle(allergen, true)}
                                    className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 w-3 h-3"
                                  />
                                  <span className="western-subtitle">{allergen}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2 pt-2 border-t border-amber-200">
                          <button
                            onClick={handleSaveEdit}
                            className="flex items-center justify-center space-x-1 western-btn px-3 py-2 rounded-lg transition-colors text-sm w-full sm:w-auto"
                          >
                            <Save className="h-3 w-3" />
                            <span>Sauvegarder</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center justify-center space-x-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors text-sm w-full sm:w-auto"
                          >
                            <X className="h-3 w-3" />
                            <span>Annuler</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Mode affichage
                      <div className="flex items-center space-x-4 hover:transform-none">
                        {/* Image miniature */}
                        <div className="flex-shrink-0">
                          {dish.image ? (
                            <img
                              src={dish.image}
                              alt={dish.nom}
                              className="w-16 h-12 object-cover rounded border border-amber-600"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-16 h-12 bg-amber-100 rounded border border-amber-600 flex items-center justify-center">
                              <span className="text-amber-600 text-xs">📷</span>
                            </div>
                          )}
                        </div>

                        {/* Informations principales */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-bold text-amber-900 truncate">{dish.nom}</h3>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium border border-amber-600 flex-shrink-0">
                              {dish.categorie}
                            </span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-600 flex-shrink-0">
                              {dish.langue}
                            </span>
                          </div>

                          {/* Ingrédients et allergènes en ligne */}
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            {dish.ingredients.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-600 font-medium">🥬</span>
                                <div className="flex flex-wrap gap-1">
                                  {dish.ingredients.slice(0, 4).map((ingredient, index) => (
                                    <span key={index} className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                                      {ingredient}
                                    </span>
                                  ))}
                                  {dish.ingredients.length > 4 && (
                                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                      +{dish.ingredients.length - 4}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {dish.allergenes.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <span className="text-red-600 font-medium">⚠️</span>
                                <div className="flex flex-wrap gap-1">
                                  {dish.allergenes.map((allergen, index) => (
                                    <span key={index} className="px-1.5 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                                      {allergen}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex flex-col sm:flex-row gap-1 hover:transform-none flex-shrink-0">
                          <button
                            onClick={() => handleViewHistory(dish.id)}
                            className="flex items-center justify-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1.5 rounded transition-colors text-xs hover:transform-none"
                            title="Voir l'historique"
                          >
                            <History className="h-3 w-3" />
                            <span className="hidden sm:inline">Historique</span>
                          </button>
                          <button
                            onClick={() => handleEditDish(dish)}
                            className="flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded transition-colors text-xs hover:transform-none"
                            title="Modifier"
                          >
                            <Edit className="h-3 w-3" />
                            <span className="hidden sm:inline">Modifier</span>
                          </button>
                          <button
                            onClick={() => handleDeleteDish(dish.id)}
                            className="flex items-center justify-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded transition-colors text-xs hover:transform-none"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="hidden sm:inline">Supprimer</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {filteredDishes.length === 0 && (
                  <div className="p-8 text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Aucun plat trouvé</p>
                    <p className="text-gray-400 text-sm mt-2">Essayez de modifier votre recherche</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal d'historique d'un plat */}
            {viewingHistory && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b bg-amber-50">
                    <h2 className="text-lg font-semibold western-subtitle flex items-center space-x-2">
                      <History className="h-5 w-5" />
                      <span>Historique des modifications</span>
                    </h2>
                    <button
                      onClick={handleCloseHistory}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                    {dishHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Aucune modification enregistrée pour ce plat</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {dishHistory.map((mod, index) => (
                          <div key={mod.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                              <div className="flex items-center space-x-3">
                                <div className={`w-4 h-4 rounded-full ${
                                  mod.action_type === 'created' ? 'bg-green-500' :
                                  mod.action_type === 'updated' ? 'bg-blue-500' : 'bg-red-500'
                                }`}></div>
                                <span className="font-medium text-sm sm:text-base">
                                  {mod.action_type === 'created' ? 'Création du plat' :
                                   mod.action_type === 'updated' ? 'Modification du plat' : 'Suppression du plat'}
                                </span>
                                <span className="text-xs text-gray-500">#{index + 1}</span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 text-xs sm:text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <UserCheck className="h-4 w-4" />
                                  <span className="truncate max-w-32 sm:max-w-none">{mod.user_email}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{formatDate(mod.created_at)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white p-3 rounded border text-sm">
                              {formatChanges(mod.changes, mod.action_type)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Pop-up de confirmation */}
            {showConfirmation && confirmationData && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b bg-amber-50">
                    <h2 className="text-lg font-semibold western-subtitle flex items-center space-x-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span>
                        {confirmationData.type === 'create' ? 'Confirmer la création du plat' : 'Confirmer la modification du plat'}
                      </span>
                    </h2>
                    <button
                      onClick={cancelConfirmation}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
                    {confirmationData.type === 'create' ? (
                      // Affichage pour création
                      <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center space-x-2">
                            <Plus className="h-5 w-5" />
                            <span>Nouveau plat à créer</span>
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-green-700 mb-1">Nom</label>
                              <p className="text-green-900 font-semibold bg-green-100 p-2 rounded border">
                                {confirmationData.data.nom}
                              </p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-green-700 mb-1">Catégorie</label>
                              <p className="text-green-900 bg-green-100 p-2 rounded border">
                                {confirmationData.data.categorie}
                              </p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-green-700 mb-1">Langue</label>
                              <p className="text-green-900 bg-green-100 p-2 rounded border">
                                {confirmationData.data.langue}
                              </p>
                            </div>
                            
                            {confirmationData.data.image && (
                              <div>
                                <label className="block text-sm font-medium text-green-700 mb-1">Image</label>
                                <div className="bg-green-100 p-2 rounded border">
                                  <img
                                    src={confirmationData.data.image}
                                    alt="Aperçu"
                                    className="w-20 h-16 object-cover rounded border"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-green-700 mb-1">
                              Ingrédients ({confirmationData.data.ingredients.length})
                            </label>
                            <div className="bg-green-100 p-2 rounded border max-h-24 overflow-y-auto">
                              {confirmationData.data.ingredients.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {confirmationData.data.ingredients.map((ingredient: string, index: number) => (
                                    <span key={index} className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded-full">
                                      {ingredient}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-green-600 text-sm italic">Aucun ingrédient</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-green-700 mb-1">
                              Allergènes ({confirmationData.data.allergenes.length})
                            </label>
                            <div className="bg-green-100 p-2 rounded border">
                              {confirmationData.data.allergenes.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {confirmationData.data.allergenes.map((allergen: string, index: number) => (
                                    <span key={index} className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded-full border border-red-400">
                                      {allergen}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-green-600 text-sm italic">Aucun allergène</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Affichage pour modification
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                            <Edit className="h-5 w-5" />
                            <span>Modifications à appliquer</span>
                          </h3>
                          
                          {/* Comparaison des changements */}
                          {Object.keys(confirmationData.data).map((field) => {
                            const oldValue = confirmationData.originalData?.[field];
                            const newValue = confirmationData.data[field];
                            
                            // Vérifier s'il y a un changement
                            const hasChanged = Array.isArray(oldValue) && Array.isArray(newValue)
                              ? JSON.stringify(oldValue.sort()) !== JSON.stringify(newValue.sort())
                              : oldValue !== newValue;
                            
                            if (!hasChanged) return null;
                            
                            return (
                              <div key={field} className="border-l-4 border-blue-400 pl-4 mb-4">
                                <h4 className="font-medium text-blue-800 capitalize mb-2">{field}</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-xs font-medium text-red-600 mb-1">Ancien</label>
                                    <div className="bg-red-100 p-2 rounded border text-sm">
                                      {Array.isArray(oldValue) ? (
                                        oldValue.length > 0 ? (
                                          <div className="flex flex-wrap gap-1">
                                            {oldValue.map((item, index) => (
                                              <span key={index} className="text-xs px-1.5 py-0.5 bg-red-200 text-red-800 rounded">
                                                {item}
                                              </span>
                                            ))}
                                          </div>
                                        ) : (
                                          <span className="text-red-600 italic">Vide</span>
                                        )
                                      ) : (
                                        <span className="text-red-800">{oldValue || 'Vide'}</span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="block text-xs font-medium text-green-600 mb-1">Nouveau</label>
                                    <div className="bg-green-100 p-2 rounded border text-sm">
                                      {Array.isArray(newValue) ? (
                                        newValue.length > 0 ? (
                                          <div className="flex flex-wrap gap-1">
                                            {newValue.map((item, index) => (
                                              <span key={index} className="text-xs px-1.5 py-0.5 bg-green-200 text-green-800 rounded">
                                                {item}
                                              </span>
                                            ))}
                                          </div>
                                        ) : (
                                          <span className="text-green-600 italic">Vide</span>
                                        )
                                      ) : (
                                        <span className="text-green-800">{newValue || 'Vide'}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-1">Confirmation requise</h4>
                          <p className="text-sm text-yellow-700">
                            {confirmationData.type === 'create' 
                              ? 'Êtes-vous sûr de vouloir créer ce nouveau plat avec les informations ci-dessus ?'
                              : 'Êtes-vous sûr de vouloir appliquer ces modifications au plat ?'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 border-t bg-gray-50">
                    <button
                      onClick={cancelConfirmation}
                      className="flex items-center justify-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors text-sm w-full sm:w-auto"
                    >
                      <X className="h-4 w-4" />
                      <span>Annuler</span>
                    </button>
                    <button
                      onClick={confirmationData.type === 'create' ? confirmAddDish : confirmSaveEdit}
                      className="flex items-center justify-center space-x-2 western-btn px-6 py-3 rounded-lg transition-colors text-sm w-full sm:w-auto"
                    >
                      <Check className="h-4 w-4" />
                      <span>
                        {confirmationData.type === 'create' ? 'Créer le plat' : 'Appliquer les modifications'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}