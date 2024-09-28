import { File } from 'lucide-react'

import { Badge } from '../../components/ui/badge'

import { Button } from '../../components/ui/button'
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

export default function HomePage() {
  const { user } = useUserStore()

  const [loadingScheduling, setLoadingScheduling] = React.useState(true)
  const [schedulingData, setSchedulingData] = React.useState<SchedulingType[]>(
    [],
  )

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

  React.useEffect(() => {
    findAllScheduling()
  }, [])

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card x-chunk="dashboard-05-chunk-1">
          <CardHeader className="pb-2">
            <CardDescription>Empresas cadastras</CardDescription>
            <CardTitle className="text-4xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +25% do último mês
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-05-chunk-1">
          <CardHeader className="pb-2">
            <CardDescription>Quadras cadastras</CardDescription>
            <CardTitle className="text-4xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +25% do último mês
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-05-chunk-2">
          <CardHeader className="pb-2">
            <CardDescription>Clientes cadastrados</CardDescription>
            <CardTitle className="text-4xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +10% do último mês{' '}
            </div>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="week">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Exportar</span>
            </Button>
          </div>
        </div>
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
                                Cliente #{item.id}
                              </div>
                              <div className="hidden text-sm text-muted-foreground md:inline">
                                cliente@example.com
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
                              {item.date}
                            </TableCell>
                            <TableCell className="text-right">
                              $250.00
                            </TableCell>{' '}
                            {/* Atualize o valor conforme necessário */}
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
  )
}
