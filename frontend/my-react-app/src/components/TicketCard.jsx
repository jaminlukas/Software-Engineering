import React from 'react';
import { formatDate } from '../utils';
import './TicketCard.css';

const TicketCard = ({
  ticket,
  onUpdateStatus,
  onArchive,
  onRestore,
  onClick,
  isUpdating,
  isArchived = false,
}) => {
  return (
    <div
      className={`ticket-card ${isArchived ? 'archived' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => onClick(ticket)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick(ticket);
      }}
    >
      <div className="ticket-header">
        <span className="ticket-room">{ticket.raum}</span>
        <span className="ticket-date">{formatDate(ticket.erstellt_am)}</span>
      </div>
      <div className="ticket-status" onClick={(e) => e.stopPropagation()}>
        {isArchived ? (
          <p>
            <strong>
              Status:{' '}
              {ticket.status === 'offen'
                ? 'Noch nicht angefangen'
                : ticket.status === 'in_bearbeitung'
                ? 'In Bearbeitung'
                : 'Fertig'}
            </strong>
          </p>
        ) : (
          <label>
            Status:{' '}
            <select
              value={ticket.status || 'offen'}
              onChange={(e) => onUpdateStatus(ticket.uuid, e.target.value)}
              disabled={isUpdating}
            >
              <option value="offen">Noch nicht angefangen</option>
              <option value="in_bearbeitung">In Bearbeitung</option>
              <option value="erledigt">Fertig</option>
            </select>
            {isUpdating && <span className="small-spinner" aria-hidden>⏳</span>}
          </label>
        )}
      </div>
      <p className="ticket-desc">{ticket.beschreibung}</p>
      <p className="ticket-email">{ticket.email}</p>
      {ticket.bild && (
        <div className="ticket-image">
          <img src={ticket.bild} alt={`Ticket ${ticket.uuid}`} />
        </div>
      )}
      <button
        className="archive-btn"
        onClick={(e) => {
          e.stopPropagation();
          isArchived ? onRestore(ticket.uuid) : onArchive(ticket.uuid);
        }}
        disabled={isUpdating}
      >
        {isUpdating
          ? isArchived
            ? 'Wird wiederhergestellt...'
            : 'Wird archiviert...'
          : isArchived
          ? 'Wiederherstellen'
          : 'Archivieren'}
      </button>
    </div>
  );
};

export default TicketCard;
