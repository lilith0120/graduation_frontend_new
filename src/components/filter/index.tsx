import { Form, Input, Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import style from './filter.module.css';
import reviewStatus from '../../config/review-status';

import LabelHeader from '../label-header';

const Filter = (props: any) => {
    const { searchItem } = props;
    const [form] = Form.useForm();
    const [processList, setProcessList] = useState<ProcessList[]>([]);

    useEffect(() => {
        const p = [
            {
                id: 0,
                name: "开题报告",
            },
            {
                id: 1,
                name: "任务书",
            },
            {
                id: 2,
                name: "中期报告",
            },
            {
                id: 3,
                name: "毕业设计论文",
            },
        ];
        setProcessList(p);
    }, []);

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
                <Form className={style.filter_form} form={form} layout="inline" labelCol={{ span: 8 }}>
                    <Form.Item label="文件名" name="file_name">
                        <Input
                            placeholder="请输入文件名" allowClear />
                    </Form.Item>
                    <Form.Item label="毕业设计阶段" name="process">
                        <Select
                            placeholder="请选择毕业设计阶段"
                            style={{ width: 180 }}
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
                    <Form.Item label="审核状态" name="file_status">
                        <Select
                            placeholder="请输入审核状态"
                            style={{ width: 180 }}
                            allowClear>
                            <Select.Option value={reviewStatus.未审核}>未审核</Select.Option>
                            <Select.Option value={reviewStatus.审核中}>审核中</Select.Option>
                            <Select.Option value={reviewStatus.审核通过}>审核通过</Select.Option>
                            <Select.Option value={reviewStatus.审核驳回}>审核驳回</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <div className={style.btn}>
                            <Button onClick={handleClickReset}>重置</Button>
                            <Button type="primary" onClick={handleClickSubmit}>确定</Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
};

export default Filter;