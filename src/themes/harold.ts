// Harold Grayblood — Dark Fantasy Theme
// Mapped from C object in src/constants.js.
// Note: C.ash is stored as "#666" (shorthand) — normalised to "#666666" here.
// Do not string-compare theme values against C object without normalising.

export const haroldTheme = {
  bg:      '#000000',            // C.black
  accent:  '#d4a843',            // C.gold
  ember:   '#ff6b1a',            // C.ember
  surface: 'rgba(0,0,0,0.75)',   // defaultTabTheme().boxBg
  text:    '#666666',            // C.ash (normalised from "#666")
  cream:   '#e8d5a3',            // C.cream
  frost:   '#8ab4d4',            // C.frost
  border:  '#2a2a2a',            // C.ashDim
  goldDim: '#8a6520',            // C.goldDim
  ink:     '#160c03',            // C.ink
  inkMid:  '#2d1a08',            // C.inkMid
  danger:  '#c0392b',            // C.red
  success: '#28a050',            // C.green
  cal: {
    bg:      '#e8dcc8',
    border:  '#c4aa80',
    text:    '#5a4a30',
    subtext: '#8a7a60',
    empty:   '#ddd3bc',
    hdrBg:   '#8b1a1a',
    hdrTxt:  '#f5e8d8',
  },
} as const

export type HaroldTheme = typeof haroldTheme
