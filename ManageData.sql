GO
CREATE DATABASE MANAGE
GO
USE MANAGE
GO

-- Bảng Roles: Lưu thông tin về các vai trò trong hệ thống (Admin, User, Customer)
CREATE TABLE ROLES (
    ROLE_ID INT IDENTITY PRIMARY KEY,                 -- Mã vai trò, khóa chính
    ROLE_NAME NVARCHAR(50) UNIQUE NOT NULL,           -- Tên vai trò như 'Admin', 'User', 'Customer', không trùng lặp và không null
    IS_LOGIN_ALLOWED BIT NOT NULL DEFAULT 1,          -- Cho phép đăng nhập (1: Cho phép, 0: Không cho phép)
    DESCRIPTION NVARCHAR(255)                         -- Mô tả chi tiết về vai trò
);
GO

-- Bảng Accounts: Lưu thông tin tài khoản người dùng
CREATE TABLE ACCOUNTS (
    ACCOUNT_ID INT IDENTITY PRIMARY KEY,              -- Mã tài khoản, khóa chính
    ROLE_ID INT NOT NULL,                              -- Mã vai trò, liên kết với bảng ROLES
    USER_CODE VARCHAR(50) UNIQUE NOT NULL,             -- Mã tài khoản duy nhất
    EMAIL VARCHAR(50) UNIQUE NOT NULL,                 -- Địa chỉ email duy nhất
    PHONE VARCHAR(12) UNIQUE NOT NULL,                 -- Số điện thoại duy nhất
    PASSWORD NVARCHAR(255) NOT NULL,                   -- Mật khẩu đã mã hóa
    DEVICE_NAME NVARCHAR(255),                         -- Tên thiết bị đã đăng nhập
    LOGIN_TIME DATETIME DEFAULT GETDATE(),             -- Thời gian đăng nhập gần nhất
    LOGOUT_TIME DATETIME,                              -- Thời gian đăng xuất
    IP_ADDRESS VARCHAR(50),                            -- Địa chỉ IP của người dùng
    FAILED_LOGIN_ATTEMPTS INT DEFAULT 0,               -- Số lần đăng nhập sai
    CREATED_AT DATETIME DEFAULT GETDATE(),             -- Thời gian tạo tài khoản
    UPDATED_AT DATETIME DEFAULT GETDATE(),             -- Thời gian cập nhật tài khoản
    PASSWORD_CHANGED_AT DATETIME,                      -- Thời gian thay đổi mật khẩu
    LOCK_UNTIL DATETIME DEFAULT NULL,                  -- Thời gian khóa tài khoản tạm thời
    IS_LOCKED BIT DEFAULT 0,                           -- Tài khoản có bị khóa không
    IS_ACTIVE BIT DEFAULT 1,                           -- Tài khoản có đang hoạt động không
    IS_PROTECTED BIT DEFAULT 0,                        -- Tài khoản có được bảo vệ không
    FOREIGN KEY (ROLE_ID) REFERENCES ROLES(ROLE_ID)    -- Liên kết với bảng ROLES
);
GO

-- Bảng User Points: Lưu số điểm của người dùng
CREATE TABLE USER_POINTS (
    POINT_ID INT IDENTITY PRIMARY KEY,                 -- Mã điểm, khóa chính
    ACCOUNT_ID INT NOT NULL UNIQUE,                     -- Mỗi tài khoản chỉ có một dòng
    CURRENT_POINTS INT NOT NULL DEFAULT 0,              -- Tổng điểm hiện tại của người dùng
    UPDATED_AT DATETIME DEFAULT GETDATE(),              -- Thời gian cập nhật gần nhất
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID)  -- Liên kết với bảng ACCOUNTS
);
GO

-- Bảng User Point Transactions: Lưu lịch sử giao dịch điểm của người dùng
CREATE TABLE USER_POINT_TRANSACTIONS (
    TRANSACTION_ID INT IDENTITY PRIMARY KEY,            -- Mã giao dịch
    ACCOUNT_ID INT NOT NULL,                             -- Mã tài khoản
    POINTS_CHANGED INT NOT NULL,                         -- Số điểm thay đổi (cộng hoặc trừ)
    ACTION_TYPE NVARCHAR(50),                            -- Loại hành động: "Order Reward", "Used for Discount", v.v.
    DESCRIPTION NVARCHAR(255),                           -- Mô tả chi tiết về hành động
    CREATED_AT DATETIME DEFAULT GETDATE(),               -- Thời gian giao dịch
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID)  -- Liên kết với bảng ACCOUNTS
);
GO

