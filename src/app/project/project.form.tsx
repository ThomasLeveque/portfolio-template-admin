import React from 'react';
import { Formik, FormikHelpers } from 'formik';
import { ProjectInitialState } from './project.initial-state';
import projectSchema from './project.schema';
import { Form, Input, ResetButton, SubmitButton } from 'formik-antd';

interface IProps {
  callback: (values: ProjectInitialState) => Promise<void>;
  initialValues: ProjectInitialState;
  submitText: string;
  resetText: string;
}

const ProjectForm: React.FC<IProps> = ({ callback, initialValues, submitText, resetText }) => {
  return (
    <Formik<ProjectInitialState>
      onSubmit={async (
        values: ProjectInitialState,
        { setSubmitting, resetForm }: FormikHelpers<ProjectInitialState>
      ) => {
        await callback(values);
        resetForm();
        setSubmitting(false);
      }}
      validationSchema={projectSchema}
      initialValues={initialValues}
    >
      {() => {
        return (
          <Form>
            <Form.Item name="name" required label="Name">
              <Input name="name" placeholder="Name" />
            </Form.Item>
            <Form.Item name="desc" required label="Desc">
              <Input name="desc" placeholder="Description" />
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

export default ProjectForm;
