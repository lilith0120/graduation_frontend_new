import style from '../../assets/styles/process.module.css';
import roles from "../../config/role";

import LabelHeader from "../../components/label-header";
import TeacherProcess from "../../components/teacher-process";
import AdminProcess from "../../components/admin-process";

const Process = () => {
    const userType = localStorage.getItem("role") ?? roles.STUDENT.toString();
    const role = parseInt(userType);

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