import type { Card } from './types'

export function generateVcf(card: Card): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${card.name}`,
  ]

  if (card.company || card.job_title) {
    lines.push(`ORG:${card.company ?? ''}`)
    if (card.job_title) lines.push(`TITLE:${card.job_title}`)
  }

  if (card.phone) lines.push(`TEL;TYPE=CELL:${card.phone}`)
  if (card.email) lines.push(`EMAIL:${card.email}`)
  if (card.website) lines.push(`URL:${card.website}`)
  if (card.photo_url) lines.push(`PHOTO;VALUE=URI:${card.photo_url}`)

  const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/cards/${card.slug}`
  lines.push(`URL;TYPE=WORK:${cardUrl}`)

  if (card.bio) {
    const safeBio = card.bio.replace(/\n/g, '\\n').replace(/,/g, '\\,')
    lines.push(`NOTE:${safeBio}`)
  }

  lines.push('END:VCARD')
  return lines.join('\r\n')
}
