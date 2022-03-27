import { Timeline, Tag } from 'antd';
import { getType } from "../../config/review-status";
import style from './review-timestamp.module.css';

const ReviewTimestamp = (props: any) => {
    const { data } = props;

    return (
        <div className={style.time_viewer}>
            <Timeline mode="left">
                {
                    data.map((item: any, index: any) => (
                        <Timeline.Item key={index} label={item.time}
                            color={
                                item.status === 1 ? "blue" :
                                    item.status === 2 ? "green" :
                                        item.status === 3 ?
                                            "red" : "grey"
                            }>
                            {`${item.user} : `}
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