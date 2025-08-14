export interface Dish {
  id: string;
  nom: string;
  categorie: 'Entrées' | 'Plats' | 'Desserts' | 'Sauces' | 'Accompagnements' | 'Garniture' | 'Fromages' | 'Huiles' | 'Natama' | 'Halal' | 'Casher' | 'Boissons chaudes';
  sous_categorie?: string | null;
  langue: 'fr' | 'en' | 'es' | 'pt' | 'it';
  langues?: ('fr' | 'en' | 'es' | 'pt' | 'it')[]; // Langues supplémentaires pour l'admin
  ingredients: string[];
  allergenes: string[];
  image?: string;
}

export type Language = 'fr' | 'en' | 'es' | 'pt' | 'it';
export type Language = 'fr' | 'en' | 'es' | 'it' | 'de' | 'nl' | 'pt';
export type Category = 'Entrées' | 'Plats' | 'Desserts' | 'Sauces' | 'Accompagnements' | 'Garniture' | 'Fromages' | 'Huiles' | 'Nutrisens' | 'Halal' | 'Casher' | 'Boissons chaudes';

export interface CategoryWithSubcategories {
  categorie: Category;
  sous_categorie: string[] | null;
}

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