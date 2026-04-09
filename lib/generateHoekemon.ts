import Anthropic from '@anthropic-ai/sdk'
import { HoekemonData } from './types'

const client = new Anthropic()

export async function generateWithClaude(
  instagramData: object,
  playerName: string
): Promise<HoekemonData> {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    temperature: 0.9,
    system: `You generate HOE-KEMON data as valid JSON only. No markdown. No explanation. Just the raw JSON object. Be creative, camp, affectionate. Never mean.`,
    messages: [
      {
        role: 'user',
        content: `Generate a HOE-KEMON for this Instagram profile. Player name: ${playerName}.

Instagram data: ${JSON.stringify(instagramData)}

Rules:
- This is a wholly original Pokémon species inspired by the user's actual Instagram presence
- Name: portmanteau of username + something evocative, max 12 chars, slightly filthy, very clever
- type1 and type2 MUST be from this list only: Normal, Fire, Water, Grass, Electric, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon
- Match types to content energy: gym=Fighting, travel=Flying, food=Poison (affectionately), night-out=Ghost, beach=Water, mysterious=Psychic
- HP: bias HARD toward 69. If follower count ends in 69, use that number.
- Stats derived from real data: slay from engagement rate, thirst from selfie frequency or follower/following ratio, drama from posting frequency, rizz from follower count vs following, avoidance inverse of posting frequency
- Attack names MUST reference something real from their profile. Gym content = "Mirror Flex". Travel = "Passport Check". Food = "Brunch Ambush". Make them specific.
- weakness: drawn from their actual data, mundane and funny
- catchPhrase: ONE line, deadpan, references one specific real fact. This is the punchline. Make it land.
- backstory: 3-4 sentences, Pokémon Mystery Dungeon narrator tone — dramatic, sincere, overwrought — but describing something completely absurd from their real data. Reference actual username, follower count, bio, content themes. Treat these facts with the gravity of ancient Pokémon lore.
- pokedexEntry: exactly 2 sentences, OG Pokédex register — dry, scientific, clinical — content completely absurd from real profile data
- visualDescription: 2-3 sentences for an image generation prompt. Base the physical form on content themes. Add camp drag details: specific accessories, colours from profile palette, heels, dramatic feature. Be specific.
- height: something non-committal and funny
- weight: always exactly "none of ur business"

Return ONLY this JSON shape, nothing else:
{
  "name": "string",
  "type1": "string",
  "type2": "string or null",
  "level": number,
  "hp": number,
  "visualDescription": "string",
  "stats": { "slay": number, "thirst": number, "drama": number, "rizz": number, "avoidance": number },
  "attacks": [
    { "name": "string", "power": number, "type": "string", "superEffective": boolean },
    { "name": "string", "power": number, "type": "string", "superEffective": boolean },
    { "name": "string", "power": number, "type": "string", "superEffective": boolean },
    { "name": "string", "power": number, "type": "string", "superEffective": boolean }
  ],
  "weakness": "string",
  "catchPhrase": "string",
  "backstory": "string",
  "pokedexEntry": "string",
  "height": "string",
  "weight": "none of ur business"
}`,
      },
    ],
  })

  const text =
    response.content[0].type === 'text' ? response.content[0].text : ''
  const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())

  // Enforce the joke
  if (parsed.hp % 10 !== 9) parsed.hp = 69

  return parsed as HoekemonData
}
