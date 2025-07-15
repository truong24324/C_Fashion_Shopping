import { UploadFile } from "antd";

// Thông tin cơ bản
export interface Brand { brandId: number; brandName: string }
export interface Category { categoryId: number; categoryName: string }
export interface Supplier { supplierId: number; supplierName: string }
export interface Status { statusId: number; statusName: string }
export interface Color { colorId: number; colorName: string }
export interface Size { sizeId: number; sizeName: string }
export interface Material { materialId: number; materialName: string }
export interface ColorOption { code: string; name: string }
export interface Image { imageUrl: string; imageType: string }
export interface User {
    accountId: string;
    userCode: string;
    fullName: string;
    birthday: string;
    gender: string;
    email: string;
    phone: string;
    homeAddress: string;
    officeAddress: string;
    nationality: string;
    avatar: string;
    createdAt?: string;
    updatedAt?: string;
    passwordChangedAt?: string;
    loginTime?: string;
    avatarFile: File | null;
}

export interface EditProfileFormProps {
    user: User;
    setUser: (user: User | null | ((prevUser: User | null) => User | null)) => void;
    setIsEditing: (editing: boolean) => void;
    setIsChangePassword: (changePassword: boolean) => void;
}

// Variant (đóng gói luôn color, size, material, price, stock...)
export interface Variant {
    variantId?: number;
    colorCode: string;
    colorName?: string;
    sizeName: string;
    materialName: string;
    stock: number;
    price: number;
}

export interface Variant { key: string; color: number; size: number; material: number; stock: number; price: number; }
// Product (đóng gói thông tin cơ bản + variants + images)
export interface Product {
    productId: number;
    productName: string;
    description?: string | null;
    barcode?: string;
    model?: string;
    warrantyPeriod?: string;
    supplierId?: number;
    supplierName?: string;
    categoryId?: number;
    categoryName?: string;
    colorNames?: string[];
    sizeNames?: string[];
    materialNames?: string[];
    variants?: Variant[];
    price?: number | null;
    mainImageUrl?: string;
    subImageUrl?: string;
    colorCodes?: string[];
    imageTypes?: string[];
    orderId: string;
    orderStatus: string;
    productPrice?: number;
    quantity?: number;
    totalPrice?: number;
    minPrice?: number;
    category: string;
    colorName: string;
    statusId?: number;
}

// Các kiểu khác
export interface FormState {
    label: string;
    imageType: string;
    productId: number | null;
    fileList: UploadFile[];
}

export interface OptionType {
    id: number;
    brandId?: number;
    brandName?: string;
    categoryId?: number;
    categoryName?: string;
    supplierId?: number;
    supplierName?: string;
    statusId?: number;
    statusName?: string;
}

export interface CartItemType {
    variantId: number;
    productName: string;
    variantDetails: string;
    quantity: number;
    price: number;
    totalPrice: number;
    productImage: string;
    availableColors: string[];
    availableSizes: string[];
    availableMaterials: string[];
    selected: boolean;
    toggleSelectItem: (variantId: number) => void;
    weightPerUnit?: number;
    setDiscount: (value: number) => void;
    setShippingFee: (fee: number | null) => void;
}

export interface ProductItem {
    orderDetailId: number;
    productId: number;
    variantId: number;
    mainImageUrl: string;
    productName: string;
    colorName: string;
    sizeName: string;
    materialName: string;
    quantity: number;
    reviewed: boolean;
}

export interface ReviewFormValues {
    rating: number;
    title: string;
    content: string;
    imageUrl?: any;
}

export interface ProductDetail {
    productName: string;
    brandName: string;
    categoryName: string;
    description: string | null;
    barcode: string;
    model: string;
    warrantyPeriod: string;
    supplierName: string;
    colorNames: string[];
    sizeNames: string[];
    materialNames: string[];
    images: Image[];
    variants: Variant[];
}

export interface TopSuggestion {
    productId: string;
    productName: string;
}

export interface DecodedToken {
    accountId: string;
    exp: number;
    iat: number;
    email: string;
    roles: { authority: string }[];
}

export interface JwtPayload {
    accountId: string;
}

export interface ProfileInfoProps {
    user: User;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface VariantSummary {
    colorCode: string;
    sizeName: string;
    materialName: string;
    price: number;
    stock: number;
}

export interface StatsCardProps {
    title: string;
    value: string;
    color?: string;
    change?: string;
}

export interface RevenueItem {
    month: number;
    revenue: number | string;
}

export interface Props {
    images: string[];
    name: string;
    product?: Product | ProductDetail;
    onSizeSuggest?: () => void;
}

export interface PointHistory {
  id: number;
  point: number;
  reason: string;
  timestamp: string;
}

export { };