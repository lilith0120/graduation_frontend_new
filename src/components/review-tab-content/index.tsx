import { Table, Button, Tag, Tooltip, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reviewStatus } from '../../config/review-status';
import style from './review-tab-content.module.css';

const ReviewTabContent = (props: any) => {
    const { status } = props;
    const navigate = useNavigate();
    const [reviewList, setReviewList] = useState<ReviewData[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async (page = 1, size = 10) => {
        console.log(status);
        console.log(page, size);
        const rl = [
            {
                id: 1,
                name: '吃饭吃饭吃饭吃饭吃饭吃饭吃饭吃饭吃饭吃饭',
                student_name: 'Brown',
                submit_time: "2022-02-25 14:40:23",
                stage: "开题报告",
                status: "未审核",
            },
            {
                id: 2,
                name: 'Jim',
                student_name: 'Green',
                submit_time: "2022-02-25 14:40:23",
                stage: "开题报告",
                status: "审核中",
            },
            {
                id: 3,
                name: 'Joe',
                student_name: 'Black',
                submit_time: "2022-02-25 14:40:23",
                stage: "开题报告",
                status: "审核通过",
            },
            {
                id: 4,
                name: 'Joe1',
                student_name: 'Black1',
                submit_time: "2022-02-25 14:40:23",
                stage: "开题报告",
                status: "审核驳回",
            },
        ];
        for (let i = 5; i < 101; i++) {
            rl.push({
                id: i,
                name: 'Joe1',
                student_name: 'Black1',
                submit_time: "2022-02-25 14:40:23",
                stage: "开题报告",
                status: "审核中",
            });
        }
        setReviewList(rl);
        setTotalItems(100);
    };

    const handleChangePage = async (page: any, size: any) => {
        await fetchData(page, size);
        setPageSize(size);
    };

    const handleClickReview = (fileId: any) => {
        navigate(`/review-list/detail/${fileId}`);
    };

    return (
        <div>
            <Table className={style.table}
                dataSource={reviewList} rowKey="id"
                pagination={
                    {
                        total: totalItems,
                        pageSize,
                        showQuickJumper: true,
                        showTotal: total => `共 ${total} 条`,
                        onChange: handleChangePage,
                    }
                }
                scroll={{ y: 400 }}>
                <Table.Column title="ID" dataIndex="id" width={80} />
                <Table.Column title="文件名" dataIndex="name" width={280}
                    render={(text) => (
                        <div className={style.table_text}>
                            <Tooltip placement="topLeft" title={text}>
                                {text}
                            </Tooltip>
                        </div>
                    )} />
                <Table.Column title="提交学生" dataIndex="student_name" />
                <Table.Column title="提交阶段" dataIndex="stage" />
                <Table.Column title="审核状态" dataIndex="status"
                    render={(text) => {
                        let color = "default";

                        if (reviewStatus[text] === 1) {
                            color = "processing";
                        } else if (reviewStatus[text] === 2) {
                            color = "success";
                        } else if (reviewStatus[text] === 3) {
                            color = "error";
                        };

                        return <Tag color={color}>{text}</Tag>
                    }} />
                <Table.Column title="提交时间" dataIndex="submit_time" />
                <Table.Column title="操作"
                    render={(text, record: any) => {
                        const fileStatus = record.status;
                        if (reviewStatus[fileStatus] === 2 || reviewStatus[fileStatus] === 3) {
                            return <Button type="primary" size="small"
                                onClick={() => handleClickReview(record.id)}>
                                查看详细
                            </Button>
                        } else {
                            return <Space>
                                <Button type="link" size="small"
                                    onClick={() => handleClickReview(record.id)}>
                                    审核文件
                                </Button>
                            </Space>
                        }
                    }} />
            </Table>
        </div>
    )
};

export default ReviewTabContent;