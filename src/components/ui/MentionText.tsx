import Link from 'next/link'

interface MentionTextProps {
  text: string
  className?: string
}

export default function MentionText({ text, className }: MentionTextProps) {
  const parts = text.split(/(@[a-zA-Z0-9_]+)/g)

  return (
    <p className={className}>
      {parts.map((part, i) =>
        part.startsWith('@') ? (
          <Link
            key={i}
            href={`/profile/${part.slice(1)}`}
            className="text-primary-500 hover:underline"
          >
            {part}
          </Link>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  )
}
