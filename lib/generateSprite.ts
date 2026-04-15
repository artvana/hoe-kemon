import Replicate from 'replicate'
import { getOfficialArtworkUrl } from './pokemonIds'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

const MODEL = 'black-forest-labs/flux-schnell'

export async function startSpriteGeneration(
  visualDescription: string,
  name: string = '',
  type: string = '',
  basePokemon: string = '',
  gender: 'male' | 'female' | 'nonbinary' = 'nonbinary'
): Promise<string> {
  const baseImageUrl = getOfficialArtworkUrl(basePokemon)

  const prompt = [
    'official Nintendo Pokemon Trading Card Game illustration, Ken Sugimori watercolor style',
    'pure white background, white background, centered composition, creature only',
    'single creature centered, no trainer no human no person',
    name ? `${name} a ${type}-type Pokemon creature` : `a ${type}-type Pokemon creature`,
    visualDescription.slice(0, 250),
    `${type}-type energy aura, vivid saturated colors, expressive face`,
    'drag queen accessories on creature body: platform boots on creature claws, rhinestone corset on creature midsection, feather boa around creature neck',
  ].filter(Boolean).join(', ')

  console.log(`[Replicate] Generating sprite (gender: ${gender})`)

  const input: Record<string, unknown> = {
    prompt,
    num_inference_steps: 4,
    output_format: 'png',
    aspect_ratio: '1:1',
  }

  if (baseImageUrl) {
    input.image = baseImageUrl
    input.prompt_strength = 0.58  // low = base Pokémon shape locked in, prompt adds style on top  // slightly lower so Pokémon shape comes through more
    console.log('[Replicate] img2img base:', basePokemon, baseImageUrl)
  } else {
    console.log('[Replicate] No base image for', basePokemon, '— txt2img')
  }

  const prediction = await replicate.predictions.create({ model: MODEL, input })
  return prediction.id
}

export async function getSpriteStatus(
  id: string
): Promise<{ status: string; url?: string }> {
  const prediction = await replicate.predictions.get(id)
  if (prediction.status === 'succeeded' && prediction.output) {
    const url = Array.isArray(prediction.output)
      ? prediction.output[0]
      : prediction.output
    return { status: 'ready', url: url as string }
  }
  if (prediction.status === 'failed' || prediction.status === 'canceled') {
    return { status: 'failed' }
  }
  return { status: 'loading' }
}

export async function warmupModel(): Promise<void> {
  try {
    await replicate.predictions.create({
      model: MODEL,
      input: {
        prompt: 'official Pokemon TCG artwork Ken Sugimori style, cute sexy fire type pokemon creature, white background',
        num_inference_steps: 4,
      },
    })
  } catch {
    // Non-fatal — best-effort warmup
  }
}
