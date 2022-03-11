import { Button, message } from 'antd';
import { useEffect, useState } from "react";
import style from '../../assets/styles/basic-message.module.css';
import roles from "../../config/role";

import LabelHeader from "../../components/label-header";
import StudentMessage from "../../components/student-message";
import TeacherMessage from "../../components/teacher-message";

const BasicMessage = () => {
    const [role, setRole] = useState(roles.STUDENT);
    const [roleMessage, setRoleMessage] = useState();

    useEffect(() => {
        let userRole: any = localStorage.getItem("role") ?? roles.STUDENT;
        setRole(parseInt(userRole));
    }, []);

    const getRoleMessage = (msg: any) => {
        setRoleMessage(msg);
    };

    const handleClickSave = () => {
        console.log(roleMessage);
        if (roleMessage === "errorEmail") {
            message.error('邮箱格式不正确！', 1);
            return;
        }
        message.success('保存成功！', 1);
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