import { Outlet } from 'react-router-dom'

import LogoFull from '../../assets/logo-full.png'

export function AuthLayout() {
  return (
    <div className="flex h-screen items-center justify-between">
      <div className="flex h-screen w-full items-center justify-center bg-primary max-md:hidden">
        <img src={LogoFull} alt="Logo Firula" className="w-60" />
      </div>

      <div className="flex h-full w-full items-center p-5 text-lg text-foreground">
        <Outlet />
      </div>
    </div>
  )
}
