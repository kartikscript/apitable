import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { PrimeReactProvider} from 'primereact/api';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider>
      <App /> 
    </PrimeReactProvider>
  </StrictMode>,
)
