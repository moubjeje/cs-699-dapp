import React from 'react';
import { createRoot } from 'react-dom/client'
import { initializeWeb3} from './api';
import App from './App'
import './index.css'

initializeWeb3()
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
