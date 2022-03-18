import { Select, Space } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { useEffect, useRef, useState } from 'react';
import AdminEchartOption from '../../config/admin-echarts';
import style from './admin-progress-count.module.css';
import axios from '../../http';

const AdminProgressCount = () => {
    const echartsRef = useRef<any>();
    const [grade, setGrade] = useState("-1");
    const [gradeList, setGradeList] = useState<string[]>([]);

    useEffect(() => {
        getGradeList();
    }, []);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [grade]);

    const fetchData = async () => {
        const res: any = await axios.get(`/api/admin/process/count/${grade}`);
        const { count } = res;
        AdminEchartOption.series[0].data = count;
        const chart = echartsRef.current.getEchartsInstance();
        chart.setOption(AdminEchartOption);
    };

    const getGradeList = async () => {
        const res: any = await axios.get('/api/util/get_grade');
        const { grades } = res;
        setGradeList(grades);
    };

    const handleChangeSelect = (value: any) => {
        setGrade(value);
    };

    return (
        <div className={style.echarts}>
            <Space className={style.select}>
                <span>选择年级:</span>
                <Select style={{ width: 150 }}
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