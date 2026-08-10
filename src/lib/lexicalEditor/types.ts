/**
 * Supported HTML heading tags for the Lexical editor.
 *
 * Used to control which heading levels (h1–h6)
 * are available in the editor toolbar.
 */
export type HeadingTagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

/**
 * Configuration options for heading support.
 */
export interface HeadingsConfig {
  /**
   * Enables or disables heading support.
   *
   * @default true
   */
  enabled?: boolean

  /**
   * Restricts which heading levels users can select.
   *
   * If omitted, all heading levels (h1–h6) are available.
   *
   * @example ['h1']
   * @example ['h2', 'h3']
   */
  allowedSizes?: HeadingTagType[]
}

/**
 * Configuration options for the custom Lexical editor.
 */
export interface CustomLexicalOptions {
  /**
   * Configures heading behavior.
   */
  headingsConfig?: HeadingsConfig

  /**
   * Enables paragraph support.
   *
   * Set to `false` to remove the Paragraph option
   * from the editor toolbar.
   *
   * @default true
   */
  allowParagraph?: boolean

  /**
   * Enables the custom Code Block feature.
   *
   * When enabled, the editor includes the Code Block
   * inside the available block types.
   *
   * @default false
   */
  codeBlock?: boolean
}
