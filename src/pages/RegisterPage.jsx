"use client";

import { useEffect, useState } from "react";
import { Input, Button, Form, Checkbox, Divider, message, Select } from "antd";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    GoogleOutlined,
    FacebookOutlined,
} from "@ant-design/icons";
import { FaApple } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { callRegister } from "config/api";
import { ROLE } from "constants/role";
import { toast } from "react-toastify";
import { useAppSelector } from "../redux/hooks";

export default function RegisterPage() {
    const user = useAppSelector((state) => state.account.user);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    if (user?.id) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            const {
                first_name,
                last_name,
                email,
                username,
                phone_number,
                gender,
                password,
            } = values;
            // Simulate API call
            const res = await callRegister({
                first_name,
                last_name,
                email,
                username,
                phone_number,
                gender,
                password,
                role: ROLE.CUSTOMER,
            });
            if (res.isSuccess) {
                toast.success("Đăng ký thành công!", {
                    position: "bottom-right",
                });
                form.resetFields();
                navigate("/login");
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
        message.info(`Đăng ký bằng ${provider}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Side - Image/Illustration */}
            <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-green-600 to-blue-700 relative">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="relative z-10 flex flex-col justify-center items-center h-full text-white p-12">
                    <div className="max-w-md text-center">
                        <h3 className="text-3xl font-bold mb-6">
                            Tham gia cộng đồng Agoda
                        </h3>
                        <p className="text-lg mb-8 opacity-90">
                            Tạo tài khoản để nhận ưu đãi độc quyền, tích điểm
                            thưởng và trải nghiệm dịch vụ tốt nhất
                        </p>
                        <div className="space-y-4 text-left">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <span className="text-sm">💰</span>
                                </div>
                                <span>Ưu đãi độc quyền cho thành viên</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <span className="text-sm">🎁</span>
                                </div>
                                <span>Tích điểm thưởng mỗi lần đặt chỗ</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <span className="text-sm">⚡</span>
                                </div>
                                <span>Đặt chỗ nhanh chóng và dễ dàng</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <span className="text-sm">🔔</span>
                                </div>
                                <span>Thông báo deal hot và giảm giá</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
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
                            Đăng ký tài khoản
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Tạo tài khoản để trải nghiệm dịch vụ tốt nhất
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
                            <span>Đăng ký với Google</span>
                        </Button>

                        <Button
                            size="large"
                            className="w-full flex items-center justify-center space-x-2 border-gray-300 hover:border-blue-400 h-12"
                            onClick={() => handleSocialLogin("Facebook")}
                        >
                            <FacebookOutlined className="text-blue-600 text-lg" />
                            <span>Đăng ký với Facebook</span>
                        </Button>

                        <Button
                            size="large"
                            className="w-full flex items-center justify-center space-x-2 border-gray-300 hover:border-gray-400 h-12"
                            onClick={() => handleSocialLogin("Apple")}
                        >
                            <FaApple className="text-gray-800 text-lg" />
                            <span>Đăng ký với Apple</span>
                        </Button>
                    </div>

                    <Divider>
                        <span className="text-gray-500 text-sm">hoặc</span>
                    </Divider>

                    {/* Register Form */}
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                        className="space-y-4"
                    >
                        <Form.Item
                            name="first_name"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập họ!",
                                },
                                {
                                    min: 2,
                                    message: "Họ phải có ít nhất 2 ký tự!",
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                prefix={
                                    <UserOutlined className="text-gray-400" />
                                }
                                placeholder="Họ"
                                className="rounded-lg h-12"
                            />
                        </Form.Item>

                        <Form.Item
                            name="last_name"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên!",
                                },
                                {
                                    min: 2,
                                    message: "Ttên phải có ít nhất 2 ký tự!",
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                prefix={
                                    <UserOutlined className="text-gray-400" />
                                }
                                placeholder="Tên"
                                className="rounded-lg h-12"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập email!",
                                },
                                {
                                    type: "email",
                                    message: "Email không hợp lệ!",
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                prefix={
                                    <MailOutlined className="text-gray-400" />
                                }
                                placeholder="Địa chỉ email"
                                className="rounded-lg h-12"
                            />
                        </Form.Item>

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
                            name="phone_number"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập số điện thoại!",
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                prefix={
                                    <PhoneOutlined className="text-gray-400" />
                                }
                                placeholder="Số điện thoại"
                                className="rounded-lg h-12"
                            />
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn giới tính!",
                                },
                            ]}
                        >
                            <Select
                                options={[
                                    {
                                        value: "male",
                                        label: "Nam",
                                    },
                                    {
                                        value: "female",
                                        label: "Nữ",
                                    },
                                    {
                                        value: "other",
                                        label: "Khác",
                                    },
                                ]}
                                placeholder={
                                    <div className="flex items-center gap-[6px]">
                                        <GoPeople className="text-gray-400" />
                                        Chọn giới tính
                                    </div>
                                }
                                optionFilterProp="label"
                                className="rounded-lg h-12"
                                prefix
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

                        <Form.Item
                            name="confirmPassword"
                            dependencies={["password"]}
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng xác nhận mật khẩu!",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue("password") === value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                "Mật khẩu xác nhận không khớp!"
                                            )
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={
                                    <LockOutlined className="text-gray-400" />
                                }
                                placeholder="Xác nhận mật khẩu"
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

                        <Form.Item
                            name="agreement"
                            valuePropName="checked"
                            rules={[
                                {
                                    validator: (_, value) =>
                                        value
                                            ? Promise.resolve()
                                            : Promise.reject(
                                                  new Error(
                                                      "Vui lòng đồng ý với điều khoản!"
                                                  )
                                              ),
                                },
                            ]}
                        >
                            <Checkbox>
                                Tôi đồng ý với{" "}
                                <Link
                                    href="/terms"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Điều khoản sử dụng
                                </Link>{" "}
                                và{" "}
                                <Link
                                    href="/privacy"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Chính sách bảo mật
                                </Link>
                            </Checkbox>
                        </Form.Item>

                        <Form.Item
                            name="newsletter"
                            valuePropName="checked"
                            initialValue={true}
                        >
                            <Checkbox>
                                Tôi muốn nhận email về ưu đãi và khuyến mãi từ
                                Agoda
                            </Checkbox>
                        </Form.Item>

                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                className="w-full bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 rounded-lg h-12 font-medium"
                            >
                                Đăng ký tài khoản
                            </Button>
                        </Form.Item>
                    </Form>

                    {/* Switch to Login */}
                    <div className="text-center">
                        <span className="text-gray-600">Đã có tài khoản? </span>
                        <Link
                            to="/login"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Đăng nhập
                        </Link>
                    </div>

                    {/* Terms */}
                    <div className="text-center">
                        <p className="text-xs text-gray-500">
                            Bằng cách đăng ký, bạn đồng ý với{" "}
                            <Link
                                href="/terms"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Điều khoản dịch vụ
                            </Link>{" "}
                            và{" "}
                            <Link
                                href="/privacy"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Chính sách quyền riêng tư
                            </Link>{" "}
                            của Agoda
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
