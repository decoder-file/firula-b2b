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
import { MoreHorizontal } from 'lucide-react'

import { Button } from '../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
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
import {
  BlockType,
  getBlocksByCompanyId,
  updateBlocks,
} from '../../services/blocks'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../utils/functions'
import { useUserStore } from '../../store/UserStore'

export default function BlocksPage() {
  const navigate = useNavigate()
  const { user } = useUserStore()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [tableData, setTableData] = React.useState<BlockType[] | []>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  const columns: ColumnDef<BlockType>[] = [
    {
      accessorKey: 'id',
      header: 'Id',
      cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'valueForHour',
      header: 'Valor por hora',
      cell: ({ row }) => (
        <div> R$ {formatCurrency(row.getValue('valueForHour'))}</div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',

      cell: ({ row }) => (
        <div>{row.getValue('isActive') === true ? 'Ativo' : 'Desativado'}</div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const blockId: string = row.getValue('id')
        const blockStatus: boolean = row.getValue('isActive')

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Visualizar detalhe da quadra</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => updateBlock(blockId, !blockStatus)}
              >
                {row.getValue('isActive')
                  ? 'Desativar quadra'
                  : 'Ativar quadra'}
              </DropdownMenuItem>
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

  const updateBlock = async (blockId: string, isActive: boolean) => {
    const response = await updateBlocks({
      blockId,
      isActive,
    })

    if (response.success) {
      findAllBlocks()
    }
  }

  const findAllBlocks = async () => {
    const response = await getBlocksByCompanyId({
      companyId: user.companyId ?? '',
    })
    if (response.blocks) {
      setTableData(response.blocks)
    }

    setLoading(false)
  }

  React.useEffect(() => {
    findAllBlocks()
  }, [])

  return (
    <>
      <Helmet title="Quadras" />
      <div className="w-full">
        {loading ? (
          <ScreenLoading />
        ) : (
          <>
            <Button
              onClick={() => navigate('/b2b/create-block')}
              className="mb-3"
            >
              Cadastrar nova quadra
            </Button>
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
          </>
        )}
      </div>
    </>
  )
}
