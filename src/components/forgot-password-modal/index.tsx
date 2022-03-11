import { Steps, Button, message, Form, Input } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    KeyOutlined,
    LockOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import style from './forgot-password-modal.module.css';

const ForgotPasswordModal = (props: any) => {
    const { handleClose } = props;
    const [form] = Form.useForm();
    const [current, setCurrent] = useState(0);
    const [email, setEmail] = useState("");
    const [count, setCount] = useState(60);
    const [isClick, setIsClick] = useState(false);

    useEffect(() => {
        if (isClick) {
            setTimeout(() => {
                if (count - 1 < 0) {
                    setCount(60);
                    setIsClick(false);
                } else {
                    setCount(count - 1);
                }
            }, 1000);
        }
    }, [isClick, count]);

    const handleBlurId = (e: any) => {
        const user_id = e.target.value;
        console.log(user_id);

        const email = "1131155106@qq.com";

        form.setFieldsValue({
            email,
        });
        setEmail(email);
    };

    const handleClickSendCode = () => {
        console.log("send...");
        setIsClick(true);
    };

    const handleClickNext = (value: any) => {
        console.log(value);
        setCurrent(current + 1);
    };

    const handleClickFinish = (value: any) => {
        console.log(value);
        message.success('重置密码完成!');
        handleClose();
    };

    return (
        <div className={style.main}>
            <Steps current={current}>
                <Steps.Step key="0" title="验证邮箱" />
                <Steps.Step key="1" title="重置密码" />
            </Steps>
            <div className={style.modal_content}>
                {
                    current === 0 &&
                    <div>
                        <Form form={form} onFinish={handleClickNext}>
                            <Form.Item
                                name="user_id"
                                rules={[
                                    { required: true, message: '请输入学号/教职工号/管理员号!' },
                                ]}
                            >
                                <Input
                                    size="large"
                                    prefix={<UserOutlined />}
                                    placeholder="请输入学号/教职工号/管理员号"
                                    onBlur={handleBlurId} />
                            </Form.Item>
                            <div className={style.email_part}>
                                <Form.Item name="email" className={style.email_input}>
                                    <Input
                                        size="large"
                                        prefix={<MailOutlined />}
                                        disabled
                                    />
                                </Form.Item>
                                <Button type="primary" size="large"
                                    disabled={isClick || email === ""}
                                    onClick={handleClickSendCode} >
                                    {
                                        isClick ?
                                            `${count} 秒后重新发送` : "发送验证码"
                                    }
                                </Button>
                            </div>
                            <Form.Item
                                name="email_code"
                                rules={[
                                    { required: true, message: '请输入邮箱验证码!' },
                                ]}
                            >
                                <Input
                                    size="large"
                                    prefix={<KeyOutlined />} placeholder="请输入邮箱验证码" />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    className={style.modal_btn} type="primary"
                                    htmlType="submit">
                                    下一步
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                }
                {
                    current === 1 &&
                    <div>
                        <Form onFinish={handleClickFinish}>
                            <Form.Item
                                name="pswd"
                                rules={[
                                    { required: true, message: '请输入重置密码!' },
                                    { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/, message: "密码必须包含数字和字母，长度在6-18位" }
                                ]}
                                hasFeedback
                            >
                                <Input.Password
                                    size="large"
                                    prefix={<LockOutlined />} placeholder="请输入重置密码" />
                            </Form.Item>
                            <Form.Item
                                name="pswd_again"
                                rules={[
                                    { required: true, message: '请再次输入重置密码!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('pswd') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('两次密码不一样!'));
                                        },
                                    }),
                                ]}
                                hasFeedback
                            >
                                <Input.Password
                                    size="large"
                                    prefix={<LockOutlined />}
                                    placeholder="请再次输入重置密码"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    className={style.modal_btn} type="primary"
                                    htmlType="submit">
                                    完成
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                }
            </div>
        </div>
    )
};

export default ForgotPasswordModal;