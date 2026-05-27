'use client'
import Link from 'next/link'

interface MentionTextProps {
  text: string
}

export const MentionText = ({ text }: MentionTextProps) => {
  const parts = text.split(/(@[a-zA-Z0-9_]+)/g)

  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('@') ? (
          <Link key={i} href={`/profile/${part.slice(1)}`} className="text-primary-500 font-medium">
            {part}
          </Link>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}
