import { ProfileInfoProps } from "../CreateForm/Product/types";
import React from "react";
import { useNavigate } from "react-router-dom"; // import hook điều hướng

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, setIsEditing }) => {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();
  const navigate = useNavigate(); // khởi tạo navigate

  return (
    <>
      <div className="flex justify-center mb-6">
        <img
          src={user?.avatar || "https://via.placeholder.com/150"}
          alt="Avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500"
        />
      </div>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{user?.fullName || "John Doe"}</h1>
        <p className="text-lg text-gray-400">{user?.email || "example@example.com"}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Ngày sinh:</span>
          <span>{user?.birthday ? formatDate(user.birthday) : "N/A"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Giới tính:</span>
          <span>{user?.gender || "N/A"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Địa chỉ nhà:</span>
          <span>{user?.homeAddress || "N/A"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Địa chỉ công ty:</span>
          <span>{user?.officeAddress || "N/A"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Quốc tịch:</span>
          <span>{user?.nationality || "N/A"}</span>
        </div>
      </div>

      <div className="mt-8 flex justify-center space-x-4">
      <button
          className="bg-gray-300 text-black px-6 py-2 rounded-full hover:bg-gray-200 transition"
          onClick={() => navigate("/")}
        >
          Trang chủ
        </button>
        <button
          className="bg-yellow-500 text-black px-6 py-2 rounded-full hover:bg-yellow-400 transition"
          onClick={() => setIsEditing(true)}
        >
          Sửa thông tin
        </button>
      </div>
    </>
  );
};

export default ProfileInfo;
