import React, { useEffect, memo, useState } from 'react';

import { ProjectContext } from './project.context';
import { Project } from './project.model';
import { useNotif } from '../../notification/notification.context';
import { ProjectInitialState } from './project.initial-state';
import { firestore } from '../../firebase/firebase.service';
import { COLLECTION_NAME } from './project.util';
import { formatError } from '../../utils/format-error.util';

const ProjectProvider: React.FC = memo(({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [removeProjectLoading, setRemoveProjectLoading] = useState<boolean>(false);
  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);
  const { openNotification, openMessage } = useNotif();

  const addProject = async (values: ProjectInitialState): Promise<void> => {
    try {
      const newProject: Project = {
        ...values,
        createdAt: Date.now(),
        updatedAt: Date.now(),
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
      await firestore.collection(COLLECTION_NAME).doc(projectId).delete();
      setRemoveProjectLoading(false);
      openMessage('Project removed successfully', 'success');
    } catch (err) {
      setRemoveProjectLoading(false);
      openNotification(err?.message, err?.code, 'error');
      console.error(err);
    }
  };

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot): void => {
    const firestoreProjects = snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => {
      return new Project(doc);
    });
    setProjectsLoading(false);
    setProjects(firestoreProjects);
  };

  const handleError = (err: any): void => {
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
    <ProjectContext.Provider
      value={{
        projects,
        removeProjectLoading,
        projectsLoading,
        addProject,
        removeProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
});

export default ProjectProvider;
