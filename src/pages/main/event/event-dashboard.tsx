import { Layout } from '../../../components/custom/layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Tabs, TabsContent } from '../../../components/ui/tabs'
import { RecentSales } from './components/recent-sales'
import { Overview } from './components/overview'
import { ChevronRight, Eye } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAnalyze } from '../../../services/event/get-analyze'
import { useEffect, useState } from 'react'
import { ScreenLoading } from '../../../components/screen-loading'
import { formatCurrency } from '../../../utils/functions'

export function EventDashboardPage() {
  const navigate = useNavigate()
  const { eventId } = useParams<{ eventId: string }>()

  const [loading, setLoading] = useState<boolean>(true)
  const [pageView, setPageView] = useState<number>()
  const [totalRevenue, setTotalRevenue] = useState<number>()
  const [tickets, setTickets] = useState<
    {
      ticketType: string
      totalSales: number
      totalPrice: number
    }[]
  >()
  const [totalSales, setTotalSales] = useState<number>()
  const [recentSales, setRecentSales] = useState<
    {
      userId: string
      userName: string
      userEmail: string
      userPhoneNumber: string
      priceTicket: string
    }[]
  >()

  const searchEventAnalysis = async () => {
    const response = await getAnalyze({ eventId: eventId ?? '' })

    if (response.success) {
      setPageView(response.pageView)
      setTotalRevenue(response.totalRevenue)
      setTickets(response.tickets)
      setTotalSales(response.totalSales)
      console.log('##response.recentSales', response.recentSales)
      setRecentSales(response.recentSales)
    }

    setLoading(false)
  }

  useEffect(() => {
    searchEventAnalysis()
  }, [eventId])

  return (
    <>
      {loading ? (
        <ScreenLoading />
      ) : (
        <Layout>
          <Layout.Body>
            <Tabs
              orientation="vertical"
              defaultValue="overview"
              className="space-y-4"
            >
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Receita total
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        R$ {formatCurrency((totalRevenue ?? 0).toString())}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total de inscrições
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalSales}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Visualização na página
                      </CardTitle>
                      <Eye size={18} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{pageView}</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
                  <Card className="col-span-1 lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Venda por Ticket</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <Overview data={tickets ?? []} />
                    </CardContent>
                  </Card>
                  <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Vendas recentes</CardTitle>
                      <CardDescription>
                        <span
                          className="flex cursor-pointer items-center gap-1 text-muted-foreground"
                          onClick={() =>
                            navigate(`/b2b/event/${eventId}/sales-list`)
                          }
                        >
                          Ver todas as vendas
                          <ChevronRight size={16} />
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentSales recentSales={recentSales ?? []} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </Layout.Body>
        </Layout>
      )}
    </>
  )
}
