import { Outlet, useLocation } from 'react-router-dom'

import {
  Building2,
  Home,
  LandPlot,
  LineChart,
  PanelLeft,
  Settings,
  Users2,
} from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../components/ui/tooltip'
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet'
import { Button } from '../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'

type MainLayoutProps = {
  header: React.ReactNode
}

export default function MainLayout({ header }: MainLayoutProps) {
  const location = useLocation()

  const handleSignOut = async () => {
    localStorage.setItem('token', '')
    localStorage.setItem('refreshToken', '')
    window.location.href = '/sign-in'
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="/home"
                className={`group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base 
                ${location.pathname === '/home' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
              >
                <Home className="h-4 w-4 transition-all group-hover:scale-110" />
                <span className="sr-only">Home</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">Home</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="/companies"
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8
                ${location.pathname === '/companies' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Building2 className="h-5 w-5" />
                <span className="sr-only">Empresas</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">Empresas</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="/block"
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8
                ${location.pathname === '/block' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LandPlot className="h-5 w-5" />
                <span className="sr-only">Quadras</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">Quadras</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="/costumers"
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8
                ${location.pathname === '/costumers' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Users2 className="h-5 w-5" />
                <span className="sr-only">Clientes</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">Clientes</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="/analytics"
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8
                ${location.pathname === '/analytics' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LineChart className="h-5 w-5" />
                <span className="sr-only">Análise</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">Análise</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="/config"
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8
                ${location.pathname === '/config' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Configuração</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">Configuração</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <a
                  href="/home"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Home
                </a>
                <a
                  href="/companies"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <Building2 className="h-5 w-5" />
                  Empresas
                </a>
                <a
                  href="/block"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LandPlot className="h-5 w-5" />
                  Quadras
                </a>
                <a
                  href="/costumers"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Clientes
                </a>
                <a
                  href="/analytics"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Análise
                </a>
                <a
                  href="/config"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Configuração
                </a>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex w-full justify-between">
            {header}
            <div className="relative ml-auto flex-1 md:grow-0" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                ></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="relative ml-auto flex-1 md:grow-0" />
          <div />
        </header>
        <main className=" w-full flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
