import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Helmet } from 'react-helmet-async'

export function PageNotFound() {
  const navigate = useNavigate()

  return (
    <>
      <Helmet title="Cadastro" />
      <main className="grid min-h-full place-items-center  px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-7xl font-semibold text-primary">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Página não encontrada
          </h1>
          <p className="mt-6 text-base leading-7">
            Lamentamos, mas não conseguimos encontrar a página que procura.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button onClick={() => navigate(-1)}>Voltar</Button>
          </div>
        </div>
      </main>
    </>
  )
}
