import React, { Suspense, lazy } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { useUser } from './user/user.context';

import LoadingComponent from './components/loading/loading.component';
import LayoutComponent from './components/layout/layout.component';

const UserAuthPage = lazy(() => import('./user/user-auth.page'));
const CategoryPage = lazy(() => import('./category/category.page'));
const CategoriesPage = lazy(() => import('./category/categories.page'));
const ProjectPage = lazy(() => import('./project/project.page'));
const ProjectsPage = lazy(() => import('./project/projects.page'));

const AppRoutes = () => {
  const { user } = useUser();
  const { pathname } = useLocation();
  const isRootPath: boolean = pathname === '/';

  return (
    <LayoutComponent withHeader={!isRootPath}>
      <Switch>
        <Suspense fallback={<LoadingComponent withHeader={!isRootPath} />}>
          <Route
            exact
            path="/"
            render={() => (!user ? <UserAuthPage /> : <Redirect to="/projects" />)}
          />
          <Route
            exact
            path="/projects"
            render={() => (user ? <ProjectsPage /> : <Redirect to="/" />)}
          />
          <Route
            exact
            path="/categories"
            render={() => (user ? <CategoriesPage /> : <Redirect to="/" />)}
          />
          <Route
            exact
            path="/categories/:categoryId"
            render={() => (user ? <CategoryPage /> : <Redirect to="/" />)}
          />
          <Route
            exact
            path="/projects/:projectId"
            render={() => (user ? <ProjectPage /> : <Redirect to="/" />)}
          />
        </Suspense>
      </Switch>
    </LayoutComponent>
  );
};

export default AppRoutes;
