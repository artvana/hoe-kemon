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
Voice: RuPaul meets Professor Oak meets a devastatingly accurate Instagram stalker who has memorised every post, every caption, every tagged location, and is READY. Unhinged. Filthy. Specific. The draggier, campier, and more outrageous the better — think season 16 main stage, not safe-for-work. Every field should feel like it was written by someone who has studied this person's grid for three years and has finally been given a microphone. Never mean-spirited — but absolutely feral, absolutely iconic, zero chill.
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

weakness: ONE thing, deadpan. Must feel TRUE based on data. MAX 25 CHARACTERS — short and punchy, like a real Pokédex stat. Examples: "Natural Lighting", "Being Tagged", "Constructive Feedback", "Accountability", "3pm Tuesday", "The Comments", "Going Offline"

catchPhrase: ONE sentence. Sounds like RuPaul said it SPECIFICALLY about this person's data. Reference something specific — a pattern in their posts, their username, a bio quote, their posting behaviour. Devastating, specific, and iconic. The shade must be real and earned.

  FOLLOWER COUNT RULE: Do NOT use follower counts in the catchPhrase unless they are extreme (under 50 or over 10,000). Mid-range follower counts (100–9,999) are not inherently funny — skip them and mine something more specific instead.

Format options (pick the most devastating for this person):
- "[Specific real fact or behaviour], baby. We love the commitment."
- "If you can't love yourself, how in the hell are you gonna [their most embarrassing specific posting habit]?"
- "[Real username] posted [X] times and called it a personality. On sight, honey."
- "Honey, [bio quote or real observation] — and that's [devastating punchline], baby."
- "The audacity of [username] to [specific behaviour pattern] and still show up to brunch. Respect, actually."
- "[Real username], [real post count] posts deep, and we still don't know what you DO. Iconic. Chilling."

backstory: 3-4 sentences. PBS nature documentary narrator meets drag confessional meets someone who has had three proseccos and just pulled up your entire grid. Opens with scene-setting about their Instagram world as if it's an ancient and deeply unhinged habitat. Gets increasingly feral with each sentence — sentence 1 is clinical, sentence 4 is unhinged. Must include at least one real specific fact (username, bio quote, location if visible, a recurring content theme). The final sentence must be a read so specific it could only apply to this exact person.

  FOLLOWER COUNT RULE: Do NOT open the backstory with a follower count. It's boring. Open with behaviour, bio, or aesthetic instead. Follower counts may appear once if they're extreme (under 50 or over 10k), otherwise leave them out entirely.

pokedexEntry: STRICT GEN 1 POKÉDEX FORMAT. Max 2 sentences. Max 25 words. No exceptions. No flourishes.
  Register: terse, clinical, deadpan — like a field biologist who has completely given up asking why. The observation should be so specific it stings a little.
  Never starts with the HOE-KEMON's name. Starts with "It", "This POKéMON", "Obviously", "Adores", "Very", "When", "Rarely", "Known to", or a flat devastating observation.

  THE COMEDY COMES FROM THE CONTRAST: the sentence structure is identical to a real Pokédex entry. The subject matter is Instagram or drag behaviour. Do not wink at the joke. Play it completely straight. The deadpan IS the joke. Do not break character.

  ABSOLUTE RULE: NO NUMBERS. No follower counts, post counts, like counts, or any statistics. The comedy comes from behavioural observation, not data recitation. Mine qualitative signals instead:
  - Content themes (brunch, gym, travel, pets, thirst traps, aesthetic flats, sunsets, mirror selfies)
  - Caption style (emoji-heavy, motivational quotes, one-word responses, no captions at all, oversharing, cryptic)
  - Aesthetic (moody dark filter, overexposed white, warm tones, chaotic collage, clearly uses a ring light)
  - Posting behaviour (disappears for weeks then dumps 12 at once, only posts on weekends, story-first poster, deletes and reposts)
  - Brand/sponsor signals (always a promo code in bio, collab tags, gifted disclosures, link in bio with 11 links)
  - Social behaviour (never replies to comments, only posts group photos where they look best, tags location only at expensive restaurants, ghosts their own DMs)
  - Bio energy (motivational quote, just an emoji, suspiciously vague job title)
  - Recurring subjects (the same dog, the same café, always traveling but never with anyone, same angle every time)

  Real Gen 1 entries — COPY THIS EXACT VOICE (note the rhythm, the flatness, the commitment):
  - "Adores circular objects. Wanders the streets on a nightly basis to look for dropped loose change." (Meowth)
  - "Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes steadily more slothful." (Snorlax)
  - "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail." (Charmander)
  - "Under a full moon, this POKéMON likes to mimic the shadows of people and laugh at their fright." (Gengar)
  - "While lulling its enemies with its vacant look, this wily POKéMON will use psychokinetic powers." (Psyduck)

  HOE-KEMON examples — same exact voice, but for Instagram/drag behaviour. These are the gold standard. Note they never explain the joke:
  - "Obviously prefers ring-lit environments. When natural lighting occurs, posting ceases for up to seventy-two hours."
  - "Adores brunch. Photographs every plate directly from above. Has never been observed eating any of it."
  - "When tagged in a photo where it is not the most attractive person present, this HOE-KÉMON archives it within minutes."
  - "Very protective of its curated grid. Will delete any post that does not perform within the first hour."
  - "Its bio contains a promo code. No one has ever used the promo code. The HOE-KÉMON has not noticed."
  - "Rarely replies to comments. Will, however, reply to comments from accounts with a larger following."
  - "Known to disappear entirely for weeks. Returns with twelve posts and no explanation."
  - "While lulling followers with a motivational caption, this wily HOE-KÉMON quietly archives its worst-lit content."
  - "Adores mirror selfies. Has visited the same bathroom for this purpose on at least forty documented occasions."

  NOW write one for THIS specific person. It must reflect something observable in their actual data — a content theme, a posting pattern, a caption habit, a bio detail. Specific is funnier than general. Devastating is better than safe.

