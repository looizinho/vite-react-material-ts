import { useEffect, useRef, useState } from 'react'
import type EditorJS from '@editorjs/editorjs'
import type { OutputData } from '@editorjs/editorjs'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'

const initialData: OutputData = {
  time: Date.now(),
  blocks: [
    {
      id: 'intro',
      type: 'paragraph',
      data: {
        text: 'Comece seu conteúdo descrevendo objetivos, contextos e próximos passos.',
      },
    },
  ],
  version: '2.29.1',
}

const RichTextEditor = () => {
  const editorRef = useRef<EditorJS | null>(null)
  const [isReady, setIsReady] = useState(false)
  const holderIdRef = useRef<string | null>(null)

  if (!holderIdRef.current) {
    holderIdRef.current = `editorjs-${Math.random().toString(36).slice(2, 11)}`
  }

  const holderId = holderIdRef.current

  useEffect(() => {
    if (editorRef.current || !holderId) {
      return
    }

    let isMounted = true
    setIsReady(false)

    const initializeEditor = async () => {
      const EditorJSConstructor = (await import('@editorjs/editorjs')).default

      if (!isMounted || editorRef.current || !holderIdRef.current) {
        return
      }

      const editor = new EditorJSConstructor({
        holder: holderIdRef.current,
        autofocus: true,
        placeholder: 'Escreva aqui usando blocos dinâmicos...',
        data: initialData,
        onReady: () => setIsReady(true),
      })

      editorRef.current = editor
    }

    initializeEditor()

    return () => {
      isMounted = false
      const editor = editorRef.current

      if (!editor) {
        return
      }

      editor.isReady
        .then(() => {
          editor.destroy()
          editorRef.current = null
        })
        .catch(() => {
          editorRef.current = null
        })
    }
  }, [holderId])

  return (
    <Stack spacing={2}>
      <Box
        id={holderId}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          p: 3,
          minHeight: 280,
          bgcolor: 'background.paper',
        }}
      />
      {!isReady && (
        <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
          <CircularProgress size={16} />
          <Typography variant="body2">Carregando editor...</Typography>
        </Stack>
      )}
      {isReady && (
        <Typography variant="caption" color="text.secondary">
          Conteúdo criado com EditorJS. Use / para descobrir novos blocos.
        </Typography>
      )}
    </Stack>
  )
}

export default RichTextEditor
