import { Helmet } from 'react-helmet-async'
import { CompanyAddressForm } from './components/company-address-form'
import { useState } from 'react'
import { CompanyInfoForm } from './components/company-info-form'
import { CompanyGallery } from './components/company-gallery'

export function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState<
    'companyAddress' | 'companyInfo' | 'suporte' | 'gallery'
  >('gallery')

  const changeTab = (
    tab: 'companyAddress' | 'companyInfo' | 'suporte' | 'gallery',
  ) => {
    setSelectedTab(tab)
  }

  const renderTab = () => {
    switch (selectedTab) {
      case 'companyAddress':
        return <CompanyAddressForm />
      case 'companyInfo':
        return <CompanyInfoForm />
      case 'gallery':
        return <CompanyGallery />
      case 'suporte':
        return <div>Suporte</div>
    }
  }

  return (
    <>
      <Helmet title="Clientes" />
      <div className="w-full">
        <div className="mx-auto grid w-full  gap-2">
          <h1 className="text-3xl font-semibold">Configuração</h1>
        </div>
        <div className="mx-auto grid w-full  items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="mt-2 grid gap-4 text-sm text-muted-foreground">
            <a
              onClick={() => changeTab('companyAddress')}
              className={`font-semibold ${selectedTab === 'companyAddress' && 'text-primary'} cursor-pointer`}
            >
              Endereço da empresa
            </a>
            <a
              onClick={() => changeTab('companyInfo')}
              className={`font-semibold ${selectedTab === 'companyInfo' && 'text-primary'} cursor-pointer`}
            >
              Dados da empresa
            </a>
            <a
              onClick={() => changeTab('gallery')}
              className={`font-semibold ${selectedTab === 'gallery' && 'text-primary'} cursor-pointer`}
            >
              Galeria de fotos
            </a>
            <a
              onClick={() => changeTab('suporte')}
              className={`font-semibold ${selectedTab === 'suporte' && 'text-primary'} cursor-pointer`}
            >
              Suporte
            </a>
          </nav>
          <div className="grid gap-6">{renderTab()}</div>
        </div>
      </div>
    </>
  )
}
