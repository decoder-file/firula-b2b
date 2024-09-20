import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { useUserStore } from './store/UserStore.ts'

useUserStore.subscribe((store) => console.log('New state:', store))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
