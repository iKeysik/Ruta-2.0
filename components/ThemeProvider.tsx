'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'explorer' | 'journey'

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'explorer',
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('explorer')

  useEffect(() => {
    const saved = localStorage.getItem('ruta-theme') as Theme | null
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ruta-theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'explorer' ? 'journey' : 'explorer'))

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
