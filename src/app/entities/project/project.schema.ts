import * as yup from 'yup';

import { urlRegex } from '../../utils/regex.util';

const max: number = 255;

const projectSchema = yup.object().shape({
  name: yup
    .string()
    .max(max, `Name must be shorter than ${max} characters`)
    .required('Name required'),
  desc: yup
    .string()
    .max(max, `Description must be shorter than ${max} characters`)
    .required('Description required'),
  projectUrl: yup
    .string()
    .max(max, `Project url must be shorter than ${max} characters`)
    .matches(urlRegex, 'Not an url'),
  projectSrc: yup
    .string()
    .max(max, `Project source must be shorter than ${max} characters`)
    .matches(urlRegex, 'Not an url'),
  date: yup.string().required('Date required'),
  skills: yup.array<string>(),
  categories: yup.array<string>(),
  images: yup.array<string>(),
});

export default projectSchema;
