import React from 'react';
import './Sidebar.css';

const Sidebar = ({ view, setView, darkMode, setDarkMode }) => {
  return (
    <aside className="sidebar">
      <button
        className={`nav-btn ${view === 'reporter' ? 'active' : ''}`}
        onClick={() => setView('reporter')}
      >
        Schaden melden
      </button>

      <button
        className={`nav-btn ${view === 'hausmeister' ? 'active' : ''}`}
        onClick={() => setView('hausmeister')}
      >
        Hausmeister-Ansicht
      </button>

      <button
        className={`nav-btn ${view === 'archive' ? 'active' : ''}`}
        onClick={() => setView('archive')}
      >
        Archiv
      </button>
      
      <button
          className="nav-btn theme-toggle"
          onClick={() => setDarkMode((d) => !d)}
          aria-pressed={darkMode}
        >
          {darkMode ? 'Hellmodus' : 'Dunkelmodus'}
      </button>
    </aside>
  );
};

export default Sidebar;
