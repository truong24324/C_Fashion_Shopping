// src/components/CreateForm/Product/types.ts
export interface Brand { brandId: number; brandName: string; }
export interface Category { categoryId: number; categoryName: string; }
export interface Supplier { supplierId: number; supplierName: string; }
export interface Status { statusId: number; statusName: string; }
export interface Color { colorId: number; colorName: string; }
export interface Size { sizeId: number; sizeName: string; }
export interface Material { materialId: number; materialName: string; }
export interface Variant { key: string; color: number; size: number; material: number; stock: number; price: number; }

export {}; // ✅ Thêm dòng này để đảm bảo TypeScript nhận diện đây là module
