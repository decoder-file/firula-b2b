import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type User = {
  userId: string
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
          user: {
            userId: '',
            name: '',
            email: '',
            role: 'user',
            companyId: '',
          },
          setUser: (user) => set({ user }),
          removeAdmin: () =>
            set({
              user: {
                userId: '',
                name: '',
                email: '',
                role: 'user',
                companyId: '',
              },
            }),
        }
      },
      {
        name: 'user-store', // nome da chave no armazenamento local
        getStorage: () => localStorage, // ou sessionStorage
      },
    ),
  ),
)
