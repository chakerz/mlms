import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/shadcn/button'
import { useGetInstrumentsQuery, InstrumentDto } from '@/features/instrument/api/instrumentApi'

const STATUS_COLOR: Record<string, string> = {
  active:   '#16a34a',
  inactive: '#94a3b8',
}

const PROTOCOL_COLOR: Record<string, string> = {
  ASTM:        '#2563eb',
  HL7:         '#9333ea',
  PROPRIETARY: '#d97706',
}

const TRANSPORT_ICON: Record<string, string> = {
  TCP:         '⬡',
  SERIAL:      '⇌',
  FILE_SYSTEM: '⊞',
}

function InstrumentCard({ inst }: { inst: InstrumentDto }) {
  const navigate = useNavigate()
  const color = inst.isActive ? STATUS_COLOR.active : STATUS_COLOR.inactive
  const isAnimated = false

  const protoColor = PROTOCOL_COLOR[inst.protocolType] ?? '#64748b'

  return (
    <div
      onClick={() => navigate(`/instruments/${inst.id}`)}
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        padding: 24,
        cursor: 'pointer',
        transition: 'box-shadow 0.18s, transform 0.18s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = `0 8px 32px ${color}22, 0 2px 12px rgba(0,0,0,0.08)`
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'
        el.style.transform = 'none'
      }}
    >
      {/* Top row: LED + name + code */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: color + '15', border: `2px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 14, height: 14, borderRadius: '50%',
            background: color, boxShadow: `0 0 8px ${color}`,
            animation: isAnimated ? 'pulse 1.2s ease-in-out infinite' : 'none',
          }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
            {inst.name}
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
            {inst.manufacturer ?? '—'} · {inst.model ?? '—'}
          </div>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 20,
              background: color + '12', border: `1px solid ${color}30`,
              fontSize: 12, fontWeight: 600, color,
            }}>
              {inst.isActive ? 'Actif' : 'Inactif'}
            </span>
          </div>
        </div>

        <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace', fontWeight: 600, flexShrink: 0 }}>
          {inst.code}
        </div>
      </div>

      {/* Info block */}
      <div style={{
        background: '#f8fafc', borderRadius: 10,
        padding: '12px 14px', marginBottom: 18,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
          Configuration
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
          <InfoRow label="Protocole" value={inst.protocolType} mono color={protoColor} />
          <InfoRow label="Transport" value={`${TRANSPORT_ICON[inst.transportType] ?? ''} ${inst.transportType}`} mono />
          <InfoRow label="Direction" value={inst.directionMode === 'BIDIRECTIONAL' ? 'Bidirectionnel' : 'Unidirectionnel'} />
          <InfoRow label="Localisation" value={inst.location ?? '—'} />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        paddingTop: 14, borderTop: '1px solid #f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 12, color: '#94a3b8' }}>
          {inst.updatedAt ? `Mis à jour : ${new Date(inst.updatedAt).toLocaleDateString('fr-FR')}` : ''}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6' }}>Ouvrir →</span>
      </div>
    </div>
  )
}

function InfoRow({ label, value, mono, color }: { label: string; value: string; mono?: boolean; color?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span style={{ fontSize: 10, color: '#94a3b8' }}>{label}</span>
      <span style={{
        fontSize: 12, fontWeight: 500,
        color: color ?? '#334155',
        fontFamily: mono ? 'monospace' : undefined,
      }}>
        {value}
      </span>
    </div>
  )
}

export function InstrumentListPage() {
  const { t } = useTranslation(['instrument', 'common'])
  const { data, isLoading } = useGetInstrumentsQuery({ page: 1, pageSize: 100 })

  const instruments = data?.data ?? []

  return (
    <div style={{ background: '#f1f5f9', minHeight: 'calc(100vh - 64px)', padding: '28px 32px' }}>

      {/* Header */}
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
              {t('instrument:titleList', { defaultValue: 'Instruments d\'analyse' })}
            </h2>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
              {isLoading ? '…' : `${instruments.length} appareil${instruments.length > 1 ? 's' : ''} configuré${instruments.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <Link to="/instruments/new">
            <Button size="sm">{t('common:actions.new', { defaultValue: 'Nouveau' })}</Button>
          </Link>
        </div>

        {/* Loading */}
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#94a3b8', fontSize: 14 }}>
            Chargement…
          </div>
        )}

        {/* Empty */}
        {!isLoading && instruments.length === 0 && (
          <div style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
            padding: 48, textAlign: 'center', color: '#94a3b8', fontSize: 14,
          }}>
            Aucun instrument configuré.{' '}
            <Link to="/instruments/new" style={{ color: '#3b82f6', fontWeight: 600 }}>
              Ajouter le premier →
            </Link>
          </div>
        )}

        {/* Grid */}
        {!isLoading && instruments.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
            gap: 20,
          }}>
            {instruments.map(inst => (
              <InstrumentCard key={inst.id} inst={inst} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
