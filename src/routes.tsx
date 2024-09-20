import { createBrowserRouter } from 'react-router-dom'

import { SignIn } from './pages/auth/sign-in'

import { PageNotFound } from './pages/pageNotFound'
import { AuthLayout } from './pages/_layouts/auth-layout'
import { SignUp } from './pages/auth/sign-up'

export const router = createBrowserRouter([
  {
    path: '*',
    element: <PageNotFound />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/b2b/sign-in',
        element: <SignIn />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/b2b/sign-up',
        element: <SignUp />,
      },
    ],
  },
])
