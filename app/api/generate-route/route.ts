import { NextRequest, NextResponse } from 'next/server'
import { generateRoute, generateQuest } from '@/lib/claude'
import { fetchWeather } from '@/lib/weather'
import { getMockRoute } from '@/lib/mockData'
import { TravelerProfile } from '@/lib/types'

const DEMO_MODE = !process.env.ANTHROPIC_API_KEY

export async function POST(req: NextRequest) {
  const profile: TravelerProfile = await req.json()

  if (DEMO_MODE) {
    const route = getMockRoute(profile.city, profile.userRequest)
    route.id = Date.now().toString(36) + Math.random().toString(36).slice(2)
    // Attach quest if requested and city has one in mock
    if (!profile.withQuest) route.quest = undefined
    return NextResponse.json({ ...route, _demo: true })
  }

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
