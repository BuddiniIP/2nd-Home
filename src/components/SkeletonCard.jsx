import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-[12px] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.08)] flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="h-[200px] bg-gray-300 w-full relative">
        <div className="absolute top-[15px] right-[15px] bg-gray-400 w-[60px] h-[24px] rounded-[20px]"></div>
      </div>
      
      <div className="p-[20px] flex flex-col flex-1">
        {/* Title and Price row */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-[10px] mb-[15px]">
          <div className="w-full sm:w-2/3">
            <div className="h-[24px] bg-gray-300 rounded mb-[10px] w-3/4"></div>
            <div className="h-[16px] bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-[24px] bg-gray-300 rounded w-[80px] self-start sm:self-auto shrink-0"></div>
        </div>

        {/* Details row */}
        <div className="flex justify-between mb-[15px]">
          <div className="h-[16px] bg-gray-200 rounded w-[60px]"></div>
          <div className="h-[16px] bg-gray-200 rounded w-[50px]"></div>
          <div className="h-[16px] bg-gray-200 rounded w-[60px]"></div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-[10px] my-[15px]">
          <div className="h-[24px] bg-gray-200 rounded-[15px] w-[60px]"></div>
          <div className="h-[24px] bg-gray-200 rounded-[15px] w-[80px]"></div>
          <div className="h-[24px] bg-gray-200 rounded-[15px] w-[70px]"></div>
        </div>

        {/* Buttons */}
        <div className="flex gap-[10px] mt-auto pt-[10px]">
          <div className="flex-1 h-[44px] bg-gray-200 rounded-[4px]"></div>
          <div className="flex-1 h-[44px] bg-gray-300 rounded-[4px]"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
