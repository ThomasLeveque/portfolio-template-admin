import * as functions from 'firebase-functions';

import { firestore } from '../../firebase/firebase.service';
import { populateProjects, getProjectCategories, getProjectImages } from './project.service';
import { Project } from './project.interface';
import { Category } from '../category/category.interface';
import { Image } from '../image/image.interface';

export const getProjects = functions.https.onRequest(
  async (request: functions.https.Request, response: functions.Response<Project[] | string>) => {
    try {
      const projects: FirebaseFirestore.QuerySnapshot = await firestore
        .collection('projects')
        .get();
      const populatedProjects: Project[] = await populateProjects(projects);
      response.send(populatedProjects);
    } catch (err) {
      console.log(err);
      response.send(err.message);
    }
  }
);

export const getProject = functions.https.onRequest(
  async (request: functions.https.Request, response: functions.Response<Project | string>) => {
    try {
      const projectId = (request.query as { projectId: string }).projectId;

      if (!projectId) {
        console.log('ERROR: You must provide a projectId');
        response.status(400).send('ERROR: You must provide a projectId');
      }

      const doc: FirebaseFirestore.DocumentSnapshot = await firestore
        .collection('projects')
        .doc(projectId)
        .get();
      const data = doc.data();
      const categories: Category[] = await getProjectCategories(data?.categories);
      const images: Image[] = await getProjectImages(data?.images);
      const project = { ...data, id: doc.id, categories, images } as Project;
      response.send(project);
    } catch (err) {
      console.log(err);
      response.send(err.message);
    }
  }
);
