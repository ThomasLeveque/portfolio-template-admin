import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';

import { logout } from '../../user/user.service';

import './layout.styles.less';

interface IProps {
  withHeader?: boolean;
  pageClassName: string;
}

const LayoutComponent: React.FC<IProps> = ({ withHeader = true, pageClassName, children }) => {
  const location = useLocation();
  const { Header, Content } = Layout;

  const parsePathname = (): string => {
    const slitedLocation: string[] = location.pathname.split('/');
    if (!!slitedLocation[0]) {
      return `/${slitedLocation[0]}`;
    } else {
      return `/${slitedLocation[1]}`;
    }
  };

  const memoPathname = useMemo(parsePathname, [location.pathname]);

  return (
    <Layout className="layout">
      {withHeader && (
        <Header className="layout-header">
          <Menu theme="dark" mode="horizontal" selectedKeys={[memoPathname]}>
            <Menu.Item key="/projects">
              <Link to="/projects">Projects</Link>
            </Menu.Item>
            <Menu.Item key="/categories">
              <Link to="/categories">Categories</Link>
            </Menu.Item>
          </Menu>
          <Button onClick={logout} type="primary">
            Logout
          </Button>
        </Header>
      )}
      <Content className={`layout-content ${pageClassName}`}>{children}</Content>
    </Layout>
  );
};

export default LayoutComponent;
