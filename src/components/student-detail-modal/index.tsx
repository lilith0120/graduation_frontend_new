import { List, Button, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import style from './student-detail-modal.module.css';
import { reviewStatus } from '../../config/review-status';
import axios from '../../http';
import trueAxios from 'axios';

import LabelHeader from "../label-header";

const StudentDetailModal = (props: any) => {
    const navigate = useNavigate();
    const { modalType, stageId, stageName } = props;
    const [detailList, setDetailList] = useState<StudentDetail[]>([]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stageId]);

    const fetchData = async () => {
        const res: any = await axios.get(`/api/teacher/progress_detail/${stageId}`);
        const { progressDetail } = res;
        setDetailList(progressDetail);
    };

    const handleClickDownload = async (file: any) => {
        const fileIds: number[] = [];
        const files = [];
        if (file instanceof Array) {
            detailList.map((item) => {
                if (item.file_id !== undefined && item.file_id !== null) {
                    files.push(item);
                    if (item.push_status === "未审核") {
                        fileIds.push(item.file_id);
                    }
                }

                return item;
            });
        } else {
            if (file.push_status === "未审核") {
                fileIds.push(file.file_id);
            }
            files.push(file);
        }

        await downloadFile(fileIds, files);
    };

    const handleClickDetail = (id: any) => {
        navigate(`/student-list/stage-detail/${id}`);
    };

    const handleClickReview = (fileId: any) => {
        sessionStorage.setItem("currentPage", window.location.pathname);
        navigate(`/review-list/detail/${fileId}`);
    };

    const downloadFile = async (fileIds: any, files: any) => {
        const res = await axios.patch('/api/teacher/review/download/file', {
            fileIds,
        });
        if (!res) {
            message.error("下载失败");

            return;
        }

        const fileUrls = [];
        for (let key in files) {
            let url = {
                url: files[key].file_url,
                file_name: files[key].file_name,
                file_format: files[key].file_url.substr(files[key].file_url.lastIndexOf(".") + 1),
            }
            fileUrls.push(url);
            if (files[key].push_status === "未审核") {
                files[key].push_status = "审核中";
            }
        }
        if (files.length === 1) {
            FileSaver.saveAs(fileUrls[0].url, `${fileUrls[0].file_name}.${fileUrls[0].file_format}`);
        } else if (files.length > 1) {
            await zipFile(fileUrls);
        } else {
            message.warning("当前无文件下载");
        }
        setDetailList([...detailList]);
    };

    const zipFile = async (urls: any) => {
        try {
            const zip = new JSZip();
            const files = zip.folder(`${stageName}`);
            await Promise.all(urls.map(async (item: any) => {
                const { data }: any = await getFile(item.url);
                const fileName = `${item.file_name}.${item.file_format}`;
                files?.file(fileName, data, { binary: true });
            }));
            const content = await zip.generateAsync({ type: 'blob' });
            FileSaver.saveAs(content, `${stageName}.zip`);
        } catch (err) {
            message.error("下载失败");
        }
    };

    const getFile = async (url: any) => {
        return await trueAxios.get(url, {
            responseType: "blob",
        });
    };

    return (
        <div className={style.main}>
            <div>
                <div className={style.push_header}>
                    <LabelHeader label={modalType === "push" ? "已提交" : "已完成"} />
                    {
                        modalType === "push" &&
                        <Button type="primary" onClick={() => handleClickDownload(detailList)}>
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
                                                onClick={() => handleClickDownload(item)}>
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
                                            {`${item.name} (${item.User.user_id})`}
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
                                            {`${item.name} (${item.User.user_id})`}
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