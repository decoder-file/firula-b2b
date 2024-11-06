import { useState } from 'react'

import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

import LogoGreen from '../../assets/logo-green.png'
import { useUserStore } from '../../store/UserStore'
import { AuthenticateResponseType } from '../../services/user/authenticate'
import api from '../../services/api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog'

const signInForm = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type SingInForm = z.infer<typeof signInForm>

export function SignIn() {
  const { setUser } = useUserStore()
  const [openModalIncompleteSignUp, setOpenModalIncompleteSignUp] =
    useState(false)

  const navigate = useNavigate()
  const [loadingSignIn, setLoadingSignIn] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm<SingInForm>({
    resolver: zodResolver(signInForm),
  })

  async function handleSignIn(data: SingInForm) {
    setLoadingSignIn(true)
    try {
      const response: AuthenticateResponseType = await api.post('sign-in', data)

      const { token, user } = response.data

      console.log(response.data)

      if (user.role !== 'OWNER') {
        toast.error(
          'Você não tem permissão para acessar esse painel de controle',
        )
        setLoadingSignIn(false)
        return
      }

      localStorage.setItem('token', token)

      setUser({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: response.data?.company[0]?.id
          ? response.data?.company[0]?.id
          : '',
      })

      if (!response.data?.company[0]?.id) {
        setOpenModalIncompleteSignUp(true)
        return
      }

      toast.success('Login realizado com sucesso!')

      navigate('/b2b/home')

      setLoadingSignIn(false)
    } catch (error) {
      toast.error('Email ou senha incorreto!')
      setLoadingSignIn(false)
    }
  }

  const handleCancel = () => {
    localStorage.setItem('token', '')
    localStorage.setItem('refreshToken', '')
    setLoadingSignIn(false)
    setOpenModalIncompleteSignUp(false)
  }

  return (
    <>
      <Helmet title="Login" />
      <div className="flex w-full items-center justify-center">
        <div className="flex max-w-max flex-col justify-center gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <img src={LogoGreen} alt="Logo Firula" className="w-20 md:hidden" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar painel
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie suas quadras e clientes de forma fácil e rápida.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleSignIn)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register('email')}
                input={{
                  change: (val: string) => val,
                  value: undefined,
                }}
              />
              {errors.email && (
                <span className="text-xs text-red-600">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                input={{
                  change: (val: string) => val,
                  value: undefined,
                  type: 'password',
                }}
              />

              {errors.password && (
                <span className="text-xs text-red-600">
                  {errors.password.message}
                </span>
              )}
              <div className="text-right">
                <a
                  className="cursor-pointer text-xs font-normal text-primary"
                  onClick={() => navigate('/b2b/alterar-senha/enviar-token')}
                >
                  Esqueceu senha sua senha?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || loadingSignIn || !isValid}
            >
              Entrar
            </Button>
          </form>

          <footer className="flex justify-center gap-1">
            <Label className="text-sm font-semibold">
              Não tem uma conta ainda?
            </Label>
            <a
              className="cursor-pointer text-sm font-semibold text-primary"
              onClick={() => navigate('/b2b/sign-up')}
            >
              Inscrever-se
            </a>
          </footer>
        </div>
      </div>
      <AlertDialog open={openModalIncompleteSignUp}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cadastro incompleto</AlertDialogTitle>
            <AlertDialogDescription>
              Você precisa completar seu cadastro para acessar o painel do
              Firula.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate('/b2b/create-company')}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
