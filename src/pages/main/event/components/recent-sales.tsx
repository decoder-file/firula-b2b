import { formatCurrency } from '../../../../utils/functions'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../../components/ui/avatar'

type RecentSalesProps = {
  recentSales:
    | {
        userId: string
        userName: string
        userEmail: string
        userPhoneNumber: string
        priceTicket: string
      }[]
    | []
}

export function RecentSales({ recentSales }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {recentSales.map((sale, index) => (
        <>
          <div className="flex items-center gap-4" key={index}>
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback>
                {sale.userName
                  .split(' ')
                  .map((name) => name[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-wrap items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {sale.userName.split(' ')[0]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {sale.userEmail}
                </p>
              </div>
              <div className="font-medium">
                R$ {formatCurrency((sale.priceTicket ?? 0).toString())}
              </div>
            </div>
          </div>
        </>
      ))}
    </div>
  )
}
