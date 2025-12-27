import { useState } from "react";

export default function ImageGallery({ images }) {
  const [main, setMain] = useState(images[0]);

  return (
    <div>
      <img
        src={main}
        alt="Main"
        className="w-full h-64 object-cover rounded-lg mb-4"
      />

      <div className="flex gap-3">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Thumb"
            onClick={() => setMain(img)}
            className={`w-20 h-16 object-cover rounded cursor-pointer border
              ${main === img ? "border-blue-600" : "border-gray-300"}
            `}
          />
        ))}
      </div>
    </div>
  );
}
