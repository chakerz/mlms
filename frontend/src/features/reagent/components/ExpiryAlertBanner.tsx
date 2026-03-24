import { Alert } from '@/shared/ui/Alert'
import { ReagentLotDto } from '../api/reagentApi'

const EXPIRY_WARN_DAYS = 30

interface Props {
  lots: ReagentLotDto[]
}

export function ExpiryAlertBanner({ lots }: Props) {
  const now = new Date()
  const warnDate = new Date(now.getTime() + EXPIRY_WARN_DAYS * 24 * 60 * 60 * 1000)

  const expired = lots.filter((l) => l.isExpired)
  const soonToExpire = lots.filter((l) => {
    if (l.isExpired || l.isBlocked) return false
    return new Date(l.expiryDate) <= warnDate
  })

  return (
    <>
      {expired.length > 0 && (
        <Alert
          variant="error"
          className="mb-4"
          message={`Lots expirés (${expired.length}) : ${expired.map((l) => l.lotNumber).join(', ')}`}
        />
      )}
      {soonToExpire.length > 0 && (
        <Alert
          variant="warning"
          className="mb-4"
          message={`Expiration dans ${EXPIRY_WARN_DAYS} jours (${soonToExpire.length}) : ${soonToExpire.map((l) => l.lotNumber).join(', ')}`}
        />
      )}
    </>
  )
}
