"use client";

import { useEffect, useState } from "react";
import { Input, Button, Form, Checkbox, Divider, message, Spin } from "antd";
import {
    LockOutlined,
    MailOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    GoogleOutlined,
    FacebookOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { FaApple } from "react-icons/fa";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { callLogin } from "config/api";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setUserLoginInfo } from "../redux/slice/accountSlide";
import { callGetAccount } from "config/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function LoginPage() {
    const location = useLocation();
    const user = useAppSelector((state) => state.account.user);

    const params = new URLSearchParams(location.search);
    const nextUrl = params.get("next") || "/";
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // useEffect(() => {
    //     if (user?.id) {
    //         navigate("/");
    //     }
    // }, [user]);

    if (user?.id) {
        return <Navigate to={nextUrl} replace />;
    }

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const { username, password } = values;
            // Simulate API call
            const res = await callLogin({ username, password });
            if (res.isSuccess) {
                localStorage.setItem("access_token_agoda", res.data.access);
                Cookies.set("refresh_token_agoda", res.data.refresh, {
                    expires: 1,
                });
                const resAccount = await callGetAccount();
                if (resAccount?.isSuccess) {
                    dispatch(setUserLoginInfo(resAccount.data));
                    toast.success("Đăng nhập thành công!", {
                        position: "bottom-right",
                    });
                    navigate(nextUrl, { replace: true });
                }
            } else {
                toast.error(res.message, {
                    position: "bottom-right",
                });
            }
        } catch (error) {
            toast.error(error.message, {
                position: "bottom-right",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        message.info(`Đăng nhập bằng ${provider}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center space-x-2 mb-8"
                        >
                            <div className="flex space-x-1">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                            <span className="font-bold text-2xl text-gray-900">
                                agoda
                            </span>
                        </Link>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Đăng nhập
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Chào mừng bạn quay trở lại!
                        </p>
                    </div>

                    {/* Social Login */}
                    <div className="space-y-3">
                        <Button
                            size="large"
                            className="w-full flex items-center justify-center space-x-2 border-gray-300 hover:border-blue-400 h-12"
                            onClick={() => handleSocialLogin("Google")}
                        >
                            <GoogleOutlined className="text-red-500 text-lg" />
                            <span>Tiếp tục với Google</span>
                        </Button>

                        <Button
                            size="large"
                            className="w-full flex items-center justify-center space-x-2 border-gray-300 hover:border-blue-400 h-12"
                            onClick={() => handleSocialLogin("Facebook")}
                        >
                            <FacebookOutlined className="text-blue-600 text-lg" />
                            <span>Tiếp tục với Facebook</span>
                        </Button>

                        <Button
                            size="large"
                            className="w-full flex items-center justify-center space-x-2 border-gray-300 hover:border-gray-400 h-12"
                            onClick={() => handleSocialLogin("Apple")}
                        >
                            <FaApple className="text-gray-800 text-lg" />
                            <span>Tiếp tục với Apple</span>
                        </Button>
                    </div>

                    <Divider>
                        <span className="text-gray-500 text-sm">hoặc</span>
                    </Divider>

                    {/* Login Form */}
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                        className="space-y-6"
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập username!",
                                },
                                {
                                    type: "username",
                                    message: "Username không hợp lệ!",
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                prefix={
                                    <UserOutlined className="text-gray-400" />
                                }
                                placeholder="Tên đăng nhập"
                                className="rounded-lg h-12"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mật khẩu!",
                                },
                                {
                                    min: 6,
                                    message:
                                        "Mật khẩu phải có ít nhất 6 ký tự!",
                                },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={
                                    <LockOutlined className="text-gray-400" />
                                }
                                placeholder="Mật khẩu"
                                className="rounded-lg h-12"
                                iconRender={(visible) =>
                                    visible ? (
                                        <EyeTwoTone />
                                    ) : (
                                        <EyeInvisibleOutlined />
                                    )
                                }
                            />
                        </Form.Item>

                        <div className="flex items-center justify-between">
                            <Form.Item
                                name="remember"
                                valuePropName="checked"
                                className="mb-0"
                            >
                                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                            </Form.Item>
                            <Link
                                to="/forgot-password"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 rounded-lg h-12 font-medium"
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>

                    {/* Switch to Register */}
                    <div className="text-center">
                        <span className="text-gray-600">
                            Chưa có tài khoản?{" "}
                        </span>
                        <Link
                            to="/register"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Đăng ký ngay
                        </Link>
                    </div>

                    {/* Terms */}
                    <div className="text-center">
                        <p className="text-xs text-gray-500">
                            Bằng cách tiếp tục, bạn đồng ý với{" "}
                            <Link
                                to="/terms"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Điều khoản dịch vụ
                            </Link>{" "}
                            và{" "}
                            <Link
                                to="/privacy"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Chính sách quyền riêng tư
                            </Link>{" "}
                            của Agoda
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Illustration */}
            <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-blue-600 to-purple-700 relative">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="relative z-10 flex flex-col justify-center items-center h-full text-white p-12">
                    <div className="max-w-md text-center">
                        <h3 className="text-3xl font-bold mb-6">
                            Khám phá thế giới cùng Agoda
                        </h3>
                        <p className="text-lg mb-8 opacity-90">
                            Hơn 2 triệu chỗ ở, vé máy bay và hoạt động du lịch
                            với giá tốt nhất trên toàn thế giới
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white bg-opacity-20 rounded-lg p-4">
                                <div className="text-2xl mb-2">🏨</div>
                                <div className="font-semibold">2M+ Chỗ ở</div>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-4">
                                <div className="text-2xl mb-2">✈️</div>
                                <div className="font-semibold">
                                    500+ Hãng bay
                                </div>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-4">
                                <div className="text-2xl mb-2">🎯</div>
                                <div className="font-semibold">
                                    Giá tốt nhất
                                </div>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-4">
                                <div className="text-2xl mb-2">⭐</div>
                                <div className="font-semibold">
                                    25M+ Đánh giá
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
