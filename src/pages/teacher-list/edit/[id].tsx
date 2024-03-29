import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Form, Input, message, Space, Select, Modal } from 'antd';
import {
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import style from '../../../assets/styles/submit-list/edit.module.css';
import axios from '../../../http';

import LabelHeader from "../../../components/label-header";

const TeacherEdit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [teacherId, setTeacherId] = useState(-1);

    useEffect(() => {
        const { id }: any = params;
        if (id) {
            setTeacherId(parseInt(id));
        } else {
            const path = window.location.pathname.split('/');
            const ti: any = path[path.length - 1];
            setTeacherId(parseInt(ti));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (teacherId !== -1) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teacherId]);

    const fetchData = async () => {
        const res: any = await axios.get(`/api/admin/show_teacher/${teacherId}`);
        const { name, sex, User: { email, user_id } } = res;
        const t = {
            teacher_id: user_id,
            name,
            sex: sex.toString(),
            email,
        };

        form.setFieldsValue(t);
    };

    const handleClickBack = () => {
        Modal.confirm({
            title: '是否放弃本次编辑?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                navigate(`/teacher-list/detail/${teacherId}`, { replace: true });
            },
        });
    };

    const handleClickSave = async () => {
        await form.validateFields();

        const fileData = form.getFieldsValue();
        const res = await updateTeacherMessage(fileData);
        if (!res) {
            message.error('保存失败!');

            return;
        }
        message.success('保存成功!');
        navigate(`/teacher-list/detail/${teacherId}`, { replace: true });
    };

    const updateTeacherMessage = async (fileData: any) => {
        return await axios.patch(`/api/admin/edit_teacher/${teacherId}`, {
            form: fileData,
        });
    };

    return (
        <div>
            <div className={style.header}>
                <LabelHeader label={"教师信息"} />
                <Space>
                    <Button onClick={handleClickBack}>返回</Button>
                    <Button type="primary" onClick={handleClickSave}>保存</Button>
                </Space>
            </div>
            <div className={style.content}>
                <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                    <Form.Item label="教职工号" name="teacher_id"
                        rules={[
                            { required: true },
                            { pattern: /^[0-9]{9}$/, message: "教职工号必须为9位数字" }]}>
                        <Input placeholder="请输入教职工号" allowClear />
                    </Form.Item>
                    <Form.Item
                        label="教师姓名" name="name"
                        rules={[{ required: true, message: '教师姓名不能为空' }]}>
                        <Input placeholder="请输入教师姓名" showCount maxLength={10} allowClear />
                    </Form.Item>
                    <Form.Item label="性别" name="sex"
                        rules={[{ required: true, message: '性别不能为空' }]}>
                        <Select placeholder="请选择性别" allowClear>
                            <Select.Option value="0">男</Select.Option>
                            <Select.Option value="1">女</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="邮箱" name="email"
                        rules={[{
                            type: "email", message: "邮箱格式不正确",
                        }]}>
                        <Input placeholder="请输入邮箱" showCount maxLength={30} allowClear />
                    </Form.Item>
                </Form>
            </div>
        </div >
    )
};

export default TeacherEdit;