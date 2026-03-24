import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  AlarmClock,
  AlertCircle,
  AlignLeft,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  Droplets,
  FileText,
  FlaskConical,
  Hash,
  Layers,
  Microscope,
  Pencil,
  Ruler,
  Sun,
  Tag,
  Thermometer,
  Timer,
  TestTube2,
  UtensilsCrossed,
} from 'lucide-react'
import { Badge } from '@/shared/ui/shadcn/badge'
import { Button } from '@/shared/ui/shadcn/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card'
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
} from '@/shared/ui/shadcn/alert'
import { useGetTestDefinitionByIdQuery } from '../api/testDefinitionApi'
import { selectCurrentUser } from '@/features/auth/model/authSelectors'
import { UserRole } from '@/shared/types/app.types'

const CATEGORY_BADGE_VARIANT: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info'> = {
  BIOCHEMISTRY: 'primary',
  HEMATOLOGY: 'destructive',
  HEMOSTASIS: 'warning',
  SEROLOGY: 'success',
  IMMUNOLOGY: 'info',
  MICROBIOLOGY: 'warning',
  MOLECULAR_BIOLOGY: 'primary',
  CYTOGENETICS: 'secondary',
  HORMONOLOGY: 'info',
  ALLERGOLOGY: 'destructive',
  TUMOR_MARKERS: 'secondary',
}

function HighlightRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType
  label: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <Icon className="size-4 text-muted-foreground shrink-0" />
      <span className="text-sm text-muted-foreground flex-1">{label}</span>
      <span className="text-sm font-medium text-foreground text-end">
        {children ?? <span className="text-muted-foreground font-normal">—</span>}
      </span>
    </div>
  )
}

