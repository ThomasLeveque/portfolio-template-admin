import React from 'react';
import { Typography } from 'antd';

const CategoryPage = () => {
  const { Title } = Typography;
  return (
    <div className="category page">
      <Title level={1}>My Category</Title>
    </div>
  );
};

export default CategoryPage;
