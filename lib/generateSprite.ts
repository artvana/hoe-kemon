import Replicate from 'replicate'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
const VERSION = 'ff6cc781634191dd3c49097a615d2fc01b0a8aae31c448e55039a04dcbf36bba'

export async function startSpriteGeneration(visualDescription: string): Promise<string> {
  // lambdal/text-to-pokemon — fine-tuned on Pokémon art, best for recognisable creature output
  // We front-load the camp/slutty aesthetic so the fine-tune leans into it
  const prompt = [
    'fabulous slutty camp pokemon creature',
    'drag queen aesthetics',
    'platform heels',
    'dramatic accessories',
    'vibrant over-the-top design',
    visualDescription.slice(0, 220),
  ].join(', ')

  const prediction = await replicate.predictions.create({
    version: VERSION,
    input: {
      prompt,
      num_outputs: 1,
      num_inference_steps: 25,
      guidance_scale: 7.5,
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
