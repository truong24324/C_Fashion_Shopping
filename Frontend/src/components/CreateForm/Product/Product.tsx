import React, { useState, useEffect } from "react";
import { Card, UploadFile } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import ProductForm from "./ProductForm";
import { Brand, Category, Supplier, Status, Color, Size, Material, Variant } from "./types";

interface ProductProps {
    variants: Variant[];
    setVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
}

const Product: React.FC<ProductProps> = ({ variants, setVariants }) => {
    const [imageList, setImageList] = useState<UploadFile[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(false);

    // 🟢 Lấy variants từ localStorage (variants_cache) khi component mount
    useEffect(() => {
        const savedVariants = localStorage.getItem("variants_cache");
        if (savedVariants) {
            setVariants(JSON.parse(savedVariants));
        }
    }, []);

    // 🔴 Lưu variants vào localStorage (variants_cache) mỗi khi variants thay đổi
    useEffect(() => {
        if (variants.length > 0) {
            localStorage.setItem("variants_cache", JSON.stringify(variants));
        }
    }, [variants]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                const [brandRes, categoryRes, supplierRes, statusRes] = await Promise.all([
                    axios.get("/api/brands/all", { headers }),
                    axios.get("/api/categories/all", { headers }),
                    axios.get("/api/suppliers/all", { headers }),
                    axios.get("/api/product-status/all", { headers }),
                ]);

                setBrands(brandRes.data.content || []);
                setCategories(categoryRes.data.content || []);
                setSuppliers(supplierRes.data.content || []);
                setStatuses(statusRes.data.content || []);
            } catch (error: any) {
                toast.error(error.response?.data?.message || "⚠️ Có lỗi xảy ra khi tải dữ liệu!");
            }
        };
        fetchData();
    }, []);  

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            // Lấy ảnh và biến thể từ cache/state
            const cachedVariants = localStorage.getItem("variants_cache");
            const storedVariants: Variant[] = cachedVariants ? JSON.parse(cachedVariants) : [];

            // 🔴 Kiểm tra điều kiện trước khi gửi
            if (imageList.length < 2) {
                toast.error("⚠️ Cần chọn ít nhất 2 ảnh!");
                setLoading(false);
                return;
            }
            if (storedVariants.length < 2) {
                toast.error("⚠️ Cần có ít nhất 2 biến thể!");
                setLoading(false);
                return;
            }

            // Gửi sản phẩm
            const { data: createdProduct } = await axios.post("/api/products/add", values, { headers });
            toast.success("🟢 Thêm sản phẩm thành công!");
            const productId = createdProduct?.data?.productId;
            if (!productId) throw new Error("Không lấy được ID sản phẩm!");

            // Gửi biến thể
            await axios.post("/api/variants/batch-add", storedVariants.map(v => ({ ...v, productId })), { headers });
            toast.success("🟢 Thêm biến thể thành công!");

            // Gửi ảnh
            const imageUploadPromises = imageList.map((file, index) => {
                if (!file.originFileObj) return Promise.resolve();
                const formData = new FormData();
                formData.append("productId", productId);
                formData.append("image", file.originFileObj);

                let imageType = "OTHER";
                if (index === 0) imageType = "MAIN";
                else if (index === 1) imageType = "SECONDARY";
                formData.append("imageType", imageType);

                return axios.post("/api/products/upload", formData, { headers });
            });
            await Promise.all(imageUploadPromises);

            // Reset sau khi thành công
            setImageList([]);
            setVariants([]);
            localStorage.removeItem("variants_cache");

            toast.success("🟢 Tải ảnh thành công!");
            toast.success("✅ Thêm sản phẩm hoàn tất!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "⚠️ Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <ProductForm
                onSubmit={handleSubmit}
                brands={brands}
                categories={categories}
                suppliers={suppliers}
                statuses={statuses}
                colors={colors}
                sizes={sizes}
                materials={materials}
                setImageList={setImageList}
                imageList={imageList}
                variants={variants}
                setVariants={setVariants}
                loading={loading}
            />
        </Card>
    );
};

export default Product;