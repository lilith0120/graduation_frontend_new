import { useNavigate } from 'react-router-dom';
import { Button, message, Form, Input, Modal, Tooltip } from 'antd';
import { useState } from 'react';
import {
    // QqOutlined,
    UserOutlined,
    LockOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import logoHome from '../assets/images/logo_home.png';
import styles from '../assets/styles/index.module.css';

import ForgotPasswordModal from '../components/forgot-password-modal';

const Login = () => {
    const adminEmail = "3428098215@qq.com";
    // const appId = "101993258";
    // const redirectUrl = "http://my-graduation-project.com/progress-count";
    // const state = "mygraduationproject";

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    // const handleLoginClick = () => {
    //     const loginUrl =
    //         `https://graph.qq.com/oauth2.0/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUrl)}&state=${state}&response_type=code`;
    //     window.location.href = loginUrl;
    // };

    const handleCopyClick = () => {
        copy(adminEmail);
        message.success(`成功复制邮箱${adminEmail}`);
    };

    const handleClickShowModal = () => {
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const handleSubmit = (value: any) => {
        console.log(value);
        navigate('/progress-count', { replace: true });
    };

    return (
        <div className={styles.login}>
            <div className={styles.logo}>
                <img src={logoHome} alt="登陆页logo" width={400} height={400} />
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={styles.header_content}>
                        欢迎使用
                    </span>
                </div>
                {/* <div className={styles.login_btn}>
                    <Button
                        className={styles.login_btn_content}
                        type="primary"
                        icon={<QqOutlined />}
                        size="large"
                        onClick={handleLoginClick}>
                        使用QQ账号一键登录
                    </Button>
                </div> */}
                <div className={styles.login_form}>
                    <Form
                        className={styles.login_form_content}
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            name="user_id"
                            rules={[{ required: true, message: '请输入学号/教职工号/管理员号!' }]}
                        >
                            <Input
                                size="large"
                                prefix={<UserOutlined />}
                                placeholder="请输入学号/教职工号/管理员号"
                                suffix={
                                    <Tooltip title="初始密码为学号/教职工号/管理员号，如需修改密码，请点击重置密码">
                                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                    </Tooltip>
                                } />
                        </Form.Item>
                        <Form.Item
                            name="user_pswd"
                            rules={[{ required: true, message: '请输入密码!' }]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined />}
                                placeholder="请输入密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="link" className={styles.forget_pswd}
                                onClick={handleClickShowModal}>
                                重置密码
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                size="large"
                                type="primary" htmlType="submit" className={styles.login_form_btn}>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className={styles.footer}>
                    <span className={styles.footer_title}>公告:</span>
                    <span>如遇登录问题，请发送邮件至
                        <span className={styles.footer_email} onClick={handleCopyClick}>
                            {adminEmail}
                        </span>
                        联系管理员。
                    </span>
                    <div>
                        <a href="https://beian.miit.gov.cn/" rel="noreferrer" target="_blank">
                            闽ICP备2022000218号-1
                        </a>
                    </div>
                </div>
            </div>
            <Modal
                title="重置密码"
                visible={showModal}
                onCancel={handleCancel}
                width={800}
                footer={null}
                destroyOnClose>
                <ForgotPasswordModal handleClose={handleCancel} />
            </Modal>
        </div>
    );
};

export default Login;
