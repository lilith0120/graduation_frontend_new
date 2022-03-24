import { Button, Form, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import style from '../../assets/styles/reply-group.module.css';

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
        getStudentList();
    }, []);

    useEffect(() => {
        if (selectTeachers.length === 1) {
            setIsReview(true);
        } else {
            setIsReview(false);
        }
    }, [selectTeachers]);

    const getTeacherList = async () => {
        const data = [];
        for (let i = 0; i < 100; i++) {
            const v = {
                id: i,
                name: `测试老师${i}`,
            };
            data.push(v);
        }
        setTeacherList(data);
    };

    const getStudentList = async () => {
        const data = [];
        for (let i = 0; i < 100; i++) {
            const v = {
                id: i,
                name: `测试学生${i}`,
            };
            data.push(v);
        }
        setStudentList(data);
    };

    const fetchDataByTeacher = async () => {
        console.log("selectTeacher: ", selectTeachers);
        const students: any = ["0", "1", "2"];
        form.setFieldsValue({
            studentIds: students,
        });
    };

    const fetchDataByStudent = async () => {
        console.log("selectStudent: ", selectStudents);
        const teachers: any = ["0", "1", "2"];
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
        console.log(value);
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