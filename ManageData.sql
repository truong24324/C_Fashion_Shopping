GO
CREATE DATABASE MANAGE
GO
USE MANAGE
GO

CREATE TABLE ROLES (
    ROLE_ID INT IDENTITY PRIMARY KEY,
    ROLE_NAME NVARCHAR(50) UNIQUE NOT NULL,  -- Tên vai trò nh? 'Admin', 'User', 'Customer'
    DESCRIPTION NVARCHAR(255)               -- Mô t? v? vai trò
);
GO

CREATE TABLE ACCOUNTS ( 
    ACCOUNT_ID INT IDENTITY PRIMARY KEY,         -- Mã tài kho?n, t? ??ng t?ng
    ROLE_ID INT NOT NULL,                         -- Vai trò (User/Admin)
    USER_CODE VARCHAR(50) UNIQUE NOT NULL,        -- Mã tài kho?n duy nh?t
    EMAIL VARCHAR(50) UNIQUE NOT NULL,            -- Email duy nh?t
    PHONE VARCHAR(12) UNIQUE NOT NULL,            -- S? ?i?n tho?i
    PASSWORD NVARCHAR(255) NOT NULL,              -- M?t kh?u (???c mã hóa)
    DEVICE_NAME NVARCHAR(100),                    -- Tên thi?t b?
    LOGIN_TIME DATETIME DEFAULT GETDATE(),        -- Th?i gian ??ng nh?p g?n nh?t
    LOGOUT_TIME DATETIME,                         -- Th?i gian ??ng xu?t
    IP_ADDRESS VARCHAR(50),                       -- ??a ch? IP
    FAILED_LOGIN_ATTEMPTS INT DEFAULT 0,          -- S? l?n ??ng nh?p sai
    CREATED_AT DATETIME DEFAULT GETDATE(),        -- Th?i gian t?o tài kho?n
    UPDATED_AT DATETIME DEFAULT GETDATE(),        -- Th?i gian c?p nh?t tài kho?n
    PASSWORD_CHANGED_AT DATETIME,                 -- Th?i gian thay ??i m?t kh?u
    LOCK_UNTIL DATETIME DEFAULT NULL,             -- Th?i gian khóa t?m th?i
    IS_LOCKED BIT DEFAULT 0,                      -- Tài kho?n có b? khóa không
    IS_ACTIVE BIT DEFAULT 1,                      -- Tài kho?n có ho?t ??ng không
    FOREIGN KEY (ROLE_ID) REFERENCES ROLES(ROLE_ID) -- Khóa ngo?i liên k?t v?i b?ng ROLES
);
GO

CREATE TABLE ACCOUNT_ROLES (
    ACCOUNT_ID INT NOT NULL,
    ROLE_ID INT NOT NULL,
    PRIMARY KEY (ACCOUNT_ID, ROLE_ID),
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID),
    FOREIGN KEY (ROLE_ID) REFERENCES ROLES(ROLE_ID)
);
GO

CREATE TABLE INFORMATION (
    INFORMATION_ID INT IDENTITY PRIMARY KEY,
    ACCOUNT_ID INT NOT NULL UNIQUE,                -- Mỗi tài khoản chỉ có 1 thông tin
    FULLNAME NVARCHAR(100) NOT NULL,               -- Bắt buộc nhập tên đầy đủ
    BIRTHDAY DATE CHECK (BIRTHDAY <= DATEADD(YEAR, -18, GETDATE())), -- Phải >= 18 tuổi
    GENDER NVARCHAR(20), -- Chuẩn hóa giá trị giới tính
    HOME_ADDRESS NVARCHAR(255),                    -- Địa chỉ nhà
    OFFICE_ADDRESS NVARCHAR(255),                  -- Địa chỉ cơ quan
    NATIONALITY NVARCHAR(50) DEFAULT N'Việt Nam', -- Quốc tịch mặc định là Việt Nam
    AVATAR VARCHAR(225),                           -- Đường dẫn ảnh đại diện
    UPDATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP, -- Ngày cập nhật gần nhất
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID)
);
GO

