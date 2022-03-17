import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Tag, Descriptions } from 'antd';
import {
    ArrowLeftOutlined
} from '@ant-design/icons';
import style from '../../../assets/styles/submit-list/detail.module.css';
import { getType } from "../../../config/review-status";
import axios from "../../../http";

import LabelHeader from "../../../components/label-header";

const Detail = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [fileId, setFileId] = useState(-1);
    const [fileDetail, setFileDetail] = useState<FileData>({
        file_id: -1, file_name: "", file_url: "", Stage: { name: "" }, status: 0, Teacher: { name: "" }, createdAt: "",
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (fileId !== -1) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileId]);

    const fetchData = async () => {
        const res: any = await axios.get(`/api/student/file/${fileId}`);
        setFileDetail(res);
    };

    const handleClickBack = () => {
        const { length } = window.history;
        if (length >= 2) {
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
                    fileDetail.status === 0 &&
                    <Button type="primary" onClick={handleClickEdit}>编辑</Button>
                }
            </div>
            <div className={style.file_header}>
                <div className={style.file_name}>
                    {fileDetail.file_name}
                </div>
                {

                    <Tag color={
                        fileDetail.status === 1 ? "processing" :
                            fileDetail.status === 2 ? "success" :
                                fileDetail.status === 3 ? "error" : "default"
                    }>
                        {getType(fileDetail.status)}
                    </Tag>
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
                            点击下载
                        </a>
                    </Descriptions.Item>
                    <Descriptions.Item label="文件描述">
                        {fileDetail.file_detail}
                    </Descriptions.Item>
                    <Descriptions.Item label="毕业设计阶段">
                        {fileDetail.Stage.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="提交时间">
                        {fileDetail.createdAt}
                    </Descriptions.Item>
                    <Descriptions.Item label="指导老师">
                        {fileDetail.Teacher?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="指导老师评论">
                        {fileDetail.review}
                    </Descriptions.Item>
                    <Descriptions.Item label="指导老师评论时间">
                        {fileDetail.review_at}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </div>
    )
};

export default Detail;