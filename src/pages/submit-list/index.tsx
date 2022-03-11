import { Table, Tag, Space, Button, Tooltip } from 'antd';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from '../../assets/styles/submit-list/submit-list.module.css';
import reviewStatus from "../../config/review-status";

import Filter from '../../components/filter';

const SubmitList = () => {
    const navigate = useNavigate();
    const [fileData, setFileData] = useState<FILEDATA[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const data = [];
        data.push({
            id: 0,
            file_name: 'JohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohn',
            file_stage: "开题报告",
            file_status: "审核中",
            submit_time: "2022-02-11 19:09:30",
        });
        data.push({
            id: 1,
            file_name: 'John',
            file_stage: "开题报告",
            file_status: "审核通过",
            submit_time: "2022-02-11 19:09:30",
        });
        data.push({
            id: 2,
            file_name: 'John',
            file_stage: "开题报告",
            file_status: "审核驳回",
            submit_time: "2022-02-11 19:09:30",
        });
        for (let i = 3; i < 100; i++) {
            data.push({
                id: i,
                file_name: 'John',
                file_stage: "开题报告",
                file_status: "未审核",
                submit_time: "2022-02-11 19:09:30",
            });
        }
        setFileData(data);
        setTotalItems(100);
    }, []);

    const handleChangePage = (page: any, size: any) => {
        console.log(page);
        setPageSize(size);
    };

    const searchSubmitList = (msg: any) => {
        console.log("filterMsg: ", msg);
    };

    const handleClickCreate = () => {
        navigate("/submit-list/edit/-1");
    };

    const handleClickEdit = (text: any) => {
        const { id } = text;
        navigate(`/submit-list/edit/${id}`);
    };

    const handleClickDetail = (text: any) => {
        const { id } = text;
        navigate(`/submit-list/detail/${id}`);
    };

    return (
        <div>
            <Filter searchItem={searchSubmitList} />
            <Table
                className={style.table}
                dataSource={fileData}
                rowKey="id"
                title={() => (
                    <div className={style.create_btn}>
                        <Button type="primary" onClick={handleClickCreate}>新建文件</Button>
                    </div>
                )}
                pagination={
                    {
                        total: totalItems,
                        pageSize,
                        showQuickJumper: true,
                        showTotal: total => `共 ${total} 条`,
                        onChange: handleChangePage,
                    }
                }
                scroll={{ y: 330 }}>
                <Table.Column title="ID" dataIndex="id" width={70} />
                <Table.Column title="文件名" dataIndex="file_name"
                    render={(text) => (
                        <div className={style.table_text}>
                            <Tooltip placement="topLeft" title={text}>
                                {text}
                            </Tooltip>
                        </div>
                    )} />
                <Table.Column title="毕业设计阶段" dataIndex="file_stage" />
                <Table.Column title="审核状态" dataIndex="file_status"
                    render={(text) => {
                        let color = "default";
                        const status = reviewStatus[text];

                        if (status === 1) {
                            color = "processing";
                        } else if (status === 2) {
                            color = "success";
                        } else if (status === 3) {
                            color = "error"
                        };

                        return <Tag color={color}>{text}</Tag>;
                    }} />
                <Table.Column title="提交时间" dataIndex="submit_time" />
                <Table.Column
                    title="操作"
                    render={(text) => (
                        <Space size="middle">
                            <Button type="primary" size="small"
                                onClick={() => handleClickDetail(text)}>
                                查看
                            </Button>
                            {
                                reviewStatus[text.file_status] === 0 &&
                                <Button type="primary" size="small" ghost
                                    onClick={() => handleClickEdit(text)}>
                                    编辑
                                </Button>
                            }
                        </Space>
                    )}
                />
            </Table>
        </div>
    )
};
export default SubmitList;