import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import LayoutComponent from '../components/layout/layout.component';
import LoadingComponent from '../components/loading/loading.component';

const CategoryPage = lazy(() => import('./category/pages/category.page'));
const CategoriesPage = lazy(() => import('./category/pages/categories.page'));
const ProjectPage = lazy(() => import('./project/pages/project.page'));
const ProjectsPage = lazy(() => import('./project/pages/projects.page'));

const EntitiesRoutes = () => {
  return (
    <Switch>
      <Route path="/entities" exact render={() => <Redirect to="/entities/projects" />} />
      <LayoutComponent withHeader>
        <Suspense fallback={<LoadingComponent withHeader />}>
          <Route exact path="/entities/projects" component={ProjectsPage} />
          <Route exact path="/entities/categories" component={CategoriesPage} />
          <Route exact path="/entities/categories/:categoryId" component={CategoryPage} />
          <Route exact path="/entities/projects/:projectId" component={ProjectPage} />
        </Suspense>
      </LayoutComponent>
    </Switch>
  );
};

export default EntitiesRoutes;
