import { Table, Button, Tag, Tooltip, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getType } from '../../config/review-status';
import style from './review-tab-content.module.css';
import axios from '../../http';

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
        const res: any = await axios.post('/api/teacher/review/all', {
            size,
            current: page,
            status,
        });
        const { totalNums, reviews } = res;
        setReviewList(reviews);
        setTotalItems(totalNums);
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
                <Table.Column title="文件名" dataIndex="file_name" width={280}
                    render={(text) => (
                        <div className={style.table_text}>
                            <Tooltip placement="topLeft" title={text}>
                                {text}
                            </Tooltip>
                        </div>
                    )} />
                <Table.Column title="提交学生" dataIndex="student_name" />
                <Table.Column title="提交阶段" dataIndex="stage_name" />
                <Table.Column title="审核状态" dataIndex="status"
                    render={(text) => {
                        let color = "default";

                        if (text === 1) {
                            color = "processing";
                        } else if (text === 2) {
                            color = "success";
                        } else if (text === 3) {
                            color = "error";
                        };

                        return <Tag color={color}>{getType(text)}</Tag>
                    }} />
                <Table.Column title="提交时间" dataIndex="createdAt" />
                <Table.Column title="操作"
                    render={(text, record: any) => {
                        const fileStatus = record.status;
                        if (fileStatus === 2 || fileStatus === 3) {
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