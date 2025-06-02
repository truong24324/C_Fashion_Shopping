🛍️ C_Fashion_Shopping
C_Fashion_Shopping là hệ thống thương mại điện tử hiện đại chuyên về sản phẩm thời trang, cung cấp đầy đủ chức năng cho cả người dùng và quản trị viên. Hệ thống gồm cả frontend và backend, cho phép người dùng duyệt, lọc và mua sắm sản phẩm, đồng thời cung cấp giao diện quản trị mạnh mẽ để quản lý hệ thống.

🖥️ Công nghệ sử dụng
Frontend:
⚛️ ReactJS

🌀 Tailwind CSS

🟦 TypeScript

📄 HTML/CSS

Backend:
☕ Java 21 (Spring Boot)

🔐 Spring Security, JWT

📄 Swagger (API Docs)

💳 MoMo Payment Integration

Database:
🛢️ Microsoft SQL Server (T-SQL)

⚙️ Hướng dẫn cài đặt
1. Yêu cầu hệ thống
Java Development Kit (JDK) 21

Node.js & npm

Microsoft SQL Server

2. Cài đặt cơ sở dữ liệu
Mở SQL Server Management Studio

Chạy file Manage.sql để tạo cấu trúc cơ sở dữ liệu

Chạy file ManageData.sql để thêm dữ liệu mẫu

3. Cài đặt Backend
bash
Copy
Edit
cd Backend/
# Sử dụng IDE như IntelliJ hoặc chạy lệnh:
./mvnw spring-boot:run
4. Cài đặt Frontend
bash
Copy
Edit
cd Frontend/
npm install
npm start
✅ Tính năng hệ thống
👥 Người dùng
Đăng ký / Đăng nhập với JWT

Quản lý tài khoản, đổi mật khẩu

Duyệt & tìm kiếm sản phẩm

Lọc nâng cao: màu sắc, kích cỡ, chất liệu, danh mục, thương hiệu, bảo hành

Thêm sản phẩm vào giỏ hàng

Thanh toán trực tuyến qua MoMo

Quản lý & xem lịch sử đơn hàng

Đánh giá sản phẩm, bao gồm văn bản và hình ảnh

👨‍💼 Quản trị viên
Quản lý người dùng:

Phân quyền (roles)

Khóa/mở khóa tài khoản

Thống kê lượt đăng nhập

Quản lý sản phẩm:

Tạo / sửa / xoá sản phẩm

Quản lý hình ảnh, màu sắc, kích thước, thương hiệu

Quản lý danh mục, thương hiệu, chất liệu, nhà cung cấp

Quản lý đơn hàng:

Theo dõi trạng thái đơn (đang xử lý, đang giao, hoàn tất, huỷ)

Quản lý mã giảm giá

Dashboard thống kê:

Doanh thu

Số đơn hàng

Người dùng

🛡️ Tài khoản admin mặc định:
Email: admin@example.com
Mật khẩu: admin123