-- Bảng Information: Lưu thông tin cá nhân người dùng
CREATE TABLE INFORMATION (
    INFORMATION_ID INT IDENTITY PRIMARY KEY,           -- Mã thông tin, khóa chính
    ACCOUNT_ID INT NOT NULL UNIQUE,                     -- Liên kết với bảng ACCOUNTS
    FULLNAME NVARCHAR(100) NOT NULL,                    -- Tên đầy đủ của người dùng
    BIRTHDAY DATE CHECK (BIRTHDAY <= DATEADD(YEAR, -18, GETDATE())),  -- Ngày sinh phải từ 18 tuổi trở lên
    GENDER NVARCHAR(20),                                -- Giới tính người dùng
    HOME_ADDRESS NVARCHAR(255),                         -- Địa chỉ nhà
    OFFICE_ADDRESS NVARCHAR(255),                       -- Địa chỉ công ty
    NATIONALITY NVARCHAR(50) DEFAULT N'Việt Nam',      -- Quốc tịch người dùng, mặc định là Việt Nam
    AVATAR VARCHAR(225),                                -- Đường dẫn đến ảnh đại diện người dùng
    UPDATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP,      -- Thời gian cập nhật thông tin
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID)  -- Liên kết với bảng ACCOUNTS
);
GO

-- Bảng Password Reset Requests: Lưu các yêu cầu đặt lại mật khẩu
CREATE TABLE PASSWORD_RESET_REQUESTS (
    RESET_REQUEST_ID INT IDENTITY PRIMARY KEY,          -- Mã yêu cầu đặt lại mật khẩu
    ACCOUNT_ID INT UNIQUE NOT NULL,                      -- Liên kết với tài khoản người dùng
    OTP NVARCHAR(20) NOT NULL,                           -- Mã OTP để khôi phục mật khẩu
    EXPIRES_AT DATETIME DEFAULT DATEADD(MINUTE, 15, GETDATE()), -- Thời gian hết hạn của OTP
    IS_USED BIT DEFAULT 0,                               -- Đánh dấu OTP đã sử dụng hay chưa
    REQUESTED_AT DATETIME DEFAULT GETDATE(),             -- Thời gian yêu cầu đặt lại mật khẩu
    MAX_ATTEMPTS INT DEFAULT 5,                          -- Số lần nhập sai OTP tối đa
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID)  -- Liên kết với bảng ACCOUNTS
);
GO

-- Ví dụ: Bảng Categories lưu trữ thông tin danh mục sản phẩm
CREATE TABLE CATEGORIES (
    CATEGORY_ID INT IDENTITY PRIMARY KEY,               -- Mã danh mục sản phẩm
    CATEGORY_NAME NVARCHAR(100) UNIQUE NOT NULL,         -- Tên danh mục sản phẩm
    DESCRIPTION NVARCHAR(255)                            -- Mô tả chi tiết về danh mục
);
GO

-- Bảng Suppliers lưu trữ thông tin nhà cung cấp sản phẩm
CREATE TABLE SUPPLIERS (
    SUPPLIER_ID INT IDENTITY PRIMARY KEY,               -- Mã nhà cung cấp
    SUPPLIER_NAME NVARCHAR(100) UNIQUE NOT NULL,         -- Tên nhà cung cấp
    CONTACT_NAME NVARCHAR(100),                          -- Tên người liên hệ nhà cung cấp
    PHONE NVARCHAR(15),                                  -- Số điện thoại liên hệ
    EMAIL NVARCHAR(100),                                 -- Email liên hệ
    ADDRESS NVARCHAR(255)                                -- Địa chỉ nhà cung cấp
);
GO

CREATE TABLE BRANDS (
	BRAND_ID INT IDENTITY(1,1) PRIMARY KEY,  -- Mã thương hiệu, khóa chính
	BRAND_NAME NVARCHAR(200) UNIQUE NOT NULL, -- Tên thương hiệu, duy nhất và không null
	LOGO NVARCHAR(100)                        -- Đường dẫn hoặc tên tệp logo của thương hiệu
);
GO

