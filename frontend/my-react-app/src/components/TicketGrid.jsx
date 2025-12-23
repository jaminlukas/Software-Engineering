import React from 'react';
import TicketCard from './TicketCard';

const TicketGrid = ({
  tickets,
  onUpdateStatus,
  onArchive,
  onRestore,
  onTicketClick,
  updatingStatuses,
  isArchived = false,
}) => {
  return (
    <div className="ticket-grid">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.uuid}
          ticket={ticket}
          onClick={onTicketClick}
          onUpdateStatus={onUpdateStatus}
          onArchive={onArchive}
          onRestore={onRestore}
          isUpdating={Boolean(updatingStatuses[ticket.uuid])}
          isArchived={isArchived}
        />
      ))}
    </div>
  );
};

export default TicketGrid;
