import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Form, Input, message, Space, Upload, Select, notification, Modal } from 'antd';
import {
    InboxOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import style from '../../../assets/styles/submit-list/edit.module.css';

import LabelHeader from "../../../components/label-header";

const Edit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [fileId, setFileId] = useState("-1");
    const [stageList, setStageList] = useState<stageList[]>([]);
    const [fileList, setFileList] = useState<any>([]);

    useEffect(() => {
        const { id }: any = params;
        if (id) {
            setFileId(id);
        } else {
            const path = window.location.pathname.split('/');
            const fi: any = path[path.length - 1];
            setFileId(fi);
        }

        const sl = [
            {
                id: 0,
                name: "开题报告",
                disabled: true,
            },
            {
                id: 1,
                name: "任务书",
                disabled: false,
            },
            {
                id: 2,
                name: "中期报告",
                disabled: false,
            },
            {
                id: 3,
                name: "毕业设计论文",
                disabled: true,
            },
        ];
        setStageList(sl);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (fileId !== "-1") {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileId]);

    const fetchData = async () => {
        console.log(fileId);
        const f = {
            file_name: '111801429_吴寒_福州大学本科生毕业设计（论文）任务书（第二版）',
            file_detail: '说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢',
            file_stage: 2,
            file_url: "http://baidu.com",
        };

        const fl = {
            uid: fileId,
            name: f.file_name,
            url: f.file_url,
        };

        setFileList([{ ...fl }]);
        form.setFieldsValue(f);
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

    const handleChangeUpload = (info: any) => {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name}上传成功.`);
        } else if (status === 'error') {
            message.error(`${info.file.name}上传失败`);
        };

        setFileList([...info.fileList]);
    };

    const handleClickSave = async () => {
        await form.validateFields();

        if (fileList.length === 0) {
            notification["error"]({
                message: '上传文件不能为空',
                duration: 2,
            });
            return;
        };

        const fileData = {
            ...form.getFieldsValue(),
            file_list: fileList
        };
        console.log(fileData);
        message.success('保存成功!');
        navigate(`/submit-list/detail/${fileId}`, { replace: true });
    };

    return (
        <div>
            <div className={style.header}>
                <LabelHeader label={"文件信息"} />
                <Space>
                    <Button onClick={handleClickBack}>返回</Button>
                    <Button type="primary" onClick={handleClickSave}>保存</Button>
                </Space>
            </div>
            <div className={style.content}>
                <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                    <Form.Item label="文件名" name="file_name"
                        rules={[{ required: true, message: '文件名不能为空' }]}>
                        <Input placeholder="请输入文件名" showCount maxLength={50} allowClear />
                    </Form.Item>
                    <Form.Item
                        label="毕业设计阶段" name="file_stage"
                        rules={[{ required: true, message: '毕业设计阶段不能为空' }]}>
                        <Select placeholder="请选择毕业设计阶段">
                            {
                                stageList.map((item, index) => (
                                    <Select.Option key={index} value={item.id} disabled={item.disabled}>
                                        {item.name}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="文件描述" name="file_detail">
                        <Input.TextArea
                            placeholder="请输入文件描述"
                            autoSize={{ minRows: 4, maxRows: 6 }}
                            showCount maxLength={200} />
                    </Form.Item>
                    <Form.Item label="上传文件" name="file_list"
                        rules={[{ required: true, message: '上传文件不能为空' }]}>
                        <Upload.Dragger name="file" maxCount={1}
                            onChange={handleChangeUpload}
                            fileList={fileList}
                            action="/upload-file">
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">单击或拖动文件到该区域进行上传</p>
                            <p className="ant-upload-hint">仅支持单文件上传.</p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
};

export default Edit;