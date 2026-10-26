import ProgressRing from "./ProgressRing";

const ITEMS = [
  { key: "all", label: "All tasks" },
  { key: "active", label: "Open" },
  { key: "completed", label: "Completed" },
];

export default function Sidebar({ filter, onFilter, counts }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <span>BrightEdge Tasks</span>
      </div>

      <ProgressRing done={counts.completed} total={counts.all} />

      <nav className="nav" aria-label="Task views">
        {ITEMS.map((item) => (
          <button
            key={item.key}
            className="nav-item"
            aria-current={filter === item.key ? "page" : undefined}
            onClick={() => onFilter(item.key)}
          >
            <span>{item.label}</span>
            <span className="nav-count">{counts[item.key]}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
