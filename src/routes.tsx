import { createBrowserRouter } from 'react-router-dom'

import { SignIn } from './pages/auth/sign-in'

import { PageNotFound } from './pages/pageNotFound'
import { AuthLayout } from './pages/_layouts/auth-layout'
import { SignUp } from './pages/auth/sign-up'
import { CreateCompany } from './pages/main/create-company'
import { RegisterAddressCompany } from './pages/main/register-address-company'
import MainLayout from './pages/_layouts/main-layout'
import HomePage from './pages/main/home'
import BlocksPage from './pages/main/blocks'
import { CreateBlockPage } from './pages/main/create-block'
import CostumersPage from './pages/main/costumers'
import { EditBlockPage } from './pages/main/edit-block'
import { SettingsPage } from './pages/main/settings'
import AgendaPage from './pages/main/agenda'
import CreateBlockHourPage from './pages/main/create-block-hour'
import { CourtSchedulesPage } from './pages/main/court-schedules'
import { SendTokenResetPassword } from './pages/auth/reset-password/send-token-reset-password'
import { ResetPassword } from './pages/auth/reset-password/reset-password'
import { CreateEventPage } from './pages/main/event/create-event'
import { EditEventPage } from './pages/main/event/edit-event'
import { ListEventsPage } from './pages/main/event/list-events'
import { EventDashboardPage } from './pages/main/event/event-dashboard'
import { CreateTicketPage } from './pages/main/event/create-ticket'
import { EditTicketPage } from './pages/main/event/edit-ticket'
import SalesListPage from './pages/main/event/sales-list'

export const router = createBrowserRouter([
  {
    path: '*',
    element: <PageNotFound />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/b2b/alterar-senha/enviar-token',
        element: <SendTokenResetPassword />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/b2b/alterar-senha/:userId',
        element: <ResetPassword />,
      },
    ],
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
    element: <MainLayout title="Home" />,
    children: [
      {
        path: '/b2b/home',
        element: <HomePage />,
      },
    ],
  },
  {
    element: <MainLayout title="Quadras" subTitle="Minhas quadras" />,
    children: [
      {
        path: '/b2b/blocks',
        element: <BlocksPage />,
      },
    ],
  },
  {
    element: <MainLayout title="Quadras" subTitle="Criar nova quadra" />,
    children: [
      {
        path: '/b2b/create-block',
        element: <CreateBlockPage />,
      },
    ],
  },
  {
    element: (
      <MainLayout title="Quadras" subTitle="Horários de funcionamento" />
    ),
    children: [
      {
        path: '/b2b/court-schedules/:blockId',
        element: <CourtSchedulesPage />,
      },
    ],
  },
  {
    element: <MainLayout title="Quadras" subTitle="Editar quadra" />,
    children: [
      {
        path: '/b2b/edit-block/:blockId',
        element: <EditBlockPage />,
      },
    ],
  },
  {
    element: <MainLayout title="Clientes" />,
    children: [
      {
        path: '/b2b/costumers',
        element: <CostumersPage />,
      },
    ],
  },
  {
    element: <MainLayout title="Configurações" />,
    children: [
      {
        path: '/b2b/config',
        element: <SettingsPage />,
      },
    ],
  },
  {
    element: <MainLayout title="Agenda" />,
    children: [
      {
        path: '/b2b/agenda',
        element: <AgendaPage />,
      },
    ],
  },
  {
    element: <MainLayout title="Agenda" subTitle="Bloquear horário" />,
    children: [
      {
        path: '/b2b/create-block-hour',
        element: <CreateBlockHourPage />,
      },
    ],
  },
  {
    element: <MainLayout title="Evento" subTitle="Criar novo evento" />,
    children: [
      {
        path: '/b2b/create-event',
        element: <CreateEventPage />,
      },
    ],
  },
  {
    element: <MainLayout title="Evento" subTitle="Editar evento" />,
    children: [
      {
        path: '/b2b/edit-event/:eventId',
        element: <EditEventPage />,
      },
    ],
  },
  {
    element: <MainLayout title="Evento" subTitle="Meus eventos" />,
    children: [
      {
        path: '/b2b/list-events',
        element: <ListEventsPage />,
      },
    ],
  },
  {
    element: <MainLayout title="Evento" subTitle="Dashboard do evento" />,
    children: [
      {
        path: '/b2b/event/:eventId/dashboard',
        element: <EventDashboardPage />,
      },
    ],
  },
  {
    element: <MainLayout title="Evento" subTitle="Criar ingresso" />,
    children: [
      {
        path: '/b2b/event/:eventId/create-ticket',
        element: <CreateTicketPage />,
      },
    ],
  },
  {
    element: <MainLayout title="Evento" subTitle="Editar ingresso" />,
    children: [
      {
        path: '/b2b/event/:ticketTypeId/edit-ticket',
        element: <EditTicketPage />,
      },
    ],
  },
  {
    element: <MainLayout title="Evento" subTitle="Vendas" />,
    children: [
      {
        path: '/b2b/event/:eventId/sales-list',
        element: <SalesListPage />,
      },
    ],
  },
])
