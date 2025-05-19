GO
USE MANAGE
GO
-- Kiểm tra dữ liệu trong bảng CATEGORIES
SELECT * FROM CATEGORIES;
go
-- Kiểm tra dữ liệu trong bảng SUPPLIERS
SELECT * FROM SUPPLIERS;
go
-- Kiểm tra dữ liệu trong bảng BRANDS
SELECT * FROM BRANDS;
SELECT * FROM ACCOUNTS;
SELECT * FROM Roles;
SELECT * FROM PASSWORD_RESET_REQUESTS
SELECT * FROM INFORMATION
SELECT * FROM BRANDS
SELECT * FROM CATEGORIES
SELECT * FROM SUPPLIERS

ALTER TABLE INFORMATION ALTER COLUMN AVATAR VARCHAR(225);
SELECT * FROM CART
SELECT * FROM CART_DETAILS
DELETE FROM PASSWORD_RESET_REQUESTS WHERE ACCOUNT_ID = 58;
go
select * from discounts
select * from PRODUCT_STATUS

select * from PRODUCTS
SELECT * FROM VARIANTS
select * from PRODUCT_IMAGES
SELECT * FROM COLORS
SELECT * FROM SIZES
SELECT * FROM MATERIALS
SELECT * FROM WISHLISTS
INSERT INTO CATEGORIES (CATEGORY_NAME, DESCRIPTION) 
VALUES 
SELECT * FROM ORDERS
SELECT * FROM ORDER_DETAILS
SELECT * FROM ORDER_HISTORY
SELECT * FROM ORDER_STATUSES
SELECT * FROM PRODUCT_REVIEWS
INSERT INTO ORDER_STATUSES (STATUS_NAME, STEP_ORDER, IS_FINAL, IS_CANCELLABLE)
VALUES 
(N'Chờ xác nhận', 1, 0, 1),
(N'Đang xử lý', 2, 0, 0),
(N'Đang giao hàng', 3, 0, 0),
(N'Đã giao hàng', 4, 1, 0),
(N'Đã hủy', 5, 1, 0);

INSERT INTO ORDERS (ACCOUNT_ID, FULLNAME, EMAIL, PHONE, SHIPPING_ADDRESS, TOTAL_AMOUNT, ORDER_STATUS_ID, PAYMENT_METHOD, PAYMENT_STATUS)
VALUES 
(83, N'Nguyễn Văn A', 'vana@example.com', '0909123456', N'123 Đường A, Quận B, TP.HCM', 1250000, 1, N'COD', 0),
(83, N'Trần Thị B', 'thib@example.com', '0911123456', N'456 Đường B, Quận C, Hà Nội', 890000, 2, N'MoMo', 1);

INSERT INTO COLORS (COLOR_NAME, COLOR_CODE) VALUES
(N'Đỏ', '#FF0000'),
(N'Xanh Dương', '#0000FF'),
(N'Xanh Lá', '#008000'),
(N'Đen', '#000000'),
(N'Trắng', '#FFFFFF'),
(N'Vàng', '#FFFF00'),
(N'Hồng', '#FFC0CB'),
(N'Xám', '#808080'),
(N'Nâu', '#8B4513'),
(N'Tím', '#800080');

INSERT INTO SIZES (SIZE_NAME) VALUES
('XS'),
('S'),
('M'),
('L'),
('XL'),
('XXL'),
('3XL'),
('36EU'),
('38EU'),
('40EU'),
('42EU'),
('6US'),
('8US'),
('10US');

INSERT INTO MATERIALS (MATERIAL_NAME) VALUES
('Cotton'),
('Polyester'),
('Linen'),
('Len'),
('Da'),
('Denim'),
('Nylon'),
(N'Lụa'),
('Satin'),
(N'Thun lạnh'),
(N'Vải đũi'),
(N'Vải bố');

(N'Giày thể thao', N'Giày thể thao các loại, phục vụ cho thể thao và đi chơi.'),
(N'Thời trang nữ', N'Các sản phẩm thời trang dành cho nữ, từ quần áo đến phụ kiện.'),
(N'Thời trang nam', N'Các sản phẩm thời trang dành cho nam giới, quần áo và phụ kiện.'),
(N'Phụ kiện', N'Các phụ kiện thời trang, túi xách, ví, và các sản phẩm đi kèm khác.');

INSERT INTO SUPPLIERS (SUPPLIER_NAME, CONTACT_NAME, PHONE, EMAIL, ADDRESS)
VALUES 
('Công ty TNHH Thời trang ABC', 'Nguyễn Văn A', '0912345678', 'abc@fashion.com', 'Số 1, Đường ABC, Hà Nội'),
('Thương hiệu XYZ', 'Trần Thị B', '0987654321', 'xyz@brand.com', 'Số 5, Đường XYZ, TP.HCM'),
('Nhà cung cấp 123', 'Lê Minh C', '0934567890', '123@supplier.com', 'Số 10, Đường 123, Đà Nẵng');

INSERT INTO BRANDS (BRAND_NAME, LOGO) 
VALUES 
('Nike', 'nike-logo.png'),
('Adidas', 'adidas-logo.png'),
('Puma', 'puma-logo.png'),
('Reebok', 'reebok-logo.png');

