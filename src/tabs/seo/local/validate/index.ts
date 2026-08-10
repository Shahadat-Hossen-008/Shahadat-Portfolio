type UrlProtocol = 'https'
export function isValidUrl(url: string, protocols: UrlProtocol[]): boolean {
  if (!url || protocols.length === 0) {
    return false
  }
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}
