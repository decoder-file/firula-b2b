import LoadingGif from '../assets/white-loading.gif'
import { Helmet } from 'react-helmet-async'

export function ScreenLoading() {
  return (
    <>
      <Helmet title="Cadastro" />
      <main className="grid min-h-full place-items-center sm:py-32">
        <div className="text-center">
          <div className="mb-2 mt-2 flex items-center justify-center">
            <img src={LoadingGif} alt="Loading..." className="w-32" />
          </div>
          <p className="mt-6 text-base font-semibold leading-7">
            Carregando Informações...
          </p>
        </div>
      </main>
    </>
  )
}
