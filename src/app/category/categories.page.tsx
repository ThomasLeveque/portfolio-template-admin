import React from 'react';
import { Typography } from 'antd';
import LayoutComponent from '../components/layout/layout.component';

const CategoriesPage = () => {
  const { Title } = Typography;
  return (
    <LayoutComponent pageClassName="categories">
      <Title level={1}>My Categories</Title>
    </LayoutComponent>
  );
};

export default CategoriesPage;
