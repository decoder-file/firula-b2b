import { useState } from 'react'

import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'

import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

import LogoGreen from '../../assets/logo-green.png'
import { cn } from '../../lib/utils'
import { isValidAndOver18 } from '../../utils/functions'
import { Checkbox } from '../../components/ui/checkbox'

const signUpForm = z.object({
  name: z
    .string()
    .min(1, 'Campo nome é obrigatório')
    .max(255, 'Nome muito grande'),
  lastName: z
    .string()
    .min(1, 'Sobrenome inválido')
    .max(255, 'Sobrenome muito grande'),
  phone: z.string().min(3, 'Telefone inválido'),
  password: z.string().min(8, 'Senha muito curta, tente uma senha mais forte.'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(1, 'CPF é obrigatória'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  dateOfBirth: z.string().min(1, 'Data de nascimento é obrigatória'),
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
  const navigate = useNavigate()

  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loadingSignUp, setLoadingSignUp] = useState(false)

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

      if (!isValidAndOver18(data.dateOfBirth)) {
        toast.error('Você deve ter mais de 18 anos para se cadastrar!')
        setLoadingSignUp(false)
        return
      }

      if (data.password !== data.confirmPassword) {
        toast.error('As senhas devem ser iguais!')
        setLoadingSignUp(false)
        return
      }
      const requestData = {
        name: data.name,
        lastName: data.lastName,
        phone: data.phone.replace(/[^\d]/g, ''),
        email: data.email,
        password: data.password,
        cpf: data.cpf.replace(/[^\d]/g, ''),
        dateOfBirth: data.dateOfBirth,
      }

      console.log('requestData', requestData)

      navigate('/client/dashboard')

      setLoadingSignUp(false)

      setLoadingSignUp(false)

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
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <span className="text-xs text-red-600">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="w-full space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input id="lastName" {...register('lastName')} />
                {errors.lastName && (
                  <span className="text-xs text-red-600">
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex w-full gap-2">
              <div className="w-full space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <InputMask
                  mask="(99) 9 9999-9999"
                  id="phone"
                  {...register('phone')}
                  className={cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  )}
                />
                {errors.phone && (
                  <span className="text-xs text-red-600">
                    {errors.phone.message}
                  </span>
                )}
              </div>

              <div className="w-full space-y-2">
                <Label htmlFor="phone">CPF</Label>
                <InputMask
                  mask="999.999.999-99"
                  id="cpf"
                  {...register('cpf')}
                  className={cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  )}
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
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <span className="text-xs text-red-600">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="email">Data de nascimento</Label>
                <InputMask
                  mask="99/99/9999"
                  id="dateOfBirth"
                  {...register('dateOfBirth')}
                  className={cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  )}
                />
                {errors.dateOfBirth && (
                  <span className="text-xs text-red-600">
                    {errors.dateOfBirth.message}
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
              disabled={loadingSignUp || isSubmitting || !isValid}
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
