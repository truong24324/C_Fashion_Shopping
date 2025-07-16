import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react"; // ✅ dùng QRCodeSVG thay vì QRCode
import axios from "axios";
import toast from "react-hot-toast";

const QRCodeGenerator: React.FC = () => {
  const [qrData, setQrData] = useState<string | null>(null);

  useEffect(() => {
    const fetchQRToken = async () => {
      try {
        const res = await axios.post("/auth/qr-login-info", {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const { accessToken, refreshToken } = res.data;
        const payload = JSON.stringify({ accessToken, refreshToken });

        setQrData(payload);
      } catch (error: any) {
        toast.error("Không thể tạo mã QR đăng nhập!");
      }
    };

    fetchQRToken();
  }, []);

  if (!qrData) return <p>Đang tạo mã QR...</p>;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-bold mb-2">Quét mã QR để đăng nhập</h2>
      <QRCodeSVG value={qrData} size={220} />
    </div>
  );
};

export default QRCodeGenerator;
