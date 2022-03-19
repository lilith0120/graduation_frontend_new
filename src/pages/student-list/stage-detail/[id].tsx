import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Descriptions, Tag, Space, Select } from 'antd';
import style from '../../../assets/styles/student-list/stage-detail.module.css';
import { getType } from '../../../config/review-status';

import LabelHeader from "../../../components/label-header";

const StudentStageDetail = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [studentId, setStudentId] = useState(-1);
    const [selectOption, setSelectOption] = useState<any[]>([]);
    const [select, setSelect] = useState<any>();
    const [studentDetail, setStudentDetail] = useState<StudentData>({
        name: "", grade: "", Profession: { name: "" }, sex: "", User: { email: "", user_id: "" }, stage: "",
    });
    const [fileDetail, setFileDetail] = useState<FileData>({
        file_id: -1, file_name: "", status: 0, createdAt: "", Stage: { name: "" },
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

        getStudentDetail();
        getFileDetail();
        getSelectOption();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getStudentDetail = async () => {
        const s = {
            name: 'John',
            grade: "2018",
            sex: "女",
            Profession: {
                name: "软件工程"
            },
            teacher_name: "行露",
            User: {
                user_id: "",
                email: "3428098215@qq.com",
            },
            stage: "毕业设计论文",
        };
        setStudentDetail(s);
    };

    const getFileDetail = async () => {
        const fd = {
            file_id: 2,
            file_name: '111801429_吴寒_福州大学本科生毕业设计（论文）任务书（第二版）',
            file_detail: '说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢说什么呢',
            Stage: {
                name: "开题报告",
            },
            status: 1,
            createdAt: "2022-02-11 19:09:30",
        };
        setFileDetail(fd);
    };

    const getSelectOption = async () => {
        const so = [
            {
                id: 0,
                stage: '开题报告',
                status: '审核通过',
                time: '2022-02-22 12:00:00',
            },
            {
                id: 1,
                stage: '任务书',
                status: '审核通过',
                time: '2022-02-22 12:00:00',
            },
        ];
        setSelect(so[0].id);
        setSelectOption(so);
    };

    const handleClickBack = () => {
        navigate(-1);
    };

    const handleChangeSelect = async (value: any) => {
        setSelect(value);
        await getFileDetail();
    };

    const handleClickReview = () => {
        navigate(`/review-list/detail/${fileDetail.file_id}`);
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
                            {studentDetail.sex}
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
                            {studentDetail.stage}
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
                                        {`${item.id} -- ${item.stage} -- ${item.status} -- ${item.time}`}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                        <Button type="primary" onClick={handleClickReview}
                            disabled={fileDetail.status === 2 || fileDetail.status === 3 ? true : false}>
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
                            {fileDetail.Stage?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="提交状态">
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