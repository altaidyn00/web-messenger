import type { FormattedSegment } from '@/types'

export const parseInlineFormatting = (text: string) => {
  if (!text) return []

  const segments: FormattedSegment[] = []
  let i = 0

  while (i < text.length) {
    const sub = text.slice(i)

    const boldMatch = sub.match(/^\*\*(.+?)\*\*/)
    const italicMatch = sub.match(/^\*(.+?)\*/)

    if (boldMatch) {
      segments.push({ type: 'bold', value: boldMatch[1] })
      i += boldMatch[0].length
      continue
    }
    if (italicMatch) {
      segments.push({ type: 'italic', value: italicMatch[1] })
      i += italicMatch[0].length
      continue
    }

    const idxBold = sub.indexOf('**')
    const idxItalic = sub.indexOf('*')
    const next = Math.min(
      idxBold >= 0 ? idxBold : Infinity,
      idxItalic >= 0 ? idxItalic : Infinity
    )
    const end = next === Infinity ? sub.length : next

    if (end > 0) {
      segments.push({ type: 'text', value: sub.slice(0, end) })
      i += end
    } else {
      segments.push({ type: 'text', value: sub.slice(0, 1) })
      i += 1
    }
  }

  return segments
}
