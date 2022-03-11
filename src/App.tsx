import 'antd/dist/antd.css';
import zhCN from 'antd/lib/locale/zh_CN';
import './App.css';
import { ConfigProvider, Layout } from 'antd';
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import RouterGuard from './router/routerGuard';
import { routers, routerAuth } from './router/routerConfig';

import Header from "./frame/header";
import Side from './frame/side';

const App = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [isLoginPage, setIsLoginPage] = useState(false);

    useEffect(() => {
        if (location.pathname.indexOf("login") === -1) {
            setIsLoginPage(false);
        } else {
            setIsLoginPage(true);
        }
    }, [location]);

    const handleCollapseClick = (collapsed: any) => {
        setCollapsed(collapsed);
    };

    return (
        <div className="home">
            <ConfigProvider locale={zhCN}>
                <div className="home">
                    {
                        !isLoginPage ?
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
                            </Layout> :
                            <RouterGuard
                                routers={routers}
                                routerAuth={routerAuth} />
                    }
                </div>
            </ConfigProvider>
        </div>
    )
}

export default App;
