import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

import './loading.styles.less';

const LoadingComponent = ({ ...props }) => {
  return (
    <div className="loading" {...props}>
      <LoadingOutlined />
    </div>
  );
};

export default LoadingComponent;