CREATE TABLE PASSWORD_RESET_REQUESTS (
    RESET_REQUEST_ID INT IDENTITY PRIMARY KEY,
    ACCOUNT_ID INT UNIQUE NOT NULL,                -- Liên k?t t?i tài kho?n
    OTP NVARCHAR(20) NOT NULL, -- Mã token khôi ph?c
    EXPIRES_AT DATETIME DEFAULT DATEADD(MINUTE, 15, GETDATE()), -- Th?i ?i?m h?t h?n token
    IS_USED BIT DEFAULT 0,                  -- ?ánh d?u token ?ã ???c s? d?ng hay ch?a
    REQUESTED_AT DATETIME DEFAULT GETDATE(), -- Th?i ?i?m yêu c?u
    MAX_ATTEMPTS INT DEFAULT 5,             -- S? l?n nh?p sai t?i ?a
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID)
);
GO

-- B?ng lo?i s?n ph?m
CREATE TABLE CATEGORIES (
    CATEGORY_ID INT IDENTITY PRIMARY KEY,
    CATEGORY_NAME NVARCHAR(100) UNIQUE NOT NULL,  -- Tên th? lo?i s?n ph?m
    DESCRIPTION NVARCHAR(255)                     -- Mô t? th? lo?i s?n ph?m
);
GO

-- B?ng nhà cung c?p
CREATE TABLE SUPPLIERS (
    SUPPLIER_ID INT IDENTITY PRIMARY KEY,
    SUPPLIER_NAME NVARCHAR(100) UNIQUE NOT NULL,         -- Tên nhà cung c?p
    CONTACT_NAME NVARCHAR(100),                   -- Tên ng??i liên h?
    PHONE NVARCHAR(15),                           -- S? ?i?n tho?i liên h?
    EMAIL NVARCHAR(100),                          -- Email liên h?
    ADDRESS NVARCHAR(255)                         -- ??a ch? c?a nhà cung c?p
);
GO

-- B?ng th??ng hi?u
CREATE TABLE BRANDS (
	BRAND_ID INT IDENTITY(1,1) PRIMARY KEY, 
	BRAND_NAME NVARCHAR(200) UNIQUE NOT NULL,
	LOGO NVARCHAR(100)
);
GO

CREATE TABLE PRODUCT_STATUS (
    STATUS_ID INT IDENTITY PRIMARY KEY,            -- Mã tr?ng thái (khóa chính)
    STATUS_NAME NVARCHAR(50) UNIQUE NOT NULL,              -- Tên tr?ng thái (ví d?: "CÓ S?N", "H?T HÀNG", "NG?NG BÁN")
    DESCRIPTION NVARCHAR(255)                       -- Mô t? v? tr?ng thái
);
GO

CREATE TABLE PRODUCTS (
    PRODUCT_ID INT IDENTITY PRIMARY KEY,         -- Mã sản phẩm (khóa chính)
    PRODUCT_NAME NVARCHAR(255) NOT NULL,         -- Tên sản phẩm
    DESCRIPTION NVARCHAR(1000),                  -- Mô tả sản phẩm
    BARCODE VARCHAR(20) UNIQUE,                  -- Mã vạch
    MODEL NVARCHAR(100),                         -- Mẫu sản phẩm (thêm cho điện tử)
    WARRANTY_PERIOD NVARCHAR(50),                -- Thời gian bảo hành
    
    -- Liên kết với các bảng khác
    CATEGORY_ID INT NOT NULL,                    -- Liên kết với bảng CATEGORIES
    SUPPLIER_ID INT NOT NULL,                    -- Liên kết với bảng SUPPLIERS
    BRAND_ID INT NOT NULL,                       -- Liên kết với bảng BRANDS
    STATUS_ID INT,                               -- Trạng thái (có sẵn, hết hàng, ngừng bán)
    
    -- Thời gian tạo và cập nhật
    CREATED_AT DATETIME DEFAULT GETDATE(),       -- Ngày tạo sản phẩm
    UPDATED_AT DATETIME DEFAULT GETDATE(),       -- Ngày cập nhật sản phẩm

    -- Khóa ngoại
    FOREIGN KEY (CATEGORY_ID) REFERENCES CATEGORIES(CATEGORY_ID),  -- Liên kết với bảng CATEGORIES
    FOREIGN KEY (SUPPLIER_ID) REFERENCES SUPPLIERS(SUPPLIER_ID),   -- Liên kết với bảng SUPPLIERS
    FOREIGN KEY (BRAND_ID) REFERENCES BRANDS(BRAND_ID),             -- Liên kết với bảng BRANDS
    FOREIGN KEY (STATUS_ID) REFERENCES PRODUCT_STATUS(STATUS_ID)    -- Liên kết với bảng PRODUCT_STATUS
);
GO


