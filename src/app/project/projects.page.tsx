import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Typography, Table, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Project } from './project.model';
import { firestore } from '../firebase/firebase.service';
import { ProjectInitialState } from './project.initial-state';
import { useNotif } from '../notification/notification.context';
import { formatError } from '../utils/format-error.util';
import ProjectForm from './project.form';
import { COLLECTION_NAME } from './project.util';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [removeProjectLoading, setRemoveProjectLoading] = useState<boolean>(false);
  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);
  const { openNotification, openMessage } = useNotif();
  const history = useHistory();
  const { pathname } = useLocation();
  const { Title } = Typography;

  const addProject = async (values: ProjectInitialState): Promise<void> => {
    try {
      const newProject: Project = {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...values
      };
      await firestore.collection(COLLECTION_NAME).add(newProject);
      openMessage('Project added successfully', 'success');
    } catch (err) {
      openNotification(err?.message, err?.code, 'error');
      console.error(err);
    }
  };

  const removeProject = async (projectId: string): Promise<void> => {
    try {
      setRemoveProjectLoading(true);
      await firestore
        .collection(COLLECTION_NAME)
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
    const unsubscribe = firestore
      .collection(COLLECTION_NAME)
      .orderBy('createdAt', 'desc')
      .onSnapshot(handleSnapshot, handleError);
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="projects page">
      <Title level={1}>My Projects</Title>
      <Table<Project> loading={projectsLoading || removeProjectLoading} dataSource={projects}>
        <Table.Column<Project> key="name" title="Name" dataIndex="name" />
        <Table.Column<Project> key="desc" title="Desc" dataIndex="desc" />
        <Table.Column<Project> key="createdAt" title="Created about" dataIndex="createdAt" />
        <Table.Column<Project> key="updatedAt" title="Updated about" dataIndex="updatedAt" />
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
                onClick={() => removeProject(record?.id as string)}
              />
            </>
          )}
        />
      </Table>
      <Title level={2}>Add a Project</Title>
      <ProjectForm
        callback={addProject}
        initialValues={{ name: '', desc: '' }}
        submitText="Add"
        resetText="Reset"
      />
    </div>
  );
};

export default ProjectsPage;
