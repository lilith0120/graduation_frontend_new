import { Descriptions, Input } from 'antd';
import { useEffect, useState } from 'react';
import style from './student-message.module.css';
import axios from '../../http';

const StudentMessage = (props: any) => {
    const { stuMsgSave } = props;
    const [stuMessage, setStuMessage] = useState<studentMessage>(
        { name: "", student_id: "", sex: "", grade: "", profession: "" }
    );

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        const res: any = await axios.get('/api/student');
        if (!res) {
            return;
        }

        const { User, Profession, Teacher } = res;
        const msg = {
            name: res.name,
            student_id: User.user_id,
            sex: res.sex ? "女" : "男",
            grade: res.grade,
            profession: Profession.name,
            email: User.email,
            teacher_name: Teacher.name,
            teacher_email: Teacher.User.email,
        };
        setStuMessage(msg);
        stuMsgSave(msg);
    };

    const handleChangeEmail = (e: any) => {
        stuMessage.email = e.target.value;
        setStuMessage({ ...stuMessage });
    };

    const handleBlurEmail = (e: any) => {
        const email = e.target.value;
        const regex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!regex.test(email)) {
            stuMsgSave("errorEmail");

            return;
        }
        stuMsgSave(stuMessage);
    };

    return (
        <div className={style.message}>
            <Descriptions
                labelStyle={{ width: "250px" }}
                column={1}
                bordered>
                <Descriptions.Item label="姓名">{stuMessage.name}</Descriptions.Item>
                <Descriptions.Item label="学号">{stuMessage.student_id}</Descriptions.Item>
                <Descriptions.Item label="性别">{stuMessage.sex}</Descriptions.Item>
                <Descriptions.Item label="年级">{stuMessage.grade}</Descriptions.Item>
                <Descriptions.Item label="专业">{stuMessage.profession}</Descriptions.Item>
                <Descriptions.Item label="邮箱">
                    <Input
                        placeholder="请输入邮箱"
                        value={stuMessage?.email}
                        onChange={handleChangeEmail}
                        onBlur={handleBlurEmail} />
                </Descriptions.Item>
                <Descriptions.Item label="指导老师">
                    {stuMessage?.teacher_name}
                </Descriptions.Item>
                <Descriptions.Item label="指导老师邮箱">
                    {stuMessage?.teacher_email}
                </Descriptions.Item>
            </Descriptions>
        </div>
    )
};

export default StudentMessage;