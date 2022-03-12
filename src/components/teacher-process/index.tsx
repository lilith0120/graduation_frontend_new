import { Tree, Button, Input, DatePicker } from 'antd';
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

const TeacherProcess = () => {
    const [processData, setProcessData] = useState<any[]>([]);
    const [currentTitle, setCurrentTitle] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const pd = [
            {
                title: '开题报告',
                key: 0,
                children: [
                    {
                        id: 0,
                        key: "0-0",
                        title: '开题报告子项1',
                        pre_id: -1,
                        parent_id: 0,
                        begin_at: "2022-02-22 16:06:00",
                        end_at: "2022-02-24 16:06:00",
                    },
                    {
                        id: 1,
                        key: "0-1",
                        title: '开题报告子项2',
                        pre_id: 0,
                        parent_id: 0,
                        begin_at: "2022-02-22 16:06:00",
                        end_at: "2022-02-24 16:06:00",
                    },
                    {
                        id: 2,
                        key: "0-2",
                        title: '开题报告子项3',
                        pre_id: 1,
                        parent_id: 0,
                        begin_at: "2022-02-22 16:06:00",
                        end_at: "2022-02-24 16:06:00",
                    },
                ],
            },
            {
                title: '任务书',
                key: 1,
                children: [
                    {
                        id: 0,
                        key: "1-0",
                        title: '任务书子项1',
                        pre_id: -1,
                        parent_id: 1,
                        begin_at: "2022-02-22 16:06:00",
                        end_at: "2022-02-24 16:06:00",
                    },
                    {
                        id: 1,
                        key: "1-1",
                        title: '任务书子项2',
                        pre_id: 0,
                        parent_id: 1,
                        begin_at: "2022-02-22 16:06:00",
                        end_at: "2022-02-24 16:06:00",
                    },
                    {
                        id: 2,
                        key: "1-2",
                        title: '任务书子项3',
                        pre_id: 1,
                        parent_id: 1,
                        begin_at: "2022-02-22 16:06:00",
                        end_at: "2022-02-24 16:06:00",
                    },
                    {
                        id: 3,
                        key: "1-3",
                        title: '任务书子项4',
                        pre_id: 2,
                        parent_id: 1,
                    },
                ],
            },
            {
                title: '中期报告',
                key: 2,
                children: [
                    {
                        id: 0,
                        key: "2-0",
                        title: '中期报告子项1',
                        pre_id: -1,
                        parent_id: 2,
                    },
                ],
            },
            {
                title: '毕业设计论文',
                key: 3,
                children: [
                    {
                        id: 0,
                        key: "3-0",
                        title: '毕业设计论文子项1',
                        pre_id: -1,
                        parent_id: 3,
                    },
                ],
            },
        ];
        setProcessData(pd);
    };

    const handleClickCreate = (node: any) => {
        const { key, children } = node;
        const newItem = {
            key: -1,
            title: "",
            parent_id: key,
            pre_d: children && children.length > 0 ? children[children.length - 1]?.id : -1,
            isEdit: true,
        };

        if (!node.children) {
            node.children = [];
        }
        node.children.push(newItem);

        setProcessData([...processData]);
    };

    const handleDropProcessData = (info: any) => {
        const dragPreId = info.dragNode.pre_id;
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dragParentId = info.dragNode.parent_id;
        const dropParentId = info.node.parent_id;
        if (dragParentId !== undefined &&
            dropParentId !== undefined &&
            dragParentId === dropParentId) {
            const data = TreeDrop(info, processData);
            data.map((item) => {
                if (item.key === dragParentId) {
                    item.children.map((i: any) => {
                        if (i.pre_id === dragKey) {
                            i.pre_id = dragPreId;
                        } else if (i.key === dragKey) {
                            i.pre_id = dropKey;
                        } else if (i.pre_id === dropKey) {
                            i.pre_id = dragKey;
                        };

                        return i;
                    });
                }

                return item;
            });
            console.log(data);
            setProcessData([...data]);
        }
    };

    const handleClickEdit = (node: any) => {
        node.isEdit = true;
        setCurrentTitle(node.title);
        setProcessData([...processData]);
    };

    const handleClickDelete = (node: any) => {
        const { id, pre_id, parent_id } = node;
        processData.map((item) => {
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

        setProcessData([...processData]);
    };

    const handleChangeEdit = (e: any, node: any) => {
        node.title = e.target.value;
        setProcessData([...processData]);
    };

    const handleBlurEdit = (node: any) => {
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
        }

        setCurrentTitle("");
        setProcessData([...processData]);
    };

    const handleChangeDate = (node: any, date: any) => {
        node.begin_at = date[0];
        node.end_at = date[1];

        setProcessData([...processData]);
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
                                                defaultValue={node.begin_at && node.end_at && [
                                                    moment(node.begin_at, 'YYYY-MM-DD HH:mm:ss'),
                                                    moment(node.end_at, 'YYYY-MM-DD HH:mm:ss')
                                                ]}
                                                onChange={(dates, dateStrings) => handleChangeDate(node, dateStrings)} />
                                            <Button shape="circle" icon={<EditOutlined />} title="编辑"
                                                onClick={() => handleClickEdit(node)} />
                                            <Button shape="circle" icon={<DeleteOutlined />} title="删除"
                                                onClick={() => handleClickDelete(node)} />
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