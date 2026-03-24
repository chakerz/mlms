import { Printer } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/Button'

interface BarcodePrintButtonProps {
  barcode: string
}

export function BarcodePrintButton({ barcode }: BarcodePrintButtonProps) {
  const { t } = useTranslation('specimen')

  const handlePrint = () => {
    const printContent = document.getElementById('barcode-print-area')
    if (!printContent) return

    const win = window.open('', '_blank', 'width=400,height=300')
    if (!win) return

    win.document.write(`
      <html>
        <head>
          <title>Barcode – ${barcode}</title>
          <style>
            body { font-family: monospace; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .label { text-align: center; border: 2px solid #ccc; padding: 16px 24px; border-radius: 8px; }
            .bars { display: flex; align-items: flex-end; gap: 2px; height: 48px; margin-bottom: 8px; }
            .bar { background: #111; }
            .code { font-size: 14px; font-weight: bold; letter-spacing: 4px; }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="bars">
              ${barcode.split('').map((c, i) => {
                const h = (c.charCodeAt(0) % 4) + 1
                const w = i % 3 === 0 ? 3 : 2
                return `<div class="bar" style="width:${w}px;height:${25 + h * 8}px"></div>`
              }).join('')}
            </div>
            <div class="code">${barcode}</div>
          </div>
          <script>window.onload = () => { window.print(); window.close(); }<\/script>
        </body>
      </html>
    `)
    win.document.close()
  }

  return (
    <Button variant="secondary" size="sm" onClick={handlePrint}>
      <Printer size={15} className="me-1" />
      {t('actions.print')}
    </Button>
  )
}
