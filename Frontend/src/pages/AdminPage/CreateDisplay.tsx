import React, { useState } from "react";
import CreateBrandForm from "../../components/CreateForm/Brand";
import Product from "../../components/CreateForm/Product/Product";
import CreateCategoryForm from "../../components/CreateForm/Category"; // Import form danh mục
import CreateDiscountForm from "../../components/CreateForm/Discount";
import ProductStatus from "../../components/CreateForm/ProductStatus";
import Supplier from "../../components/CreateForm/Supplier";
import Color from "../../components/CreateForm/Color";
import Size from "../../components/CreateForm/Size";
import Variants from "../../components/CreateForm/Variant";
import { Variant } from "../../components/CreateForm/Product/types";
import Material from "../../components/CreateForm/Material";

const CreateDisplay = () => {
    const [category, setCategory] = useState("product");
    const [variants, setVariants] = useState<Variant[]>([]); // ✅ Thêm state này

    const categories = [
        { label: "Sản phẩm", value: "product" },
        { label: "Thương hiệu", value: "brands" },
        { label: "Loại sản phẩm", value: "categories" }, // Thêm danh mục vào lựa chọn
        { label: "Nhà cung cấp", value: "supplier" },
        { label: "Trạng thái", value: "productStatus" },
        { label: "Mã giảm giá", value: "discount" },
        { label: "Màu sắc", value: "color" },
        { label: "Kích thước", value: "size" },
        { label: "Chất liệu", value: "material" },
        { label: "Biến thể", value: "variants" }
    ];

    return (
        <div className="p-6 bg-white/40 backdrop-blur-lg shadow-lg rounded-xl">
            <div className="flex space-x-4 mb-4">
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${category === cat.value
                            ? "bg-gradient-to-r from-green-500 to-green-700 text-white shadow-md"
                            : "bg-gray-300 text-gray-800 hover:bg-green-500 hover:text-white"
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
            {category === "brands" ? <CreateBrandForm /> :
                category === "supplier" ? <Supplier /> :
                    category === "categories" ? <CreateCategoryForm /> :
                        category === "productStatus" ? <ProductStatus /> :
                            category === "color" ? <Color /> :
                                category === "size" ? <Size /> :
                                    category === "variants" ? <Variants /> :
                                        category === "material" ? <Material /> :
                                            category === "discount" ? <CreateDiscountForm /> : <Product variants={variants} setVariants={setVariants} />}
        </div>
    );
};

export default CreateDisplay;
