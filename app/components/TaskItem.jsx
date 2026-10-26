"use client";

import { useState } from "react";

export default function TaskItem({ task, onToggle, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const added = new Date(task.createdAt).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <li className={`task${task.completed ? " is-done" : ""}`}>
      <label className="check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" as completed`}
        />
        <span className="check-box" aria-hidden="true" />
      </label>

      <div className="task-body">
        <p className="task-title">{task.title}</p>
        {task.description && <p className="task-desc">{task.description}</p>}
        <p className="task-meta">Added {added}</p>
      </div>

      <div className="task-actions">
        {confirming ? (
          <>
            <button className="btn-danger" onClick={() => onDelete(task.id)}>
              Delete
            </button>
            <button className="btn-quiet" onClick={() => setConfirming(false)}>
              Keep
            </button>
          </>
        ) : (
          <button
            className="btn-quiet"
            onClick={() => setConfirming(true)}
            aria-label={`Delete "${task.title}"`}
          >
            Delete
          </button>
        )}
      </div>
    </li>
  );
}
