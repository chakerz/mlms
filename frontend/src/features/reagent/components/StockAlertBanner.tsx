import { Alert } from '@/shared/ui/Alert'
import { ReagentLotDto } from '../api/reagentApi'

const LOW_STOCK_THRESHOLD = 10

interface Props {
  lots: ReagentLotDto[]
}

export function StockAlertBanner({ lots }: Props) {
  const lowStock = lots.filter(
    (l) => !l.isBlocked && !l.isExpired && l.currentQuantity <= LOW_STOCK_THRESHOLD,
  )

  if (lowStock.length === 0) return null

  return (
    <Alert
      variant="warning"
      className="mb-4"
      message={`Stock faible – ${lowStock.length} lot(s) avec quantité ≤ ${LOW_STOCK_THRESHOLD} : ${lowStock.map((l) => l.lotNumber).join(', ')}`}
    />
  )
}
