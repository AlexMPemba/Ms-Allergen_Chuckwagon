import { supabase } from '../lib/supabase';

// Mapping des noms de plats avec leurs URLs d'images
const dishImageMappings: Record<string, string> = {
  'Aiguillette de poulet Tex-Mex': 'https://i.ibb.co/9mXLkqGq/Aiguillette-de-poulet-Tex-Mex.jpg',
  'Aiguillettes de limande': 'https://i.ibb.co/GQjyd2fy/Aiguillettes-de-limande.jpg',
  'Salade Quinoa Boulgour, légumes et tofu fumé (Vegan)': 'https://i.ibb.co/NnSs2KTN/alade-Quinoa-Boulgour-l-gumes-et-tofu-fum-Vegan.jpg',
  'Brie de Meaux': 'https://i.ibb.co/Kx0QnNwV/Brie-de-Meaux.jpg',
  'Brownie': 'https://i.ibb.co/27vjWwvC/Brownie.jpg',
  'Carottes râpées': 'https://i.ibb.co/RTH2GTs7/Carottes-r-p-es.jpg',
  'Cheddar râpé': 'https://i.ibb.co/G1tN828/Cheddar-r-p.jpg',
  'Chèvre': 'https://i.ibb.co/HptNksy7/Ch-vre.jpg',
  'Chili vegan': 'https://i.ibb.co/S7xCD1rv/Chili-vegan-Chili-vegan.jpg',
  'Chorizo': 'https://i.ibb.co/4Z0ncCMK/Chorizo.jpg',
  'Chou-fleur': 'https://i.ibb.co/XfvgkDCw/Chou-fleur.jpg',
  'Citron vert citron jaune': 'https://i.ibb.co/C38fX6TP/Citron-vert-citron-jaune.jpg',
  'Coleslaw aux canneberges et graines de courge': 'https://i.ibb.co/1tP17Ycc/Coleslaw-aux-canneberges-et-graines-de-courge.jpg',
  'Cornetto Royal chocolat': 'https://i.ibb.co/Y468j9Mc/Cornetto-Royal-chocolat.jpg',
  'Cornetto vanille, sauce fraise': 'https://i.ibb.co/ymQG36PS/Cornetto-vanille-sauce-fraise.jpg',
  'Cornichons': 'https://i.ibb.co/8Lv0DfMR/Cornichons.jpg',
  'Coulant chocolat cœur framboise sans gluten': 'https://i.ibb.co/zhxxM5Q4/Coulant-chocolat-c-ur-framboise-sans-gluten.jpg',
  'Coulis de framboise': 'https://i.ibb.co/21FyqbWJ/Coulis-de-framboise.jpg',
  'Crème renversée': 'https://i.ibb.co/FqzmyTc2/Cr-me-renvers-e.jpg',
  'Croûtons nature': 'https://i.ibb.co/bg1WsKwv/Cro-tons-nature.jpg',
  'Cup cake Woody': 'https://i.ibb.co/CKHsQVn1/Cup-cake-Woody.jpg',
  'Dessert de pommes': 'https://i.ibb.co/4wCwvv52/Dessert-de-pommes.jpg',
  'Donuts saveur chocolat': 'https://i.ibb.co/sJDh9Zmw/Donuts-saveur-chocolat.jpg',
  'Duo de riz blanc et rouge': 'https://i.ibb.co/5hf3CzFC/Duo-de-riz-blanc-et-rouge.jpg',
  'Emmental râpé': 'https://i.ibb.co/s9QNGdf3/Emmental-r-p.jpg',
  'Entremet chocolat banane et passion vegan': 'https://i.ibb.co/bRskGh5H/Entremet-chocolat-banane-et-passion-vegan.jpg',
  'Entremet exotique Woody': 'https://i.ibb.co/mC27QX5f/Entremet-exotique-Woody.jpg',
  'Épis de maïs grillé ou nature': 'https://i.ibb.co/gFJBmzFD/pis-de-ma-s-grill-ou-nature.jpg',
  'Épis de maïs grillé ou nature (BBQ)': 'https://i.ibb.co/gFJBmzFD/pis-de-ma-s-grill-ou-nature.jpg',
  'Fourme d\'Ambert': 'https://i.ibb.co/278jFgpn/Fourme-d-Ambert.jpg',
  'Frites': 'https://i.ibb.co/M5SZr4J4/Frites.jpg',
  'Gâteau moelleux aux carottes': 'https://i.ibb.co/QFJbgJzQ/G-teau-moelleux-aux-carottes.jpg',
  'Gelée goût citron': 'https://i.ibb.co/7N0tpdB2/Gel-e-go-t-citron.jpg',
  'Graine de chia': 'https://i.ibb.co/0RbyG4dM/Graine-de-chia.jpg',
  'Graine de sésame blanc': 'https://i.ibb.co/mPcBpcB/Graine-de-s-same-blanc.jpg',
  'Graine de sésame doré': 'https://i.ibb.co/tws3k6L1/Graine-de-s-same-dor.jpg',
  'Haricots verts': 'https://i.ibb.co/TzGpY0f/Haricots-verts.jpg',
  'Île flottante': 'https://i.ibb.co/5XCtNPdR/le-flottante.jpg',
  'Lasagnes Tex-Mex': 'https://i.ibb.co/PskQf4G6/Lasagnes-Tex-Mex.jpg',
  'Manchons de poulet aux épices': 'https://i.ibb.co/whBr4DXp/Manchons-de-poulet-aux-pices.jpg',
  'Mélange d\'olives': 'https://i.ibb.co/zHB135fF/M-lange-d-olives.jpg',
  'Œuf dur': 'https://i.ibb.co/7xhwzWs0/uf-dur.jpg',
  'Oignons Crispy': 'https://i.ibb.co/3YTWJ1tv/Oignons-Crispy.jpg',
  'Omelette à l\'emmental': 'https://i.ibb.co/bMJNvxh0/Omelette-l-emmental.jpg',
  'Omelette au bacon grillé': 'https://i.ibb.co/kVPXq7Fd/Omelette-au-bacon-grill.jpg',
  'Omelette aux fines herbes': 'https://i.ibb.co/XZcYdxL0/Omelette-aux-fines-herbes.jpg',
  'Pain blanc': 'https://i.ibb.co/fV74Mdsd/Pain-blanc.jpg',
  'Pâtes de fruits': 'https://i.ibb.co/JW1nH6Rh/P-tes-de-fruits.jpg',
  'Pâtes du Far West': 'https://i.ibb.co/jPbv0YJn/P-tes-Far-West.jpg',
  'Pepper Jack': 'https://i.ibb.co/YBzMZ0f0/Pepper-Jack.jpg',
  'Petit pain multigrains (sésame, pavot, tournesol)': 'https://i.ibb.co/R4QPkx2n/Petit-pain-multigrains-s-same-pavot-tournesol.jpg',
  'Poêlée de champignons': 'https://i.ibb.co/V0VB1544/Po-l-e-de-champignons.jpg',
  'Pomme au four (BBQ)': 'https://i.ibb.co/chZ2pTtG/Pomme-au-four.jpg',
  'Pommes de terre croustillantes Mickey': 'https://i.ibb.co/Kx9Gs5gh/Pommes-de-terre-croustillantes-Mickey.jpg',
  'Pommes de terre rôties au thym': 'https://i.ibb.co/wFSK8JKP/Pommes-de-terre-r-ties-au-thym.jpg',
  'Radis': 'https://i.ibb.co/S45mVpSR/Radis.jpg',
  'Raviolis Mickey aux fromages': 'https://i.ibb.co/0VXpBFSR/Raviolis-Mickey-aux-fromages.jpg',
  'Rillettes de saumon': 'https://i.ibb.co/VWd4Cg9H/Rillettes-de-saumon.jpg',
  'Salade d\'avocat, épi de maïs, cactus et coriandre': 'https://i.ibb.co/v4V9yY1Q/Salade-d-avocat-pi-de-ma-s-cactus-et-coriandre.jpg',
  'Salade de chou rouge': 'https://i.ibb.co/fdpbxP46/Salade-de-chou-rouge.jpg',
  'Salade de crevettes, tomate et fruits, au paprika fumé': 'https://i.ibb.co/PsT7Cvtg/Salade-de-crevettes-tomate-et-fruits.jpg',
  'Salade de haricots rouges, maïs et poivron': 'https://i.ibb.co/vCtrHBS2/Salade-de-haricots-rouges-ma-s-et-poivron.jpg',
  'Salade de pâtes, tomates et pesto': 'https://i.ibb.co/WWtLxdD7/Salade-de-p-tes-tomates-et-pesto.jpg',
  'Salade de pomme de terre au poulet tex-mex': 'https://i.ibb.co/S7cvBN9X/Salade-de-pomme-de-terre-au-poulet-tex-mex.jpg',
  'Salade de riz et maïs': 'https://i.ibb.co/d1Sft0N/Salade-de-riz-et-ma-s.jpg',
  'Salade de saumon et pamplemousse': 'https://i.ibb.co/HTQdvyZ5/Salade-de-saumon-et-pamplemousse.jpg',
  'Salade mélangée': 'https://i.ibb.co/8gh9h0Pk/Salade-m-lang-e.jpg',
  'Sauce au cheddar fondu': 'https://i.ibb.co/NdLK5NVP/Sauce-au-cheddar-fondu.jpg',
  'Sauce barbecue': 'https://i.ibb.co/xSNmJqYD/Sauce-barbecue.jpg',
  'Sauce beurre blanc': 'https://i.ibb.co/xSsTHtw5/Sauce-beurre-blanc.jpg',
  'Sauce crème aigre': 'https://i.ibb.co/LdXzQrzg/Sauce-cr-me-aigre.jpg',
  'Saumon fumé': 'https://i.ibb.co/1G4C8py5/Saumon-fum.jpg',
  'Saumon rôti au paprika fumé': 'https://i.ibb.co/vvh0v5kB/Saumon-r-ti-au-paprika-fum.jpg',
  'Sauté de bœuf au maïs': 'https://i.ibb.co/8gzVR3SJ/Saut-de-b-uf-au-ma-s.jpg',
  'Tarte à la purée de cerise': 'https://i.ibb.co/d0XXjS9K/Tarte-la-pur-e-de-cerise.jpg',
  'Tarte au citron meringuée': 'https://i.ibb.co/VYCvW72H/Tarte-au-citron-meringu-e.jpg',
  'Tarte aux noix de pécan': 'https://i.ibb.co/GvgMKppZ/Tarte-aux-noix-de-p-can.jpg',
  'Tarte aux poires et amande': 'https://i.ibb.co/bjbK5Sqt/Tarte-aux-poires-et-amande.jpg',
  'Tarte normande': 'https://i.ibb.co/FLZ5t7kS/Tarte-normande.jpg',
  'Tartelette Mickey au chocolat': 'https://i.ibb.co/KcrqXHw7/Tartelettes-Mickey-au-chocolat.jpg',
  'Tartelettes Mickey au chocolat': 'https://i.ibb.co/KcrqXHw7/Tartelettes-Mickey-au-chocolat.jpg',
  'Terrine Tex-Mex poulet haricots rouges maïs': 'https://i.ibb.co/nMMgTdLW/Terrine-Tex-Mex-poulet-haricots-rouges-ma-s.jpg',
  'Tomate': 'https://i.ibb.co/v6c30k34/Tomate.jpg',
  'Travers de porc fumé': 'https://i.ibb.co/9HZmTR4H/Travers-de-porc-fum.jpg',
  'Wok de bœuf': 'https://i.ibb.co/S4TM15mh/Wok-de-b-uf.jpg',
  'Wok de légumes': 'https://i.ibb.co/201rsXQQ/Wok-de-l-gumes.jpg'
};

