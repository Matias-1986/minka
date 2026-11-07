import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import BackofficeApp from './BackofficeApp.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BackofficeApp />
    </AuthProvider>
  </StrictMode>,
)
