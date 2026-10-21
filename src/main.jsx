import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { SimpleModeProvider } from './context/SimpleModeContext.jsx'
import { LabProvider } from './context/LabContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <SimpleModeProvider>
        <ThemeProvider>
          <LabProvider>
            <App />
          </LabProvider>
        </ThemeProvider>
      </SimpleModeProvider>
    </LanguageProvider>
  </StrictMode>,
)
