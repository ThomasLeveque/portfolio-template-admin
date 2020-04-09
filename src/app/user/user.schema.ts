import * as yup from 'yup';

const emailMax: number = 255;
const passwordMin: number = 6;
const passwordMax: number = 64;

const userSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .max(emailMax, `Email must be shorter than ${emailMax} characters`)
    .required('Email required'),
  password: yup
    .string()
    .min(passwordMin, `Password must be at least ${passwordMin} characters`)
    .max(passwordMax, `Password must be shorter than ${passwordMax} characters`)
    .required('Password required'),
});

export default userSchema;
