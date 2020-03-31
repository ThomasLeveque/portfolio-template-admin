import React, { useEffect, useState } from 'react';
import { Typography, PageHeader, Descriptions } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { firestore } from '../../../firebase/firebase.service';
import { Project } from '../project.model';
import { toCapitalize } from '../../../utils/parse-string.util';
import LoadingComponent from '../../../components/loading/loading.component';
import { ProjectInitialState } from '../project.initial-state';
import { useNotif } from '../../../notification/notification.context';
import ProjectForm from '../project.form';
import { COLLECTION_NAME } from '../project.util';

const ProjectPage = () => {
  const [project, setProject] = useState<Project | null>(null);
  const { Title } = Typography;
  const history = useHistory();
  const { openNotification, openMessage } = useNotif();
  const { projectId } = useParams();

  useEffect(() => {
    const unsubscribe = firestore
      .doc(`${COLLECTION_NAME}/${projectId}`)
      .onSnapshot((doc: firebase.firestore.DocumentSnapshot) => {
        setProject(new Project(doc));
      });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const updateProject = async (values: ProjectInitialState): Promise<void> => {
    try {
      const updatedProject: Project = {
        updatedAt: Date.now(),
        ...values
      };
      await firestore
        .collection(COLLECTION_NAME)
        .doc(projectId)
        .update(updatedProject);
      openMessage('Project updated successfully', 'success');
    } catch (err) {
      openNotification(err?.message, err?.code, 'error');
      console.error(err);
    }
  };

  if (!project) {
    return <LoadingComponent withHeader />;
  }

  return (
    <div className="project page">
      <PageHeader
        onBack={history.goBack}
        title={<Title level={1}>Update:{toCapitalize(project?.name as string)}</Title>}
      />
      <ProjectForm
        callback={updateProject}
        initialValues={{
          name: project.name,
          desc: project.desc,
          date: project.date,
          skills: project.skills,
          categories: project.categories
        }}
        submitText="Update"
        resetText="Cancel"
      />
      <Descriptions bordered title="Date Infos">
        <Descriptions.Item label="Created about">{project.createdAt}</Descriptions.Item>
        <Descriptions.Item label="Updated about">{project.updatedAt}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ProjectPage;
