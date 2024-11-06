import { useState } from 'react'

import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'

import LogoGreen from '../../../assets/logo-green.png'
import { maskToken } from '../../../utils/Mask'
import { resetPassword } from '../../../services/user'

const resetPasswordForm = z.object({
  password: z.string().min(2, 'Senha é obrigatória'),
  code: z.string().min(6, 'Token é obrigatório'),
})

type ResetPasswordForm = z.infer<typeof resetPasswordForm>

export function ResetPassword() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordForm),
  })

  async function handleSendToken(data: ResetPasswordForm) {
    setLoadingSubmit(true)
    try {
      const dataResponse = {
        userId: userId ?? '',
        code: data.code,
        newPassword: data.password,
      }
      const response = await resetPassword(dataResponse)

      if (!response.success) {
        setLoadingSubmit(false)
        return
      }

      navigate('/b2b/sign-in')

      setLoadingSubmit(false)
    } catch (error) {
      toast.error(
        'Ocorreu um erro ao enviar o token de recuperação, tente novamente mais tarde.',
      )
      setLoadingSubmit(false)
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
              Alterar senha
            </h1>
            <p className="text-sm text-muted-foreground">
              Insira o token SMS e a nova senha para alterar sua senha.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleSendToken)}>
            <div className="flex w-full gap-2">
              <div className="w-full space-y-2">
                <Label htmlFor="code">Token</Label>
                <Input
                  id="code"
                  {...register('code', {
                    onChange: (e) => {
                      e.target.value = maskToken(e.target.value)
                    },
                  })}
                  input={{
                    maxLength: 14,
                    change: (val: string) => maskToken(val),
                    mask: maskToken,
                    value: undefined,
                  }}
                />

                {errors.code && (
                  <span className="text-xs text-red-600">
                    {errors.code.message}
                  </span>
                )}
              </div>
            </div>

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

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || loadingSubmit || !isValid}
            >
              Continuar
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
