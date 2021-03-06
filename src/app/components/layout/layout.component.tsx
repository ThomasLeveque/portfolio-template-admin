import React, { useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';

import { logout } from '../../user/user.service';
import { useNotif } from '../../notification/notification.context';

import './layout.styles.less';

interface IProps {
  withHeader?: boolean;
  pageClassName?: string;
}

const LayoutComponent: React.FC<IProps> = ({ withHeader = true, pageClassName = '', children }) => {
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
  const { openNotification, openMessage } = useNotif();
  const location = useLocation();
  const { Header, Content } = Layout;

  const handleLogout = async (): Promise<void> => {
    try {
      setLogoutLoading(true);
      await logout();
      // Do not setLogoutLoading(false) because route will change
      openMessage('Your are now logout', 'success');
    } catch (err) {
      setLogoutLoading(false);
      openNotification(err?.message, err?.code, 'error');
      console.error(err);
    }
  };

  const parsePathname = (): string => {
    const slitedLocation: string[] = location.pathname.replace('/entities', '').split('/');
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
              <Link to="/entities/projects">Projects</Link>
            </Menu.Item>
            <Menu.Item key="/categories">
              <Link to="/entities/categories">Categories</Link>
            </Menu.Item>
            <Menu.Item key="/images">
              <Link to="/entities/images">Images</Link>
            </Menu.Item>
          </Menu>
          <Button loading={logoutLoading} onClick={handleLogout} type="primary">
            Logout
          </Button>
        </Header>
      )}
      <Content className={`layout-content ${pageClassName}`}>{children}</Content>
    </Layout>
  );
};

export default LayoutComponent;
