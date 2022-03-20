import { Tree, Button, Input, DatePicker, message, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import {
    NumberOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import TreeDrop from '../../config/tree-drag';
import style from './teacher-process.module.css';
import axios from '../../http';

const TeacherProcess = () => {
    const [processData, setProcessData] = useState<any[]>([]);
    const [currentTitle, setCurrentTitle] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res: any = await axios.get('/api/teacher/process');
        const { stages } = res;
        const process = stages.map((item: any) => {
            if (item.children) {
                const children = item.children.map((i: any) => {
                    i.dateDefault = [];
                    if (i.begin_at) {
                        i.dateDefault = [
                            moment(i.begin_at, 'YYYY-MM-DD HH:mm:ss'),
                            moment(i.end_at, 'YYYY-MM-DD HH:mm:ss'),
                        ];
                    }

                    return i;
                });
                item.children = children;
            }

            return item;
        });
        setProcessData(process);
    };

    const handleClickCreate = (node: any) => {
        const { key, children } = node;
        const newItem = {
            key: -1,
            title: "",
            parent_id: key,
            pre_id: children && children.length > 0 ? children[children.length - 1]?.id : -1,
            isEdit: true,
        };

        if (!node.children) {
            node.children = [];
        }
        node.children.push(newItem);

        setProcessData([...processData]);
    };

    const handleDropProcessData = async (info: any) => {
        const dragPreId = info.dragNode.pre_id;
        const dropKey = info.node.id;
        const dragKey = info.dragNode.id;
        const dragParentId = info.dragNode.parent_id;
        const dropParentId = info.node.parent_id;
        if (dragParentId !== undefined &&
            dropParentId !== undefined &&
            dragParentId === dropParentId) {
            const data = TreeDrop(info, processData);
            const result = data.map((item) => {
                if (item.id === dragParentId) {
                    item.children.map((i: any) => {
                        if (i.pre_id === dragKey) {
                            i.pre_id = dragPreId;
                        } else if (i.id === dragKey) {
                            i.pre_id = dropKey;
                        } else if (i.pre_id === dropKey) {
                            i.pre_id = dragKey;
                        };

                        return i;
                    });
                }

                return item;
            });
            await changeProcessPlace(result);
            setProcessData([...data]);
        }
    };

    const handleClickEdit = (node: any) => {
        node.isEdit = true;
        setCurrentTitle(node.title);
        setProcessData([...processData]);
    };

    const handleClickDelete = async (node: any) => {
        const { id, pre_id, parent_id } = node;
        const newData = processData.map((item) => {
            if (item.id === parent_id) {
                const newData = item.children.filter((i: any) => {
                    if (i.id === id) {
                        // eslint-disable-next-line array-callback-return
                        return;
                    } else if (i.pre_id === id) {
                        i.pre_id = pre_id;
                    };

                    return i;
                });

                item.children = newData;
            }

            return item;
        });
        await deleteProcess(node, newData);
        setProcessData([...processData]);
    };

    const handleChangeEdit = (e: any, node: any) => {
        node.title = e.target.value;
        setProcessData([...processData]);
    };

    const handleBlurEdit = async (node: any) => {
        node.isEdit = false;
        if (node.key === -1 && node.title === "") {
            processData.map((item) => {
                if (item.key === node.parent_id) {
                    item.children.pop();
                }

                return item;
            });
        } else if (node.title === "") {
            node.title = currentTitle;
        } else {
            if (node.key === -1) {
                await addProcess(node);
            } else {
                await updateProcess(node);
            }
        }

        setCurrentTitle("");
        setProcessData([...processData]);
    };

    const handleChangeDate = async (node: any, date: any) => {
        node.begin_at = date[0];
        node.end_at = date[1];

        await updateProcessDate(node);
        setProcessData([...processData]);
    };

    const addProcess = async (node: any) => {
        const res: any = await axios.post('/api/teacher/process/add', {
            newStage: {
                title: node.title,
                pre_id: node.pre_id,
                parent_id: node.parent_id,
            },
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

    const updateProcess = async (node: any) => {
        const res = await axios.patch(`/api/teacher/process/edit/${node.id}`, {
            title: node.title,
        });

        if (!res) {
            message.error("修改失败");
        }
    };

    const changeProcessPlace = async (data: any) => {
        const res = await axios.patch('/api/teacher/process/update', {
            stage: data,
        });

        if (!res) {
            message.error("修改位置失败");
        }
    };

    const deleteProcess = async (node: any, data: any) => {
        const res = await axios.delete(`/api/teacher/process/delete/${node.id}`, {
            data: {
                stage: data,
            },
        });

        if (!res) {
            message.error("删除失败");
        }
    };

    const updateProcessDate = async (node: any) => {
        const res = await axios.patch(`/api/teacher/process/edit_time/${node.id}`, {
            time: {
                begin_at: node.begin_at,
                end_at: node.end_at,
            },
        });

        if (!res) {
            message.error("修改失败");
        }
    };

    return (
        <div className={style.main}>
            {
                processData.length > 0 &&
                <Tree className={style.tree}
                    treeData={processData} defaultExpandAll
                    draggable={
                        (node: any) => {
                            if (node.parent_id !== undefined) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                    showLine={{
                        showLeafIcon: false,
                    }}
                    titleRender={(node) => (
                        <div className={style.tree_item}>
                            <div className={style.tree_content}>
                                {
                                    node.isEdit ?
                                        <Input value={node.title}
                                            placeholder="请输入阶段名"
                                            maxLength={10}
                                            showCount
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
                            <div>
                                {
                                    (node.parent_id !== undefined && node.parent_id !== null) ?
                                        <div className={style.tree_btn}>
                                            <DatePicker.RangePicker showTime
                                                defaultValue={node.dateDefault}
                                                onChange={(dates, dateStrings) => handleChangeDate(node, dateStrings)} />
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
                                        </div> :
                                        <Button shape="circle" icon={<PlusCircleOutlined />} title="增加子阶段"
                                            onClick={() => handleClickCreate(node)} />
                                }
                            </div>
                        </div>
                    )}
                    onDrop={handleDropProcessData} />
            }
        </div>
    )
};

export default TeacherProcess;