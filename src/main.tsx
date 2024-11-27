import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import './index.css'

// biome-ignore lint/style/noNonNullAssertion: root element is always present
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>,
)
