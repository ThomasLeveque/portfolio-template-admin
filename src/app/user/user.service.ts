import { auth } from '../firebase/firebase.service';
import { UserInitialState } from './user.initial-state';

export const login = async ({
  email,
  password
}: UserInitialState): Promise<firebase.auth.UserCredential> => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const logout = async (): Promise<void> => {
  return auth.signOut();
};
