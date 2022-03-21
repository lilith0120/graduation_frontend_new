import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Space, Button, Descriptions, Tag, Modal, Input, notification, message } from 'antd';
import FileSaver from "file-saver";
import style from '../../../assets/styles/review-list/detail.module.css';
import { getType } from "../../../config/review-status";
import axios from '../../../http';

import LabelHeader from "../../../components/label-header";

const ReviewDetail = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [reviewId, setReviewId] = useState(-1);
    const [showModal, setShowModal] = useState(false);
    const [review, setReview] = useState("");
    const [isPass, setIsPass] = useState(false);
    const [reviewDetail, setReviewDetail] = useState<ReviewDetailData>({
        id: -1, file_name: "", Student: { name: "" }, Stage: { name: "" }, status: -1, createdAt: "", file_url: "",
    });

    useEffect(() => {
        const { id }: any = params;
        if (id) {
            setReviewId(parseInt(id));
        } else {
            const path = window.location.pathname.split('/');
            const ri: any = path[path.length - 1];
            setReviewId(parseInt(ri));
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
        const res: any = await axios.get(`/api/teacher/review/${reviewId}`);
        const { file } = res;
        setReviewDetail(file);
    };

    const handleClickBack = () => {
        const currentPage = sessionStorage.getItem("currentPage");
        if (currentPage) {
            navigate(currentPage, { replace: true });
        } else {
            navigate(-1);
        }
    };

    const handleClickDownload = async () => {
        if (reviewDetail.status === 0) {
            const res = await axios.patch('/api/teacher/review/download/file', {
                fileIds: [reviewDetail.id],
            });

            if (!res) {
                message.error("下载失败");

                return;
            }
            navigate(0);
        }

        const file_format = reviewDetail.file_url.substr(reviewDetail.file_url.lastIndexOf(".") + 1);
        FileSaver.saveAs(reviewDetail.file_url, `${reviewDetail.file_name}.${file_format}`);
    };

    const handleClickCheck = (check: boolean) => {
        setIsPass(check);
        setShowModal(true);
    };

    const handleCancelModal = () => {
        setReview("");
        setShowModal(false);
    };

    const handleChangeReview = (e: any) => {
        setReview(e.target.value);
    };

    const handleOkModal = async () => {
        if (review === "") {
            notification["warning"]({
                message: '审核反馈不能为空',
                duration: 1,
            });
            return;
        }

        await updateReview();
    };

    const updateReview = async () => {
        const res = await axios.patch(`/api/teacher/review/${reviewDetail.id}`, {
            pass: isPass,
            comment: review,
        });

        if (!res) {
            message.error("审核失败");

            return;
        }
        setShowModal(false);
        navigate(0);
    };

    return (
        <div>
            <div className={style.header}>
                <LabelHeader label={"审核详细"} />
                <Space>
                    <Button onClick={handleClickBack}>返回</Button>
                    <Button type="primary" onClick={handleClickDownload} ghost>下载文件</Button>
                    {
                        reviewDetail.status === 1 &&
                        <>
                            <Button danger onClick={() => handleClickCheck(false)}>驳回</Button>
                            <Button type="primary" onClick={() => handleClickCheck(true)}>通过</Button>
                        </>
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
                        <Descriptions.Item label="文件名">{reviewDetail.file_name}</Descriptions.Item>
                        <Descriptions.Item label="提交学生">{reviewDetail.Student.name}</Descriptions.Item>
                        <Descriptions.Item label="文件描述" span={2}>{reviewDetail.file_detail}</Descriptions.Item>
                        <Descriptions.Item label="提交阶段">{reviewDetail.Stage.name}</Descriptions.Item>
                        <Descriptions.Item label="审核状态">
                            <Tag color={
                                reviewDetail.status === 0 ?
                                    "default" :
                                    reviewDetail.status === 1 ?
                                        "processing" :
                                        reviewDetail.status === 2 ?
                                            "success" : "error"
                            }>
                                {getType(reviewDetail.status)}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="提交时间" span={2}>{reviewDetail.createdAt}</Descriptions.Item>
                        {
                            (reviewDetail.status === 2 ||
                                reviewDetail.status === 3) &&
                            <>
                                <Descriptions.Item label="指导教师评论" span={2}>{reviewDetail.review}</Descriptions.Item>
                                <Descriptions.Item label="评论时间" span={2}>{reviewDetail.review_at}</Descriptions.Item>
                            </>
                        }
                    </Descriptions>
                </div>
                <div className={style.file_viewer}>
                    {
                        reviewDetail.file_url !== "" &&
                        <iframe className={style.file}
                            title="预览文档"
                            src={`https://view.xdocin.com/view?src=${reviewDetail.file_url}`} />
                    }
                </div>
            </div>
            <Modal title="审核反馈"
                visible={showModal}
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