import React, { Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useUser } from './user/user.context';

import Entities from './entities/entities';
import LoadingComponent from './components/loading/loading.component';
import NotFound from './components/not-found/not-found.component';

const UserAuthPage = lazy(() => import('./user/user-auth.page'));

const AppRoutes = () => {
  const { user } = useUser();

  return (
    <Switch>
      <Suspense fallback={<LoadingComponent withHeader={false} />}>
        <Route
          exact
          path="/"
          render={() => (!user ? <UserAuthPage /> : <Redirect to="/entities" />)}
        />
        <Route path="/entities" render={() => (user ? <Entities /> : <Redirect to="/" />)} />
        <Route path="*">
          <NotFound />
        </Route>
      </Suspense>
    </Switch>
  );
};

export default AppRoutes;
