'use client'

import { Stop, GeneratedRoute } from '@/lib/types'

const TYPE_ICONS: Record<string, string> = {
  attraction: '🏛️',
  food: '🍽️',
  rest: '☕',
  transport: '🚇',
}

const TYPE_LABELS: Record<string, string> = {
  attraction: 'Достопримечательность',
  food: 'Еда',
  rest: 'Отдых',
  transport: 'Транспорт',
}

function QuestStep({ step }: { step: { narrative: string; task: string; emoji: string } }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(249,115,22,0.08))',
        border: '1px dashed var(--border)',
        borderRadius: '12px',
        padding: '12px',
        marginTop: '8px',
        fontSize: '13px',
      }}
    >
      <p style={{ color: 'var(--text-primary)', marginBottom: '6px' }}>
        {step.emoji} {step.narrative}
      </p>
      <p
        style={{
          color: 'var(--accent)',
          fontWeight: 600,
          background: 'var(--bg-card)',
          borderRadius: '8px',
          padding: '6px 10px',
        }}
      >
        🎯 Задание: {step.task}
      </p>
    </div>
  )
}

export function RouteTimeline({
  stops,
  quest,
}: {
  stops: Stop[]
  quest?: GeneratedRoute['quest']
}) {
  const questMap = new Map(quest?.steps.map(s => [s.stopId, s]) ?? [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {quest && (
        <div
          className="card"
          style={{
            padding: '16px',
            marginBottom: '16px',
            borderLeft: '3px solid var(--accent)',
          }}
        >
          <p style={{ fontWeight: 700, marginBottom: '4px' }}>
            🧙 {quest.character} говорит:
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontStyle: 'italic' }}>
            "{quest.intro}"
          </p>
        </div>
      )}

      {stops.map((stop, idx) => {
        const questStep = questMap.get(stop.id)
        return (
          <div key={stop.id} style={{ display: 'flex', gap: '12px' }}>
            {/* Line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '14px',
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </div>
              {idx < stops.length - 1 && (
                <div
                  style={{
                    width: '2px',
                    flex: 1,
                    minHeight: '24px',
                    background: 'var(--border)',
                    margin: '4px 0',
                  }}
                />
              )}
            </div>

            {/* Card */}
            <div className="card" style={{ flex: 1, padding: '14px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span>{TYPE_ICONS[stop.type]}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {TYPE_LABELS[stop.type]}
                    </span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                    {stop.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    📍 {stop.address}
                  </p>
                </div>
                <span
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    marginLeft: '8px',
                  }}
                >
                  ⏱ {stop.durationMinutes} мин
                </span>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {stop.description}
              </p>

              {stop.tip && (
                <p
                  style={{
                    marginTop: '8px',
                    fontSize: '13px',
                    color: 'var(--accent-2)',
                    background: 'var(--bg-card)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                  }}
                >
                  💡 {stop.tip}
                </p>
              )}

              {questStep && <QuestStep step={questStep} />}
            </div>
          </div>
        )
      })}

      {quest && (
        <div
          className="card"
          style={{
            padding: '16px',
            marginTop: '8px',
            borderLeft: '3px solid var(--accent-2)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '18px', marginBottom: '4px' }}>🏆</p>
          <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{quest.outro}</p>
        </div>
      )}
    </div>
  )
}
