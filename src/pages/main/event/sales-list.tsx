import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'

import { Button } from '../../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { Input } from '../../../components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import { ScreenLoading } from '../../../components/screen-loading'
import { Helmet } from 'react-helmet-async'

import { useParams } from 'react-router-dom'
import { maskCPF } from '../../../utils/Mask'
import {
  getAllSales,
  GetAllSalesRequest,
} from '../../../services/event/get-all-sales'
import { UserType } from '../../../services/event'

export default function SalesListPage() {
  const { eventId } = useParams<{ eventId: string }>()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [tableData, setTableData] = React.useState<UserType[] | []>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [page, setPage] = React.useState<number>(1)
  const [handleDisableBackButton, setHandleDisableBackButton] =
    React.useState(false)
  const [handleDisableNextButton, setHandleDisableNextButton] =
    React.useState(false)
  const [nameQuery, setNameQuery] = React.useState<string>('')

  const columns: ColumnDef<UserType>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'cpf',
      header: 'CPF',
      cell: ({ row }) => <div>{maskCPF(row.getValue('cpf'))}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',

      cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'mobilePhone',
      header: 'Telefone',
      cell: ({ row }) => <div>{row.getValue('mobilePhone')}</div>,
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

  const findAllUser = async () => {
    const filter: GetAllSalesRequest = {
      page: String(page),
      nameQuery: nameQuery.length > 3 ? nameQuery.toLocaleLowerCase() : '',
      eventId: eventId ?? '',
    }

    const response = await getAllSales(filter)
    if (response.sales) {
      setTableData(response.sales.map((sale) => sale.user))
    } else {
      setHandleDisableNextButton(true)
    }

    if (page === 1) setHandleDisableBackButton(true)
    if (page !== 1) setHandleDisableBackButton(false)

    setLoading(false)
  }

  const handleNextPage = () => {
    setPage(page + 1)
  }

  const handleAfterPage = () => {
    if (page === 1) {
      setPage(1)
    }
    setPage(page - 1)
  }

  React.useEffect(() => {
    findAllUser()
  }, [page, nameQuery])

  return (
    <>
      <Helmet title="Clientes" />
      <div className="w-full">
        {loading ? (
          <ScreenLoading />
        ) : (
          <>
            <div className="flex items-center py-4">
              <Input
                className="max-w-sm"
                placeholder="Filtrar por nome..."
                input={{
                  change: (val: string) => setNameQuery(val),
                  value: nameQuery,
                }}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Colunas <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                        Nem um cliente encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAfterPage}
                  disabled={handleDisableBackButton}
                >
                  Voltar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={handleDisableNextButton}
                >
                  Proximo
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
