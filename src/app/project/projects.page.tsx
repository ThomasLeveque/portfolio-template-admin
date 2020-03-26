import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import LayoutComponent from '../components/layout/layout.component';
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

interface IColumns {
  title: string;
  dataIndex?: string;
  key: string;
  render?: (text: string, record: Project) => any;
  fixed?: any;
  width?: number,
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [columnsProjects, setColumnsProjects] = useState<IColumns[]>([]);
  const [removeProjectLoading, setRemoveProjectLoading] = useState<boolean>(false);
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
    if (snapshot.docs.length > 0) {
      const firestoreColumnsProjects = Object.keys(snapshot.docs[0].data()).map((doc: string) => ({
        title: doc?.charAt(0).toUpperCase() + doc?.slice(1),
        dataIndex: doc,
        key: doc
      }));
      setColumnsProjects([
        ...firestoreColumnsProjects,
        {
          title: 'Action',
          key: 'action',
          fixed: 'right',
          width: 120,
          render: (text: string, record: Project) => (
            <>
              <Button
                icon={<EditOutlined />}
                style={{ marginRight: '16px' }}
                type="primary"
                onClick={() => history.push(`${pathname}/${record.id}`)}
              />
              <Button
                icon={<DeleteOutlined />}
                loading={removeProjectLoading}
                type="danger"
                onClick={() => removeProject(record.id)}
              />
            </>
          )
        }
      ]);
    }
    setProjects(firestoreProjects);
  };

  useEffect(() => {
    const unsubscribe = firestore.collection('projects').onSnapshot(handleSnapshot);
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LayoutComponent pageClassName="projects">
      {projects.length > 0 && (
        <>
          <Title level={1}>Projects</Title>
          <Table dataSource={projects} columns={columnsProjects} />
        </>
      )}
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
              <Form.Item name="name">
                <Input name="name" placeholder="Name" />
              </Form.Item>
              <Form.Item name="desc">
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
    </LayoutComponent>
  );
};

export default ProjectsPage;
