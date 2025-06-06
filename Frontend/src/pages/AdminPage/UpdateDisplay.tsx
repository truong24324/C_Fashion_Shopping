import { useState } from "react";
import UpdateProductForm from "../../components/UpdateForm/UpdateProductForm";

const UpdateDisplay = () => {
    const [category, setCategory] = useState("product");

    const categories = [
        { label: "Sản phẩm", value: "product" },
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

            {category === "brands" ? <UpdateProductForm /> : <UpdateProductForm />}                
        </div>
    );
};

export default UpdateDisplay;
