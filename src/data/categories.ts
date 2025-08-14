import { CategoryWithSubcategories, Category } from '../types';

// Configuration exacte des catégories selon les spécifications
export const categoriesConfig: CategoryWithSubcategories[] = [
  { 
    categorie: "Entrées", 
    sous_categorie: ["Bar à Salades", "Charcuterie", "Produits de la mer", "Soupes", "Assortiment de graines et fruits secs"] 
  },
  { 
    categorie: "Plats", 
    sous_categorie: null 
  },
  { 
    categorie: "Desserts", 
    sous_categorie: ["Desserts fruités", "Glaces", "Gâteau d'anniversaire"] 
  },
  { 
    categorie: "Sauces", 
    sous_categorie: ["Sauces condiment", "Sauces salade"] 
  },
  { 
    categorie: "Accompagnements", 
    sous_categorie: null 
  },
  { 
    categorie: "Garniture", 
    sous_categorie: null 
  },
  { 
    categorie: "Fromages", 
    sous_categorie: null 
  },
  { 
    categorie: "Huiles", 
    sous_categorie: null 
  },
  { 
    categorie: "Nutrisens", 
    sous_categorie: null 
  },
  { 
    categorie: "Halal", 
    sous_categorie: null 
  },
  { 
    categorie: "Casher", 
    sous_categorie: null 
  },
  { 
    categorie: "Boissons chaudes", 
    sous_categorie: null 
  }
];

// Fonction pour obtenir les sous-catégories d'une catégorie
export const getSubcategoriesForCategory = (category: Category): string[] | null => {
  const config = categoriesConfig.find(c => c.categorie === category);
  return config?.sous_categorie || null;
};

// Fonction pour vérifier si une sous-catégorie est valide pour une catégorie
export const isValidSubcategory = (category: Category, subcategory: string | null): boolean => {
  if (subcategory === null) return true;
  
  const validSubcategories = getSubcategoriesForCategory(category);
  if (validSubcategories === null) return subcategory === null;
  
  return validSubcategories.includes(subcategory);
};

// Liste de toutes les catégories disponibles
export const allCategories: Category[] = categoriesConfig.map(c => c.categorie);

// Liste de toutes les sous-catégories disponibles
export const allSubcategories: string[] = categoriesConfig
  .filter(c => c.sous_categorie !== null)
  .flatMap(c => c.sous_categorie as string[]);