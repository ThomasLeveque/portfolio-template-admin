import { createContext, useContext } from 'react';

interface IUserContext {
  user: firebase.User | null;
  userError: string | null;
  userLoaded: boolean;
}

export const UserContext = createContext<IUserContext>({
  user: null,
  userError: null,
  userLoaded: false
});

export const useUser = () => useContext(UserContext);
