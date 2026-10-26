"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "brightedge.tasks.v1";

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [ready, setReady] = useState(false);

  // Load once on the client (localStorage does not exist on the server).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setTasks(parsed);
    } catch {
      /* corrupted or blocked storage: start empty */
    }
    setReady(true);
  }, []);

  // Save on every change, but only after the first load has finished.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      /* storage full or blocked: keep working in memory */
    }
  }, [tasks, ready]);

  const addTask = useCallback((title, description) => {
    setTasks((prev) => [
      { id: makeId(), title, description, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, []);

  return { tasks, ready, addTask, toggleTask, deleteTask, clearCompleted };
}
