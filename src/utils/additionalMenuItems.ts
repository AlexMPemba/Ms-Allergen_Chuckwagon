import { Dish } from '../types';

export const additionalMenuItems: Omit<Dish, 'id'>[] = [
  // SAUCES
  {
    nom: 'Moutarde de Dijon',
    categorie: 'sauces',
    langue: 'fr',
    ingredients: ['graines de moutarde', 'vinaigre', 'sel'],
    allergenes: ['Moutarde'],
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Mayonnaise',
    categorie: 'sauces',
    langue: 'fr',
    ingredients: ['œuf', 'huile', 'vinaigre', 'moutarde'],
    allergenes: ['Œufs', 'Moutarde'],
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Ketchup',
    categorie: 'sauces',
    langue: 'fr',
    ingredients: ['tomate', 'sucre', 'vinaigre', 'épices'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Sauce barbecue',
    categorie: 'sauces',
    langue: 'fr',
    ingredients: ['tomate', 'vinaigre', 'sucre', 'épices', 'fumée liquide'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Sauce au cheddar fondu',
    categorie: 'sauces',
    langue: 'fr',
    ingredients: ['cheddar', 'lait', 'beurre', 'farine'],
    allergenes: ['Lait', 'Gluten'],
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Sauce tomate',
    categorie: 'sauces',
    langue: 'fr',
    ingredients: ['tomate', 'oignon', 'ail', 'basilic', 'huile d\'olive'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Sauce bolognaise',
    categorie: 'sauces',
    langue: 'fr',
    ingredients: ['bœuf', 'tomate', 'oignon', 'carotte', 'céleri', 'vin rouge'],
    allergenes: ['Céleri'],
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Sauce beurre blanc',
    categorie: 'sauces',
    langue: 'fr',
    ingredients: ['beurre', 'échalote', 'vin blanc', 'crème'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Sauce crème aigre',
    categorie: 'sauces',
    langue: 'fr',
    ingredients: ['crème aigre', 'ciboulette', 'ail', 'citron'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400'
  },

  // PAINS (catégorie garnitures car pas de catégorie pain)
  {
    nom: 'Pain blanc',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['farine de blé', 'eau', 'levure', 'sel'],
    allergenes: ['Gluten'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Pain rectangle nature',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['farine de blé', 'eau', 'levure', 'sel'],
    allergenes: ['Gluten'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Pain au maïs',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['farine de maïs', 'farine de blé', 'eau', 'levure', 'sel'],
    allergenes: ['Gluten'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Pain de campagne (blé et seigle) – Vegan',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['farine de blé', 'farine de seigle', 'eau', 'levure', 'sel'],
    allergenes: ['Gluten'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Petit pain multigrains (sésame, pavot, tournesol)',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['farine de blé', 'graines de sésame', 'graines de pavot', 'graines de tournesol', 'eau', 'levure'],
    allergenes: ['Gluten', 'Sésame'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Pain complet sans gluten',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['farine de riz', 'farine de sarrasin', 'graines de tournesol', 'eau', 'levure'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },

  // DESSERTS
  {
    nom: 'Cornetto vanille, sauce fraise',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['glace vanille', 'fraise', 'gaufrette', 'sucre'],
    allergenes: ['Lait', 'Gluten'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Cornetto chocolat, cacao',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['glace chocolat', 'cacao', 'gaufrette', 'noisette'],
    allergenes: ['Lait', 'Gluten', 'Fruits à coque'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];