import { useState } from 'react'

import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'

import LogoGreen from '../../../assets/logo-green.png'
import { maskCPFeCNPJ } from '../../../utils/Mask'
import { resetPasswordSendToken } from '../../../services/user'

const sendTokenResetPasswordForm = z.object({
  document: z.string().min(12, 'CPF é obrigatória'),
})

type SendTokenResetPasswordForm = z.infer<typeof sendTokenResetPasswordForm>

export function SendTokenResetPassword() {
  const navigate = useNavigate()
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm<SendTokenResetPasswordForm>({
    resolver: zodResolver(sendTokenResetPasswordForm),
  })

  async function handleSendToken(data: SendTokenResetPasswordForm) {
    setLoadingSubmit(true)
    try {
      const response = await resetPasswordSendToken(data)

      if (!response.success) {
        setLoadingSubmit(false)
        return
      }

      navigate(`/b2b/alterar-senha/${response.userId}`)

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
              Informe seu CPF para receber um token de recuperação.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleSendToken)}>
            <div className="flex w-full gap-2">
              <div className="w-full space-y-2">
                <Label htmlFor="document">CPF</Label>
                <Input
                  id="document"
                  {...register('document', {
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

                {errors.document && (
                  <span className="text-xs text-red-600">
                    {errors.document.message}
                  </span>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || loadingSubmit || !isValid}
            >
              Entrar
            </Button>
          </form>

          <footer className="flex justify-center gap-1">
            <Label className="text-sm font-semibold">Acessar seu conta?</Label>
            <a
              className="cursor-pointer text-sm font-semibold text-primary"
              onClick={() => navigate('/b2b/sign-in')}
            >
              Continuar
            </a>
          </footer>
        </div>
      </div>
    </>
  )
}
