import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { SimpleModeProvider } from './context/SimpleModeContext.jsx'
import { LabProvider } from './context/LabContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <SimpleModeProvider>
    <ThemeProvider>
      <LabProvider>
        <App />
      </LabProvider>
    </ThemeProvider>
  </SimpleModeProvider>
  </StrictMode>,
)