CREATE TABLE PRODUCT_IMAGES ( 
    IMAGE_ID INT IDENTITY PRIMARY KEY,         -- Mã ảnh
    PRODUCT_ID INT NOT NULL,                   -- Liên kết với bảng sản phẩm
    IMAGE_URL NVARCHAR(500) NOT NULL,          -- Đường dẫn ảnh (tăng độ dài)
    IMAGE_TYPE VARCHAR(10) NOT NULL CHECK (IMAGE_TYPE IN ('MAIN', 'SECONDARY', 'OTHER')), 
    CREATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Thời gian thêm ảnh
    FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID) ON DELETE CASCADE
);
GO

CREATE TABLE COLORS (
    COLOR_ID INT IDENTITY PRIMARY KEY,  -- Mã màu
    COLOR_NAME NVARCHAR(50) UNIQUE NOT NULL,   -- Tên màu (Đỏ, Xanh, Đen...)
    COLOR_CODE NVARCHAR(10) UNIQUE NOT NULL    -- Mã màu HEX (#FF0000, #000000...)
);
GO

CREATE TABLE SIZES (
    SIZE_ID INT IDENTITY PRIMARY KEY, -- Mã kích thước
    SIZE_NAME NVARCHAR(20) UNIQUE NOT NULL   -- Kích thước (S, M, L, XL, 40EU, 10US...)
);
GO

CREATE TABLE MATERIALS (
    MATERIAL_ID INT IDENTITY PRIMARY KEY, -- Mã chất liệu
    MATERIAL_NAME NVARCHAR(50) UNIQUE NOT NULL   -- Tên chất liệu (Cotton, Polyester, Da...)
);
GO

-- B?ng bi?n th? s?n ph?m (thêm cho các lo?i s?n ph?m v?i bi?n th? ??c thù)
CREATE TABLE VARIANTS (
    VARIANT_ID INT IDENTITY PRIMARY KEY, -- Mã biến thể
    PRODUCT_ID INT NOT NULL,             -- Liên kết với sản phẩm
    COLOR_ID INT NULL,                   -- Mã màu (có thể NULL nếu không áp dụng)
    SIZE_ID INT NULL,                    -- Mã kích thước (có thể NULL nếu không áp dụng)
    MATERIAL_ID INT NULL,                 -- Mã chất liệu (có thể NULL nếu không áp dụng)
    STOCK INT DEFAULT 0,                  -- Số lượng tồn kho
    PRICE DECIMAL(18, 2),                 -- Giá của biến thể (nếu khác giá gốc)
    FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID),
    FOREIGN KEY (COLOR_ID) REFERENCES COLORS(COLOR_ID),
    FOREIGN KEY (SIZE_ID) REFERENCES SIZES(SIZE_ID),
    FOREIGN KEY (MATERIAL_ID) REFERENCES MATERIALS(MATERIAL_ID),
	CONSTRAINT UQ_VARIANT UNIQUE (PRODUCT_ID, COLOR_ID, SIZE_ID, MATERIAL_ID) 
);
GO

CREATE TABLE REVIEWS (
    REVIEW_ID INT IDENTITY PRIMARY KEY,          -- Mã ?ánh giá
    ACCOUNT_ID INT NOT NULL,                     -- Liên k?t t?i tài kho?n ng??i dùng
    PRODUCT_ID INT NOT NULL,                     -- Liên k?t t?i s?n ph?m
    RATING INT NOT NULL CHECK (RATING >= 1 AND RATING <= 5), -- ?i?m ?ánh giá t? 1 ??n 5
    REVIEW_TEXT NVARCHAR(1000),                  -- N?i dung ?ánh giá (tu? ch?n)
    CREATED_AT DATETIME DEFAULT GETDATE(),       -- Th?i gian t?o ?ánh giá
    UPDATED_AT DATETIME DEFAULT GETDATE(),       -- Th?i gian c?p nh?t ?ánh giá
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID),  -- Liên k?t v?i b?ng ACCOUNTS
    FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID)   -- Liên k?t v?i b?ng PRODUCTS
);
GO

