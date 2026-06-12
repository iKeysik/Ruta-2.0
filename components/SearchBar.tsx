'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const EXAMPLES = [
  'Флоренция, семья с ребёнком 5 лет, 4 часа, квест про кошек',
  'Москва, самые крутые бары с другом, вечер',
  'Барселона, пара, романтика, бюджетно, 6 часов',
  'Токио, одиночный турист, локальные места, целый день',
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySpeechRecognition = any

export function SearchBar() {
  const [value, setValue] = useState('')
  const [listening, setListening] = useState(false)
  const router = useRouter()
  const recognitionRef = useRef<AnySpeechRecognition>(null)

  const submit = () => {
    if (!value.trim()) return
    const params = new URLSearchParams({ q: value.trim() })
    router.push(`/plan?${params}`)
  }

  const startVoice = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!SR) return alert('Голосовой ввод не поддерживается в этом браузере')

    const rec = new SR()
    rec.lang = 'ru-RU'
    rec.interimResults = false
    rec.onresult = (e: AnySpeechRecognition) => {
      setValue(e.results[0][0].transcript)
      setListening(false)
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    rec.start()
    recognitionRef.current = rec
    setListening(true)
  }

  return (
    <div style={{ width: '100%', maxWidth: '640px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--input-bg)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '8px 8px 8px 16px',
          boxShadow: 'var(--shadow)',
        }}
      >
        <span style={{ fontSize: '20px' }}>🔍</span>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Куда едем и что хотим?"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '16px',
          }}
        />
        <button
          onClick={startVoice}
          title="Голосовой ввод"
          style={{
            background: listening ? 'var(--accent)' : 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            width: '38px',
            height: '38px',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            flexShrink: 0,
          }}
        >
          {listening ? '⏹' : '🎙'}
        </button>
        <button
          onClick={submit}
          disabled={!value.trim()}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '14px', flexShrink: 0, borderRadius: '10px' }}
        >
          Поехали →
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
        {EXAMPLES.map(ex => (
          <button
            key={ex}
            onClick={() => setValue(ex)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              borderRadius: '999px',
              padding: '4px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {ex.slice(0, 32)}…
          </button>
        ))}
      </div>
    </div>
  )
}
