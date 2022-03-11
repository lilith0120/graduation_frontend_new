const Login = () => import('../pages/login');
const ProgressCount = () => import('../pages/progress-count');
const SubmitList = () => import('../pages/submit-list/index');
const SubmitListDetail = () => import('../pages/submit-list/detail/[id]');
const SubmitListEdit = () => import('../pages/submit-list/edit/[id]');
const BasicMessage = () => import('../pages/basic-message/index');
const StudentList = () => import('../pages/student-list/index');
const StudentListDetail = () => import('../pages/student-list/detail/[id]');
const StudentListEdit = () => import('../pages/student-list/edit/[id]');
const StudentListStageDetail = () => import('../pages/student-list/stage-detail/[id]');
const Process = () => import('../pages/process/index');
const ReviewList = () => import('../pages/review-list/index');
const ReviewListDetail = () => import('../pages/review-list/detail/[id]');
const TeacherList = () => import('../pages/teacher-list/index');
const TeacherListDetail = () => import('../pages/teacher-list/detail/[id]');
const TeacherListEdit = () => import('../pages/teacher-list/edit/[id]');

const routers = [
    {
        path: "/login",
        component: Login,
        meta: {
            isAuth: false,
            title: "登录",
        },
    },
    {
        path: "/progress-count",
        component: ProgressCount,
        meta: {
            isAuth: true,
            title: "进度统计",
        },
    },
    {
        path: "/submit-list/*",
        component: SubmitList,
        meta: {
            isAuth: true,
            title: "提交列表",
        },
    },
    {
        path: "/submit-list/detail/:id",
        component: SubmitListDetail,
        meta: {
            isAuth: true,
            title: "提交列表-详细",
        },
    },
    {
        path: "/submit-list/edit/:id",
        component: SubmitListEdit,
        meta: {
            isAuth: true,
            title: "提交列表-编辑",
        },
    },
    {
        path: "/basic-message",
        component: BasicMessage,
        meta: {
            isAuth: true,
            title: "基本信息",
        },
    },
    {
        path: "/student-list",
        component: StudentList,
        meta: {
            isAuth: true,
            title: "学生信息",
        },
    },
    {
        path: "/student-list/detail/:id",
        component: StudentListDetail,
        meta: {
            isAuth: true,
            title: "学生信息-详细",
        },
    },
    {
        path: "/student-list/edit/:id",
        component: StudentListEdit,
        meta: {
            isAuth: true,
            title: "学生信息-编辑",
        },
    },
    {
        path: "/student-list/stage-detail/:id",
        component: StudentListStageDetail,
        meta: {
            isAuth: true,
            title: "学生信息-进度详细",
        },
    },
    {
        path: "/process",
        component: Process,
        meta: {
            isAuth: true,
            title: "毕业设计流程",
        },
    },
    {
        path: "/review-list",
        component: ReviewList,
        meta: {
            isAuth: true,
            title: "审核列表",
        },
    },
    {
        path: "/review-list/detail/:id",
        component: ReviewListDetail,
        meta: {
            isAuth: true,
            title: "审核列表-详细",
        },
    },
    {
        path: "/teacher-list",
        component: TeacherList,
        meta: {
            isAuth: true,
            title: "教师列表",
        },
    },
    {
        path: "/teacher-list/detail/:id",
        component: TeacherListDetail,
        meta: {
            isAuth: true,
            title: "教师列表-详细",
        },
    },
    {
        path: "/teacher-list/edit/:id",
        component: TeacherListEdit,
        meta: {
            isAuth: true,
            title: "教师列表-编辑",
        },
    },
];

const routerAuth = (meta: any) => {
    if (meta.title) {
        document.title = meta.title;
    }

    const token = localStorage.getItem("token") || '';
    if (!token && meta.isAuth) {
        return false;
    } else if (token) {
        return true;
    }
}

export {
    routers,
    routerAuth,
};