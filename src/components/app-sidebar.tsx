import * as React from 'react'
import { Minus, Plus } from 'lucide-react'
import LogoGreen from '../assets/logo-green.png'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '../components/ui/sidebar'
import { NavUser } from './nav-user'
import { useUserStore } from '../store/UserStore'

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Home',
      url: '/b2b/home',
      items: [
        {
          title: 'Dashboard',
          url: '/b2b/home',
        },
      ],
    },
    {
      title: 'Aulas',
      url: '#',
    },
    {
      title: 'Agenda',
      url: '#',
      items: [
        {
          title: 'Minha agenda',
          url: '/b2b/agenda',
        },
        {
          title: 'Bloquear horário',
          url: '/b2b/create-block-hour',
        },
      ],
    },
    {
      title: 'Quadras',
      url: '#',
      items: [
        {
          title: 'Minhas quadras',
          url: '/b2b/blocks',
        },
        {
          title: 'Cadastrar nova quadras',
          url: '/b2b/create-block',
        },
      ],
    },
    {
      title: 'Clientes',
      url: '#',
      items: [
        {
          title: 'Meus Clientes',
          url: '/b2b/costumers',
        },
      ],
    },
    {
      title: 'Eventos',
      url: '#',
      items: [
        {
          title: 'Meus eventos',
          url: '/b2b/list-events',
        },
        {
          title: 'Criar novo evento',
          url: '/b2b/create-event',
        },
      ],
    },
    {
      title: 'Configuração',
      url: '#',
      items: [
        {
          title: 'Endereço da empresa',
          url: '/b2b/config',
        },
        {
          title: 'Dados da empresa',
          url: '/b2b/config',
        },
        {
          title: 'Suporte',
          url: '/b2b/config',
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserStore()

  const userData = {
    name: user.name,
    email: user.email,
    avatar: '/avatars/shadcn.jpg',
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/b2b/home">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <img src={LogoGreen} alt="Logo Firula" className="w-30" />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 1}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.title}{' '}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={item.url}>{item.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
