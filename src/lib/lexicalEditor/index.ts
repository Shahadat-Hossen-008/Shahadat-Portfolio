import { BlocksFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { CustomLexicalOptions } from './types'
import { hasKey } from './utils'
import { CodeBlocks } from './features/codeBlocks'

/**
 * Builds a Lexical editor instance starting from Payload's defaults,
 * then adds/removes features based on the given options.
 */
export function customLexicalEditor(options: CustomLexicalOptions = {}) {
  return lexicalEditor({
    features: ({ defaultFeatures }) => {
      // Start from Payload's default feature set so we keep bold, italic,
      // links, etc. without having to redeclare them.
      let features = [...defaultFeatures]

      // Strip out the paragraph feature entirely when explicitly disabled.
      if (options.allowParagraph === false) {
        features = features.filter((f) => {
          if (!hasKey(f)) {
            return true
          }
          return f.key !== 'paragraph'
        })
      }

      // Remove headings altogether when the caller opts out.
      if (options.headingsConfig?.enabled === false) {
        features = features.filter((f) => {
          if (!hasKey(f)) {
            return true
          }
          return f.key !== 'heading'
        })
      }

      // Replace the default heading feature with a restricted one that
      // only allows the specified tag sizes (e.g. ['h2', 'h3']).
      if (options.headingsConfig?.enabled !== false && options.headingsConfig?.allowedSizes) {
        features = features.filter((f) => {
          if (!hasKey(f)) {
            return true
          }
          return f.key !== 'heading'
        })
        features.push(
          HeadingFeature({
            enabledHeadingSizes: options.headingsConfig.allowedSizes,
          }),
        )
      }

      const richTextBlocks = []

      // Add the code block feature if explicitly enabled.
      if (options.codeBlock) {
        richTextBlocks.push(CodeBlocks)
      }

      features.push(BlocksFeature({ blocks: richTextBlocks }))

      return features
    },
  })
}
