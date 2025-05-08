import React from "react";

interface ShippingAddressProps {
  provinces: any[];
  districts: any[];
  wards: any[];
  province: string;
  district: string;
  ward: string;
  handleProvinceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleDistrictChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setWard: (value: string) => void;
  estimatedDelivery: string; 
}

const ShippingAddress: React.FC<ShippingAddressProps> = ({
  provinces,
  districts,
  wards,
  province,
  district,
  ward,
  handleProvinceChange,
  handleDistrictChange,
  setWard,
  estimatedDelivery,
}) => (
  <div>
    <h3 className="text-lg font-semibold mt-4">Ước tính thời gian giao hàng</h3>
    <select value={province} onChange={handleProvinceChange} className="w-full p-2 border rounded mt-2">
      <option value="">Chọn tỉnh/thành phố</option>
      {provinces.map((prov) => (
        <option key={prov.ProvinceID} value={prov.ProvinceID}>
          {prov.ProvinceName}
        </option>
      ))}
    </select>

    <select value={district} onChange={handleDistrictChange} className="w-full p-2 border rounded mt-2">
      <option value="">Chọn quận/huyện</option>
      {districts.map((dist) => (
        <option key={dist.DistrictID} value={dist.DistrictID}>
          {dist.DistrictName}
        </option>
      ))}
    </select>

    <select value={ward} onChange={(e) => setWard(e.target.value)} className="w-full p-2 border rounded mt-2">
      <option value="">Chọn phường/xã</option>
      {wards.map((w) => (
        <option key={w.WardCode} value={w.WardCode}>
          {w.WardName}
        </option>
      ))}
    </select>

    {estimatedDelivery && (
      <div className="mt-4 text-lg">
        <strong>Thời gian giao hàng ước tính: </strong>{estimatedDelivery}
      </div>
    )}
  </div>
);

export default ShippingAddress;