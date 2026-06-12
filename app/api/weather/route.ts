import { NextRequest, NextResponse } from 'next/server'
import { fetchWeather } from '@/lib/weather'

const MOCK_WEATHER: Record<string, { temp: number; description: string; icon: string; isRainy: boolean; isCold: boolean }> = {
  москва: { temp: 18, description: 'переменная облачность', icon: '02d', isRainy: false, isCold: false },
  moscow: { temp: 18, description: 'partly cloudy', icon: '02d', isRainy: false, isCold: false },
  флоренция: { temp: 24, description: 'ясно', icon: '01d', isRainy: false, isCold: false },
  florence: { temp: 24, description: 'clear sky', icon: '01d', isRainy: false, isCold: false },
  барселона: { temp: 26, description: 'солнечно', icon: '01d', isRainy: false, isCold: false },
  barcelona: { temp: 26, description: 'sunny', icon: '01d', isRainy: false, isCold: false },
}

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city')
  if (!city) return NextResponse.json({ error: 'city required' }, { status: 400 })

  if (!process.env.OPENWEATHERMAP_API_KEY) {
    const mock = MOCK_WEATHER[city.toLowerCase()] ?? { temp: 20, description: 'ясно', icon: '01d', isRainy: false, isCold: false }
    return NextResponse.json(mock)
  }

  const data = await fetchWeather(city)
  if (!data) return NextResponse.json({ error: 'weather unavailable' }, { status: 503 })

  return NextResponse.json(data)
}
