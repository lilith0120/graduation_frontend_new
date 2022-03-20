import { Steps, Descriptions, Tag, Button, Modal } from "antd";
import { useEffect, useState } from "react";
import style from './teacher-progress-count.module.css';
import axios from '../../http';

import StudentDetailModal from "../student-detail-modal";

const TeacherProgressCount = () => {
    const [current, setCurrent] = useState(-1);
    const [stageList, setStageList] = useState<TeacherStage[]>([]);
    const [totalNumber, setTotalNumber] = useState(0);
    const [showPushModal, setShowPushModal] = useState(false);
    const [showFinishModal, setShowFinishModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (current >= 0) {
            sessionStorage.setItem("current", current.toString());
        }
    }, [current]);

    const fetchData = async () => {
        const res: any = await axios.get('/api/teacher/progress');
        const { studentNum, progress } = res;
        setTotalNumber(studentNum);
        if (!progress) {
            return;
        }

        setStageList(progress);
        const cur = sessionStorage.getItem("current");
        if (cur) {
            setCurrent(parseInt(cur));
        } else {
            progress.forEach((item: any, index: any) => {
                if (item.status === "process") {
                    setCurrent(index);
                }
            });
        }
    };

    const handleChangeCurrent = (cur: any) => {
        setCurrent(cur);
    };

    const handleClickPush = () => {
        setShowPushModal(true);
    };

    const handleClickFinish = () => {
        setShowFinishModal(true);
    };

    const handleCancelPushModal = () => {
        setShowPushModal(false);
    };

    const handleCancelFinishModal = () => {
        setShowFinishModal(false);
    };

    return (
        <div>
            <div className={style.step_content}>
                <Steps current={current} type="navigation" onChange={handleChangeCurrent}>
                    {
                        stageList.map((item, index) => (
                            <Steps.Step key={index} className={style.item}
                                status={item.status}
                                title={item.name} />
                        ))
                    }
                </Steps>
            </div>
            <div className={style.content}>
                <Descriptions column={1} labelStyle={{ width: "250px" }} bordered>
                    <Descriptions.Item label="阶段名">{stageList[current]?.name}</Descriptions.Item>
                    <Descriptions.Item label="开始时间">{stageList[current]?.begin_at}</Descriptions.Item>
                    <Descriptions.Item label="结束时间">{stageList[current]?.end_at}</Descriptions.Item>
                    <Descriptions.Item label="是否结束">
                        {
                            stageList[current]?.status === "finish" ?
                                <Tag color="warning">已结束</Tag> :
                                stageList[current]?.status === "process" ?
                                    <Tag color="processing">进行中</Tag> :
                                    <Tag>未开始</Tag>
                        }
                    </Descriptions.Item>
                    {
                        stageList[current]?.status !== "wait" &&
                        <>
                            <Descriptions.Item label="提交人数">
                                <span>{stageList[current]?.pushNumber} / {totalNumber}</span>
                                <Button type="link" onClick={handleClickPush}>查看详细</Button>
                            </Descriptions.Item>
                            <Descriptions.Item label="完成人数">
                                <span>{stageList[current]?.finishNumber} / {totalNumber}</span>
                                <Button type="link" onClick={handleClickFinish}>查看详细</Button>
                            </Descriptions.Item>
                        </>
                    }
                </Descriptions>
            </div>
            <Modal className={style.detail_modal}
                title={`学生提交情况 (${stageList[current]?.name}阶段)`}
                visible={showPushModal}
                footer={null}
                width={1000}
                onCancel={handleCancelPushModal}>
                <StudentDetailModal modalType={"push"} stageId={stageList[current]?.id} stageName={`${stageList[current]?.name}阶段`} />
            </Modal>
            <Modal className={style.detail_modal}
                title={`学生完成情况 (${stageList[current]?.name}阶段)`}
                visible={showFinishModal}
                footer={null}
                width={1000}
                onCancel={handleCancelFinishModal}>
                <StudentDetailModal modalType={"finish"} stageId={stageList[current]?.id} stageName={`${stageList[current]?.name}阶段`} />
            </Modal>
        </div>
    )
};

export default TeacherProgressCount;