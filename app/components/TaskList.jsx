import TaskItem from "./TaskItem";

function emptyMessage(filter, hasAny) {
  if (!hasAny) return "No tasks yet. Add your first task above.";
  if (filter === "active") return "Nothing open. Everything is done.";
  if (filter === "completed") return "No completed tasks yet.";
  return "No tasks to show.";
}

export default function TaskList({ tasks, filter, hasAny, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty">{emptyMessage(filter, hasAny)}</p>;
  }
  return (
    <ul className="list">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}
