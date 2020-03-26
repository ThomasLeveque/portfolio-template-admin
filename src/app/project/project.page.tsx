import React from 'react';
import LayoutComponent from '../components/layout/layout.component';
import { Typography } from 'antd';

const ProjectPage = () => {
  const { Title } = Typography;
  return (
    <LayoutComponent pageClassName="project">
      <Title level={1}>My Project</Title>
    </LayoutComponent>
  );
};

export default ProjectPage;