CREATE TABLE DISCOUNTS (  
    DISCOUNT_ID INT IDENTITY PRIMARY KEY,
    DISCOUNT_CODE NVARCHAR(50) UNIQUE NOT NULL,
    DISCOUNT_VALUE INT,
    DISCOUNT_TYPE NVARCHAR(20) NOT NULL,                      -- Loại: PERCENT, AMOUNT, etc.
    IS_ACTIVE BIT DEFAULT 1 NOT NULL,
    QUANTITY INT NOT NULL DEFAULT 1,
    MAX_USAGE_PER_USER INT,                                  -- Số lần mỗi người dùng
    MIN_ORDER_AMOUNT INT,                                  -- Giá trị đơn hàng tối thiểu
    START_DATE DATETIME NOT NULL,
    END_DATE DATETIME,
    DESCRIPTION NVARCHAR(255),
    CREATED_AT DATETIME DEFAULT GETDATE(),
    UPDATED_AT DATETIME DEFAULT GETDATE()
);
GO

--B?ng yêu thích s?n ph?m
CREATE TABLE WISHLISTS (
    WISHLIST_ID INT IDENTITY PRIMARY KEY,                  -- Mã yêu thích
    ACCOUNT_ID INT NOT NULL,                               -- Liên kết tới tài khoản người dùng
    PRODUCT_ID INT NOT NULL,                               -- Liên kết tới sản phẩm
    CREATED_AT DATETIME DEFAULT GETDATE(),                 -- Thời gian thêm sản phẩm vào yêu thích
	IS_DELETED BIT DEFAULT 0,                               -- Đánh dấu đã xóa (1) hoặc chưa (0)
    CONSTRAINT UQ_WISHLIST_ACCOUNT_PRODUCT UNIQUE (ACCOUNT_ID, PRODUCT_ID), -- Mỗi sản phẩm chỉ được yêu thích 1 lần bởi 1 người dùng
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID),
    FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID)
);
GO

CREATE TABLE CART ( 
    CART_ID INT IDENTITY PRIMARY KEY, 
    ACCOUNT_ID INT NOT NULL,  -- Liên kết tới tài khoản người dùng
    CREATED_AT DATETIME DEFAULT GETDATE(),  -- Thời gian tạo giỏ hàng
    UPDATED_AT DATETIME DEFAULT GETDATE(),  -- Thời gian cập nhật giỏ hàng
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID)
);
GO

CREATE TABLE CART_DETAILS (
    CART_DETAIL_ID INT IDENTITY PRIMARY KEY,
    CART_ID INT NOT NULL,            -- Liên kết tới giỏ hàng
    VARIANT_ID INT NOT NULL,         -- Liên kết tới sản phẩm
    QUANTITY INT NOT NULL DEFAULT 1, -- Số lượng sản phẩm trong giỏ hàng
    PRICE DECIMAL(18, 2) NOT NULL,   -- Giá sản phẩm tại thời điểm thêm vào giỏ
    FOREIGN KEY (CART_ID) REFERENCES CART(CART_ID),
    FOREIGN KEY (VARIANT_ID) REFERENCES VARIANTS(VARIANT_ID),
    CONSTRAINT UQ_CART_PRODUCT UNIQUE (CART_ID, VARIANT_ID) -- Đảm bảo 1 sản phẩm không bị thêm trùng trong cùng một giỏ
);
GO

