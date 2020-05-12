import React, { useEffect, memo, useState } from 'react';

import { useNotif } from '../../notification/notification.context';
import { firestore, FieldValue } from '../../firebase/firebase.service';
import { CategoryInitialState } from './category.initial-state';
import { Category } from './category.model';
import { formatError } from '../../utils/format-error.util';
import { CategoryContext } from './category.context';
import { COLLECTION_NAME, checkForExistingCategory, PARENT_COLLECTION_NAME } from './category.util';
import CategorySerializer from './category.serializer';
import { CategoryMapping } from './category.interface';

const CategoryProvider: React.FC = memo(({ children }) => {
  const [categories, setCategories] = useState<CategoryMapping>({});
  const [removeCategoryLoading, setRemoveCategoryLoading] = useState<boolean>(false);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const { openNotification, openMessage } = useNotif();

  const addCategory = async ({ name }: CategoryInitialState): Promise<void> => {
    try {
      const lowerName = await checkForExistingCategory(name);
      const newCategory: Category = {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        name: lowerName,
      };
      await firestore.collection(COLLECTION_NAME).add(newCategory);
      openMessage('Category added successfully', 'success');
    } catch (err) {
      openNotification(err?.message, err?.code, 'error');
      console.error(err);
    }
  };

  const removeCategory = async (categoryIdToRemove: string): Promise<void> => {
    try {
      setRemoveCategoryLoading(true);
      const batch = firestore.batch();
      const projectsRef: firebase.firestore.CollectionReference = firestore.collection(
        PARENT_COLLECTION_NAME
      );
      const categoryRef: firebase.firestore.DocumentReference = firestore
        .collection(COLLECTION_NAME)
        .doc(categoryIdToRemove);

      const projectsWithCategoryToRemove: firebase.firestore.QuerySnapshot = await projectsRef
        .where(COLLECTION_NAME, 'array-contains', categoryIdToRemove)
        .get();
      // Category deleted is used
      if (!projectsWithCategoryToRemove.empty) {
        for (const doc of projectsWithCategoryToRemove.docs) {
          const projectRef = projectsRef.doc(doc.id);
          const newCategories = FieldValue.arrayRemove(categoryIdToRemove);
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

  const handleSnapshot = ({ docs }: firebase.firestore.QuerySnapshot) => {
    const categories: CategoryMapping = {};
    docs.map(
      (doc: firebase.firestore.DocumentSnapshot) =>
        (categories[doc.id] = CategorySerializer.fromJson(doc))
    );
    setCategoriesLoading(false);
    setCategories(categories);
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
