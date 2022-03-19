import { Form, Input, Button, Select, Row, Col, Space } from 'antd';
import { useEffect, useState } from 'react';
import style from './student-filter.module.css';
import roles from '../../config/role';
import axios from '../../http';

import LabelHeader from '../label-header';

const StudentFilter = (props: any) => {
    const { searchItem } = props;
    const [form] = Form.useForm();
    const [role, setRole] = useState<number>();
    const [processList, setProcessList] = useState<ProcessList[]>([]);
    const [gradeList, setGradeList] = useState<string[]>([]);
    const [professionList, setProfessionList] = useState<ProcessList[]>([]);
    const [teacherList, setTeacherList] = useState<TeacherList[]>([]);

    useEffect(() => {
        let userRole: any = localStorage.getItem("role") ?? roles.TEACHER;
        setRole(parseInt(userRole));
    }, []);

    useEffect(() => {
        getGradeList();
        if (role === roles.TEACHER) {
            getProcessList();
        } else if (role === roles.ADMIN) {
            getProfessionList();
            getTeacherList();
        }
    }, [role]);

    const getProcessList = async () => {
        const res: any = await axios.get('/api/util/get_process');
        const { process } = res;
        setProcessList(process);
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

    const handleClickReset = () => {
        form.resetFields();
        handleClickSubmit();
    };

    const handleClickSubmit = () => {
        const filterList = form.getFieldsValue();
        searchItem(filterList);
    };

    return (
        <div className={style.main}>
            <LabelHeader label={"筛选项"} />
            <div className={style.filter}>
                <Form className={style.filter_form} form={form} layout="inline">
                    <Row gutter={[24, 14]}>
                        <Col span={6}>
                            <Form.Item label="学号" name="student_id">
                                <Input
                                    placeholder="请输入学号" allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="学生名字" name="name">
                                <Input
                                    placeholder="请输入学生名字" allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="年级" name="grade">
                                <Select
                                    placeholder="请选择年级"
                                    allowClear>
                                    {
                                        gradeList.map((item, index) => (
                                            <Select.Option key={index} value={item}>
                                                {item}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="性别" name="sex">
                                <Select
                                    placeholder="请选择性别"
                                    allowClear>
                                    <Select.Option value="0">男</Select.Option>
                                    <Select.Option value="1">女</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        {
                            role === roles.TEACHER ?
                                <Col span={6}>
                                    <Form.Item label="毕业设计阶段" name="stage_id">
                                        <Select
                                            placeholder="请选择毕业设计阶段"
                                            allowClear>
                                            {
                                                processList.map((item, index) => (
                                                    <Select.Option key={index} value={item.id}>
                                                        {item.name}
                                                    </Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col> :
                                <>
                                    <Col span={6}>
                                        <Form.Item label="专业" name="profession_id">
                                            <Select
                                                showSearch
                                                placeholder="请选择专业"
                                                optionFilterProp="children"
                                                filterOption={(input: any, option: any) =>
                                                    option.children.indexOf(input) >= 0
                                                }
                                                allowClear>
                                                {
                                                    professionList.map((item, index) => (
                                                        <Select.Option key={index} value={item.id}>
                                                            {item.name}
                                                        </Select.Option>
                                                    ))
                                                }
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item label="指导老师" name="teacher_id">
                                            <Select
                                                showSearch
                                                placeholder="请选择指导老师"
                                                optionFilterProp="children"
                                                filterOption={(input: any, option: any) =>
                                                    option.children.indexOf(input) >= 0
                                                }
                                                allowClear>
                                                {
                                                    teacherList.map((item, index) => (
                                                        <Select.Option key={index} value={item.id}>
                                                            {item.name}
                                                        </Select.Option>
                                                    ))
                                                }
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </>
                        }
                        <Col offset={role === roles.TEACHER ? 12 : 6} span={6} className={style.btn}>
                            <Form.Item>
                                <Space>
                                    <Button onClick={handleClickReset}>重置</Button>
                                    <Button type="primary" onClick={handleClickSubmit}>确定</Button>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div >
    )
};

export default StudentFilter;