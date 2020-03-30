import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

import './not-found.styles.less';
import { HEADER_HEIGHT } from '../../utils/constants.util';

const NotFound = () => {
  let location = useLocation();
  const { Title } = Typography;
  const withHeader = location.pathname.includes('/entities');

  return (
    <div
      className="not-found"
      style={{ height: withHeader ? `calc(100vh - ${HEADER_HEIGHT}px)` : '100vh' }}
    >
      <div>
        <Title level={1}>
          <code>{location.pathname}</code>Not Found
        </Title>
        <Link to="/">
          Go back to home <HomeOutlined />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
