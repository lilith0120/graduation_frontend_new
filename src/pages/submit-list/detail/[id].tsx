import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Tag, Descriptions } from 'antd';
import {
    ArrowLeftOutlined
} from '@ant-design/icons';
import style from '../../../assets/styles/submit-list/detail.module.css';
import reviewStatus from "../../../config/review-status";

import LabelHeader from "../../../components/label-header";

const Detail = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [fileId, setFileId] = useState(-1);
    const [fileDetail, setFileDetail] = useState<FileData>({
        file_id: -1, file_name: "", file_url: "", file_stage: "", file_status: "", teacher_name: "", submit_time: "",
    });

    useEffect(() => {
        const { id }: any = params;
        if (id) {
            setFileId(id);
        } else {
            const path = window.location.pathname.split('/');
            const fi: any = path[path.length - 1];
            setFileId(fi);
        }

        const f = {
            file_id: fileId,
            file_name: '111801429_吴寒_福州大学本科生毕业设计（论文）任务书（第二版）',
            file_url: 'http://baidu.com',
            file_detail: '说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢',
            file_stage: "开题报告",
            file_status: "未审核",
            submit_time: "2022-02-11 19:09:30",
            teacher_name: "行露",
            review: "说得好说说得好说说得好说说得好说说得好说说得说得好说好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说说得好说说得好说说得好说说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好说得好",
            review_time: "2022-02-14 19:09:30",
        };
        setFileDetail(f);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickBack = () => {
        const { length } = window.history;
        if (length > 2) {
            navigate(-1);
        } else {
            navigate("/submit-list", { replace: true });
        }
    };

    const handleClickEdit = () => {
        navigate(`/submit-list/edit/${fileId}`);
    };

    return (
        <div>
            <div className={style.header}>
                <Button shape="circle" icon={<ArrowLeftOutlined />} onClick={handleClickBack} />
                {
                    reviewStatus[fileDetail.file_status] === 0 &&
                    <Button type="primary" onClick={handleClickEdit}>编辑</Button>
                }
            </div>
            <div className={style.file_header}>
                <div className={style.file_name}>
                    {fileDetail.file_name}
                </div>
                {
                    reviewStatus[fileDetail.file_status] === 1 ?
                        <Tag color="processing">{fileDetail.file_status}</Tag> :
                        reviewStatus[fileDetail.file_status] === 2 ?
                            <Tag color="success">{fileDetail.file_status}</Tag> :
                            reviewStatus[fileDetail.file_status] === 3 ?
                                <Tag color="error">{fileDetail.file_status}</Tag> :
                                <Tag color="default">{fileDetail.file_status}</Tag>
                }
            </div>
            <div className={style.content}>
                <LabelHeader label={"文件信息"} />
                <Descriptions className={style.file_message} column={1}
                    size="small"
                    labelStyle={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        width: "200px",
                    }}
                    contentStyle={{ fontSize: "16px" }} bordered>
                    <Descriptions.Item label="文件路径">
                        <a href={fileDetail.file_url} target="_blank" rel="noreferrer">
                            {fileDetail.file_url}
                        </a>
                    </Descriptions.Item>
                    <Descriptions.Item label="文件描述">
                        {fileDetail.file_detail}
                    </Descriptions.Item>
                    <Descriptions.Item label="毕业设计阶段">
                        {fileDetail.file_stage}
                    </Descriptions.Item>
                    <Descriptions.Item label="提交时间">
                        {fileDetail.submit_time}
                    </Descriptions.Item>
                    <Descriptions.Item label="指导老师">
                        {fileDetail.teacher_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="指导老师评论">
                        {fileDetail.review}
                    </Descriptions.Item>
                    <Descriptions.Item label="指导老师评论时间">
                        {fileDetail.review_time}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </div>
    )
};

export default Detail;