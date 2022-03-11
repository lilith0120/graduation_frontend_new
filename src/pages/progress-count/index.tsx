import { useEffect, useState } from "react";
import roles from "../../config/role";

import LabelHeader from "../../components/label-header";
import StudentProgressCount from "../../components/student-progress-count";
import TeacherProgressCount from "../../components/teacher-progress-count";
import AdminProgressCount from "../../components/admin-progress-count";

const ProgressCount = () => {
    const [role, setRole] = useState(roles.STUDENT);

    useEffect(() => {
        let userRole: any = localStorage.getItem("role") ?? roles.STUDENT;
        setRole(parseInt(userRole));
    }, []);

    return (
        <div>
            <LabelHeader label={"进度统计"} />
            {
                role === roles.STUDENT ?
                    <StudentProgressCount /> :
                    role === roles.TEACHER ?
                        <TeacherProgressCount /> :
                        <AdminProgressCount />
            }
        </div>
    );
};

export default ProgressCount;