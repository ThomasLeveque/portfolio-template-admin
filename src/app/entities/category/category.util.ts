import { firestore } from '../../firebase/firebase.service';
export const COLLECTION_NAME = 'categories';

export const checkForExistingCategory = async (categoryName: string): Promise<string> => {
  const lowerName = categoryName.toLowerCase();
  const categoriesSnapshot: firebase.firestore.QuerySnapshot = await firestore
    .collection(COLLECTION_NAME)
    .where('name', '==', lowerName)
    .get();

  if (!categoriesSnapshot.empty) {
    throw new Error(`Category ${categoryName} already exist !`);
  }

  return lowerName;
};
