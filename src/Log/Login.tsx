import React from 'react';
import "../style/Login.css"
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { Link } from "react-router-dom";
// import { div } from 'framer-motion/client';
// import Card from 'antd/es/card/Card';
// import Register from './Register';

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const Login: React.FC = () => {
    return (
        <div className='flex justify-center item-center h-screen bg-gray-100'>
            <h1 className='title markazi-text-uniquifier' style={{ textAlign: "center", fontSize: "50px" }}>Đăng nhập</h1>
            <Form
                name="basic"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className='form-login'
            >

                <Form.Item<FieldType>
                    label="Tên đăng nhập"
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}
                    className='input-username'
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
                    <Checkbox>Ghi nhớ mật khẩu</Checkbox>
                </Form.Item>
                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" style={{ backgroundColor: "green" }}>
                        Đăng nhập
                    </Button>
                </Form.Item>
                <div className='register'>
                    Chưa có tài khoản?{" "}
                    <Link to="/register"> Đăng ký ngay</Link>
                </div>
            </Form>
        </div>
    );
};

export default Login;