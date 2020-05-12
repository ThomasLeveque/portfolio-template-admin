import { createContext, useContext } from 'react';

import { CategoryInitialState } from './category.initial-state';
import { CategoryMapping } from './category.interface';

interface ICategoryContext {
  categories: CategoryMapping;
  removeCategoryLoading: boolean;
  categoriesLoading: boolean;
  addCategory: (values: CategoryInitialState) => Promise<void>;
  removeCategory: (categoryIdToRemove: string) => Promise<void>;
}

export const CategoryContext = createContext<ICategoryContext>({
  categories: {},
  removeCategoryLoading: false,
  categoriesLoading: false,
  addCategory: async () => {},
  removeCategory: async () => {},
});

export const useCategory = () => useContext(CategoryContext);
