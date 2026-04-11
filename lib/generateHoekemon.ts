import Anthropic from '@anthropic-ai/sdk'
import { HoekemonData } from './types'

const client = new Anthropic()

export async function generateWithClaude(
  instagramData: object,
  playerName: string
): Promise<HoekemonData> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1200,
    temperature: 1,
    system: `You generate HOE-KEMON cards — the official Pokémon × RuPaul's Drag Race crossover.
Voice: RuPaul meets Professor Oak meets a devastatingly accurate Instagram stalker.
Camp. Specific. Affectionate but reads you to filth. Never mean-spirited — always knowing.
Output ONLY valid JSON. No markdown. No prose. No explanation. Just the raw JSON object.`,
    messages: [
      {
        role: 'user',
        content: `Generate a HOE-KEMON card for this Instagram profile. Player name: ${playerName}.

Instagram data: ${JSON.stringify(instagramData).slice(0, 40000)}

═══ THE C.U.N.T. FRAMEWORK ═══

STATS — derive from real data, score 1-100:
- charisma: engagement magnetism. Likes-per-post ÷ follower count × 100. High = every post slays.
- uniqueness: how distinct their aesthetic/niche is. Generic travel content = 20. Full character with a clear POV = 90.
- nerve: boldness + posting frequency. Oversharer who posts thirst traps daily = 90. Monthly minimalist = 20.
- talent: actual craft. Production value of photos, skill shown (fitness, cooking, art, fashion). Real effort = high.
- avoidance: inverse engagement — how much they ghost their own audience. High following/follower ratio = high avoidance.

═══ FIELDS ═══

name: CRITICAL STEPS — do this in order:
  STEP 1: Find the actual @username from the Instagram data.
  STEP 2: Take the first 3-6 characters of the username, OR extract the most recognisable phonetic fragment (e.g. "brunch" from "brunch_babe", "gym" from "gym_mike99", "art" from "artdirector").
  STEP 3: Smash that fragment into a camp Pokémon-style suffix.

  The person must look at the name and immediately recognise it as theirs.
  Max 12 chars. No spaces.

  Suffix options (Pokémon-style): -ON, -IX, -IA, -URA, -OTH, -DON, -EX, -RA, -MON
  Suffix options (drag-style): -KWEEN, -SLAYA, -LEWK, -GAG, -LASH, -BOA, -DIVA

  Real examples:
  @brunching → BRUNCHIA or BRUNCHKWEEN
  @gym_mike → GYMIKEON or MIKELEX
  @artdirector → ARTDIVON or ARTLEWK
  @travelbabe → TRAVBOA or TRAVELEWK
  @foodlover88 → FOODGAG or FOODLUVRA
  @photographer → PHOTOGAG or PHOTOLEWK
  @nightlifequeen → NIGHTKWEEN or NITELEWK

  BANNED: any name that does not contain a recognisable fragment of the actual username.

type1 & type2: MUST be from this list ONLY — exactly these 15 Gen 1 types, no others:
  Normal, Fire, Water, Grass, Electric, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon
  Map to drag archetypes:
- Fire = Pageant Queen (competitive, polished, hair spray)
- Ghost = Camp Queen (theatrical, kooky, spooky glam)
- Psychic = Mystique Queen (mysterious, ethereal, unclockable)
- Fighting = Butch/Athletic Queen (gym, strong, physical)
- Flying = Fashion Queen (elevated, avant garde, floaty looks)
- Poison = Villain Edit (chaos agent, drama, messy)
- Water = Club Kid (underground, fluid, nightlife)
- Electric = Comedy Queen (energetic, quick, funny)
- Grass = Artsy/Earthy Queen (natural, creative, cottagecore)
- Normal = All-Rounder / Fishy Queen (versatile, classic, girl-next-door)
- Dragon = Legend / Icon (rare, powerful, we do not deserve them)
- Ice = Ice Queen (cold beauty, fashion ice, untouchable)
- Ground = Down to Earth (relatable, casual, foot-of-the-runway)
- Rock = Pageant Veteran (solid, reliable, been around)
- Bug = Makeover Queen (transformation, before/after, glow-up)

hp: Bias HARD toward 69. If follower count ends in 69 → that number. High engagement → up to 120. Low effort account → 45. Otherwise default 69.

attacks: Exactly 2 (no more, no fewer). Both must blend a specific RPDR reference AND something from their real Instagram. Attack names must be 1-2 words maximum — punchy and Pokémon-move style. Good examples: Sickening, Lewdness, Vogue, Slaybeam, Glambush, Clapback, Realness, Shadeur, Extravaganza, Sirenlure, Snatchgaze, Libraryscan, Lipsync, Deathdrip, Runwaylash. The attack type MUST also be from the 15 Gen 1 types only:
- RPDR references to use: "Snatch Game", "Lip Sync for Your Life", "The Library is Open", "Death Drop", "Reading", "Ball", "Runway", "Untucked", "Werk Room", "Entrance Look", "Pit Crew", "Maxi Challenge", "The Shade of It All", "Not Today Satan", "She Done Already Done Had Herses"
- Their Instagram content: gym selfies, brunch, travel, thirst traps, food, dogs, babies, aesthetic flats, brand deals, fitness content, etc.
- Combine them: "Runway Brunch Moment", "Library Card Gym Flex", "Lip Sync for Your Latte", "Death Drop Into the DMs", "Snatch Game Selfie Serve"
- power: 10-90. Four should escalate: weak opener → moderate → strong → finisher.
- type: must be one of the 15 Gen 1 types only
- superEffective: true only on the most devastating read

weakness: ONE thing, deadpan. Must feel TRUE based on data. Examples: "Natural Lighting", "Being Tagged in Candids", "Constructive Feedback", "An Honest Conversation", "3pm on a Tuesday", "The Comment Section", "Being Offline for 24 Hours", "Accountability"

catchPhrase: ONE sentence. Sounds like RuPaul said it SPECIFICALLY about this person's data. Reference something real — their follower count, a pattern in their posts, their username, their bio. Devastatingly accurate but warm.
Format options:
- "[Specific real fact], baby."
- "If you can't love yourself, how in the hell are you gonna [reference their specific habit]?"
- "[Real username] posted [X] times and called it a personality."
- "[Follower count] followers. [Observation]. That's the tweet."

backstory: 3-4 sentences. PBS nature documentary narrator + drag confessional + Pokémon Mystery Dungeon dramatics. Opens with scene-setting about their Instagram world as if it's an ancient habitat. References their actual content themes as legendary Pokémon lore. Must include at least one real specific fact (follower count, username, bio quote, location if visible).

pokedexEntry: STRICT GEN 1 POKÉDEX FORMAT. Max 2 sentences. Max 30 words total. No exceptions.
  Must match this exact register: terse, clinical, deadpan. Never starts with the HOE-KEMON's name. Uses "It" or "This POKéMON" or starts with an observation.

  Real Gen 1 examples to copy the voice of:
  - "Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes steadily more slothful." (Snorlax)
  - "When several of these POKéMON gather, their electricity could build and cause lightning storms." (Pikachu)
  - "Its genetic code is irregular. It may mutate if it is exposed to radiation from element STONEs." (Eevee)
  - "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail." (Charmander)
  - "Under a full moon, this POKéMON likes to mimic the shadows of people and laugh at their fright." (Gengar)
  - "Adores circular objects. Wanders the streets on a nightly basis to look for dropped loose change." (Meowth)

  HOE-KEMON examples (apply the same voice to Instagram behavior):
  - "Capable of consuming 47 stories without interacting with any of them. No purpose has been identified."
  - "Posts exclusively at golden hour. Researchers have observed no activity between 10 PM and 11 AM."
  - "Very protective of its follower count. Will unfollow anyone who does not follow back within 72 hours."
  - "Its captions end in three to seven emojis. Scientists consider this a form of territorial marking."

visualDescription: 2-3 sentences for AI image generation (Pokemon art style). Physical form based on their content themes and types. MUST INCLUDE: specific heel height, specific outfit style (drag gown? bodysuit? lewk?), color palette from their profile aesthetic, one absurd camp detail (a boa made of their most-liked emoji, platform boots shaped like their most-posted food, etc).

height: Vague and camp. Examples: "Taller in heels", "5'2\" (6'8\" in spirit)", "Platform dependent", "As tall as their ambition, which is concerning"

weight: Always exactly "none of ur business"

basePokemon: Choose the single base Pokémon whose silhouette and personality best fits this person's type1 and vibe. This will be used as the starting image for AI art generation. Must be EXACTLY one name from this list (lowercase only):
bulbasaur, ivysaur, venusaur, charmander, charmeleon, charizard, squirtle, blastoise, pikachu, raichu, clefairy, clefable, vulpix, jigglypuff, meowth, psyduck, growlithe, arcanine, gengar, eevee, vaporeon, jolteon, flareon, snorlax, mewtwo

Type guidance (not rules, use your instinct):
Fire→charizard or vulpix | Water→blastoise or psyduck | Grass→venusaur or bulbasaur
Electric→raichu or pikachu | Ghost/Psychic→gengar or mewtwo | Normal/Flying→clefairy or eevee
Fighting/Ground→arcanine or snorlax | Poison→gengar | Ice→mewtwo or clefairy
Rock→snorlax | Bug→meowth (transformation arc) | Dragon→charizard or mewtwo

═══ RULES ═══
- MINE THE DATA. Before writing anything, scan for: exact @username, exact follower count, exact following count, bio text (quote it), location, post count, recurring hashtags, content themes, brand deals visible, caption style (emoji-heavy? low effort? tryhard?), any recurring elements (dogs? coffee? gym selfies? sunset photos?).
- SPECIFICITY IS EVERYTHING. "Posts food content" → FAIL. "Has 23 posts of the same acai bowl" → SERVE. "Captions every gym selfie with 'the grind 💪'" → SERVE. "Bio says 'living my best life' — a threat" → SERVE.
- The comedy comes from accuracy, not invention. Read what's actually there.
- ATTACKS: All 4 must name an RPDR challenge/moment AND something from their actual content. Zero generic names.
- CATCHPHRASE: Reference a real number (follower count, post count) or a real bio quote. Specific = funny.
- HP default is 69. Only deviate if the data screams otherwise.
- NEVER make up data that isn't in the Instagram data provided.

Return ONLY this JSON shape:
{
  "name": "string",
  "type1": "string",
  "type2": "string or null",
  "level": number,
  "hp": number,
  "visualDescription": "string",
  "stats": {
    "charisma": number,
    "uniqueness": number,
    "nerve": number,
    "talent": number,
    "avoidance": number
  },
  "attacks": [
    { "name": "string", "power": number, "type": "string", "superEffective": boolean },
    { "name": "string", "power": number, "type": "string", "superEffective": boolean }
  ],
  "weakness": "string",
  "catchPhrase": "string",
  "backstory": "string",
  "pokedexEntry": "string",
  "height": "string",
  "weight": "none of ur business",
  "basePokemon": "string"
}`,
      },
    ],
  })

  const text =
    response.content[0].type === 'text' ? response.content[0].text : ''

  const cleaned = text.replace(/```json|```/g, '').trim()
  const jsonStart = cleaned.indexOf('{')
  const jsonEnd = cleaned.lastIndexOf('}')
  if (jsonStart === -1 || jsonEnd === -1) {
    console.error('[Claude] No JSON in response:', cleaned.slice(0, 500))
    throw new Error(`Claude returned no JSON. Raw: ${cleaned.slice(0, 200)}`)
  }

  let parsed: HoekemonData
  try {
    parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1))
  } catch (e) {
    console.error('[Claude] JSON parse failed:', cleaned.slice(0, 500))
    throw new Error(`JSON parse error: ${e instanceof Error ? e.message : e}`)
  }

  // Enforce the bit
  if (parsed.hp % 10 !== 9) parsed.hp = 69

  return parsed
}
