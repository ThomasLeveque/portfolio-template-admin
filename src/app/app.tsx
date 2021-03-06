import React from 'react';

import AppRoutes from './app.routes';
import LoadingComponent from './components/loading/loading.component';
import { useUser } from './user/user.context';

import './app.less';

function App() {
  const { userLoaded } = useUser();

  return <div className="app">{userLoaded ? <AppRoutes /> : <LoadingComponent />}</div>;
}

export default App;
