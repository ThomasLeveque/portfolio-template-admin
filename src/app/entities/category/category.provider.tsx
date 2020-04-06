import React, { useEffect, memo, useState } from 'react';
import { useNotif } from '../../notification/notification.context';
import { firestore } from '../../firebase/firebase.service';
import { CategoryInitialState } from './category.initial-state';
import { Category } from './category.model';
import { formatError } from '../../utils/format-error.util';
import { CategoryContext } from './category.context';
import { COLLECTION_NAME } from './category.util';
import { Project } from '../project/project.model';

const CategoryProvider: React.FC = memo(({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [removeCategoryLoading, setRemoveCategoryLoading] = useState<boolean>(false);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const { openNotification, openMessage } = useNotif();

  const addCategory = async (values: CategoryInitialState): Promise<void> => {
    try {
      const newCategory: Category = {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...values,
      };
      await firestore.collection(COLLECTION_NAME).add(newCategory);
      openMessage('Category added successfully', 'success');
    } catch (err) {
      openNotification(err?.message, err?.code, 'error');
      console.error(err);
    }
  };

  const removeCategory = async ({ id, name }: Category): Promise<void> => {
    try {
      setRemoveCategoryLoading(true);
      const batch = firestore.batch();
      const projectsRef: firebase.firestore.CollectionReference = firestore.collection('projects');
      const categoryRef: firebase.firestore.DocumentReference = firestore
        .collection(COLLECTION_NAME)
        .doc(id);

      const snapshot: firebase.firestore.QuerySnapshot = await projectsRef
        .where(COLLECTION_NAME, 'array-contains', name)
        .get();
      // It means the category deleted is not used
      if (!snapshot.empty) {
        for (const doc of snapshot.docs) {
          const projectRef = projectsRef.doc(doc.id);
          const project = new Project(doc);
          const newCategories = project.categories.filter((category: string) => category !== name);
          batch.update(projectRef, COLLECTION_NAME, newCategories);
        }
      }
      batch.delete(categoryRef);
      await batch.commit();
      setRemoveCategoryLoading(false);
      openMessage('Category removed successfully', 'success');
    } catch (err) {
      setRemoveCategoryLoading(false);
      openNotification(err?.message, err?.code, 'error');
      console.error(err);
    }
  };

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot) => {
    const firestoreCategories = snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => {
      return new Category(doc);
    });
    setCategoriesLoading(false);
    setCategories(firestoreCategories);
  };

  const handleError = (err: any) => {
    setCategoriesLoading(false);
    openNotification('Cannot load your categories', formatError(err), 'error');
    console.error(err);
  };

  useEffect(() => {
    setCategoriesLoading(true);
    const unsubscribe = firestore
      .collection(COLLECTION_NAME)
      .orderBy('createdAt', 'desc')
      .onSnapshot(handleSnapshot, handleError);
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        categoriesLoading,
        removeCategoryLoading,
        addCategory,
        removeCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
});

export default CategoryProvider;
