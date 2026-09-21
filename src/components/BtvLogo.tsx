interface BtvLogoProps {
  className?: string;
  height?: number | string;
}

export default function BtvLogo({ className = 'h-7 w-auto', height }: BtvLogoProps) {
  return (
    <svg
      viewBox="0 0 460 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
      style={height ? { height } : undefined}
      aria-label="BTVIZION Logo"
    >
      <text
        x="0"
        y="72"
        fill="currentColor"
        style={{
          fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif",
          fontWeight: 900,
          fontSize: '82px',
          letterSpacing: '-0.045em',
          textTransform: 'uppercase',
        }}
      >
        BTVIZION
      </text>
    </svg>
  );
}
