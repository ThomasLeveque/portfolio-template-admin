import { Project } from '../project/project.interface';

export interface Category {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  projects: Project[];
}
