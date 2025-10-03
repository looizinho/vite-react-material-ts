declare module '@editorjs/editorjs' {
  export interface OutputBlockData {
    id?: string
    type: string
    data: Record<string, unknown>
  }

  export interface OutputData {
    time?: number
    blocks: OutputBlockData[]
    version?: string
  }

  export interface EditorConfig {
    holder: string | HTMLElement
    autofocus?: boolean
    placeholder?: string
    data?: OutputData
    onReady?: () => void
  }

  export default class EditorJS {
    constructor(configuration?: EditorConfig)
    isReady: Promise<void>
    destroy(): void
  }
}
