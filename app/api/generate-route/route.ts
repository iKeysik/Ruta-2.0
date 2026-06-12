import { NextRequest, NextResponse } from 'next/server'
import { generateRoute, generateQuest } from '@/lib/claude'
import { fetchWeather } from '@/lib/weather'
import { TravelerProfile } from '@/lib/types'

export async function POST(req: NextRequest) {
  const profile: TravelerProfile = await req.json()

  const weather = await fetchWeather(profile.city)
  const route = await generateRoute(profile, weather)

  if (profile.withQuest && profile.childrenAges.length > 0 && profile.childInterest) {
    const age = Math.min(...profile.childrenAges)
    route.quest = await generateQuest(
      route.stops,
      age,
      profile.childInterest,
      profile.questStyle ?? 'fairy-tale'
    )
  }

  return NextResponse.json(route)
}
