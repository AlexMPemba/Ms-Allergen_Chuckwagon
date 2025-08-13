import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChefHat, AlertCircle, Utensils } from 'lucide-react';
import { Language } from '../types';
import { useDishes } from '../hooks/useDishes';
import { translations, categories, allergenTranslations, translateIngredient } from '../data/translations';

export default function DishDetail() {
  const { language, dishId } = useParams<{ language: string; dishId: string }>();
  const navigate = useNavigate();
  const lang = language as Language || 'fr';
  const { dishes, loading } = useDishes();

  const dish = dishes.find(d => d.id === dishId);

  const handleBack = () => {
    navigate(-1);
  };
  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen western-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-amber-600 mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
          </div>
          <p className="western-subtitle text-lg">{translations.loadingDishes[lang]}</p>
        </div>
      </div>
    );
  }

  // Afficher erreur seulement si pas de chargement et pas de plat
  if (!loading && !dish) {
    return (
      <div className="min-h-screen western-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl western-title mb-4">{translations.dishNotFound[lang]}</h2>
          <button
            onClick={handleBack}
            className="inline-flex items-center space-x-2 western-btn px-6 py-3 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{translations.back[lang]}</span>
          </button>
        </div>
      </div>
    );
  }

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
              <Link to="/" className="flex items-center justify-center space-x-2 western-subtitle flex-1">
                <ChefHat className="h-6 w-6" />
                <span className="font-medium western-title text-lg">CHUCK WAGON</span>
              </Link>
              
              {/* Espace vide pour équilibrer */}
              <div className="w-10 h-10"></div>
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
            <Link to="/" className="flex items-center justify-center space-x-2 western-subtitle absolute left-1/2 transform -translate-x-1/2">
              <ChefHat className="h-6 w-6" />
              <span className="font-medium western-title text-lg">CHUCK WAGON</span>
            </Link>
            
            {/* Espace vide pour équilibrer */}
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="western-card rounded-2xl shadow-lg overflow-hidden">
          {dish.image && (
            <div className="h-48 sm:h-64 md:h-80 overflow-hidden border-b-4 border-amber-800 group">
              <img
                src={dish.image}
                alt={dish.nom}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          )}

          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl western-title mb-2 western-ornament">{dish.nom}</h1>
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium border border-amber-600">
                <span className="menu-text">{categories[lang][dish.categorie]}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {/* Ingredients */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Utensils className="h-5 w-5 text-amber-700" />
                  <h2 className="text-lg md:text-xl font-semibold category-header">
                    {translations.ingredients[lang]}
                  </h2>
                </div>
                <div className="space-y-2">
                  {dish.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 md:p-3 bg-amber-50 rounded-lg border border-amber-200"
                    >
                      <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                      <span className="menu-text text-sm md:text-base">
                        {translateIngredient(ingredient, lang)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergenes */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-red-700" />
                  <h2 className="text-lg md:text-xl font-semibold category-header">
                    {translations.allergens[lang]}
                  </h2>
                </div>
                {dish.allergenes.length > 0 ? (
                  <div className="space-y-2">
                    {dish.allergenes.map((allergen, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 md:p-3 bg-red-100 border-2 border-red-600 rounded-lg"
                      >
                        <AlertCircle className="h-4 w-4 text-red-700" />
                        <span className="text-red-800 font-medium menu-text text-sm md:text-base">
                          {allergenTranslations[lang]?.[allergen] || allergen}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 md:p-4 bg-green-100 border-2 border-green-600 rounded-lg">
                    <p className="text-green-800 menu-text text-sm md:text-base">{translations.noAllergens[lang]}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200">
              <p className="text-xs md:text-sm menu-text text-center italic">{translations.allergenInfo[lang]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}