CREATE TABLE PRODUCT_STATUS (
    STATUS_ID INT IDENTITY PRIMARY KEY,            -- Mã trạng thái, khóa chính
    STATUS_NAME NVARCHAR(50) UNIQUE NOT NULL,      -- Tên trạng thái sản phẩm, duy nhất và không null
	IS_ACTIVE Bit Default 1,
    DESCRIPTION NVARCHAR(255)                      -- Mô tả chi tiết về trạng thái
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

CREATE TABLE DISCOUNTS (  
    DISCOUNT_ID INT IDENTITY PRIMARY KEY,               -- Mã khuyến mãi, khóa chính
    DISCOUNT_CODE NVARCHAR(50) UNIQUE NOT NULL,         -- Mã giảm giá, duy nhất và không null
    DISCOUNT_VALUE INT,                                 -- Giá trị giảm giá (có thể là số tiền hoặc phần trăm)
    DISCOUNT_TYPE NVARCHAR(20) NOT NULL,                -- Loại giảm giá (PERCENT, AMOUNT, v.v.)
    IS_ACTIVE BIT DEFAULT 1 NOT NULL,                    -- Trạng thái kích hoạt giảm giá (mặc định là kích hoạt)
    QUANTITY INT NOT NULL DEFAULT 1,                     -- Số lượng mã giảm giá có sẵn
    MAX_USAGE_PER_USER INT,                             -- Số lần tối đa mỗi người dùng có thể sử dụng mã giảm giá
    MIN_ORDER_AMOUNT INT,                               -- Giá trị đơn hàng tối thiểu để áp dụng mã giảm giá
    START_DATE DATETIME NOT NULL,                        -- Ngày bắt đầu khuyến mãi
    END_DATE DATETIME,                                  -- Ngày kết thúc khuyến mãi
    DESCRIPTION NVARCHAR(255),                          -- Mô tả khuyến mãi
    CREATED_AT DATETIME DEFAULT GETDATE(),              -- Thời gian tạo mã giảm giá
    UPDATED_AT DATETIME DEFAULT GETDATE()               -- Thời gian cập nhật mã giảm giá
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

CREATE TABLE ORDER_STATUSES (
    STATUS_ID INT IDENTITY PRIMARY KEY,             -- Mã định danh tự tăng, khóa chính
    STATUS_NAME NVARCHAR(50) UNIQUE NOT NULL,        -- Tên trạng thái đơn hàng (duy nhất, không được null)
    STEP_ORDER INT NOT NULL,                         -- Thứ tự xử lý của trạng thái trong quy trình (1: Chờ xác nhận, 2: Đang xử lý, ...)
    IS_FINAL BIT DEFAULT 0,                          -- Trạng thái này có phải là trạng thái kết thúc? (1: Có, 0: Không)  
    IS_CANCELLABLE BIT DEFAULT 1                     -- Đơn hàng ở trạng thái này có thể bị hủy không? (1: Có thể hủy, 0: Không thể)
);
GO

-- Bảng ORDER (Đơn hàng)
CREATE TABLE ORDERS (
    ORDER_ID INT IDENTITY PRIMARY KEY,           -- Mã đơn hàng, khóa chính
	ORDER_CODE NVARCHAR(100),
    ACCOUNT_ID INT NOT NULL,                     -- Mã tài khoản người mua    
	ORDER_STATUS_ID INT NOT NULL,                -- Trạng thái đơn hàng
	DISCOUNT_ID INT,
	DISCOUNT_CODE NVARCHAR(50),
    FULLNAME NVARCHAR(255) NOT NULL,              -- Họ và tên người mua
    EMAIL NVARCHAR(100),                         -- Email người mua
    PHONE NVARCHAR(15),                          -- Số điện thoại người mua
    SHIPPING_ADDRESS NVARCHAR(255),              -- Địa chỉ giao hàng
    ORDER_DATE DATETIME DEFAULT GETDATE(),       -- Ngày đặt hàng
    TOTAL_AMOUNT DECIMAL(18, 2) NOT NULL,        -- Tổng giá trị đơn hàng
    PAYMENT_METHOD NVARCHAR(50),                 -- Phương thức thanh toán
    PAYMENT_STATUS NVARCHAR(50),              -- Trạng thái thanh toán
	SHIPPING_FEE INT,
    IS_ACTIVE BIT DEFAULT 1,                     -- Trạng thái hoạt động (1: hoạt động, 0: không)
    CREATED_AT DATETIME DEFAULT GETDATE(),       -- Thời gian tạo đơn hàng
    UPDATED_AT DATETIME DEFAULT GETDATE(),       -- Thời gian cập nhật đơn hàng
	FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID), -- Liên kết với tài khoản người mua
    FOREIGN KEY (DISCOUNT_ID) REFERENCES DISCOUNTS(DISCOUNT_ID), -- Liên kết với tài khoản người mua
    FOREIGN KEY (ORDER_STATUS_ID) REFERENCES ORDER_STATUSES(STATUS_ID) -- Liên kết với trạng thái đơn hàng
);
GO

-- Bảng ORDER_DETAIL (Chi tiết đơn hàng)
CREATE TABLE ORDER_DETAILS (
    ORDER_DETAIL_ID INT IDENTITY PRIMARY KEY,    -- Mã chi tiết đơn hàng
    ORDER_ID INT NOT NULL,                        -- Mã đơn hàng
    PRODUCT_ID INT NOT NULL,                      -- Mã sản phẩm
    VARIANT_ID INT NOT NULL,                      -- Mã biến thể sản phẩm (ví dụ: màu sắc, kích thước)

    PRODUCT_NAME NVARCHAR(255) NOT NULL,          -- Tên sản phẩm tại thời điểm mua
    COLOR_NAME NVARCHAR(50),                      -- Màu sắc sản phẩm
    SIZE_NAME NVARCHAR(20),                       -- Kích thước sản phẩm
    MATERIAL_NAME NVARCHAR(50),                   -- Chất liệu sản phẩm

    PRODUCT_PRICE DECIMAL(18, 2) NOT NULL,        -- Giá sản phẩm tại thời điểm mua
    QUANTITY INT NOT NULL,                        -- Số lượng sản phẩm
    TOTAL_PRICE DECIMAL(18, 2), -- Tính tổng giá trị đơn hàng cho sản phẩm

    CREATED_AT DATETIME DEFAULT GETDATE(),        -- Thời gian tạo chi tiết đơn hàng

    FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ORDER_ID),    -- Liên kết với đơn hàng
    FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID), -- Liên kết với sản phẩm
    FOREIGN KEY (VARIANT_ID) REFERENCES VARIANTS(VARIANT_ID) -- Liên kết với biến thể sản phẩm
);
GO

