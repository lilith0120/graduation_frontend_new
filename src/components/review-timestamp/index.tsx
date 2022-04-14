import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons/lib/icons';
import { Timeline, Tag, Popover } from 'antd';
import { useEffect, useState } from 'react';
import { getType } from "../../config/review-status";
import style from './review-timestamp.module.css';

const ReviewTimestamp = (props: any) => {
    const { data } = props;
    const [timestamp, setTimestamp] = useState(data);

    useEffect(() => {
        const group: any = [];
        const ts = [];
        let pushTime: any;
        let groupStatus: any;
        let isError = false;
        data.forEach((item: any) => {
            if (item.is_group) {
                group.push(item);

                if (!pushTime) {
                    pushTime = item.time;
                } else {
                    pushTime = item.time > pushTime ? item.item : pushTime;
                }

                if (!groupStatus) {
                    groupStatus = item.status;
                } else {
                    if (item.status === 3 ||
                        (item.status === 1 && groupStatus !== 3)) {
                        groupStatus = item.status;
                    } else if (item.status === 0 && groupStatus === 2) {
                        groupStatus = 1;
                    }
                }
            } else {
                const i = item;
                if (item.is_group === false) {
                    i.user_name = "送审教师";
                    isError = item.status === 3 ? true : false;
                } else {
                    i.user_name = i.user;
                }

                ts.push(i);
            }
        });

        if (!isError) {
            ts.push({
                is_group: true,
                user_name: "答辩教师组",
                group,
                time: pushTime,
                status: groupStatus,
            });
        }
        setTimestamp(ts);
    }, [data]);

    return (
        <div className={style.time_viewer}>
            <Timeline mode="left">
                {
                    timestamp.map((item: any, index: any) => (
                        <Timeline.Item key={index} label={item.time}
                            color={
                                item.status === 1 ? "blue" :
                                    item.status === 2 ? "green" :
                                        item.status === 3 ?
                                            "red" : "grey"
                            }
                            dot={
                                item.status === 1 ? <ClockCircleOutlined style={{ fontSize: '16px' }} /> :
                                    item.status === 2 ? <CheckCircleOutlined style={{ fontSize: '16px' }} /> :
                                        item.status === 3 ?
                                            <CloseCircleOutlined style={{ fontSize: '16px' }} /> :
                                            <InfoCircleOutlined style={{ fontSize: '16px' }} />
                            }>
                            {
                                item.is_group !== undefined ?
                                    <Popover placement="top" title="教师详细" content={
                                        <div>
                                            {
                                                item.group ?
                                                    item.group.map((review: any) => (
                                                        <div>
                                                            {`${review.user} : `}
                                                            <Tag color={
                                                                review.status === 1 ? "processing" :
                                                                    review.status === 2 ? "success" :
                                                                        review.status === 3 ?
                                                                            "error" : "default"
                                                            }>
                                                                {getType(review.status) ?? review.status}
                                                            </Tag>
                                                        </div>
                                                    )) :
                                                    <div>
                                                        {`${item.user} : `}
                                                        <Tag color={
                                                            item.status === 1 ? "processing" :
                                                                item.status === 2 ? "success" :
                                                                    item.status === 3 ?
                                                                        "error" : "default"
                                                        }>
                                                            {getType(item.status) ?? item.status}
                                                        </Tag>
                                                    </div>
                                            }
                                        </div>
                                    }>
                                        {`${item.user_name} : `}
                                    </Popover> : <span>{`${item.user_name} : `}</span>
                            }
                            <Tag color={
                                item.status === 1 ? "processing" :
                                    item.status === 2 ? "success" :
                                        item.status === 3 ?
                                            "error" : "default"
                            }>
                                {getType(item.status) ?? item.status}
                            </Tag>
                        </Timeline.Item>
                    ))
                }
            </Timeline>
        </div>
    )
};

export default ReviewTimestamp;