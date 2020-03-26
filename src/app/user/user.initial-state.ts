import * as yup from 'yup';
import userSchema from './user.schema';

export type UserInitialState = yup.InferType<typeof userSchema>;
