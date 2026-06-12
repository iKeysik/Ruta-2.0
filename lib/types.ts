export type Budget = 'budget' | 'mid' | 'luxury'
export type GroupType = 'family' | 'couple' | 'solo' | 'friends'
export type QuestStyle = 'fairy-tale' | 'real-history' | 'myths'
export type StopType = 'attraction' | 'food' | 'rest' | 'transport'

export interface TravelerProfile {
  city: string
  userRequest: string
  groupType: GroupType
  budget: Budget
  durationHours: number
  childrenAges: number[]
  withQuest: boolean
  childInterest?: string
  questStyle?: QuestStyle
  excludeMuseums?: boolean
}

export interface Stop {
  id: string
  name: string
  description: string
  address: string
  lat: number
  lng: number
  durationMinutes: number
  type: StopType
  tip?: string
}

export interface QuestStep {
  stopId: string
  narrative: string
  task: string
  emoji: string
}

export interface GeneratedRoute {
  id: string
  city: string
  title: string
  summary: string
  totalDurationMinutes: number
  stops: Stop[]
  weatherNote?: string
  quest?: {
    character: string
    intro: string
    steps: QuestStep[]
    outro: string
  }
}

export interface WeatherData {
  temp: number
  description: string
  icon: string
  isRainy: boolean
  isCold: boolean
}
