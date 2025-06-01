

import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import "../style/Register.css"; // File CSS riêng

const Register = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="all" style={{backgroundColor: "#b2bebf", height: "100vh"}}>
      <div className="auth-container">
      {/* Form Đăng Ký */}
      <div className="form-container register">
        <Card className="form-box">
          <h2 className="title">Đăng ký</h2>
          <Form layout="vertical">
            <Form.Item  name="username" rules={[{ required: true }]}>
              <Input className="input" prefix={<UserOutlined />} placeholder="Nhập tên người dùng" />
            </Form.Item>

            <Form.Item  name="email" rules={[{ required: true, type: "email" }]}>
              <Input className="input" prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item  name="password" rules={[{ required: true }]}>
              <Input.Password className="input" prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Button className="submit" type="primary" htmlType="submit" block>
              Đăng ký
            </Button>
          </Form>
        </Card>
      </div>

      {/* Form Đăng Nhập */}
      <div className="form-container login">
        <Card className="form-box">
          <h2 className="title">Đăng nhập</h2>
          <Form layout="vertical">
            <Form.Item  name="username" rules={[{ required: true }]}>
              <Input className="input" prefix={<UserOutlined />} placeholder="Nhập tên người dùng" />
            </Form.Item>

            <Form.Item  name="password" rules={[{ required: true }]}>
              <Input.Password className="input" prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Button className="submit" type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form>
          <Link to="/forgot-password" className="text-blue-500 text-sm forgot-password" style={{paddingTop:"20px"}}>Quên mật khẩu?</Link>
        </Card>
        
      </div>

      {/* Phần che xanh trượt qua lại */}
      <motion.div
        className="auth-slider"
        animate={{ x: isLogin ? "-100%" : "0%" }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
      >
        <h1>{isLogin ? "Chào mừng trở lại!" : "Gia nhập với chúng tôi!"}</h1>
        <p>{isLogin ? "Không có tài khoản?" : "Bạn đã có tài khoản?"}</p>
        <Button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Đăng ký" : "Đăng nhập"}
        </Button>
      </motion.div>
    </div>
    </div>
  );
};
export default Register;

