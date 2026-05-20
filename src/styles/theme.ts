export const lightTheme = {
  background: '#f4f4f0',
  surface: '#ffffff',
  surfaceCard: '#ffffff',
  surfaceHover: '#f7f9fc',
  border: '#e2e8f0',
  text: '#1a202c',
  textSecondary: '#4a5568',
  textMuted: '#718096',
  primary: '#97ce4c',
  primaryHover: '#66BA4F',
  primaryDeep: '#448C3F',
  primaryLight: 'rgba(151, 206, 76, 0.15)',
  cyan: '#08BAE3',
  yellow: '#F0E14A',
  statusAlive: '#97ce4c',
  statusDead: '#e05a47',
  statusUnknown: '#888',
  cardShadow: '0 4px 20px rgba(0,0,0,0.06)',
  cardShadowHover: '0 12px 40px rgba(0,0,0,0.12)',
  overlayBg: 'rgba(0,0,0,0.6)',
  navBg: 'rgba(255,255,255,0.9)',
  squadBarBg: 'rgba(255,255,255,0.96)',
  shimmerBase: '#e2e8f0',
  shimmerHighlight: '#f7f9fc',
  scrollbar: '#cbd5e0',
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  }
};

export const darkTheme = {
  background: '#0d0d14',
  surface: '#161622',
  surfaceCard: '#1c1c2e',
  surfaceHover: '#23233a',
  border: 'rgba(151, 206, 76, 0.15)',
  text: '#f0f6fc',
  textSecondary: '#8b949e',
  textMuted: '#6e7681',
  primary: '#97ce4c',
  primaryHover: '#66BA4F',
  primaryDeep: '#448C3F',
  primaryLight: 'rgba(151, 206, 76, 0.15)',
  cyan: '#08BAE3',
  yellow: '#F0E14A',
  statusAlive: '#97ce4c',
  statusDead: '#e05a47',
  statusUnknown: '#888',
  cardShadow: '0 4px 20px rgba(0,0,0,0.4)',
  cardShadowHover: '0 12px 40px rgba(151, 206, 76, 0.25)',
  overlayBg: 'rgba(13, 13, 20, 0.85)',
  navBg: 'rgba(13, 13, 20, 0.92)',
  squadBarBg: 'rgba(13, 13, 20, 0.96)',
  shimmerBase: '#21262d',
  shimmerHighlight: '#30363d',
  scrollbar: 'rgba(151, 206, 76, 0.2)',
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  }
};

export type Theme = typeof darkTheme;
