import { firestore } from '../../firebase/firebase.service';
import { populateProjects } from '../project/project.service';
import { Project } from '../project/project.interface';

export const getCategoryProjects = async (categoryId: string): Promise<Project[]> => {
  const matchedProjects: FirebaseFirestore.QuerySnapshot = await firestore
    .collection('projects')
    .where('categories', 'array-contains', categoryId)
    .get();

  return await populateProjects(matchedProjects);
};
