import React from 'react';
import { Typography } from 'antd';

const CategoriesPage = () => {
  const { Title } = Typography;
  return (
    <div className="categories page">
      <Title level={1}>My Categories</Title>
    </div>
  );
};

export default CategoriesPage;
