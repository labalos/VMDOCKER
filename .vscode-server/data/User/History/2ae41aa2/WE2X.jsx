import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'

// Sistema de diseño global BuildPro
import './styles/variables.css'
import './styles/utilities.css'

// Estilos base
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)