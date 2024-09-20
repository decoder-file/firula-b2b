import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type User = {
  id: string
  name: string
  email: string
  role: string
  companyId?: string
}

type UserStore = {
  user: User
  setUser: (user: User) => void
  removeAdmin: () => void
}

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => {
        return {
          user: { id: '', name: '', email: '', role: 'user' },
          setUser: (user) => set({ user }),
          removeAdmin: () =>
            set({ user: { id: '', name: '', email: '', role: 'user' } }),
        }
      },
      {
        name: 'user-store', // nome da chave no armazenamento local
        getStorage: () => localStorage, // ou sessionStorage
      },
    ),
  ),
)
