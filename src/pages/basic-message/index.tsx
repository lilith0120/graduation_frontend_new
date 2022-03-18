import { Button, message } from 'antd';
import { useEffect, useState } from "react";
import style from '../../assets/styles/basic-message.module.css';
import roles from "../../config/role";
import axios from '../../http';

import LabelHeader from "../../components/label-header";
import StudentMessage from "../../components/student-message";
import TeacherMessage from "../../components/teacher-message";

const BasicMessage = () => {
    const [role, setRole] = useState<number>();
    const [roleMessage, setRoleMessage] = useState();

    useEffect(() => {
        let userRole: any = localStorage.getItem("role") ?? roles.STUDENT;
        setRole(parseInt(userRole));
    }, []);

    const getRoleMessage = (msg: any) => {
        setRoleMessage(msg);
    };

    const handleClickSave = async () => {
        if (roleMessage === "errorEmail") {
            message.error('邮箱格式不正确！', 1);
            return;
        }

        const res = await saveEmail(roleMessage);
        if (!res) {
            return;
        }
        message.success('保存成功！', 1);
    };

    const saveEmail = async (body: any) => {
        return await axios.patch('/api/user/email', {
            email: body.email,
        });
    };

    return (
        <div className={style.basic_message}>
            <div className={style.header}>
                <LabelHeader label={"基本信息"} />
                <Button className={style.header_btn} type="primary" onClick={handleClickSave}>
                    保存
                </Button>
            </div>
            <div className={style.message}>
                {
                    role === roles.STUDENT ?
                        <StudentMessage stuMsgSave={getRoleMessage} /> :
                        <TeacherMessage teaMsgSave={getRoleMessage} />
                }
            </div>
        </div>
    );
};

export default BasicMessage;