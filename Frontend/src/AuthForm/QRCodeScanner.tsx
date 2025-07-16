import React, { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const QRCodeScanner: React.FC = () => {
  const qrCodeRegionId = "html5qr-reader";
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const navigate = useNavigate();
  const hasStoppedRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode(qrCodeRegionId);
    html5QrCodeRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          if (hasStoppedRef.current) return;

          try {
            const { accessToken, refreshToken } = JSON.parse(decodedText);
            const decoded: any = jwtDecode(accessToken);
            const roles = decoded.roles.map((r: any) => r.authority);

            localStorage.setItem("token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);
            axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;

            toast.success("Đăng nhập bằng QR thành công!");

            const state = scanner.getState();
            if (state === Html5QrcodeScannerState.SCANNING) {
              await scanner.stop();
              await scanner.clear();
            }

            hasStoppedRef.current = true;

            if (roles.includes("ROLE_Admin") || roles.includes("ROLE_Super_Admin") || roles.includes("ROLE_Manager")) {
              navigate("/admin");
            } else {
              navigate("/");
            }
          } catch (e) {
            toast.error("QR không hợp lệ!");
          }
        },
        (err) => {
          console.warn("QR scan error:", err);
        }
      )
      .catch((err) => {
        toast.error("Không thể khởi động camera: " + err);
      });

    return () => {
      if (!hasStoppedRef.current && html5QrCodeRef.current) {
        const state = html5QrCodeRef.current.getState();
        if (state === Html5QrcodeScannerState.SCANNING) {
          html5QrCodeRef.current
            .stop()
            .then(() => html5QrCodeRef.current?.clear())
            .catch((err) => console.warn("Cleanup stop() failed:", err));
        }
        hasStoppedRef.current = true;
      }
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-semibold mb-4">Quét mã QR để đăng nhập</h2>
      <div id={qrCodeRegionId} className="w-full max-w-sm aspect-square" />
    </div>
  );
};

export default QRCodeScanner;
