import { Descriptions, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import style from './student-message.module.css';

const StudentMessage = (props: any) => {
    const { stuMsgSave } = props;
    const [stuMessage, setStuMessage] = useState<studentMessage>(
        { name: "", student_id: "", sex: "", grade: "", profession: "" }
    );

    useEffect(() => {
        const m = {
            name: "九歌",
            student_id: "111801429",
            sex: "女",
            grade: "2018",
            profession: "软件工程",
            email: "3428098215@qq.com",
            teacher_name: "行露",
            teacher_email: "1131155106@qq.com",
        };
        setStuMessage(m);
    }, []);

    const handleChangeEmail = (e: any) => {
        stuMessage.email = e.target.value;
        setStuMessage({ ...stuMessage });
    };

    const handleBlurEmail = (e: any) => {
        const email = e.target.value;
        const regex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!regex.test(email)) {
            message.error('邮箱格式不正确！', 1);
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