"use client";

import { useMemo, useState } from "react";
import { useTasks } from "../hooks/useTasks";
import Sidebar from "./Sidebar";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

const TITLES = {
  all: "All tasks",
  active: "Open tasks",
  completed: "Completed tasks",
};

export default function TaskApp() {
  const { tasks, ready, addTask, toggleTask, deleteTask, clearCompleted } = useTasks();
  const [filter, setFilter] = useState("all");

  const counts = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    return { all: tasks.length, active: tasks.length - completed, completed };
  }, [tasks]);

  const visible = useMemo(
    () =>
      tasks.filter((t) =>
        filter === "all" ? true : filter === "completed" ? t.completed : !t.completed
      ),
    [tasks, filter]
  );

  return (
    <div className="app">
      <Sidebar filter={filter} onFilter={setFilter} counts={counts} />

      <main className="main">
        <header className="main-head">
          <div>
            <h1>{TITLES[filter]}</h1>
            <p className="muted">
              {counts.active} open, {counts.completed} completed
            </p>
          </div>
          {counts.completed > 0 && (
            <button className="btn-quiet" onClick={clearCompleted}>
              Clear completed
            </button>
          )}
        </header>

        <TaskForm onAdd={addTask} />

        {ready && (
          <TaskList
            tasks={visible}
            filter={filter}
            hasAny={tasks.length > 0}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        )}
      </main>
    </div>
  );
}
