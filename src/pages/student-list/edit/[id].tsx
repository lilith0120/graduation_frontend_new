import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Form, Input, message, Space, Select, Modal } from 'antd';
import {
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import style from '../../../assets/styles/submit-list/edit.module.css';
import axios from '../../../http';

import LabelHeader from "../../../components/label-header";

const StudentEdit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [studentId, setStudentId] = useState(-1);
    const [gradeList, setGradeList] = useState<string[]>([]);
    const [professionList, setProfessionList] = useState<TeacherList[]>([]);
    const [teacherList, setTeacherList] = useState<TeacherList[]>([]);

    useEffect(() => {
        const { id }: any = params;
        if (id) {
            setStudentId(parseInt(id));
        } else {
            const path = window.location.pathname.split('/');
            const si: any = path[path.length - 1];
            setStudentId(parseInt(si));
        }

        getGradeList();
        getProfessionList();
        getTeacherList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (studentId !== -1) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentId]);

    const fetchData = async () => {
        const res: any = await axios.get(`/api/admin/show_student/${studentId}`);
        const { name, sex, ProfessionId, grade, User: { email, user_id }, TeacherId } = res;
        const s = {
            student_id: user_id,
            name,
            sex: sex.toString(),
            profession_id: ProfessionId,
            grade,
            email,
            teacher_id: TeacherId,
        };

        form.setFieldsValue(s);
    };

    const getGradeList = async () => {
        const res: any = await axios.get('/api/util/get_grade');
        const { grades } = res;
        setGradeList(grades);
    };

    const getProfessionList = async () => {
        const res: any = await axios.get('/api/util/get_profession');
        const { professions } = res;
        setProfessionList(professions);
    };

    const getTeacherList = async () => {
        const res: any = await axios.get('/api/util/get_teacher');
        const { teachers } = res;
        setTeacherList(teachers);
    };

    const handleClickBack = () => {
        Modal.confirm({
            title: '是否放弃本次编辑?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                navigate(-1);
            },
        });
    };

    const handleClickSave = async () => {
        await form.validateFields();

        const fileData = form.getFieldsValue();
        const res = await updateStudent(fileData);
        if (!res) {
            message.error("保存失败");

            return;
        }

        message.success('保存成功!');
        navigate(`/student-list/detail/${studentId}`, { replace: true });
    };

    const updateStudent = async (data: any) => {
        return await axios.patch(`/api/admin/edit_student/${studentId}`, {
            form: data,
        });
    };

    return (
        <div>
            <div className={style.header}>
                <LabelHeader label={"学生信息"} />
                <Space>
                    <Button onClick={handleClickBack}>返回</Button>
                    <Button type="primary" onClick={handleClickSave}>保存</Button>
                </Space>
            </div>
            <div className={style.content}>
                <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                    <Form.Item label="学号" name="student_id"
                        rules={[
                            { required: true },
                            { pattern: /^[0-9]{9}$/, message: "学号必须为9位数字" }]}>
                        <Input placeholder="请输入学号" allowClear />
                    </Form.Item>
                    <Form.Item
                        label="学生姓名" name="name"
                        rules={[{ required: true, message: '学生姓名不能为空' }]}>
                        <Input placeholder="请输入学生姓名" showCount maxLength={10} allowClear />
                    </Form.Item>
                    <Form.Item label="性别" name="sex"
                        rules={[{ required: true, message: '性别不能为空' }]}>
                        <Select placeholder="请选择性别" allowClear>
                            <Select.Option value="0">男</Select.Option>
                            <Select.Option value="1">女</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="年级" name="grade"
                        rules={[{ required: true, message: '年级不能为空' }]}>
                        <Select placeholder="请选择年级" allowClear>
                            {
                                gradeList.map((item, index) => (
                                    <Select.Option key={index} value={item}>{item}</Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="专业" name="profession_id"
                        rules={[{ required: true, message: '专业不能为空' }]}>
                        <Select placeholder="请选择专业" allowClear>
                            {
                                professionList.map((item, index) => (
                                    <Select.Option key={index} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="邮箱" name="email"
                        rules={[{
                            type: "email", message: "邮箱格式不正确",
                        }]}>
                        <Input placeholder="请输入邮箱" showCount maxLength={30} allowClear />
                    </Form.Item>
                    <Form.Item label="指导老师" name="teacher_id">
                        <Select placeholder="请选择指导老师" allowClear>
                            {
                                teacherList.map((item, index) => (
                                    <Select.Option key={index} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="送审老师" name="review_id"
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('teacher_id') !== value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('送审老师和指导老师不能相同'));
                                },
                            }),
                        ]}>
                        <Select placeholder="请选择送审老师" allowClear>
                            {
                                teacherList.map((item, index) => (
                                    <Select.Option key={index} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="答辩老师" name="review_group">
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="请选择答辩教师"
                            optionFilterProp="children"
                            filterOption={(input: any, option: any) =>
                                option.children.indexOf(input) >= 0
                            }
                        >
                            {
                                teacherList.map((item, index) => (
                                    <Select.Option key={index} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
};

export default StudentEdit;