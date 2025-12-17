/**
 * @file Formular.jsx
 * @description Enthält die React-Komponente für Schadensmeldung und Hausmeister-Ansicht.
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import './Formular.css';

const API_URL = '/api/reports';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Feedback-Anzeige für Form-Status.
 */
const FeedbackPanel = ({ status }) => {
  if (status === 'success') {
    return <p className="feedback success">Meldung erfolgreich gesendet!</p>;
  }
  if (status === 'error') {
    return <p className="feedback error">Fehler beim Senden. Bitte prüfe deine Eingaben.</p>;
  }
  return null;
};

function Formular() {
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [imageData, setImageData] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const [view, setView] = useState('reporter'); // reporter | hausmeister | archive
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('darkMode') === 'true';
    } catch {
      return false;
    }
  });
  const [tickets, setTickets] = useState([]);
  const [ticketsStatus, setTicketsStatus] = useState('idle'); // idle | loading | error
  const [meta, setMeta] = useState({ total: 0, page: 1, perPage: 20 });
  const [errorMessage, setErrorMessage] = useState('');
  const [updatingStatuses, setUpdatingStatuses] = useState({});
  const [archiveTickets, setArchiveTickets] = useState([]);
  const [archiveMeta, setArchiveMeta] = useState({ total: 0, page: 1, perPage: 20 });

  // Filter states
  const [search, setSearch] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sort, setSort] = useState('erstellt_am:desc');

  const isSending = status === 'sending';

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImageData('');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageData(reader.result?.toString() || '');
    };
    reader.readAsDataURL(file);
  };

  const fetchTickets = async (opts = {}) => {
    setTicketsStatus('loading');
    setErrorMessage('');
    try {
      const params = {
        page: opts.page || meta.page || 1,
        limit: opts.limit || meta.perPage || 20,
        sort: opts.sort || sort,
        archived: false,
      };
      if (search) params.q = search;
      if (filterRoom) params.raum = filterRoom;
      if (filterStatus) params.status = filterStatus;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const res = await axios.get(API_URL, { params });
      if (res.data) {
        setTickets(res.data.data || []);
        setMeta(res.data.meta || { total: 0, page: params.page, perPage: params.limit });
      } else {
        setTickets([]);
        setMeta({ total: 0, page: params.page, perPage: params.limit });
      }
      setTicketsStatus('idle');
    } catch (error) {
      console.error('Fehler beim Laden der Tickets:', error);
      setErrorMessage(error?.response?.data?.message || error.message || 'Fehler beim Laden der Tickets');
      setTicketsStatus('error');
    }
  };

  const fetchArchiveTickets = async (opts = {}) => {
    setTicketsStatus('loading');
    setErrorMessage('');
    try {
      const params = {
        page: opts.page || archiveMeta.page || 1,
        limit: opts.limit || archiveMeta.perPage || 20,
        sort: sort,
        archived: true,
      };
      if (search) params.q = search;
      if (filterRoom) params.raum = filterRoom;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const res = await axios.get(API_URL, { params });
      if (res.data) {
        setArchiveTickets(res.data.data || []);
        setArchiveMeta(res.data.meta || { total: 0, page: params.page, perPage: params.limit });
      } else {
        setArchiveTickets([]);
        setArchiveMeta({ total: 0, page: params.page, perPage: params.limit });
      }
      setTicketsStatus('idle');
    } catch (error) {
      console.error('Fehler beim Laden der Archive-Tickets:', error);
      setErrorMessage(error?.response?.data?.message || error.message || 'Fehler beim Laden der Archive-Tickets');
      setTicketsStatus('error');
    }
  };

  useEffect(() => {
    if (view === 'hausmeister') {
      fetchTickets({ page: 1, limit: meta.perPage, sort });
    }
  }, [view]);

  // Debounced search / filter effect
  useEffect(() => {
    if (view !== 'hausmeister') return undefined;
    const t = setTimeout(() => {
      fetchTickets({ page: 1, limit: meta.perPage, sort });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterRoom, filterStatus, fromDate, toDate, sort]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!emailRegex.test(email)) {
      setStatus('error');
      return;
    }

    setStatus('sending');

    try {
      const response = await axios.post(API_URL, {
        raum: room,
        beschreibung: description,
        email,
        bild: imageData,
      });

      if (response.status === 201) {
        setStatus('success');
        setRoom('');
        setDescription('');
        setEmail('');
        setImageData('');
        if (view === 'hausmeister') {
          fetchTickets();
        }
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Fehler beim Senden der Daten:', error);
      setStatus('error');
    }
  };

  const handleToggleView = () => {
    setView((prev) => (prev === 'reporter' ? 'hausmeister' : 'reporter'));
  };

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
    } catch {}
    try {
      document.documentElement.classList.toggle('dark', darkMode);
    } catch {}
  }, [darkMode]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const updateStatus = async (uuid, newStatus) => {
    // prevent concurrent updates for the same ticket
    setUpdatingStatuses((s) => ({ ...s, [uuid]: true }));
    const previous = tickets;
    // optimistic update
    setTickets((t) => t.map((x) => (x.uuid === uuid ? { ...x, status: newStatus } : x)));
    try {
      await axios.patch(`${API_URL}/${uuid}/status`, { status: newStatus });
      // refresh current page
      fetchTickets({ page: meta.page, limit: meta.perPage, sort });
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error);
      setErrorMessage(error?.response?.data?.message || 'Fehler beim Aktualisieren des Status');
      // revert optimistic update
      setTickets(previous);
    } finally {
      setUpdatingStatuses((s) => {
        const copy = { ...s };
        delete copy[uuid];
        return copy;
      });
    }
  };

  const archiveTicket = async (uuid) => {
    setUpdatingStatuses((s) => ({ ...s, [uuid]: true }));
    try {
      await axios.patch(`${API_URL}/${uuid}/archive`, { archived: true });
      // Ticket aus der aktuellen Liste entfernen
      setTickets((t) => t.filter((x) => x.uuid !== uuid));
      setMeta((m) => ({ ...m, total: m.total - 1 }));
    } catch (error) {
      console.error('Fehler beim Archivieren des Tickets:', error);
      setErrorMessage(error?.response?.data?.message || 'Fehler beim Archivieren des Tickets');
    } finally {
      setUpdatingStatuses((s) => {
        const copy = { ...s };
        delete copy[uuid];
        return copy;
      });
    }
  };

  const restoreTicket = async (uuid) => {
    setUpdatingStatuses((s) => ({ ...s, [uuid]: true }));
    try {
      await axios.patch(`${API_URL}/${uuid}/archive`, { archived: false });
      // Ticket aus der Archivliste entfernen
      setArchiveTickets((t) => t.filter((x) => x.uuid !== uuid));
      setArchiveMeta((m) => ({ ...m, total: m.total - 1 }));
    } catch (error) {
      console.error('Fehler beim Wiederherstellen des Tickets:', error);
      setErrorMessage(error?.response?.data?.message || 'Fehler beim Wiederherstellen des Tickets');
    } finally {
      setUpdatingStatuses((s) => {
        const copy = { ...s };
        delete copy[uuid];
        return copy;
      });
    }
  };

  return (
    <div className={`page ${darkMode ? 'dark' : ''}`}>
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
        <div style={{ marginTop: '0.5rem' }}>
          <button
            className="nav-btn theme-toggle"
            onClick={() => setDarkMode((d) => !d)}
            aria-pressed={darkMode}
          >
            {darkMode ? 'Hellmodus' : 'Dunkelmodus'}
          </button>
        </div>
      </aside>

      <main className="content">
        {view === 'reporter' && (
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <h1>Schaden melden</h1>
              <div className="form-group">
                <label htmlFor="room">Raum oder Ort</label>
                <input
                  type="text"
                  id="room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="z.B. Raum 3.10, Bibliothek"
                  required
                  disabled={isSending}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-Mail</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="z.B. name@hochschule.de"
                  required
                  disabled={isSending}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Beschreibung des Schadens</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="z.B. Beamer funktioniert nicht, Stuhlbein gebrochen"
                  required
                  disabled={isSending}
                />
              </div>
              <div className="form-group">
                <label htmlFor="image">Bild hinzufügen (optional)</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isSending}
                />
              </div>
              <button type="submit" disabled={isSending}>
                {isSending ? 'Wird gesendet...' : 'Meldung absenden'}
              </button>
              <FeedbackPanel status={status} />
            </form>
          </div>
        )}

        {view === 'hausmeister' && (
          <div className="ticket-container">
            <h1>Gemeldete Tickets</h1>
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
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Alle Status</option>
                <option value="offen">Noch nicht angefangen</option>
                <option value="in_bearbeitung">In Bearbeitung</option>
                <option value="erledigt">Fertig</option>
              </select>
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
                <option value="raum:asc">Raum A→Z</option>
              </select>
              <button type="button" onClick={() => fetchTickets({ page: 1 })} disabled={ticketsStatus === 'loading'}>Aktualisieren</button>
            </div>
            <div role="status" aria-live="polite">
              {ticketsStatus === 'loading' && <p className="info-text">Lade Tickets... <span className="spinner"/></p>}
              {ticketsStatus === 'error' && <p className="feedback error">{errorMessage || 'Fehler beim Laden der Tickets.'}</p>}
            </div>
            {ticketsStatus === 'idle' && tickets.length === 0 && (
              <p className="info-text">Keine Tickets vorhanden.</p>
            )}
            {ticketsStatus === 'idle' && tickets.length > 0 && (
              <>
                <div className="ticket-meta">
                  <span>Gefunden: {meta.total}</span>
                  <div className="pagination">
                    <button disabled={meta.page <= 1} onClick={() => fetchTickets({ page: meta.page - 1 })}>&lt; Prev</button>
                    <span>Seite {meta.page}</span>
                    <button disabled={meta.page * meta.perPage >= meta.total} onClick={() => fetchTickets({ page: meta.page + 1 })}>Next &gt;</button>
                  </div>
                </div>
                <div className="ticket-grid">
                {tickets.map((ticket) => (
                  <div key={ticket.uuid} className="ticket-card">
                    <div className="ticket-header">
                      <span className="ticket-room">{ticket.raum}</span>
                      <span className="ticket-date">{formatDate(ticket.erstellt_am)}</span>
                    </div>
                    <div className="ticket-status">
                      <label>
                        Status:{' '}
                        <select
                          value={ticket.status || 'offen'}
                          onChange={(e) => updateStatus(ticket.uuid, e.target.value)}
                          disabled={Boolean(updatingStatuses[ticket.uuid]) || ticketsStatus === 'loading'}
                        >
                          <option value="offen">Noch nicht angefangen</option>
                          <option value="in_bearbeitung">In Bearbeitung</option>
                          <option value="erledigt">Fertig</option>
                        </select>
                        {updatingStatuses[ticket.uuid] && <span className="small-spinner" aria-hidden>…</span>}
                      </label>
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
                      onClick={() => archiveTicket(ticket.uuid)}
                      disabled={updatingStatuses[ticket.uuid]}
                    >
                      {updatingStatuses[ticket.uuid] ? 'Wird archiviert...' : 'Archivieren'}
                    </button>
                  </div>
                ))}
              </div>
                </>
            )}
          </div>
        )}

        {view === 'archive' && (
          <div className="ticket-container">
            <h1>Archivierte Tickets</h1>
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
                <option value="raum:asc">Raum A→Z</option>
              </select>
              <button type="button" onClick={() => fetchArchiveTickets({ page: 1 })} disabled={ticketsStatus === 'loading'}>Aktualisieren</button>
            </div>
            <div role="status" aria-live="polite">
              {ticketsStatus === 'loading' && <p className="info-text">Lade Archive-Tickets... <span className="spinner"/></p>}
              {ticketsStatus === 'error' && <p className="feedback error">{errorMessage || 'Fehler beim Laden der Archive-Tickets.'}</p>}
            </div>
            {ticketsStatus === 'idle' && archiveTickets.length === 0 && (
              <p className="info-text">Keine archivierten Tickets vorhanden.</p>
            )}
            {ticketsStatus === 'idle' && archiveTickets.length > 0 && (
              <>
                <div className="ticket-meta">
                  <span>Gefunden: {archiveMeta.total}</span>
                  <div className="pagination">
                    <button disabled={archiveMeta.page <= 1} onClick={() => fetchArchiveTickets({ page: archiveMeta.page - 1 })}>&lt; Prev</button>
                    <span>Seite {archiveMeta.page}</span>
                    <button disabled={archiveMeta.page * archiveMeta.perPage >= archiveMeta.total} onClick={() => fetchArchiveTickets({ page: archiveMeta.page + 1 })}>Next &gt;</button>
                  </div>
                </div>
                <div className="ticket-grid">
                {archiveTickets.map((ticket) => (
                  <div key={ticket.uuid} className="ticket-card archived">
                    <div className="ticket-header">
                      <span className="ticket-room">{ticket.raum}</span>
                      <span className="ticket-date">{formatDate(ticket.erstellt_am)}</span>
                    </div>
                    <div className="ticket-status">
                      <p><strong>Status: {ticket.status === 'offen' ? 'Noch nicht angefangen' : ticket.status === 'in_bearbeitung' ? 'In Bearbeitung' : 'Fertig'}</strong></p>
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
                      onClick={() => restoreTicket(ticket.uuid)}
                      disabled={updatingStatuses[ticket.uuid]}
                    >
                      {updatingStatuses[ticket.uuid] ? 'Wird wiederhergestellt...' : 'Wiederherstellen'}
                    </button>
                  </div>
                ))}
              </div>
                </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Formular;
