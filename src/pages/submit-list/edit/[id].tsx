import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Form, Input, message, Space, Upload, Select, notification, Modal } from 'antd';
import {
    InboxOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import style from '../../../assets/styles/submit-list/edit.module.css';
import axios from '../../../http';

import LabelHeader from "../../../components/label-header";

const Edit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [fileId, setFileId] = useState(-1);
    const [stageList, setStageList] = useState<stageList[]>([]);
    const [file, setFile] = useState<any>({});
    const [fileList, setFileList] = useState<any>([]);

    useEffect(() => {
        const { id }: any = params;
        if (id) {
            setFileId(parseInt(id));
        } else {
            const path = window.location.pathname.split('/');
            const fi: any = path[path.length - 1];
            setFileId(parseInt(fi));
        }

        getStageList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (fileId !== -1) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileId]);

    const fetchData = async () => {
        const res: any = await axios.get(`/api/student/file/${fileId}`);
        const { id, file_name, file_url } = res;
        const fl = {
            uid: id,
            name: file_name,
            url: file_url,
        };

        setFile(fl);
        setFileList([{ ...fl }]);
        form.setFieldsValue(res);
    };

    const getStageList = async () => {
        const res: any = await axios.get(`/api/util/get_process`);
        const { process } = res;

        if (process) {
            process[process.length - 1].is_review = true;
        }

        setStageList(process);
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

    const handleCheckFileSize = (file: any) => {
        const size = 2 * 1024 * 1024;
        if (file.size > size) {
            message.error("文件大小不能超过2MB", 1);

            return false;
        }

        return true;
    };

    const handleChangeUpload = (info: any) => {
        const { status, response } = info.file;
        if (status === 'done') {
            message.success(`${info.file.name}上传成功.`);
            const { url } = response.msg;
            info.file.url = url;

            setFile(info.file);
            if (!form.getFieldValue("file_name")) {
                form.setFieldsValue({
                    file_name: info.file.name.substring(0, info.file.name.lastIndexOf(".")),
                });
            }
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

        const stageId = form.getFieldValue("StageId");
        const select = stageList.find((item) => item.id === stageId);

        const fileData = {
            file_id: fileId,
            file_name: form.getFieldValue("file_name"),
            file_url: file.url,
            file_detail: form.getFieldValue("file_detail"),
            file_stage: stageId,
            is_review: select ? true : false,
        };

        const res: any = await uploadFileData(fileData);
        if (!res) {
            message.error('保存失败!');
            return;
        }

        const { id } = res.newFile;
        let file_id = fileId;
        message.success('保存成功!');
        if (fileId === -1) {
            file_id = id;
        }
        navigate(`/submit-list/detail/${file_id}`, { replace: true });
    };

    const uploadFileData = async (fileData: any) => {
        return await axios.post('/api/student/file', {
            file: fileData,
        });
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
                        label="毕业设计阶段" name="StageId"
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
                    <Form.Item label="上传文件" name="file_list">
                        <Upload.Dragger maxCount={1}
                            onChange={handleChangeUpload}
                            fileList={fileList}
                            beforeUpload={handleCheckFileSize}
                            action={"http://81.71.128.138:8000/api/util/upload_file"}
                            headers={{
                                "token": localStorage.getItem('token') || ''
                            }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">单击或拖动文件到该区域进行上传</p>
                            <p className="ant-upload-hint">仅支持小于2MB的单文件上传.</p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
};

export default Edit;