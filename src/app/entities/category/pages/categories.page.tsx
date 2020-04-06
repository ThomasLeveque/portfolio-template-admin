import React from 'react';
import { Typography, Table, Button } from 'antd';
import { Category } from '../category.model';
import { useHistory, useLocation } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CategoryForm from '../category.form';
import { useCategory } from '../category.context';
import { formatDistanceToNow } from 'date-fns';

const CategoriesPage = () => {
  const {
    categories,
    categoriesLoading,
    removeCategoryLoading,
    removeCategory,
    addCategory
  } = useCategory();
  const history = useHistory();
  const { pathname } = useLocation();
  const { Title } = Typography;

  return (
    <div className="categories page">
      <Title level={1}>My Categories</Title>
      <Table<Category>
        loading={categoriesLoading || removeCategoryLoading}
        dataSource={categories}
        scroll={{ x: true }}
      >
        <Table.Column<Category> key="name" title="Name" dataIndex="name" />
        <Table.Column<Category>
          key="createdAt"
          title="Created about"
          dataIndex="createdAt"
          width={200}
          render={(createdAt: number) => formatDistanceToNow(createdAt)}
        />
        <Table.Column<Category>
          key="updatedAt"
          title="Updated about"
          dataIndex="updatedAt"
          width={200}
          render={(updatedAt: number) => formatDistanceToNow(updatedAt)}
        />
        <Table.Column<Category>
          key="action"
          title="Action"
          dataIndex="action"
          fixed="right"
          width={120}
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
                onClick={() => removeCategory(record)}
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
