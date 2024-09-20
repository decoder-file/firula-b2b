import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type UserStore = {
  routerName: string
  setRouterName: (routerName: string) => void
  removeRouterName: () => void
}

export const useRouterStore = create<UserStore>()(
  devtools(
    persist(
      (set) => {
        return {
          routerName: '',
          setRouterName: (routerName) => set({ routerName }),
          removeRouterName: () => set({ routerName: '' }),
        }
      },
      {
        name: 'router-store', // nome da chave no armazenamento local
        getStorage: () => localStorage, // ou sessionStorage
      },
    ),
  ),
)
