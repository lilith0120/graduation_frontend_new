import { Select, Space } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { useEffect, useRef, useState } from 'react';
import AdminEchartOption from '../../config/admin-echarts';
import style from './admin-progress-count.module.css';

const AdminProgressCount = () => {
    const echartsRef = useRef<any>();
    const [grade, setGrade] = useState("全部");
    const [gradeList, setGradeList] = useState<string[]>([]);

    useEffect(() => {
        getGradeList();
    }, []);

    useEffect(() => {
        fetchData();
    }, [grade]);

    const fetchData = () => {
        const data = [
            { value: 1048, name: '随便整一点11111111111111' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 100, name: 'Video Ads' },
            { value: 200, name: 'part1' },
            { value: 300, name: 'part2' },
            { value: 400, name: 'part3' },
            { value: 500, name: 'part4' },
            { value: 600, name: 'part5' },
        ];

        AdminEchartOption.series[0].data = data;
        const chart = echartsRef.current.getEchartsInstance();
        chart.setOption(AdminEchartOption);
    };

    const getGradeList = () => {
        const gl = ["2016", "2017", "2018"];
        setGradeList(gl);
    };

    const handleChangeSelect = (value: any) => {
        setGrade(value);
    };

    return (
        <div className={style.echarts}>
            <Space className={style.select}>
                <span>选择年级:</span>
                <Select defaultValue="全部" style={{ width: 150 }}
                    value={grade}
                    onChange={handleChangeSelect}>
                    <Select.Option value="-1">全部</Select.Option>
                    {
                        gradeList.map((item, index) => (
                            <Select.Option key={index} value={item}>{item}</Select.Option>
                        ))
                    }
                </Select>
            </Space>
            <ReactEcharts className={style.pie} option={AdminEchartOption} ref={echartsRef} />
        </div>
    )
};

export default AdminProgressCount;