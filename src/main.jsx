import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as bootstrap from 'bootstrap';
import './styles/style.css';
import './styles/navbar.css';
import './styles/hero.css';
import './styles/sections.css';
import './styles/chatbot.css';
import './styles/responsive.css';
import './styles/reactBitsEnhancements.css';
import App from './App';

// The existing BudgetBasics feature controllers use Bootstrap's Collapse/Modal API.
// Keep that API available globally while the page itself is mounted by React.
window.bootstrap = bootstrap;

createRoot(document.getElementById('root')).render(<App />);
