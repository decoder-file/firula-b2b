import { Button } from '../../components/ui/button'
import { Calendar } from '../../components/ui/calendar'
import LoadingGif from '../../assets/white-loading.gif'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover'
import { cn } from '../../lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import React from 'react'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Label } from '../../components/ui/label'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'

import { getAllSchedulingByDate } from '../../services/scheduling/get-all-scheduling-by-date'
import { useUserStore } from '../../store/UserStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { maskCPF } from '../../utils/Mask'
import { BlockType, getAllBlocks } from '../../services/blocks'
import moment from 'moment'

interface SchedulingTableType {
  id: string
  blockName: string
  client: string
  cpf: string
  email: string
  status: string
  hour: string
  date: string
}

export default function AgendaPage() {
  const { user } = useUserStore()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [tableData, setTableData] = React.useState<SchedulingTableType[] | []>(
    [],
  )
  const [date, setDate] = React.useState<Date>()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [block, setBlock] = React.useState<BlockType[]>([])
  const [loadingBlock, setLoadingBlock] = React.useState<boolean>(true)
  const [blockId, setBlockId] = React.useState<string>('')

  const columns: ColumnDef<SchedulingTableType>[] = [
    {
      accessorKey: 'client',
      header: 'Cliente',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('client')}</div>
      ),
    },
    {
      accessorKey: 'cpf',
      header: 'CPF do Cliente',
      cell: ({ row }) => <div>{maskCPF(row.getValue('cpf'))}</div>,
    },
    {
      accessorKey: 'blockName',
      header: 'Quadra',
      cell: ({ row }) => <div>{row.getValue('blockName')}</div>,
    },
    {
      accessorKey: 'date',
      header: 'Data',

      cell: ({ row }) => <div>{row.getValue('date')}</div>,
    },
    {
      accessorKey: 'hour',
      header: 'Horário',
      cell: ({ row }) => <div>{row.getValue('hour')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <div>{row.getValue('status')}</div>,
    },
  ]

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const getBlocks = async () => {
    setLoadingBlock(true)
    const response = await getAllBlocks({ page: '1' })

    if (response.blocks) {
      setBlock(response.blocks)
    }

    setLoadingBlock(false)
  }

  const findAllUser = async () => {
    setLoading(true)
    const response = await getAllSchedulingByDate({
      companyId: user.companyId ?? '',
      date: moment(date).utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
      blockId,
    })
    if (response.success && response.scheduling) {
      const date = response.scheduling.map((item) => {
        return {
          id: item.id,
          blockName: item.companyBlock.name,
          client: item.user.name,
          cpf: item.user.cpf,
          email: item.user.email,
          status: item.status,
          date: format(new Date(item.date), 'dd/MM/yyyy'),
          hour: ` ${item.companyBlockHour.startTime} - ${item.companyBlockHour.endTime}`,
        }
      })
      setTableData(date)
    }

    setLoading(false)
  }

  React.useEffect(() => {
    findAllUser()
  }, [blockId, date])

  React.useEffect(() => {
    getBlocks()
  }, [])

  return (
    <>
      <Helmet title="Agenda" />

      <div>
        <div className="flex items-center gap-3">
          <div className=" flex flex-col">
            <Label className="mb-2 text-sm font-semibold">Dia da semana</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Selecione um dia</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  lang="pt"
                />
              </PopoverContent>
            </Popover>
          </div>
          {!loadingBlock && (
            <>
              <div>
                <Label className="text-sm font-semibold">Quadra</Label>

                <Select onValueChange={(e) => setBlockId(e)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione a quadra para filtrar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {block.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="mb-8 flex flex-col items-center justify-center">
              <img src={LoadingGif} alt="Loading..." className="flex w-40" />
              <p className="mt-8 text-center text-base opacity-40">
                Estamos carregando seus agendamentos!
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        Nem uma quadra encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
