import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";

interface UsePointsSectionProps {
  currentPoints: number;
  onUsePoints: (usedPoints: number) => void;
  subtotal: number; // 🧩 cần thêm để kiểm tra điều kiện 10.000₫
}

const UsePointsSection: React.FC<UsePointsSectionProps> = ({
  currentPoints,
  onUsePoints,
  subtotal,
}) => {
  const [usePoints, setUsePoints] = useState(false);
  const [usedPoints, setUsedPoints] = useState(0);

  const maxUsablePoints = currentPoints;
  const canUsePoints = subtotal >= 10000;

  useEffect(() => {
    if (!usePoints || !canUsePoints) {
      setUsedPoints(0);
      onUsePoints(0);
    } else {
      onUsePoints(usedPoints);
    }
  }, [usePoints, usedPoints, canUsePoints]);

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm space-y-3 w-full max-w-md">
      <div className="flex items-center justify-between">
        <div className="text-gray-700 font-semibold">🪙 Xu hiện có:</div>
        <div className="text-yellow-500 font-bold text-xl">{currentPoints.toLocaleString()} xu</div>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-gray-600 font-medium flex items-center gap-1">
          Dùng xu để giảm giá?
          <span
            className="text-blue-500 text-sm cursor-pointer"
            data-tooltip-id="xu-tooltip"
            data-tooltip-content="1 xu = 1 vnđ"
          >
            ⓘ
          </span>
          <Tooltip id="xu-tooltip" place="top" />
        </label>
        <input
          type="checkbox"
          checked={usePoints}
          onChange={(e) => setUsePoints(e.target.checked)}
          className="w-5 h-5"
          disabled={!canUsePoints}
        />
      </div>

      {!canUsePoints && (
        <p className="text-red-500 text-sm italic">
          Bạn cần đơn hàng tối thiểu 10.000₫ để sử dụng xu.
        </p>
      )}

      {usePoints && canUsePoints && (
        <div className="space-y-2">
          <label className="block text-gray-600 text-sm">Nhập số xu muốn sử dụng:</label>
          <input
            type="number"
            min={0}
            max={maxUsablePoints}
            value={usedPoints}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setUsedPoints(isNaN(value) ? 0 : Math.min(value, maxUsablePoints));
            }}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            type="button"
            onClick={() => setUsedPoints(maxUsablePoints)}
            className="text-sm text-blue-600 hover:underline"
          >
            Dùng tối đa xu
          </button>

          <div className="text-green-600 text-sm">
            Giảm giá: <strong>{usedPoints.toLocaleString()} vn₫</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsePointsSection;