visualDescription: 2-3 sentences for AI image generation. ABSOLUTE RULE: zero human anatomy. No human body, no human face, no human clothing, no silhouettes of people. This is a CREATURE — non-human, fantastical, monstrous. Describe only creature features.

  BANNED WORDS (will ruin the image): man, woman, person, figure, silhouette, human, face, body, torso, arms, legs, hands, shirt, jacket, jeans, outfit, wearing, dressed

  MANDATORY structure, in this order:
  1. Creature shape: floating orb / serpentine / insectoid / quadruped / blob / multi-limbed — non-human, specific to their type
  2. Creature surface details: scales, fur, feathers, slime, crystal, smoke — what covers its body
  3. Creature face features: glowing eyes, fangs, tentacles, beak, extra limbs — fully inhuman
  4. MANDATORY slutty creature accessories — pick at least 2-3 from this list, attached to creature anatomy ONLY:
     - rhinestone or crystal corset cinched around creature midsection
     - 9-inch chrome or platform stiletto boots on creature claws/paws/tendrils
     - fishnet body stocking stretched over creature hide
     - feather boa coiled around creature neck or tail
     - gold chain collar or spiked leather collar on creature neck
     - dramatic painted liner or glitter directly on creature eye-stalks
     - sequined thong or micro-skirt on creature lower half
     - elbow-length gloves on creature appendages
     - diamond or rhinestone pasties on creature chest plates
  5. One absurd camp prop floating near the creature tied to their actual Instagram content
  6. Colour palette from their profile aesthetic — lean into hot pink, neon, chrome, or sequin tones

  Example (Ghost/Electric): "A serpentine Electric-type creature with iridescent scales, eight slender limbs, and two enormous glowing yellow eyes. A rhinestone corset cinches its creature midsection and 9-inch chrome platform boots grip its rear claws. Glitter liner painted directly onto its eye-stalks, a feather boa coiled around its tail, and a charging cable phone floats nearby."

  Example (Fire/Poison): "A quadruped blob creature with slick magenta hide, four stubby claws tipped in chrome press-ons, and enormous lash-fringed eye-pods. A sequined micro-skirt sits on its creature haunches, a spiked gold collar clasps its neck, and fishnet stocking wraps its rear legs. A floating dirty martini glass orbits its head."

height: MAX 14 CHARACTERS. Absolute hard limit — if it exceeds 14 characters it will be cut off on the card and you will have failed. Short, punchy, one idea only.
  Good examples (all under 14 chars): "In heels: yes", "Concerning", "Sky high", "Platform only", "Worrying", "Too tall", "5'2\" in spirit", "Ask her heels"
  BAD examples (too long — DO NOT USE): "Platform dependent", "Taller in heels", "5'2\" (6'8\" in spirit)"

weight: Always exactly "none of ur business"

gender: Infer from Instagram data. Look for: name, pronouns in bio, appearance in photos if described, username signals, any explicit indicators. Use "male", "female", or "nonbinary". If genuinely ambiguous, default to "nonbinary".


═══ RULES ═══
- MINE THE DATA. Before writing anything, scan for: exact @username, exact follower count, exact following count, bio text (quote it), location, post count, recurring hashtags, content themes, brand deals visible, caption style (emoji-heavy? low effort? tryhard?), any recurring elements (dogs? coffee? gym selfies? sunset photos?).
- SPECIFICITY IS EVERYTHING. "Posts food content" → FAIL. "Captions every gym selfie with 'the grind 💪'" → SERVE. "Bio says 'living my best life' — a threat" → SERVE. "Only tags location at places that cost over £30 a plate" → SERVE.
- The comedy comes from accuracy, not invention. Read what's actually there.
- ATTACKS: All 4 must name an RPDR challenge/moment AND something from their actual content. Zero generic names.
- CATCHPHRASE: Reference a real number (follower count, post count) or a real bio quote. Specific = funny.
- POKÉDEX ENTRY: NEVER use any numbers. Qualitative behaviour only. See examples above.
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
  "gender": "male" | "female" | "nonbinary"
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
