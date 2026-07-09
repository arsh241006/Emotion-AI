interface LogoProps {
  size?: number;
  showWordmark?: boolean;
}

export function Logo({ size = 28, showWordmark = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
        <circle cx="22" cy="22" r="15" fill="none" stroke="#2A2A2E" strokeWidth="4" />
        <circle
          cx="22" cy="22" r="15" fill="none"
          stroke="#FF6A1A" strokeWidth="4"
          strokeDasharray="94.2" strokeDashoffset="66"
          strokeLinecap="round"
          transform="rotate(-90 22 22)"
        />
        <circle cx="22" cy="22" r="3" fill="#F5F5F5" />
      </svg>
      {showWordmark && (
        <span className="text-lg font-medium tracking-tight text-text-primary">
          emotion<span className="text-accent">ai</span>
        </span>
      )}
    </div>
  );
}