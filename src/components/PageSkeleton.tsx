import React from 'react';

export const PageSkeleton: React.FC = () => {
  return (
    <div className="w-full min-h-[70vh] bg-[#0b0c0e] py-16 px-6 sm:px-12 max-w-[1500px] mx-auto animate-pulse select-none">
      {/* Header bar skeleton */}
      <div className="h-4 w-28 bg-white/[0.06] rounded mb-8" />
      
      {/* Big title skeleton */}
      <div className="h-10 w-72 sm:w-96 bg-white/[0.08] rounded mb-4" />
      <div className="h-4 w-60 bg-white/[0.04] rounded mb-12" />

      {/* Grid of placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#121418] border border-white/[0.04] p-4">
            <div className="aspect-[16/10] bg-white/[0.03] mb-4" />
            <div className="h-4 w-3/4 bg-white/[0.06] rounded mb-2" />
            <div className="h-3 w-1/2 bg-white/[0.04] rounded mb-4" />
            <div className="h-6 w-1/3 bg-white/[0.05] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};
