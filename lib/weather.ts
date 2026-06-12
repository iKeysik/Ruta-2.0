import { WeatherData } from './types'

export async function fetchWeather(city: string): Promise<WeatherData | null> {
  const key = process.env.OPENWEATHERMAP_API_KEY
  if (!key) return null

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric&lang=ru`,
    { next: { revalidate: 1800 } }
  )
  if (!res.ok) return null

  const data = await res.json()
  const temp: number = data.main.temp
  const description: string = data.weather[0].description
  const icon: string = data.weather[0].icon
  const weatherId: number = data.weather[0].id

  return {
    temp,
    description,
    icon,
    isRainy: weatherId >= 200 && weatherId < 700,
    isCold: temp < -10,
  }
}
