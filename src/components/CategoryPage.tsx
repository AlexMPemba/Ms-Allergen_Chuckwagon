import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Search, ChefHat, Settings, ArrowLeft, Globe, X, Grid3X3, List, Utensils, UtensilsCrossed, Cookie, Droplets, Salad, Layers, Triangle, Coffee } from 'lucide-react';
import { Language, Category } from '../types';
import { useDishes } from '../hooks/useDishes';
import { translations, categories, allergenTranslations } from '../data/translations';
import { getSubcategoriesForCategory } from '../data/categories';

export default function CategoryPage() {
  const { language, category } = useParams<{ language: string; category: string }>();
  const [searchParams] = useSearchParams();
  const selectedSubcategory = searchParams.get('subcategory');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [hiddenAllergens, setHiddenAllergens] = useState<string[]>(() => {
    // Récupérer les allergènes sélectionnés depuis le localStorage
    const saved = localStorage.getItem('selectedAllergens');
    return saved ? JSON.parse(saved) : [];
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'icons'>('list');
  const { dishes, loading, refreshDishes } = useDishes();

  const lang = language as Language || 'fr';
  const selectedCategory = category as Category;

  const handleBack = () => {
    navigate(-1);
  };
  console.log('📂 CategoryPage - Nombre de plats chargés:', dishes.length);
  console.log('📂 CategoryPage - Plats dans la catégorie', selectedCategory, ':', dishes.filter(d => d.categorie === selectedCategory && d.langue === lang).length);

  // Liste des allergènes disponibles
  const availableAllergens = [
    'Gluten',
    'Œufs',
    'Lait',
    'Fruits à coque',
    'Arachides',
    'Soja',
    'Poisson',
    'Crustacés',
    'Mollusques',
    'Céleri',
    'Moutarde',
    'Sésame',
    'Sulfites',
    'Lupin'
  ];

  // Fonction pour basculer le filtre d'allergène
  const toggleAllergenFilter = (allergen: string) => {
    setHiddenAllergens(prev => {
      const newHiddenAllergens = prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen];
      
      // Sauvegarder dans localStorage
      localStorage.setItem('selectedAllergens', JSON.stringify(newHiddenAllergens));
      return newHiddenAllergens;
    });
  };

  // Écouter les changements du localStorage pour synchroniser entre les pages
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('selectedAllergens');
      if (saved) {
        try {
          const parsedAllergens = JSON.parse(saved);
          setHiddenAllergens(parsedAllergens);
        } catch (error) {
          console.error('Erreur lors du parsing des allergènes:', error);
          localStorage.removeItem('selectedAllergens');
          setHiddenAllergens([]);
        }
      } else {
        setHiddenAllergens([]);
      }
    };

    // Écouter les changements du localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Nettoyer l'écouteur
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Fonction pour réinitialiser tous les filtres
  const clearAllFilters = () => {
    setHiddenAllergens([]);
    localStorage.removeItem('selectedAllergens');
  };

  const filteredDishes = useMemo(() => {
    const filtered = dishes.filter(dish => {
      const matchesCategory = dish.categorie === selectedCategory;
      const matchesSearch = !searchQuery || 
        dish.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      const matchesSubcategory = !selectedSubcategory || dish.sous_categorie === selectedSubcategory;
      
      // Filtrer par allergènes masqués
      const hasHiddenAllergen = hiddenAllergens.some(allergen => 
        dish.allergenes.includes(allergen)
      );
      
      return matchesCategory && matchesSubcategory && matchesSearch && !hasHiddenAllergen;
    });
    
    console.log('🔍 [CATEGORY] === FILTRAGE CATÉGORIE ===');
    console.log('🔍 [CATEGORY] Catégorie sélectionnée:', selectedCategory);
    console.log('🔍 [CATEGORY] Sous-catégorie sélectionnée:', selectedSubcategory);
    console.log('🔍 [CATEGORY] Total plats disponibles:', dishes.length);
    console.log('🔍 [CATEGORY] Plats dans cette catégorie:', dishes.filter(d => d.categorie === selectedCategory).length);
    console.log('🔍 [CATEGORY] Plats filtrés finaux:', filtered.length);
    console.log('🔍 [CATEGORY] Détail des plats filtrés:', filtered.map(d => ({ nom: d.nom, categorie: d.categorie, langue: d.langue })));
    
    return filtered;
  }, [dishes, selectedCategory, selectedSubcategory, searchQuery, hiddenAllergens]);

  const handleDishClick = (dishId: string) => {
    // Vérifier que le plat existe avant de naviguer
    const dish = dishes.find(d => d.id === dishId);
    if (!dish && !loading) {
      console.warn('Plat non trouvé:', dishId);
      return;
    }
    navigate(`/${lang}/dish/${dishId}`);
  };

  return (
    <div className="min-h-screen western-bg page-transition">
      {/* Header */}
      <div className="flex items-center justify-center mb-0">
        <div className="western-card shadow-sm border-b-4 border-amber-800 relative rounded-2xl max-w-sm sm:max-w-md md:max-w-2xl w-full mx-auto">
          <div className="px-4 py-4">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className="flex items-center justify-between h-12">
              {/* Bouton retour mobile */}
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-10 h-10 western-btn rounded-full p-2"
                title="Retour au menu"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              {/* Titre centré */}
              <div className="flex items-center justify-center space-x-2 flex-1">
                <ChefHat className="h-6 w-6 text-amber-800" />
                <h1 className="text-lg western-title text-center">
                  {categories[lang][selectedCategory]}
                  {selectedSubcategory && (
                    <span className="text-sm text-blue-600 block">• {selectedSubcategory}</span>
                  )}
                </h1>
              </div>
              
              {/* Bouton langue mobile */}
              <Link
                to="/"
                className="flex items-center justify-center w-10 h-10 western-btn rounded-full p-2"
                title="Changer de langue"
              >
                <Globe className="h-5 w-5" />
              </Link>
            </div>
          </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between h-16">
            {/* Bouton retour desktop */}
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-amber-800 hover:text-amber-900 transition-colors western-subtitle"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{translations.back[lang]}</span>
            </button>
            
            {/* Titre principal */}
            <div className="flex items-center justify-center space-x-2 sheriff-star absolute left-1/2 transform -translate-x-1/2">
              <ChefHat className="h-8 w-8 text-amber-800" />
              <h1 className="text-xl md:text-2xl western-title">
                {categories[lang][selectedCategory]}
                {selectedSubcategory && (
                  <span className="text-lg text-blue-600 ml-2">• {selectedSubcategory}</span>
                )}
              </h1>
            </div>
            
            {/* Bouton langue desktop */}
            <Link
              to="/"
              className="flex items-center space-x-2 western-subtitle hover:text-amber-800 transition-colors p-3 rounded-lg hover:bg-amber-100"
              title="Changer de langue"
            >
              <Globe className="h-5 w-5" />
              <span className="text-sm western-subtitle">Langue</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="western-card rounded-lg shadow-sm p-6 mb-8">

          <div className="relative">
            <label className="block text-sm font-medium western-subtitle mb-2">
              <Search className="h-4 w-4 inline mr-1" />
              {translations.searchIn[lang]} {categories[lang][selectedCategory]}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={translations.searchPlaceholder[lang]}
              className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-9 text-amber-600 hover:text-amber-800"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filtres d'allergènes */}
          <div className="mt-6">
            <h3 className="text-sm font-medium western-subtitle mb-3">
              {translations.filterByAllergens[lang]}
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableAllergens.map(allergen => (
                <button
                  key={allergen}
                  onClick={() => toggleAllergenFilter(allergen)}
                  className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1 px-2 py-2 rounded-lg transition-all duration-200 text-xs ${
                    hiddenAllergens.includes(allergen)
                      ? 'bg-red-600 text-white border-2 border-red-700 shadow-md'
                      : 'bg-gray-200 text-gray-700 border-2 border-gray-300 hover:bg-gray-300'
                  }`}
                  title={hiddenAllergens.includes(allergen) 
                    ? `Plats avec ${allergen} masqués - Cliquer pour afficher`
                    : `Cliquer pour masquer les plats avec ${allergen}`
                  }
                >
                  {hiddenAllergens.includes(allergen) && (
                    <span className="mr-1">🚫</span>
                  )}
                  {allergenTranslations[lang]?.[allergen] || allergen}
                </button>
              ))}
            </div>
            {hiddenAllergens.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">
                  {hiddenAllergens.length} allergène(s) masqué(s)
                </p>
                <button
                  onClick={clearAllFilters}
                  className="text-xs sm:text-sm western-btn px-3 py-1 rounded-lg"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Affichage conditionnel selon le mode */}
        {viewMode === 'grid' && (
          /* Affichage grille standard */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {loading && (
              <div className="col-span-full text-center py-12">
                <div className="text-amber-600 mb-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
                </div>
                <p className="western-subtitle text-lg">{translations.loadingDishes[lang]}</p>
              </div>
            )}
            {!loading && filteredDishes.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-amber-600 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <p className="western-subtitle text-lg">{translations.noDishesInCategory[lang]}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {translations.addDishesCategory[lang]} "{categories[lang][selectedCategory]}" {translations.viaAdmin[lang]}.
                </p>
              </div>
            ) : (
              !loading && filteredDishes.map(dish => (
                <div
                  key={dish.id}
                  onClick={() => handleDishClick(dish.id)}
                  className="dish-card western-card rounded-lg shadow-sm cursor-pointer stagger-item"
                >
                  {dish.image && (
                    <img
                      src={dish.image}
                      alt={dish.nom}
                      className="w-full h-32 sm:h-40 md:h-48 object-cover border-b-2 border-amber-800"
                    />
                  )}
                  <div className="p-3 md:p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base md:text-lg font-semibold menu-text">{dish.nom}</h3>
                      <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-600 ml-2 flex-shrink-0">
                        {categories[lang][dish.categorie]}
                      </span>
                    </div>
                    
                    {dish.allergenes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs menu-text mb-1">{translations.allergens[lang]}:</p>
                        <div className="flex flex-wrap gap-1">
                          {dish.allergenes.map(allergen => (
                            <span
                              key={allergen}
                              className="text-xs px-1.5 py-0.5 bg-red-200 text-red-800 rounded-full border border-red-600"
                            >
                              {allergenTranslations[lang]?.[allergen] || allergen}
                              {dish.sous_categorie && (
                                <span className="ml-1">• {dish.sous_categorie}</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {viewMode === 'list' && (
          /* Affichage liste */
          <div className="space-y-2">
            {loading && (
              <div className="text-center py-12">
                <div className="text-amber-600 mb-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
                </div>
                <p className="western-subtitle text-lg">{translations.loadingDishes[lang]}</p>
              </div>
            )}
            {!loading && filteredDishes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-amber-600 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <p className="western-subtitle text-lg">{translations.noDishesInCategory[lang]}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {translations.addDishesCategory[lang]} "{categories[lang][selectedCategory]}" {translations.viaAdmin[lang]}.
                </p>
              </div>
            ) : (
              !loading && filteredDishes.map(dish => (
                <div
                  key={dish.id}
                  onClick={() => handleDishClick(dish.id)}
                  className="list-dish-card western-card rounded-lg shadow-sm cursor-pointer stagger-item p-3 flex items-center space-x-4"
                >
                  {dish.image && (
                    <img
                      src={dish.image}
                      alt={dish.nom}
                      className="w-16 h-12 object-cover rounded border border-amber-600 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-semibold menu-text truncate">{dish.nom}</h3>
                      <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-600 ml-2 flex-shrink-0">
                        {categories[lang][dish.categorie]}
                      </span>
                    </div>
                    {dish.allergenes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {dish.allergenes.slice(0, 4).map(allergen => (
                          <span
                            key={allergen}
                            className="text-xs px-1.5 py-0.5 bg-red-200 text-red-800 rounded-full border border-red-600"
                          >
                            {allergenTranslations[lang]?.[allergen] || allergen}
                          </span>
                        ))}
                        {dish.allergenes.length > 4 && (
                          <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                            +{dish.allergenes.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {viewMode === 'icons' && (
          /* Affichage icônes d'applications */
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 sm:gap-6">
            {loading && (
              <div className="col-span-full text-center py-12">
                <div className="text-amber-600 mb-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
                </div>
                <p className="western-subtitle text-lg">{translations.loadingDishes[lang]}</p>
              </div>
            )}
            {!loading && filteredDishes.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-amber-600 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <p className="western-subtitle text-lg">{translations.noDishesInCategory[lang]}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {translations.addDishesCategory[lang]} "{categories[lang][selectedCategory]}" {translations.viaAdmin[lang]}.
                </p>
              </div>
            ) : (
              !loading && filteredDishes.map(dish => (
                <div
                  key={dish.id}
                  onClick={() => handleDishClick(dish.id)}
                  className="app-icon-card flex flex-col items-center cursor-pointer stagger-item group"
                >
                  {/* Icône circulaire */}
                  <div className="app-icon-container relative mb-2">
                    {dish.image ? (
                      <img
                        src={dish.image}
                        alt={dish.nom}
                        className="app-icon-image w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-2xl border-2 border-amber-600 shadow-lg group-hover:scale-110 group-active:scale-95 transition-all duration-300"
                      />
                    ) : (
                      <div className="app-icon-placeholder w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-amber-200 to-amber-400 rounded-2xl border-2 border-amber-600 shadow-lg flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-all duration-300">
                        <Utensils className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-amber-800" />
                      </div>
                    )}
                  </div>
                  
                  {/* Nom de l'application */}
                  <h3 className="app-icon-title text-xs sm:text-sm font-medium menu-text text-center leading-tight max-w-full px-1 group-hover:text-amber-800 transition-colors duration-200">
                    {dish.nom.length > 20 ? `${dish.nom.slice(0, 17)}...` : dish.nom}
                  </h3>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}