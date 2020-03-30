import React, { useState, useEffect } from 'react';
import { Typography, Table, Button } from 'antd';
import { Category } from '../category.model';
import { useNotif } from '../../../notification/notification.context';
import { useHistory, useLocation } from 'react-router-dom';
import { CategoryInitialState } from '../category.initial-state';
import { firestore } from '../../../firebase/firebase.service';
import { formatError } from '../../../utils/format-error.util';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CategoryForm from '../category.form';
import { COLLECTION_NAME } from '../category.util';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [removeCategoryLoading, setRemoveCategoryLoading] = useState<boolean>(false);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const { openNotification, openMessage } = useNotif();
  const history = useHistory();
  const { pathname } = useLocation();
  const { Title } = Typography;

  const addCategory = async (values: CategoryInitialState): Promise<void> => {
    try {
      const newCategory: Category = {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...values
      };
      await firestore.collection(COLLECTION_NAME).add(newCategory);
      openMessage('Category added successfully', 'success');
    } catch (err) {
      openNotification(err?.message, err?.code, 'error');
      console.error(err);
    }
  };

  const removeCategory = async (categoryId: string): Promise<void> => {
    try {
      setRemoveCategoryLoading(true);
      await firestore
        .collection(COLLECTION_NAME)
        .doc(categoryId)
        .delete();
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
    <div className="categories page">
      <Title level={1}>My Categories</Title>
      <Table<Category> loading={categoriesLoading || removeCategoryLoading} dataSource={categories}>
        <Table.Column<Category> key="name" title="Name" dataIndex="name" />
        <Table.Column<Category> key="createdAt" title="Created about" dataIndex="createdAt" />
        <Table.Column<Category> key="updatedAt" title="Updated about" dataIndex="updatedAt" />
        <Table.Column<Category>
          key="action"
          title="Action"
          dataIndex="action"
          fixed="right"
          render={(text: string, record: Category) => (
            <>
              <Button
                icon={<EditOutlined />}
                style={{ marginRight: '16px' }}
                type="primary"
                onClick={() => history.push(`${pathname}/${record.id}`)}
              />
              <Button
                icon={<DeleteOutlined />}
                type="danger"
                onClick={() => removeCategory(record?.id as string)}
              />
            </>
          )}
        />
      </Table>
      <Title level={2}>Add a Category</Title>
      <CategoryForm
        callback={addCategory}
        initialValues={{ name: '' }}
        submitText="Add"
        resetText="Reset"
      />
    </div>
  );
};

export default CategoriesPage;
