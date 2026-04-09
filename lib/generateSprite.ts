import Replicate from 'replicate'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

const PROMPT_SUFFIX =
  ', pixel art, Game Boy Color style, black outline, limited 16-color palette, white background, centered, no text, no background scenery, 96x96 pixels'
const NEGATIVE =
  'realistic, photograph, 3d render, blurry, watermark, text, background scenery, multiple creatures, human, anime'

export async function startSpriteGeneration(visualDescription: string): Promise<string> {
  const prompt = `Gen 1 Pokemon sprite, ${visualDescription}${PROMPT_SUFFIX}`

  try {
    const prediction = await replicate.predictions.create({
      model: 'fofr/pokemon-sdxl',
      input: {
        prompt,
        negative_prompt: NEGATIVE,
        width: 512,
        height: 512,
        num_inference_steps: 30,
        guidance_scale: 7.5,
      },
    })
    return prediction.id
  } catch {
    // Fall back to sdxl
    const prediction = await replicate.predictions.create({
      model: 'stability-ai/sdxl',
      input: {
        prompt,
        negative_prompt: NEGATIVE,
        width: 512,
        height: 512,
      },
    })
    return prediction.id
  }
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
  if (prediction.status === 'failed') return { status: 'failed' }
  return { status: 'loading' }
}
