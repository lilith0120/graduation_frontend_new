import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Space, Descriptions } from 'antd';
import style from '../../../assets/styles/student-list/detail.module.css';

import LabelHeader from "../../../components/label-header";

const TeacherDetail = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [teacherId, setTeacherId] = useState("-1");
    const [teacherDetail, setTeacherDetail] = useState<TeacherData>({
        name: "", sex: "", email: "",
    });

    useEffect(() => {
        const { id }: any = params;
        if (id) {
            setTeacherId(id);
        } else {
            const path = window.location.pathname.split('/');
            const ti: any = path[path.length - 1];
            setTeacherId(ti);
        }

        const t = {
            name: '行露',
            sex: "女",
            email: "3428098215@qq.com",
        };
        setTeacherDetail(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickBack = () => {
        navigate(-1);
    };

    const handleClickEdit = () => {
        navigate(`/teacher-list/edit/${teacherId}`);
    };

    return (
        <div>
            <div className={style.header}>
                <LabelHeader label={"教师信息"} />
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
                    <Descriptions.Item label="教职工号">
                        {teacherId}
                    </Descriptions.Item>
                    <Descriptions.Item label="教师姓名">
                        {teacherDetail.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="性别">
                        {teacherDetail.sex}
                    </Descriptions.Item>
                    <Descriptions.Item label="邮箱">
                        {teacherDetail.email}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </div>
    )
};

export default TeacherDetail;