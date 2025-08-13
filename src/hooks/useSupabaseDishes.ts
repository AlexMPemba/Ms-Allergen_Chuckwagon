import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase, DatabaseDish, DishModification, isSupabaseConfigured } from '../lib/supabase';
import { Dish } from '../types';
import { completeA2Menu } from '../utils/menuData';
import { additionalMenuItems } from '../utils/additionalMenuItems';

export function useSupabaseDishes() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modifications, setModifications] = useState<DishModification[]>([]);

  // Convertir DatabaseDish vers Dish
  const convertDatabaseDish = (dbDish: DatabaseDish): Dish => ({
    id: dbDish.id,
    nom: dbDish.nom,
    categorie: dbDish.categorie as any,
    langue: dbDish.langue as any,
    ingredients: dbDish.ingredients || [],
    allergenes: dbDish.allergenes || [],
    image: dbDish.image_url || undefined
  });

  // Charger les plats depuis Supabase
  const loadDishes = async () => {
    setLoading(true);
    try {
      setError(null);
      
      console.log('🔍 [LOAD] === DÉBUT CHARGEMENT PLATS ===');
      console.log('🔍 [LOAD] isSupabaseConfigured():', isSupabaseConfigured());
      console.log('🔍 [LOAD] supabase existe:', !!supabase);
      
      // Vérifier si Supabase est configuré
      if (!isSupabaseConfigured() || !supabase) {
        console.error('❌ [LOAD] Supabase non configuré - impossible de charger les plats');
        setError('Supabase non configuré');
        setLoading(false);
        return;
      }

      console.log('🔗 [LOAD] Tentative de connexion à Supabase...');
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .order('created_at', { ascending: true });

      console.log('📊 [LOAD] Réponse Supabase - data:', data);
      console.log('📊 [LOAD] Réponse Supabase - error:', error);
      console.log('📊 [LOAD] Nombre de plats reçus:', data?.length || 0);
      
      if (error) {
        console.error('❌ [LOAD] Erreur Supabase:', error);
        setError('Erreur de connexion à Supabase');
        return;
      }

      if (data && data.length > 0) {
        console.log(`✅ [LOAD] ${data.length} plats chargés depuis Supabase`);
        const convertedDishes = data.map(convertDatabaseDish);
        console.log('🔄 [LOAD] Plats convertis par catégorie:');
        const categoryBreakdown = convertedDishes.reduce((acc, dish) => {
          acc[dish.categorie] = (acc[dish.categorie] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        console.log('🔄 [LOAD] Répartition:', categoryBreakdown);
        setDishes(convertedDishes);
        console.log('✅ [LOAD] État dishes mis à jour avec', convertedDishes.length, 'plats');
      } else {
        console.log('⚠️ [LOAD] Aucun plat en base');
        setDishes([]);
      }
    } catch (err) {
      console.error('❌ [LOAD] Erreur lors du chargement des plats:', err);
      setError('Erreur lors du chargement des plats');
    } finally {
      setLoading(false);
    }
  };

  // Log de l'état actuel des plats
  useEffect(() => {
    console.log('📈 [STATE] État dishes changé:', {
      nombre: dishes.length,
      plats: dishes.map(d => ({ id: d.id, nom: d.nom, langue: d.langue, categorie: d.categorie }))
    });
  }, [dishes]);

  // Upload d'image vers Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // Si Supabase n'est pas configuré, retourner null
      if (!supabase || !isSupabaseConfigured()) {
        console.log('Upload d\'image impossible sans Supabase');
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('dish-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('dish-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err);
      return null;
    }
  };

  // Ajouter un plat
  const addDish = async (dish: Omit<Dish, 'id'>) => {
    try {
      setLoading(true);
      
      if (!supabase || !isSupabaseConfigured()) {
        throw new Error('Supabase non configuré');
      }

      // Vérifier l'authentification avant d'ajouter
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Vous devez être connecté pour ajouter un plat');
      }

      const newDish: Dish = {
        id: uuidv4(),
        ...dish
      };

      const dbDish = {
        id: newDish.id,
        nom: newDish.nom,
        categorie: newDish.categorie,
        langue: newDish.langue,
        ingredients: newDish.ingredients,
        allergenes: newDish.allergenes,
        image_url: newDish.image || null
      };

      const { error } = await supabase
        .from('dishes')
        .insert([dbDish]);

      if (error) {
        console.error('Erreur lors de l\'ajout en base:', error);
        if (error.code === '42501') {
          throw new Error('Accès non autorisé - Vérifiez vos permissions');
        }
        throw error;
      }

      // Recharger les plats depuis Supabase
      console.log('🔄 Rechargement des plats après ajout...');
      await loadDishes();
      console.log('📊 Nombre de plats après rechargement:', dishes.length);
      
      return newDish;
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un plat
  const updateDish = async (id: string, updates: Partial<Dish>) => {
    try {
      setLoading(true);
      
      if (!supabase || !isSupabaseConfigured()) {
        throw new Error('Supabase non configuré');
      }

      // Vérifier l'authentification avant de modifier
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Vous devez être connecté pour modifier un plat');
      }

      console.log('🔄 Début mise à jour plat:', id, updates);

      const updateData = {
        ...(updates.nom !== undefined && { nom: updates.nom }),
        ...(updates.categorie !== undefined && { categorie: updates.categorie }),
        ...(updates.langue !== undefined && { langue: updates.langue }),
        ...(updates.ingredients !== undefined && { ingredients: updates.ingredients }),
        ...(updates.allergenes !== undefined && { allergenes: updates.allergenes }),
        ...(updates.image !== undefined && { image_url: updates.image })
      };

      const { error } = await supabase
        .from('dishes')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la mise à jour en base:', error);
        if (error.code === '42501') {
          throw new Error('Accès non autorisé - Vérifiez vos permissions');
        }
        throw error;
      }

      console.log('✅ Plat mis à jour en base:', id, updateData);
      
      // Recharger les plats depuis Supabase
      await loadDishes();
      
      return dishes.find(dish => dish.id === id);
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un plat
  const deleteDish = async (id: string) => {
    try {
      setLoading(true);
      
      if (!supabase || !isSupabaseConfigured()) {
        throw new Error('Supabase non configuré');
      }

      // Vérifier l'authentification avant de supprimer
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Vous devez être connecté pour supprimer un plat');
      }

      const { error } = await supabase
        .from('dishes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la suppression en base:', error);
        if (error.code === '42501') {
          throw new Error('Accès non autorisé - Vérifiez vos permissions');
        }
        throw error;
      }
      
      // Recharger les plats depuis Supabase
      await loadDishes();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser avec les plats par défaut
  const resetToDefault = async () => {
    try {
      if (!supabase || !isSupabaseConfigured()) {
        throw new Error('Supabase non configuré');
      }
      
      setLoading(true);
      
      // Supprimer tous les plats existants
      const { error: deleteError } = await supabase
        .from('dishes')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Supprimer tous

      if (deleteError) throw deleteError;

      // Ajouter tous les plats du menu A2
      const dishesToInsert = completeA2Menu.map(dish => ({
        id: uuidv4(),
        nom: dish.nom,
        categorie: dish.categorie,
        langue: dish.langue,
        ingredients: dish.ingredients,
        allergenes: dish.allergenes,
        image_url: dish.image || null
      }));

      console.log('🍽️ [RESET] Insertion de', dishesToInsert.length, 'plats du menu A2');
      console.log('🍽️ [RESET] Répartition par catégorie:');
      const categoryCount = dishesToInsert.reduce((acc, dish) => {
        acc[dish.categorie] = (acc[dish.categorie] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('🍽️ [RESET]', categoryCount);
      const { error: insertError } = await supabase
        .from('dishes')
        .insert(dishesToInsert);

      if (insertError) throw insertError;

      console.log('✅ [RESET] Tous les plats du menu A2 ont été ajoutés');
      
      // Recharger les plats depuis la base
      await loadDishes();
    } catch (err) {
      console.error('Erreur lors de la réinitialisation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Ajouter les nouveaux plats (sauces, pains, desserts)
  const addAdditionalItems = async () => {
    try {
      if (!supabase || !isSupabaseConfigured()) {
        throw new Error('Supabase non configuré');
      }
      
      setLoading(true);
      
      // Ajouter tous les nouveaux plats
      const dishesToInsert = additionalMenuItems.map(dish => ({
        id: uuidv4(),
        nom: dish.nom,
        categorie: dish.categorie,
        langue: dish.langue,
        ingredients: dish.ingredients,
        allergenes: dish.allergenes,
        image_url: dish.image || null
      }));

      console.log('🍽️ [ADD] Insertion de', dishesToInsert.length, 'nouveaux plats');
      console.log('🍽️ [ADD] Répartition par catégorie:');
      const categoryCount = dishesToInsert.reduce((acc, dish) => {
        acc[dish.categorie] = (acc[dish.categorie] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('🍽️ [ADD]', categoryCount);
      
      const { error: insertError } = await supabase
        .from('dishes')
        .insert(dishesToInsert);

      if (insertError) throw insertError;

      console.log('✅ [ADD] Tous les nouveaux plats ont été ajoutés');
      
      // Recharger les plats depuis la base
      await loadDishes();
    } catch (err) {
      console.error('Erreur lors de l\'ajout des nouveaux plats:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Dupliquer tous les plats de "salades" vers "entrées"
  // Charger l'historique des modifications pour un plat
  const loadDishModifications = async (dishId: string): Promise<DishModification[]> => {
    try {
      if (!supabase || !isSupabaseConfigured()) {
        return [];
      }

      const { data, error } = await supabase
        .from('dish_modifications')
        .select('*')
        .eq('dish_id', dishId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des modifications:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Erreur lors du chargement des modifications:', err);
      return [];
    }
  };

  // Charger toutes les modifications récentes
  const loadAllModifications = async () => {
    try {
      if (!supabase || !isSupabaseConfigured()) {
        return;
      }

      console.log('🔍 [MODIFICATIONS] === DÉBUT CHARGEMENT HISTORIQUE GLOBAL ===');
      
      const { data, error } = await supabase
        .from('dish_modifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) {
        console.error('Erreur lors du chargement des modifications:', error);
        return;
      }

      console.log('🔍 [MODIFICATIONS] Données brutes reçues:', data);
      console.log('🔍 [MODIFICATIONS] Nombre total de modifications:', data?.length || 0);
      
      // Debug détaillé de chaque modification
      if (data && data.length > 0) {
        console.log('🔍 [MODIFICATIONS] === ANALYSE DÉTAILLÉE ===');
        data.slice(0, 5).forEach((mod, index) => {
          console.log(`🔍 [MODIFICATIONS] Modification ${index + 1}:`, {
            id: mod.id,
            dish_id: mod.dish_id,
            action_type: mod.action_type,
            changes: mod.changes,
            user_email: mod.user_email,
            created_at: mod.created_at
          });
          
          // Analyser le contenu de changes
          if (mod.changes) {
            console.log(`🔍 [MODIFICATIONS] Changes pour ${index + 1}:`, {
              type: typeof mod.changes,
              keys: Object.keys(mod.changes || {}),
              nom: mod.changes.nom,
              hasNom: 'nom' in (mod.changes || {})
            });
          }
        });
      }
      
      setModifications(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des modifications:', err);
    }
  };

  // Charger les plats au démarrage
  useEffect(() => {
    console.log('🚀 [INIT] === INITIALISATION HOOK ===');
    console.log('🚀 [INIT] Supabase configuré:', isSupabaseConfigured());
    
    if (isSupabaseConfigured() && supabase) {
      console.log('🔗 [INIT] Supabase configuré, chargement des plats depuis la base...');
      loadDishes();
      loadAllModifications();
    } else {
      console.log('⚠️ [INIT] Supabase non configuré');
      setError('Supabase non configuré');
      setLoading(false);
    }
  }, []);

  return {
    dishes,
    loading,
    error,
    modifications,
    addDish,
    updateDish,
    deleteDish,
    resetToDefault,
    addAdditionalItems,
    refreshDishes: loadDishes,
    loadDishModifications,
    loadAllModifications
  };
}