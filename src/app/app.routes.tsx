import React, { Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useUser } from './user/user.context';

import Entities from './entities/entities';
import LoadingComponent from './components/loading/loading.component';
import NotFound from './components/not-found/not-found.component';

const UserAuthPage = lazy(() => import('./user/pages/user-auth.page'));

const AppRoutes = () => {
  const { user } = useUser();

  return (
    <Suspense fallback={<LoadingComponent withHeader={false} />}>
      <Switch>
        <Route exact path="/">
          {!user ? <UserAuthPage /> : <Redirect to="/entities" />}
        </Route>
        <Route path="/entities">{user ? <Entities /> : <Redirect to="/" />}</Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;
