import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, ChefHat, ArrowLeft, Check, X, Leaf } from 'lucide-react';
import { Language } from '../types';
import { translations, allergenTranslations } from '../data/translations';

export default function AllergenSelectionPage() {
  const { language } = useParams<{ language: string }>();
  const navigate = useNavigate();
  const lang = language as Language || 'fr';
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [showNatamaBubble, setShowNatamaBubble] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [isOscillating, setIsOscillating] = useState(false);

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

  const handleBack = () => {
    navigate(-1);
  };

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens(prev => {
      const newSelection = prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen];
      
      return newSelection;
    });
  };

  // Effet pour gérer l'affichage de la bulle Natama
  useEffect(() => {
    if (selectedAllergens.length >= 3) {
      // Afficher la bulle immédiatement
      setShowNatamaBubble(true);
      setBubbleVisible(true);
      
      // Démarrer l'oscillation après 3 secondes
      const oscillationTimeout = setTimeout(() => {
        setIsOscillating(true);
        setTimeout(() => setIsOscillating(false), 1000); // Oscillation dure 1 seconde
      }, 2500);
      
      // Oscillation toutes les 6 secondes avec clignotement
      const blinkInterval = setInterval(() => {
        setBubbleVisible(false);
        setTimeout(() => {
          setBubbleVisible(true);
          setIsOscillating(true);
          setTimeout(() => setIsOscillating(false), 1000);
        }, 500);
      }, 6000);
      
      return () => {
        clearInterval(blinkInterval);
        clearTimeout(oscillationTimeout);
      };
    } else {
      // Masquer la bulle si moins de 3 allergènes
      setShowNatamaBubble(false);
      setBubbleVisible(false);
      setIsOscillating(false);
    }
  }, [selectedAllergens.length]);

  const handleNatamaClick = () => {
    navigate(`/${lang}/category/Natama`);
  };

  const handleContinue = () => {
    // Stocker les allergènes sélectionnés dans le localStorage
    localStorage.setItem('selectedAllergens', JSON.stringify(selectedAllergens));
    navigate(`/${lang}/menu`);
  };

  const clearAll = () => {
    setSelectedAllergens([]);
  };

  return (
    <div className="min-h-screen western-bg flex items-center justify-center p-4 page-transition">
      <div className="western-card rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-lg md:max-w-2xl w-full stagger-item">
        <div className="text-center mb-8">
          <div className="bg-amber-100 p-4 sm:p-6 rounded-full border-2 border-amber-800 flex items-center justify-center hover:scale-110 transition-transform duration-300 mx-auto w-fit">
            <AlertTriangle className="h-12 w-12 sm:h-15 sm:w-15 md:h-18 md:w-18 text-amber-800" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl western-title mb-2 western-ornament text-center mt-4">
            {translations.selectAllergens[lang]}
          </h1>
          <div className="flex justify-center mb-4">
            <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 text-amber-800" />
          </div>
          <p className="western-subtitle text-sm sm:text-base md:text-lg text-center mb-6">
            {translations.allergenSelectionDescription[lang]}
          </p>
        </div>

        {/* Sélection des allergènes */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium western-subtitle">
              {translations.allergensSelected[lang]} ({selectedAllergens.length})
            </h3>
            {selectedAllergens.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                {translations.clearAll[lang]}
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableAllergens.map(allergen => (
              <button
                key={allergen}
                onClick={() => toggleAllergen(allergen)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                  selectedAllergens.includes(allergen)
                    ? 'bg-red-600 text-white border-red-700 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm">
                    {allergenTranslations[lang]?.[allergen] || allergen}
                  </span>
                  {selectedAllergens.includes(allergen) ? (
                    <Check className="h-4 w-4 ml-1" />
                  ) : (
                    <div className="w-4 h-4 ml-1"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Résumé des allergènes sélectionnés */}
        {selectedAllergens.length > 0 && (
          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {translations.allergensToAvoid[lang]}
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedAllergens.map(allergen => (
                <span
                  key={allergen}
                  className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded-full border border-red-600 flex items-center"
                >
                  {allergenTranslations[lang]?.[allergen] || allergen}
                  <button
                    onClick={() => toggleAllergen(allergen)}
                    className="ml-1 hover:bg-red-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <p className="text-xs text-red-700 mt-2">
              {translations.dishesWithAllergensHidden[lang]}
            </p>
          </div>
        )}

        {/* Bulle de suggestion Natama - positionnée entre les deux notifications */}
        {showNatamaBubble && (
          <div className={`bg-green-100 border-2 border-green-600 rounded-lg p-4 mb-6 shadow-lg transition-opacity duration-300 ${
            bubbleVisible ? 'opacity-100' : 'opacity-70'
          } ${
            isOscillating ? 'natama-oscillate' : ''
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              <Leaf className="h-5 w-5 text-green-600" />
              <h4 className="text-sm font-medium text-green-800">
                Trop d'allergènes ? Essayez les plats Natama
              </h4>
              <button
                onClick={() => {
                  setShowNatamaBubble(false);
                  setBubbleVisible(false);
                }}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-green-700 mb-3">
              Les plats Natama sont spécialement conçus pour les personnes avec de multiples allergies.
            </p>
            <button
              onClick={handleNatamaClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Voir les plats Natama
            </button>
          </div>
        )}

        {/* Note informative */}
        <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4 mb-6">
          <p className="western-subtitle text-xs sm:text-sm text-center leading-relaxed">
            <strong>Note :</strong> {translations.modifySelectionNote[lang]}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 western-btn px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base md:text-lg font-medium w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{translations.back[lang]}</span>
          </button>
          
          <button
            onClick={handleContinue}
            className="western-btn px-6 sm:px-8 py-2 sm:py-3 rounded-xl text-sm sm:text-base md:text-lg font-medium w-full sm:w-auto flex items-center justify-center space-x-2"
          >
            <span>{translations.continueToMenu[lang]}</span>
          </button>
        </div>
      </div>
    </div>
  );
}