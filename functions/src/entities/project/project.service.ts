import { firestore } from '../../firebase/firebase.service';
import { Image } from '../image/image.interface';
import { Category } from '../category/category.interface';
import { Project } from './project.interface';

export const getProjectImages = async (imageIds: string[]): Promise<Image[]> => {
  if (imageIds.length === 0) return [];

  const images: Promise<Image>[] = imageIds.map(async (imageId: string) => {
    const image: FirebaseFirestore.DocumentSnapshot = await firestore
      .collection('images')
      .doc(imageId)
      .get();
    return {
      id: image.id,
      ...image.data(),
    } as Image;
  });
  return await Promise.all(images);
};

export const getProjectCategories = async (categoryIds: string[]): Promise<Category[]> => {
  if (categoryIds.length === 0) return [];

  const categories: Promise<Category>[] = categoryIds.map(async (categoryId: string) => {
    const category: FirebaseFirestore.DocumentSnapshot = await firestore
      .collection('categories')
      .doc(categoryId)
      .get();
    return {
      id: category.id,
      ...category.data(),
    } as Category;
  });
  return await Promise.all(categories);
};

export const populateProjects = async (
  projectsToPopulate: FirebaseFirestore.QuerySnapshot
): Promise<Project[]> => {
  if (projectsToPopulate.empty) return [];

  const projects = projectsToPopulate.docs.map(
    async (doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      const categories: Category[] = await getProjectCategories(data.categories);
      const images: Image[] = await getProjectImages(data.images);
      return {
        ...data,
        id: doc.id,
        categories,
        images,
      } as Project;
    }
  );
  return await Promise.all(projects);
};
