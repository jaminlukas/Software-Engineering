import React from 'react';
import './FilterBar.css';

const FilterBar = ({
  search,
  setSearch,
  filterRoom,
  setFilterRoom,
  filterStatus,
  setFilterStatus,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  sort,
  setSort,
  onUpdate,
  isUpdating,
  showStatusFilter = true,
}) => {
  return (
    <div className="filter-bar">
      <input
        aria-label="Suche"
        placeholder="Suche (Beschreibung, E-Mail, Raum)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <input
        aria-label="Raum filtern"
        placeholder="Raum"
        value={filterRoom}
        onChange={(e) => setFilterRoom(e.target.value)}
      />
      {showStatusFilter && (
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Alle Status</option>
          <option value="offen">Noch nicht angefangen</option>
          <option value="in_bearbeitung">In Bearbeitung</option>
          <option value="erledigt">Fertig</option>
        </select>
      )}
      <label className="date-label">
        Von
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
      </label>
      <label className="date-label">
        Bis
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </label>
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="erstellt_am:desc">Neueste</option>
        <option value="erstellt_am:asc">Älteste</option>
        <option value="raum:asc">Raum A-Z</option>
      </select>
      <button type="button" onClick={onUpdate} disabled={isUpdating}>
        Aktualisieren
      </button>
    </div>
  );
};

export default FilterBar;
