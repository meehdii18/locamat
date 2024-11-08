import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bulma/css/bulma.css';
import './index.css';
import App from './App.jsx';
import { FirebaseProvider } from './FirebaseContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <FirebaseProvider>
            <App />
        </FirebaseProvider>
    </StrictMode>,
);