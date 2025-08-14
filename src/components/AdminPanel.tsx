import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Search, 
  RefreshCw, 
  History, 
  AlertTriangle,
  Check,
  ChefHat,
  LogOut,
  RotateCcw,
  Upload
} from 'lucide-react';
import { useDishes } from '../hooks/useDishes';
import { supabase } from '../lib/supabase';
import { Dish, Category, Language } from '../types';
import { categories, allergenTranslations } from '../data/translations';
import { categoriesConfig, getSubcategoriesForCategory } from '../data/categories';
import IngredientInput from './IngredientInput';
import { updateDishImages, displayUpdateReport } from '../utils/updateDishImages';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { dishes, loading, error, addDish, updateDish, deleteDish, resetToDefault, addAdditionalItems, addCompleteMenu, refreshDishes } = useDishes();
  
  // États pour l'interface
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [editingDish, setEditingDish] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmA2, setShowConfirmA2] = useState(false);
  const [showConfirmComplete, setShowConfirmComplete] = useState(false);
  const [showConfirmImageUpdate, setShowConfirmImageUpdate] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [operationSuccess, setOperationSuccess] = useState<string | null>(null);

  // États pour le formulaire d'ajout
  const [newDish, setNewDish] = useState<Omit<Dish, 'id'>>({
    nom: '',
    categorie: 'plats',
    langue: 'fr',
    ingredients: [],
    allergenes: [],
    image: '',
    a_la_carte: true
  });

  // États pour l'édition
  const [editForm, setEditForm] = useState<Partial<Dish>>({});

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          console.log('Utilisateur non authentifié, redirection vers login');
          navigate('/administration');
          return;
        }
        
        console.log('✅ Utilisateur authentifié:', user.email);
      } catch (err) {
        console.error('Erreur lors de la vérification d\'authentification:', err);
        navigate('/administration');
      }
    };

    checkAuth();
  }, [navigate]);

  // Allergènes disponibles
  const availableAllergens = [
    'Gluten', 'Œufs', 'Lait', 'Fruits à coque', 'Arachides',
    'Soja', 'Poisson', 'Crustacés', 'Mollusques', 'Céleri',
    'Moutarde', 'Sésame', 'Sulfites', 'Lupin'
  ];

  // Catégories disponibles
  const categoryOptions: Category[] = [
    'Entrées', 'Plats', 'Desserts', 'Sauces', 
    'Accompagnements', 'Garniture', 'Fromages', 'Huiles',
    'Nutrisens', 'Halal', 'Casher', 'Boissons chaudes'
  ];

  // Filtrer les plats
  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = !searchQuery || 
      dish.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesCategory = selectedCategory === 'all' || dish.categorie === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Gérer la déconnexion
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/administration');
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };

  // Ajouter un plat
  const handleAddDish = async () => {
    if (!newDish.nom.trim()) {
      setOperationError('Le nom du plat est obligatoire');
      return;
    }

    // Validation de la sous-catégorie
    const validSubcategories = getSubcategoriesForCategory(newDish.categorie);
    if (validSubcategories && newDish.sous_categorie && !validSubcategories.includes(newDish.sous_categorie)) {
      setOperationError('Sous-catégorie invalide pour cette catégorie');
      return;
    }

    setOperationLoading(true);
    setOperationError(null);
    
    try {
      console.log('🔄 [ADD] Tentative d\'ajout du plat:', newDish);
      
      await addDish(newDish);
      
      console.log('✅ [ADD] Plat ajouté avec succès');
      setOperationSuccess('Plat ajouté avec succès !');
      
      // Réinitialiser le formulaire
      setNewDish({
        nom: '',
        categorie: 'Plats',
        langue: 'fr',
        ingredients: [],
        allergenes: [],
        image: '',
        sous_categorie: null,
        a_la_carte: true
      });
      setIsAddingDish(false);
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setOperationSuccess(null), 3000);
      
    } catch (err) {
      console.error('❌ [ADD] Erreur lors de l\'ajout:', err);
      setOperationError(`Erreur lors de l'ajout: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setOperationLoading(false);
    }
  };

  // Commencer l'édition d'un plat
  const startEditing = (dish: Dish) => {
    setEditingDish(dish.id);
    setEditForm({ ...dish });
    setOperationError(null);
  };

  // Sauvegarder les modifications
  const handleSaveEdit = async () => {
    if (!editingDish || !editForm.nom?.trim()) {
      setOperationError('Le nom du plat est obligatoire');
      return;
    }

    // Validation de la sous-catégorie pour l'édition
    if (editForm.categorie) {
      const validSubcategories = getSubcategoriesForCategory(editForm.categorie);
      if (validSubcategories && editForm.sous_categorie && !validSubcategories.includes(editForm.sous_categorie)) {
        setOperationError('Sous-catégorie invalide pour cette catégorie');
        return;
      }
    }

    // Confirmation pour les modifications importantes
    const originalDish = dishes.find(d => d.id === editingDish);
    if (originalDish) {
      const hasSignificantChanges = 
        editForm.nom !== originalDish.nom ||
        editForm.categorie !== originalDish.categorie ||
        editForm.sous_categorie !== originalDish.sous_categorie ||
        JSON.stringify(editForm.allergenes) !== JSON.stringify(originalDish.allergenes);
      
      if (hasSignificantChanges) {
        const confirmEdit = window.confirm(
          `📝 CONFIRMATION DE MODIFICATION\n\nVous allez modifier le plat :\n"${originalDish.nom}"\n\nNouvelles informations :\n• Nom : ${editForm.nom}\n• Catégorie : ${editForm.categorie}\n• Sous-catégorie : ${editForm.sous_categorie || 'Aucune'}\n• Allergènes : ${(editForm.allergenes || []).join(', ') || 'Aucun'}\n\nConfirmer les modifications ?`
        );
        
        if (!confirmEdit) {
          return;
        }
      }
    }

    setOperationLoading(true);
    setOperationError(null);
    
    try {
      console.log('🔄 [EDIT] Tentative de modification du plat:', editingDish, editForm);
      
      await updateDish(editingDish, editForm);
      
      console.log('✅ [EDIT] Plat modifié avec succès');
      setOperationSuccess('Plat modifié avec succès !');
      
      setEditingDish(null);
      setEditForm({});
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setOperationSuccess(null), 3000);
      
    } catch (err) {
      console.error('❌ [EDIT] Erreur lors de la modification:', err);
      setOperationError(`Erreur lors de la modification: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setOperationLoading(false);
    }
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingDish(null);
    setEditForm({});
    setOperationError(null);
  };

  // Supprimer un plat
  const handleDeleteDish = async (dishId: string, dishName: string) => {
    // Double confirmation pour la suppression
    const firstConfirm = window.confirm(
      `⚠️ ATTENTION ⚠️\n\nVous êtes sur le point de supprimer le plat :\n"${dishName}"\n\nCette action est irréversible.\n\nVoulez-vous continuer ?`
    );
    
    if (!firstConfirm) {
      return;
    }
    
    const secondConfirm = window.confirm(
      `🚨 CONFIRMATION FINALE 🚨\n\nDernière chance !\n\nSupprimer définitivement "${dishName}" ?\n\n✅ OUI = Supprimer\n❌ NON = Annuler`
    );
    
    if (!secondConfirm) {
      return;
    }

    setOperationLoading(true);
    setOperationError(null);
    
    try {
      console.log('🔄 [DELETE] Tentative de suppression du plat:', dishId, dishName);
      
      await deleteDish(dishId);
      
      console.log('✅ [DELETE] Plat supprimé avec succès');
      setOperationSuccess(`"${dishName}" supprimé avec succès !`);
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setOperationSuccess(null), 3000);
      
    } catch (err) {
      console.error('❌ [DELETE] Erreur lors de la suppression:', err);
      setOperationError(`Erreur lors de la suppression: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setOperationLoading(false);
    }
  };

  // Réinitialiser le menu complet
  const handleResetMenu = async () => {
    setOperationLoading(true);
    setOperationError(null);
    
    try {
      console.log('🔄 [RESET] Tentative de réinitialisation du menu complet');
      
      await resetToDefault();
      
      console.log('✅ [RESET] Menu réinitialisé avec succès');
      setOperationSuccess('Menu complet réinitialisé avec succès !');
      setShowConfirmReset(false);
      
      // Effacer le message de succès après 5 secondes
      setTimeout(() => setOperationSuccess(null), 5000);
      
    } catch (err) {
      console.error('❌ [RESET] Erreur lors de la réinitialisation:', err);
      setOperationError(`Erreur lors de la réinitialisation: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setOperationLoading(false);
    }
  };

  // Ajouter le menu A2
  const handleAddA2Menu = async () => {
    setOperationLoading(true);
    setOperationError(null);
    
    try {
      console.log('🔄 [A2] Tentative d\'ajout du menu A2');
      
      await addAdditionalItems();
      
      console.log('✅ [A2] Menu A2 ajouté avec succès');
      setOperationSuccess('Menu A2 ajouté avec succès ! (37 nouveaux plats)');
      setShowConfirmA2(false);
      
      // Effacer le message de succès après 5 secondes
      setTimeout(() => setOperationSuccess(null), 5000);
      
    } catch (err) {
      console.error('❌ [A2] Erreur lors de l\'ajout du menu A2:', err);
      setOperationError(`Erreur lors de l'ajout du menu A2: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setOperationLoading(false);
    }
  };

  // Ajouter le menu complet Chuck Wagon
  const handleAddCompleteMenu = async () => {
    setOperationLoading(true);
    setOperationError(null);
    
    try {
      console.log('🔄 [COMPLETE] Tentative d\'ajout du menu complet Chuck Wagon');
      
      await addCompleteMenu();
      
      console.log('✅ [COMPLETE] Menu complet Chuck Wagon ajouté avec succès');
      setOperationSuccess('Menu complet Chuck Wagon ajouté avec succès ! (120+ plats)');
      setShowConfirmComplete(false);
      
      // Effacer le message de succès après 5 secondes
      setTimeout(() => setOperationSuccess(null), 5000);
      
    } catch (err) {
      console.error('❌ [COMPLETE] Erreur lors de l\'ajout du menu complet:', err);
      setOperationError(`Erreur lors de l'ajout du menu complet: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setOperationLoading(false);
    }
  };

  // Mettre à jour les images des plats
  const handleUpdateImages = async () => {
    setOperationLoading(true);
    setOperationError(null);
    
    try {
      console.log('🖼️ [UPDATE] Début mise à jour des images des plats');
      
      const results = await updateDishImages();
      
      // Afficher le rapport détaillé dans la console
      displayUpdateReport(results);
      
      if (results.success) {
        console.log('✅ [UPDATE] Images mises à jour avec succès');
        setOperationSuccess(`Images mises à jour avec succès ! (${results.updated} plats mis à jour)`);
        
        // Rafraîchir la liste des plats
        await refreshDishes();
      } else {
        console.error('❌ [UPDATE] Erreurs lors de la mise à jour des images');
        setOperationError(`Mise à jour partielle: ${results.updated} plats mis à jour, ${results.errors.length} erreurs`);
      }
      
      setShowConfirmImageUpdate(false);
      
      // Effacer le message après 5 secondes
      setTimeout(() => {
        setOperationSuccess(null);
        setOperationError(null);
      }, 5000);
      
    } catch (err) {
      console.error('❌ [UPDATE] Erreur lors de la mise à jour des images:', err);
      setOperationError(`Erreur lors de la mise à jour des images: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setOperationLoading(false);
    }
  };

  // Basculer la sélection d'allergène
  const toggleAllergen = (allergen: string, isEditing: boolean = false) => {
    if (isEditing && editForm) {
      const currentAllergens = editForm.allergenes || [];
      const newAllergens = currentAllergens.includes(allergen)
        ? currentAllergens.filter(a => a !== allergen)
        : [...currentAllergens, allergen];
      
      setEditForm({ ...editForm, allergenes: newAllergens });
    } else {
      const currentAllergens = newDish.allergenes;
      const newAllergens = currentAllergens.includes(allergen)
        ? currentAllergens.filter(a => a !== allergen)
        : [...currentAllergens, allergen];
      
      setNewDish({ ...newDish, allergenes: newAllergens });
    }
  };

  return (
    <div className="min-h-screen western-bg page-transition">
      {/* Header */}
      <div className="western-card shadow-sm border-b-4 border-amber-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-6 w-6 text-amber-800" />
              <h1 className="text-xl md:text-2xl western-title">ADMINISTRATION</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                title="Retour à la sélection des langues"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Langues</span>
              </button>
              
              <button
                onClick={() => navigate('/admin/history')}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Historique Global</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Messages d'état */}
        {operationError && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-600 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-red-800 font-medium">{operationError}</p>
              <button
                onClick={() => setOperationError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {operationSuccess && (
          <div className="mb-6 p-4 bg-green-100 border-2 border-green-600 rounded-lg">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <p className="text-green-800 font-medium">{operationSuccess}</p>
              <button
                onClick={() => setOperationSuccess(null)}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Actions principales */}
        <div className="western-card rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setIsAddingDish(true)}
                disabled={operationLoading}
                className="flex items-center space-x-2 western-btn px-6 py-3 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter un plat</span>
              </button>
              
              <button
                onClick={refreshDishes}
                disabled={loading || operationLoading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setShowConfirmA2(true)}
                disabled={operationLoading}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                <span>Ajouter menu A2</span>
              </button>
              
              <button
                onClick={() => setShowConfirmComplete(true)}
                disabled={operationLoading}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                <span>Menu complet Chuck Wagon</span>
              </button>
              
              <button
                onClick={() => setShowConfirmImageUpdate(true)}
                disabled={operationLoading}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                <span>Mettre à jour images</span>
              </button>
              
              <button
                onClick={() => setShowConfirmReset(true)}
                disabled={operationLoading}
                className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Réinitialiser menu complet</span>
              </button>
            </div>
          </div>
        </div>

        {/* Actions rapides - Boutons masqués selon demande utilisateur */}
        {/* 
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          // Boutons masqués : Actualiser, Ajouter menu A2, Menu Complet Chuck Wagon, 
          // Mettre à jour images, Réinitialiser le menu complet
        </div>
        */}

        {/* Filtres */}
        <div className="western-card rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium western-subtitle mb-2">
                <Search className="h-4 w-4 inline mr-1" />
                Rechercher
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom du plat ou ingrédient..."
                className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium western-subtitle mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
                className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Toutes les catégories</option>
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>
                    {categories.fr[cat]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Total des plats : <strong>{dishes.length}</strong></span>
              <span className="text-green-600">
                Visibles : <strong>{dishes.filter(d => d.a_la_carte !== false).length}</strong>
              </span>
              <span className="text-red-600">
                Masqués : <strong>{dishes.filter(d => d.a_la_carte === false).length}</strong>
              </span>
            </div>
            <span>Résultats filtrés : <strong>{filteredDishes.length}</strong></span>
          </div>
        </div>

        {/* Formulaire d'ajout */}
        {isAddingDish && (
          <div className="western-card rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold western-subtitle">Ajouter un nouveau plat</h2>
              <button
                onClick={() => {
                  setIsAddingDish(false);
                  setOperationError(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium western-subtitle mb-2">
                  Nom du plat *
                </label>
                <input
                  type="text"
                  value={newDish.nom}
                  onChange={(e) => setNewDish({ ...newDish, nom: e.target.value })}
                  placeholder="Nom du plat"
                  className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium western-subtitle mb-2">
                  Visibilité
                </label>
                <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <input
                    type="checkbox"
                    id="editDish-a-la-carte"
                    checked={editingDish.a_la_carte !== false}
                    onChange={(e) => setEditingDish({ ...editingDish, a_la_carte: e.target.checked })}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
                  />
                  <label htmlFor="editDish-a-la-carte" className="text-sm western-subtitle cursor-pointer">
                    Actuellement à la carte
                  </label>
                  <span className="text-xs text-gray-600">
                    (visible dans le menu public)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium western-subtitle mb-2">
                  Catégorie *
                </label>
                <select
                  value={newDish.categorie}
                  onChange={(e) => {
                    const newCategory = e.target.value as Category;
                    setNewDish({ 
                      ...newDish, 
                      categorie: newCategory,
                      sous_categorie: null // Reset sous-catégorie quand on change de catégorie
                    });
                  }}
                  className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>
                      {categories.fr[cat]}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium western-subtitle mb-2">
                  Sous-catégorie
                </label>
                <select
                  value={newDish.sous_categorie || ''}
                  onChange={(e) => setNewDish({ ...newDish, sous_categorie: e.target.value || null })}
                  className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
                  disabled={!getSubcategoriesForCategory(newDish.categorie)}
                >
                  <option value="">Aucune sous-catégorie</option>
                  {getSubcategoriesForCategory(newDish.categorie)?.map(subcat => (
                    <option key={subcat} value={subcat}>
                      {subcat}
                    </option>
                  ))}
                </select>
                {!getSubcategoriesForCategory(newDish.categorie) && (
                  <p className="text-xs text-gray-500 mt-1">
                    Cette catégorie n'a pas de sous-catégories
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium western-subtitle mb-2">
                  Langue *
                </label>
                <select
                  value={newDish.langue}
                  onChange={(e) => setNewDish({ ...newDish, langue: e.target.value as Language })}
                  className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="it">Italiano</option>
                  <option value="de">Deutsch</option>
                  <option value="nl">Nederlands</option>
                  <option value="pt">Português</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium western-subtitle mb-2">
                  URL de l'image (optionnel)
                </label>
                <input
                  type="url"
                  value={newDish.image || ''}
                  onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                  placeholder="https://images.pexels.com/..."
                  className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium western-subtitle mb-2">
                  Visibilité
                </label>
                <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <input
                    type="checkbox"
                    id="newDish-a-la-carte"
                    checked={newDish.a_la_carte ?? true}
                    onChange={(e) => setNewDish({ ...newDish, a_la_carte: e.target.checked })}
                    className="w-4 h-4 text-amber-600 bg-amber-100 border-amber-300 rounded focus:ring-amber-500 focus:ring-2"
                  />
                  <label htmlFor="newDish-a-la-carte" className="text-sm western-subtitle cursor-pointer">
                    ✅ Actuellement à la carte (visible dans le menu)
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Décocher pour masquer ce plat du menu public
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium western-subtitle mb-2">
                Ingrédients
              </label>
              <IngredientInput
                value={newDish.ingredients}
                onChange={(ingredients) => setNewDish({ ...newDish, ingredients })}
                placeholder="Tapez pour rechercher un ingrédient..."
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium western-subtitle mb-2">
                Allergènes
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableAllergens.map(allergen => (
                  <button
                    key={allergen}
                    onClick={() => toggleAllergen(allergen)}
                    className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                      newDish.allergenes.includes(allergen)
                        ? 'bg-red-600 text-white border-2 border-red-700'
                        : 'bg-gray-200 text-gray-700 border-2 border-gray-300 hover:bg-gray-300'
                    }`}
                  >
                    {allergen}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsAddingDish(false);
                  setOperationError(null);
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddDish}
                disabled={operationLoading || !newDish.nom.trim()}
                className="flex items-center space-x-2 western-btn px-6 py-2 rounded-lg text-sm disabled:opacity-50"
              >
                {operationLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{operationLoading ? 'Ajout...' : 'Ajouter le plat'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Liste des plats */}
        <div className="western-card rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-amber-200 bg-amber-50">
            <h2 className="text-lg font-semibold western-subtitle">
              Gestion des plats ({filteredDishes.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-amber-600 mb-4">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto" />
              </div>
              <p className="western-subtitle">Chargement des plats...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-600 mb-4">
                <AlertTriangle className="h-8 w-8 mx-auto" />
              </div>
              <p className="text-red-600 text-lg mb-2">Erreur de connexion</p>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <button
                onClick={refreshDishes}
                className="western-btn px-4 py-2 rounded-lg text-sm"
              >
                Réessayer
              </button>
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg mb-4">Aucun plat trouvé</p>
              <button
                onClick={() => setIsAddingDish(true)}
                className="western-btn px-4 py-2 rounded-lg text-sm"
              >
                Ajouter le premier plat
              </button>
            </div>
          ) : (
            <div className="divide-y divide-amber-200">
              {filteredDishes.map((dish) => (
                <div key={dish.id} className="p-4 hover:bg-amber-50 transition-colors">
                  {editingDish === dish.id ? (
                    /* Mode édition */
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium western-subtitle mb-2">
                            Nom du plat *
                          </label>
                          <input
                            type="text"
                            value={editForm.nom || ''}
                            onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                            className="w-full p-2 western-input rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium western-subtitle mb-2">
                            Catégorie *
                          </label>
                          <select
                            value={editForm.categorie || dish.categorie}
                            onChange={(e) => setEditForm({ ...editForm, categorie: e.target.value as Category })}
                            className="w-full p-2 western-input rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                          >
                            {categoryOptions.map(cat => (
                              <option key={cat} value={cat}>
                                {categories.fr[cat]}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium western-subtitle mb-2">
                            Sous-catégorie
                          </label>
                          <select
                            value={editForm.sous_categorie || ''}
                            onChange={(e) => setEditForm({ ...editForm, sous_categorie: e.target.value || null })}
                            className="w-full p-2 western-input rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                          >
                            <option value="">Aucune sous-catégorie</option>
                            {getSubcategoriesForCategory(editForm.categorie || dish.categorie)?.map(subcat => (
                              <option key={subcat} value={subcat}>
                                {subcat}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium western-subtitle mb-2">
                            URL de l'image
                          </label>
                          <input
                            type="url"
                            value={editForm.image || ''}
                            onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                            className="w-full p-2 western-input rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium western-subtitle mb-2">
                          Ingrédients
                        </label>
                        <IngredientInput
                          value={editForm.ingredients || dish.ingredients}
                          onChange={(ingredients) => setEditForm({ ...editForm, ingredients })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium western-subtitle mb-2">
                          Allergènes
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                          {availableAllergens.map(allergen => (
                            <button
                              key={allergen}
                              onClick={() => toggleAllergen(allergen, true)}
                              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                                (editForm.allergenes || dish.allergenes).includes(allergen)
                                  ? 'bg-red-600 text-white border-2 border-red-700'
                                  : 'bg-gray-200 text-gray-700 border-2 border-gray-300 hover:bg-gray-300'
                              }`}
                            >
                              {allergen}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          disabled={operationLoading}
                          className="flex items-center space-x-2 western-btn px-6 py-2 rounded-lg text-sm disabled:opacity-50"
                        >
                          {operationLoading ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          <span>{operationLoading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Mode affichage */
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        {dish.image && (
                          <img
                            src={dish.image}
                            alt={dish.nom}
                            className="w-16 h-12 object-cover rounded border border-amber-600 flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-800 truncate">{dish.nom}</h3>
                            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-600 flex-shrink-0">
                              {categories.fr[dish.categorie]}
                              {dish.sous_categorie && (
                                <span className="ml-1 text-xs text-blue-600">• {dish.sous_categorie}</span>
                              )}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-1">
                            {dish.allergenes.slice(0, 3).map(allergen => (
                              <span
                                key={allergen}
                                className="text-xs px-1.5 py-0.5 bg-red-200 text-red-800 rounded-full border border-red-600"
                              >
                                {allergen}
                              </span>
                            ))}
                            {dish.allergenes.length > 3 && (
                              <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                                +{dish.allergenes.length - 3}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {dish.ingredients.slice(0, 3).join(', ')}
                            {dish.ingredients.length > 3 && '...'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => startEditing(dish)}
                          disabled={operationLoading}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDish(dish.id, dish.nom)}
                          disabled={operationLoading}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Confirmation ajout menu complet */}
        {showConfirmComplete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="western-card rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="bg-green-100 p-4 rounded-full border-2 border-green-800 flex items-center justify-center mx-auto w-fit mb-4">
                  <Upload className="h-8 w-8 text-green-800" />
                </div>
                <h2 className="text-xl western-title mb-2">Ajouter le menu complet Chuck Wagon</h2>
                <p className="western-subtitle text-sm">
                  Cette action va supprimer tous les plats existants et ajouter le menu complet Chuck Wagon (120+ plats avec sous-catégories).
                </p>
              </div>
              
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>ℹ️ Information :</strong> Tous les plats seront remplacés par le menu officiel Chuck Wagon avec toutes les catégories et sous-catégories.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmComplete(false)}
                  className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddCompleteMenu}
                  disabled={operationLoading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {operationLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span>{operationLoading ? 'Ajout...' : 'Ajouter 120+ plats'}</span>
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Confirmation réinitialisation menu */}
        {showConfirmReset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="western-card rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="bg-amber-100 p-4 rounded-full border-2 border-amber-800 flex items-center justify-center mx-auto w-fit mb-4">
                  <RotateCcw className="h-8 w-8 text-amber-800" />
                </div>
                <h2 className="text-xl western-title mb-2">Réinitialiser le menu complet</h2>
                <p className="western-subtitle text-sm">
                  Cette action va supprimer tous les plats existants et ajouter le menu complet Chuck Wagon (117 plats).
                </p>
              </div>
              
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>⚠️ Attention :</strong> Cette action est irréversible. Tous vos plats actuels seront supprimés.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleResetMenu}
                  disabled={operationLoading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {operationLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span>{operationLoading ? 'Réinitialisation...' : 'Confirmer'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation ajout menu A2 */}
        {showConfirmA2 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="western-card rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="bg-purple-100 p-4 rounded-full border-2 border-purple-800 flex items-center justify-center mx-auto w-fit mb-4">
                  <Upload className="h-8 w-8 text-purple-800" />
                </div>
                <h2 className="text-xl western-title mb-2">Ajouter le menu A2</h2>
                <p className="western-subtitle text-sm">
                  Cette action va ajouter 37 nouveaux plats du menu A2 (salades bar, barbecue, sauces, pains, desserts).
                </p>
              </div>
              
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>ℹ️ Information :</strong> Les plats seront ajoutés aux plats existants (pas de suppression).
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmA2(false)}
                  className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddA2Menu}
                  disabled={operationLoading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {operationLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span>{operationLoading ? 'Ajout...' : 'Ajouter 37 plats'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation mise à jour des images */}
        {showConfirmImageUpdate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="western-card rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="bg-indigo-100 p-4 rounded-full border-2 border-indigo-800 flex items-center justify-center mx-auto w-fit mb-4">
                  <Upload className="h-8 w-8 text-indigo-800" />
                </div>
                <h2 className="text-xl western-title mb-2">Mettre à jour les images des plats</h2>
                <p className="western-subtitle text-sm">
                  Cette action va mettre à jour les images des plats existants avec les nouvelles URLs fournies (environ 70 plats).
                </p>
              </div>
              
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>ℹ️ Information :</strong> Seuls les plats correspondants seront mis à jour. Les plats non trouvés seront ignorés.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmImageUpdate(false)}
                  className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateImages}
                  disabled={operationLoading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {operationLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span>{operationLoading ? 'Mise à jour...' : 'Mettre à jour'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}