INSERT INTO PRODUCT_STATUS (STATUS_NAME, DESCRIPTION) 
VALUES 
    (N'CÓ SẴN', N'Sản phẩm hiện đang có sẵn trong kho'),
    (N'HẾT HÀNG', N'Sản phẩm đã hết hàng và cần nhập thêm'),
    (N'NGỪNG BÁN', N'Sản phẩm đã ngừng kinh doanh'),
    (N'SẮP VỀ', N'Sản phẩm đang trong quá trình nhập hàng và sẽ sớm có sẵn'),
    (N'KHUYẾN MÃI', N'Sản phẩm đang trong chương trình giảm giá hoặc khuyến mãi');
GO

INSERT INTO CATEGORIES (CATEGORY_NAME, DESCRIPTION) VALUES
('Gia dụng', 'Sản phẩm gia đình: bếp, nồi cơm điện, quạt...'),
('Thời trang', 'Giầy, dép, quần áo, phụ kiện thời trang...'),
('Phụ kiện điện thoại', 'Ốp lưng, tai nghe, sạc dự phòng...'),
('Phụ tùng xe', 'Phụ kiện xe máy, ô tô như nhớt, lốp...'),
('Thiết bị điện tử', 'Điện thoại, laptop, tai nghe, máy tính...');
GO

INSERT INTO SUPPLIERS (SUPPLIER_NAME, CONTACT_NAME, PHONE, EMAIL, ADDRESS) VALUES
('Công ty Gia Dụng Việt', 'Nguyễn Văn A', '0901234567', 'giadungviet@gmail.com', '123 Đường 3/2, TP.HCM'),
('Công ty Thời Trang ABC', 'Trần Thị B', '0902345678', 'thoitrangabc@gmail.com', '456 Nguyễn Trãi, Hà Nội'),
('Công ty Phụ Kiện Điện Thoại XYZ', 'Lê Văn C', '0903456789', 'phukienxyz@gmail.com', '789 Lý Thường Kiệt, Đà Nẵng'),
('Công ty Phụ Tùng Xe DEF', 'Phạm Văn D', '0904567890', 'phutungdef@gmail.com', '12 Trần Hưng Đạo, TP.HCM'),
('Công ty Thiết Bị Điện Tử GHI', 'Ngô Thị E', '0905678901', 'thietbighi@gmail.com', '34 Hoàng Diệu, Hà Nội');
GO

INSERT INTO BRANDS (BRAND_NAME, LOGO) VALUES
('Samsung', 'samsung_logo.png'),
('Apple', 'apple_logo.png'),
('Adidas', 'adidas_logo.png'),
('Honda', 'honda_logo.png'),
('Panasonic', 'panasonic_logo.png');
GO

INSERT INTO PRODUCT_STATUS (STATUS_NAME, DESCRIPTION) VALUES
('CÓ SẴN', 'Sản phẩm có sẵn trong kho'),
('HẾT HÀNG', 'Sản phẩm hiện không có sẵn'),
('NGỪNG BÁN', 'Sản phẩm đã ngừng kinh doanh');
GO

INSERT INTO PRODUCTS (PRODUCT_NAME, DESCRIPTION, STATUS_ID, BARCODE, BRAND_ID, MODEL, WARRANTY_PERIOD, CATEGORY_ID, SUPPLIER_ID) VALUES
('Nồi cơm điện Panasonic 1.8L', 'Nồi cơm điện dung tích 1.8L, công nghệ mới.', 1, '1234567890', 5, 'SR-W18G', '12 tháng', 1, 1),
('Áo phông Adidas nam', 'Áo phông thể thao dành cho nam, thoáng khí.', 1, '2234567890', 3, 'Sport T-Shirt', 'Không áp dụng', 2, 2),
('Ốp lưng iPhone 14 Pro Max', 'Ốp lưng silicone bảo vệ điện thoại hiệu quả.', 1, '3234567890', 2, 'Silicone Case', 'Không áp dụng', 3, 3),
('Nhớt xe máy Honda', 'Nhớt chính hãng Honda, bảo vệ động cơ.', 1, '4234567890', 4, 'SPX-1', 'Không áp dụng', 4, 4),
('Laptop Samsung Galaxy Book3', 'Laptop mỏng nhẹ, cấu hình mạnh mẽ.', 1, '5234567890', 1, 'Galaxy Book3', '24 tháng', 5, 5);
GO

INSERT INTO VARIANTS (PRODUCT_ID, VARIANT_TYPE, VARIANT_VALUE, STOCK, PRICE) VALUES
(2, 'Size', 'L', 10, 500000),
(2, 'Size', 'M', 8, 500000),
(3, 'Color', 'Black', 15, 200000),
(3, 'Color', 'Blue', 12, 200000),
(5, 'RAM', '16GB', 5, 25000000);
GO

INSERT INTO SPECIFICATIONS (PRODUCT_ID, SCREEN_SIZE, SCREEN_TYPE, SCREEN_RESOLUTION, PROCESSOR, RAM, ROM, BATTERY, OS) VALUES
(5, '15.6 inch', 'AMOLED', '1920x1080', 'Intel Core i7', '16GB', '512GB', '4000mAh', 'Windows 11');

INSERT INTO ROLES (ROLE_NAME, DESCRIPTION)
VALUES
    ('Admin', 'Quản trị viên hệ thống, có quyền truy cập đầy đủ'),
    ('User', 'Người dùng bình thường, có quyền sử dụng các chức năng cơ bản'),
    ('Customer', 'Khách hàng mua sắm trên hệ thống'),
    ('Manager', 'Quản lý, có quyền truy cập vào một số phần quản trị');
GO
