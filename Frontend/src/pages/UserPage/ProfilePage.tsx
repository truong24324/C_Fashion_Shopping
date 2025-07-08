import React, { useState, useEffect } from "react";
import EditProfileForm from "../../components/Profile/EditProfileForm";
import ProfileInfo from "../../components/Profile/ProfileInfoForm";
import Loading from "../../components/common/Loading";
import { FaUserCircle } from "react-icons/fa"; // Icon đại diện người dùng
import toast from "react-hot-toast";
import { User } from "../../components/CreateForm/Product/types";
import ChangePasswordForm from "../../components/Profile/ChangePasswordForm";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 👈 loading state
  const [showChangePassword, setIsChangePassword] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/information/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (data.success) {
          setUser(data.data);
          if (data.data && data.data.fullName) {
            document.title = `C WEB  - ${data.data.fullName}`;
          } else {
            document.title = "C WEB - Profile";
          }
        } else {
          throw new Error(data.message || "Không thể lấy thông tin cá nhân");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tải thông tin cá nhân!");
      } finally {
        setIsLoading(false); // 👈 luôn kết thúc loading
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto py-12">
        <div className="flex justify-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full md:w-2/3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
              <Loading
                text="Đang tải thông tin cá nhân..."
                color="yellow-500"
                size="6xl"
                icon={<FaUserCircle className="text-yellow-500 text-6xl animate-pulse" />} // Icon đại diện người dùng
              />
              </div>
            ) : showChangePassword ? (
              user && <ChangePasswordForm setIsChangePassword={setIsChangePassword} user={user} setUser={function (user: User | null | ((prevUser: User | null) => User | null)): void {
                  throw new Error("Function not implemented.");
                } } setIsEditing={function (editing: boolean): void {
                  throw new Error("Function not implemented.");
                } } />
            ) : isEditing ? (
              user ? <EditProfileForm user={user} setUser={setUser} setIsEditing={setIsEditing} setIsChangePassword={setIsChangePassword} /> : null
            ) : (
              user ? <ProfileInfo user={user} setIsEditing={setIsEditing} setIsChangePassword={setIsChangePassword} setUser={function (user: User | null | ((prevUser: User | null) => User | null)): void {
                      throw new Error("Function not implemented.");
                    } } /> : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
