import { createContext, useContext } from 'react';

import { Category } from './category.model';
import { CategoryInitialState } from './category.initial-state';

interface ICategoryContext {
  categories: Category[];
  removeCategoryLoading: boolean;
  categoriesLoading: boolean;
  addCategory: (values: CategoryInitialState) => Promise<void>;
  removeCategory: (categoryId: string) => Promise<void>;
}

export const CategoryContext = createContext<ICategoryContext>({
  categories: [],
  removeCategoryLoading: false,
  categoriesLoading: false,
  addCategory: async () => {},
  removeCategory: async () => {}
});

export const useCategory = () => useContext(CategoryContext);
