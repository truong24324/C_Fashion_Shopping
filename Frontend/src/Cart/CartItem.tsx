import React from "react";

interface CartItemProps {
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
  updateQuantity: (variantId: number, amount: number) => void;
  removeItem: (variantId: number) => void;
  updateVariant: (
    variantId: number,
    newVariant: { color: string; size: string; material: string }
  ) => void;
  selected: boolean;
  toggleSelectItem: (variantId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  variantId,
  productName,
  variantDetails,
  quantity,
  price,
  totalPrice,
  productImage,
  availableColors,
  availableSizes,
  availableMaterials,
  updateQuantity,
  removeItem,
  updateVariant,
  selected,
  toggleSelectItem,
}) => {
  const [selectedColor, setSelectedColor] = React.useState<string>(
    availableColors[0] || ""
  );
  const [selectedSize, setSelectedSize] = React.useState<string>(
    availableSizes[0] || ""
  );
  const [selectedMaterial, setSelectedMaterial] = React.useState<string>(
    availableMaterials[0] || ""
  );

  React.useEffect(() => {
    if (variantDetails) {
      const [color, size, material] = variantDetails
        .split(",")
        .map((val) => val.trim());
      setSelectedColor(color || availableColors[0] || "");
      setSelectedSize(size || availableSizes[0] || "");
      setSelectedMaterial(material || availableMaterials[0] || "");
    }
  }, [variantDetails]);

  const handleChangeVariant = () => {
    updateVariant(variantId, {
      color: selectedColor,
      size: selectedSize,
      material: selectedMaterial,
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b py-4 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={selected}
        onChange={() => toggleSelectItem(variantId)}
        className="mr-2"
      />

      <img
        src={productImage}
        alt={productName}
        className="w-24 h-24 object-cover rounded-lg"
      />

      <div className="flex-1 md:ml-4 w-full">
        <p className="font-semibold text-lg">{productName}</p>
        <p className="text-sm text-gray-500">Đang chọn: {variantDetails}</p>

        <div className="flex gap-2 mt-2 flex-wrap">
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {availableColors.map((color, index) => (
              <option key={index} value={color}>
                {color}
              </option>
            ))}
          </select>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {availableSizes.map((size, index) => (
              <option key={index} value={size}>
                {size}
              </option>
            ))}
          </select>
          <select
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {availableMaterials.map((material, index) => (
              <option key={index} value={material}>
                {material}
              </option>
            ))}
          </select>

          <button
            onClick={handleChangeVariant}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
          >
            Cập nhật biến thể
          </button>
        </div>
      </div>

      <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
        <button
          onClick={() => updateQuantity(variantId, -1)}
          className="px-3 py-1 text-lg font-bold bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          -
        </button>
        <span className="mx-3 text-lg font-medium">{quantity}</span>
        <button
          onClick={() => updateQuantity(variantId, 1)}
          className="px-3 py-1 text-lg font-bold bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          +
        </button>
      </div>

      <span className="font-semibold text-lg text-blue-600 whitespace-nowrap">
        {totalPrice.toLocaleString()}₫
      </span>

      <button
        onClick={() => removeItem(variantId)}
        className="ml-2 text-red-500 hover:text-red-700 font-semibold"
      >
        X
      </button>
    </div>
  );
};

export default CartItem;
