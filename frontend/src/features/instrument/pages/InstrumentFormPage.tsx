import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/shadcn/select'
import { Search, X, ChevronRight } from 'lucide-react'
import {
  useGetInstrumentQuery,
  useCreateInstrumentMutation,
  useUpdateInstrumentMutation,
  useGetInstrumentConnectionQuery,
  useSetInstrumentConnectionMutation,
  useGetInstrumentCatalogQuery,
  type InstrumentCatalogItemDto,
} from '@/features/instrument/api/instrumentApi'

/* ─── tokens ─────────────────────────────────────────────────────────────── */
const PROTOCOL_COLOR: Record<string, string> = {
  ASTM: '#2563eb', HL7: '#9333ea', PROPRIETARY: '#d97706',
}

/* ─── reusable primitives ────────────────────────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
      {children}
    </div>
  )
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 5, display: 'block', letterSpacing: '0.01em' }}>
      {children}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
    </label>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '7px 10px', fontSize: 13, color: '#0f172a',
  background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8,
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}

function FInput({ placeholder, type = 'text', disabled, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      {...rest}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ ...inputStyle, borderColor: focused ? '#94a3b8' : '#e2e8f0', opacity: disabled ? 0.6 : 1 }}
    />
  )
}

function FSelect({ value, onValueChange, options }: {
  value: string
  onValueChange: (v: string) => void
  options: { value: string; label: string; color?: string }[]
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger style={{ ...inputStyle, height: 34, display: 'flex', alignItems: 'center' } as React.CSSProperties}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(o => (
          <SelectItem key={o.value} value={o.value}>
            <span style={{ color: o.color }}>{o.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function InfoCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 14, color: '#64748b' }}>{icon}</span>
          {title}
        </span>
      </div>
      <div style={{ padding: '18px 20px', flex: 1 }}>
        {children}
      </div>
    </div>
  )
}

function btnStyle(bg: string, color: string, border: string, disabled?: boolean): React.CSSProperties {
  return {
    background: bg, color, border: `1px solid ${border}`, borderRadius: 8,
    padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1, transition: 'opacity 0.15s', display: 'inline-flex', alignItems: 'center', gap: 6,
  }
}

/* ─── form values ────────────────────────────────────────────────────────── */
interface FormValues {
  code: string; name: string; manufacturer: string; model: string
  protocolType: string; transportType: string; directionMode: string; location: string
  host: string; port: string; serialPort: string; baudRate: string
  encoding: string; timeoutMs: string; retryLimit: string; ackEnabled: string
  fileImportPath: string; fileExportPath: string
}

