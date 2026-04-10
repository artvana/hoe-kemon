import Replicate from 'replicate'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

export async function startSpriteGeneration(
  visualDescription: string,
  name: string = '',
  type: string = ''
): Promise<string> {
  // fofr/pokemon-sdxl — fine-tuned SDXL specifically on Pokémon art
  // Prompt format matches what this model expects for best Pokémon-like results
  const prompt = [
    'A single cute creature in the style of official gen 1 Pokemon sprite art',
    name ? `${name} the ${type} type pokemon` : '',
    visualDescription.slice(0, 180),
    'centered on white background',
    'official Pokemon art style',
    'Ken Sugimori watercolour illustration',
    'no text, no humans, no background scenery',
  ].filter(Boolean).join(', ')

  const negativePrompt =
    'human, person, text, watermark, multiple creatures, background, scenery, ' +
    'realistic, photograph, 3d render, ugly, deformed'

  const prediction = await replicate.predictions.create({
    model: 'fofr/pokemon-sdxl',
    input: {
      prompt,
      negative_prompt: negativePrompt,
      num_outputs: 1,
      num_inference_steps: 30,
      guidance_scale: 7.5,
      output_format: 'png',
    },
  })
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
