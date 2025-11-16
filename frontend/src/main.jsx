import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {AuthProvider} from "./contexts/AuthContext.jsx";
import {Toaster} from "react-hot-toast";
import {ConfirmProvider} from "./contexts/UseConfirm.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Toaster position="bottom-right" />
        <ConfirmProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ConfirmProvider>
    </StrictMode>
);