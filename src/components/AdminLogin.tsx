import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn, RefreshCw, User, ChefHat } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    navigate(-1);
  };
  // Fonction de connexion
  const handleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect. Vérifiez vos identifiants.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Email non confirmé. Vérifiez votre boîte mail.');
        } else {
          setError(`Erreur de connexion: ${error.message}`);
        }
        console.error('Erreur d\'authentification:', error);
        return;
      }
      
      // Rediriger vers l'admin si connexion réussie
      navigate('/admin');
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      setError('Erreur de connexion. Vérifiez votre configuration Supabase.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen western-bg flex items-center justify-center p-4 page-transition">
      <div className="western-card rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md w-full stagger-item">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-amber-100 p-4 sm:p-6 rounded-full border-2 border-amber-800 hover:scale-110 transition-transform duration-300">
              <User className="h-12 w-12 sm:h-15 sm:w-15 md:h-18 md:w-18 text-amber-800" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl western-title mb-2 text-center">
            ADMINISTRATION
          </h1>
          <p className="western-subtitle text-sm sm:text-base md:text-lg text-center">
            Connexion requise
          </p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 border-2 border-red-600 rounded-lg">
            <p className="text-red-800 text-xs sm:text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium western-subtitle mb-2">Email</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full p-2 sm:p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
              placeholder="votre@email.com"
            />
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium western-subtitle mb-2">Mot de passe</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full p-2 sm:p-3 western-input rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
              placeholder="Votre mot de passe"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoggingIn || !loginEmail || !loginPassword}
          className="w-full flex items-center justify-center space-x-2 western-btn px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors disabled:opacity-50 mb-4 sm:mb-6 text-sm"
        >
          {isLoggingIn ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          <span>{isLoggingIn ? 'Connexion...' : 'Se connecter'}</span>
        </button>

        <div className="text-center">
          <button
            onClick={handleBack}
            className="flex items-center justify-center space-x-2 text-amber-600 hover:text-amber-800 transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </button>
        </div>
      </div>
    </div>
  );
}