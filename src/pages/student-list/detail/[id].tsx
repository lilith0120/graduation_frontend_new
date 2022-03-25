import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Space, Descriptions } from 'antd';
import roles from "../../../config/role";
import style from '../../../assets/styles/student-list/detail.module.css';
import axios from '../../../http';

import LabelHeader from "../../../components/label-header";

const StudentDetail = () => {
    const params = useParams();
    const navigate = useNavigate();
    const userType = localStorage.getItem("role") ?? roles.TEACHER.toString();
    const role = parseInt(userType);
    const [studentId, setStudentId] = useState(-1);
    const [studentDetail, setStudentDetail] = useState<StudentData>({
        name: "", grade: "",
        Profession: { name: "" }, sex: "",
        User: { email: "", user_id: "" }, Teacher: { name: "" },
    });

    useEffect(() => {
        const { id }: any = params;
        if (id) {
            setStudentId(parseInt(id));
        } else {
            const path = window.location.pathname.split('/');
            const si: any = path[path.length - 1];
            setStudentId(parseInt(si));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (studentId !== -1) {
            if (role === roles.ADMIN) {
                fetchDataByAdmin();
            } else if (role === roles.TEACHER) {
                fetchDataByTeacher();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentId, role]);

    const fetchDataByAdmin = async () => {
        const res: any = await axios.get(`/api/admin/show_student/${studentId}`);
        if (res.group) {
            let group_teacher = "";
            res.group.forEach((item: any, index: any) => {
                let content;
                if (index === 0) {
                    content = item;
                } else {
                    content = `, ${item}`;
                }

                group_teacher += content;
            });

            res.group_teacher = group_teacher;
        }

        setStudentDetail(res);
    };

    const fetchDataByTeacher = async () => {
        const res: any = await axios.get(`/api/teacher/show_student/${studentId}`);
        setStudentDetail(res);
    };

    const handleClickBack = () => {
        navigate(-1);
    };

    const handleClickEdit = () => {
        navigate(`/student-list/edit/${studentId}`);
    };

    return (
        <div>
            <div className={style.header}>
                <LabelHeader label={"学生信息"} />
                <Space>
                    <Button onClick={handleClickBack}>返回</Button>
                    <Button type="primary" onClick={handleClickEdit}>编辑</Button>
                </Space>
            </div>
            <div className={style.content}>
                <Descriptions className={style.file_message} column={1}
                    size="small"
                    labelStyle={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        width: "200px",
                    }}
                    contentStyle={{ fontSize: "16px" }} bordered>
                    <Descriptions.Item label="学号">
                        {studentDetail.User.user_id}
                    </Descriptions.Item>
                    <Descriptions.Item label="学生姓名">
                        {studentDetail.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="性别">
                        {studentDetail.sex ? "女" : "男"}
                    </Descriptions.Item>
                    <Descriptions.Item label="年级">
                        {studentDetail.grade}
                    </Descriptions.Item>
                    <Descriptions.Item label="专业">
                        {studentDetail.Profession?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="邮箱">
                        {studentDetail.User.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="指导老师">
                        {studentDetail.Teacher?.name}
                    </Descriptions.Item>
                    {
                        role === roles.ADMIN &&
                        <>
                            <Descriptions.Item label="送审老师">
                                {studentDetail?.review_teacher}
                            </Descriptions.Item>
                            <Descriptions.Item label="答辩老师">
                                {studentDetail?.group_teacher}
                            </Descriptions.Item>
                        </>
                    }
                </Descriptions>
            </div>
        </div>
    )
};

export default StudentDetail;