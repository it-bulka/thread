export function parseMentions(text: string): string[] {
  const regex = /@([a-zA-Z0-9_]+)/g
  const matches = Array.from(text.matchAll(regex))
  const usernames = matches.map(m => m[1].toLowerCase())
  return Array.from(new Set(usernames))
}
