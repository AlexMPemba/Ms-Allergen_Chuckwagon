import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History, Calendar, Search, Clock, User, RefreshCw, X } from 'lucide-react';
import { useDishes } from '../hooks/useDishes';
import { DishModification } from '../lib/supabase';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { dishes, modifications, loadAllModifications } = useDishes();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<'all' | 'created' | 'updated' | 'deleted'>('all');
  const [selectedUser, setSelectedUser] = useState('');

  // Charger l'historique au montage du composant
  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        await loadAllModifications();
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []); // Supprimer la dépendance pour éviter le rechargement infini

  // Fonction pour extraire le nom du plat depuis les modifications
  const getDishNameFromModification = (mod: DishModification) => {
    // Priorité 1 : Utiliser dish_name si disponible (nouvelle colonne)
    if (mod.dish_name) {
      return mod.dish_name;
    }

    // Priorité 2 : Extraire depuis changes selon le type d'action
    if (mod.action_type === 'created') {
      return mod.changes?.nom || 'Nom non disponible';
    }
    
    if (mod.action_type === 'deleted') {
      return mod.changes?.deleted_dish?.nom || mod.changes?.nom || 'Plat supprimé';
    }

    // Pour les modifications, chercher dans les changements
    if (mod.action_type === 'updated') {
      // Si le nom a été modifié, prendre la nouvelle valeur
      if (mod.changes?.nom?.new) {
        return mod.changes.nom.new;
      }
      // Si le nom a été modifié, prendre l'ancienne valeur
      if (mod.changes?.nom?.old) {
        return mod.changes.nom.old;
      }
      
      // Sinon, chercher le nom du plat actuel dans la liste des plats
      const currentDish = dishes.find(d => d.id === mod.dish_id);
      if (currentDish) {
        return currentDish.nom;
      }
    }

    return 'Nom non disponible';
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Filtrer les modifications par date et recherche
  const filteredModifications = useMemo(() => {
    let filtered = modifications;

    // Filtre par date
    if (selectedDate) {
      const filterDate = new Date(selectedDate);
      const startOfDay = new Date(filterDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(filterDate.setHours(23, 59, 59, 999));

      filtered = filtered.filter(mod => {
        const modDate = new Date(mod.created_at);
        return modDate >= startOfDay && modDate <= endOfDay;
      });
    }

    // Filtre par type d'action
    if (selectedAction !== 'all') {
      filtered = filtered.filter(mod => mod.action_type === selectedAction);
    }

    // Filtre par utilisateur
    if (selectedUser.trim()) {
      const userQuery = selectedUser.toLowerCase().trim();
      filtered = filtered.filter(mod => 
        mod.user_email.toLowerCase().includes(userQuery)
      );
    }

    // Filtre par recherche (nom du plat)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(mod => {
        const dishName = getDishNameFromModification(mod);
        return dishName.toLowerCase().includes(query);
      });
    }

    return filtered;
  }, [modifications, selectedDate, searchQuery, selectedAction, selectedUser, dishes]);

  const handleBack = () => {
    navigate(-1);
  };

  const clearDateFilter = () => {
    setSelectedDate('');
  };

  const clearSearchFilter = () => {
    setSearchQuery('');
  };

  const clearAllFilters = () => {
    setSelectedDate('');
    setSearchQuery('');
    setSelectedAction('all');
    setSelectedUser('');
  };

  const refreshHistory = async () => {
    setLoading(true);
    try {
      await loadAllModifications();
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen western-bg page-transition">
      {/* Header */}
      <div className="western-card shadow-sm border-b-4 border-amber-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-amber-800 hover:text-amber-900 transition-colors western-subtitle"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour à l'administration</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <History className="h-6 w-6 text-amber-800" />
              <h1 className="text-xl md:text-2xl western-title">HISTORIQUE GLOBAL</h1>
            </div>

            <button
              onClick={refreshHistory}
              disabled={loading}
              className="flex items-center space-x-2 western-btn px-4 py-2 rounded-lg text-sm"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filtres */}
        <div className="western-card rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold western-subtitle mb-4 flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Filtres de recherche</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filtre par date */}
            <div>
              <label className="block text-sm font-medium western-subtitle mb-2 flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Filtrer par date</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
                />
                {selectedDate && (
                  <button
                    onClick={clearDateFilter}
                    className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    title="Effacer le filtre de date"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filtre par nom de plat */}
            <div>
              <label className="block text-sm font-medium western-subtitle mb-2">
                Rechercher par nom de plat
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nom du plat..."
                  className="flex-1 p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearchFilter}
                    className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    title="Effacer la recherche"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filtre par type d'action */}
            <div>
              <label className="block text-sm font-medium western-subtitle mb-2">
                Type d'action
              </label>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value as any)}
                className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Toutes les actions</option>
                <option value="created">Créations</option>
                <option value="updated">Modifications</option>
                <option value="deleted">Suppressions</option>
              </select>
            </div>

            {/* Filtre par utilisateur */}
            <div>
              <label className="block text-sm font-medium western-subtitle mb-2">
                Utilisateur
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  placeholder="Email de l'utilisateur..."
                  className="flex-1 p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500"
                />
                {selectedUser && (
                  <button
                    onClick={() => setSelectedUser('')}
                    className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    title="Effacer le filtre utilisateur"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Total des modifications : <strong>{modifications.length}</strong></span>
              <span>Résultats filtrés : <strong>{filteredModifications.length}</strong></span>
              {selectedAction !== 'all' && (
                <span className="text-indigo-600">
                  Action : <strong>{selectedAction === 'created' ? 'Créations' : selectedAction === 'updated' ? 'Modifications' : 'Suppressions'}</strong>
                </span>
              )}
            </div>
            {(selectedDate || searchQuery || selectedAction !== 'all' || selectedUser) && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-xs transition-colors"
              >
                Effacer tous les filtres
              </button>
            )}
          </div>
        </div>

        {/* Liste des modifications */}
        <div className="western-card rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-amber-200 bg-amber-50">
            <h2 className="text-lg font-semibold western-subtitle">
              Historique des modifications ({filteredModifications.length})
            </h2>
          </div>
          
          <div className="divide-y divide-amber-200 max-h-[70vh] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="text-amber-600 mb-4">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto" />
                </div>
                <p className="western-subtitle">Chargement de l'historique...</p>
              </div>
            ) : filteredModifications.length === 0 ? (
              <div className="p-8 text-center">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  {modifications.length === 0 
                    ? "Aucune modification enregistrée" 
                    : "Aucune modification trouvée avec ces filtres"
                  }
                </p>
                {(selectedDate || searchQuery || selectedAction !== 'all' || selectedUser) && (
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                  >
                    Effacer tous les filtres
                  </button>
                )}
              </div>
            ) : (
              filteredModifications.map((mod) => (
                <div key={mod.id} className="p-4 hover:bg-amber-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        mod.action_type === 'created' ? 'bg-green-500' :
                        mod.action_type === 'updated' ? 'bg-blue-500' : 'bg-red-500'
                      }`}></div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span 
                            className="font-medium text-gray-800 truncate text-sm sm:text-base" 
                            title={`ID: ${mod.dish_id}`}
                          >
                            {getDishNameFromModification(mod)}
                          </span>
                          {/* Indicateur pour plats supprimés */}
                          {mod.action_type === 'deleted' && (
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full border border-red-600 flex-shrink-0">
                              🗑️ SUPPRIMÉ
                            </span>
                          )}
                          {/* Indicateur pour modifications orphelines */}
                          {mod.dish_id && !dishes.find(d => d.id === mod.dish_id) && mod.action_type !== 'deleted' && (
                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full border border-orange-600 flex-shrink-0">
                              ⚠️ PLAT SUPPRIMÉ
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            mod.action_type === 'created' ? 'bg-green-100 text-green-800' :
                            mod.action_type === 'updated' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {mod.action_type === 'created' ? '➕ Créé' :
                             mod.action_type === 'updated' ? '✏️ Modifié' : '🗑️ Supprimé'}
                          </span>
                          <span>par {mod.user_email}</span>
                          {mod.dish_category && (
                            <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                              {mod.dish_category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-500 flex-shrink-0">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span className="whitespace-nowrap">{formatDate(mod.created_at)}</span>
                      </div>
                      {/* Détails des modifications pour les updates */}
                      {mod.action_type === 'updated' && mod.changes && (
                        <div className="text-xs">
                          <details className="cursor-pointer">
                            <summary className="text-indigo-600 hover:text-indigo-800">
                              📋 Voir les modifications détaillées
                            </summary>
                            <div className="mt-2 p-2 bg-gray-50 rounded border text-xs">
                              {Object.entries(mod.changes).map(([key, value]: [string, any]) => {
                                if (key === 'old' || key === 'new') return null;
                                if (typeof value === 'object' && value.old !== undefined && value.new !== undefined) {
                                  return (
                                    <div key={key} className="mb-1">
                                      <strong>{key}:</strong>
                                      <div className="ml-2">
                                        <span className="text-red-600">- {JSON.stringify(value.old)}</span>
                                        <br />
                                        <span className="text-green-600">+ {JSON.stringify(value.new)}</span>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </details>
                        </div>
                      )}
                      {/* Détails pour les suppressions */}
                      {mod.action_type === 'deleted' && mod.changes?.deleted_dish && (
                        <div className="text-xs">
                          <details className="cursor-pointer">
                            <summary className="text-red-600 hover:text-red-800">
                              🗑️ Voir les détails de la suppression
                            </summary>
                            <div className="mt-2 p-2 bg-red-50 rounded border text-xs">
                              <div className="mb-1">
                                <strong>Plat supprimé :</strong> {mod.changes.deleted_dish.nom}
                              </div>
                              <div className="mb-1">
                                <strong>Catégorie :</strong> {mod.changes.deleted_dish.categorie}
                              </div>
                              <div className="mb-1">
                                <strong>Ingrédients :</strong> {(mod.changes.deleted_dish.ingredients || []).join(', ') || 'Aucun'}
                              </div>
                              <div className="mb-1">
                                <strong>Allergènes :</strong> {(mod.changes.deleted_dish.allergenes || []).join(', ') || 'Aucun'}
                              </div>
                              {mod.changes.deletion_timestamp && (
                                <div className="text-red-600 font-medium">
                                  <strong>Supprimé le :</strong> {new Date(mod.changes.deletion_timestamp).toLocaleString('fr-FR')}
                                </div>
                              )}
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}