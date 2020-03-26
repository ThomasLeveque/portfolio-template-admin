import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Typography, Table, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Form, Input } from 'formik-antd';
import { Project } from './project.model';
import { firestore } from '../firebase/firebase.service';
import { Formik, FormikHelpers } from 'formik';
import { ProjectInitialState } from './project.initial-state';
import { ResetButton, SubmitButton } from 'formik-antd';
import { useNotif } from '../notification/notification.context';
import projectSchema from './project.schema';
import { formatError } from '../utils/format-error.util';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [removeProjectLoading, setRemoveProjectLoading] = useState<boolean>(false);
  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);
  const { openNotification, openMessage } = useNotif();
  const history = useHistory();
  const { pathname } = useLocation();
  const { Title } = Typography;

  const addProject = async (values: ProjectInitialState) => {
    try {
      await firestore.collection('projects').add(values);
      openMessage('Project added successfully', 'success');
    } catch (err) {
      openNotification(err?.message, err?.code, 'error');
      console.error(err);
    }
  };

  const removeProject = async (projectId: string) => {
    try {
      setRemoveProjectLoading(true);
      await firestore
        .collection('projects')
        .doc(projectId)
        .delete();
      setRemoveProjectLoading(false);
      openMessage('Project removed successfully', 'success');
    } catch (err) {
      setRemoveProjectLoading(false);
      openNotification(err?.message, err?.code, 'error');
      console.error(err);
    }
  };

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot) => {
    const firestoreProjects = snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => {
      return new Project(doc);
    });
    setProjectsLoading(false);
    setProjects(firestoreProjects);
  };

  const handleError = (err: any) => {
    setProjectsLoading(false);
    openNotification('Cannot load your projects', formatError(err), 'error');
    console.error(err);
  };

  useEffect(() => {
    setProjectsLoading(true);
    const unsubscribe = firestore.collection('projects').onSnapshot(handleSnapshot, handleError);
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="projects page">
      <Title level={1}>Projects</Title>
      <Table<Project> loading={projectsLoading || removeProjectLoading} dataSource={projects}>
        <Table.Column<Project> key="name" title="Name" dataIndex="name" />
        <Table.Column<Project> key="desc" title="Desc" dataIndex="desc" />
        <Table.Column<Project>
          key="action"
          title="Action"
          dataIndex="action"
          fixed="right"
          render={(text: string, record: Project) => (
            <>
              <Button
                icon={<EditOutlined />}
                style={{ marginRight: '16px' }}
                type="primary"
                onClick={() => history.push(`${pathname}/${record.id}`)}
              />
              <Button
                icon={<DeleteOutlined />}
                type="danger"
                onClick={() => removeProject(record.id)}
              />
            </>
          )}
        />
      </Table>
      <Title level={2}>Add a Project</Title>
      <Formik<ProjectInitialState>
        onSubmit={async (
          values: ProjectInitialState,
          { setSubmitting }: FormikHelpers<ProjectInitialState>
        ) => {
          await addProject(values);
          setSubmitting(false);
        }}
        validationSchema={projectSchema}
        initialValues={{ name: '', desc: '' }}
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
                <ResetButton>Reset</ResetButton>
                <SubmitButton>Add project</SubmitButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ProjectsPage;
