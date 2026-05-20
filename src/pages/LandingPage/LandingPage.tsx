import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../hooks/useTheme";
import { InteractivePortal } from "../../components/InteractivePortal/InteractivePortal";
import { PortalTransition } from "../../components/PortalTransition/PortalTransition";
import { NotebookDecorations } from "../../components/NotebookDecorations";
import { SpaceDecorations } from "../../components/SpaceDecorations";
import { MoonIcon, SunIcon } from "../../components/ThemeToggleIcons";

const PageContainer = styled.div<{ $isZooming?: boolean }>`
    background-color: transparent;
    color: ${({ theme }) => theme.text};
    min-height: 100dvh;
    overflow: clip;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 1.5rem;
    transition:
        background-color 0.8s ease,
        color 0.8s ease;
    position: relative;

    /* Habilita perspectiva 3D para transição de folha virando */
    perspective: 1500px;
    transform-style: preserve-3d;

    @media (max-width: 480px) {
        padding: 1rem;
    }

    @media (max-width: 768px) {
        overflow: hidden;
        justify-content: center;
        gap: 0;
        padding: 1rem;
    }

    @media (max-height: 760px) {
        overflow-y: auto;
        justify-content: center;
        gap: 1rem;
        padding-top: 5rem;
        padding-bottom: 1.5rem;
    }
`;

const NotebookBg = styled.div`
    position: absolute;
    inset: 0;
    z-index: 0;
    background-color: #f9f8f3; /* Cor de papel marfim envelhecido leve */
    background-image:
    /* Margem vermelha vertical do caderno na esquerda */
        linear-gradient(
            90deg,
            transparent 80px,
            rgba(230, 90, 90, 0.25) 80px,
            rgba(230, 90, 90, 0.25) 82px,
            transparent 82px
        ),
        /* Linhas horizontais do caderno */
        repeating-linear-gradient(
                transparent,
                transparent 27px,
                rgba(0, 0, 0, 0.05) 27px,
                rgba(0, 0, 0, 0.05) 28px
            );
    background-size:
        100% 100%,
        100% 28px;
    pointer-events: none;

    /* Aplica a máscara do SVG com borda rasgada */
    -webkit-mask: url(#notebook-mask);
    mask: url(#notebook-mask);
`;

const ControlsContainer = styled(motion.div)`
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    display: flex;
    gap: 1rem;
    z-index: 50;

    @media (max-width: 768px) {
        top: 0.75rem;
        right: 0.75rem;
        gap: 0.65rem;
    }
`;

const SlideToggle = styled.button<{ $width?: string }>`
    position: relative;
    width: ${({ $width }) => $width || "84px"};
    height: 36px;
    background: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "rgba(28, 28, 46, 0.6)"
            : "rgba(255, 255, 255, 0.8)"};
    border: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "1px solid rgba(151, 206, 76, 0.3)"
            : "1.5px solid #000000"};
    border-radius: 20px;
    display: flex;
    align-items: center;
    padding: 0;
    cursor: pointer;
    overflow: hidden;
    box-shadow: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "0 4px 12px rgba(0, 0, 0, 0.2)"
            : "2px 2px 0px #000000"};
    backdrop-filter: blur(4px);
`;

const SlideIndicator = styled(motion.div)`
    position: absolute;
    width: calc(50% - 4px);
    height: calc(100% - 8px);
    background: #97ce4c;
    border-radius: 16px;
    top: 4px;
    left: 4px;
    z-index: 1;
    box-shadow: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "0 0 10px rgba(151, 206, 76, 0.4)"
            : "none"};
    border: ${({ theme }) =>
        theme.background === "#0d0d14" ? "none" : "1px solid #000000"};
`;

const ToggleText = styled.span<{ $isActive: boolean }>`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 700;
    z-index: 2;
    color: ${({ $isActive, theme }) =>
        $isActive
            ? "#0d0d14"
            : theme.background === "#0d0d14"
              ? "rgba(255, 255, 255, 0.6)"
              : "rgba(0, 0, 0, 0.6)"};
    transition: color 0.3s ease;
    pointer-events: none;
`;

const TopSection = styled.div`
    flex: 0 0 auto;
    margin-top: 2vh;
    position: relative;
    z-index: 2;

    @media (max-width: 768px) {
        margin-top: 0;
        position: absolute;
        top: calc(50% - 230px);
        left: 50%;
        transform: translateX(-50%);
        width: min(calc(100% - 2rem), 420px);
        display: flex;
        justify-content: center;
    }
`;