// Fonction pour mettre à jour les images des plats
export async function updateDishImages(): Promise<{
  success: boolean;
  updated: number;
  errors: string[];
  details: Array<{ nom: string; status: 'updated' | 'not_found' | 'error'; message?: string }>;
}> {
  const results = {
    success: true,
    updated: 0,
    errors: [] as string[],
    details: [] as Array<{ nom: string; status: 'updated' | 'not_found' | 'error'; message?: string }>
  };

  try {
    console.log('🖼️ [UPDATE_IMAGES] === DÉBUT MISE À JOUR DES IMAGES ===');
    console.log('🖼️ [UPDATE_IMAGES] Nombre de mappings:', Object.keys(dishImageMappings).length);

    if (!supabase) {
      throw new Error('Supabase non configuré');
    }

    // Récupérer tous les plats existants
    const { data: allDishes, error: fetchError } = await supabase
      .from('dishes')
      .select('id, nom, image_url');

    if (fetchError) {
      throw new Error(`Erreur lors de la récupération des plats: ${fetchError.message}`);
    }

    console.log('🖼️ [UPDATE_IMAGES] Plats récupérés:', allDishes?.length || 0);

    // Pour chaque mapping, chercher le plat correspondant et mettre à jour l'image
    for (const [dishName, imageUrl] of Object.entries(dishImageMappings)) {
      try {
        // Chercher le plat par nom (recherche flexible)
        const matchingDish = allDishes?.find(dish => {
          const normalizedDishName = dish.nom.toLowerCase().trim();
          const normalizedSearchName = dishName.toLowerCase().trim();
          
          // Correspondance exacte
          if (normalizedDishName === normalizedSearchName) {
            return true;
          }
          
          // Correspondance partielle (pour gérer les variations)
          if (normalizedDishName.includes(normalizedSearchName) || 
              normalizedSearchName.includes(normalizedDishName)) {
            return true;
          }
          
          return false;
        });

        if (!matchingDish) {
          console.log(`⚠️ [UPDATE_IMAGES] Plat non trouvé: "${dishName}"`);
          results.details.push({
            nom: dishName,
            status: 'not_found',
            message: 'Plat non trouvé en base de données'
          });
          continue;
        }

        // Mettre à jour l'image si elle est différente
        if (matchingDish.image_url !== imageUrl) {
          const { error: updateError } = await supabase
            .from('dishes')
            .update({ image_url: imageUrl })
            .eq('id', matchingDish.id);

          if (updateError) {
            console.error(`❌ [UPDATE_IMAGES] Erreur mise à jour "${dishName}":`, updateError);
            results.errors.push(`Erreur mise à jour "${dishName}": ${updateError.message}`);
            results.details.push({
              nom: dishName,
              status: 'error',
              message: updateError.message
            });
          } else {
            console.log(`✅ [UPDATE_IMAGES] Image mise à jour: "${matchingDish.nom}"`);
            results.updated++;
            results.details.push({
              nom: matchingDish.nom,
              status: 'updated'
            });
          }
        } else {
          console.log(`ℹ️ [UPDATE_IMAGES] Image déjà à jour: "${matchingDish.nom}"`);
          results.details.push({
            nom: matchingDish.nom,
            status: 'updated',
            message: 'Image déjà à jour'
          });
        }

      } catch (error) {
        console.error(`❌ [UPDATE_IMAGES] Erreur pour "${dishName}":`, error);
        results.errors.push(`Erreur pour "${dishName}": ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        results.details.push({
          nom: dishName,
          status: 'error',
          message: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    }

    if (results.errors.length > 0) {
      results.success = false;
    }

    console.log('🖼️ [UPDATE_IMAGES] === FIN MISE À JOUR ===');
    console.log('🖼️ [UPDATE_IMAGES] Plats mis à jour:', results.updated);
    console.log('🖼️ [UPDATE_IMAGES] Erreurs:', results.errors.length);

    return results;

  } catch (error) {
    console.error('❌ [UPDATE_IMAGES] Erreur générale:', error);
    results.success = false;
    results.errors.push(error instanceof Error ? error.message : 'Erreur inconnue');
    return results;
  }
}

// Fonction pour afficher un rapport détaillé
export function displayUpdateReport(results: Awaited<ReturnType<typeof updateDishImages>>) {
  console.log('\n📊 === RAPPORT DE MISE À JOUR DES IMAGES ===');
  console.log(`✅ Succès global: ${results.success ? 'OUI' : 'NON'}`);
  console.log(`📈 Plats mis à jour: ${results.updated}`);
  console.log(`❌ Erreurs: ${results.errors.length}`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ ERREURS DÉTAILLÉES:');
    results.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  }
  
  console.log('\n📋 DÉTAILS PAR PLAT:');
  results.details.forEach(detail => {
    const statusIcon = detail.status === 'updated' ? '✅' : 
                      detail.status === 'not_found' ? '⚠️' : '❌';
    console.log(`   ${statusIcon} ${detail.nom} - ${detail.status}${detail.message ? ` (${detail.message})` : ''}`);
  });
  
  console.log('==========================================\n');
}