-- B?ng ORDER (??n hàng)
CREATE TABLE ORDERS (
    ORDER_ID INT IDENTITY PRIMARY KEY,                 -- Mã ??n hàng
    ACCOUNT_ID INT NOT NULL,                           -- Liên k?t ??n ng??i mua
    FULLNAME NVARCHAR(255) NOT NULL,                   -- Tên ng??i mua
    EMAIL NVARCHAR(100),                               -- Email ng??i mua
    PHONE NVARCHAR(15),                                -- S? ?i?n tho?i ng??i mua
    SHIPPING_ADDRESS NVARCHAR(255),                    -- ??a ch? giao hàng
    ORDER_DATE DATETIME DEFAULT GETDATE(),             -- Ngày mua
    TOTAL_AMOUNT DECIMAL(18, 2) NOT NULL,              -- T?ng giá tr? ??n hàng
    STATUS NVARCHAR(50) DEFAULT 'Pending',             -- Tr?ng thái ??n hàng (ví d?: Pending, Completed)
    PAYMENT_METHOD NVARCHAR(50),                       -- Ph??ng th?c thanh toán
    PAYMENT_STATUS NVARCHAR(50),                       -- Tr?ng thái thanh toán
    IS_ACTIVE BIT DEFAULT 1,                           -- Tr?ng thái ??n hàng
    CREATED_AT DATETIME DEFAULT GETDATE(),             -- Ngày t?o ??n hàng
    UPDATED_AT DATETIME DEFAULT GETDATE()              -- Ngày c?p nh?t ??n hàng
	FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID),   -- Liên k?t t?i b?ng ACCOUNTS
);
GO

-- B?ng ORDER_DETAIL (Chi ti?t ??n hàng)
CREATE TABLE ORDER_DETAILS (
    ORDER_DETAIL_ID INT IDENTITY PRIMARY KEY,         -- Mã chi ti?t ??n hàng
    ORDER_ID INT NOT NULL,                             -- Liên k?t t?i b?ng ORDERS
    PRODUCT_NAME NVARCHAR(255) NOT NULL,               -- Tên s?n ph?m (l?u tr?c ti?p thay vì tham chi?u PRODUCT_ID)
	VARIANT_TYPE NVARCHAR(255),						   -- Lo?i bi?n th? (ví d?: Màu s?c, Kích th??c)
	VARIANT_VALUE NVARCHAR(255),					   -- Giá tr? bi?n th? (ví d?: ??, M, XL)
    PRODUCT_PRICE DECIMAL(18, 2) NOT NULL,             -- Giá s?n ph?m t?i th?i ?i?m mua
    QUANTITY INT NOT NULL,                             -- S? l??ng s?n ph?m
    TOTAL_PRICE DECIMAL(18, 2) NOT NULL,               -- T?ng giá tr? c?a s?n ph?m (PRICE * QUANTITY)
    CREATED_AT DATETIME DEFAULT GETDATE(),             -- Ngày t?o chi ti?t ??n hàng
    FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ORDER_ID) -- Liên k?t v?i b?ng ORDERS
);
GO

-- B?ng Tin T?c Gi?i Thi?u S?n Ph?m
CREATE TABLE NEWS (
    NEWS_ID INT IDENTITY PRIMARY KEY,                  -- Mã tin t?c (ID)
    TITLE NVARCHAR(255) NOT NULL,                       -- Tiêu ?? tin t?c
    CONTENT NVARCHAR(MAX) NOT NULL,                     -- N?i dung chi ti?t tin t?c
    AUTHOR NVARCHAR(100) NOT NULL,                      -- Ng??i ??ng tin t?c
    PUBLISHED_AT DATETIME DEFAULT GETDATE(),            -- Th?i gian ??ng tin
    STATUS NVARCHAR(50) DEFAULT 'ACTIVE',               -- Tr?ng thái tin t?c (Ví d?: 'ACTIVE', 'INACTIVE')
    CATEGORY NVARCHAR(100),                             -- Danh m?c tin t?c (ví d?: Khuy?n mãi, Gi?i thi?u s?n ph?m, v.v.)
    PRODUCT_ID INT,                                     -- Liên k?t v?i s?n ph?m (n?u tin t?c liên quan ??n s?n ph?m c? th?)
    VARIANT_TYPE NVARCHAR(100),                         -- Lo?i s?n ph?m (ví d?: Giày, áo, túi, v.v.)
    VARIANT_COLOR NVARCHAR(100),                        -- Màu s?c c?a s?n ph?m (n?u có)
    FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID) -- Liên k?t v?i b?ng s?n ph?m
);
GO

