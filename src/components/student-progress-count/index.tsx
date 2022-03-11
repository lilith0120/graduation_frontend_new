import { Steps, Descriptions, Tag, Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from './student-process.module.css';

const StudentProgressCount = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const [stageList, setStageList] = useState<processStageList[]>([]);

    useEffect(() => {
        const s = [
            {
                id: 0,
                name: "开题报告",
                begin_at: "2022.02.11 19:39:21",
                end_at: "2022.02.13 20:39:21",
                status: "finish",
                isDone: true,
                file_id: 2,
                file_name: "111801429_吴寒_福州大学本科生毕业设计（论文）任务书（第二版）",
            },
            {
                id: 1,
                name: "任务书",
                begin_at: "2022.02.13 21:39:21",
                end_at: "2022.02.15 18:39:21",
                status: "finish",
                isDone: false,
            },
            {
                id: 2,
                name: "中期报告",
                begin_at: "2022.02.15 19:39:21",
                end_at: "2022.02.17 20:39:21",
                status: "process",
                isDone: false,
            },
            {
                id: 3,
                name: "毕业设计论文",
                status: "wait",
            },
            {
                id: 3,
                name: "毕业设计论文",
                begin_at: "2022.02.23 21:39:21",
                end_at: "2022.02.27 20:39:21",
                status: "wait",
            },
            {
                id: 3,
                name: "毕业设计论文",
                begin_at: "2022.02.23 21:39:21",
                end_at: "2022.02.27 20:39:21",
                status: "wait",
            },
            {
                id: 3,
                name: "毕业设计论文",
                begin_at: "2022.02.23 21:39:21",
                end_at: "2022.02.27 20:39:21",
                status: "wait",
            },
            {
                id: 3,
                name: "毕业设计论文",
                begin_at: "2022.02.23 21:39:21",
                end_at: "2022.02.27 20:39:21",
                status: "wait",
            },
            {
                id: 3,
                name: "毕业设计论文",
                begin_at: "2022.02.23 21:39:21",
                end_at: "2022.02.27 20:39:21",
                status: "wait",
            },
        ];
        setStageList(s);
        s.forEach((item) => {
            if (item.status === "process") {
                setCurrent(item.id);
            }
        });
    }, []);

    const handleChangeCurrent = (cur: any) => {
        setCurrent(cur);
    };

    const handleClickDetail = () => {
        navigate(`/submit-list/detail/${stageList[current]?.file_id}`);
    };

    return (
        <div>
            <div className={style.step_content}>
                <Steps current={current} type="navigation" onChange={handleChangeCurrent}>
                    {
                        stageList.map((item, index) => (
                            <Steps.Step key={index} className={style.item}
                                status={(item.status === "finish" && !item.isDone) ? "error" : item.status}
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
                        <Descriptions.Item label="是否完成">
                            {
                                stageList[current]?.isDone ?
                                    <Tag color="success">已完成</Tag> :
                                    <Tag color={
                                        stageList[current]?.status === "finish" ? "error" : "warning"}>
                                        未完成
                                    </Tag>
                            }
                        </Descriptions.Item>
                    }
                    {
                        stageList[current]?.isDone &&
                        <Descriptions.Item label="文件详细">
                            <Button type="link" onClick={handleClickDetail}>
                                {stageList[current]?.file_name}
                            </Button>
                        </Descriptions.Item>
                    }
                </Descriptions>
            </div>
        </div>
    )
};

export default StudentProgressCount;