const Title = styled(motion.h1)`
    font-family: "Get Schwifty", "Creepster", cursive;
    font-size: clamp(2.8rem, 7vw, 5rem);
    text-align: center;
    white-space: normal;
    text-wrap: balance;
    line-height: 0.95;

    /* Estilização diferenciada entre modo escuro (neon) e claro (cartoon 2D de quadrinhos) */
    ${({ theme }) =>
        theme.background === "#0d0d14"
            ? `
    color: #08BAE3;
    text-shadow: 0 0 30px rgba(8,186,227,0.5), 0 0 60px rgba(8,186,227,0.2);
  `
            : `
    color: #08BAE3;
    text-shadow:
      3px 3px 0px #000000,
      -1px -1px 0px #000000,
      1px -1px 0px #000000,
      -1px 1px 0px #000000,
      1px 1px 0px #000000;
  `}

    @media (max-width: 768px) {
        font-size: clamp(2.4rem, 9vw, 3.2rem);
    }

    @media (max-width: 480px) {
        font-size: clamp(2rem, 10vw, 2.8rem);
    }
`;

const TornBorderSvg = styled.svg`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;

    circle {
        r: 430px;

        @media (max-width: 1300px) {
            r: 330px;
        }
        @media (max-width: 1024px) {
            r: 250px;
        }
        @media (max-width: 768px) {
            r: 180px;
        }
        @media (max-width: 480px) {
            r: 135px;
        }
        @media (max-width: 360px) {
            r: 105px;
        }
    }
`;

const NotebookPageContainer = styled(motion.div)`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    will-change: transform, opacity;

    & > * {
        pointer-events: auto;
    }
`;

const pageFlipVariants = {
    initial: {
        rotateY: -85,
        skewY: 3,
        opacity: 0,
        transformOrigin: "left center",
    },
    animate: {
        rotateY: 0,
        skewY: 0,
        opacity: 1,
        transformOrigin: "left center",
        transition: {
            duration: 0.55,
            ease: [0.25, 0.46, 0.45, 0.94] as const, // Curva suave tipo papel
        },
    },
    exit: {
        rotateY: -85,
        skewY: 3,
        opacity: 0,
        transformOrigin: "left center",
        transition: {
            duration: 0.45,
            ease: [0.55, 0.06, 0.68, 0.19] as const, // Aceleração natural de folha saindo
        },
    },
};

const MiddleSectionWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1000px;
    pointer-events: none;

    @media (max-width: 768px) {
        width: min(calc(100% - 2rem), 420px);
    }

    @media (max-height: 760px) {
        position: relative;
        top: auto;
        left: auto;
        transform: none;
        max-width: 100%;
    }
`;

const MiddleSection = styled(motion.div)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    pointer-events: none;

    & > * {
        pointer-events: auto;
    }
`;

const BottomSection = styled.div`
    flex: 0 0 auto;
    width: 100%;
    max-width: 900px;
    padding-bottom: 2vh;
    position: relative;
    z-index: 2;

    @media (max-width: 768px) {
        position: absolute;
        top: calc(50% + 150px);
        left: 50%;
        transform: translateX(-50%);
        width: min(calc(100% - 2rem), 420px);
        padding-bottom: 0;
    }

    @media (max-height: 760px) {
        padding-bottom: 0;
    }
`;

