
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from "./contexts/LanguageContext";
import { DataProvider } from "./contexts/DataContext";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <DataProvider>
      <App />
    </DataProvider>
  </LanguageProvider>
);
