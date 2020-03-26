import React from 'react';
import { Form, Input, SubmitButton, ResetButton } from 'formik-antd';
import { Formik, FormikHelpers } from 'formik';
import { Typography } from 'antd';

import LayoutComponent from '../components/layout/layout.component';
import userSchema from './user.schema';
import { UserInitialState } from './user.initial-state';
import { login } from './user.service';
import { useNotif } from '../notification/notification.context';

import './user-auth.styles.less';

const UserAuthPage = () => {
  const { openNotification } = useNotif();
  const { Title } = Typography;

  return (
    <LayoutComponent pageClassName="user-auth" withHeader={false}>
      <Title level={1}>Login</Title>
      <Formik<UserInitialState>
        onSubmit={async (
          values: UserInitialState,
          { setSubmitting }: FormikHelpers<UserInitialState>
        ) => {
          try {
            await login(values);
          } catch (err) {
            openNotification(err.message, err.code, 'error');
            console.error(err);
            setSubmitting(false);
          }
        }}
        validationSchema={userSchema}
        initialValues={{ email: 'test@test.com', password: '' }}
      >
        {() => {
          return (
            <Form>
              <Form.Item name="email">
                <Input name="email" placeholder="Email" />
              </Form.Item>
              <Form.Item name="password">
                <Input.Password name="password" placeholder="Password" />
              </Form.Item>
              <div className="buttons">
                <ResetButton>Reset</ResetButton>
                <SubmitButton>Login</SubmitButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </LayoutComponent>
  );
};

export default UserAuthPage;
