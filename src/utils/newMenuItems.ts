import { Dish } from '../types';

export const newA2MenuItems: Omit<Dish, 'id'>[] = [
  // ENTRÉES - SALADES BAR
  {
    nom: 'Carottes râpées',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['carotte', 'vinaigrette', 'persil'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Concombre',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['concombre', 'vinaigrette', 'aneth'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Chou-fleur',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['chou-fleur', 'vinaigrette'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Œuf dur',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['œuf'],
    allergenes: ['Œufs'],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Salade mélangée',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['salade verte', 'roquette', 'mâche'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Tomate',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['tomate', 'basilic', 'huile d\'olive'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Radis',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['radis', 'sel'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },

  // ASSORTIMENTS DE GRAINES ET FRUITS SECS
  {
    nom: 'Graine de chia',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['graines de chia'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Graine de sésame doré',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['graines de sésame'],
    allergenes: ['Sésame'],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Graine de sésame blanc',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['graines de sésame'],
    allergenes: ['Sésame'],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Canneberge',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['canneberges séchées'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Graine de courge',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['graines de courge'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Noix',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['noix'],
    allergenes: ['Fruits à coque'],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },

  // PLATS - OFFRE ÉPHÉMÈRE : ANIMATION BARBECUE
  {
    nom: 'Brochette de poulet (BBQ)',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['poulet', 'poivron', 'oignon', 'marinade', 'épices'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Brochette de bœuf (BBQ)',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['bœuf', 'poivron', 'oignon', 'marinade', 'épices'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Brochette 4 légumes (BBQ)',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['courgette', 'poivron', 'tomate', 'oignon', 'huile d\'olive'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Saucisse de porc au couteau (BBQ)',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['porc', 'épices', 'ail', 'persil'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Pomme au four (BBQ)',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['pomme', 'cannelle', 'sucre', 'beurre'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/209439/pexels-photo-209439.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Épis de maïs grillé ou nature (BBQ)',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['maïs', 'beurre', 'sel'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },

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
    nom: 'Cornetto Royal chocolat',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['glace', 'chocolat', 'gaufrette', 'noisette'],
    allergenes: ['Lait', 'Gluten', 'Fruits à coque'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];