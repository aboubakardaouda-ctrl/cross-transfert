export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-px w-12 bg-[#C9A96E]" />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z"
          fill="#C9A96E"
          opacity="0.8"
        />
      </svg>
      <div className="h-px w-12 bg-[#C9A96E]" />
    </div>
  );
}

export function ChinesePattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      opacity="0.06"
    >
      <circle cx="100" cy="100" r="90" stroke="#C9A96E" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="70" stroke="#C9A96E" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="50" stroke="#C9A96E" strokeWidth="0.5" />
      {[0, 45, 90, 135].map((angle) => (
        <line
          key={angle}
          x1={100 + 90 * Math.cos((angle * Math.PI) / 180)}
          y1={100 + 90 * Math.sin((angle * Math.PI) / 180)}
          x2={100 - 90 * Math.cos((angle * Math.PI) / 180)}
          y2={100 - 90 * Math.sin((angle * Math.PI) / 180)}
          stroke="#C9A96E"
          strokeWidth="0.5"
        />
      ))}
      {[22.5, 67.5, 112.5, 157.5].map((angle) => (
        <line
          key={angle}
          x1={100 + 70 * Math.cos((angle * Math.PI) / 180)}
          y1={100 + 70 * Math.sin((angle * Math.PI) / 180)}
          x2={100 - 70 * Math.cos((angle * Math.PI) / 180)}
          y2={100 - 70 * Math.sin((angle * Math.PI) / 180)}
          stroke="#C9A96E"
          strokeWidth="0.3"
        />
      ))}
    </svg>
  );
}

export function CloudMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="120"
      height="40"
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 30 Q20 10 30 30 Q40 10 50 30 Q60 10 70 30 Q80 10 90 30 Q100 10 110 30"
        stroke="#C9A96E"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}
