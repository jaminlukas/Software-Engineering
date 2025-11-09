/**
 * @file Formular.jsx
 * @description Enthält die React-Komponente für das Schadensmeldungsformular.
 */

import { useState } from 'react';
import axios from 'axios';
import './Formular.css';

const API_URL = '/api/reports';

/**
 * Eine Komponente, die je nach Status eine Erfolgs- oder Fehlermeldung anzeigt.
 * @param {{status: 'idle' | 'sending' | 'success' | 'error'}} props - Der aktuelle Übertragungsstatus.
 * @returns {JSX.Element | null}
 */
const FeedbackPanel = ({ status }) => {
  if (status === 'success') {
    return <p className="feedback success">✓ Meldung erfolgreich gesendet!</p>;
  }
  if (status === 'error') {
    return <p className="feedback error">✗ Fehler beim Senden. Bitte versuche es erneut.</p>;
  }
  return null;
};

/**
 * Die Hauptkomponente, die das Formular zum Melden von Schäden rendert.
 * @returns {JSX.Element}
 */
function Formular() {
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('idle');

  const isSending = status === 'sending';

  /**
   * Behandelt das Absenden des Formulars.
   * Sendet die Daten an das Backend und aktualisiert den Status.
   * @param {React.FormEvent<HTMLFormElement>} event - Das Formular-Event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');

    try {
      const response = await axios.post(API_URL, {
        raum: room,
        beschreibung: description,
      });

      if (response.status === 201) {
        setStatus('success');
        setRoom('');
        setDescription('');
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        // Dieser Fall tritt selten ein, da axios bei Fehlern (z.B. 4xx, 5xx) einen Error wirft
        setStatus('error');
      }
    } catch (error) {
      console.error("Fehler beim Senden der Daten:", error);
      setStatus('error');
    }
  };

  return (
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
        <button type="submit" disabled={isSending}>
          {isSending ? 'Wird gesendet...' : 'Meldung absenden'}
        </button>
        <FeedbackPanel status={status} />
      </form>
    </div>
  );
}

export default Formular;
