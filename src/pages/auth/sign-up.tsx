import { useState } from 'react'

import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

import LogoGreen from '../../assets/logo-green.png'
import { Checkbox } from '../../components/ui/checkbox'
import { maskCPFeCNPJ, maskPhoneNumber } from '../../utils/Mask'
import { createUser } from '../../services/user'
import { useUserStore } from '../../store/UserStore'

import { AuthenticateResponseType } from '../../services/user/authenticate'
import api from '../../services/api'

const signUpForm = z.object({
  name: z
    .string()
    .min(1, 'Campo nome é obrigatório')
    .max(255, 'Nome muito grande'),
  lastName: z
    .string()
    .min(1, 'Sobrenome inválido')
    .max(255, 'Sobrenome muito grande'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(1, 'CPF é obrigatória'),
  password: z.string().min(1, 'Senha muito curta, tente uma senha mais forte.'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  phoneNumber: z.string().min(1, 'Telefone é obrigatório'),
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
  const { setUser } = useUserStore()

  const navigate = useNavigate()

  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loadingSignUp, setLoadingSignUp] = useState(false)

  const capitalizeFirstLetter = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpForm),
  })

  async function handleSignUp(data: SignUpForm) {
    setLoadingSignUp(true)
    try {
      if (!acceptTerms) {
        toast.error(
          'Você deve aceitar os termos de uso e privacidade para continuar!',
        )
        setLoadingSignUp(false)
        return
      }

      if (data.password !== data.confirmPassword) {
        toast.error('As senhas devem ser iguais!')
        setLoadingSignUp(false)
        return
      }
      if (data.password.length < 8) {
        toast.error('A senha deve ter no mínimo 8 caracteres!')
        setLoadingSignUp(false)
        return
      }
      const requestData = {
        name:
          capitalizeFirstLetter(data.name) +
          ' ' +
          capitalizeFirstLetter(data.lastName),
        email: data.email,
        password: data.password,
        cpf: data.cpf.replace(/[^\d]/g, ''),
        phoneNumber: data.phoneNumber.replace(/[^\d]/g, ''),
      }

      console.log(requestData)
      return

      const response = await createUser(requestData)

      if (!response.success) {
        setLoadingSignUp(false)
        return
      }

      const responseAuthenticate: AuthenticateResponseType = await api.post(
        'sign-in',
        data,
      )

      const { token, user } = responseAuthenticate.data

      localStorage.setItem('token', token)

      setUser({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })

      navigate('/b2b/create-company')

      setLoadingSignUp(false)
    } catch (error) {
      console.log(error)
      setLoadingSignUp(false)
    }
  }
  return (
    <>
      <Helmet title="Cadastro" />
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex max-w-max flex-col justify-center gap-3">
          <div className="flex flex-col items-center justify-center  text-center">
            <img src={LogoGreen} alt="Logo Firula" className="w-20 md:hidden" />

            <h1 className="text-2xl font-semibold tracking-tight">
              Criar conta
            </h1>
            <p className="text-sm text-muted-foreground">
              Crie sua conta para começar a usar o sistema.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleSignUp)}>
            <div className="flex w-full gap-2">
              <div className="w-full space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  {...register('name')}
                  input={{
                    maxLength: 50,
                    change: (val: string) => val,
                    value: undefined,
                  }}
                />
                {errors.name && (
                  <span className="text-xs text-red-600">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="w-full space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  input={{
                    maxLength: 50,
                    change: (val: string) => val,
                    value: undefined,
                  }}
                />
                {errors.lastName && (
                  <span className="text-xs text-red-600">
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex w-full gap-2">
              <div className="w-full space-y-2">
                <Label htmlFor="email">E-mail</Label>
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
            </div>

            <div className="flex w-full gap-2">
              <div className="w-full space-y-2">
                <Label htmlFor="cpf">Celular</Label>
                <Input
                  id="phoneNumber"
                  {...register('phoneNumber', {
                    onChange: (e) => {
                      e.target.value = maskPhoneNumber(e.target.value)
                    },
                  })}
                  input={{
                    maxLength: 14,
                    change: (val: string) => maskPhoneNumber(val),
                    mask: maskPhoneNumber,
                    value: undefined,
                  }}
                />

                {errors.phoneNumber && (
                  <span className="text-xs text-red-600">
                    {errors.phoneNumber.message}
                  </span>
                )}
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  {...register('cpf', {
                    onChange: (e) => {
                      e.target.value = maskCPFeCNPJ(e.target.value)
                    },
                  })}
                  input={{
                    maxLength: 14,
                    change: (val: string) => maskCPFeCNPJ(val),
                    mask: maskCPFeCNPJ,
                    value: undefined,
                  }}
                />

                {errors.cpf && (
                  <span className="text-xs text-red-600">
                    {errors.cpf.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex w-full gap-2">
              <div className="w-full space-y-2">
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
              </div>

              <div className="w-full space-y-2">
                <Label htmlFor="password">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  input={{
                    maxLength: 18,
                    change: (val: string) => val,
                    value: undefined,
                    type: 'password',
                  }}
                />
                {errors.confirmPassword && (
                  <span className="text-xs text-red-600">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                onCheckedChange={() => setAcceptTerms(true)}
                checked={acceptTerms}
              />
              <Label htmlFor="terms">
                Aceito os{' '}
                <span
                  className="cursor-pointer text-primary"
                  onClick={() => navigate('/terms/terms-and-conditions')}
                >
                  termos de uso
                </span>{' '}
                e{' '}
                <span
                  className="cursor-pointer text-primary"
                  onClick={() => navigate('/terms/privacy-policy')}
                >
                  privacidade do Firula
                </span>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                loadingSignUp || isSubmitting || !isValid || !acceptTerms
              }
            >
              Cadastrar
            </Button>
          </form>

          <footer className="mb-4 flex justify-center gap-1">
            <Label className="text-sm font-semibold">Já tem uma conta?</Label>
            <a
              className="cursor-pointer text-sm font-semibold text-primary"
              onClick={() => navigate('/b2b/sign-in')}
            >
              Fazer login
            </a>
          </footer>
        </div>
      </div>
    </>
  )
}
