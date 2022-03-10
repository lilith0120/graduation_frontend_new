import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Avatar, Tooltip } from 'antd';
// import { UserOutlined } from '@ant-design/icons';
import LogoHeader from '../../assets/images/logo_header.png';
import style from './header.module.css';

const Header = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("用户");
    const [userAvatar, setUserAvatar] = useState("");

    useEffect(() => {
        const name = localStorage.getItem("name");
        const avatar = localStorage.getItem("avatar");
        if (name) {
            setUserName(name);
        }

        if (avatar) {
            setUserAvatar(avatar);
        }
    }, []);

    const handleClickLogout = () => {
        localStorage.clear();
        navigate("/", { replace: true });
    };

    return (
        <div className={style.header}>
            <div className={style.logo}>
                <img src={LogoHeader} alt="头部logo" />
            </div>
            <div className={style.user_msg}>
                <div>
                    {userName}
                </div>
                <Tooltip placement="bottomRight" title="退出登录">
                    <div onClick={handleClickLogout}>
                        {
                            userAvatar ?
                                <Avatar
                                    style={{ backgroundColor: '#fff' }}
                                    src={userAvatar} /> :
                                <Avatar>{userName[0]}</Avatar>
                        }
                    </div>
                </Tooltip>
            </div>
        </div>
    )
};

export default Header;