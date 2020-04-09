import React from 'react';

import EntitiesRoutes from './entities.routes';
import ProjectProvider from './project/project.provider';
import CategoryProvider from './category/category.provider';

const Entities: React.FC = () => (
  <ProjectProvider>
    <CategoryProvider>
      <EntitiesRoutes />
    </CategoryProvider>
  </ProjectProvider>
);

export default Entities;
