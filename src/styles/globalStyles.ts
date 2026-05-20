import { createGlobalStyle } from "styled-components";

function generateStars(count: number): string {
    return Array.from({ length: count }, () => {
        const x = Math.floor(Math.random() * 100);
        const y = Math.floor(Math.random() * 100);
        const opacity = (Math.random() * 0.5 + 0.2).toFixed(2);
        return `${x}vw ${y}vh 0 rgba(255,255,255,${opacity})`;
    }).join(", ");
}

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    --theme-transition-duration: 0.8s;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: background-color 0.8s ease, color 0.8s ease;
    min-height: 100vh;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
    overflow-x: hidden;

    ${({ theme }) =>
        theme.background !== "#0d0d14"
            ? `
      background-color: #f9f8f3;
      background-image:
        linear-gradient(90deg, transparent 80px, rgba(230, 90, 90, 0.25) 80px, rgba(230, 90, 90, 0.25) 82px, transparent 82px),
        repeating-linear-gradient(transparent, transparent 27px, rgba(0, 0, 0, 0.05) 27px, rgba(0, 0, 0, 0.05) 28px);
      background-size: 100% 100%, 100% 28px;
    `
            : `
      background-color: #0d0d14;
      background-image: none;
    `}

    &.is-landing {
      background-color: #0d0d14 !important;
      background-image: none !important;
    }

    /* Estrelas 1 */
    &::before {
      content: '';
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: transparent;
      box-shadow: ${generateStars(280)};
      width: 1px;
      height: 1px;
      animation: twinkle 4s infinite ease-in-out;
      display: none;
    }

    /* Estrelas 2 */
    &::after {
      content: '';
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: transparent;
      box-shadow: ${generateStars(140)};
      width: 2px;
      height: 2px;
      animation: twinkle 6s infinite ease-in-out 1s;
      display: none;
    }

    /* Ativa as estrelas se for modo escuro OU se for a landing page */
    ${({ theme }) =>
        theme.background === "#0d0d14"
            ? `
      &::before, &::after {
        display: block;
      }
    `
            : `
      &.is-landing::before, &.is-landing::after {
        display: block;
      }
    `}
  }

  /* Estrelas grandes */
  .large-stars {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background: transparent;
    box-shadow: ${generateStars(45)};
    width: 3px;
    height: 3px;
    animation: twinkle 8s infinite ease-in-out 2s;
    display: none;

    ${({ theme }) =>
        theme.background === "#0d0d14"
            ? `
      display: block;
    `
            : `
      .is-landing & {
        display: block;
      }
    `}
  }

  @keyframes twinkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }

    body::before,
    body::after,
    .large-stars {
      animation: none !important;
    }
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    position: relative;
    z-index: 1; /* sobrepõe o background fixo do portal */
  }

  /* Fonte estilizada para os títulos — Creepster carrega via Google Fonts */
  h1.page-title {
    font-family: 'Creepster', 'Impact', sans-serif !important;
    font-weight: normal;
    letter-spacing: 2px;
    color: #08BAE3;
    text-shadow: 0 0 20px rgba(8, 186, 227, 0.4);
    text-transform: none;
    /* responsive clamp para o h1 */
    font-size: clamp(2.2rem, 6vw, 3.6rem) !important;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    font-family: inherit;
    border: none;
    background: none;
    min-height: 44px; /* área de toque mobile acessível */
  }

  input, select, textarea {
    font-family: inherit;
    outline: none;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ul, ol {
    list-style: none;
  }

  /* Custom scrollbar verde portal */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.scrollbar};
    border-radius: 4px;
    border: 2px solid ${({ theme }) => theme.background};
  }

  /* Focus outline verde portal */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`;
