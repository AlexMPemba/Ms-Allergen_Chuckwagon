import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, ChefHat, ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

export default function WarningPage() {
  const { language } = useParams<{ language: string }>();
  const navigate = useNavigate();
  const lang = language as Language || 'fr';

  const handleContinue = () => {
    navigate(`/${lang}/allergens`);
  };

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="min-h-screen western-bg flex items-center justify-center p-4 page-transition">
      <div className="western-card rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-lg md:max-w-2xl w-full stagger-item">
        <div className="text-center mb-8">
            <div className="bg-amber-100 p-4 sm:p-6 rounded-full border-2 border-amber-800 flex items-center justify-center hover:scale-110 transition-transform duration-300 mx-auto w-fit">
              <AlertTriangle className="h-12 w-12 sm:h-15 sm:w-15 md:h-18 md:w-18 text-amber-800" />
            </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl western-title mb-2 western-ornament text-center mt-4">
            {translations.warning[lang]}
          </h1>
          <div className="flex justify-center mb-4">
            <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 text-amber-800" />
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          <div className="bg-amber-50 border-2 border-amber-600 rounded-lg p-4 sm:p-6">
            <p className="western-subtitle text-sm sm:text-base md:text-lg text-center leading-relaxed">
              {translations.crossContamination[lang]}
            </p>
          </div>

          <div className="bg-amber-50 border-2 border-amber-600 rounded-lg p-4 sm:p-6">
            <p className="western-subtitle text-sm sm:text-base md:text-lg text-center leading-relaxed">
              {translations.askCastMember[lang]}
            </p>
          </div>
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
            className="western-btn px-6 sm:px-8 py-2 sm:py-3 rounded-xl text-sm sm:text-base md:text-lg font-medium w-full sm:w-auto"
          >
            {translations.ok[lang]}
          </button>
        </div>
      </div>
    </div>
  );
}