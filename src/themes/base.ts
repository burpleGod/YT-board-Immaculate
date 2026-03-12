// Base Theme — neutral fallback
// Foundation for future Clean/Classic theme (Phase 4C step 3, theme selection).

export const baseTheme = {
  bg:      '#ffffff',
  accent:  '#6366f1',
  ember:   '#f97316',
  surface: 'rgba(255,255,255,0.9)',
  text:    '#374151',
  cream:   '#f9fafb',
  frost:   '#93c5fd',
  border:  '#e5e7eb',
  goldDim: '#9ca3af',
  ink:     '#111827',
  inkMid:  '#374151',
  danger:  '#ef4444',
  success: '#22c55e',
  cal: {
    bg:      '#f9fafb',
    border:  '#e5e7eb',
    text:    '#374151',
    subtext: '#9ca3af',
    empty:   '#f3f4f6',
    hdrBg:   '#6366f1',
    hdrTxt:  '#ffffff',
  },
} as const

export type BaseTheme = typeof baseTheme
