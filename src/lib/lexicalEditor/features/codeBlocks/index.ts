import type { Block } from 'payload'
import { CodeBlock } from '@payloadcms/richtext-lexical'

// Languages shown in the code block's dropdown.
// Key = stored value used by the editor and later by our syntax highlighter.
// Value = readable label shown to the editor in the UI.
const LANGUAGES: Record<string, string> = {
  ts: 'TypeScript',
  js: 'JavaScript',
  tsx: 'TSX',
  jsx: 'JSX',
  css: 'CSS',
  html: 'HTML',
  json: 'JSON',
  bash: 'Bash',
  sql: 'SQL',
  graphql: 'GraphQL',
  yaml: 'YAML',
  markdown: 'Markdown',
  text: 'Plain Text',
}

// A reusable "code snippet" block for the rich text editor.
// Uses Payload's built-in CodeBlock (Monaco editor) instead of building one from scratch —
// we only configure the language list and default language here.
export const CodeBlocks: Block = CodeBlock({
  defaultLanguage: 'ts',
  languages: LANGUAGES,
  slug: 'Code',
})