CREATE TABLE ORDER_HISTORY (
    HISTORY_ID INT IDENTITY PRIMARY KEY,          -- Mã lịch sử thay đổi trạng thái
    ORDER_ID INT NOT NULL,                        -- Mã đơn hàng
    STATUS_ID INT NOT NULL,                       -- Mã trạng thái đơn hàng
    UPDATED_AT DATETIME DEFAULT GETDATE(),        -- Thời gian cập nhật trạng thái
    NOTE NVARCHAR(500),                           -- Ghi chú (nếu có)
    
    FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ORDER_ID),    -- Liên kết với đơn hàng
    FOREIGN KEY (STATUS_ID) REFERENCES ORDER_STATUSES(STATUS_ID) -- Liên kết với trạng thái đơn hàng
);
GO

CREATE TABLE PRODUCT_REVIEWS (
    REVIEW_ID INT IDENTITY PRIMARY KEY,        -- Mã đánh giá
    ORDER_DETAIL_ID INT NOT NULL,              -- Liên kết với chi tiết đơn hàng (đảm bảo đã mua)
    ACCOUNT_ID INT NOT NULL,                   -- Tài khoản người đánh giá
    PRODUCT_ID INT NOT NULL,                   -- Sản phẩm được đánh giá
    VARIANT_ID INT NOT NULL,                   -- Biến thể được đánh giá (màu/sz...)

    RATING INT NOT NULL CHECK (RATING BETWEEN 1 AND 5), -- Điểm đánh giá (1-5 sao)
    TITLE NVARCHAR(255),                       -- Tiêu đề đánh giá
    CONTENT NVARCHAR(MAX),                     -- Nội dung đánh giá
    IMAGE_URL NVARCHAR(500),                   -- Ảnh đánh giá (nếu có)

    IS_VISIBLE BIT DEFAULT 1,                  -- Có hiển thị đánh giá hay không (ẩn nếu vi phạm)
    CREATED_AT DATETIME DEFAULT GETDATE(),     -- Thời gian tạo
    UPDATED_AT DATETIME                        -- Lần chỉnh sửa gần nhất

    -- Khóa ngoại
    FOREIGN KEY (ORDER_DETAIL_ID) REFERENCES ORDER_DETAILS(ORDER_DETAIL_ID),
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID),
    FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID),
    FOREIGN KEY (VARIANT_ID) REFERENCES VARIANTS(VARIANT_ID)
);
GO

