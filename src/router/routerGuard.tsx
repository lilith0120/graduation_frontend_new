import { useLocation, useRoutes, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

let temp: any = null;

const RouterGuard = ({ routers, routerAuth }: any) => {
    const routerList = transformRouters(routers, routerAuth);
    const element = useRoutes(routerList);

    return element;
};

const transformRouters = (routers = [], routerAuth: any) => {
    const routersList: any[] = [];
    routers.forEach((r: any) => {
        const router: any = {
            path: r.path,
        };
        if (!r.path) {
            return;
        }

        if (r.component) {
            router.element = lazyLoad(r.component, r.meta, routerAuth);
        }

        if (r.children) {
            router.children = transformRouters(r.children, routerAuth);
        }

        routersList.push(router);
    });

    return routersList;
};

const LoginGuard = ({ element, meta = {}, routerAuth }: any) => {
    const { pathname } = useLocation();

    if (routerAuth) {
        if (temp === element) {
            return element;
        }

        const isLogin = routerAuth(meta);
        if (!isLogin && pathname !== "/login") {
            element = <Navigate to="/login" replace />
        } else if ((pathname === "/" || pathname === "/login") && isLogin) {
            element = <Navigate to="/progress-count" replace />
        }
    }

    temp = element;
    return element;
};

const lazyLoad = (component: any, meta: any, routerAuth: any) => {
    const loading = <div></div>;
    const Element = lazy(component);
    const LazyElement = <Suspense fallback={loading} ><Element _meta={meta} /></Suspense>;

    return <LoginGuard
        element={LazyElement}
        meta={meta}
        routerAuth={routerAuth} />;
};

export default RouterGuard;