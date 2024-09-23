import { createBrowserRouter } from 'react-router-dom'

import { SignIn } from './pages/auth/sign-in'

import { PageNotFound } from './pages/pageNotFound'
import { AuthLayout } from './pages/_layouts/auth-layout'
import { SignUp } from './pages/auth/sign-up'
import { CreateCompany } from './pages/main/create-company'
import { RegisterAddressCompany } from './pages/main/register-address-company'
import MainLayout from './pages/_layouts/main-layout'
import HomePage from './pages/main/home'

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
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/b2b/create-company',
        element: <CreateCompany />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/b2b/register-address-company',
        element: <RegisterAddressCompany />,
      },
    ],
  },
  {
    element: <MainLayout header={undefined} />,
    children: [
      {
        path: '/b2b/home',
        element: <HomePage />,
      },
    ],
  },
])
