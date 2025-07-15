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
  selected: boolean;
  toggleSelectItem: (variantId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  variantId,
  productName,
  variantDetails,
  quantity,
  totalPrice,
  productImage,
  updateQuantity,
  removeItem,
  selected,
  toggleSelectItem,
}) => {

  return (
   <div className="flex items-stretch w-full border-b bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  {/* Bán nguyệt chứa checkbox */}
  <div className="flex items-center justify-center px-3 bg-blue-100 rounded-l-lg">
    <input
      type="checkbox"
      checked={selected}
      onChange={() => toggleSelectItem(variantId)}
      className="w-5 h-5 accent-blue-500"
    />
  </div>

  {/* Nội dung còn lại của item */}
  <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 flex-1">
    <img
      src={productImage}
      alt={productName}
      className="w-24 h-24 object-cover rounded-lg"
    />

    <div className="flex-1 md:ml-4 w-full">
      <p className="font-semibold text-lg">{productName}</p>
      <p className="text-sm text-gray-500">Đang chọn: {variantDetails}</p>
    </div>

    <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
      <button
        onClick={() => updateQuantity(variantId, -1)}
        className="px-3 py-1 text-lg font-bold bg-gray-200 hover:bg-gray-300 rounded-lg"
      >
        -
      </button>

      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => {
          const newValue = parseInt(e.target.value, 10);
          if (!isNaN(newValue) && newValue > 0) {
            const diff = newValue - quantity;
            updateQuantity(variantId, diff);
          }
        }}
        className="mx-2 w-16 text-center text-lg font-medium bg-white border border-gray-300 rounded-lg"
      />

      <button
        onClick={() => updateQuantity(variantId, 1)}
        className="px-3 py-1 text-lg font-bold bg-gray-200 hover:bg-gray-300 rounded-lg"
      >
        +
      </button>
    </div>

    <span className="font-semibold text-lg text-blue-600 whitespace-nowrap">
      {totalPrice.toLocaleString()} vn₫
    </span>

    <button
      onClick={() => removeItem(variantId)}
      className="ml-2 text-red-500 hover:text-red-700 font-semibold"
    >
      X
    </button>
  </div>
</div>

  );
};

export default CartItem;
