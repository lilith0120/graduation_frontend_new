import { Descriptions, Input } from 'antd';
import { useEffect, useState } from 'react';
import style from './teacher-message.module.css';
import axios from '../../http';

const TeacherMessage = (props: any) => {
    const { teaMsgSave } = props;
    const [teaMessage, setTeaMessage] = useState<teacherMessage>(
        { name: "", user_id: "", sex: "" }
    );

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res: any = await axios.get('/api/teacher');
        const { name, User: { user_id, email }, sex } = res
        const msg = {
            name,
            user_id,
            sex: sex ? "女" : "男",
            email,
        }
        setTeaMessage(msg);
    };

    const handleChangeEmail = (e: any) => {
        teaMessage.email = e.target.value;
        setTeaMessage({ ...teaMessage });
    };

    const handleBlurEmail = (e: any) => {
        const email = e.target.value;
        const regex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!regex.test(email)) {
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
                <Descriptions.Item label="教职工号">{teaMessage.user_id}</Descriptions.Item>
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