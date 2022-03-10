import 'antd/dist/antd.css';
import zhCN from 'antd/lib/locale/zh_CN';
import './App.css';
import { ConfigProvider, Layout } from 'antd';
import { useState } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import RouterGuard from './router/routerGuard';
import { routers, routerAuth } from './router/routerConfig';

import Header from "./frame/header";
import Side from './frame/side';

const App = () => {
    const [collapsed, setCollapsed] = useState(false);

    const handleCollapseClick = (collapsed: any) => {
        setCollapsed(collapsed);
    };

    return (
        <div className="home">
            <Router>
                <ConfigProvider locale={zhCN}>
                    <div className="home">
                        <Layout className="home_layout">
                            <Layout.Header className="home_header">
                                <Header />
                            </Layout.Header>
                            <Layout>
                                <Layout.Sider collapsible collapsed={collapsed} onCollapse={handleCollapseClick}>
                                    <Side />
                                </Layout.Sider>
                                <Layout.Content className="home_content">
                                    <RouterGuard
                                        routers={routers}
                                        routerAuth={routerAuth} />
                                </Layout.Content>
                            </Layout>
                        </Layout>
                    </div>
                </ConfigProvider>
            </Router>
        </div>
    )
}

export default App;
