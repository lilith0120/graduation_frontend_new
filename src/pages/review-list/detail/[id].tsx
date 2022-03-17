import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Space, Button, Descriptions, Tag, Modal, Input, notification } from 'antd';
import style from '../../../assets/styles/review-list/detail.module.css';
import { reviewStatus } from "../../../config/review-status";

import LabelHeader from "../../../components/label-header";

const ReviewDetail = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [reviewId, setReviewId] = useState(-1);
    const [showModal, setShowModal] = useState(false);
    const [review, setReview] = useState("");
    const [reviewDetail, setReviewDetail] = useState<ReviewDetailData>({
        id: -1, name: "", student_name: "", stage: "", status: "", submit_time: "", detail: "", url: "",
    });

    useEffect(() => {
        const { id }: any = params;
        if (id) {
            setReviewId(id);
        } else {
            const path = window.location.pathname.split('/');
            const ri: any = path[path.length - 1];
            setReviewId(ri);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (reviewId !== -1) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reviewId]);

    const fetchData = async () => {
        console.log(reviewId);
        const fd = {
            id: reviewId,
            url: "https://view.xdocin.com/view/demo.docx",
            name: 'Joe1',
            student_name: 'Black1',
            submit_time: "2022-02-25 14:40:23",
            stage: "开题报告",
            status: "审核中",
            detail: "说什么说什么说什说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么么说什么说么说什么说什么说什么说什么说什么说什么",
            review: "说什么说什么说什说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么说什么么说什么说么说什么说什么说什么说什么说什么说什么",
            review_time: "2022-02-25 20:18:00",
        };
        setReviewDetail(fd);
    };

    const handleClickBack = () => {
        navigate(-1);
    };

    const handleClickDownload = () => {
        console.log("download");
    };

    const handleClickCheck = (check: boolean) => {
        console.log(check);
        setShowModal(true);
    };

    const handleCancelModal = () => {
        setShowModal(false);
    };

    const handleChangeReview = (e: any) => {
        setReview(e.target.value);
    };

    const handleOkModal = () => {
        if (review === "") {
            notification["warning"]({
                message: '审核反馈不能为空',
                duration: 1,
            });
            return;
        }

        console.log(review);
        setShowModal(false);
    };

    return (
        <div>
            <div className={style.header}>
                <LabelHeader label={"审核详细"} />
                <Space>
                    <Button onClick={handleClickBack}>返回</Button>
                    {
                        reviewStatus[reviewDetail.status] === 0 ?
                            <Button type="primary" onClick={handleClickDownload}>下载文件</Button> :
                            reviewStatus[reviewDetail.status] === 1 ?
                                <>
                                    <Button danger onClick={() => handleClickCheck(false)}>驳回</Button>
                                    <Button type="primary" onClick={() => handleClickCheck(true)}>通过</Button>
                                </> : <></>
                    }
                </Space>
            </div>
            <div className={style.content}>
                <div className={style.description}>
                    <Descriptions
                        labelStyle={{ width: "150px" }}
                        size="small"
                        column={2}
                        bordered>
                        <Descriptions.Item label="文件名">{reviewDetail.name}</Descriptions.Item>
                        <Descriptions.Item label="提交学生">{reviewDetail.student_name}</Descriptions.Item>
                        <Descriptions.Item label="文件描述" span={2}>{reviewDetail.detail}</Descriptions.Item>
                        <Descriptions.Item label="提交阶段">{reviewDetail.stage}</Descriptions.Item>
                        <Descriptions.Item label="审核状态">
                            <Tag color={
                                reviewStatus[reviewDetail.status] === 0 ?
                                    "default" :
                                    reviewStatus[reviewDetail.status] === 1 ?
                                        "processing" :
                                        reviewStatus[reviewDetail.status] === 2 ?
                                            "success" : "error"
                            }>
                                {reviewDetail.status}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="提交时间" span={2}>{reviewDetail.submit_time}</Descriptions.Item>
                        {
                            (reviewStatus[reviewDetail.status] === 2 ||
                                reviewStatus[reviewDetail.status] === 3) &&
                            <>
                                <Descriptions.Item label="指导教师评论" span={2}>{reviewDetail.review}</Descriptions.Item>
                                <Descriptions.Item label="评论时间" span={2}>{reviewDetail.review_time}</Descriptions.Item>
                            </>
                        }
                    </Descriptions>
                </div>
                <div className={style.file_viewer}>
                    <iframe className={style.file}
                        title="预览文档"
                        src={`https://view.xdocin.com/view?src=${reviewDetail.url}`} />
                </div>
            </div>
            <Modal title="审核反馈" visible={showModal}
                onOk={handleOkModal}
                onCancel={handleCancelModal}>
                <Input.TextArea placeholder="请输入审核反馈"
                    autoSize={{ minRows: 4, maxRows: 8 }}
                    maxLength={200} showCount
                    value={review}
                    onChange={handleChangeReview} />
            </Modal>
        </div >
    )
};

export default ReviewDetail;