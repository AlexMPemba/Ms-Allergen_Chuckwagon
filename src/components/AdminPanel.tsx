import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  History, 
  LogOut, 
  ChefHat, 
  Search, 
  X, 
  Save, 
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { useDishes } from '../hooks/useDishes';
import { supabase } from '../lib/supabase';
import { Dish } from '../types';
import IngredientInput from './IngredientInput';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { dishes, loading, addDish, updateDish, deleteDish, refreshDishes } = useDishes();
  
  // États pour les modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  
  // États pour les formulaires
  const [newDish, setNewDish] = useState({
    nom: '',
    categorie: 'Plats' as const,
    sous_categorie: '',
    langue: 'fr' as const,
    ingredients: [] as string[],
    allergenes: [] as string[],
    image: '',
    a_la_carte: true
  });
  
  // États pour la recherche et filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // États pour les actions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Allergènes disponibles
  const availableAllergens = [
    'Gluten', 'Œufs', 'Lait', 'Fruits à coque', 'Arachides', 'Soja',
    'Poisson', 'Crustacés', 'Mollusques', 'Céleri', 'Moutarde', 'Sésame', 'Sulfites', 'Lupin'
  ];

  // Catégories disponibles
  const availableCategories = [
    'Entrées', 'Plats', 'Desserts', 'Sauces', 'Accompagnements', 
    'Garniture', 'Fromages', 'Huiles', 'Nutrisens', 'Halal', 'Casher', 'Boissons chaudes'
  ];

  // Fonction pour basculer la visibilité d'un plat
  const toggleDishVisibility = async (dishId: string) => {
    try {
      setActionLoading(dishId);
      const dish = dishes.find(d => d.id === dishId);
      if (!dish) return;

      const newVisibility = !dish.a_la_carte;
      await updateDish(dishId, { a_la_carte: newVisibility });
      
      console.log(`Visibilité du plat "${dish.nom}" basculée vers: ${newVisibility ? 'Visible' : 'Masqué'}`);
    } catch (error) {
      console.error('Erreur lors du basculement de visibilité:', error);
      alert('Erreur lors de la modification de la visibilité');
    } finally {
      setActionLoading(null);
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

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

  // Statistiques
  const totalDishes = dishes.length;
  const visibleDishes = dishes.filter(d => d.a_la_carte !== false).length;
  const hiddenDishes = dishes.filter(d => d.a_la_carte === false).length;

  // Ajouter un plat
  const handleAddDish = async () => {
    try {
      setIsSubmitting(true);
      
      if (!newDish.nom.trim()) {
        alert('Le nom du plat est requis');
        return;
      }

      await addDish({
        nom: newDish.nom.trim(),
        categorie: newDish.categorie,
        sous_categorie: newDish.sous_categorie || null,
        langue: newDish.langue,
        ingredients: newDish.ingredients,
        allergenes: newDish.allergenes,
        image: newDish.image || undefined,
        a_la_carte: newDish.a_la_carte
      });

      // Réinitialiser le formulaire
      setNewDish({
        nom: '',
        categorie: 'Plats',
        sous_categorie: '',
        langue: 'fr',
        ingredients: [],
        allergenes: [],
        image: '',
        a_la_carte: true
      });
      
      setShowAddModal(false);
      alert('Plat ajouté avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout du plat');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modifier un plat
  const handleEditDish = async () => {
    try {
      if (!editingDish) return;
      
      setIsSubmitting(true);
      
      await updateDish(editingDish.id, {
        nom: editingDish.nom,
        categorie: editingDish.categorie,
        sous_categorie: editingDish.sous_categorie,
        langue: editingDish.langue,
        ingredients: editingDish.ingredients,
        allergenes: editingDish.allergenes,
        image: editingDish.image,
        a_la_carte: editingDish.a_la_carte
      });

      setShowEditModal(false);
      setEditingDish(null);
      alert('Plat modifié avec succès !');
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert('Erreur lors de la modification du plat');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Supprimer un plat
  const handleDeleteDish = async (dishId: string) => {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return;

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${dish.nom}" ?\n\nCette action est irréversible.`)) {
      try {
        setActionLoading(dishId);
        await deleteDish(dishId);
        alert('Plat supprimé avec succès !');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du plat');
      } finally {
        setActionLoading(null);
      }
    }
  };

  // Ouvrir le modal d'édition
  const openEditModal = (dish: Dish) => {
    setEditingDish({
      ...dish,
      a_la_carte: dish.a_la_carte ?? true
    });
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen western-bg page-transition">
      {/* Header */}
      <div className="western-card shadow-sm border-b-4 border-amber-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-amber-800 hover:text-amber-900 transition-colors western-subtitle"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour au menu</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <ChefHat className="h-6 w-6 text-amber-800" />
              <h1 className="text-xl md:text-2xl western-title">ADMINISTRATION</h1>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 western-btn px-4 py-2 rounded-lg text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="western-card rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">{totalDishes}</div>
            <div className="text-sm western-subtitle">Total des plats</div>
          </div>
          <div className="western-card rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{visibleDishes}</div>
            <div className="text-sm western-subtitle">Plats visibles</div>
          </div>
          <div className="western-card rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{hiddenDishes}</div>
            <div className="text-sm western-subtitle">Plats masqués</div>
          </div>
        </div>

        {/* Actions principales */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 western-btn px-6 py-3 rounded-lg text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter un plat</span>
          </button>

          <button
            onClick={() => navigate('/admin/history')}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            <History className="h-4 w-4" />
            <span>Historique Global</span>
          </button>
        </div>

        {/* Filtres et recherche */}
        <div className="western-card rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium western-subtitle mb-2">
                <Search className="h-4 w-4 inline mr-1" />
                Rechercher un plat
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
                Filtrer par catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Toutes les catégories</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Liste des plats */}
        <div className="western-card rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-amber-200 bg-amber-50">
            <h2 className="text-lg font-semibold western-subtitle">
              Liste des plats ({filteredDishes.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-100 border-b-2 border-amber-600">
                <tr>
                  <th className="text-left p-3 western-subtitle text-sm">Nom</th>
                  <th className="text-left p-3 western-subtitle text-sm">Catégorie</th>
                  <th className="text-left p-3 western-subtitle text-sm">Allergènes</th>
                  <th className="text-center p-3 western-subtitle text-sm">Visibilité</th>
                  <th className="text-center p-3 western-subtitle text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center">
                      <div className="text-amber-600 mb-4">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto" />
                      </div>
                      <p className="western-subtitle">Chargement des plats...</p>
                    </td>
                  </tr>
                ) : filteredDishes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center">
                      <p className="text-gray-500 text-lg">Aucun plat trouvé</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {searchQuery || selectedCategory !== 'all' 
                          ? 'Essayez de modifier vos filtres de recherche'
                          : 'Commencez par ajouter votre premier plat'
                        }
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredDishes.map((dish) => (
                    <tr key={dish.id} className="hover:bg-amber-50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          {dish.image && (
                            <img
                              src={dish.image}
                              alt={dish.nom}
                              className="w-12 h-8 object-cover rounded border border-amber-600"
                            />
                          )}
                          <div>
                            <div className="font-medium menu-text">{dish.nom}</div>
                            {dish.sous_categorie && (
                              <div className="text-xs text-blue-600">{dish.sous_categorie}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-600">
                          {dish.categorie}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {dish.allergenes.length > 0 ? (
                            dish.allergenes.slice(0, 3).map(allergen => (
                              <span
                                key={allergen}
                                className="text-xs px-1.5 py-0.5 bg-red-200 text-red-800 rounded-full border border-red-600"
                              >
                                {allergen}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500 italic">Aucun</span>
                          )}
                          {dish.allergenes.length > 3 && (
                            <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                              +{dish.allergenes.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleDishVisibility(dish.id)}
                          disabled={actionLoading === dish.id}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 mx-auto ${
                            dish.a_la_carte !== false
                              ? 'bg-green-100 text-green-800 border border-green-600 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 border border-red-600 hover:bg-red-200'
                          } ${actionLoading === dish.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {actionLoading === dish.id ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : dish.a_la_carte !== false ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}
                          <span>
                            {actionLoading === dish.id 
                              ? 'Chargement...'
                              : dish.a_la_carte !== false 
                                ? 'Visible' 
                                : 'Masqué'
                            }
                          </span>
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openEditModal(dish)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDish(dish.id)}
                            disabled={actionLoading === dish.id}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Supprimer"
                          >
                            {actionLoading === dish.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="western-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl western-title">Ajouter un nouveau plat</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-amber-600 hover:text-amber-800 p-2 hover:bg-amber-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Nom du plat */}
                <div>
                  <label className="block text-sm font-medium western-subtitle mb-2">
                    Nom du plat *
                  </label>
                  <input
                    type="text"
                    value={newDish.nom}
                    onChange={(e) => setNewDish(prev => ({ ...prev, nom: e.target.value }))}
                    className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Ex: Salade César"
                  />
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium western-subtitle mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={newDish.categorie}
                    onChange={(e) => setNewDish(prev => ({ ...prev, categorie: e.target.value as any }))}
                    className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Sous-catégorie */}
                <div>
                  <label className="block text-sm font-medium western-subtitle mb-2">
                    Sous-catégorie (optionnel)
                  </label>
                  <select
                    value={newDish.sous_categorie}
                    onChange={(e) => setNewDish(prev => ({ ...prev, sous_categorie: e.target.value }))}
                    className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Aucune sous-catégorie</option>
                    {/* Sous-catégories pour Entrées */}
                    <optgroup label="Entrées">
                      <option value="Bar à Salades">Bar à Salades</option>
                      <option value="Charcuterie">Charcuterie</option>
                      <option value="Produits de la mer">Produits de la mer</option>
                      <option value="Soupes">Soupes</option>
                      <option value="Assortiment de graines et fruits secs">Assortiment de graines et fruits secs</option>
                      <option value="Salades Composées">Salades Composées</option>
                    </optgroup>
                    {/* Sous-catégories pour Desserts */}
                    <optgroup label="Desserts">
                      <option value="Desserts fruités">Desserts fruités</option>
                      <option value="Glaces">Glaces</option>
                      <option value="Gâteau d'anniversaire">Gâteau d'anniversaire</option>
                    </optgroup>
                    {/* Sous-catégories pour Sauces */}
                    <optgroup label="Sauces">
                      <option value="Sauces condiment">Sauces condiment</option>
                      <option value="Sauces salade">Sauces salade</option>
                    </optgroup>
                  </select>
                </div>

                {/* Ingrédients */}
                <div>
                  <label className="block text-sm font-medium western-subtitle mb-2">
                    Ingrédients
                  </label>
                  <IngredientInput
                    value={newDish.ingredients}
                    onChange={(ingredients) => setNewDish(prev => ({ ...prev, ingredients }))}
                    placeholder="Rechercher et ajouter des ingrédients..."
                  />
                </div>

                {/* Allergènes */}
                <div>
                  <label className="block text-sm font-medium western-subtitle mb-2">
                    Allergènes
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableAllergens.map(allergen => (
                      <label key={allergen} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newDish.allergenes.includes(allergen)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewDish(prev => ({ ...prev, allergenes: [...prev.allergenes, allergen] }));
                            } else {
                              setNewDish(prev => ({ ...prev, allergenes: prev.allergenes.filter(a => a !== allergen) }));
                            }
                          }}
                          className="rounded border-amber-600 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-sm menu-text">{allergen}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* URL de l'image */}
                <div>
                  <label className="block text-sm font-medium western-subtitle mb-2">
                    URL de l'image (optionnel)
                  </label>
                  <input
                    type="url"
                    value={newDish.image}
                    onChange={(e) => setNewDish(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="https://images.pexels.com/..."
                  />
                </div>

                {/* Actuellement à la carte */}
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDish.a_la_carte}
                      onChange={(e) => setNewDish(prev => ({ ...prev, a_la_carte: e.target.checked }))}
                      className="rounded border-amber-600 text-amber-600 focus:ring-amber-500 w-5 h-5"
                    />
                    <div className="flex items-center space-x-2">
                      {newDish.a_la_carte ? (
                        <Eye className="h-5 w-5 text-green-600" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm font-medium western-subtitle">
                        Actuellement à la carte
                      </span>
                    </div>
                  </label>
                  <p className="text-xs text-gray-600 mt-2 ml-8">
                    {newDish.a_la_carte 
                      ? "Ce plat sera visible dans le menu public"
                      : "Ce plat sera masqué du menu public"
                    }
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-amber-200">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddDish}
                  disabled={isSubmitting || !newDish.nom.trim()}
                  className="flex items-center space-x-2 western-btn px-6 py-3 rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{isSubmitting ? 'Ajout...' : 'Ajouter le plat'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && editingDish && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="western-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl western-title">Modifier le plat</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingDish(null);
                  }}
                  className="text-amber-600 hover:text-amber-800 p-2 hover:bg-amber-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Nom du plat */}
                <div>
                  <label className="block text-sm font-medium western-subtitle mb-2">
                    Nom du plat *
                  </label>
                  <input
                    type="text"
                    value={editingDish.nom}
                    onChange={(e) => setEditingDish(prev => prev ? { ...prev, nom: e.target.value } : null)}
                    className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium western-subtitle mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={editingDish.categorie}
                    onChange={(e) => setEditingDish(prev => prev ? { ...prev, categorie: e.target.value as any } : null)}
                    className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Sous-catégorie */}
                <div>
                  <label className="block text-sm font-medium western-subtitle mb-2">
                    Sous-catégorie (optionnel)
                  </label>
                  <select
                    value={editingDish.sous_categorie || ''}
                    onChange={(e) => setEditingDish(prev => prev ? { ...prev, sous_categorie: e.target.value || null } : null)}
                    className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Aucune sous-catégorie</option>
                    {/* Sous-catégories pour Entrées */}
                    <optgroup label="Entrées">
                      <option value="Bar à Salades">Bar à Salades</option>
                      <option value="Charcuterie">Charcuterie</option>
                      <option value="Produits de la mer">Produits de la mer</option>
                      <option value="Soupes">Soupes</option>
                      <option value="Assortiment de graines et fruits secs">Assortiment de graines et fruits secs</option>
                      <option value="Salades Composées">Salades Composées</option>
                    </optgroup>
                    {/* Sous-catégories pour Desserts */}
                    <optgroup label="Desserts">
                      <option value="Desserts fruités">Desserts fruités</option>
                      <option value="Glaces">Glaces</option>
                      <option value="Gâteau d'anniversaire">Gâteau d'anniversaire</option>
                    </optgroup>
                    {/* Sous-catégories pour Sauces */}
                    <optgroup label="Sauces">
                      <option value="Sauces condiment">Sauces condiment</option>
                      <option value="Sauces salade">Sauces salade</option>
                    </optgroup>
                  </select>
                </div>

                {/* Ingrédients */}
                <div>
                  <label className="block text-sm font-medium western-subtitle mb-2">
                    Ingrédients
                  </label>
                  <IngredientInput
                    value={editingDish.ingredients}
                    onChange={(ingredients) => setEditingDish(prev => prev ? { ...prev, ingredients } : null)}
                    placeholder="Rechercher et ajouter des ingrédients..."
                  />
                </div>

                {/* Allergènes */}
                <div>
                  <label className="block text-sm font-medium western-subtitle mb-2">
                    Allergènes
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableAllergens.map(allergen => (
                      <label key={allergen} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingDish.allergenes.includes(allergen)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingDish(prev => prev ? { ...prev, allergenes: [...prev.allergenes, allergen] } : null);
                            } else {
                              setEditingDish(prev => prev ? { ...prev, allergenes: prev.allergenes.filter(a => a !== allergen) } : null);
                            }
                          }}
                          className="rounded border-amber-600 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-sm menu-text">{allergen}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* URL de l'image */}
                <div>
                  <label className="block text-sm font-medium western-subtitle mb-2">
                    URL de l'image (optionnel)
                  </label>
                  <input
                    type="url"
                    value={editingDish.image || ''}
                    onChange={(e) => setEditingDish(prev => prev ? { ...prev, image: e.target.value || undefined } : null)}
                    className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="https://images.pexels.com/..."
                  />
                </div>

                {/* Actuellement à la carte */}
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingDish.a_la_carte ?? true}
                      onChange={(e) => setEditingDish(prev => prev ? { ...prev, a_la_carte: e.target.checked } : null)}
                      className="rounded border-amber-600 text-amber-600 focus:ring-amber-500 w-5 h-5"
                    />
                    <div className="flex items-center space-x-2">
                      {editingDish.a_la_carte !== false ? (
                        <Eye className="h-5 w-5 text-green-600" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm font-medium western-subtitle">
                        Actuellement à la carte
                      </span>
                    </div>
                  </label>
                  <p className="text-xs text-gray-600 mt-2 ml-8">
                    {editingDish.a_la_carte !== false
                      ? "Ce plat sera visible dans le menu public"
                      : "Ce plat sera masqué du menu public"
                    }
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-amber-200">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingDish(null);
                  }}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleEditDish}
                  disabled={isSubmitting || !editingDish.nom.trim()}
                  className="flex items-center space-x-2 western-btn px-6 py-3 rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{isSubmitting ? 'Modification...' : 'Sauvegarder'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}