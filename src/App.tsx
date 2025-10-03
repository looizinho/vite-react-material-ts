import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { useColorScheme } from '@mui/material/styles'

const assistChips = ['Design Tokens', 'Componentes', 'Temas Dinâmicos']

function ModeToggle() {
  const { mode, setMode } = useColorScheme()

  if (!mode) {
    return null
  }

  const isLightMode = mode === 'light'

  return (
    <IconButton
      aria-label={isLightMode ? 'Ativar tema escuro' : 'Ativar tema claro'}
      color="primary"
      onClick={() => setMode(isLightMode ? 'dark' : 'light')}
      sx={{ borderRadius: 999, border: '1px solid', borderColor: 'divider' }}
    >
      {isLightMode ? <DarkModeOutlinedIcon /> : <WbSunnyOutlinedIcon />}
    </IconButton>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        transition: (theme) => theme.transitions.create(['background-color', 'color']),
      }}
    >
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Stack spacing={6}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="overline" color="text.secondary">
                Material 3
              </Typography>
              <Typography variant="h3" component="h1" gutterBottom>
                Interface exemplar com MUI
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Explore os componentes com a identidade visual do Material You. Ajuste o modo, interaja com o
                contador e veja como o tema responde automaticamente.
              </Typography>
            </Box>
            <ModeToggle />
          </Stack>

          <Card variant="outlined" sx={{ borderRadius: 5 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Contador dinâmico
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Os estilos do botão, superfícies e tipografia usam a paleta gerada dinamicamente a partir da cor
                seed definida no tema Material 3.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" mt={3}>
                <Typography variant="h2" component="p" sx={{ fontWeight: 500, minWidth: 96 }}>
                  {count}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCount((prev) => prev + 1)}>
                    Incrementar
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<RestartAltIcon />}
                    onClick={() => setCount(0)}
                    color="secondary"
                  >
                    Reiniciar
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
            <CardActions sx={{ px: 3, pb: 3 }}>
              <Button
                size="small"
                color="secondary"
                component="a"
                href="https://m3.material.io/"
                target="_blank"
                rel="noreferrer"
              >
                Ver documentação do Material 3
              </Button>
            </CardActions>
          </Card>

          <Box>
            <Typography variant="h6" component="h3" gutterBottom>
              Áreas de foco
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Os chips abaixo utilizam tonalidades do tema atual, destacando neutralidade e superfícies de suporte.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {assistChips.map((chip) => (
                <Chip key={chip} label={chip} variant="outlined" sx={{ borderRadius: 12 }} />
              ))}
            </Stack>
          </Box>

          <Divider />

          <Typography variant="caption" color="text.secondary" textAlign="center">
            Projeto iniciado com Vite + React + TypeScript, atualizado para Material Design 3 com MUI 7.
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

export default App
