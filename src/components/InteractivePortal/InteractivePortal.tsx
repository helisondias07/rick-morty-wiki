import React from "react";
import styled from "styled-components";

const Container = styled.div`
    position: relative;
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;

    /* Brilho externo verde neon para suavizar transição das bordas */
    filter: drop-shadow(0 0 30px rgba(151, 206, 76, 0.7))
        drop-shadow(0 0 15px rgba(151, 206, 76, 0.4));

    @media (max-width: 1300px) {
        max-width: 600px;
    }

    @media (max-width: 1024px) {
        max-width: 450px;
    }

    @media (max-width: 768px) {
        max-width: 320px;
    }

    @media (max-width: 480px) {
        max-width: 240px;
    }

    @media (max-width: 360px) {
        max-width: 195px;
    }
`;

const BaseVideo = styled.video`
    width: 100%;
    height: auto;
    display: block;
    mix-blend-mode: screen;
    pointer-events: none;
    position: relative;
    z-index: 2;

    /* Suaviza as bordas do vídeo de forma gradativa e suave */
    -webkit-mask-image: radial-gradient(
        circle,
        black 35%,
        rgba(0, 0, 0, 0.8) 52%,
        rgba(0, 0, 0, 0.3) 62%,
        transparent 68%
    );
    mask-image: radial-gradient(
        circle,
        black 35%,
        rgba(0, 0, 0, 0.8) 52%,
        rgba(0, 0, 0, 0.3) 62%,
        transparent 68%
    );

    /* Animação para evitar o flash/piscar no carregamento (F5) */
    animation: fadeIn 0.8s ease-in-out forwards;
    opacity: 0;

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

const Glow = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 85%;
    height: 85%;
    background: radial-gradient(
        circle,
        rgba(151, 206, 76, 0.4) 0%,
        rgba(151, 206, 76, 0.15) 50%,
        rgba(151, 206, 76, 0) 72%
    );
    z-index: 1;
    pointer-events: none;
    filter: blur(4px);
`;

const PortalPoster = styled.img`
    width: 100%;
    height: auto;
    display: block;
    position: relative;
    z-index: 2;
    pointer-events: none;
    object-fit: contain;
    filter: saturate(1.04);
`;

const PortalBacking = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 67%;
    height: 67%;
    border-radius: 50%;
    z-index: 0;
    pointer-events: none;
    background: #0d0d14;

    /* Desativa no modo claro, pois o NotebookBg já revela o fundo estrelado real do body */
    ${({ theme }) =>
        theme.background !== "#0d0d14" &&
        `
    display: none;
  `}
`;

export function InteractivePortal() {
    const [prefersReducedMotion, setPrefersReducedMotion] =
        React.useState(false);

    React.useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => setPrefersReducedMotion(media.matches);

        sync();
        media.addEventListener("change", sync);
        return () => media.removeEventListener("change", sync);
    }, []);

    return (
        <Container>
            <PortalBacking />
            <Glow />
            {prefersReducedMotion ? (
                <PortalPoster
                    src="/portal-hero.png"
                    alt=""
                    aria-hidden="true"
                    decoding="async"
                />
            ) : (
                <BaseVideo
                    src="/porta-hero-animated.mp4"
                    poster="/portal-hero.png"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                />
            )}
        </Container>
    );
}
