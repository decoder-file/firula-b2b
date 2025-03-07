import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

interface BannerAlertProps {
  onClickComplete: () => void
  title: string
  description: string
  textButton: string
}

export default function BannerAlert({
  onClickComplete,
  title,
  description,
  textButton,
}: BannerAlertProps) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {description}

        <a
          onClick={onClickComplete}
          className="ml-1 cursor-pointer font-medium underline underline-offset-4"
        >
          {textButton}
        </a>
      </AlertDescription>
    </Alert>
  )
}
