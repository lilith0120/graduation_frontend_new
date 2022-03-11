import { Descriptions, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import style from './teacher-message.module.css';

const TeacherMessage = (props: any) => {
    const { teaMsgSave } = props;
    const [teaMessage, setTeaMessage] = useState<teacherMessage>(
        { name: "", teacher_id: "", sex: "" }
    );

    useEffect(() => {
        const m = {
            name: "九歌",
            teacher_id: "111801429",
            sex: "女",
            email: "3428098215@qq.com",
        };
        setTeaMessage(m);
    }, []);

    const handleChangeEmail = (e: any) => {
        teaMessage.email = e.target.value;
        setTeaMessage({ ...teaMessage });
    };

    const handleBlurEmail = (e: any) => {
        const email = e.target.value;
        const regex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!regex.test(email)) {
            message.error('邮箱格式不正确！', 1);
            teaMsgSave("errorEmail");

            return;
        }
        teaMsgSave(teaMessage);
    };

    return (
        <div className={style.message}>
            <Descriptions
                labelStyle={{ width: "250px" }}
                column={1}
                bordered>
                <Descriptions.Item label="姓名">{teaMessage.name}</Descriptions.Item>
                <Descriptions.Item label="教职工号">{teaMessage.teacher_id}</Descriptions.Item>
                <Descriptions.Item label="性别">{teaMessage.sex}</Descriptions.Item>
                <Descriptions.Item label="邮箱">
                    <Input
                        placeholder="请输入邮箱"
                        value={teaMessage?.email}
                        onChange={handleChangeEmail}
                        onBlur={handleBlurEmail} />
                </Descriptions.Item>
            </Descriptions>
        </div>
    )
};

export default TeacherMessage;