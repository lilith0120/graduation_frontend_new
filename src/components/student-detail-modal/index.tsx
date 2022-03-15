import { List, Button, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './student-detail-modal.module.css';
import reviewStatus from '../../config/review-status';

import LabelHeader from "../label-header";

const StudentDetailModal = (props: any) => {
    const navigate = useNavigate();
    const { modalType, stageId } = props;
    const [detailList, setDetailList] = useState<StudentDetail[]>([]);

    useEffect(() => {
        console.log(stageId);
        const dl = [
            {
                id: "111801429",
                name: "九歌",
                isPush: true,
                isFinish: true,
                push_status: "审核通过",
                file_id: 0,
            },
            {
                id: "11111111",
                name: "person1",
                isPush: true,
                isFinish: false,
                push_status: "审核驳回",
                file_id: 1,
            },
            {
                id: "22222222",
                name: "person2",
                isPush: true,
                isFinish: true,
                push_status: "审核通过",
                file_id: 2,
            },
            {
                id: "33333333",
                name: "person3",
                isPush: false,
                isFinish: false,
            },
            {
                id: "44444444",
                name: "person4",
                isPush: true,
                isFinish: true,
                push_status: "未审核",
                file_id: 3,
            },
            {
                id: "55555555",
                name: "person5",
                isPush: true,
                isFinish: false,
                push_status: "审核中",
                file_id: 4,
            },
            {
                id: "666666666",
                name: "person6",
                isPush: false,
                isFinish: false,
            },
        ];
        setDetailList(dl);
    }, [stageId]);

    const handleClickDownload = (fileId = -1) => {
        if (fileId === -1) {
            const fileIds: number[] = [];
            detailList.map((item) => {
                if (item.file_id !== undefined && item.file_id !== null) {
                    fileIds.push(item.file_id);
                }

                return item;
            });

            console.log("download: ", fileIds);
        } else {
            console.log("download: ", fileId);
        }
    };

    const handleClickDetail = (id: any) => {
        navigate(`/student-list/stage-detail/${id}`);
    };

    const handleClickReview = (fileId: any) => {
        console.log("go to: ", fileId);
    };

    return (
        <div className={style.main}>
            <div>
                <div className={style.push_header}>
                    <LabelHeader label={modalType === "push" ? "已提交" : "已完成"} />
                    {
                        modalType === "push" &&
                        <Button type="primary" onClick={() => handleClickDownload()}>
                            全部下载
                        </Button>
                    }
                </div>
                <List
                    className={style.detail_item}
                    dataSource={detailList}
                    renderItem={item => {
                        if ((modalType === "push" && item.isPush) ||
                            (modalType === "finish" && item.isFinish)) {
                            return <List.Item
                                actions={
                                    modalType === "push" && item.push_status ?
                                        [
                                            <Tag key="item_status" color={
                                                reviewStatus[item.push_status] === 0 ?
                                                    "default" :
                                                    reviewStatus[item.push_status] === 1 ?
                                                        "processing" :
                                                        reviewStatus[item.push_status] === 2 ?
                                                            "success" : "error"}>
                                                {item.push_status}
                                            </Tag>,
                                            <Button key="item_download" type="link" size="small"
                                                onClick={() => handleClickDownload(item.file_id)}>
                                                下载文件
                                            </Button>,
                                            <Button key="item_review" type="link" size="small"
                                                disabled={reviewStatus[item.push_status] === 2 || reviewStatus[item.push_status] === 3 ? true : false}
                                                onClick={() => handleClickReview(item.file_id)}>
                                                审核文件
                                            </Button>
                                        ] : []
                                }>
                                <List.Item.Meta
                                    title={
                                        <Button type="link" onClick={() => handleClickDetail(item.id)}>
                                            {`${item.name} (${item.id})`}
                                        </Button>
                                    }
                                />
                            </List.Item>;
                        }
                    }} />
            </div>
            <div>
                <LabelHeader label={modalType === "push" ? "未提交" : "未完成"} />
                <List
                    className={style.detail_item}
                    dataSource={detailList}
                    renderItem={item => {
                        if ((modalType === "push" && !item.isPush) ||
                            (modalType === "finish" && !item.isFinish)) {
                            return <List.Item>
                                <List.Item.Meta
                                    title={
                                        <Button type="link" onClick={() => handleClickDetail(item.id)}>
                                            {`${item.name} (${item.id})`}
                                        </Button>
                                    }
                                />
                            </List.Item>;
                        }
                    }} />
            </div>
        </div>
    )
};

export default StudentDetailModal;