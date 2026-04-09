import Replicate from 'replicate'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

export async function startSpriteGeneration(visualDescription: string): Promise<string> {
  // lambdal/text-to-pokemon — generates Pokémon-style illustrated creatures
  const prompt = visualDescription.slice(0, 300)

  const prediction = await replicate.predictions.create({
    version: 'ff6cc781634191dd3c49097a615d2fc01b0a8aae31c448e55039a04dcbf36bba',
    input: {
      prompt,
      num_inference_steps: 20,
      guidance_scale: 7.5,
      num_outputs: 1,
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
  if (prediction.status === 'failed') return { status: 'failed' }
  return { status: 'loading' }
}
