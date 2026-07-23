export const formatSlug = (input: string | undefined): string => {
  if (!input || typeof input !== 'string') return ''

  const cleaned = input
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-') // spaces -> hyphens
    .replace(/[^\w\-\/]+/g, '') // strip everything else
    .replace(/\-\-+/g, '-') // multiple hyphens -> one
    .replace(/\/\/+/g, '/') // multiple slashes -> one
    .replace(/^-+|-+$/g, '') // trim stray leading/trailing hyphens

  return cleaned.startsWith('/') ? cleaned : '/' + cleaned
}
