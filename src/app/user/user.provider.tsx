import React, { useEffect, memo } from 'react';

import { auth } from '../firebase/firebase.service';
import { formatError } from '../utils/format-error.util';
import { UserContext } from './user.context';

const UserProvider: React.FC = memo(({ children }) => {
  const [user, setUser] = React.useState<firebase.User | null>(null);
  const [userError, setUserError] = React.useState<string | null>(null);
  const [userLoaded, setUserLoaded] = React.useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (userAuth: firebase.User | null) => {
        if (userAuth) {
          setUser(userAuth);
          setUserLoaded(true);
        } else {
          setUser(null);
          setUserLoaded(true);
        }
      },
      (err: firebase.auth.Error) => {
        setUserError(formatError(err));
        console.error(err);
        setUserLoaded(true);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        userError,
        userLoaded
      }}
    >
      {children}
    </UserContext.Provider>
  );
});

export default UserProvider;
