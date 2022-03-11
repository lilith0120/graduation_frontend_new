import { useEffect, useState } from "react";
import style from '../../assets/styles/process.module.css';
import roles from "../../config/role";

import LabelHeader from "../../components/label-header";
import TeacherProcess from "../../components/teacher-process";
import AdminProcess from "../../components/admin-process";

const Process = () => {
    const [role, setRole] = useState(roles.TEACHER);

    useEffect(() => {
        let userRole: any = localStorage.getItem("role") ?? roles.TEACHER;
        setRole(parseInt(userRole));
    }, []);

    return (
        <div className={style.process}>
            <LabelHeader label={"毕业设计流程"} />
            {
                role === roles.TEACHER ?
                    <TeacherProcess /> :
                    <AdminProcess />
            }
        </div>
    )
};

export default Process;