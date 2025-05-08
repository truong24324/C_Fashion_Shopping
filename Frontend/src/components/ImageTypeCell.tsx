// components/ImageTypeCell.tsx
import React, { useState } from "react";
import { Select, message } from "antd";
import axios from "axios";
import toast from "react-hot-toast";

const { Option } = Select;

const ImageTypeCell = ({ value, imageId }: { value: string; imageId: number }) => {
  const [editing, setEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const imageTypeEnum: Record<string, string> = {
    MAIN: 'MAIN',
    SECONDARY: 'SECONDARY',
    OTHER: 'OTHER',
  };
  
  const handleChange = async (newValue: string) => {
    try {
      const imageType = imageTypeEnum[newValue] || 'OTHER';  // Default fallback
      await axios.put(`/api/images/${imageId}`, { imageType }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCurrentValue(imageType);  // Update UI with correct enum value
      toast.success("Cập nhật thành công");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setEditing(false);
    }
  };  

  return editing ? (
    <Select
      value={currentValue}  // Bind value to `currentValue`
      style={{ width: 130 }}
      onChange={handleChange}
      onBlur={() => setEditing(false)}
      autoFocus
    >
      <Option value="MAIN">MAIN</Option>
      <Option value="SECONDARY">SECONDARY</Option>
      <Option value="OTHER">OTHER</Option>
    </Select>
  ) : (
    <div onDoubleClick={() => setEditing(true)}>{currentValue || "N/A"}</div>
  );  
};

export default ImageTypeCell;
