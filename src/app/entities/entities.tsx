import React from 'react';

import EntitiesRoutes from './entities.routes';
import ProjectProvider from './project/project.provider';
import CategoryProvider from './category/category.provider';
import ImageProvider from './image/image.provider';

const Entities: React.FC = () => (
  <ProjectProvider>
    <CategoryProvider>
      <ImageProvider>
        <EntitiesRoutes />
      </ImageProvider>
    </CategoryProvider>
  </ProjectProvider>
);

export default Entities;
