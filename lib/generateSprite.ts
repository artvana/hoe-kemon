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
      num_inference_steps: 20,
      guidance_scale: 7.5,
      output_format: 'png',
    },
  })
  return prediction.id
}

// Generic sprite generation from raw Instagram data — used to start Replicate
// in parallel with Claude so the sprite is already generating while we wait.
export async function startSpriteGenerationFromData(
  instagramData: object,
  playerName: string
): Promise<string> {
  const raw = JSON.stringify(instagramData).toLowerCase()

  // Derive rough visual theme from Instagram data keywords
  const themes: string[] = []
  if (raw.includes('gym') || raw.includes('fitness') || raw.includes('workout')) themes.push('athletic muscular build')
  if (raw.includes('food') || raw.includes('brunch') || raw.includes('restaurant') || raw.includes('chef')) themes.push('plump food-themed')
  if (raw.includes('travel') || raw.includes('beach') || raw.includes('sunset') || raw.includes('vacation')) themes.push('colorful tropical feathers')
  if (raw.includes('fashion') || raw.includes('style') || raw.includes('ootd') || raw.includes('outfit')) themes.push('elaborate ornate fins')
  if (raw.includes('art') || raw.includes('creative') || raw.includes('design') || raw.includes('artist')) themes.push('artistic swirl patterns')
  if (raw.includes('dog') || raw.includes('cat') || raw.includes('pet')) themes.push('fluffy mammalian')
  if (raw.includes('dance') || raw.includes('music') || raw.includes('performer') || raw.includes('sing')) themes.push('shimmering performer')

  const themeStr = themes.length > 0 ? themes.slice(0, 2).join(', ') : 'cute colorful'

  const prompt = [
    'A single cute creature in the style of official gen 1 Pokemon sprite art',
    `creature inspired by a person named ${playerName}`,
    themeStr,
    'centered on white background',
    'official Pokemon art style',
    'Ken Sugimori watercolour illustration',
    'no text, no humans, no background scenery',
  ].join(', ')

  const negativePrompt =
    'human, person, text, watermark, multiple creatures, background, scenery, ' +
    'realistic, photograph, 3d render, ugly, deformed'

  const prediction = await replicate.predictions.create({
    model: 'fofr/pokemon-sdxl',
    input: {
      prompt,
      negative_prompt: negativePrompt,
      num_outputs: 1,
      num_inference_steps: 20,
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
