export async function shareLink({ title, text, url }: { title: string; text: string; url: string }): Promise<void> {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        await copyToClipboard(url)
      }
    }
  } else {
    await copyToClipboard(url)
  }
}

export function generateWhatsAppLink(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard) {
    return false
  }
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy text', err)
    return false
  }
}
