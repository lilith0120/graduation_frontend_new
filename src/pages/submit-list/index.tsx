import { Table, Tag, Space, Button, Tooltip } from 'antd';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from '../../assets/styles/submit-list/submit-list.module.css';
import { getType } from "../../config/review-status";
import axios from "../../http";

import Filter from '../../components/filter';

const SubmitList = () => {
    const navigate = useNavigate();
    const [fileData, setFileData] = useState<FILEDATA[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterMsg, setFilterMsg] = useState<any>({});

    useEffect(() => {
        const ps = sessionStorage.getItem("pageSize");
        const cp = sessionStorage.getItem("currentPage");
        const fm = sessionStorage.getItem("filterMsg");

        if (ps) {
            setPageSize(parseInt(ps));
        }

        if (cp) {
            setCurrentPage(parseInt(cp));
        }

        if (fm) {
            setFilterMsg(JSON.parse(fm));
        }
    }, []);

    useEffect(() => {
        fetchData();

        sessionStorage.setItem("pageSize", pageSize.toString());
        sessionStorage.setItem("currentPage", currentPage.toString());
        sessionStorage.setItem("filterMsg", JSON.stringify(filterMsg));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, currentPage, filterMsg]);

    const fetchData = async () => {
        const { file_name, process_id, file_status } = filterMsg;
        const res: any = await axios.post('/api/student/all_file', {
            size: pageSize,
            current: currentPage,
            search: {
                file_name,
                process_id,
                file_status,
            },
        });

        if (!res) {
            return;
        }
        const { totalNum, files } = res;
        setTotalItems(totalNum);
        setFileData(files);
    };

    const handleChangePage = (page: any, size: any) => {
        setCurrentPage(page);
        setPageSize(size);
    };

    const searchSubmitList = (msg: any) => {
        setFilterMsg(msg);
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
            <Filter searchItem={searchSubmitList} filterMsg={filterMsg} />
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
                <Table.Column title="毕业设计阶段" dataIndex="stage_name" />
                <Table.Column title="审核状态" dataIndex="status"
                    render={(text) => {
                        let color = "default";
                        const status = text;

                        if (status === 1) {
                            color = "processing";
                        } else if (status === 2) {
                            color = "success";
                        } else if (status === 3) {
                            color = "error"
                        };

                        return <Tag color={color}>{getType(text)}</Tag>;
                    }} />
                <Table.Column title="提交时间" dataIndex="createdAt" />
                <Table.Column
                    title="操作"
                    render={(text) => (
                        <Space size="middle">
                            <Button type="primary" size="small"
                                onClick={() => handleClickDetail(text)}>
                                查看
                            </Button>
                            {
                                text.status === 0 &&
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