import { Category } from './category.model';

export interface CategoryMapping {
  [categoryId: string]: Category;
}
