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
    const [selectStudents, setSelectStudents] = useState<any[]>([]);
    const [isReview, setIsReview] = useState(false);

    useEffect(() => {
        getTeacherList();
    }, []);

    useEffect(() => {
        getStudentList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReview]);

    useEffect(() => {
        if (selectTeachers.length === 1) {
            setIsReview(true);
        } else {
            setIsReview(false);
        }
    }, [selectTeachers]);

    const getTeacherList = async () => {
        const res: any = await axios.get('/api/util/get_teacher');
        const { teachers } = res;
        setTeacherList(teachers);
    };

    const getStudentList = async () => {
        const res: any = await axios.get(`/api/util/get_student/${isReview}`);
        const { students } = res;
        setStudentList(students);
    };

    const fetchDataByTeacher = async () => {
        const res: any = await axios.post('/api/util/get_student', {
            selectTeachers,
        });
        const { students } = res;
        form.setFieldsValue({
            studentIds: students,
        });
    };

    const fetchDataByStudent = async () => {
        const res: any = await axios.post('/api/util/get_teacher', {
            selectStudents,
        });
        const { teachers } = res;
        form.setFieldsValue({
            teacherIds: teachers,
        });
    };

    const handleChangeTeacher = (value: any) => {
        setSelectTeachers(value);
    };

    const handleChangeStudent = (value: any) => {
        setSelectStudents(value);
    };

    const handleBlurSelect = async (type: any) => {
        if (type === "student") {
            await fetchDataByStudent();
        } else if (type === "teacher") {
            await fetchDataByTeacher();
        }
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
    };

    return (
        <div>
            <LabelHeader label={"答辩分组"} />
            <div className={style.form}>
                <Form
                    labelWrap
                    labelCol={{ flex: '81px' }}
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
                            onBlur={() => handleBlurSelect("teacher")}
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
                    {
                        isReview &&
                        <Form.Item name="is_review" label="是否作为送审教师" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    }
                    <Form.Item
                        label="答辩学生"
                        name="studentIds"
                        rules={[{ required: true, message: '请选择答辩学生' }]}
                    >
                        <Select
                            mode="multiple"
                            onChange={handleChangeStudent}
                            onBlur={() => handleBlurSelect("student")}
                            allowClear
                            placeholder="请选择答辩学生"
                            optionFilterProp="children"
                            filterOption={(input: any, option: any) =>
                                option.children.indexOf(input) >= 0
                            }
                        >
                            {
                                studentList.map((item: any) => (
                                    <Select.Option key={item.id}>
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