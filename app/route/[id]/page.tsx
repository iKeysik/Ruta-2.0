'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'
import { RouteTimeline } from '@/components/RouteTimeline'
import { RouteMap } from '@/components/RouteMap'
import { WeatherBanner } from '@/components/WeatherBanner'
import { GeneratedRoute, WeatherData } from '@/lib/types'

export default function RoutePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [route, setRoute] = useState<GeneratedRoute | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [view, setView] = useState<'map' | 'list'>('list')

  useEffect(() => {
    const stored = sessionStorage.getItem(`route-${id}`)
    if (!stored) { router.push('/'); return }
    const r: GeneratedRoute = JSON.parse(stored)
    setRoute(r)

    fetch(`/api/weather?city=${encodeURIComponent(r.city)}`)
      .then(res => res.ok ? res.json() : null)
      .then(setWeather)
  }, [id, router])

  if (!route) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗺️</div>
          <p>Загружаю маршрут…</p>
        </div>
      </div>
    )
  }

  const totalHours = Math.round(route.totalDurationMinutes / 60 * 10) / 10

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ fontSize: '18px' }}>←</span>
          <span style={{ fontWeight: 800, fontSize: '18px' }} className="accent-text">Ruta</span>
        </a>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setView(v => v === 'map' ? 'list' : 'map')}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              borderRadius: '999px',
              padding: '6px 14px',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {view === 'map' ? '📋 Список' : '🗺️ Карта'}
          </button>
          <ThemeToggle />
        </div>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 24px 48px' }}>
        {/* Route header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>📍 {route.city}</span>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>⏱ {totalHours} ч</span>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>🚩 {route.stops.length} остановок</span>
            {route.quest && (
              <>
                <span style={{ color: 'var(--border)' }}>·</span>
                <span style={{ fontSize: '13px', color: 'var(--accent)' }}>🗺️ Квест</span>
              </>
            )}
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, marginBottom: '8px' }}>
            {route.title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>
            {route.summary}
          </p>
        </div>

        {/* Weather note */}
        {weather && (weather.isRainy || weather.isCold) && (
          <div style={{ marginBottom: '16px' }}>
            <WeatherBanner weather={weather} />
          </div>
        )}
        {route.weatherNote && (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontSize: '14px',
              color: 'var(--text-secondary)',
            }}
          >
            💡 {route.weatherNote}
          </div>
        )}

        {/* Map / List toggle */}
        {view === 'map' ? (
          <div style={{ marginBottom: '24px' }}>
            <RouteMap stops={route.stops} />
          </div>
        ) : null}

        {/* Timeline (always shown on list, shown below map on map view) */}
        <RouteTimeline stops={route.stops} quest={route.quest} />

        {/* Back button */}
        <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
          <a
            href="/plan"
            className="btn-secondary"
            style={{ padding: '12px 24px', textDecoration: 'none', borderRadius: '12px', fontSize: '14px' }}
          >
            ← Изменить параметры
          </a>
          <a
            href="/"
            className="btn-secondary"
            style={{ padding: '12px 24px', textDecoration: 'none', borderRadius: '12px', fontSize: '14px' }}
          >
            🏠 На главную
          </a>
        </div>
      </div>
    </main>
  )
}
