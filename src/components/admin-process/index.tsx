import { Tree, Button, Input } from 'antd';
import { useEffect, useState } from 'react';
import {
    NumberOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import TreeDrop from '../../config/tree-drag';
import style from './admin-process.module.css';


const AdminProcess = () => {
    const [processData, setProcessData] = useState<AdminProcessList[]>([]);
    const [currentTitle, setCurrentTitle] = useState("");

    useEffect(() => {
        const pd = [
            {
                title: '开题报告',
                key: 0,
                pre_id: -1,
                isEdit: false,
            },
            {
                title: '任务书',
                key: 1,
                pre_id: 0,
                isEdit: false,
            },
            {
                title: '中期报告',
                key: 2,
                pre_id: 1,
                isEdit: false,
            },
            {
                title: '毕业设计论文',
                key: 3,
                pre_id: 2,
                isEdit: false,
            },
        ];
        setProcessData(pd);
    }, []);

    const handleClickCreate = () => {
        const newItem = {
            key: -1,
            title: "",
            pre_id: processData && processData.length > 0 ? processData[processData.length - 1].key : -1,
            isEdit: true,
        };

        setProcessData([...processData, newItem]);
    };

    const handleDropProcessData = (info: any) => {
        const dragPreId = info.dragNode.pre_id;
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const data = TreeDrop(info, processData);
        data.map((item: any) => {
            if (item.pre_id === dragKey) {
                item.pre_id = dragPreId;
            } else if (item.key === dragKey) {
                item.pre_id = dropKey;
            } else if (item.pre_id === dropKey) {
                item.pre_id = dragKey;
            };

            return item;
        });
        setProcessData([...data]);
    };

    const handleClickEdit = (node: any) => {
        node.isEdit = true;
        setCurrentTitle(node.title);
        setProcessData([...processData]);
    };

    const handleClickDelete = (node: any) => {
        const { key, pre_id } = node;
        const newData = processData.filter((item) => {
            if (item.key === key) {
                // eslint-disable-next-line array-callback-return
                return;
            } else if (item.pre_id === key) {
                item.pre_id = pre_id;
            };

            return item;
        });

        setProcessData([...newData]);
    };

    const handleChangeEdit = (e: any, node: any) => {
        node.title = e.target.value;
        setProcessData([...processData]);
    };

    const handleBlurEdit = (node: any) => {
        node.isEdit = false;
        if (node.key === -1 && node.title === "") {
            processData.pop();
        } else if (node.title === "") {
            node.title = currentTitle;
        }

        setCurrentTitle("");
        setProcessData([...processData]);
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
                            <Button shape="circle" icon={<DeleteOutlined />} title="删除"
                                onClick={() => handleClickDelete(node)} />
                        </div>
                    </div>
                )}
                onDrop={handleDropProcessData} />
        </div>
    )
};

export default AdminProcess;