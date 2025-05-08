import React, { useState, useEffect } from "react";
import EditProfileForm from "../../Profile/EditProfileForm";
import ProfileInfo from "../../Profile/ProfileInfo";
import Loading from "../../components/common/Loading";
import { FaUserCircle } from "react-icons/fa"; // Icon đại diện người dùng
import toast from "react-hot-toast";

interface User {
  accountId: string;
  fullName: string;
  birthday: string;
  gender: string;
  email: string;
  homeAddress: string;
  officeAddress: string;
  nationality: string;
  avatar: string;
  avatarFile: File | null;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 👈 loading state

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
              </div>) : isEditing ? (
                user && <EditProfileForm user={user} setUser={setUser} setIsEditing={setIsEditing} />
              ) : (
              user && <ProfileInfo user={user} setIsEditing={setIsEditing} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
