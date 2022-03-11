import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Form, Input, message, Space, Select, Modal } from 'antd';
import {
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import style from '../../../assets/styles/submit-list/edit.module.css';

import LabelHeader from "../../../components/label-header";

const StudentEdit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [studentId, setStudentId] = useState("-1");
    const [gradeList, setGradeList] = useState<string[]>([]);
    const [professionList, setProfessionList] = useState<TeacherList[]>([]);
    const [teacherList, setTeacherList] = useState<TeacherList[]>([]);

    useEffect(() => {
        const { id }: any = params;
        if (id) {
            setStudentId(id);
        } else {
            const path = window.location.pathname.split('/');
            const si: any = path[path.length - 1];
            setStudentId(si);
        }

        getGradeList();
        getProfessionList();
        getTeacherList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (studentId !== "-1") {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentId]);

    const fetchData = async () => {
        console.log(studentId);
        const s = {
            student_id: studentId,
            name: "九歌",
            sex: "1",
            profession: 0,
            grade: "2018",
            email: "1131155106@qq.com",
            teacher_id: 1,
        };

        form.setFieldsValue(s);
    };

    const getGradeList = async () => {
        const g = ["2016", "2017", "2018"];
        setGradeList(g);
    };

    const getProfessionList = async () => {
        const pl = [
            {
                id: 0,
                name: "软件工程",
            },
            {
                id: 1,
                name: "计算机类",
            },
            {
                id: 2,
                name: "信息安全",
            },
        ];
        setProfessionList(pl);
    };

    const getTeacherList = async () => {
        const tl = [
            {
                id: 0,
                name: "行露",
            },
            {
                id: 1,
                name: "天问",
            },
            {
                id: 2,
                name: "小皮",
            },
        ];
        setTeacherList(tl);
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
        console.log(fileData);
        message.success('保存成功!');
        navigate(`/student-list/detail/${studentId}`, { replace: true });
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
                </Form>
            </div>
        </div>
    )
};

export default StudentEdit;