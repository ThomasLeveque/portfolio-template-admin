import * as yup from 'yup';
import categorySchema from './category.schema';

export type CategoryInitialState = yup.InferType<typeof categorySchema>;
