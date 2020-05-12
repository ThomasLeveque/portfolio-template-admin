import React, { useState, useEffect } from 'react';
import { Typography, PageHeader, Descriptions } from 'antd';
import { useHistory, useParams } from 'react-router-dom';

import { useNotif } from '../../../notification/notification.context';
import { Category } from '../category.model';
import { firestore } from '../../../firebase/firebase.service';
import { CategoryInitialState } from '../category.initial-state';
import LoadingComponent from '../../../components/loading/loading.component';
import { toCapitalize } from '../../../utils/parse-string.util';
import CategoryForm from '../category.form';
import { COLLECTION_NAME, checkForExistingCategory } from '../category.util';
import { formatDistanceToNow } from 'date-fns';
import CategorySerializer from '../category.serializer';

const CategoryPage = () => {
  const [category, setCategory] = useState<Category | null>(null);
  const { Title } = Typography;
  const history = useHistory();
  const { openNotification, openMessage } = useNotif();
  const { categoryId } = useParams();

  useEffect(() => {
    const unsubscribe = firestore
      .doc(`${COLLECTION_NAME}/${categoryId}`)
      .onSnapshot((doc: firebase.firestore.DocumentSnapshot) => {
        setCategory(CategorySerializer.fromJson(doc));
      });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const updateCategory = async ({ name }: CategoryInitialState): Promise<void> => {
    try {
      const lowerName = await checkForExistingCategory(name);

      const categoryRef: firebase.firestore.DocumentReference = firestore
        .collection(COLLECTION_NAME)
        .doc(categoryId);
      await categoryRef.update({ updatedAt: Date.now(), name: lowerName });

      openMessage('Category updated successfully', 'success');
    } catch (err) {
      openNotification(err?.message, err?.code, 'error');
      console.error(err);
    }
  };

  if (!category) {
    return <LoadingComponent withHeader />;
  }

  return (
    <div className="category page">
      <PageHeader
        onBack={history.goBack}
        title={<Title level={1}>Update:{toCapitalize(category?.name as string)}</Title>}
      />
      <CategoryForm
        callback={updateCategory}
        initialValues={{ name: category.name }}
        submitText="Update"
        resetText="Cancel"
      />
      <Descriptions bordered title="Date Infos">
        <Descriptions.Item label="Created about">
          {formatDistanceToNow(category.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Updated about">
          {formatDistanceToNow(category.updatedAt)}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default CategoryPage;
