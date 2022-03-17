import axios from "axios";
import { message } from "antd";

const fileHttp = axios.create({
    baseURL: "http://81.71.128.138:8000",
    // headers: {
    //     'Content-Type': 'multipart/form-data',
    // }
});

// 配置请求拦截
fileHttp.interceptors.request.use(
    (config: any) => {
        config.headers.token = localStorage.getItem("token") || "";

        return config;
    },
    err => {
        Promise.reject(err);
    }
);

// 配置响应拦截器
fileHttp.interceptors.response.use(
    response => {
        const { msg, code } = response.data;
        if (code !== 0) {
            message.error(`${msg}`, 1);

            return;
        }
        return msg;
    },
    err => {
        if (err.response) {
            switch (err.response.status) {
                case 401:
                    localStorage.clear();
            }
        }
        return Promise.reject(err)
    }
);

export default fileHttp;