import React from 'react';
import { Formik, FormikHelpers } from 'formik';
import { Form, Input, ResetButton, SubmitButton } from 'formik-antd';
import { CategoryInitialState } from './category.initial-state';
import categorySchema from './category.schema';

interface IProps {
  callback: (values: CategoryInitialState) => Promise<void>;
  initialValues: CategoryInitialState;
  submitText: string;
  resetText: string;
}

const CategoryForm: React.FC<IProps> = ({ callback, initialValues, submitText, resetText }) => {
  return (
    <Formik<CategoryInitialState>
      onSubmit={async (
        values: CategoryInitialState,
        { setSubmitting, resetForm }: FormikHelpers<CategoryInitialState>
      ) => {
        await callback(values);
        resetForm();
        setSubmitting(false);
      }}
      validationSchema={categorySchema}
      initialValues={initialValues}
    >
      {() => {
        return (
          <Form>
            <Form.Item name="name" required label="Name">
              <Input name="name" placeholder="Name" />
            </Form.Item>
            <div className="buttons">
              <ResetButton>{resetText}</ResetButton>
              <SubmitButton>{submitText}</SubmitButton>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CategoryForm;
