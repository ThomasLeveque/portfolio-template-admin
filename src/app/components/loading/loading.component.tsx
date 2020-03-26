import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

import './loading.styles.less';

const LoadingComponent = () => {
  return (
    <div className="loading">
      <LoadingOutlined />
    </div>
  );
};

export default LoadingComponent;