export function TestDefinitionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation('testDefinition')
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)
  const isAdmin = user?.role === UserRole.ADMIN

  const { data: def, isLoading, isError } = useGetTestDefinitionByIdQuery(id!)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-2 py-16 text-muted-foreground text-sm">
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        {t('common:states.loading')}
      </div>
    )
  }

  if (isError || !def) {
    return (
      <Alert variant="destructive" appearance="light">
        <AlertIcon><AlertCircle /></AlertIcon>
        <AlertContent><AlertDescription>{t('messages.notFound')}</AlertDescription></AlertContent>
      </Alert>
    )
  }

  const isAr = i18n.language === 'ar'
  const displayName = isAr ? def.nameAr : def.nameFr
  const sampleType = isAr ? (def.sampleTypeAr ?? def.sampleTypeFr) : def.sampleTypeFr
  const tube = isAr ? (def.tubeAr ?? def.tubeFr) : def.tubeFr
  const collectionCondition = isAr ? (def.collectionConditionAr ?? def.collectionConditionFr) : def.collectionConditionFr
  const specialNotes = isAr ? def.specialNotesAr : def.specialNotesFr
  const preAnalyticDelay = isAr ? (def.preAnalyticDelayAr ?? def.preAnalyticDelay) : def.preAnalyticDelay
  const turnaroundTime = isAr ? (def.turnaroundTimeAr ?? def.turnaroundTime) : def.turnaroundTime

  const referenceRange =
    def.referenceLow != null || def.referenceHigh != null
      ? `${def.referenceLow ?? '?'} – ${def.referenceHigh ?? '?'}${def.unit ? ` ${def.unit}` : ''}`
      : null

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            mode="icon"
            className="size-8"
            onClick={() => navigate('/test-definitions')}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{displayName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs text-muted-foreground">{def.code}</span>
              <Badge variant={CATEGORY_BADGE_VARIANT[def.category] ?? 'secondary'} appearance="light">
                {t(`categories.${def.category}`, { defaultValue: def.category })}
              </Badge>
              <Badge variant={def.isActive ? 'success' : 'secondary'} appearance="light">
                {t(`status.${def.isActive ? 'active' : 'inactive'}`)}
              </Badge>
            </div>
          </div>
        </div>
        {isAdmin && (
          <Button variant="outline" size="sm" onClick={() => navigate(`/test-definitions/${id}/edit`)}>
            <Pencil className="size-4" />
            {t('actions.edit')}
          </Button>
        )}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Identification */}
        <Card>
          <CardHeader>
            <CardTitle>{t('sections.identity')}</CardTitle>
          </CardHeader>
          <CardContent className="py-0 px-5 divide-y divide-border">
            <HighlightRow icon={Hash} label={t('fields.code')}>
              <span className="font-mono">{def.code}</span>
            </HighlightRow>
            <HighlightRow icon={Tag} label={t('fields.name')}>
              {displayName}
            </HighlightRow>
            {def.synonymes && (
              <HighlightRow icon={AlignLeft} label={t('fields.synonymes')}>
                <span className="text-muted-foreground font-normal">{def.synonymes}</span>
              </HighlightRow>
            )}
            <HighlightRow icon={Layers} label={t('fields.category')}>
              <Badge variant={CATEGORY_BADGE_VARIANT[def.category] ?? 'secondary'} appearance="light">
                {t(`categories.${def.category}`, { defaultValue: def.category })}
              </Badge>
            </HighlightRow>
            <HighlightRow icon={CheckCircle2} label={t('fields.isActive')}>
              <Badge variant={def.isActive ? 'success' : 'secondary'} appearance="light">
                {t(`status.${def.isActive ? 'active' : 'inactive'}`)}
              </Badge>
            </HighlightRow>
            {def.subcontracted && (
              <HighlightRow icon={Building2} label={t('fields.subcontracted')}>
                <Badge variant="info" appearance="light">{t('bool.yes')}</Badge>
              </HighlightRow>
            )}
          </CardContent>
        </Card>

        {/* Pré-analytique */}
        <Card>
          <CardHeader>
            <CardTitle>{t('sections.catalogue')}</CardTitle>
          </CardHeader>
          <CardContent className="py-0 px-5 divide-y divide-border">
            <HighlightRow icon={Droplets} label={t('fields.sampleType')}>
              {sampleType}
            </HighlightRow>
            <HighlightRow icon={TestTube2} label={t('fields.tube')}>
              {tube}
            </HighlightRow>
            <HighlightRow icon={Microscope} label={t('fields.method')}>
              {def.method}
            </HighlightRow>
            <HighlightRow icon={FileText} label={t('fields.collectionCondition')}>
              {collectionCondition}
            </HighlightRow>
            <HighlightRow icon={Timer} label={t('fields.preAnalyticDelay')}>
              {preAnalyticDelay}
            </HighlightRow>
            <HighlightRow icon={Clock} label={t('fields.turnaroundTime')}>
              {turnaroundTime}
            </HighlightRow>
            <HighlightRow icon={UtensilsCrossed} label={t('fields.fastingRequired')}>
              <Badge variant={def.fastingRequired ? 'warning' : 'secondary'} appearance="light">
                {t(`bool.${def.fastingRequired ? 'yes' : 'no'}`)}
              </Badge>
            </HighlightRow>
          </CardContent>
        </Card>

        {/* Paramètres techniques */}
        <Card>
          <CardHeader>
            <CardTitle>{t('sections.technical')}</CardTitle>
          </CardHeader>
          <CardContent className="py-0 px-5 divide-y divide-border">
            <HighlightRow icon={Ruler} label={t('fields.referenceRange')}>
              {referenceRange}
            </HighlightRow>
            <HighlightRow icon={Tag} label={t('fields.unit')}>
              {def.unit}
            </HighlightRow>
            <HighlightRow icon={FlaskConical} label={t('fields.minVolumeMl')}>
              {def.minVolumeMl != null ? `${def.minVolumeMl} mL` : null}
            </HighlightRow>
            <HighlightRow icon={AlarmClock} label={t('fields.maxDelayMinutes')}>
              {def.maxDelayMinutes != null ? `${def.maxDelayMinutes} min` : null}
            </HighlightRow>
            <HighlightRow icon={Thermometer} label={t('fields.storageTemp')}>
              {def.storageTemp}
            </HighlightRow>
            <HighlightRow icon={Sun} label={t('fields.lightSensitive')}>
              <Badge variant={def.lightSensitive ? 'warning' : 'secondary'} appearance="light">
                {t(`bool.${def.lightSensitive ? 'yes' : 'no'}`)}
              </Badge>
            </HighlightRow>
          </CardContent>
        </Card>

        {/* Notes spéciales */}
        {specialNotes && (
          <Card>
            <CardHeader>
              <CardTitle>{t('fields.specialNotes')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{specialNotes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
