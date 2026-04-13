import Replicate from 'replicate'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

const baseImageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png' // charizard

const prompt = [
  'Gen 1 Pokemon TCG official artwork by Ken Sugimori',
  'vibrant watercolor illustration on pure white background',
  'fierce dynamic action pose, powerful stance, expressive glowing eyes, dramatic energy aura',
  'DRAGKWEEN a fierce Fire-type Pokemon creature',
  'serpentine Fire-type creature on 9-inch chrome platform thigh-high boots, floor-length sequined scarlet mermaid gown with thigh-high slit, razor-sharp cat-eye liner extending to temples with rhinestone teardrops, boa made of crumpled DM notifications',
  'Fire-type energy effects, vivid saturated colors, dramatic lighting, full of personality',
  'no humans, no text, no background scenery, no ground, floating centered',
].join(', ')

console.log('Starting generation...')
const prediction = await replicate.predictions.create({
  model: 'black-forest-labs/flux-schnell',
  input: {
    prompt,
    image: baseImageUrl,
    prompt_strength: 0.85,
    num_inference_steps: 4,
    output_format: 'png',
    aspect_ratio: '1:1',
  },
})

console.log('Prediction ID:', prediction.id)

for (let i = 0; i < 30; i++) {
  await new Promise(r => setTimeout(r, 4000))
  const p = await replicate.predictions.get(prediction.id)
  console.log(`[${i+1}] status: ${p.status}`)
  if (p.status === 'succeeded') {
    const url = Array.isArray(p.output) ? p.output[0] : p.output
    console.log('\n✓ SPRITE URL:\n', url)
    process.exit(0)
  }
  if (p.status === 'failed' || p.status === 'canceled') {
    console.error('Failed:', p.error)
    process.exit(1)
  }
}
