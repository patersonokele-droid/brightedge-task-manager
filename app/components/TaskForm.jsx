"use client";

import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      setError("Enter a title to add this task.");
      return;
    }
    onAdd(t, description.trim());
    setTitle("");
    setDescription("");
    setError("");
  }

  return (
    <form className="composer" onSubmit={handleSubmit} noValidate>
      <label className="sr-only" htmlFor="task-title">Task title</label>
      <input
        id="task-title"
        className="composer-title"
        placeholder="What needs to be done?"
        maxLength={120}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (error) setError("");
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "task-error" : undefined}
      />
      <label className="sr-only" htmlFor="task-desc">Description (optional)</label>
      <textarea
        id="task-desc"
        className="composer-desc"
        placeholder="Add details (optional)"
        maxLength={500}
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="composer-foot">
        <p id="task-error" className="form-error" role="alert">{error}</p>
        <button type="submit" className="btn-primary">Add task</button>
      </div>
    </form>
  );
}
