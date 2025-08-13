import { useSupabaseDishes } from './useSupabaseDishes';

// Hook principal qui utilise Supabase
export function useDishes() {
  const result = useSupabaseDishes();
  return {
    ...result,
    addAdditionalItems: result.addAdditionalItems,
    addCompleteMenu: result.addCompleteMenu
  };
}