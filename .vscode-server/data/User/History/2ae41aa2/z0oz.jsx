import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'

// Bootstrap (mantener por ahora, luego podemos quitarlo)
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Sistema de diseño global
import './styles/variables.css'
import './styles/utilities.css'

// Estilos base
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)