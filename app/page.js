'use client';

import { useEffect, useMemo, useState } from 'react';



const STORAGE_KEY = 'brightedge-tasks-v1';

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></>,
    list: <><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01" strokeWidth="3"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 13h11l1-13M9 7V4h6v3"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    sparkle: <><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  };
  return <svg {...common}>{paths[name] ?? paths.grid}</svg>;
}

function readSavedTasks() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
  setTasks(readSavedTasks());
  setGreeting(
    new Intl.DateTimeFormat('en', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(new Date())
  );
  setReady(true);
}, []);


  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const visibleTasks = useMemo(() => tasks
    .filter((task) => filter === 'all' || (filter === 'completed' ? task.completed : !task.completed))
    .filter((task) => `${task.title} ${task.description}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => Number(a.completed) - Number(b.completed) || b.createdAt - a.createdAt), [tasks, filter, query]);

  function addTask(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    setTasks((current) => [{ id: crypto.randomUUID(), title: cleanTitle, description: description.trim(), completed: false, createdAt: Date.now() }, ...current]);
    setTitle(''); setDescription(''); setFormOpen(false);
  }

  function toggleTask(id) { setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task)); }
  function deleteTask(id) { setTasks((current) => current.filter((task) => task.id !== id)); }
  function chooseFilter(next) { setFilter(next); setMobileNavOpen(false); }

  return (
    <main className="app-shell">
      {mobileNavOpen && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><span>be</span></div><div><strong>brightedge</strong><small>WORKSPACE</small></div><button className="mobile-close icon-button" onClick={() => setMobileNavOpen(false)} aria-label="Close menu"><Icon name="close"/></button></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <button className={`nav-item ${filter === 'all' ? 'active' : ''}`} onClick={() => chooseFilter('all')}><Icon name="grid"/><span>Overview</span><span className="nav-count">{tasks.length}</span></button>
          <button className={`nav-item ${filter === 'pending' ? 'active' : ''}`} onClick={() => chooseFilter('pending')}><Icon name="clock"/><span>In progress</span><span className="nav-count">{pending}</span></button>
          <button className={`nav-item ${filter === 'completed' ? 'active' : ''}`} onClick={() => chooseFilter('completed')}><Icon name="check"/><span>Completed</span><span className="nav-count">{completed}</span></button>
        </nav>
        <div className="sidebar-bottom"><div className="sidebar-tip"><div className="tip-icon"><Icon name="sparkle" size={18}/></div><strong>Small steps add up.</strong><p>{pending ? `You have ${pending} ${pending === 1 ? 'task' : 'tasks'} left to complete.` : tasks.length ? 'Everything is checked off. Great work!' : 'Add a task to get your day moving.'}</p><div className="tip-progress"><span style={{ width: `${percent}%` }}/></div><small>{percent}% complete</small></div><div className="profile"><div className="avatar">JG</div><div className="profile-copy"><strong>Jordan Green</strong><span>Team member</span></div><span className="online-dot"/></div></div>
      </aside>

      <section className="main-panel">
        <header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Icon name="menu"/></button><div className="breadcrumb">Workspace <span>/</span> <strong>{filter === 'all' ? 'Overview' : filter === 'pending' ? 'In progress' : 'Completed'}</strong></div><div className="topbar-right"><div className="date-chip"><span className="date-dot"/>{greeting}</div><div className="avatar avatar-small">JG</div></div></header>

        <div className="content-wrap">
          <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR TASK SPACE</div><h1>Good work starts<br className="mobile-break"/> with a clear plan<span>.</span></h1><p className="welcome-subtitle">A little progress each day adds up to big results.</p></div><button className="primary-button add-top" onClick={() => setFormOpen(true)}><Icon name="plus" size={18}/> New task</button></section>

          <section className="stats-grid" aria-label="Task summary">
            <article className="stat-card stat-total"><div className="stat-heading"><span>Total tasks</span><span className="stat-icon violet"><Icon name="list" size={18}/></span></div><div className="stat-number">{tasks.length}</div><div className="stat-foot"><span className="status-dot purple-dot"/> Across your workspace</div></article>
            <article className="stat-card"><div className="stat-heading"><span>In progress</span><span className="stat-icon amber"><Icon name="clock" size={18}/></span></div><div className="stat-number">{pending}</div><div className="stat-foot"><span className="status-dot amber-dot"/> Ready for your attention</div></article>
            <article className="stat-card"><div className="stat-heading"><span>Completed</span><span className="stat-icon green"><Icon name="check" size={18}/></span></div><div className="stat-number">{completed}</div><div className="stat-foot"><span className="status-dot green-dot"/> Nicely done</div></article>
            <article className="stat-card progress-card"><div className="stat-heading"><span>Completion rate</span><span className="stat-icon blue"><Icon name="sparkle" size={18}/></span></div><div className="progress-value">{percent}<small>%</small></div><div className="meter"><span style={{ width: `${percent}%` }}/></div><div className="stat-foot">Your momentum, at a glance</div></article>
          </section>

          <section className="task-section">
            <div className="section-heading"><div><div className="section-kicker">YOUR DAY, ORGANIZED</div><h2>Tasks <span className="task-total-pill">{tasks.length}</span></h2></div><button className="primary-button add-inline" onClick={() => setFormOpen(true)}><Icon name="plus" size={18}/> Add a task</button></div>
            <div className="task-toolbar"><div className="filter-tabs" role="tablist" aria-label="Filter tasks"><button className={filter === 'all' ? 'selected' : ''} onClick={() => chooseFilter('all')}>All <span>{tasks.length}</span></button><button className={filter === 'pending' ? 'selected' : ''} onClick={() => chooseFilter('pending')}>In progress <span>{pending}</span></button><button className={filter === 'completed' ? 'selected' : ''} onClick={() => chooseFilter('completed')}>Completed <span>{completed}</span></button></div><label className="search-box"><Icon name="search" size={17}/><input aria-label="Search tasks" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks"/><kbd>⌘ K</kbd></label></div>

            {formOpen && <form className="task-form" onSubmit={addTask}><div className="form-header"><div><strong>Create a task</strong><p>Keep it clear and actionable.</p></div><button type="button" className="icon-button" aria-label="Close form" onClick={() => setFormOpen(false)}><Icon name="close" size={18}/></button></div><label className="field-label" htmlFor="task-title">Task title</label><input id="task-title" autoFocus required maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Prepare the weekly team report"/><label className="field-label" htmlFor="task-description">Description <span>Optional</span></label><textarea id="task-description" rows={3} maxLength={400} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add a little context or a next step..."/><div className="form-actions"><button className="text-button" type="button" onClick={() => setFormOpen(false)}>Cancel</button><button className="primary-button" type="submit"><Icon name="plus" size={17}/> Create task</button></div></form>}

            <div className="task-list">
              {!ready ? <div className="loading-state">Loading your workspace…</div> : visibleTasks.length ? visibleTasks.map((task) => <article className={`task-row ${task.completed ? 'is-completed' : ''}`} key={task.id}><button className={`task-check ${task.completed ? 'checked' : ''}`} onClick={() => toggleTask(task.id)} aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}><Icon name="check" size={16}/></button><div className="task-copy"><h3>{task.title}</h3>{task.description && <p>{task.description}</p>}</div><span className={`task-status ${task.completed ? 'done' : 'todo'}`}><i/> {task.completed ? 'Completed' : 'In progress'}</span><button className="delete-button" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`} title="Delete task"><Icon name="trash" size={18}/></button></article>) : <div className="empty-state"><div className="empty-icon"><Icon name={query ? 'search' : filter === 'completed' ? 'check' : 'sparkle'} size={23}/></div><h3>{query ? 'No matching tasks' : filter === 'completed' ? 'Nothing completed yet' : filter === 'pending' ? 'You’re all caught up' : 'A fresh page'}</h3><p>{query ? 'Try another search term.' : filter === 'all' ? 'Add your first task and turn a plan into progress.' : filter === 'pending' ? 'There are no tasks waiting for you right now.' : 'Completed tasks will show up here.'}</p>{filter === 'all' && !query && <button className="text-link" onClick={() => setFormOpen(true)}>Create your first task <Icon name="arrow" size={16}/></button>}</div>}
            </div>
            <div className="list-footer"><span>Showing {visibleTasks.length} of {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span><span><span className="footer-dot"/> Saved on this device</span></div>
          </section>
          <footer className="page-footer"><span>Made for thoughtful work.</span><span>BrightEdge <b>·</b> Personal workspace</span></footer>
        </div>
      </section>
    </main>
  );
}
