import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { SelectField, SelectItem } from '@/shared/ui/Select'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Label } from '@/shared/ui/shadcn/label'
import { CreateSpecimenRequest } from '@/features/specimen/api/specimenApi'
import { useGetOrderQuery } from '@/features/order/api/orderApi'
import { useGetPatientQuery } from '@/features/patient/api/patientApi'
import { formatDate } from '@/shared/utils/formatDate'

const SPECIMEN_TYPES = [
  'WHOLE_BLOOD', 'SERUM', 'PLASMA', 'URINE', 'URINE_24H', 'STOOL',
  'CSF', 'NASAL_SWAB', 'VAGINAL_SWAB', 'ENDOCERVICAL_SWAB',
  'SPUTUM', 'AMNIOTIC_FLUID', 'BONE_MARROW', 'RESPIRATORY',
] as const

const CONTAINER_TYPES = [
  'EDTA_TUBE', 'CITRATE_TUBE', 'DRY_TUBE', 'HEPARIN_TUBE',
] as const

interface SpecimenFormProps {
  defaultOrderId?: string
  onSubmit: (data: CreateSpecimenRequest) => void
  isLoading?: boolean
  error?: string
}

function OrderInfoBlock({ orderId }: { orderId: string }) {
  const { t } = useTranslation('specimen')
  const { data: order } = useGetOrderQuery(orderId)
  const { data: patient } = useGetPatientQuery(order?.patientId ?? '', { skip: !order?.patientId })

  return (
    <div className="space-y-1.5">
      <Label>{t('form.orderRef')}</Label>
      <div className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-md text-sm">
        <span className="text-xs font-mono text-muted-foreground">#{orderId.slice(-8)}</span>
        {patient ? (
          <>
            <span className="font-medium text-foreground">
              {patient.lastName.toUpperCase()} {patient.firstName}
            </span>
            <span className="text-xs text-muted-foreground mx-2">·</span>
            <span className="text-xs text-muted-foreground">{formatDate(patient.birthDate)}</span>
          </>
        ) : (
          <span className="text-muted-foreground">…</span>
        )}
      </div>
    </div>
  )
}

export function SpecimenForm({ defaultOrderId, onSubmit, isLoading, error }: SpecimenFormProps) {
  const { t } = useTranslation('specimen')
  const [orderId, setOrderId] = useState(defaultOrderId ?? '')
  const [barcode, setBarcode] = useState('')
  const [autoBarcode, setAutoBarcode] = useState(true)
  const [type, setType] = useState<string>('WHOLE_BLOOD')
  const [containerType, setContainerType] = useState<string>('')
  const [collectionTime, setCollectionTime] = useState(
    () => new Date().toISOString().slice(0, 16),
  )
  const [preleveur, setPreleveur] = useState('')
  const [transportConditions, setTransportConditions] = useState('')
  const [conservationSite, setConservationSite] = useState('')
  const [notes, setNotes] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    if (!orderId.trim()) {
      setValidationError(t('form.orderId') + ' requis')
      return
    }

    onSubmit({
      orderId,
      barcode: autoBarcode ? undefined : barcode || undefined,
      type,
      containerType: containerType || undefined,
      collectionTime: new Date(collectionTime).toISOString(),
      preleveur: preleveur || undefined,
      transportConditions: transportConditions || undefined,
      conservationSite: conservationSite || undefined,
      notes: notes || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || validationError) && (
        <Alert variant="error" message={error ?? validationError ?? ''} />
      )}

      {defaultOrderId ? (
        <OrderInfoBlock orderId={defaultOrderId} />
      ) : (
        <Input
          label={t('form.orderId')}
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
      )}

      <div className="space-y-1.5">
        <Label>{t('form.barcode')}</Label>
        <div className="flex items-center gap-2.5">
          <Checkbox
            id="autoBarcode"
            checked={autoBarcode}
            onCheckedChange={(checked) => setAutoBarcode(!!checked)}
          />
          <Label htmlFor="autoBarcode" className="font-normal cursor-pointer">
            {t('form.barcodeAuto')}
          </Label>
        </div>
        {!autoBarcode && (
          <Input
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="LAB-20260316-XXXXXX"
          />
        )}
      </div>

      <SelectField
        label={`${t('form.type')} *`}
        value={type}
        onValueChange={setType}
      >
        {SPECIMEN_TYPES.map((st) => (
          <SelectItem key={st} value={st}>{t(`type.${st}`)}</SelectItem>
        ))}
      </SelectField>

      <SelectField
        label={t('form.containerType')}
        value={containerType}
        onValueChange={setContainerType}
        placeholder="— Aucun —"
      >
        {CONTAINER_TYPES.map((ct) => (
          <SelectItem key={ct} value={ct}>{t(`containerType.${ct}`)}</SelectItem>
        ))}
      </SelectField>

      <Input
        label={t('form.collectionTime')}
        type="datetime-local"
        value={collectionTime}
        onChange={(e) => setCollectionTime(e.target.value)}
      />

      <Input
        label={t('form.preleveur')}
        value={preleveur}
        onChange={(e) => setPreleveur(e.target.value)}
        placeholder={t('form.preleveurPlaceholder')}
      />

      <Input
        label={t('form.transportConditions')}
        value={transportConditions}
        onChange={(e) => setTransportConditions(e.target.value)}
        placeholder={t('form.transportConditionsPlaceholder')}
      />

      <Input
        label={t('form.conservationSite')}
        value={conservationSite}
        onChange={(e) => setConservationSite(e.target.value)}
        placeholder={t('form.conservationSitePlaceholder')}
      />

      <Input
        label={t('form.notes')}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          {t('actions.create')}
        </Button>
      </div>
    </form>
  )
}
