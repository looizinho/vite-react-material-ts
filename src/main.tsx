import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline } from '@mui/material'
import { CssVarsProvider } from '@mui/material/styles'
import App from './App.tsx'
import theme from './theme.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssVarsProvider theme={theme} defaultMode="system">
      <CssBaseline />
      <App />
    </CssVarsProvider>
  </StrictMode>,
)
