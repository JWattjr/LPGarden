import Image from "next/image";

interface TokenIconProps {
  src: string;
  symbol: string;
  size?: number;
  className?: string;
}

export function TokenIcon({ src, symbol, size = 32, className = "" }: TokenIconProps) {
  return (
    <Image
      src={src}
      alt={symbol}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      unoptimized // CDN images, skip Next.js optimization
    />
  );
}
