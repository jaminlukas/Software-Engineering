import React from 'react';
import FilterBar from './FilterBar';
import TicketGrid from './TicketGrid';
import Pagination from './Pagination';
import './HausmeisterView.css';

const HausmeisterView = ({
  title,
  // Ticket data
  tickets,
  ticketsStatus,
  meta,
  errorMessage,
  // Filter state and setters
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
  // Actions
  fetchTickets,
  onUpdateStatus,
  onArchive,
  onRestore,
  onTicketClick,
  updatingStatuses,
  // View type
  isArchived = false,
}) => {
  return (
    <div className="ticket-container">
      <h1>{title}</h1>
      <FilterBar
        search={search}
        setSearch={setSearch}
        filterRoom={filterRoom}
        setFilterRoom={setFilterRoom}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        sort={sort}
        setSort={setSort}
        onUpdate={() => fetchTickets({ page: 1 })}
        isUpdating={ticketsStatus === 'loading'}
        showStatusFilter={!isArchived}
      />
      <div role="status" aria-live="polite">
        {ticketsStatus === 'loading' && (
          <p className="info-text">
            Lade Tickets... <span className="spinner" />
          </p>
        )}
        {ticketsStatus === 'error' && (
          <p className="feedback error">{errorMessage || 'Fehler beim Laden der Tickets.'}</p>
        )}
      </div>
      {ticketsStatus === 'idle' && tickets.length === 0 && (
        <p className="info-text">Keine Tickets vorhanden.</p>
      )}
      {ticketsStatus === 'idle' && tickets.length > 0 && (
        <>
          <div className="ticket-meta">
            <span>Gefunden: {meta.total}</span>
            <Pagination meta={meta} onPageChange={(p) => fetchTickets({ page: p })} />
          </div>
          <TicketGrid
            tickets={tickets}
            onUpdateStatus={onUpdateStatus}
            onArchive={onArchive}
            onRestore={onRestore}
            onTicketClick={onTicketClick}
            updatingStatuses={updatingStatuses}
            isArchived={isArchived}
          />
        </>
      )}
    </div>
  );
};

export default HausmeisterView;
