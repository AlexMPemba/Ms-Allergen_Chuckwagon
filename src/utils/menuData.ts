import { Dish } from '../types';

export const completeA2Menu: Omit<Dish, 'id'>[] = [
  // PLATS PRINCIPAUX
  {
    nom: 'Aiguillettes de limande',
    categorie: 'Plats',
    sous_categorie: null,
    langue: 'fr',
    ingredients: ['limande', 'beurre', 'citron', 'persil', 'huile d\'olive'],
    allergenes: ['Poisson'],
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Manchons de poulet aux épices',
    categorie: 'Plats',
    sous_categorie: null,
    langue: 'fr',
    ingredients: ['poulet', 'paprika', 'cumin', 'thym', 'huile d\'olive'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Bouchée de poulet pané',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['poulet', 'farine', 'œuf', 'chapelure', 'huile'],
    allergenes: ['Gluten', 'Œufs'],
    image: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Gaufre fourrée aux fromages Mickey',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['farine', 'œuf', 'lait', 'fromage', 'beurre'],
    allergenes: ['Gluten', 'Œufs', 'Lait'],
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Omelette à l\'emmental',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['œuf', 'emmental', 'beurre', 'lait'],
    allergenes: ['Œufs', 'Lait'],
    image: 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Omelette aux fines herbes',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['œuf', 'persil', 'ciboulette', 'estragon', 'beurre'],
    allergenes: ['Œufs'],
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Omelette au bacon grillé',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['œuf', 'bacon', 'beurre', 'poivre'],
    allergenes: ['Œufs'],
    image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Travers de porc fumé',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['porc', 'sauce barbecue', 'paprika', 'miel'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/323682/pexels-photo-323682.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Saucisse de porc aux herbes',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['porc', 'thym', 'romarin', 'ail', 'sel'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Longe de porc sauce teriyaki',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['porc', 'sauce soja', 'miel', 'gingembre', 'ail'],
    allergenes: ['Soja'],
    image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Sauté de bœuf au maïs',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['bœuf', 'maïs', 'oignon', 'poivron', 'huile d\'olive'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Aiguillette de poulet Tex-Mex',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['poulet', 'paprika', 'cumin', 'piment', 'tomate'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Haut de cuisses de poulet aux épices fumées',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['poulet', 'paprika fumé', 'thym', 'romarin', 'ail'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Faux filet sauce au poivre',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['bœuf', 'poivre', 'crème', 'cognac', 'beurre'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Faux filet sauce Cantadou',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['bœuf', 'fromage', 'crème', 'ail', 'fines herbes'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-chop-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Saumon rôti au paprika fumé',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['saumon', 'paprika fumé', 'huile d\'olive', 'citron'],
    allergenes: ['Poisson'],
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Wok de légumes',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['brocoli', 'carotte', 'poivron', 'courgette', 'sauce soja'],
    allergenes: ['Soja'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Wok de bœuf',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['bœuf', 'brocoli', 'carotte', 'sauce soja', 'gingembre'],
    allergenes: ['Soja'],
    image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Wok de poulet',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['poulet', 'légumes', 'sauce soja', 'gingembre', 'ail'],
    allergenes: ['Soja'],
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Lasagnes Tex-Mex',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['pâtes', 'bœuf', 'tomate', 'fromage', 'épices'],
    allergenes: ['Gluten', 'Lait'],
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Chili vegan',
    categorie: 'plats',
    langue: 'fr',
    ingredients: ['haricots rouges', 'tomate', 'oignon', 'poivron', 'épices'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
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

  // GARNITURES
  {
    nom: 'Pommes de terre croustillantes Mickey',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['pommes de terre', 'huile', 'sel', 'épices'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Pommes de terre rôties au thym',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['pommes de terre', 'thym', 'huile d\'olive', 'sel'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Pommes de terre au four',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['pommes de terre', 'beurre', 'sel', 'poivre'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Frites',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['pommes de terre', 'huile', 'sel'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Pâtes farcies à la viande braisée',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['pâtes', 'bœuf', 'tomate', 'oignon', 'herbes'],
    allergenes: ['Gluten'],
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Pâtes du Far West',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['pâtes', 'sauce tomate', 'épices', 'fromage'],
    allergenes: ['Gluten', 'Lait'],
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Raviolis Mickey aux fromages',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['pâtes', 'fromage', 'ricotta', 'parmesan'],
    allergenes: ['Gluten', 'Lait'],
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Duo de riz blanc et rouge',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['riz blanc', 'riz rouge', 'bouillon'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Duo de riz noir et rouge',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['riz noir', 'riz rouge', 'bouillon'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Légumes de saison',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['légumes variés', 'huile d\'olive', 'herbes'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Haricots verts',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['haricots verts', 'beurre', 'ail'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Champignons, allumettes fumées aux protéines de soja à la bourguignonne',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['champignons', 'protéines de soja', 'vin rouge', 'oignon'],
    allergenes: ['Soja'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Épis de maïs',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['maïs', 'beurre', 'sel'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Poêlée de champignons',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['champignons', 'beurre', 'ail', 'persil'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Légumes de printemps',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['petits pois', 'carotte', 'navet', 'beurre'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Légumes du soleil',
    categorie: 'garnitures',
    langue: 'fr',
    ingredients: ['tomate', 'courgette', 'aubergine', 'poivron', 'herbes de Provence'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },

  // SALADES (BAR)
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

  // SALADES COMPOSÉES
  {
    nom: 'Salade de pomme de terre au poulet tex-mex',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['pommes de terre', 'poulet', 'épices tex-mex', 'mayonnaise'],
    allergenes: ['Œufs'],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Salade de chou rouge',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['chou rouge', 'vinaigrette', 'pomme'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Salade de haricots rouges, maïs et poivron',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['haricots rouges', 'maïs', 'poivron', 'vinaigrette'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Salade Quinoa Boulgour, légumes et tofu fumé (Vegan)',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['quinoa', 'boulgour', 'tofu fumé', 'légumes', 'vinaigrette'],
    allergenes: ['Soja'],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Coleslaw aux canneberges et graines de courge',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['chou blanc', 'carotte', 'canneberges', 'graines de courge', 'mayonnaise'],
    allergenes: ['Œufs'],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Salade de saumon et pamplemousse',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['saumon', 'pamplemousse', 'salade verte', 'vinaigrette'],
    allergenes: ['Poisson'],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Salade de crevettes, tomate et fruits, au paprika fumé',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['crevettes', 'tomate', 'fruits', 'paprika fumé'],
    allergenes: ['Crustacés'],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Salade de riz et maïs',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['riz', 'maïs', 'vinaigrette', 'herbes'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Salade d\'avocat, épi de maïs, cactus et coriandre',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['avocat', 'maïs', 'cactus', 'coriandre', 'citron vert'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Salade de pâtes, tomates et pesto',
    categorie: 'salades',
    langue: 'fr',
    ingredients: ['pâtes', 'tomate', 'pesto', 'basilic'],
    allergenes: ['Gluten', 'Fruits à coque'],
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400'
  },

  // FROMAGES
  {
    nom: 'Brie de Meaux',
    categorie: 'fromages',
    langue: 'fr',
    ingredients: ['lait de vache', 'ferments lactiques'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Fourme d\'Ambert',
    categorie: 'fromages',
    langue: 'fr',
    ingredients: ['lait de vache', 'penicillium roqueforti'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Pepper Jack',
    categorie: 'fromages',
    langue: 'fr',
    ingredients: ['lait de vache', 'piment', 'épices'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Chèvre',
    categorie: 'fromages',
    langue: 'fr',
    ingredients: ['lait de chèvre', 'ferments lactiques'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=400'
  },

  // DESSERTS
  {
    nom: 'Cup cake Woody',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['farine', 'sucre', 'œuf', 'beurre', 'chocolat'],
    allergenes: ['Gluten', 'Œufs', 'Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Crumble aux pommes',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['pomme', 'farine', 'beurre', 'sucre', 'cannelle'],
    allergenes: ['Gluten', 'Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Crumble aux fruits rouges',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['fruits rouges', 'farine', 'beurre', 'sucre'],
    allergenes: ['Gluten', 'Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Pudding',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['lait', 'œuf', 'sucre', 'vanille'],
    allergenes: ['Lait', 'Œufs'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Brownie',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['chocolat', 'beurre', 'sucre', 'œuf', 'farine'],
    allergenes: ['Gluten', 'Œufs', 'Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Fondant au chocolat',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['chocolat', 'beurre', 'œuf', 'sucre', 'farine'],
    allergenes: ['Gluten', 'Œufs', 'Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Cheesecake américain',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['fromage blanc', 'biscuit', 'beurre', 'sucre', 'œuf'],
    allergenes: ['Lait', 'Gluten', 'Œufs'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Coulis de framboise',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['framboise', 'sucre'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Coulant chocolat cœur framboise sans gluten',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['chocolat', 'beurre', 'œuf', 'sucre', 'framboise'],
    allergenes: ['Œufs', 'Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Gâteau chocolat et noisette',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['chocolat', 'noisette', 'farine', 'œuf', 'beurre'],
    allergenes: ['Gluten', 'Œufs', 'Lait', 'Fruits à coque'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Gâteau moelleux aux carottes',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['carotte', 'farine', 'œuf', 'sucre', 'huile', 'cannelle'],
    allergenes: ['Gluten', 'Œufs'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Tarte crème de noisette et orange',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['pâte brisée', 'noisette', 'orange', 'crème', 'sucre'],
    allergenes: ['Gluten', 'Fruits à coque', 'Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Donuts saveur chocolat',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['farine', 'sucre', 'œuf', 'chocolat', 'huile'],
    allergenes: ['Gluten', 'Œufs'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Gelée goût fraise',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['gélatine', 'fraise', 'sucre'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Gelée goût citron',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['gélatine', 'citron', 'sucre'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Île flottante',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['œuf', 'lait', 'sucre', 'vanille'],
    allergenes: ['Œufs', 'Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Yaourt à la grecque',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['yaourt grec', 'miel'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Crème renversée',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['lait', 'œuf', 'sucre', 'caramel'],
    allergenes: ['Lait', 'Œufs'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Mousse au chocolat',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['chocolat', 'œuf', 'sucre', 'crème'],
    allergenes: ['Œufs', 'Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Pâtes de fruits',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['fruits', 'sucre', 'pectine'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Entremet mousse myrtilles, croustillant praliné',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['myrtilles', 'crème', 'praliné', 'biscuit'],
    allergenes: ['Lait', 'Fruits à coque'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Entremet mousse chocolat blanc, génoise cacao',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['chocolat blanc', 'crème', 'génoise', 'cacao'],
    allergenes: ['Lait', 'Gluten', 'Œufs'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Tartelette citron',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['pâte sablée', 'citron', 'œuf', 'sucre', 'beurre'],
    allergenes: ['Gluten', 'Œufs', 'Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Tarte Macao (chocolat et cacao)',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['chocolat', 'cacao', 'pâte brisée', 'crème', 'œuf'],
    allergenes: ['Gluten', 'Lait', 'Œufs'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Tartelette Mickey au chocolat',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['pâte sablée', 'chocolat', 'crème', 'beurre'],
    allergenes: ['Gluten', 'Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Tarte normande',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['pomme', 'pâte brisée', 'crème', 'œuf', 'calvados'],
    allergenes: ['Gluten', 'Lait', 'Œufs'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Tarte au citron meringuée',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['citron', 'pâte brisée', 'œuf', 'sucre', 'beurre'],
    allergenes: ['Gluten', 'Œufs', 'Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Tarte aux noix de pécan',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['noix de pécan', 'pâte brisée', 'œuf', 'sucre', 'sirop d\'érable'],
    allergenes: ['Fruits à coque', 'Gluten', 'Œufs'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Tarte aux poires et amande',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['poire', 'amande', 'pâte brisée', 'crème', 'sucre'],
    allergenes: ['Fruits à coque', 'Gluten', 'Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Tarte à la purée de cerise',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['cerise', 'pâte brisée', 'sucre', 'œuf'],
    allergenes: ['Gluten', 'Œufs'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Entremet exotique Woody',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['mangue', 'ananas', 'coco', 'crème', 'gélatine'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Entremet chocolat banane et passion vegan',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['chocolat', 'banane', 'fruit de la passion', 'lait végétal'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Dessert de pommes',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['pomme', 'cannelle', 'sucre'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Salade de fruits',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['fruits de saison', 'sucre', 'menthe'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Melon jaune',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['melon'],
    allergenes: [],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Cornetto Royal chocolat',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['glace', 'chocolat', 'gaufrette', 'noisette'],
    allergenes: ['Lait', 'Gluten', 'Fruits à coque'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Cornetto vanille, sauce fraise',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['glace vanille', 'fraise', 'gaufrette', 'sucre'],
    allergenes: ['Lait', 'Gluten'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Glace cacao et parfum vanille',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['lait', 'crème', 'cacao', 'vanille', 'sucre'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    nom: 'Glace parfums vanille et fraise',
    categorie: 'desserts',
    langue: 'fr',
    ingredients: ['lait', 'crème', 'vanille', 'fraise', 'sucre'],
    allergenes: ['Lait'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },

  // SAUCES (9 nouveaux items)
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

  // PAINS (6 nouveaux items dans garnitures)
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

  // DESSERTS CORNETTO (2 nouveaux items)
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