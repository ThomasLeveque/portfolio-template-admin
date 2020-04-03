import * as yup from 'yup';

const max = 255;

const projectSchema = yup.object().shape({
  name: yup
    .string()
    .max(max, `Name must be shorter than ${max} characters`)
    .required('Name required'),
  desc: yup
    .string()
    .max(max, `Description must be shorter than ${max} characters`)
    .required('Description required'),
  date: yup.string().required('Date required'),
  skills: yup.array<string>(),
  categories: yup.array<string>().required('At least one category required'),
  images: yup.array<any>(),
});

export default projectSchema;
