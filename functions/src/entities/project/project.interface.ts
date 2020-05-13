import { Category } from '../category/category.interface';
import { Image } from '../image/image.interface';

export interface Project {
  id: string;
  name: string;
  desc: string;
  projectUrl: string;
  projectSrc: string;
  date: string;
  formatedDate?: string;
  skills: string[];
  categories: Category[];
  images: Image[];
  createdAt: number;
  updatedAt: number;
}
