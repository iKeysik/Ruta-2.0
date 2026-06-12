import { ThemeToggle } from '@/components/ThemeToggle'
import { SearchBar } from '@/components/SearchBar'

const PRESETS = [
  { icon: '👨‍👩‍👧', label: 'Семья с детьми', q: 'семья с ребёнком 6 лет, достопримечательности, 4 часа' },
  { icon: '💑', label: 'Пара', q: 'романтическая прогулка для пары, уютные места' },
  { icon: '🎒', label: 'Бюджетно', q: 'бюджетный маршрут, максимум впечатлений, минимум трат' },
  { icon: '🥂', label: 'Люкс', q: 'премиум маршрут, лучшие рестораны и заведения города' },
  { icon: '🍺', label: 'Бары', q: 'лучшие бары и места для вечернего отдыха' },
  { icon: '🏃', label: 'Активный день', q: 'активный маршрут для одиночного туриста, весь день' },
]

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🗺️</span>
          <span style={{ fontWeight: 800, fontSize: '20px' }} className="accent-text">
            Ruta
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '4px' }}>
            2.0
          </span>
        </div>
        <ThemeToggle />
      </header>

      <section
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 24px 40px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '16px',
            maxWidth: '700px',
          }}
        >
          Умные маршруты{' '}
          <span className="accent-text">для любого путешествия</span>
        </h1>
        <p
          style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            marginBottom: '40px',
            maxWidth: '500px',
            lineHeight: 1.6,
          }}
        >
          Учитываем погоду, бюджет, возраст детей и интересы. Квесты-сказки для маленьких путешественников.
        </p>

        <SearchBar />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginTop: '48px',
            width: '100%',
            maxWidth: '640px',
          }}
        >
          {PRESETS.map(p => (
            <a
              key={p.label}
              href={`/plan?q=${encodeURIComponent(p.q)}`}
              className="card"
              style={{
                padding: '16px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '28px' }}>{p.icon}</span>
              <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', textAlign: 'center' }}>
                {p.label}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section
        style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border)',
          padding: '32px 24px',
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { icon: '🌤️', text: 'Адаптация к погоде' },
          { icon: '👶', text: 'Маршруты для детей' },
          { icon: '📖', text: 'Квесты-сказки' },
          { icon: '💰', text: 'Любой бюджет' },
          { icon: '🗺️', text: 'Интерактивная карта' },
          { icon: '🎙️', text: 'Голосовой ввод' },
        ].map(f => (
          <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <span style={{ fontSize: '20px' }}>{f.icon}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{f.text}</span>
          </div>
        ))}
      </section>
    </main>
  )
}
