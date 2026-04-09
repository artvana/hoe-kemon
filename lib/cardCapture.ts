export async function captureCard(cardRef: HTMLElement): Promise<void> {
  const html2canvas = (await import('html2canvas')).default
  const canvas = await html2canvas(cardRef, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  })
  const link = document.createElement('a')
  link.download = 'my-hoekemon.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}
