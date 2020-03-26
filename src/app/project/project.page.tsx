import React from 'react';
import { Typography } from 'antd';

const ProjectPage = () => {
  const { Title } = Typography;
  return (
    <div className="project page">
      <Title level={1}>My Project</Title>
    </div>
  );
};

export default ProjectPage;
