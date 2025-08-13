import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, ChefHat, Settings, Utensils, Coffee, Cookie, Droplets, Salad, UtensilsCrossed, Globe, Apple, UserCheck as Cheese, X, Grid3X3, List, Layers, ChevronDown, Filter, ArrowLeft } from 'lucide-react';
import { Triangle } from 'lucide-react';
import { Language, Category } from '../types';
import { useDishes } from '../hooks/useDishes';
import { translations, categories, allergenTranslations } from '../data/translations';
import { getSubcategoriesForCategory } from '../data/categories';

export default function MainPage() {
  const { language } = useParams<{ language: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [hiddenAllergens, setHiddenAllergens] = useState<string[]>(() => {
    // Récupérer les allergènes sélectionnés depuis le localStorage
    const saved = localStorage.getItem('selectedAllergens');
    return saved ? JSON.parse(saved) : [];
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'icons'>('list');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { dishes, loading, error, refreshDishes } = useDishes();

  const lang = language as Language || 'fr';

  console.log('🏠 [MAIN] === PAGE PRINCIPALE ===');
  console.log('🏠 [MAIN] Langue:', lang);
  console.log('🏠 [MAIN] Total plats:', dishes.length);
  console.log('🏠 [MAIN] Plats français:', dishes.filter(d => d.langue === lang).length);

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

  const filteredDishes = useMemo(() => {
    const filtered = dishes.filter(dish => {
      const matchesSearch = !searchQuery || 
        dish.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      // Filtrer par allergènes masqués
      const hasHiddenAllergen = hiddenAllergens.some(allergen => 
        dish.allergenes.includes(allergen)
      );
      
      return matchesSearch && !hasHiddenAllergen;
    });
    
    console.log('🔍 [MAIN] === FILTRAGE PAGE PRINCIPALE ===');
    console.log('🔍 [MAIN] Total plats disponibles:', dishes.length);
    console.log('🔍 [MAIN] Plats filtrés par recherche (toutes langues):', filtered.length);
    console.log('🔍 [MAIN] Répartition par catégorie:');
    const categoryCount = filtered.reduce((acc, dish) => {
      acc[dish.categorie] = (acc[dish.categorie] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('🔍 [MAIN] Catégories:', categoryCount);
    
    return filtered;
  }, [dishes, searchQuery, hiddenAllergens]);

  const handleDishClick = (dishId: string) => {
    // Vérifier que le plat existe avant de naviguer
    const dish = dishes.find(d => d.id === dishId);
    if (!dish && !loading) {
      console.warn('Plat non trouvé:', dishId);
      return;
    }
    navigate(`/${lang}/dish/${dishId}`);
  };

  const handleCategoryClick = (category: Category) => {
    const subcategories = getSubcategoriesForCategory(category);
    if (subcategories && subcategories.length > 0) {
      // Si la catégorie a des sous-catégories, les afficher
      setSelectedCategoryForSub(category);
      setShowSubcategoryDropdown(true);
      setShowCategoryDropdown(false);
    } else {
      // Sinon, naviguer directement
      navigate(`/${lang}/category/${category}`);
    }
  };

  const handleSubcategoryClick = (category: Category, subcategory: string) => {
    navigate(`/${lang}/category/${category}?subcategory=${encodeURIComponent(subcategory)}`);
  };

  const categoryOptions: Category[] = ['Entrées', 'Plats', 'Desserts', 'Sauces', 'Accompagnements', 'Garniture', 'Fromages', 'Huiles', 'Natama', 'Halal', 'Casher', 'Boissons chaudes'];

  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<Category | null>(null);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);

  const categoryIcons = {
    'Entrées': UtensilsCrossed,
    'Plats': Utensils,
    'Desserts': Cookie,
    'Sauces': Droplets,
    'Accompagnements': Utensils,
    'Garniture': Layers,
    'Fromages': Triangle,
    'Huiles': Droplets,
    'Natama': Coffee,
    'Halal': UtensilsCrossed,
    'Casher': UtensilsCrossed,
    'Boissons chaudes': Coffee
  };

  const categoryImages = {
    'Entrées': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Plats': 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Desserts': 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Sauces': 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Accompagnements': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Garniture': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Fromages': 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Huiles': 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=400',
    'Natama': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Halal': 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Casher': 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Boissons chaudes': 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400'
  };

  return (
    <div className="min-h-screen western-bg page-transition">
      {/* Header */}
      <div className="flex items-center justify-center mb-0">
        <div className="western-card shadow-sm border-b-4 border-amber-800 relative rounded-2xl max-w-sm sm:max-w-md md:max-w-2xl w-full mx-auto">
          <div className="px-4 py-4">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className="flex items-center justify-between">
              {/* Bouton langue mobile - à gauche */}
              <Link
                to="/"
                className="flex items-center justify-center w-10 h-10 western-btn rounded-full p-2"
                title="Changer de langue"
              >
                <Globe className="h-5 w-5" />
              </Link>
              
              {/* Titre centré */}
              <Link to="/" className="flex items-center space-x-2 text-amber-800 hover:text-amber-900 transition-colors">
                <ChefHat className="h-6 w-6" />
                <h1 className="text-lg western-title">ALLERGÈNES</h1>
              </Link>
              
              {/* Espace vide pour équilibrer */}
              <div className="w-10 h-10"></div>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            {/* Titre principal */}
            <Link to="/" className="flex items-center space-x-3 text-amber-800 hover:text-amber-900 transition-colors sheriff-star mx-auto sm:mx-0">
              <ChefHat className="h-8 w-8" />
              <h1 className="text-xl md:text-2xl western-title">{translations.title[lang]}</h1>
            </Link>
            
            {/* Bouton langue desktop */}
            <Link 
              to="/"
              className="hidden lg:flex items-center space-x-2 western-subtitle hover:text-amber-800 transition-colors p-3 rounded-lg hover:bg-amber-100"
              title="Changer de langue"
            >
              <Globe className="h-5 w-5" />
              <span className="text-sm western-subtitle">Langue</span>
            </Link>
          </div>
        </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Barre de recherche et contrôles compacts */}
        <div className="flex items-center justify-center mb-8">
          <div className="western-card rounded-xl shadow-lg p-4 sm:p-6 max-w-4xl w-full mx-auto stagger-item">
            {/* Logo et titre compacts */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <img 
                  src="/chuck-wagon-official-logo.png" 
                  alt="Chuck Wagon Cafe Logo" 
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h1 className="text-lg sm:text-xl western-title">
                {translations.title[lang]}
              </h1>
            </div>

            {/* Barre de recherche */}
            <div className="mb-4 relative max-w-md mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={translations.searchPlaceholder[lang]}
                className="w-full p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Contrôles en ligne : Catégories, Filtres, Mode d'affichage */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              {/* Bouton Catégories */}
              <button
                onClick={() => {
                  setShowCategoryDropdown(true);
                  setShowFilterDropdown(false);
                }}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 western-btn px-6 py-3 rounded-xl text-sm font-medium"
              >
                <Utensils className="h-4 w-4" />
                <span>{translations.categories[lang]}</span>
              </button>

              {/* Bouton Filtres */}
              <button
                onClick={() => {
                  setShowFilterDropdown(true);
                  setShowCategoryDropdown(false);
                }}
                className={`w-full sm:w-auto flex items-center justify-center space-x-2 western-btn px-6 py-3 rounded-xl text-sm font-medium ${
                  hiddenAllergens.length > 0 ? 'bg-red-600 text-white' : ''
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>{translations.allergensFilter[lang]}</span>
                {hiddenAllergens.length > 0 && (
                  <span className="bg-red-800 text-white text-xs px-2 py-0.5 rounded-full">
                    {hiddenAllergens.length}
                  </span>
                )}
              </button>

              {/* Mode d'affichage */}
              <div className="w-full sm:w-auto flex bg-amber-100 rounded-lg p-1 border-2 border-amber-600">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3 py-1 rounded-md transition-all duration-200 text-xs ${
                    viewMode === 'list'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  <List className="h-3 w-3" />
                  <span>Liste</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3 py-1 rounded-md transition-all duration-200 text-xs ${
                    viewMode === 'grid'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  <Grid3X3 className="h-3 w-3" />
                  <span>Grille</span>
                </button>
                <button
                  onClick={() => setViewMode('icons')}
                  className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3 py-1 rounded-md transition-all duration-200 text-xs ${
                    viewMode === 'icons'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  <Utensils className="h-3 w-3" />
                  <span>Icônes</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Popup Catégories */}
        {showCategoryDropdown && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="western-card rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl western-title flex items-center space-x-2">
                    <Utensils className="h-6 w-6 text-amber-600" />
                    <span>{translations.categories[lang]}</span>
                  </h2>
                  <button
                    onClick={() => setShowCategoryDropdown(false)}
                    className="text-amber-600 hover:text-amber-800 p-2 hover:bg-amber-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  {categoryOptions.map((category) => {
                    const IconComponent = categoryIcons[category];
                    const hasSubcategories = getSubcategoriesForCategory(category);
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          handleCategoryClick(category);
                        }}
                        className={`flex flex-col items-center justify-center space-y-2 p-3 sm:p-4 lg:p-5 rounded-lg transition-all duration-200 western-btn hover:scale-105 min-h-[85px] sm:min-h-[95px] lg:min-h-[105px] w-full relative ${
                          hasSubcategories ? 'border-2 border-blue-400' : ''
                        }`}
                      >
                        <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white flex-shrink-0" />
                        <span className="text-white text-xs sm:text-sm lg:text-base text-center leading-tight font-medium px-1">
                          {categories[lang][category]}
                        </span>
                        {hasSubcategories && (
                          <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-full">
                            {hasSubcategories.length}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popup Sous-catégories */}
        {showSubcategoryDropdown && selectedCategoryForSub && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="western-card rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl western-title flex items-center space-x-2">
                    <Layers className="h-6 w-6 text-blue-600" />
                    <span>{categories[lang][selectedCategoryForSub]}</span>
                  </h2>
                  <button
                    onClick={() => {
                      setShowSubcategoryDropdown(false);
                      setSelectedCategoryForSub(null);
                    }}
                    className="text-amber-600 hover:text-amber-800 p-2 hover:bg-amber-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Option pour voir toute la catégorie */}
                <button
                  onClick={() => {
                    navigate(`/${lang}/category/${selectedCategoryForSub}`);
                    setShowSubcategoryDropdown(false);
                    setSelectedCategoryForSub(null);
                  }}
                  className="w-full mb-4 p-4 rounded-lg transition-all duration-200 bg-amber-600 hover:bg-amber-700 text-white font-medium"
                >
                  Voir toute la catégorie "{categories[lang][selectedCategoryForSub]}"
                </button>
                
                {/* Liste des sous-catégories */}
                <div className="space-y-3">
                  {getSubcategoriesForCategory(selectedCategoryForSub)?.map((subcategory) => (
                    <button
                      key={subcategory}
                      onClick={() => {
                        handleSubcategoryClick(selectedCategoryForSub, subcategory);
                        setShowSubcategoryDropdown(false);
                        setSelectedCategoryForSub(null);
                      }}
                      className="w-full flex items-center justify-center space-x-2 p-4 rounded-lg transition-all duration-200 western-btn hover:scale-105 min-h-[60px]"
                    >
                      <Layers className="h-5 w-5 text-white flex-shrink-0" />
                      <span className="text-white text-sm text-center leading-tight font-medium">
                        {subcategory}
                      </span>
                    </button>
                  ))}
                </div>
                
                {/* Bouton retour */}
                <button
                  onClick={() => {
                    setShowSubcategoryDropdown(false);
                    setSelectedCategoryForSub(null);
                    setShowCategoryDropdown(true);
                  }}
                  className="w-full mt-4 flex items-center justify-center p-3 rounded-lg text-amber-800 hover:text-amber-900 hover:bg-amber-100 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Popup Filtres */}
        {showFilterDropdown && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="western-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl western-title flex items-center space-x-2">
                    <Filter className="h-6 w-6 text-amber-600" />
                    <span>Filtres par allergènes</span>
                  </h2>
                  <button
                    onClick={() => setShowFilterDropdown(false)}
                    className="text-amber-600 hover:text-amber-800 p-2 hover:bg-amber-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <p className="text-sm western-subtitle mb-4 text-center">
                  {translations.filterByAllergens[lang]}
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {availableAllergens.map(allergen => (
                    <button
                      key={allergen}
                      onClick={() => toggleAllergenFilter(allergen)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        hiddenAllergens.includes(allergen)
                          ? 'bg-red-600 text-white border-2 border-red-700 shadow-md'
                          : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-1">
                        {hiddenAllergens.includes(allergen) && (
                          <span>🚫</span>
                        )}
                        <span className="text-center">
                          {allergenTranslations[lang]?.[allergen] || allergen}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                
                {hiddenAllergens.length > 0 && (
                  <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      {hiddenAllergens.length} allergène(s) masqué(s)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {hiddenAllergens.map(allergen => (
                        <span
                          key={allergen}
                          className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded-full border border-red-600"
                        >
                          {allergenTranslations[lang]?.[allergen] || allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  {hiddenAllergens.length > 0 && (
                    <button
                      onClick={() => {
                        setHiddenAllergens([]);
                        setShowFilterDropdown(false);
                      }}
                      className="flex-1 western-btn px-4 py-3 rounded-lg text-sm"
                    >
                      Tout afficher
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilterDropdown(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg text-sm transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overlay pour fermer les popups en cliquant à l'extérieur */}
        {(showCategoryDropdown || showFilterDropdown || showSubcategoryDropdown) && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              setShowCategoryDropdown(false);
              setShowFilterDropdown(false);
              setShowSubcategoryDropdown(false);
              setSelectedCategoryForSub(null);
            }}
          />
        )}

        {/* Affichage conditionnel selon le mode */}
        {viewMode === 'grid' && (
          /* Affichage grille standard */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
                {error ? (
                  <div className="text-center">
                    <p className="western-subtitle text-lg text-red-600 mb-4">Erreur de connexion</p>
                    <p className="text-sm text-gray-600 mb-4">{error}</p>
                    <p className="text-sm text-amber-700">
                      Veuillez vous connecter à Supabase ou contacter l'administrateur.
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="western-subtitle text-lg">{translations.noDishesFound[lang]}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {translations.noDishesFound[lang]}. {translations.addDish[lang]} {translations.viaAdmin[lang]}.
                    </p>
                  </div>
                )}
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
                <p className="western-subtitle text-lg">{translations.noDishesFound[lang]}</p>
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
                <p className="western-subtitle text-lg">{translations.noDishesFound[lang]}</p>
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