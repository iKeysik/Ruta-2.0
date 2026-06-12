import OpenAI from 'openai'
import { TravelerProfile, GeneratedRoute, Stop, WeatherData } from './types'

const MODEL = 'gpt-4o'
const getClient = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? 'missing' })

const BUDGET_LABELS: Record<string, string> = {
  budget: 'бюджетный (уличная еда, бесплатные места)',
  mid: 'средний (кафе, обычные рестораны)',
  luxury: 'премиум (лучшие рестораны и заведения города)',
}

const GROUP_LABELS: Record<string, string> = {
  family: 'семья с детьми',
  couple: 'пара',
  solo: 'одиночный турист',
  friends: 'группа друзей',
}

export async function generateRoute(
  profile: TravelerProfile,
  weather: WeatherData | null
): Promise<GeneratedRoute> {
  const weatherDesc = weather
    ? `Погода: ${weather.temp}°C, ${weather.description}.${weather.isCold ? ' ОЧЕНЬ ХОЛОДНО — минимизируй пребывание на улице, добавь крытые места.' : ''}${weather.isRainy ? ' ДОЖДЬ — предпочитай крытые маршруты.' : ''}`
    : 'Данные о погоде недоступны.'

  const childrenDesc =
    profile.childrenAges.length > 0
      ? `Дети возраста: ${profile.childrenAges.join(', ')} лет. Учитывай усталость — короткие переходы, интересные места.`
      : 'Детей нет.'

  const prompt = `Ты опытный местный гид. Сгенерируй туристический маршрут по городу ${profile.city}.

Запрос пользователя: "${profile.userRequest}"
Тип группы: ${GROUP_LABELS[profile.groupType]}
${childrenDesc}
Бюджет: ${BUDGET_LABELS[profile.budget]}
Продолжительность: ${profile.durationHours} часов
${profile.excludeMuseums ? 'Исключи музеи.' : ''}
${weatherDesc}

Верни ТОЛЬКО валидный JSON без markdown-обёртки, строго по этой схеме:
{
  "title": "название маршрута",
  "summary": "краткое описание 1-2 предложения",
  "totalDurationMinutes": число,
  "weatherNote": "совет по погоде если нужен, иначе null",
  "stops": [
    {
      "id": "уникальный id",
      "name": "название места",
      "description": "описание 2-3 предложения почему это место интересно",
      "address": "адрес",
      "lat": число,
      "lng": число,
      "durationMinutes": число,
      "type": "attraction|food|rest|transport",
      "tip": "практический совет (опционально)"
    }
  ]
}

Требования:
- 5-8 остановок включая хотя бы одну еду
- Реальные координаты GPS
- Логичный порядок (минимум ходьбы)
- ${profile.budget === 'luxury' ? 'Только топовые заведения' : profile.budget === 'budget' ? 'Бюджетные и бесплатные места' : 'Баланс цена/качество'}`

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 4096,
  })

  const json = JSON.parse(response.choices[0].message.content!)
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
  return { id, city: profile.city, ...json }
}

export async function generateQuest(
  stops: Stop[],
  childAge: number,
  childInterest: string,
  questStyle: string
): Promise<GeneratedRoute['quest']> {
  const styleDesc: Record<string, string> = {
    'fairy-tale': 'волшебная сказка с выдуманными персонажами',
    'real-history': 'реальные исторические события с вымышленным рассказчиком-персонажем',
    myths: 'мифы и легенды города',
  }

  const stopsList = stops
    .map((s, i) => `${i + 1}. ${s.name} (id: ${s.id}) — ${s.description}`)
    .join('\n')

  const prompt = `Создай квест-историю для ребёнка ${childAge} лет, который обожает "${childInterest}".
Стиль: ${styleDesc[questStyle] || styleDesc['fairy-tale']}
Маршрут проходит по этим местам:
${stopsList}

Верни ТОЛЬКО валидный JSON без markdown:
{
  "character": "имя персонажа-проводника (связано с интересом ребёнка)",
  "intro": "вступление в квест 2-3 предложения, захватывающее",
  "steps": [
    {
      "stopId": "id остановки из списка выше",
      "narrative": "мини-история про это место 2-3 предложения",
      "task": "задание для ребёнка в этом месте (найти, посчитать, угадать...)",
      "emoji": "подходящий эмодзи"
    }
  ],
  "outro": "финал квеста 1-2 предложения"
}

Язык: живой, для детей ${childAge} лет. Задания реально выполнимые на месте.`

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 3000,
  })

  return JSON.parse(response.choices[0].message.content!)
}
