import { Badge } from '../../components/ui/badge'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { Tabs, TabsContent } from '../../components/ui/tabs'
import { getAllScheduling, SchedulingType } from '../../services/scheduling'
import React from 'react'
import { useUserStore } from '../../store/UserStore'
import moment from 'moment'
import { getStatistic, GetStatisticType } from '../../services/statistic'
import { Skeleton } from '../../components/ui/skeleton'
import { formatCurrency } from '../../utils/functions'
import { Helmet } from 'react-helmet-async'
import BannerAlert from '../../components/banner-alert'
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
import {
  getCompanyStatus,
  GetCompanyStatusType,
} from '../../services/company/get-company-status'
import PaymentActivationModal from '../../components/payment-activation-modal'
import { activeCompanyPaymentAccount } from '../../services/company/active-company-payment-account'

export default function HomePage() {
  const { user } = useUserStore()

  const [loadingScheduling, setLoadingScheduling] = React.useState(true)
  const [schedulingData, setSchedulingData] = React.useState<SchedulingType[]>(
    [],
  )
  const [loadingStatistic, setLoadingStatistic] = React.useState(true)
  const [statisticData, setStatisticData] = React.useState<GetStatisticType>()
  const [openModalIncompleteOnbording, setOpenModalIncompleteOnbording] =
    React.useState(false)
  const [companyStatus, setCompanyStatus] =
    React.useState<GetCompanyStatusType>()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [loadingPaymentActivation, setLoadingPaymentActivation] =
    React.useState(false)
  const [loadingCompanyStatus, setLoadingCompanyStatus] = React.useState(true)

  const findAllScheduling = async () => {
    const response = await getAllScheduling({
      page: '1',
      companyId: user.companyId ?? '',
    })
    if (response.success && response.scheduling) {
      setSchedulingData(response.scheduling)
    }
    setLoadingScheduling(false)
  }

  const fetchStatistic = async () => {
    const response = await getStatistic(user.companyId ?? '')
    if (response.dashboard) {
      setStatisticData(response)
    }
    setLoadingStatistic(false)
  }

  const fetchCompanyStatus = async () => {
    const response = await getCompanyStatus({ companyId: user.companyId ?? '' })

    if (response) {
      setCompanyStatus(response)
      setLoadingCompanyStatus(false)
    }
  }

  const handlePaymentActivation = async () => {
    setIsModalOpen(true)
    setLoadingPaymentActivation(true)

    await activeCompanyPaymentAccount({
      companyId: user.companyId ?? '',
    })

    setIsModalOpen(false)
    setLoadingPaymentActivation(false)
  }

  const handleVerifyAccount = () => {
    setIsModalOpen(true)
  }

  React.useEffect(() => {
    findAllScheduling()
    fetchStatistic()
    fetchCompanyStatus()
  }, [])

  return (
    <>
      <Helmet title="Home" />

      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        {!loadingCompanyStatus && (
          <>
            {companyStatus?.status !== 'APPROVED' &&
              companyStatus?.status === 'API_KEY_NOT_FOUND' && (
                <BannerAlert
                  onClickComplete={() => setOpenModalIncompleteOnbording(true)}
                  title="Ativar conta de pagamento Firula"
                  description="Você precisa ativar sua conta para que seus clientes consigam realizar o pagamento da reserva pelo Firula."
                  textButton="Ativar agora"
                />
              )}

            {companyStatus?.status === 'PENDING' && (
              <BannerAlert
                onClickComplete={handleVerifyAccount}
                title="Verificação de conta"
                description="Precisamos verificar sua conta para que você possa receber os pagamentos das reservas."
                textButton="Verificar conta"
              />
            )}
          </>
        )}

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {loadingStatistic ? (
            <>
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <Skeleton className="h-[125px] w-full rounded-xl" />
            </>
          ) : (
            <>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription>Agendamentos</CardDescription>
                  <CardTitle className="text-4xl">
                    {statisticData?.dashboard?.numberOfScheduling}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {/* +25% do último mês */}
                    Agendamentos de {moment().format('MMMM')}
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription>Quadras cadastras</CardDescription>
                  <CardTitle className="text-4xl">
                    {statisticData?.dashboard?.numberOfBlocks}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {/* +25% do último mês */}
                    Quadras cadastradas
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription>Clientes cadastrados</CardDescription>
                  <CardTitle className="text-4xl">
                    {statisticData?.dashboard?.numberOfCustomers}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {/* +10% do último mês{' '} */}
                    Clientes cadastrados
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        <Tabs defaultValue="week">
          {!loadingScheduling && (
            <>
              <TabsContent value="week">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Agendamentos</CardTitle>
                    <CardDescription>Agendamentos realizados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Quadra
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Status
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Date
                          </TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schedulingData.length > 0 ? (
                          schedulingData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className="font-medium">
                                  {item.user.name}
                                </div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                  {item.user.email}
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {item.companyBlock.name}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Badge
                                  className="text-xs"
                                  variant={
                                    item.status === 'Fulfilled'
                                      ? 'secondary'
                                      : 'outline'
                                  }
                                >
                                  {item.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {moment(item.date).format('DD/MM/YYYY')}
                              </TableCell>
                              <TableCell className="text-right">
                                R${' '}
                                {formatCurrency(item.companyBlock.valueForHour)}
                              </TableCell>{' '}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">
                              Nenhum agendamento encontrado
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
      <AlertDialog open={openModalIncompleteOnbording}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Ativar conta de pagamento Firula
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você precisa ativar sua conta para que seus clientes consigam
              realizar o pagamento da reserva pelo Firula.{' '}
              <span className="mt-2 block  text-primary">
                Após ativar sua conta, você receberar um e-mail com link para
                verificação da sua indentidade.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setOpenModalIncompleteOnbording(false)}
              disabled={loadingPaymentActivation}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePaymentActivation}
              disabled={loadingPaymentActivation}
            >
              {loadingPaymentActivation ? 'Ativando...' : 'Ativar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {!loadingCompanyStatus && (
        <PaymentActivationModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          data={companyStatus?.data || []}
        />
      )}
    </>
  )
}
