import React, { useState } from 'react';
import { Car } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Automotive Photograph',
  className = '',
  fallbackText,
  loading = 'lazy',
  decoding = 'async',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-[#121418] border border-white/5 text-white/40 p-4 select-none ${className}`}>
        <Car className="w-8 h-8 text-[#c5a880]/50 mb-2 stroke-[1.5]" />
        <span className="text-[9px] uppercase tracking-[0.25em] text-[#9ea3ae] text-center font-mono max-w-[90%] truncate">
          {fallbackText || alt || 'Maison Motors Verified'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onError={() => setHasError(true)}
      className={className}
      {...props}
    />
  );
};
