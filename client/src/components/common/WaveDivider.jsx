export default function WaveDivider({ from = "cream", to = "white", variant = "one" }) {
  const fill = to === "white" ? "#ffffff" : "#FAF7F2";
  return (
    <div className={`wave-wrap bg-${from}`}>
      <svg viewBox="0 0 1200 64" preserveAspectRatio="none" aria-hidden="true">
        {variant === "one" ? (
          <path d="M0,0 C220,64 480,64 720,28 C920,-8 1060,52 1200,22 L1200,64 L0,64 Z" fill={fill} />
        ) : (
          <path d="M0,38 C280,60 560,8 880,44 C1040,58 1140,20 1200,34 L1200,60 L0,60 Z" fill={fill} />
        )}
      </svg>
    </div>
  );
}