/* ─── main ───────────────────────────────────────────────────────────────── */
export function InstrumentFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)

  const [catalogSearch, setCatalogSearch] = useState('')
  const [showCatalog, setShowCatalog] = useState(!isEdit)
  const [selectedFromCatalog, setSelectedFromCatalog] = useState<InstrumentCatalogItemDto | null>(null)

  const { data: existing } = useGetInstrumentQuery(id!, { skip: !isEdit })
  const { data: existingConnection } = useGetInstrumentConnectionQuery(id!, { skip: !isEdit })
  const { data: catalogItems = [] } = useGetInstrumentCatalogQuery({ search: catalogSearch }, { skip: isEdit })

  const [createInstrument, { isLoading: isCreating }] = useCreateInstrumentMutation()
  const [updateInstrument, { isLoading: isUpdating }] = useUpdateInstrumentMutation()
  const [setConnection] = useSetInstrumentConnectionMutation()

  const { register, handleSubmit, reset, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      code: '', name: '', manufacturer: '', model: '',
      protocolType: 'ASTM', transportType: 'TCP', directionMode: 'BIDIRECTIONAL', location: '',
      host: '', port: '', serialPort: '', baudRate: '', encoding: 'ASCII',
      timeoutMs: '10000', retryLimit: '3', ackEnabled: 'true',
      fileImportPath: '', fileExportPath: '',
    },
  })

  useEffect(() => {
    if (existing) {
      reset({
        code: existing.code, name: existing.name,
        manufacturer: existing.manufacturer ?? '', model: existing.model ?? '',
        protocolType: existing.protocolType, transportType: existing.transportType,
        directionMode: existing.directionMode, location: existing.location ?? '',
        host: existingConnection?.host ?? '', port: existingConnection?.port?.toString() ?? '',
        serialPort: existingConnection?.serialPort ?? '',
        baudRate: existingConnection?.baudRate?.toString() ?? '',
        encoding: existingConnection?.encoding ?? 'ASCII',
        timeoutMs: existingConnection?.timeoutMs?.toString() ?? '10000',
        retryLimit: existingConnection?.retryLimit?.toString() ?? '3',
        ackEnabled: existingConnection?.ackEnabled ? 'true' : 'false',
        fileImportPath: existingConnection?.fileImportPath ?? '',
        fileExportPath: existingConnection?.fileExportPath ?? '',
      })
    }
  }, [existing, existingConnection, reset])

  const protocolType = watch('protocolType')
  const transportType = watch('transportType')
  const directionMode = watch('directionMode')
  const ackEnabled = watch('ackEnabled')

  const selectFromCatalog = (item: InstrumentCatalogItemDto) => {
    setSelectedFromCatalog(item)
    setShowCatalog(false)
    reset((prev) => ({
      ...prev,
      code: item.code, name: item.name,
      manufacturer: item.manufacturer, model: item.model,
      protocolType: item.protocolType, transportType: item.transportType,
      directionMode: item.directionMode,
      port: item.defaultPort?.toString() ?? '',
      baudRate: item.defaultBaudRate?.toString() ?? '',
    }))
  }

  const onSubmit = async (values: FormValues) => {
    const instrumentPayload = {
      code: values.code, name: values.name,
      manufacturer: values.manufacturer || undefined, model: values.model || undefined,
      protocolType: values.protocolType, transportType: values.transportType,
      directionMode: values.directionMode, location: values.location || undefined,
    }

    let instrumentId = id
    if (isEdit && id) {
      await updateInstrument({ id, ...instrumentPayload })
    } else {
      const result = await createInstrument(instrumentPayload)
      if ('data' in result) instrumentId = result.data.id
      else return
    }

    const connectionPayload: Record<string, unknown> = {
      encoding: values.encoding || undefined,
      timeoutMs: values.timeoutMs ? Number(values.timeoutMs) : undefined,
      retryLimit: values.retryLimit ? Number(values.retryLimit) : 3,
      ackEnabled: values.ackEnabled === 'true',
    }
    if (values.transportType === 'TCP') {
      connectionPayload.host = values.host || undefined
      connectionPayload.port = values.port ? Number(values.port) : undefined
    } else if (values.transportType === 'SERIAL') {
      connectionPayload.serialPort = values.serialPort || undefined
      connectionPayload.baudRate = values.baudRate ? Number(values.baudRate) : undefined
    } else if (values.transportType === 'FILE_SYSTEM') {
      connectionPayload.fileImportPath = values.fileImportPath || undefined
      connectionPayload.fileExportPath = values.fileExportPath || undefined
    }

    if (instrumentId) {
      await setConnection({ instrumentId, ...connectionPayload })
      navigate(`/instruments/${instrumentId}`)
    }
  }

  const isSaving = isCreating || isUpdating

  const grouped = catalogItems.reduce<Record<string, InstrumentCatalogItemDto[]>>((acc, item) => {
    if (!acc[item.manufacturer]) acc[item.manufacturer] = []
    acc[item.manufacturer].push(item)
    return acc
  }, {})

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ background: '#f1f5f9', minHeight: 'calc(100vh - 64px)', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      {/* ── Header card ─────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#64748b', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}
        >
          ← Retour
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
            {isEdit ? `Modifier — ${existing?.name ?? '…'}` : 'Nouvel instrument'}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
            {isEdit ? 'Mettez à jour les informations et la connexion de l\'instrument.' : 'Sélectionnez un modèle du catalogue puis configurez la connexion.'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => navigate(-1)} style={btnStyle('#f8fafc', '#64748b', '#e2e8f0')}>
            Annuler
          </button>
          <button type="submit" disabled={isSaving} style={btnStyle('#0f172a', '#fff', '#0f172a', isSaving)}>
            {isSaving ? 'Enregistrement…' : isEdit ? '✓ Enregistrer' : '✓ Créer l\'instrument'}
          </button>
        </div>
      </div>

      {/* ── Catalog picker (create only) ─────────────────────────────────── */}
      {!isEdit && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 14, color: '#64748b' }}>⊞</span>
              Catalogue d'instruments
            </span>
            {selectedFromCatalog && (
              <button
                type="button"
                onClick={() => { setSelectedFromCatalog(null); setShowCatalog(true) }}
                style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <X size={11} /> Changer
              </button>
            )}
          </div>

          <div style={{ padding: '16px 20px' }}>
            {selectedFromCatalog ? (
              /* Selected state */
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#0ea5e915', border: '1.5px solid #0ea5e930', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0ea5e9' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{selectedFromCatalog.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{selectedFromCatalog.manufacturer} · {selectedFromCatalog.model}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <ProtoPill value={selectedFromCatalog.protocolType} />
                  <ProtoPill value={selectedFromCatalog.transportType} />
                </div>
              </div>
            ) : showCatalog ? (
              /* Catalog browser */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Search */}
                <div style={{ position: 'relative' }}>
                  <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Rechercher par fabricant, modèle…"
                    value={catalogSearch}
                    onChange={e => setCatalogSearch(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 30 }}
                  />
                </div>

                {/* List */}
                <div style={{ maxHeight: 260, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 2 }}>
                  {Object.entries(grouped).map(([manufacturer, items]) => (
                    <div key={manufacturer}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 4px', marginBottom: 4 }}>
                        {manufacturer}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {items.map(item => (
                          <CatalogRow key={item.id} item={item} onSelect={selectFromCatalog} />
                        ))}
                      </div>
                    </div>
                  ))}
                  {catalogItems.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: '20px 0' }}>Aucun modèle trouvé</div>
                  )}
                </div>

                {/* Manual option */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                  <button type="button" onClick={() => setShowCatalog(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#94a3b8', padding: 0 }}>
                    Configurer manuellement sans catalogue →
                  </button>
                </div>
              </div>
            ) : (
              /* Collapsed */
              <button type="button" onClick={() => setShowCatalog(true)}
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Search size={13} /> Ouvrir le catalogue
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── 2-column form ────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>

        {/* Card: Informations */}
        <InfoCard title="Informations" icon="⊙">
          <SectionTitle>Identification</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px', marginBottom: 18 }}>
            <div>
              <FieldLabel required>Code interne</FieldLabel>
              <FInput {...register('code')} disabled={isEdit} placeholder="Ex: COBAS_C311" />
            </div>
            <div>
              <FieldLabel required>Nom affiché</FieldLabel>
              <FInput {...register('name')} placeholder="Ex: cobas c 311" />
            </div>
            <div>
              <FieldLabel>Fabricant</FieldLabel>
              <FInput {...register('manufacturer')} placeholder="Ex: Roche Diagnostics" />
            </div>
            <div>
              <FieldLabel>Modèle</FieldLabel>
              <FInput {...register('model')} placeholder="Ex: cobas c 311" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <FieldLabel>Localisation</FieldLabel>
              <FInput {...register('location')} placeholder="Ex: Labo Biochimie, Salle 3…" />
            </div>
          </div>

          <SectionTitle>Communication</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px' }}>
              <div>
                <FieldLabel>Protocole</FieldLabel>
                <FSelect
                  value={protocolType}
                  onValueChange={v => setValue('protocolType', v)}
                  options={[
                    { value: 'ASTM', label: 'ASTM', color: PROTOCOL_COLOR.ASTM },
                    { value: 'HL7', label: 'HL7', color: PROTOCOL_COLOR.HL7 },
                    { value: 'PROPRIETARY', label: 'Propriétaire', color: PROTOCOL_COLOR.PROPRIETARY },
                  ]}
                />
              </div>
              <div>
                <FieldLabel>Transport</FieldLabel>
                <FSelect
                  value={transportType}
                  onValueChange={v => setValue('transportType', v)}
                  options={[
                    { value: 'TCP', label: '⬡ TCP/IP' },
                    { value: 'SERIAL', label: '⇌ Série (RS-232)' },
                    { value: 'FILE_SYSTEM', label: '⊞ Fichier' },
                  ]}
                />
              </div>
            </div>
            <div>
              <FieldLabel>Direction</FieldLabel>
              <FSelect
                value={directionMode}
                onValueChange={v => setValue('directionMode', v)}
                options={[
                  { value: 'BIDIRECTIONAL', label: '⇄ Bidirectionnel' },
                  { value: 'UNIDIRECTIONAL', label: '→ Unidirectionnel' },
                ]}
              />
            </div>
          </div>
        </InfoCard>

        {/* Card: Connexion */}
        <InfoCard title="Connexion" icon="⬡">

          {transportType === 'TCP' && (
            <>
              <SectionTitle>Réseau TCP/IP</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px', marginBottom: 18 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <FieldLabel>Hôte / Adresse IP</FieldLabel>
                  <FInput {...register('host')} placeholder="Ex: 192.168.1.100" />
                </div>
                <div>
                  <FieldLabel>Port TCP</FieldLabel>
                  <FInput {...register('port')} type="number" placeholder="Ex: 10001" />
                </div>
                <div>
                  <FieldLabel>ACK</FieldLabel>
                  <FSelect
                    value={ackEnabled}
                    onValueChange={v => setValue('ackEnabled', v)}
                    options={[{ value: 'true', label: 'Oui' }, { value: 'false', label: 'Non' }]}
                  />
                </div>
              </div>
            </>
          )}

          {transportType === 'SERIAL' && (
            <>
              <SectionTitle>Port série (RS-232)</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px', marginBottom: 18 }}>
                <div>
                  <FieldLabel>Port série</FieldLabel>
                  <FInput {...register('serialPort')} placeholder="Ex: COM1 ou /dev/ttyUSB0" />
                </div>
                <div>
                  <FieldLabel>Baud rate</FieldLabel>
                  <FInput {...register('baudRate')} type="number" placeholder="Ex: 9600" />
                </div>
              </div>
            </>
          )}

          {transportType === 'FILE_SYSTEM' && (
            <>
              <SectionTitle>Chemins de fichiers</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                <div>
                  <FieldLabel>Répertoire d'import</FieldLabel>
                  <FInput {...register('fileImportPath')} placeholder="Ex: /data/import/" />
                </div>
                <div>
                  <FieldLabel>Répertoire d'export</FieldLabel>
                  <FInput {...register('fileExportPath')} placeholder="Ex: /data/export/" />
                </div>
              </div>
            </>
          )}

          <SectionTitle>Options générales</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px' }}>
            <div>
              <FieldLabel>Encodage</FieldLabel>
              <FSelect
                value={watch('encoding')}
                onValueChange={v => setValue('encoding', v)}
                options={[
                  { value: 'ASCII', label: 'ASCII' },
                  { value: 'UTF-8', label: 'UTF-8' },
                  { value: 'ISO-8859-1', label: 'ISO-8859-1' },
                ]}
              />
            </div>
            <div>
              <FieldLabel>Timeout</FieldLabel>
              <FInput {...register('timeoutMs')} type="number" placeholder="10000" />
            </div>
            <div>
              <FieldLabel>Tentatives max</FieldLabel>
              <FInput {...register('retryLimit')} type="number" placeholder="3" />
            </div>
          </div>
        </InfoCard>
      </div>

    </form>
  )
}

/* ─── catalog sub-components ─────────────────────────────────────────────── */
function CatalogRow({ item, onSelect }: { item: InstrumentCatalogItemDto; onSelect: (i: InstrumentCatalogItemDto) => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: hover ? '#f8fafc' : 'transparent', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.1s', width: '100%' }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{item.model}</div>
      </div>
      <ProtoPill value={item.protocolType} />
      <ChevronRight size={13} style={{ color: hover ? '#3b82f6' : '#cbd5e1', transition: 'color 0.1s', flexShrink: 0 }} />
    </button>
  )
}

function ProtoPill({ value }: { value: string }) {
  const color = PROTOCOL_COLOR[value] ?? '#64748b'
  return (
    <span style={{ padding: '2px 8px', borderRadius: 20, background: color + '12', border: `1px solid ${color}25`, fontSize: 10, fontWeight: 700, color, flexShrink: 0 }}>
      {value}
    </span>
  )
}
