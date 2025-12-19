import React from 'react';
import './Pagination.css';

const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.total === 0) {
    return null;
  }

  const { page, perPage, total } = meta;
  const hasPrev = page > 1;
  const hasNext = page * perPage < total;

  return (
    <div className="pagination">
      <button disabled={!hasPrev} onClick={() => onPageChange(page - 1)}>
        &lt; Prev
      </button>
      <span>Seite {page}</span>
      <button disabled={!hasNext} onClick={() => onPageChange(page + 1)}>
        Next &gt;
      </button>
    </div>
  );
};

export default Pagination;
