import { Form, Input, Button, Select, Row, Col, Space } from 'antd';
import style from './teacher-filter.module.css';

import LabelHeader from '../label-header';

const TeacherFilter = (props: any) => {
    const { searchItem } = props;
    const [form] = Form.useForm();

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
                    <Row gutter={24}>
                        <Col span={7}>
                            <Form.Item label="教职工号" name="teacher_id">
                                <Input
                                    placeholder="请输入教职工号" allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={7}>
                            <Form.Item label="教师名字" name="name">
                                <Input
                                    placeholder="请输入教师名字" allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={7}>
                            <Form.Item label="性别" name="sex">
                                <Select
                                    placeholder="请选择性别"
                                    allowClear>
                                    <Select.Option value="0">男</Select.Option>
                                    <Select.Option value="1">女</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={3} className={style.btn}>
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
        </div>
    )
};

export default TeacherFilter;