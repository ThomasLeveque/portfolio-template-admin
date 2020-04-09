import * as yup from 'yup';

import projectSchema from './project.schema';

export type ProjectInitialState = yup.InferType<typeof projectSchema>;
