import { Steps, Descriptions, Tag, Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from './student-process.module.css';
import axios from '../../http';

const StudentProgressCount = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(-1);
    const [stageList, setStageList] = useState<processStageList[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (current >= 0) {
            sessionStorage.setItem("current", current.toString());
        }
    }, [current]);

    const fetchData = async () => {
        const res: any = await axios.get('/api/student/progress');
        if (!res) {
            return;
        }
        const { progress } = res;
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