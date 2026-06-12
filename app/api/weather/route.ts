import { NextRequest, NextResponse } from 'next/server'
import { fetchWeather } from '@/lib/weather'

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city')
  if (!city) return NextResponse.json({ error: 'city required' }, { status: 400 })

  const data = await fetchWeather(city)
  if (!data) return NextResponse.json({ error: 'weather unavailable' }, { status: 503 })

  return NextResponse.json(data)
}
