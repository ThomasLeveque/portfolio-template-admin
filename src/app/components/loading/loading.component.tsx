import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

import { HEADER_HEIGHT } from '../../utils/constants.util';

import './loading.styles.less';

interface IProps {
  withHeader?: boolean;
}

const LoadingComponent: React.FC<IProps> = ({ withHeader = false, ...props }) => {
  return (
    <div
      className="loading"
      style={withHeader ? { height: `calc(100vh - ${HEADER_HEIGHT}px)` } : undefined}
    >
      <LoadingOutlined />
    </div>
  );
};

export default LoadingComponent;
