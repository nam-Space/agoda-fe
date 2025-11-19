import { Avatar, Button, DatePicker, Input, Modal, Select, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import dayjs from "dayjs";
import { GENDER_VI } from "constants/gender";
import { getUserAvatar } from "utils/imageUrl";
import { toast } from "react-toastify";
import { callUploadSingleImage } from "config/api";
import { v4 as uuidv4 } from "uuid";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { callUpdateUser } from "config/api";
import Cookies from "js-cookie";
import { callRefreshToken } from "config/api";
import { fetchAccount } from "../../redux/slice/accountSlide";

const Profile = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.account.user);

    const [action, setAction] = useState("view");

    const [form, setForm] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        birthday: "",
        phone_number: "",
        gender: "",
        avatar: "",
    });

    const [loadingUpload, setLoadingUpload] = useState(false);
    const [dataAvatar, setDataAvatar] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    useEffect(() => {
        setForm({
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            birthday: user.birthday,
            phone_number: user.phone_number,
            gender: user.gender,
        });
        setDataAvatar([
            {
                uid: uuidv4(),
                name: `${process.env.REACT_APP_BE_URL}${user.avatar}`,
            },
        ]);
    }, [user]);

    const handleRemoveFile = (_) => {
        setDataAvatar([]);
    };

    const handlePreview = async (file) => {
        if (!file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(
                file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
            );
            return;
        }
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(
                file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
            );
        });
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (_) => {
        return true;
    };

    const handleChange = (info) => {
        if (info.file.status === "uploading") {
            setLoadingUpload(true);
        }
        if (info.file.status === "done") {
            setLoadingUpload(false);
        }
        if (info.file.status === "error") {
            setLoadingUpload(false);
            toast.error("Đã có lỗi xảy ra khi upload file.", {
                position: "bottom-right",
            });
        }
    };

    const handleUploadFileLogo = async ({ file, onSuccess, onError }) => {
        const res = await callUploadSingleImage({ file, type: "user" });
        if (res?.isSuccess) {
            setDataAvatar([
                {
                    name: `${process.env.REACT_APP_BE_URL}${res.data.image_url}`,
                    uid: uuidv4(),
                },
            ]);
            if (onSuccess) onSuccess("ok");
        } else {
            if (onError) {
                setDataAvatar([]);
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };

    const handleSubmit = async () => {
        const res = await callUpdateUser(user.id, {
            ...form,
            avatar: dataAvatar[0]?.name?.replaceAll(
                `${process.env.REACT_APP_BE_URL}`,
                ""
            ),
        });
        if (res.isSuccess) {
            const refresh_token_agoda = Cookies.get("refresh_token_agoda");
            const resTmp = await callRefreshToken({
                refresh: refresh_token_agoda,
            });

            if (resTmp.data) {
                localStorage.setItem("access_token_agoda", resTmp.data.access);
                dispatch(fetchAccount());
                setAction("view");
                toast.success("Cập nhật user thành công", {
                    position: "bottom-right",
                });
            }
        }
    };

    return (
        <div>
            <h1 className="text-[24px] font-semibold">Thông tin người dùng</h1>
            <div
                style={{
                    backgroundImage:
                        action === "view"
                            ? "linear-gradient(90deg, #ffcc7b, #ffd899)"
                            : "none",
                }}
                className="flex items-center shadow-[0_4px_10px_0_rgba(0,0,0,0.1)] gap-[20px] bg-white mt-[20px] px-[20px] py-[24px]"
            >
                {action === "view" ? (
                    <>
                        <Avatar
                            size="large"
                            src={getUserAvatar(user.avatar)}
                        ></Avatar>
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <p>Họ và tên</p>
                                <p>
                                    {user.last_name} {user.first_name}
                                </p>
                            </div>
                            <p
                                onClick={() => setAction("edit")}
                                className="cursor-pointer font-semibold"
                            >
                                Chỉnh sửa
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-end gap-[30px] w-full">
                        <div className="grid grid-cols-2 gap-[20px] w-full">
                            <div>
                                <p>Ảnh đại diện</p>
                                <Upload
                                    name="image"
                                    listType="picture-card"
                                    className="image-uploader mt-[5px]"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileLogo}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onRemove={(file) => handleRemoveFile(file)}
                                    onPreview={handlePreview}
                                    defaultFileList={[
                                        {
                                            uid: uuidv4(),
                                            name: user?.avatar ?? "",
                                            status: "done",
                                            url: getUserAvatar(user.avatar),
                                        },
                                    ]}
                                >
                                    <div>
                                        {loadingUpload ? (
                                            <LoadingOutlined />
                                        ) : (
                                            <PlusOutlined />
                                        )}
                                        <div style={{ marginTop: 8 }}>
                                            Tải ảnh lên
                                        </div>
                                    </div>
                                </Upload>
                            </div>
                            <div>
                                <p>Tên</p>
                                <Input
                                    placeholder="Nhập tên"
                                    className="mt-[5px]"
                                    value={form.first_name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            first_name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <p>Họ</p>
                                <Input
                                    placeholder="Nhập họ"
                                    className="mt-[5px]"
                                    value={form.last_name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            last_name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <p>Số điện thoại</p>
                                <Input
                                    placeholder="Nhập họ"
                                    className="mt-[5px]"
                                    value={form.phone_number}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone_number: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <p>Ngày sinh</p>
                                <DatePicker
                                    className="mt-[5px] w-full"
                                    placeholder="Chọn ngày sinh"
                                    value={
                                        form.birthday
                                            ? dayjs(form.birthday)
                                            : null
                                    }
                                    onChange={(val) =>
                                        setForm({
                                            ...form,
                                            birthday: val
                                                ? dayjs(val).format(
                                                      "YYYY-MM-DD"
                                                  )
                                                : null,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <p>Giới tính</p>
                                <Select
                                    value={form.gender}
                                    className="mt-[5px] w-full"
                                    onChange={(val) =>
                                        setForm({
                                            ...form,
                                            gender: val,
                                        })
                                    }
                                    allowClear
                                    options={Object.entries(GENDER_VI).map(
                                        ([value, label]) => {
                                            return {
                                                label: label,
                                                value: value,
                                            };
                                        }
                                    )}
                                    placeholder="select it"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-[10px]">
                            <Button onClick={() => setAction("view")}>
                                Hủy
                            </Button>
                            <Button type="primary" onClick={handleSubmit}>
                                Cập nhật
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <div className="shadow-[0_4px_10px_0_rgba(0,0,0,0.1)] bg-white mt-[20px] px-[20px] py-[24px]">
                <p className="font-semibold">Email</p>
                <p>{user.email}</p>
            </div>
            <div className="shadow-[0_4px_10px_0_rgba(0,0,0,0.1)] bg-white mt-[20px] px-[20px] py-[24px]">
                <p className="font-semibold">Số điện thoại</p>
                <p>+84{user?.phone_number?.substring(1)}</p>
            </div>
            <div className="shadow-[0_4px_10px_0_rgba(0,0,0,0.1)] bg-white mt-[20px] px-[20px] py-[24px]">
                <p className="font-semibold">Ngày sinh</p>
                <p>
                    {user.birthday && dayjs(user.birthday).format("YYYY-MM-DD")}
                </p>
            </div>
            <div className="shadow-[0_4px_10px_0_rgba(0,0,0,0.1)] bg-white mt-[20px] px-[20px] py-[24px]">
                <p className="font-semibold">Giới tính</p>
                <p>{GENDER_VI[user.gender]}</p>
            </div>
            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
                style={{ zIndex: 50 }}
            >
                <img
                    alt="userImg"
                    style={{ width: "100%", objectFit: "cover" }}
                    width={500}
                    height={500}
                    src={previewImage}
                />
            </Modal>
        </div>
    );
};

export default Profile;
