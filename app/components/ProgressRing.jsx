export default function ProgressRing({ done, total }) {
  const pct = total === 0 ? 0 : done / total;
  const r = 54;
  const circumference = 2 * Math.PI * r;

  return (
    <div
      className="ring"
      role="img"
      aria-label={`${done} of ${total} tasks completed`}
    >
      <svg viewBox="0 0 132 132" width="132" height="132" aria-hidden="true">
        <circle className="ring-track" cx="66" cy="66" r={r} />
        <circle
          className="ring-value"
          cx="66"
          cy="66"
          r={r}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          transform="rotate(-90 66 66)"
        />
      </svg>
      <div className="ring-label">
        <strong>{Math.round(pct * 100)}%</strong>
        <span>complete</span>
      </div>
    </div>
  );
}
