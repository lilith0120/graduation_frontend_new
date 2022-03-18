import { Tree, Button, Input, message, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import {
    NumberOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import TreeDrop from '../../config/tree-drag';
import style from './admin-process.module.css';
import axios from '../../http';

const AdminProcess = () => {
    const [processData, setProcessData] = useState<AdminProcessList[]>([]);
    const [currentTitle, setCurrentTitle] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res: any = await axios.get('/api/admin/process');
        const { baseStage } = res;
        const result = baseStage.map((item: any) => {
            item.isEdit = false;

            return item;
        });
        setProcessData(result);
    };

    const handleClickCreate = () => {
        const newItem = {
            key: -1,
            title: "",
            pre_id: processData && processData.length > 0 ? processData[processData.length - 1].key : -1,
            isEdit: true,
        };

        setProcessData([...processData, newItem]);
    };

    const handleDropProcessData = async (info: any) => {
        const dragPreId = info.dragNode.pre_id;
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const data = TreeDrop(info, processData);
        const result = data.map((item: any) => {
            if (item.pre_id === dragKey) {
                item.pre_id = dragPreId;
            } else if (item.key === dragKey) {
                item.pre_id = dropKey;
            } else if (item.pre_id === dropKey) {
                item.pre_id = dragKey;
            };

            return item;
        });

        await changeProcessPlace(result);
        setProcessData([...result]);
    };

    const handleClickEdit = (node: any) => {
        node.isEdit = true;
        setCurrentTitle(node.title);
        setProcessData([...processData]);
    };

    const handleClickDelete = async (node: any) => {
        const { key, pre_id } = node;
        const newData = processData.filter((item) => {
            if (item.key === key) {
                return null;
            } else if (item.pre_id === key) {
                item.pre_id = pre_id;
            };

            return item;
        });

        await deleteProcess(node, newData);
        setProcessData([...newData]);
    };

    const handleChangeEdit = (e: any, node: any) => {
        node.title = e.target.value;
        setProcessData([...processData]);
    };

    const handleBlurEdit = async (node: any) => {
        node.isEdit = false;
        if (node.key === -1 && node.title === "") {
            processData.pop();
        } else if (node.title === "") {
            node.title = currentTitle;
        } else {
            if (node.key === -1) {
                await addProcess(node);
            } else {
                await updatePrcess(node);
            }
        }

        setCurrentTitle("");
        setProcessData([...processData]);
    };

    const addProcess = async (node: any) => {
        const res: any = await axios.post('/api/admin/process/add', {
            title: node.title,
            pre_id: node.pre_id,
        });

        if (!res) {
            message.error("新增失败");

            return;
        }

        node.key = res.id;
        node.id = res.id;
        node.name = res.name;
        setProcessData([...processData]);
    };

    const updatePrcess = async (node: any) => {
        const res = await axios.patch(`/api/admin/process/edit/${node.key}`, {
            title: node.title,
        });

        if (!res) {
            message.error("修改失败");
        }
    };

    const changeProcessPlace = async (data: any) => {
        const res = await axios.patch('/api/admin/process/update', {
            stage: data,
        });

        if (!res) {
            message.error("修改位置失败");
        }
    };

    const deleteProcess = async (node: any, data: any) => {
        const res = await axios.delete(`/api/admin/process/delete/${node.key}`, {
            data: {
                stage: data,
            },
        });

        if (!res) {
            message.error("删除失败");
        }
    };

    return (
        <div className={style.main}>
            <div className={style.header_btn}>
                <Button type="primary" onClick={handleClickCreate}>新增阶段</Button>
            </div>
            <Tree treeData={processData} draggable
                titleRender={(node) => (
                    <div className={style.tree_item}>
                        <div className={style.tree_content}>
                            {
                                node.isEdit ?
                                    <Input value={node.title}
                                        placeholder="请输入阶段名"
                                        ref={(input: any) => input?.focus()}
                                        onChange={(e) => handleChangeEdit(e, node)}
                                        onBlur={() => handleBlurEdit(node)} /> :
                                    <>
                                        <NumberOutlined />
                                        <div className={style.tree_title}>
                                            {node.title}
                                        </div>
                                    </>
                            }
                        </div>
                        <div className={style.tree_btn}>
                            <Button shape="circle" icon={<EditOutlined />} title="编辑"
                                onClick={() => handleClickEdit(node)} />
                            <Popconfirm
                                title="你是否确定要删除该阶段?"
                                onConfirm={() => handleClickDelete(node)}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button shape="circle" icon={<DeleteOutlined />} title="删除" />
                            </Popconfirm>

                        </div>
                    </div>
                )}
                onDrop={handleDropProcessData} />
        </div>
    )
};

export default AdminProcess;