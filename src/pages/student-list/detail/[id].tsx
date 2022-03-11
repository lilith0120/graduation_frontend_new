import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Space, Descriptions } from 'antd';
import style from '../../../assets/styles/student-list/detail.module.css';

import LabelHeader from "../../../components/label-header";

const StudentDetail = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [studentId, setStudentId] = useState("-1");
    const [studentDetail, setStudentDetail] = useState<StudentData>({
        name: "", grade: "", profession: "", sex: "", email: "", teacher_name: "",
    });

    useEffect(() => {
        const { id }: any = params;
        if (id) {
            setStudentId(id);
        } else {
            const path = window.location.pathname.split('/');
            const si: any = path[path.length - 1];
            setStudentId(si);
        }

        const s = {
            name: 'John',
            grade: "2018",
            sex: "女",
            profession: "软件工程",
            teacher_name: "行露",
            email: "3428098215@qq.com",
        };
        setStudentDetail(s);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                        {studentId}
                    </Descriptions.Item>
                    <Descriptions.Item label="学生姓名">
                        {studentDetail.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="性别">
                        {studentDetail.sex}
                    </Descriptions.Item>
                    <Descriptions.Item label="年级">
                        {studentDetail.grade}
                    </Descriptions.Item>
                    <Descriptions.Item label="专业">
                        {studentDetail.profession}
                    </Descriptions.Item>
                    <Descriptions.Item label="邮箱">
                        {studentDetail.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="指导老师">
                        {studentDetail.teacher_name}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </div>
    )
};

export default StudentDetail;