import btvLogoPng from '../assets/images/btv-logo.png';

interface BtvLogoProps {
  className?: string;
  height?: number | string;
  alt?: string;
}

export default function BtvLogo({
  className = 'h-[20.4px] sm:h-[23.8px] w-auto',
  height,
  alt = 'BT VIZION',
}: BtvLogoProps) {
  return (
    <img
      src={btvLogoPng}
      alt={alt}
      className={`inline-block select-none object-contain brightness-100 ${className}`}
      style={height ? { height } : undefined}
      loading="eager"
      decoding="async"
    />
  );
}

