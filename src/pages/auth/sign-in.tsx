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

const signInForm = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type SingInForm = z.infer<typeof signInForm>

export function SignIn() {
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
      console.log('########', data)
      navigate('/dashboard')
      setLoadingSignIn(false)
    } catch (error) {
      toast.error('Email ou senha incorreto!')
      setLoadingSignIn(false)
    }
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
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <span className="text-xs text-red-600">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <span className="text-xs text-red-600">
                  {errors.password.message}
                </span>
              )}
              <div className="text-right">
                <a
                  className="cursor-pointer text-xs font-normal text-primary"
                  onClick={() => navigate('/forgot-password')}
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
    </>
  )
}
