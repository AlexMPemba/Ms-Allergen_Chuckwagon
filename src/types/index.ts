export interface Dish {
  id: string;
  nom: string;
  categorie: 'entrées' | 'plats' | 'desserts' | 'sauces' | 'huiles' | 'salades' | 'garnitures' | 'fromages';
  langue: 'fr' | 'en' | 'es' | 'pt' | 'it';
  langues?: ('fr' | 'en' | 'es' | 'pt' | 'it')[]; // Langues supplémentaires pour l'admin
  ingredients: string[];
  allergenes: string[];
  image?: string;
}

export type Language = 'fr' | 'en' | 'es' | 'pt' | 'it';
export type Language = 'fr' | 'en' | 'es' | 'it' | 'de' | 'nl' | 'pt';
export type Category = 'entrées' | 'plats' | 'desserts' | 'sauces' | 'huiles' | 'salades' | 'garnitures' | 'fromages' | 'accompagnements' | 'natama';

export interface LanguageConfig {
  code: Language;
  flag: string;
  name: string;
}

export interface Translations {
  [key: string]: {
    [L in Language]: string;
  };
}