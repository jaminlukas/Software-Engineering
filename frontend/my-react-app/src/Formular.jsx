/**
 * @file Formular.jsx
 * @description Enthält die React-Komponente für Schadensmeldung und Hausmeister-/Archiv-Ansicht.
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import DamageReportForm from './components/DamageReportForm';
import TicketListView from './components/HausmeisterView';
import TicketDetailsModal from './components/TicketDetailsView';
import TicketDetailsView from './components/TicketDetailsView';

const API_URL = '/api/reports';

function Formular() {
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
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sort, setSort] = useState('erstellt_am:desc');

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
    if (view === 'archive') {
      fetchArchiveTickets({ page: 1, limit: archiveMeta.perPage, sort });
    }
  }, [view]);

  useEffect(() => {
    if (view !== 'hausmeister') return undefined;
    const t = setTimeout(() => {
      fetchTickets({ page: 1, limit: meta.perPage, sort });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterRoom, filterStatus, fromDate, toDate, sort]);

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
    } catch {}
    try {
      document.documentElement.classList.toggle('dark', darkMode);
    } catch {}
  }, [darkMode]);

  const updateStatus = async (uuid, newStatus) => {
    setUpdatingStatuses((s) => ({ ...s, [uuid]: true }));
    const previous = tickets;
    setTickets((t) => t.map((x) => (x.uuid === uuid ? { ...x, status: newStatus } : x)));
    try {
      await axios.patch(`${API_URL}/${uuid}/status`, { status: newStatus });
      fetchTickets({ page: meta.page, limit: meta.perPage, sort });
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error);
      setErrorMessage(error?.response?.data?.message || 'Fehler beim Aktualisieren des Status');
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
      <Sidebar view={view} setView={setView} darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="content">
        {view === 'reporter' && (
          <DamageReportForm onSuccess={() => (view === 'hausmeister' ? fetchTickets() : null)} />
        )}
        {view === 'hausmeister' && (
          <TicketListView
            title="Gemeldete Tickets"
            tickets={tickets}
            ticketsStatus={ticketsStatus}
            meta={meta}
            errorMessage={errorMessage}
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
            fetchTickets={fetchTickets}
            onUpdateStatus={updateStatus}
            onArchive={archiveTicket}
            onTicketClick={setSelectedTicket}
            updatingStatuses={updatingStatuses}
            isArchived={false}
          />
        )}
        {view === 'archive' && (
          <TicketListView
            title="Archivierte Tickets"
            tickets={archiveTickets}
            ticketsStatus={ticketsStatus}
            meta={archiveMeta}
            errorMessage={errorMessage}
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
            fetchTickets={fetchArchiveTickets}
            onRestore={restoreTicket}
            onTicketClick={setSelectedTicket}
            updatingStatuses={updatingStatuses}
            isArchived={true}
          />
        )}
        <TicketDetailsView ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      </main>
    </div>
  );
}

export default Formular;