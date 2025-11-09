import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Formular from './Formular.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Formular />
  </StrictMode>,
)
