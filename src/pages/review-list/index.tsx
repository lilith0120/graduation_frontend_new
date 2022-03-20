import { Tabs } from 'antd';
import { useEffect, useState } from "react";
import style from '../../assets/styles/review-list/review-list.module.css';

import LabelHeader from "../../components/label-header";
import ReviewTabContent from "../../components/review-tab-content";

const ReviewList = () => {
    const [activeKey, setActiveKey] = useState("-1");
    const reviewStatus = [
        {
            id: -1,
            title: "全部审核",
        },
        {
            id: 0,
            title: "未审核",
        },
        {
            id: 1,
            title: "审核中",
        },
        {
            id: 2,
            title: "审核通过",
        },
        {
            id: 3,
            title: "审核驳回",
        },
    ];

    useEffect(() => {
        const ak = sessionStorage.getItem("activeKey");
        if (ak) {
            setActiveKey(ak);
        }
    }, []);

    const handleChangeKey = (ak: any) => {
        setActiveKey(ak);
        sessionStorage.setItem("activeKey", ak);
    };

    return (
        <div>
            <LabelHeader label={"审核列表"} />
            <div className={style.tabs}>
                <Tabs activeKey={activeKey} onChange={handleChangeKey}>
                    {
                        reviewStatus.map((item) => (
                            <Tabs.TabPane tab={item.title} key={item.id}>
                                <ReviewTabContent status={item.id} />
                            </Tabs.TabPane>
                        ))
                    }
                </Tabs>
            </div>
        </div>
    )
};

export default ReviewList;