const CtaButton = styled(motion.button)`
    padding: 16px 48px;
    font-size: 1.45rem;
    font-weight: normal;
    font-family: "Get Schwifty", "Creepster", cursive;
    letter-spacing: 2px;
    border-radius: 50px;
    cursor: pointer;
    min-height: 56px;
    text-transform: uppercase;
    position: relative;
    overflow: hidden;

    ${({ theme }) =>
        theme.background === "#0d0d14"
            ? `
    background: linear-gradient(135deg, #97ce4c, #66BA4F);
    color: #0d0d14;
    border: none;
    box-shadow: 0 0 30px rgba(151,206,76,0.5), inset 0 0 10px rgba(255,255,255,0.4);
    text-shadow: 
      0.5px 0.5px 0 #fff,
     -0.5px -0.5px 0 #fff,  
      0.5px -0.5px 0 #fff,
     -0.5px  0.5px 0 #fff,
      0.5px  0.5px 0 #fff;
  `
            : `
    background: linear-gradient(135deg, #97ce4c, #5ba63b);
    color: #ffffff;
    border: 3px solid #000000;
    box-shadow: 4px 4px 0px #000000;
    text-shadow: 
      1.5px 1.5px 0 #000,
     -1.5px -1.5px 0 #000,  
      1.5px -1.5px 0 #000,
     -1.5px  1.5px 0 #000,
      1.5px  1.5px 0 #000;
  `}

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
        );
        transform: skewX(-20deg);
        transition: all 0.5s;
    }

    &:hover::before {
        left: 150%;
        transition: all 0.7s;
    }
`;

export function LandingPage() {
    const { lang, setLang, t } = useLanguage();
    const { mode, toggleTheme } = useTheme();

    const [isTransitioning, setIsTransitioning] = useState(false);
    const [targetRoute, setTargetRoute] = useState("/characters");

    useEffect(() => {
        document.title = "Rick & Morty Wiki | Home";

        document.body.classList.add("is-landing");
        return () => {
            document.body.classList.remove("is-landing");
        };
    }, []);

    const handleNavigate = (route: string) => {
        setTargetRoute(route);
        setIsTransitioning(true);
        window.dispatchEvent(new Event("portal-transition-start"));
    };

    return (
        <PageContainer $isZooming={isTransitioning}>
            <AnimatePresence>
                {mode !== "dark" && (
                    <NotebookPageContainer
                        variants={pageFlipVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key="notebook-page"
                    >
                        {/* Filtro de Turbulência SVG e Máscara de Papel Rasgado */}
                        <svg
                            style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                pointerEvents: "none",
                                opacity: 0.0001,
                                zIndex: -1,
                            }}
                        >
                            <defs>
                                <filter id="torn-edge">
                                    <feTurbulence
                                        type="fractalNoise"
                                        baseFrequency="0.035"
                                        numOctaves="5"
                                        seed="2"
                                        result="noise"
                                    />
                                    <feDisplacementMap
                                        in="SourceGraphic"
                                        in2="noise"
                                        scale="28"
                                        xChannelSelector="R"
                                        yChannelSelector="G"
                                    />
                                </filter>
                                <filter id="torn-edge-rough">
                                    <feTurbulence
                                        type="turbulence"
                                        baseFrequency="0.06"
                                        numOctaves="6"
                                        seed="5"
                                        result="noise2"
                                    />
                                    <feDisplacementMap
                                        in="SourceGraphic"
                                        in2="noise2"
                                        scale="18"
                                        xChannelSelector="R"
                                        yChannelSelector="G"
                                    />
                                </filter>
                                <filter id="burnt-glow">
                                    <feTurbulence
                                        type="fractalNoise"
                                        baseFrequency="0.04"
                                        numOctaves="4"
                                        seed="8"
                                        result="noise3"
                                    />
                                    <feDisplacementMap
                                        in="SourceGraphic"
                                        in2="noise3"
                                        scale="14"
                                        xChannelSelector="R"
                                        yChannelSelector="G"
                                        result="displaced"
                                    />
                                    <feGaussianBlur
                                        in="displaced"
                                        stdDeviation="3"
                                    />
                                </filter>
                                <radialGradient
                                    id="burnt-gradient"
                                    cx="50%"
                                    cy="50%"
                                    r="50%"
                                >
                                    <stop offset="80%" stopColor="#1a0e04" />
                                    <stop offset="88%" stopColor="#3d2009" />
                                    <stop offset="94%" stopColor="#6b3a12" />
                                    <stop
                                        offset="100%"
                                        stopColor="#a0764a"
                                        stopOpacity="0"
                                    />
                                </radialGradient>

                                <mask id="notebook-mask">
                                    <rect
                                        width="100%"
                                        height="100%"
                                        fill="white"
                                    />
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        fill="black"
                                        filter="url(#torn-edge)"
                                        className="svg-mask-circle"
                                    />
                                </mask>
                            </defs>
                            <style>{`
                .svg-mask-circle {
                  r: 430px;
                }
                @media (max-width: 1300px) {
                  .svg-mask-circle {
                    r: 330px;
                  }
                }
                @media (max-width: 1024px) {
                  .svg-mask-circle {
                    r: 250px;
                  }
                }
                @media (max-width: 768px) {
                  .svg-mask-circle {
                    r: 180px;
                  }
                }
                @media (max-width: 480px) {
                  .svg-mask-circle {
                    r: 135px;
                  }
                }
                @media (max-width: 360px) {
                  .svg-mask-circle {
                    r: 105px;
                  }
                }
              `}</style>
                        </svg>

                        {/* Fundo do caderno pautado com máscara no centro */}
                        <NotebookBg />

                        {/* Borda Rasgada/Queimada visível em volta do buraco - múltiplas camadas */}
                        <TornBorderSvg>
                            {/* Camada 1: Brilho externo sutil - simula papel chamuscado */}
                            <circle
                                cx="50%"
                                cy="50%"
                                fill="none"
                                stroke="#8b6633"
                                strokeWidth="25"
                                filter="url(#burnt-glow)"
                                style={{ opacity: 0.2 }}
                            />
                            {/* Camada 2: Anel grosso queimado */}
                            <circle
                                cx="50%"
                                cy="50%"
                                fill="none"
                                stroke="#1a0e04"
                                strokeWidth="14"
                                filter="url(#torn-edge)"
                                style={{ opacity: 0.7 }}
                            />
                            {/* Camada 3: Textura fibrosa média */}
                            <circle
                                cx="50%"
                                cy="50%"
                                fill="none"
                                stroke="#4a2a0a"
                                strokeWidth="8"
                                filter="url(#torn-edge-rough)"
                                style={{ opacity: 0.5 }}
                            />
                            {/* Camada 4: Borda interna nítida */}
                            <circle
                                cx="50%"
                                cy="50%"
                                fill="none"
                                stroke="#261b0c"
                                strokeWidth="3"
                                filter="url(#torn-edge)"
                                style={{ opacity: 0.8 }}
                            />
                        </TornBorderSvg>

                        {/* Notebook background decorations */}
                        <NotebookDecorations />
                    </NotebookPageContainer>
                )}

                {mode === "dark" && (
                    <motion.div
                        key="space-decorations"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            zIndex: 0,
                        }}
                    >
                        <SpaceDecorations />
                    </motion.div>
                )}
            </AnimatePresence>

            <ControlsContainer
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <SlideToggle
                    onClick={() => setLang(lang === "pt" ? "en" : "pt")}
                    $width="84px"
                >
                    <SlideIndicator
                        animate={{ x: lang === "en" ? "100%" : "0%" }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                        }}
                    />
                    <ToggleText $isActive={lang === "pt"}>PT</ToggleText>
                    <ToggleText $isActive={lang === "en"}>EN</ToggleText>
                </SlideToggle>

                <SlideToggle
                    onClick={toggleTheme}
                    $width="84px"
                    aria-label={
                        lang === "pt"
                            ? "Alternar tema claro e escuro"
                            : "Toggle light and dark theme"
                    }
                >
                    <SlideIndicator
                        animate={{ x: mode === "dark" ? "100%" : "0%" }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                        }}
                    />
                    <ToggleText
                        $isActive={mode !== "dark"}
                        title={lang === "pt" ? "Claro" : "Light"}
                    >
                        <SunIcon />
                    </ToggleText>
                    <ToggleText
                        $isActive={mode === "dark"}
                        title={lang === "pt" ? "Escuro" : "Dark"}
                    >
                        <MoonIcon />
                    </ToggleText>
                </SlideToggle>
            </ControlsContainer>

            <TopSection>
                <Title
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    Rick &amp; Morty Wiki
                </Title>
            </TopSection>

            <MiddleSectionWrapper>
                <MiddleSection
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ scale: 1, opacity: 1, filter: "brightness(1)" }}
                    transition={{
                        delay: 0.4,
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                    }}
                >
                    <InteractivePortal />
                </MiddleSection>
            </MiddleSectionWrapper>

            <BottomSection
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "15px",
                }}
            >
                <CtaButton
                    onClick={() => handleNavigate("/characters")}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 45px rgba(151,206,76,0.8)",
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    {t("landing_cta")}
                </CtaButton>
            </BottomSection>

            <PortalTransition
                isTransitioning={isTransitioning}
                targetRoute={targetRoute}
            />
        </PageContainer>
    );
}
