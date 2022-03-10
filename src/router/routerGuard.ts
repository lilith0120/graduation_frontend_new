import { useNavigate, useLocation, useRoutes } from 'react-router-dom';
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
        const router: any = {};
        if (!r.path) {
            return;
        }

        if (r.component) {
            router.element = lazyLoad(r.component, r.meta, routerAuth);
        }

        if (r.children) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            router.children = transformRouters(r.children, routerAuth);
        }

        routersList.push(router);
    });

    return routersList;
};

const LoginGuard = ({ element, meta = {}, routerAuth }: any) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    if (routerAuth) {
        if (temp === element) {
            return element;
        }

        const loginRouter = routerAuth(meta);
        if (loginRouter && loginRouter !== pathname) {
            navigate(loginRouter, { replace: true });
        }
    }

    temp = element;
    return element;
};

const lazyLoad = (component: any, meta = {}, routerAuth: any) => {
    const loading = `<div>loading</div>`;
    const Element = lazy(component);
    const LazyElement =
        `<${Suspense} fallback= { ${loading} } >
            <${Element} _meta={ ${meta} }/>
        </${Suspense}>`;

    return `<${LoginGuard}
                element={ ${LazyElement} }
                meta={ ${meta} }
                routerAuth={ ${routerAuth} }
             />`;
};

export default RouterGuard;