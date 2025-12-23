import React from 'react';
import { formatDate } from '../utils';
import './TicketDetailsView.css';

const TicketDetailsView = ({ ticket, onClose }) => {
  if (!ticket) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ticket-Details</h2>
          <button className="close-btn" onClick={onClose} aria-label="Schließen">
            ×
          </button>
        </div>
        <div className="modal-body">
          <p>
            <strong>Raum:</strong> {ticket.raum}
          </p>
          <p>
            <strong>E-Mail:</strong> {ticket.email}
          </p>
          <p>
            <strong>Erstellt am:</strong> {formatDate(ticket.erstellt_am)}
          </p>
          {ticket.status && (
            <p>
              <strong>Status:</strong> {ticket.status}
            </p>
          )}
          {ticket.archived && (
            <p>
              <strong>Archiviert:</strong> Ja
            </p>
          )}
          <p>
            <strong>Beschreibung:</strong>
          </p>
          <p className="modal-desc">{ticket.beschreibung}</p>
          {ticket.bild && (
            <div className="modal-image">
              <img src={ticket.bild} alt={`Ticket ${ticket.uuid}`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsView;
