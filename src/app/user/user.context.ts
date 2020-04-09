import { createContext, useContext } from 'react';

interface IUserContext {
  user: firebase.User | null;
  userLoaded: boolean;
}

export const UserContext = createContext<IUserContext>({
  user: null,
  userLoaded: false,
});

export const useUser = () => useContext(UserContext);
