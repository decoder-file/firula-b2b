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
import { ChevronDown, MoreHorizontal } from 'lucide-react'

import { Button } from '../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { Input } from '../../components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { ScreenLoading } from '../../components/screen-loading'
import { Helmet } from 'react-helmet-async'

import { useNavigate } from 'react-router-dom'
import {
  getAllUsersByCompanyId,
  GetAllUsersByCompanyIdRequestType,
  UsersType,
} from '../../services/user'
import { useUserStore } from '../../store/UserStore'
import { maskCPF } from '../../utils/Mask'

export default function CostumersPage() {
  const { user } = useUserStore()

  const navigate = useNavigate()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [tableData, setTableData] = React.useState<UsersType[] | []>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [page, setPage] = React.useState<number>(1)
  const [handleDisableBackButton, setHandleDisableBackButton] =
    React.useState(false)
  const [handleDisableNextButton, setHandleDisableNextButton] =
    React.useState(false)
  const [nameQuery, setNameQuery] = React.useState<string>('')

  const columns: ColumnDef<UsersType>[] = [
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
      accessorKey: 'isBlock',
      header: 'Status',
      cell: ({ row }) => (
        <div>
          {row.getValue('isBlock') === true ? 'Bloqueado' : 'Desbloqueado'}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const clientId: string = row.getValue('id')

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate(`/b2b/costumers/${clientId}`)}
              >
                Visualizar detalhe do cliente
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
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
    const filter: GetAllUsersByCompanyIdRequestType = {
      page: String(page),
      queryName: nameQuery.length > 3 ? nameQuery.toLocaleLowerCase() : '',
      companyId: user.companyId ?? '',
    }

    const response = await getAllUsersByCompanyId(filter)
    if (response.users) {
      setTableData(response.users)
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
                        Nem uma quadra encontrado.
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
