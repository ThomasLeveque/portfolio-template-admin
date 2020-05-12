import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import LayoutComponent from '../components/layout/layout.component';
import LoadingComponent from '../components/loading/loading.component';
import NotFound from '../components/not-found/not-found.component';

import { IEntitiesRoutes } from './entities.interface';

const CategoryPage = lazy(() => import('./category/pages/category.page'));
const CategoriesPage = lazy(() => import('./category/pages/categories.page'));
const ProjectPage = lazy(() => import('./project/pages/project.page'));
const ProjectsPage = lazy(() => import('./project/pages/projects.page'));
const ImagesPage = lazy(() => import('./image/pages/images.page'));

export const entitiesRoutesMap: IEntitiesRoutes[] = [
  { path: '/entities/projects', component: ProjectsPage },
  { path: '/entities/categories', component: CategoriesPage },
  { path: '/entities/images', component: ImagesPage },
  { path: '/entities/categories/:categoryId', component: CategoryPage },
  { path: '/entities/projects/:projectId', component: ProjectPage },
];

const EntitiesRoutes = () => {
  return (
    <LayoutComponent withHeader>
      <Suspense fallback={<LoadingComponent withHeader />}>
        <Switch>
          <Route path="/entities" exact>
            <Redirect to="/entities/projects" />
          </Route>
          {entitiesRoutesMap.map(({ path, component }: IEntitiesRoutes) => (
            <Route key={path} exact path={path} component={component} />
          ))}
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Suspense>
    </LayoutComponent>
  );
};

export default EntitiesRoutes;
