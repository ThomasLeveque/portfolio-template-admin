import { createContext, useContext } from 'react';

import { Project } from './project.model';
import { ProjectInitialState } from './project.initial-state';

interface IProjectContext {
  projects: Project[];
  removeProjectLoading: boolean;
  projectsLoading: boolean;
  addProject: (values: ProjectInitialState) => Promise<void>;
  removeProject: (projectId: string) => Promise<void>;
}

export const ProjectContext = createContext<IProjectContext>({
  projects: [],
  removeProjectLoading: false,
  projectsLoading: false,
  addProject: async () => {},
  removeProject: async () => {},
});

export const useProject = () => useContext(ProjectContext);
