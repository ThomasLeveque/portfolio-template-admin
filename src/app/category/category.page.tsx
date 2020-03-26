import React from 'react';
import { Typography } from 'antd';
import LayoutComponent from '../components/layout/layout.component';

const CategoryPage = () => {
  const { Title } = Typography;
  return (
    <LayoutComponent pageClassName="category">
      <Title level={1}>My Category</Title>
    </LayoutComponent>
  );
};

export default CategoryPage;
