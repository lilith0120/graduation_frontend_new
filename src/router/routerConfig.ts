

const routers = [
    {
        path: "/login",
        // component: LoginTest,
        auth: false
    },
    // {
    //     path: "/login",
    //     component: Login,
    //     auth: false
    // },
    // {
    //     path: "/register",
    //     component: Register,
    //     auth: false
    // },
    // {
    //     path: "/find_password",
    //     component: FindPassword,
    //     auth: false
    // },
    // {
    //     path: "/main/notice",
    //     component: Notice,
    //     auth: true
    // },
    // {
    //     path: "/main/post",
    //     component: Post,
    //     auth: false
    // },
    // {
    //     path: "/main/post/createpost",
    //     component: CreatePost,
    //     auth: true,
    // },
    // {
    //     path: "/main/post/postdetail",
    //     component: PostDetail,
    //     auth: false,
    // },
    // {
    //     path: "/main/profile",
    //     component: Profile,
    //     auth: false
    // },

    // {
    //     path: "/main/profile/mypublish",
    //     component: MyPublish,
    //     auth: true
    // },

    // {
    //     path: "/main/profile/mycollection",
    //     component: MyCollection,
    //     auth: true
    // },

    // {
    //     path: "/main/profile/mydraft",
    //     component: MyDraft,
    //     auth: true
    // },

    // {
    //     path: "/main/profile/theme",
    //     component: Theme,
    //     auth: true
    // },

    // {
    //     path: "/main/profile/authentication",
    //     component: Authentication,
    //     auth: true
    // },

    // {
    //     path: "/main/profile/setup",
    //     component: Setup,
    //     auth: true
    // },
    // {
    //     path: "/main/profile/setup/avatar",
    //     component: EditAvatar,
    //     auth: true
    // },

    // {
    //     path: "/main/task",
    //     component: Task,
    //     auth: true
    // },
    // {
    //     path: "/main/task/createtask",
    //     component: CreateTask,
    //     auth: true
    // },
    // {
    //     path: "/main/task/taskdetail",
    //     component: TaskDetail,
    //     auth: true
    // },
    // {
    //     path: "/main/report",
    //     component: Report,
    //     auth: true
    // },
    // {
    //     path: "/notfound",
    //     component: NotFound,
    //     auth: false
    // },
];

const routerAuth = (meta: any) => {
    if (meta.title) {
        document.title = meta.title;
    }

    const token = localStorage.getItem("token") || '';
    if (!token && meta.isAuth) {
        return '/';
    }
}

export {
    routers,
    routerAuth,
};