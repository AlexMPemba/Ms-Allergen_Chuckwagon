import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Settings, Shield } from 'lucide-react';
import { LanguageConfig } from '../types';
import { translations } from '../data/translations';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' }
];

export default function LanguageSelection() {
  const navigate = useNavigate();

  // Forcer le rendu et éviter les redirections automatiques
  useEffect(() => {
    // S'assurer que nous sommes bien sur la page de sélection des langues
    console.log('🌍 Page de sélection des langues chargée');
    
    // Empêcher toute redirection automatique
    const currentPath = window.location.pathname;
    if (currentPath !== '/' && currentPath !== '/languages') {
      console.log('🔄 Redirection vers sélection des langues depuis:', currentPath);
      window.history.replaceState(null, '', '/');
    }
  }, []);

  const handleLanguageSelect = (code: string) => {
    console.log('🌍 Langue sélectionnée:', code);
    navigate(`/${code}`);
  };

  return (
    <div className="min-h-screen western-bg flex items-center justify-center p-4 page-transition">
      <div className="western-card rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-auto stagger-item" style={{ minHeight: '400px' }}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/chuck-wagon-official-logo.png" 
              alt="Chuck Wagon Cafe Logo" 
              className="w-24 h-24 sm:w-30 sm:h-30 md:w-36 md:h-36 object-contain hover:scale-110 transition-transform duration-500"
            />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl western-title mb-2 text-center">
            ALLERGÈNES
          </h1>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className="w-full p-3 sm:p-4 flex items-center justify-center space-x-3 western-btn rounded-xl text-center stagger-item touch-manipulation"
              style={{ minHeight: '50px' }}
            >
              <span className="text-2xl">{language.flag}</span>
              <span className="text-sm sm:text-base font-medium menu-text">
                {language.name}
              </span>
            </button>
          ))}
        </div>
        
        {/* Note discrète en bas */}
        <div className="mt-6 pt-4 border-t border-amber-200">
          <button
            onClick={() => navigate('/administration')}
            className="w-full flex items-center justify-center space-x-2 text-amber-600 hover:text-amber-800 transition-colors p-2 rounded-lg hover:bg-amber-50 text-sm"
          >
            <Shield className="h-4 w-4" />
            <span>Administration</span>
          </button>
        </div>
      </div>
    </div>
  );
}