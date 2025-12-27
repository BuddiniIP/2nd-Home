import { FaStar } from "react-icons/fa";

export default function RatingStars({ rating = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`text-sm ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">
        ({rating})
      </span>
    </div>
  );
}
