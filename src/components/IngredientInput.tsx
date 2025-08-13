import React, { useState, useRef, useEffect } from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';
import { ingredientTranslations } from '../data/translations';

interface IngredientInputProps {
  value: string[];
  onChange: (ingredients: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function IngredientInput({ value, onChange, placeholder, className }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [unrecognizedIngredients, setUnrecognizedIngredients] = useState<string[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Liste de tous les ingrédients disponibles (français uniquement)
  const availableIngredients = Object.keys(ingredientTranslations.fr);

  // Filtrer les suggestions basées sur l'input
  useEffect(() => {
    if (inputValue.trim().length > 1) {
      const filtered = availableIngredients.filter(ingredient =>
        ingredient.toLowerCase().includes(inputValue.toLowerCase().trim())
      ).slice(0, 8); // Limiter à 8 suggestions
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue]);

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ajouter un ingrédient depuis les suggestions
  const addIngredientFromSuggestion = (ingredient: string) => {
    if (!value.includes(ingredient)) {
      onChange([...value, ingredient]);
    }
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Ajouter un ingrédient manuellement
  const addIngredientManually = () => {
    const ingredient = inputValue.trim();
    if (ingredient && !value.includes(ingredient)) {
      // Vérifier si l'ingrédient est reconnu
      const isRecognized = availableIngredients.some(available => 
        available.toLowerCase() === ingredient.toLowerCase()
      );

      if (!isRecognized) {
        // Ajouter à la liste des ingrédients non reconnus
        setUnrecognizedIngredients(prev => {
          if (!prev.includes(ingredient)) {
            return [...prev, ingredient];
          }
          return prev;
        });
        setShowWarning(true);
      }

      onChange([...value, ingredient]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  // Supprimer un ingrédient
  const removeIngredient = (index: number) => {
    const newIngredients = value.filter((_, i) => i !== index);
    onChange(newIngredients);
    
    // Retirer de la liste des non reconnus si nécessaire
    const removedIngredient = value[index];
    setUnrecognizedIngredients(prev => prev.filter(ing => ing !== removedIngredient));
    
    // Masquer l'avertissement si plus d'ingrédients non reconnus
    if (unrecognizedIngredients.length <= 1) {
      setShowWarning(false);
    }
  };

  // Gérer la touche Entrée
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0 && showSuggestions) {
        addIngredientFromSuggestion(suggestions[0]);
      } else {
        addIngredientManually();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Champ de saisie avec suggestions */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Tapez pour rechercher un ingrédient..."}
          className={`w-full p-2 sm:p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500 text-sm ${className || ''}`}
        />

        {/* Liste des suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border-2 border-amber-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => addIngredientFromSuggestion(suggestion)}
                className="w-full text-left px-3 py-2 hover:bg-amber-50 border-b border-amber-100 last:border-b-0 text-sm western-subtitle transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span>{suggestion}</span>
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bouton d'ajout manuel */}
      {inputValue.trim() && !suggestions.some(s => s.toLowerCase() === inputValue.toLowerCase().trim()) && (
        <button
          onClick={addIngredientManually}
          className="w-full flex items-center justify-center space-x-2 p-2 border-2 border-dashed border-amber-400 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors text-sm"
        >
          <span>Ajouter "{inputValue.trim()}" (non reconnu)</span>
          <AlertTriangle className="h-4 w-4" />
        </button>
      )}

      {/* Avertissement pour ingrédients non reconnus */}
      {showWarning && unrecognizedIngredients.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-orange-800 mb-1">
                Ingrédients non reconnus
              </h4>
              <p className="text-xs text-orange-700 mb-2">
                Les ingrédients suivants ne seront pas traduits automatiquement :
              </p>
              <div className="flex flex-wrap gap-1">
                {unrecognizedIngredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded-full"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowWarning(false)}
              className="text-orange-600 hover:text-orange-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Liste des ingrédients ajoutés */}
      {value.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-medium western-subtitle">
            Ingrédients ajoutés ({value.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {value.map((ingredient, index) => {
              const isRecognized = availableIngredients.some(available => 
                available.toLowerCase() === ingredient.toLowerCase()
              );
              
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                    isRecognized 
                      ? 'bg-green-100 text-green-800 border border-green-600' 
                      : 'bg-orange-100 text-orange-800 border border-orange-600'
                  }`}
                >
                  <span>{ingredient}</span>
                  {isRecognized ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <AlertTriangle className="h-3 w-3" />
                  )}
                  <button
                    onClick={() => removeIngredient(index)}
                    className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}