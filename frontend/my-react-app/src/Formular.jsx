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

  const [view, setView] = useState('reporter'); // reporter | hausmeister
  const [tickets, setTickets] = useState([]);
  const [ticketsStatus, setTicketsStatus] = useState('idle'); // idle | loading | error

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

  const fetchTickets = async () => {
    setTicketsStatus('loading');
    try {
      const res = await axios.get(API_URL);
      setTickets(res.data || []);
      setTicketsStatus('idle');
    } catch (error) {
      console.error('Fehler beim Laden der Tickets:', error);
      setTicketsStatus('error');
    }
  };

  useEffect(() => {
    if (view === 'hausmeister') {
      fetchTickets();
    }
  }, [view]);

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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="page">
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
            {ticketsStatus === 'loading' && <p className="info-text">Lade Tickets...</p>}
            {ticketsStatus === 'error' && <p className="feedback error">Fehler beim Laden der Tickets.</p>}
            {ticketsStatus === 'idle' && tickets.length === 0 && (
              <p className="info-text">Keine Tickets vorhanden.</p>
            )}
            {ticketsStatus === 'idle' && tickets.length > 0 && (
              <div className="ticket-grid">
                {tickets.map((ticket) => (
                  <div key={ticket.uuid} className="ticket-card">
                    <div className="ticket-header">
                      <span className="ticket-room">{ticket.raum}</span>
                      <span className="ticket-date">{formatDate(ticket.erstellt_am)}</span>
                    </div>
                    <p className="ticket-desc">{ticket.beschreibung}</p>
                    <p className="ticket-email">{ticket.email}</p>
                    {ticket.bild && (
                      <div className="ticket-image">
                        <img src={ticket.bild} alt={`Ticket ${ticket.uuid}`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Formular;
