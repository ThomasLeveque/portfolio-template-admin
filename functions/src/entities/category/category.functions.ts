import * as functions from 'firebase-functions';

import { firestore } from '../../firebase/firebase.service';
import { getCategoryProjects } from './category.service';
import { Category } from './category.interface';
import { Project } from '../project/project.interface';

export const getCategories = functions.https.onRequest(
  async (request: functions.https.Request, response: functions.Response<Category[] | string>) => {
    try {
      const snapshot: FirebaseFirestore.QuerySnapshot = await firestore
        .collection('categories')
        .get();
      const categories: Promise<Category>[] = snapshot.docs.map(
        async (doc: FirebaseFirestore.QueryDocumentSnapshot) => {
          const projects: Project[] = await getCategoryProjects(doc.id);
          return {
            ...doc.data(),
            id: doc.id,
            projects,
          } as Category;
        }
      );
      const populatedCategories: Category[] = await Promise.all(categories);
      response.send(populatedCategories);
    } catch (err) {
      console.log(err);
      response.send(err.message);
    }
  }
);

export const getCategory = functions.https.onRequest(
  async (request: functions.https.Request, response: functions.Response<Category | string>) => {
    try {
      const categoryId = (request.query as { categoryId: string }).categoryId;

      if (!categoryId) {
        console.log('ERROR: You must provide a categoryId');
        response.status(400).send('ERROR: You must provide a categoryId');
      }

      const doc: FirebaseFirestore.DocumentSnapshot = await firestore
        .collection('categories')
        .doc(categoryId)
        .get();
      const projects: Project[] = await getCategoryProjects(doc.id);
      const category = { ...doc.data(), id: doc.id, projects } as Category;
      response.send(category);
    } catch (err) {
      console.log(err);
      response.send(err.message);
    }
  }
);
