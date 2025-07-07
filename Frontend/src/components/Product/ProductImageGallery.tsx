import React, { useState } from "react";

interface Props {
  images: string[];
  name: string;
}

const ProductImageGallery: React.FC<Props> = ({ images, name }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="flex w-full md:w-1/2 p-4">
      {/* Cột trái - thumbnails */}
      <div className="w-1/5 flex flex-col gap-2">
        {images.map((img, index) => (
          <div
            key={index}
            className={`cursor-pointer border-2 rounded-md aspect-square overflow-hidden ${currentImageIndex === index ? "border-blue-500" : "border-gray-200"
              }`}
            onClick={() => handleThumbnailClick(index)}
          >
            <img
              src={`/${img}`}
              alt={`Thumbnail ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* Cột phải - ảnh chính */}
      <div className="w-4/5 pl-4">
        <div className="aspect-square w-full overflow-hidden rounded-md shadow-md border border-gray-200">
          <img
            src={`/${images[currentImageIndex]}`}
            alt={name}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
