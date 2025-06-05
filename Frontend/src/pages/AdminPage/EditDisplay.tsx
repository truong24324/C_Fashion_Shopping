import React, { useEffect, useState, useRef } from "react"; 
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Avatar,
  Skeleton,
  Card,
} from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import toast from "react-hot-toast";
import moment from "moment";

const { Option } = Select;

interface JwtPayload {
  accountId: string;
}

const EditDisplay: React.FC = () => {
  const [form] = Form.useForm();
  const [loadingData, setLoadingData] = useState(true);      // Loading khi fetch dữ liệu user
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Loading khi submit form
  const [user, setUser] = useState<any>(null);
  const accountId = (jwtDecode(localStorage.getItem("token") || "") as JwtPayload)
    .accountId;

  const nationalities = [
    "Việt Nam",
    "Hoa Kỳ",
    "Anh",
    "Pháp",
    "Nhật Bản",
    "Hàn Quốc",
    "Trung Quốc",
    "Đức",
    "Úc",
    "Canada",
  ];

  // State và ref để quản lý avatar file và preview
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoadingData(true);
        const res = await axios.get("/api/information/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = res.data.data;

        if (data.birthday) {
          data.birthday = moment(data.birthday);
        }

        setUser(data);
        form.setFieldsValue(data);

        if (data.avatar) {
          setAvatarPreview(data.avatar);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Lỗi khi tải thông tin cá nhân");
      } finally {
        setLoadingData(false);
      }
    };

    fetchUserInfo();
  }, [form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleAvatarDoubleClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoadingSubmit(true);
      const formData = new FormData();

      formData.append("fullName", values.fullName || "");
      formData.append("phone", values.phone || "");
      formData.append("gender", values.gender || "");
      formData.append(
        "birthday",
        values.birthday ? values.birthday.toISOString() : ""
      );
      formData.append("homeAddress", values.homeAddress || "");
      formData.append("officeAddress", values.officeAddress || "");
      formData.append("nationality", values.nationality || "");

      if (avatarFile) {
        formData.append("avatarFile", avatarFile);
      }

      await axios.put(`/api/information/${accountId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Cập nhật thông tin thành công");

      // Reload lại dữ liệu mới sau khi cập nhật thành công
      const res = await axios.get("/api/information/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = res.data.data;
      if (data.birthday) data.birthday = moment(data.birthday);
      setUser(data);
      form.setFieldsValue(data);
      if (data.avatar) setAvatarPreview(data.avatar);

      setAvatarFile(null); // Reset avatar file sau cập nhật thành công
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingData || !user) {
    return <Skeleton active avatar paragraph={{ rows: 8 }} />;
  }

  return (
    <div className="max-w mx-auto mt-8 px-4">
      <Card
        className="pt-2 rounded-2xl shadow"
        title={
          <div className="flex items-center gap-4">
            <div onDoubleClick={handleAvatarDoubleClick} className="cursor-pointer">
              <Avatar
                size={64}
                icon={<UserOutlined />}
                src={avatarPreview || undefined}
              />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
            />
            <div>
              <div className="text-xl font-semibold">{user.fullName}</div>
              <div className="text-gray-500">{user.role}</div>
            </div>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Form.Item label="Mã người dùng" name="userCode">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input prefix={<MailOutlined />} disabled />
            </Form.Item>

            <Form.Item label="Vai trò" name="role">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone">
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>

            <Form.Item label="Họ và tên" name="fullName">
              <Input />
            </Form.Item>

            <Form.Item label="Giới tính" name="gender">
              <Select>
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
                <Option value="Không xác định">Không xác định</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Ngày sinh" name="birthday">
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item label="Quốc tịch" name="nationality">
              <Select>
                {nationalities.map((nation) => (
                  <Option key={nation} value={nation}>
                    {nation}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Địa chỉ nhà" name="homeAddress">
              <Input />
            </Form.Item>

            <Form.Item label="Địa chỉ công ty" name="officeAddress">
              <Input />
            </Form.Item>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={loadingSubmit}
              disabled={loadingSubmit}
            >
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EditDisplay;