-- B?ng Hình ?nh Tin T?c (M?t bài tin có th? có nhi?u ?nh)
CREATE TABLE NEWS_IMAGES (
    IMAGE_ID INT IDENTITY PRIMARY KEY,                 -- Mã ?nh
    NEWS_ID INT,                                        -- Liên k?t t?i b?ng NEWS
    IMAGE_URL NVARCHAR(255) NOT NULL,                   -- ???ng d?n t?i hình ?nh
    IMAGE_DESCRIPTION NVARCHAR(255),                    -- Mô t? ?nh
    FOREIGN KEY (NEWS_ID) REFERENCES NEWS(NEWS_ID)      -- Liên k?t v?i b?ng tin t?c
);
GO

CREATE TABLE NEWS_COMMENTS (
    COMMENT_ID INT IDENTITY PRIMARY KEY,          -- Mã bình lu?n
    NEWS_ID INT,                                  -- Liên k?t t?i b?ng NEWS
    COMMENTER_NAME NVARCHAR(100),                 -- Tên ng??i bình lu?n
    COMMENT_CONTENT NVARCHAR(MAX),               -- N?i dung bình lu?n
    COMMENTED_AT DATETIME DEFAULT GETDATE(),     -- Th?i gian bình lu?n
    PARENT_COMMENT_ID INT NULL,                   -- Liên k?t v?i bình lu?n cha (cho bình lu?n con)
    FOREIGN KEY (NEWS_ID) REFERENCES NEWS(NEWS_ID), -- Liên k?t v?i b?ng tin t?c
    FOREIGN KEY (PARENT_COMMENT_ID) REFERENCES NEWS_COMMENTS(COMMENT_ID) -- Liên k?t v?i bình lu?n cha
);
GO

CREATE TABLE NEWS_RATINGS (
    RATING_ID INT IDENTITY PRIMARY KEY,           -- Mã ?ánh giá
    NEWS_ID INT,                                  -- Liên k?t t?i b?ng NEWS
    ACCOUNT_ID INT,                                  -- Liên k?t v?i ng??i dùng ?ánh giá
    RATING INT CHECK (RATING >= 1 AND RATING <= 5), -- ?ánh giá sao t? 1 ??n 5
    RATED_AT DATETIME DEFAULT GETDATE(),          -- Th?i gian ?ánh giá
    FOREIGN KEY (NEWS_ID) REFERENCES NEWS(NEWS_ID), -- Liên k?t v?i b?ng tin t?c
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID) -- Liên k?t v?i b?ng ng??i dùng
);
GO

CREATE TABLE NEWS_LIKES (
    LIKE_ID INT IDENTITY PRIMARY KEY,             -- Mã l??t thích
    NEWS_ID INT,                                  -- Liên k?t t?i b?ng NEWS
    ACCOUNT_ID INT,                                  -- Liên k?t v?i ng??i dùng
    LIKE_STATUS BIT,                              -- 1: Thích, 0: Không thích
    LIKED_AT DATETIME DEFAULT GETDATE(),          -- Th?i gian l??t thích
    FOREIGN KEY (NEWS_ID) REFERENCES NEWS(NEWS_ID), -- Liên k?t v?i b?ng tin t?c
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID) -- Liên k?t v?i b?ng ng??i dùng
);
GO

CREATE TABLE REPORTS (
    REPORT_ID INT IDENTITY PRIMARY KEY,                -- Mã báo cáo
    ENTITY_TYPE NVARCHAR(50),                           -- Lo?i ??i t??ng báo cáo (ví d?: 'NEWS', 'COMMENT', 'ACCOUNT', v.v.)
    ENTITY_ID INT,                                     -- Mã ??i t??ng ???c báo cáo (ví d?: Mã tin t?c, mã bình lu?n, mã tài kho?n)
    ACCOUNT_ID INT,                                    -- Liên k?t v?i ng??i dùng báo cáo
    REPORT_REASON NVARCHAR(255),                       -- Lý do báo cáo
    REPORTED_AT DATETIME DEFAULT GETDATE(),            -- Th?i gian báo cáo
    STATUS NVARCHAR(50) DEFAULT 'PENDING',             -- Tr?ng thái báo cáo (PENDING, RESOLVED)
    RESPONSE NVARCHAR(MAX),                            -- Ph?n h?i c?a ng??i qu?n lý khi gi?i quy?t báo cáo
    RESOLVED_AT DATETIME DEFAULT GETDATE(),                              -- Th?i gian gi?i quy?t báo cáo
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID), -- Liên k?t v?i b?ng ng??i dùng
);
GO