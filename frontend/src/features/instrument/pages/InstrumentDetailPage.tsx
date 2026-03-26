import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Trash2, Pencil } from 'lucide-react'
import {
  useGetInstrumentQuery,
  useGetInstrumentConnectionQuery,
  useGetTestMappingsQuery,
  useDeleteTestMappingMutation,
  useUpdateInstrumentMutation,
  useDeleteInstrumentMutation,
  useGetSimulatorConfigQuery,
  useUpsertSimulatorConfigMutation,
  InstrumentTestMappingDto,
  InstrumentSimulatorConfigDto,
} from '@/features/instrument/api/instrumentApi'

/* ─── colour tokens (same as ListPage) ──────────────────────────────────── */
const PROTOCOL_COLOR: Record<string, string> = {
  ASTM: '#2563eb', HL7: '#9333ea', PROPRIETARY: '#d97706',
}
const TRANSPORT_ICON: Record<string, string> = {
  TCP: '⬡', SERIAL: '⇌', FILE_SYSTEM: '⊞',
}

/* ─── tiny helpers ───────────────────────────────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
      {children}
    </div>
  )
}

function InfoPair({ label, value, mono, color }: { label: string; value: React.ReactNode; mono?: boolean; color?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 10, color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: color ?? '#334155', fontFamily: mono ? 'monospace' : undefined }}>
        {value}
      </span>
    </div>
  )
}

function SimRow({ label, value, editing, onChange, min, max, unit }: {
  label: string; value: number; editing: boolean
  onChange: (v: string) => void; min: number; max: number; unit?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ fontSize: 12, color: '#64748b' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {editing ? (
          <input
            type="number" min={min} max={max} value={value}
            onChange={e => onChange(e.target.value)}
            style={{ width: 72, borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', padding: '3px 8px', textAlign: 'right', fontSize: 12, fontFamily: 'monospace', outline: 'none' }}
          />
        ) : (
          <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#0f172a', fontWeight: 600 }}>{value}</span>
        )}
        {unit && <span style={{ fontSize: 10, color: '#94a3b8' }}>{unit}</span>}
      </div>
    </div>
  )
}

/* ─── main component ─────────────────────────────────────────────────────── */
export function InstrumentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: instrument, isLoading } = useGetInstrumentQuery(id!, { skip: !id })
  const { data: connection } = useGetInstrumentConnectionQuery(id!, { skip: !id })
  const { data: mappings } = useGetTestMappingsQuery(id!, { skip: !id })
  const { data: simConfig } = useGetSimulatorConfigQuery(id!, { skip: !id })

  const [deleteMapping] = useDeleteTestMappingMutation()
  const [updateInstrument] = useUpdateInstrumentMutation()
  const [deleteInstrument] = useDeleteInstrumentMutation()
  const [upsertSimConfig, { isLoading: isSavingSim }] = useUpsertSimulatorConfigMutation()

  const [simForm, setSimForm] = useState<Partial<InstrumentSimulatorConfigDto>>({})
  const [simEditing, setSimEditing] = useState(false)

  useEffect(() => { if (simConfig) setSimForm(simConfig) }, [simConfig])

  const handleSaveSim = async () => {
    if (!id) return
    await upsertSimConfig({ instrumentId: id, ...simForm })
    setSimEditing(false)
  }

  const handleToggleActive = () => {
    if (instrument) updateInstrument({ id: instrument.id, isActive: !instrument.isActive })
  }

  const handleDelete = async () => {
    if (!instrument) return
    if (!window.confirm(`Supprimer "${instrument.name}" ? Cette action est irréversible.`)) return
    await deleteInstrument(instrument.id)
    navigate('/instruments')
  }

  if (isLoading || !instrument) {
    return <div style={{ padding: 24, color: '#94a3b8', fontSize: 14 }}>Chargement…</div>
  }

  const isActive = instrument.isActive
  const statusColor = isActive ? '#16a34a' : '#94a3b8'
  const protoColor = PROTOCOL_COLOR[instrument.protocolType] ?? '#64748b'

  return (
    <div style={{ background: '#f1f5f9', minHeight: 'calc(100vh - 64px)', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Header card ───────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

        {/* Back */}
        <button
          onClick={() => navigate('/instruments')}
          style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#64748b', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}
        >
          ← Retour
        </button>

        {/* LED */}
        <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: statusColor + '15', border: `2px solid ${statusColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: statusColor, boxShadow: `0 0 8px ${statusColor}` }} />
        </div>

        {/* Name + meta */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{instrument.name}</span>
            <span style={{ padding: '2px 10px', borderRadius: 20, background: statusColor + '12', border: `1px solid ${statusColor}30`, fontSize: 12, fontWeight: 600, color: statusColor }}>
              {isActive ? 'Actif' : 'Inactif'}
            </span>
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
            {instrument.manufacturer} · {instrument.model}
            <span style={{ fontFamily: 'monospace', color: '#94a3b8', marginLeft: 8 }}>{instrument.code}</span>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'flex', gap: 8, marginRight: 16 }}>
          <QuickPill label="Protocole" value={instrument.protocolType} color={protoColor} />
          <QuickPill label="Transport" value={`${TRANSPORT_ICON[instrument.transportType] ?? ''} ${instrument.transportType}`} />
          <QuickPill label="Mappings" value={String(mappings?.length ?? 0)} />
          {instrument.location && <QuickPill label="Localisation" value={instrument.location} />}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <Link to={`/instruments/${id}/edit`}>
            <ActionBtn icon="✏">Modifier</ActionBtn>
          </Link>
          <ActionBtn onClick={handleToggleActive} muted>
            {isActive ? 'Désactiver' : 'Activer'}
          </ActionBtn>
          <ActionBtn onClick={handleDelete} danger>Supprimer</ActionBtn>
        </div>
      </div>

      {/* ── 3-card row ────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>

        {/* Card: Informations */}
        <InfoCard title="Informations" icon="⊙">
          <SectionTitle>Identification</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginBottom: 14 }}>
            <InfoPair label="Fabricant" value={instrument.manufacturer ?? '—'} />
            <InfoPair label="Modèle" value={instrument.model ?? '—'} />
            <InfoPair label="Code interne" value={instrument.code} mono color="#334155" />
            <InfoPair label="Localisation" value={instrument.location ?? '—'} />
          </div>
          <SectionTitle>Communication</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            <InfoPair label="Protocole" value={instrument.protocolType} color={protoColor} mono />
            <InfoPair label="Transport" value={`${TRANSPORT_ICON[instrument.transportType] ?? ''} ${instrument.transportType}`} />
            <InfoPair label="Direction" value={instrument.directionMode === 'BIDIRECTIONAL' ? 'Bidirectionnel' : 'Unidirectionnel'} />
          </div>
        </InfoCard>

        {/* Card: Connexion */}
        <InfoCard title="Connexion" icon="⬡">
          {connection ? (
            <>
              <SectionTitle>Réseau / Série</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginBottom: 14 }}>
                {connection.host && <InfoPair label="Hôte / IP" value={connection.host} mono />}
                {connection.port && <InfoPair label="Port TCP" value={String(connection.port)} mono />}
                {connection.serialPort && <InfoPair label="Port série" value={connection.serialPort} mono />}
                {connection.baudRate && <InfoPair label="Baud rate" value={`${connection.baudRate} bps`} />}
                {connection.encoding && <InfoPair label="Encodage" value={connection.encoding} mono />}
              </div>
              <SectionTitle>Options</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                <InfoPair label="Timeout" value={connection.timeoutMs ? `${connection.timeoutMs} ms` : '—'} />
                <InfoPair label="Tentatives" value={String(connection.retryLimit)} />
                <InfoPair label="ACK"
                  value={
                    <span style={{ padding: '1px 8px', borderRadius: 20, background: connection.ackEnabled ? '#f0fdf4' : '#f8fafc', border: `1px solid ${connection.ackEnabled ? '#bbf7d0' : '#e2e8f0'}`, fontSize: 11, fontWeight: 600, color: connection.ackEnabled ? '#16a34a' : '#94a3b8' }}>
                      {connection.ackEnabled ? 'Oui' : 'Non'}
                    </span>
                  }
                />
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80, color: '#94a3b8', fontSize: 13 }}>
              Aucune connexion configurée
            </div>
          )}
        </InfoCard>

        {/* Card: Simulateur */}
        <InfoCard
          title="Simulateur"
          icon="◎"
          action={
            simEditing ? (
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setSimEditing(false)} style={btnStyle('#f8fafc', '#64748b', '#e2e8f0')}>Annuler</button>
                <button onClick={handleSaveSim} disabled={isSavingSim} style={btnStyle('#0f172a', '#fff', '#0f172a')}>
                  {isSavingSim ? '…' : 'Enregistrer'}
                </button>
              </div>
            ) : (
              <button onClick={() => setSimEditing(true)} style={btnStyle('#f8fafc', '#64748b', '#e2e8f0')}>Modifier</button>
            )
          }
        >
          <SectionTitle>Rack & positions</SectionTitle>
          <SimRow label="Racks" value={simForm.rackCount ?? 1} editing={simEditing} onChange={v => setSimForm(f => ({ ...f, rackCount: +v }))} min={1} max={10} />
          <SimRow label="Positions / rack" value={simForm.slotsPerRack ?? 20} editing={simEditing} onChange={v => setSimForm(f => ({ ...f, slotsPerRack: +v }))} min={5} max={60} />
          <SimRow label="Positions STAT" value={simForm.statSlots ?? 3} editing={simEditing} onChange={v => setSimForm(f => ({ ...f, statSlots: +v }))} min={0} max={10} />
          <div style={{ marginBottom: 10 }} />
          <SectionTitle>Simulation</SectionTitle>
          <SimRow label="Débit" value={simForm.throughputPerHour ?? 100} editing={simEditing} onChange={v => setSimForm(f => ({ ...f, throughputPerHour: +v }))} min={1} max={2000} unit="tubes/h" />
          <SimRow label="Temps min" value={simForm.processingTimeMinMs ?? 4000} editing={simEditing} onChange={v => setSimForm(f => ({ ...f, processingTimeMinMs: +v }))} min={500} max={60000} unit="ms" />
          <SimRow label="Temps max" value={simForm.processingTimeMaxMs ?? 10000} editing={simEditing} onChange={v => setSimForm(f => ({ ...f, processingTimeMaxMs: +v }))} min={500} max={120000} unit="ms" />
          <SimRow label="Taux anormal" value={Math.round((simForm.abnormalRate ?? 0.12) * 100)} editing={simEditing} onChange={v => setSimForm(f => ({ ...f, abnormalRate: +v / 100 }))} min={0} max={100} unit="%" />
          <SimRow label="Taux erreur" value={Math.round((simForm.errorRate ?? 0.02) * 100)} editing={simEditing} onChange={v => setSimForm(f => ({ ...f, errorRate: +v / 100 }))} min={0} max={100} unit="%" />
        </InfoCard>
      </div>

      {/* ── Mappings table ─────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

        {/* Table header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Codes de mapping tests</span>
            <span style={{ marginLeft: 10, fontSize: 12, color: '#94a3b8', background: '#f1f5f9', borderRadius: 20, padding: '2px 10px' }}>
              {mappings?.length ?? 0} test{(mappings?.length ?? 0) !== 1 ? 's' : ''}
            </span>
          </div>
          <Link to={`/instruments/${id}/edit`}>
            <button style={btnStyle('#0f172a', '#fff', '#0f172a')}>+ Ajouter mapping</button>
          </Link>
        </div>

        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px 100px 80px 48px', gap: 0, padding: '8px 24px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
          {['Code interne', 'Code analyseur', 'Type échantillon', 'Unité', 'Statut', ''].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {(mappings ?? []).length === 0 && (
          <div style={{ padding: '32px 24px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
            Aucun mapping configuré. <Link to={`/instruments/${id}/edit`} style={{ color: '#3b82f6', fontWeight: 600 }}>Ajouter le premier →</Link>
          </div>
        )}
        {(mappings ?? []).map((m, i) => (
          <MappingRow
            key={m.id}
            mapping={m}
            even={i % 2 === 0}
            onDelete={() => deleteMapping({ instrumentId: id!, id: m.id })}
          />
        ))}
      </div>

    </div>
  )
}

/* ─── sub-components ─────────────────────────────────────────────────────── */

function InfoCard({ title, icon, action, children }: {
  title: string; icon: string; action?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 14, color: '#64748b' }}>{icon}</span>
          {title}
        </span>
        {action}
      </div>
      <div style={{ padding: '16px 18px', flex: 1 }}>
        {children}
      </div>
    </div>
  )
}

function QuickPill({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, minWidth: 70 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: color ?? '#0f172a' }}>{value}</span>
      <span style={{ fontSize: 9, color: '#94a3b8', marginTop: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
    </div>
  )
}

function ActionBtn({ children, onClick, danger, muted, icon }: {
  children: React.ReactNode; onClick?: () => void; danger?: boolean; muted?: boolean; icon?: string
}) {
  const bg = danger ? '#fff1f2' : '#f8fafc'
  const color = danger ? '#dc2626' : muted ? '#64748b' : '#0f172a'
  const border = danger ? '#fecaca' : '#e2e8f0'
  return (
    <button onClick={onClick} style={btnStyle(bg, color, border)}>
      {icon && <span>{icon} </span>}{children}
    </button>
  )
}

function btnStyle(bg: string, color: string, border: string): React.CSSProperties {
  return { background: bg, color, border: `1px solid ${border}`, borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.15s', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }
}

function MappingRow({ mapping: m, even, onDelete }: { mapping: InstrumentTestMappingDto; even: boolean; onDelete: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px 100px 80px 48px', gap: 0, padding: '10px 24px', background: hover ? '#f8fafc' : even ? '#fff' : '#fafafa', borderBottom: '1px solid #f1f5f9', alignItems: 'center', transition: 'background 0.1s' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Internal code */}
      <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#1e40af', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '2px 8px', display: 'inline-block', width: 'fit-content' }}>
        {m.internalTestCode}
      </span>

      {/* Instrument code */}
      <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: '#334155' }}>
        {m.instrumentTestCode}
      </span>

      {/* Sample type */}
      <span style={{ fontSize: 12, color: '#64748b' }}>{m.sampleType ?? '—'}</span>

      {/* Unit */}
      {m.unit ? (
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748b', background: '#f1f5f9', borderRadius: 4, padding: '1px 6px', display: 'inline-block', width: 'fit-content' }}>
          {m.unit}
        </span>
      ) : <span style={{ color: '#cbd5e1', fontSize: 12 }}>—</span>}

      {/* Status */}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: m.isActive ? '#16a34a' : '#94a3b8' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.isActive ? '#16a34a' : '#cbd5e1', flexShrink: 0, display: 'inline-block' }} />
        {m.isActive ? 'Actif' : 'Inactif'}
      </span>

      {/* Delete */}
      <button
        onClick={onDelete}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
        onMouseLeave={e => (e.currentTarget.style.color = '#cbd5e1')}
        title="Supprimer"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
