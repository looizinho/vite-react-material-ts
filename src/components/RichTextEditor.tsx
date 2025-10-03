import { useEffect, useRef, useState } from 'react'
import type EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import ListTool from '@editorjs/list'
import Comment, { type RenderBody } from 'editorjs-comment'
import type { OutputData } from '@editorjs/editorjs'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'

type StoredComment = {
  blockId: string
  comments: Array<{ id: string; content: string; createdAt: string }>
}

const commentStore = new Map<string, StoredComment>()

const createCommentContainer = ({
  commentBlockId,
  blockId,
  onClose,
  addCommentBlockData,
  removeBlockComments,
}: RenderBody): HTMLElement => {
  let currentCommentBlockId = commentBlockId ?? null

  if (!blockId) {
    const fallback = document.createElement('div')
    fallback.style.padding = '16px'
    fallback.style.maxWidth = '320px'
    fallback.style.fontSize = '13px'
    fallback.style.color = '#4a4458'
    fallback.textContent = 'Selecione um bloco válido para adicionar comentários.'
    return fallback
  }

  const resolvedBlockId = blockId

  const wrapper = document.createElement('div')
  wrapper.style.display = 'flex'
  wrapper.style.flexDirection = 'column'
  wrapper.style.gap = '12px'
  wrapper.style.width = '320px'
  wrapper.style.maxWidth = '100%'
  wrapper.style.padding = '16px'
  wrapper.style.border = '1px solid rgba(103, 80, 164, 0.24)'
  wrapper.style.borderRadius = '12px'
  wrapper.style.background = 'rgba(103, 80, 164, 0.04)'

  const title = document.createElement('strong')
  title.textContent = 'Comentários deste trecho'
  title.style.fontFamily = 'inherit'
  title.style.fontSize = '14px'
  title.style.color = '#332d41'
  wrapper.appendChild(title)

  const commentListContainer = document.createElement('div')
  commentListContainer.style.display = 'flex'
  commentListContainer.style.flexDirection = 'column'
  commentListContainer.style.gap = '8px'
  wrapper.appendChild(commentListContainer)

  const renderComments = () => {
    commentListContainer.innerHTML = ''
    const storedComments = currentCommentBlockId
      ? commentStore.get(currentCommentBlockId)?.comments ?? []
      : []

    if (!storedComments.length) {
      const emptyState = document.createElement('p')
      emptyState.textContent = 'Nenhum comentário salvo ainda.'
      emptyState.style.margin = '0'
      emptyState.style.fontSize = '13px'
      emptyState.style.color = '#625b71'
      commentListContainer.appendChild(emptyState)
      return
    }

    storedComments.forEach((comment) => {
      const card = document.createElement('div')
      card.style.background = '#fff'
      card.style.border = '1px solid rgba(103, 80, 164, 0.16)'
      card.style.borderRadius = '8px'
      card.style.padding = '8px 12px'

      const content = document.createElement('p')
      content.textContent = comment.content
      content.style.margin = '0 0 6px'
      content.style.fontSize = '13px'
      content.style.lineHeight = '1.4'
      content.style.color = '#1d1b20'

      const timestamp = document.createElement('span')
      timestamp.textContent = comment.createdAt
      timestamp.style.fontSize = '11px'
      timestamp.style.color = '#4a4458'

      card.appendChild(content)
      card.appendChild(timestamp)
      commentListContainer.appendChild(card)
    })
  }

  const textarea = document.createElement('textarea')
  textarea.placeholder = 'Escreva um comentário rápido sobre o trecho selecionado.'
  textarea.rows = 3
  textarea.style.width = '100%'
  textarea.style.resize = 'vertical'
  textarea.style.fontFamily = 'inherit'
  textarea.style.fontSize = '13px'
  textarea.style.padding = '8px'
  textarea.style.borderRadius = '8px'
  textarea.style.border = '1px solid rgba(103, 80, 164, 0.24)'
  textarea.style.outline = 'none'

  const actions = document.createElement('div')
  actions.style.display = 'flex'
  actions.style.gap = '8px'
  actions.style.justifyContent = 'flex-end'

  const saveButton = document.createElement('button')
  saveButton.type = 'button'
  saveButton.textContent = 'Salvar comentário'
  saveButton.style.padding = '6px 12px'
  saveButton.style.fontSize = '13px'
  saveButton.style.borderRadius = '999px'
  saveButton.style.border = 'none'
  saveButton.style.cursor = 'pointer'
  saveButton.style.background = '#6750a4'
  saveButton.style.color = '#fff'

  const clearButton = document.createElement('button')
  clearButton.type = 'button'
  clearButton.textContent = 'Limpar marcadores'
  clearButton.style.padding = '6px 12px'
  clearButton.style.fontSize = '13px'
  clearButton.style.borderRadius = '999px'
  clearButton.style.border = '1px solid rgba(103, 80, 164, 0.24)'
  clearButton.style.background = '#f6f2ff'
  clearButton.style.color = '#4a4458'
  clearButton.style.cursor = 'pointer'

  const closeButton = document.createElement('button')
  closeButton.type = 'button'
  closeButton.textContent = 'Fechar'
  closeButton.style.padding = '6px 12px'
  closeButton.style.fontSize = '13px'
  closeButton.style.borderRadius = '999px'
  closeButton.style.border = '1px solid rgba(103, 80, 164, 0.24)'
  closeButton.style.background = '#fff'
  closeButton.style.color = '#4a4458'
  closeButton.style.cursor = 'pointer'

  const generateCommentId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID()
    }
    return `comment-${Math.random().toString(36).slice(2, 11)}`
  }

  saveButton.addEventListener('click', () => {
    const commentText = textarea.value.trim()
    if (!commentText) {
      textarea.focus()
      return
    }

    const commentId = currentCommentBlockId ?? generateCommentId()
    const stored = commentStore.get(commentId) ?? {
      blockId: resolvedBlockId,
      comments: [],
    }

    const nextComment = {
      id: `note-${Date.now()}`,
      content: commentText,
      createdAt: new Date().toLocaleString('pt-BR'),
    }

    const nextComments = [...stored.comments, nextComment]

    commentStore.set(commentId, {
      blockId: resolvedBlockId,
      comments: nextComments,
    })

    currentCommentBlockId = commentId
    addCommentBlockData({ id: commentId, count: nextComments.length })
    textarea.value = ''
    renderComments()
  })

  clearButton.addEventListener('click', () => {
    if (!currentCommentBlockId) {
      textarea.value = ''
      onClose()
      return
    }

    commentStore.delete(currentCommentBlockId)
    addCommentBlockData({ id: currentCommentBlockId, count: 0 })
    removeBlockComments()
    currentCommentBlockId = null
    textarea.value = ''
    renderComments()
    onClose()
  })

  closeButton.addEventListener('click', () => {
    onClose()
  })

  actions.appendChild(closeButton)
  actions.appendChild(clearButton)
  actions.appendChild(saveButton)

  wrapper.appendChild(textarea)
  wrapper.appendChild(actions)

  renderComments()

  return wrapper
}

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

      const editorConfig = {
        holder: holderIdRef.current ?? undefined,
        autofocus: true,
        placeholder: 'Escreva aqui usando blocos dinâmicos...',
        data: initialData,
        tools: {
          header: Header,
          list: {
            class: ListTool,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered',
            },
          },
          comment: {
            class: Comment,
            inlineToolbar: true,
            config: {
              editorjsId: holderIdRef.current ?? undefined,
              markerColor: 'rgba(103, 80, 164, 0.16)',
              activeColor: '#6750a4',
              renderBody: createCommentContainer,
            },
          },
        },
        onReady: () => setIsReady(true),
      }

      const editor = new EditorJSConstructor(editorConfig as any)

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
