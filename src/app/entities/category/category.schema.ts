import * as yup from 'yup';

const max = 255;

const categorySchema = yup.object().shape({
  name: yup
    .string()
    .max(max, `Name must be shorter than ${max} characters`)
    .required('Name required')
});

export default categorySchema;
