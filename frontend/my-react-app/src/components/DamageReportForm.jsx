import { useState } from 'react';
import axios from 'axios';
import './DamageReportForm.css';

const API_URL = '/api/reports';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FeedbackPanel = ({ status }) => {
  if (status === 'success') {
    return <p className="feedback success">Meldung erfolgreich gesendet!</p>;
  }
  if (status === 'error') {
    return <p className="feedback error">Fehler beim Senden. Bitte prüfe deine Eingaben.</p>;
  }
  return null;
};

const DamageReportForm = ({ onSuccess }) => {
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [imageData, setImageData] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

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
        onSuccess();
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Fehler beim Senden der Daten:', error);
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
  );
};

export default DamageReportForm;
