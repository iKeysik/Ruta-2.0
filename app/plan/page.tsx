'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'
import { TravelerProfile, Budget, GroupType, QuestStyle } from '@/lib/types'
import { WeatherData } from '@/lib/types'

const CITIES = ['Москва', 'Санкт-Петербург', 'Флоренция', 'Барселона', 'Токио', 'Париж', 'Рим', 'Стамбул', 'Амстердам', 'Дубай']

function PlanForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQ = searchParams.get('q') ?? ''

  const [userRequest, setUserRequest] = useState(initialQ)
  const [city, setCity] = useState('')
  const [groupType, setGroupType] = useState<GroupType>('family')
  const [budget, setBudget] = useState<Budget>('mid')
  const [durationHours, setDurationHours] = useState(4)
  const [childrenAges, setChildrenAges] = useState<number[]>([])
  const [withQuest, setWithQuest] = useState(false)
  const [childInterest, setChildInterest] = useState('')
  const [questStyle, setQuestStyle] = useState<QuestStyle>('fairy-tale')
  const [excludeMuseums, setExcludeMuseums] = useState(false)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loadingWeather, setLoadingWeather] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!city) return
    setLoadingWeather(true)
    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setWeather(d))
      .finally(() => setLoadingWeather(false))
  }, [city])

  const addChild = () => setChildrenAges(prev => [...prev, 6])
  const removeChild = (i: number) => setChildrenAges(prev => prev.filter((_, idx) => idx !== i))
  const updateChildAge = (i: number, age: number) =>
    setChildrenAges(prev => prev.map((a, idx) => (idx === i ? age : a)))

  const handleSubmit = async () => {
    if (!city.trim() || !userRequest.trim()) return
    setGenerating(true)

    const profile: TravelerProfile = {
      city,
      userRequest,
      groupType,
      budget,
      durationHours,
      childrenAges,
      withQuest: withQuest && childrenAges.length > 0,
      childInterest: withQuest ? childInterest : undefined,
      questStyle: withQuest ? questStyle : undefined,
      excludeMuseums,
    }

    try {
      const res = await fetch('/api/generate-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      const route = await res.json()
      // Store in sessionStorage for the route page
      sessionStorage.setItem(`route-${route.id}`, JSON.stringify(route))
      router.push(`/route/${route.id}`)
    } catch {
      alert('Ошибка генерации маршрута. Проверь API ключи.')
      setGenerating(false)
    }
  }

  const inputStyle = {
    background: 'var(--input-bg)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
  } as React.CSSProperties

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    display: 'block',
  } as React.CSSProperties

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
        }}
      >
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ fontSize: '20px' }}>←</span>
          <span style={{ fontWeight: 800, fontSize: '20px' }} className="accent-text">Ruta</span>
        </a>
        <ThemeToggle />
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontWeight: 800, fontSize: '28px', marginBottom: '8px' }}>Настрой маршрут</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
          Чем точнее — тем лучше результат
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Request */}
          <div>
            <label style={labelStyle}>Что хочешь увидеть / сделать?</label>
            <textarea
              value={userRequest}
              onChange={e => setUserRequest(e.target.value)}
              placeholder="Например: хочу с ребёнком посмотреть старый город, потом поесть в кафе с детской зоной"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* City */}
          <div>
            <label style={labelStyle}>Город</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {CITIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '999px',
                    border: '1px solid var(--border)',
                    background: city === c ? 'var(--accent)' : 'var(--bg-card)',
                    color: city === c ? 'white' : 'var(--text-primary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Или введи любой город"
              style={inputStyle}
            />
            {loadingWeather && (
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                🌤️ Загружаю погоду…
              </p>
            )}
            {weather && !loadingWeather && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '8px 12px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                  alt=""
                  width={24}
                  height={24}
                  style={{ display: 'inline' }}
                />
                {Math.round(weather.temp)}°C, {weather.description}
                {weather.isCold && ' 🥶 Холодно — адаптируем маршрут'}
                {weather.isRainy && ' 🌧️ Дождь — добавим крытые места'}
              </div>
            )}
          </div>

          {/* Group */}
          <div>
            <label style={labelStyle}>Тип группы</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {([
                { val: 'family', label: '👨‍👩‍👧 Семья' },
                { val: 'couple', label: '💑 Пара' },
                { val: 'solo', label: '🎒 Один' },
                { val: 'friends', label: '👥 Друзья' },
              ] as const).map(g => (
                <button
                  key={g.val}
                  onClick={() => setGroupType(g.val)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: groupType === g.val ? 'var(--accent)' : 'var(--bg-card)',
                    color: groupType === g.val ? 'white' : 'var(--text-primary)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: groupType === g.val ? 600 : 400,
                  }}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label style={labelStyle}>Бюджет</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {([
                { val: 'budget', label: '💵 Бюджетно' },
                { val: 'mid', label: '💳 Средний' },
                { val: 'luxury', label: '💎 Люкс' },
              ] as const).map(b => (
                <button
                  key={b.val}
                  onClick={() => setBudget(b.val)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: budget === b.val ? 'var(--accent)' : 'var(--bg-card)',
                    color: budget === b.val ? 'white' : 'var(--text-primary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: budget === b.val ? 600 : 400,
                  }}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label style={labelStyle}>Продолжительность: <strong>{durationHours} ч</strong></label>
            <input
              type="range"
              min={1}
              max={10}
              value={durationHours}
              onChange={e => setDurationHours(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span>1 ч</span><span>5 ч</span><span>10 ч</span>
            </div>
          </div>

          {/* Children */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Дети</label>
              <button
                onClick={addChild}
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '4px 12px',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                + Добавить
              </button>
            </div>
            {childrenAges.length === 0 && (
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Детей нет</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {childrenAges.map((age, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', width: '60px' }}>
                    Ребёнок {i + 1}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={17}
                    value={age}
                    onChange={e => updateChildAge(i, Number(e.target.value))}
                    style={{ ...inputStyle, width: '80px' }}
                  />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>лет</span>
                  <button
                    onClick={() => removeChild(i)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '0 4px',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quest */}
          {childrenAges.length > 0 && (
            <div
              className="card"
              style={{ padding: '16px', borderLeft: '3px solid var(--accent)' }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={withQuest}
                  onChange={e => setWithQuest(e.target.checked)}
                  style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }}
                />
                <span style={{ fontWeight: 600, fontSize: '15px' }}>🗺️ Включить квест-историю для детей</span>
              </label>

              {withQuest && (
                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Что любит ребёнок?</label>
                    <input
                      type="text"
                      value={childInterest}
                      onChange={e => setChildInterest(e.target.value)}
                      placeholder="Кошки, динозавры, пираты, супергерои…"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Стиль квеста</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {([
                        { val: 'fairy-tale', label: '🧙 Сказка' },
                        { val: 'real-history', label: '⚔️ История' },
                        { val: 'myths', label: '🐉 Мифы' },
                      ] as const).map(s => (
                        <button
                          key={s.val}
                          onClick={() => setQuestStyle(s.val)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '10px',
                            border: '1px solid var(--border)',
                            background: questStyle === s.val ? 'var(--accent)' : 'var(--bg-card)',
                            color: questStyle === s.val ? 'white' : 'var(--text-primary)',
                            fontSize: '13px',
                            cursor: 'pointer',
                          }}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Options */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={excludeMuseums}
                onChange={e => setExcludeMuseums(e.target.checked)}
                style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '14px' }}>Исключить музеи</span>
            </label>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!city.trim() || !userRequest.trim() || generating}
            className="btn-primary"
            style={{
              padding: '16px',
              fontSize: '16px',
              borderRadius: '14px',
              opacity: !city.trim() || !userRequest.trim() ? 0.5 : 1,
            }}
          >
            {generating ? '⏳ Генерирую маршрут…' : '🗺️ Создать маршрут'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default function PlanPage() {
  return (
    <Suspense>
      <PlanForm />
    </Suspense>
  )
}
