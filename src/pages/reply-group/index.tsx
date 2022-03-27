import { Button, Form, message, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import style from '../../assets/styles/reply-group.module.css';
import axios from '../../http';

import LabelHeader from "../../components/label-header";

const ReplyGroup = () => {
    const [form] = Form.useForm();
    const [teacherList, setTeacherList] = useState<any[]>([]);
    const [studentList, setStudentList] = useState<any[]>([]);
    const [selectTeachers, setSelectTeachers] = useState<any[]>([]);
    const [isReview, setIsReview] = useState(false);
    const [selectReview, setSelectReview] = useState(false);

    useEffect(() => {
        getTeacherList();
    }, []);

    useEffect(() => {
        if (selectTeachers.length > 0) {
            getStudentList();
        }
        fetchDataByTeacher();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectReview, selectTeachers]);

    useEffect(() => {
        if (selectTeachers.length === 1) {
            setIsReview(true);
        } else {
            setIsReview(false);
            form.setFieldsValue({
                is_review: false,
            });
            setSelectReview(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectTeachers]);

    const getTeacherList = async () => {
        const res: any = await axios.get('/api/util/get_teacher');
        const { teachers } = res;
        setTeacherList(teachers);
    };

    const getStudentList = async () => {
        const res: any = await axios.post(`/api/util/get_studentlist`, {
            teacher_id: selectTeachers[0],
            is_review: selectReview,
        });
        const { students } = res;
        setStudentList(students);
    };

    const fetchDataByTeacher = async () => {
        const res: any = await axios.post('/api/util/get_student', {
            selectTeachers,
            is_review: selectReview,
        });
        const { students } = res;
        form.setFieldsValue({
            studentIds: students,
        });
    };

    const handleChangeTeacher = (value: any) => {
        setSelectTeachers(value);
    };

    const handleChangeReview = async (value: any) => {
        setSelectReview(value);
    };

    const handleClickSave = async (value: any) => {
        const { teacherIds, studentIds, is_review = false } = value;
        const res = await axios.post('/api/util/update_ass', {
            selectTeachers: teacherIds,
            selectStudents: studentIds,
            isGroup: !is_review,
        });

        if (!res) {
            message.error("保存失败");

            return;
        }
        message.success("保存成功");
        form.resetFields();
    };

    return (
        <div>
            <LabelHeader label={"答辩分组"} />
            <div className={style.form}>
                <Form
                    labelWrap
                    form={form}
                    onFinish={handleClickSave}
                >
                    <Form.Item
                        label="答辩教师"
                        name="teacherIds"
                        rules={[{ required: true, message: '请选择答辩教师' }]}
                    >
                        <Select
                            mode="multiple"
                            onChange={handleChangeTeacher}
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
                    <Form.Item name="is_review" label="是否作为送审教师" valuePropName="checked"
                        tooltip="只有一位答辩老师才能选择" labelCol={{ flex: '100px' }}>
                        <Switch disabled={!isReview} onChange={handleChangeReview} />
                    </Form.Item>
                    <Form.Item
                        label="答辩学生"
                        name="studentIds"
                        rules={[{ required: true, message: '请选择答辩学生' }]}
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="请选择答辩学生"
                            optionFilterProp="children"
                            filterOption={(input: any, option: any) =>
                                option.children.indexOf(input) >= 0
                            }
                        >
                            {
                                studentList.map((item: any, index: any) => (
                                    <Select.Option key={index} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" className={style.btn} htmlType="submit">
                            保存
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
};

export default ReplyGroup;