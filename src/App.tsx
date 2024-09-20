import './global.css'
import mixpanel from 'mixpanel-browser'
import 'moment/dist/locale/pt-br'

import { RouterProvider } from 'react-router-dom'

import { router } from './routes'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Toaster } from './components/ui/sonner'

import { env } from './env/env'
import { ThemeProvider } from './hooks/theme-provider'
import { TooltipProvider } from './components/ui/tooltip'

mixpanel.init(env.REACT_APP_MIXPANEL, {
  debug: true,
  track_pageview: true,
  persistence: 'localStorage',
})

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HelmetProvider>
        <Helmet titleTemplate="%s | Firula" />
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
        <Toaster richColors />
      </HelmetProvider>
    </ThemeProvider>
  )
}
