import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import {
    PieChartOutlined,
    ContactsOutlined,
    SolutionOutlined,
    BarsOutlined,
    TeamOutlined,
    ApartmentOutlined,
    CarryOutOutlined,
} from '@ant-design/icons';
import style from './side.module.css';
import roles from '../../config/role';

const Side = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [role, setRole] = useState(roles.STUDENT);
    const [selected, setSelected] = useState("");

    useEffect(() => {
        let userRole: any = localStorage.getItem("role") ?? roles.STUDENT;
        setRole(parseInt(userRole));
    }, []);

    useEffect(() => {
        setSelected(location.pathname);
    }, [location]);

    const handleClickGoItem = (item: any) => {
        const { key } = item;
        navigate(key, { replace: true });
        sessionStorage.clear();
    };

    return (
        <div className={style.side}>
            <Menu theme="dark" selectedKeys={[selected]} mode="inline" onClick={handleClickGoItem}>
                <Menu.Item key="/progress-count" icon={<PieChartOutlined />}>
                    进度统计
                </Menu.Item>
                {
                    role === roles.STUDENT &&
                    <Menu.Item key="/submit-list" icon={<BarsOutlined />}>
                        提交列表
                    </Menu.Item>
                }
                {
                    role !== roles.ADMIN &&
                    <Menu.Item key="/basic-message" icon={<ContactsOutlined />}>
                        基本信息
                    </Menu.Item>
                }
                {
                    role !== roles.STUDENT &&
                    <Menu.Item key="/student-list" icon={<SolutionOutlined />}>
                        学生列表
                    </Menu.Item>
                }
                {
                    role === roles.ADMIN &&
                    <Menu.Item key="/teacher-list" icon={<TeamOutlined />}>
                        指导教师列表
                    </Menu.Item>
                }
                {
                    role !== roles.STUDENT &&
                    <Menu.Item key="/process" icon={<ApartmentOutlined />}>
                        毕业设计流程
                    </Menu.Item>
                }
                {
                    role === roles.TEACHER &&
                    <Menu.Item key="/review-list" icon={<CarryOutOutlined />}>
                        审核列表
                    </Menu.Item>
                }
            </Menu>
        </div>
    )
};

export default Side;