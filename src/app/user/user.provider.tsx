import React, { useEffect, memo } from 'react';

import { auth } from '../firebase/firebase.service';
import { formatError } from '../utils/format-error.util';
import { UserContext } from './user.context';
import { useNotif } from '../notification/notification.context';

const UserProvider: React.FC = memo(({ children }) => {
  const [user, setUser] = React.useState<firebase.User | null>(null);
  const [userLoaded, setUserLoaded] = React.useState<boolean>(false);
  const { openNotification } = useNotif();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (userAuth: firebase.User | null): Promise<void> => {
        if (userAuth) {
          setUser(userAuth);
          setUserLoaded(true);
        } else {
          setUser(null);
          setUserLoaded(true);
        }
      },
      (err: firebase.auth.Error): void => {
        openNotification('Error during auth process', formatError(err), 'error');
        console.error(err);
        setUser(null);
        setUserLoaded(true);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        userLoaded,
      }}
    >
      {children}
    </UserContext.Provider>
  );
});

export default UserProvider;
