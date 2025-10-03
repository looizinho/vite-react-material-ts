import { argbFromHex, hexFromArgb, themeFromSourceColor } from '@material/material-color-utilities'
import { extendTheme } from '@mui/material/styles'

const seedColor = '#6750a4'

const { schemes } = themeFromSourceColor(argbFromHex(seedColor))

type MaterialColorScheme = typeof schemes.light

const mapSchemeToPalette = (scheme: MaterialColorScheme) => ({
  primary: {
    main: hexFromArgb(scheme.primary),
    contrastText: hexFromArgb(scheme.onPrimary),
  },
  secondary: {
    main: hexFromArgb(scheme.secondary),
    contrastText: hexFromArgb(scheme.onSecondary),
  },
  error: {
    main: hexFromArgb(scheme.error),
    contrastText: hexFromArgb(scheme.onError),
  },
  background: {
    default: hexFromArgb(scheme.background),
    paper: hexFromArgb(scheme.surface),
  },
  divider: hexFromArgb(scheme.outlineVariant),
  text: {
    primary: hexFromArgb(scheme.onBackground),
    secondary: hexFromArgb(scheme.onSurfaceVariant),
  },
})

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: mapSchemeToPalette(schemes.light),
    },
    dark: {
      palette: mapSchemeToPalette(schemes.dark),
    },
  },
  shape: {
    borderRadius: 5,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

export default theme
