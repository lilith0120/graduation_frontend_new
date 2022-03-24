import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Descriptions, Tag, Space, Select } from 'antd';
import style from '../../../assets/styles/student-list/stage-detail.module.css';
import { getType } from '../../../config/review-status';
import axios from '../../../http';

import LabelHeader from "../../../components/label-header";

const StudentStageDetail = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [studentId, setStudentId] = useState(-1);
    const [selectOption, setSelectOption] = useState<any[]>([]);
    const [select, setSelect] = useState<any>();
    const [studentDetail, setStudentDetail] = useState<StudentData>({
        name: "", grade: "", Profession: { name: "" }, sex: "", User: { email: "", user_id: "" }
    });
    const [fileDetail, setFileDetail] = useState<FileData>({
        id: -1, file_name: "", status: 0, createdAt: "", Stage: { name: "" }, is_review: false,
    });

    useEffect(() => {
        const { id }: any = params;
        if (id) {
            setStudentId(parseInt(id));
        } else {
            const path = window.location.pathname.split('/');
            const si: any = path[path.length - 1];
            setStudentId(parseInt(si));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (studentId !== -1) {
            getStudentDetail();
            getSelectOption();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentId]);

    useEffect(() => {
        if (select && selectOption.length) {
            getFileDetail();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [select, selectOption]);

    const getStudentDetail = async () => {
        const res: any = await axios.get(`/api/teacher/show_student/${studentId}`);
        let student = res;
        if (!student.Stage) {
            student = {
                ...student,
                Stage: {
                    name: "未开始",
                },
            };
        }
        setStudentDetail(student);
    };

    const getFileDetail = () => {
        const file = selectOption.find((item) => item.id === select);
        setFileDetail(file);
    };

    const getSelectOption = async () => {
        const res: any = await axios.get(`/api/teacher/file_list/${studentId}`);
        const { fileList } = res;
        if (!fileList.length) {
            return;
        }

        let current = fileList[0].id;
        fileList.filter((item: any) => {
            if (item.status === 2 && item.id === studentDetail.StageId) {
                current = item.id;
            }

            return item;
        });
        setSelect(current);
        setSelectOption(fileList);
    };

    const handleClickBack = () => {
        navigate(-1);
    };

    const handleChangeSelect = (value: any) => {
        setSelect(value);
    };

    const handleClickReview = () => {
        navigate(`/review-list/detail/${fileDetail.id}`);
    };

    return (
        <div>
            <div>
                <div className={style.header}>
                    <LabelHeader label={"基本信息"} />
                    <Button onClick={handleClickBack}>返回</Button>
                </div>
                <div className={style.content}>
                    <Descriptions className={style.file_message} column={2}
                        size="small"
                        labelStyle={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            width: "200px",
                        }}
                        contentStyle={{ fontSize: "16px" }} bordered>
                        <Descriptions.Item label="学号">
                            {studentDetail.User.user_id}
                        </Descriptions.Item>
                        <Descriptions.Item label="学生姓名">
                            {studentDetail.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="性别">
                            {studentDetail.sex ? "女" : "男"}
                        </Descriptions.Item>
                        <Descriptions.Item label="年级">
                            {studentDetail.grade}
                        </Descriptions.Item>
                        <Descriptions.Item label="专业">
                            {studentDetail.Profession.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="邮箱">
                            {studentDetail.User.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="毕业设计阶段">
                            {studentDetail.Stage?.name}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            </div>
            <div>
                <div className={style.header}>
                    <LabelHeader label={"提交信息"} />
                    <Space>
                        <Select className={style.cascader}
                            value={select}
                            onChange={handleChangeSelect} >
                            {
                                selectOption.map((item, index) => (
                                    <Select.Option key={index} value={item.id}>
                                        {`${item.id} -- ${item.Stage.name} -- ${getType(item.status)} -- ${item.createdAt}`}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                        <Button type="primary" onClick={handleClickReview}
                            disabled={
                                !selectOption.length || fileDetail.is_review || (fileDetail?.status === 2 || fileDetail?.status === 3) ? true : false
                            }>
                            审核
                        </Button>
                    </Space>
                </div>
                <div className={style.content}>
                    <Descriptions className={style.file_message} column={1}
                        size="small"
                        labelStyle={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            width: "200px",
                        }}
                        contentStyle={{ fontSize: "16px" }} bordered>
                        <Descriptions.Item label="文件名">
                            {fileDetail?.file_name}
                        </Descriptions.Item>
                        <Descriptions.Item label="文件描述">
                            {fileDetail?.file_detail}
                        </Descriptions.Item>
                        <Descriptions.Item label="毕业设计阶段">
                            {fileDetail?.Stage?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="提交状态">
                            {
                                fileDetail.id > 0 &&
                                <Tag color={
                                    fileDetail.status === 0 ?
                                        "default" :
                                        fileDetail.status === 1 ?
                                            "processing" :
                                            fileDetail.status === 2 ?
                                                "success" : "error"
                                }>
                                    {getType(fileDetail.status)}
                                </Tag>
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="提交时间">
                            {fileDetail?.createdAt}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            </div>
        </div>
    )
};

export default StudentStageDetail;