import React, { useState } from 'react';

import {
    DesktopOutlined,
    HistoryOutlined,
    PieChartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import Header from '../Layout/Header';
import HistoryContent from './HistoryContent';

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Trang chủ', '1', <PieChartOutlined />),
    getItem('Dữ liệu thiết bị', '2', <DesktopOutlined />),
    getItem('Lịch sử hoạt động', '3', <HistoryOutlined />),
    getItem('Hồ sơ', '4', <UserOutlined />)
];

const HistoryActivity: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}>
            <Header />
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Content style={{ margin: '0 16px' }}>
                    <div
                        style={{
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <HistoryContent></HistoryContent>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default HistoryActivity;