-- B?ng Tin T?c Gi?i Thi?u S?n Ph?m
CREATE TABLE NEWS (
    NEWS_ID INT IDENTITY PRIMARY KEY,             -- Mã tin tức
    TITLE NVARCHAR(255) NOT NULL,                  -- Tiêu đề tin tức
    CONTENT NVARCHAR(MAX) NOT NULL,                -- Nội dung tin tức
    AUTHOR NVARCHAR(100) NOT NULL,                 -- Tên tác giả
    PUBLISHED_AT DATETIME DEFAULT GETDATE(),      -- Thời gian xuất bản tin
    STATUS NVARCHAR(50) DEFAULT 'ACTIVE',          -- Trạng thái tin tức (ACTIVE, INACTIVE)
    CATEGORY NVARCHAR(100),                        -- Danh mục tin tức (Khuyến mãi, Giới thiệu sản phẩm, v.v.)
    PRODUCT_ID INT,                                -- Liên kết với sản phẩm (nếu tin tức liên quan đến sản phẩm)
    VARIANT_TYPE NVARCHAR(100),                    -- Loại sản phẩm (Giày, Áo, v.v.)
    VARIANT_COLOR NVARCHAR(100),                   -- Màu sắc sản phẩm (nếu có)
    FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID) -- Liên kết với bảng sản phẩm
);
GO

-- B?ng Hình ?nh Tin T?c (M?t bài tin có th? có nhi?u ?nh)
CREATE TABLE NEWS_IMAGES (
    IMAGE_ID INT IDENTITY PRIMARY KEY,            -- Mã hình ảnh
    NEWS_ID INT,                                   -- Mã tin tức
    IMAGE_URL NVARCHAR(255) NOT NULL,              -- Đường dẫn đến hình ảnh
    IMAGE_DESCRIPTION NVARCHAR(255),               -- Mô tả hình ảnh
    
    FOREIGN KEY (NEWS_ID) REFERENCES NEWS(NEWS_ID) -- Liên kết với bài tin tức
);
GO

CREATE TABLE NEWS_COMMENTS (
    COMMENT_ID INT IDENTITY PRIMARY KEY,           -- Mã bình luận
    NEWS_ID INT,                                   -- Mã tin tức
    COMMENTER_NAME NVARCHAR(100),                  -- Tên người bình luận
    COMMENT_CONTENT NVARCHAR(MAX),                -- Nội dung bình luận
    COMMENTED_AT DATETIME DEFAULT GETDATE(),      -- Thời gian bình luận
    PARENT_COMMENT_ID INT NULL,                    -- Liên kết với bình luận cha (cho bình luận con)
    
    FOREIGN KEY (NEWS_ID) REFERENCES NEWS(NEWS_ID), -- Liên kết với bài tin tức
    FOREIGN KEY (PARENT_COMMENT_ID) REFERENCES NEWS_COMMENTS(COMMENT_ID) -- Liên kết với bình luận cha
);
GO

CREATE TABLE NEWS_RATINGS (
    RATING_ID INT IDENTITY PRIMARY KEY,           -- Mã đánh giá
    NEWS_ID INT,                                  -- Mã tin tức
    ACCOUNT_ID INT,                               -- Mã tài khoản người dùng
    RATING INT CHECK (RATING >= 1 AND RATING <= 5), -- Đánh giá sao từ 1 đến 5
    RATED_AT DATETIME DEFAULT GETDATE(),          -- Thời gian đánh giá
    
    FOREIGN KEY (NEWS_ID) REFERENCES NEWS(NEWS_ID), -- Liên kết với bài tin tức
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNTS(ACCOUNT_ID) -- Liên kết với tài khoản người dùng
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

CREATE TABLE STORES (
    STORE_ID INT IDENTITY PRIMARY KEY,             -- Mã cửa hàng
    STORE_NAME NVARCHAR(255) NOT NULL,             -- Tên cửa hàng
    MANAGER_NAME NVARCHAR(100),                    -- Người quản lý
    PHONE NVARCHAR(15),                            -- Số điện thoại
    EMAIL NVARCHAR(100),                           -- Email

    PROVINCE_NAME NVARCHAR(100) NOT NULL,          -- Tỉnh/Thành phố
    DISTRICT_NAME NVARCHAR(100) NOT NULL,          -- Quận/Huyện
    WARD_NAME NVARCHAR(100) NOT NULL,              -- Phường/Xã
    ADDRESS_DETAIL NVARCHAR(255) NOT NULL,         -- Số nhà, tên đường

    OPENING_HOURS NVARCHAR(100),                   -- Giờ mở cửa
    STATUS NVARCHAR(50) DEFAULT 'ACTIVE',          -- ACTIVE / INACTIVE
    CREATED_AT DATETIME DEFAULT GETDATE(),         
    UPDATED_AT DATETIME DEFAULT GETDATE()
);
GO

