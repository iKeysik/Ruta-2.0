'use client'

import { WeatherData } from '@/lib/types'

export function WeatherBanner({ weather }: { weather: WeatherData }) {
  if (!weather.isRainy && !weather.isCold) return null

  const message = weather.isCold
    ? `${weather.temp}°C — очень холодно! Маршрут адаптирован с упором на крытые места.`
    : `Дождь (${weather.description}) — добавили крытые площадки и переходы.`

  return (
    <div
      style={{
        background: weather.isCold
          ? 'linear-gradient(135deg, #1e3a5f, #0c2a4a)'
          : 'linear-gradient(135deg, #1e3a2f, #0c2a20)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: '#e6edf3',
        fontSize: '14px',
      }}
    >
      <span style={{ fontSize: '20px' }}>{weather.isCold ? '🥶' : '🌧️'}</span>
      <span>{message}</span>
    </div>
  )
}
