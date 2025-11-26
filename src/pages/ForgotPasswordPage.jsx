import { useState } from "react";
import { Input, Button, Form, message, Result } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setEmailSent(true);
            toast.success("Email khôi phục mật khẩu đã được gửi!", {
                position: "bottom-right",
            });
        } catch (error) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại!", {
                position: "bottom-right",
            });
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <Result
                        status="success"
                        title="Email đã được gửi!"
                        subTitle="Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư và làm theo hướng dẫn."
                        extra={[
                            <Button
                                type="primary"
                                key="login"
                                className="bg-blue-600"
                            >
                                <Link to="/login">Quay lại đăng nhập</Link>
                            </Button>,
                            <Button
                                key="resend"
                                onClick={() => setEmailSent(false)}
                            >
                                Gửi lại email
                            </Button>,
                        ]}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
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
                        Quên mật khẩu?
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn khôi
                        phục mật khẩu
                    </p>
                </div>

                {/* Form */}
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    className="space-y-6"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                        ]}
                    >
                        <Input
                            size="large"
                            prefix={<MailOutlined className="text-gray-400" />}
                            placeholder="Địa chỉ email"
                            className="rounded-lg h-12"
                        />
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 rounded-lg h-12 font-medium"
                        >
                            Gửi email khôi phục
                        </Button>
                    </Form.Item>
                </Form>

                {/* Back to Login */}
                <div className="text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                        <ArrowLeftOutlined className="mr-2" />
                        Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}
