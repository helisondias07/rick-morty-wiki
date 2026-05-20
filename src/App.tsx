import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeContextProvider } from "./context/ThemeContext";
import { SquadProvider } from "./context/SquadContext";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { useTheme } from "./hooks/useTheme";
import { GlobalStyle } from "./styles/globalStyles";
import { lightTheme, darkTheme } from "./styles/theme";
import { Navbar } from "./components/Navbar";
import { SquadBar } from "./components/SquadBar";
import { RickJerryWarning } from "./components/RickJerryWarning";
import { NotebookDecorations } from "./components/NotebookDecorations";

import ScrollToTop from "./components/ScrollToTop";
import { ErrorBoundary } from "./components/ErrorBoundary";

import poopybuttholeFloating from "./assets/poopybutthole-floating.png";
import spaceshipFloating from "./assets/spaceship-floating.png";

const LandingPage = React.lazy(() =>
    import("./pages/LandingPage/LandingPage").then((module) => ({
        default: module.LandingPage,
    })),
);
const CharactersPage = React.lazy(() =>
    import("./pages/CharactersPage").then((module) => ({
        default: module.CharactersPage,
    })),
);
const EpisodesPage = React.lazy(() =>
    import("./pages/EpisodesPage").then((module) => ({
        default: module.EpisodesPage,
    })),
);
const LocationsPage = React.lazy(() =>
    import("./pages/LocationsPage").then((module) => ({
        default: module.LocationsPage,
    })),
);
const SquadPage = React.lazy(() =>
    import("./pages/SquadPage/SquadPage").then((module) => ({
        default: module.SquadPage,
    })),
);
const NotFoundPage = React.lazy(() =>
    import("./pages/NotFoundPage").then((module) => ({
        default: module.NotFoundPage,
    })),
);

const PoopybuttholeFloating = styled(motion.img)`
    position: fixed;
    top: 15%; /* Mais acima */
    left: 0;
    width: 120px;
    height: auto;
    z-index: 0;
    pointer-events: none;
    display: block;
    transform-origin: center;

    @media (max-width: 1300px) {
        width: 90px;
    }

    @media (max-width: 768px) {
        width: 65px;
        top: 25%;
    }
`;

const SpaceshipFloating = styled(motion.img)`
    position: fixed;
    top: 65%; /* Mais abaixo */
    left: 0;
    width: 220px; /* Nave é um pouco maior */
    height: auto;
    z-index: 0;
    pointer-events: none;
    display: block;
    transform-origin: center;

    @media (max-width: 1300px) {
        width: 160px;
    }

    @media (max-width: 768px) {
        width: 110px;
        top: 70%;
    }
`;

const RouteFallback = styled.div`
    min-height: calc(100vh - 64px);
    display: grid;
    place-items: center;
    color: ${({ theme }) => theme.primary};
    font-weight: 700;
`;

const AmbientNotebookLayer = styled.div<{ $repeat?: boolean }>`
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: ${({ $repeat }) => ($repeat ? "visible" : "hidden")};
    min-height: 300px;

    /* Oculta as notas de texto no mobile para evitar sobreposição com títulos de página */
    @media (max-width: 768px) {
        display: none;
    }
`;

function ThemedApp() {
    const { mode } = useTheme();
    const { t } = useLanguage();
    const theme = mode === "dark" ? darkTheme : lightTheme;
    const location = useLocation();
    const [isSucking, setIsSucking] = React.useState(false);
    const [canShowAmbientDecorations, setCanShowAmbientDecorations] =
        React.useState(false);

    const isLandingPage = location.pathname === "/";
    const isSquadPage = location.pathname === "/squad";
    const isCharactersPage = location.pathname === "/characters";

    React.useEffect(() => {
        // Escuta o evento disparado pela LandingPage ao clicar em Atravessar Portal
        const handleSuck = () => setIsSucking(true);

        // Reseta o estado quando a rota mudar (para não ficar sugado nas outras páginas)
        setIsSucking(false);

        window.addEventListener("portal-transition-start", handleSuck);
        return () =>
            window.removeEventListener("portal-transition-start", handleSuck);
    }, [location.pathname]);

    React.useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");

        const updateAmbientMode = () => {
            setCanShowAmbientDecorations(
                window.innerWidth >= 1024 && !media.matches,
            );
        };

        updateAmbientMode();
        window.addEventListener("resize", updateAmbientMode);
        media.addEventListener("change", updateAmbientMode);

        return () => {
            window.removeEventListener("resize", updateAmbientMode);
            media.removeEventListener("change", updateAmbientMode);
        };
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            {(mode === "dark" || isLandingPage) && (
                <div className="large-stars" />
            )}
            {mode !== "dark" && !isLandingPage && (
                <AmbientNotebookLayer
                    aria-hidden="true"
                    $repeat={isCharactersPage}
                >
                    <NotebookDecorations
                        blockCount={isCharactersPage ? 60 : 1}
                    />
                </AmbientNotebookLayer>
            )}

            <AnimatePresence>
                {mode === "dark" && canShowAmbientDecorations && (
                    <>
                        <PoopybuttholeFloating
                            key="poopybutthole-floating"
                            src={poopybuttholeFloating}
                            alt=""
                            aria-hidden="true"
                            initial={{ x: "120vw", y: 0, rotate: 0 }}
                            animate={
                                isSucking
                                    ? {
                                          x: "50vw",
                                          y: "35vh", // Move pro centro verticalmente em relação a ele mesmo
                                          scale: 0,
                                          rotate: 1080,
                                          opacity: 0,
                                      }
                                    : {
                                          x: "-150px",
                                          y: [0, -40, 40, -40, 40, 0],
                                          rotate: 360,
                                      }
                            }
                            exit={{
                                opacity: 0,
                                transition: {
                                    duration: 0.6,
                                    ease: "easeInOut",
                                },
                            }}
                            transition={
                                isSucking
                                    ? { duration: 0.8, ease: "anticipate" }
                                    : {
                                          x: {
                                              duration: 25,
                                              ease: "linear",
                                              repeat: Infinity,
                                              repeatDelay: 12,
                                          },
                                          y: {
                                              duration: 25,
                                              ease: "easeInOut",
                                              repeat: Infinity,
                                              repeatDelay: 12,
                                          },
                                          rotate: {
                                              duration: 25,
                                              ease: "linear",
                                              repeat: Infinity,
                                              repeatDelay: 12,
                                          },
                                      }
                            }
                        />
                        <SpaceshipFloating
                            key="spaceship-floating"
                            src={spaceshipFloating}
                            alt=""
                            aria-hidden="true"
                            initial={{ x: "-300px", y: 0, rotate: 0 }}
                            animate={
                                isSucking
                                    ? {
                                          x: "50vw",
                                          y: "-15vh", // Move pro centro verticalmente em relação a ele mesmo
                                          scale: 0,
                                          rotate: -1080,
                                          opacity: 0,
                                      }
                                    : {
                                          x: "120vw", // Da esquerda para a direita passando por tudo
                                          y: [0, 50, -30, 40, -50, 0],
                                          rotate: [0, 8, -4, 8, -4, 0], // Oscila um pouco para simular a navegação da nave
                                      }
                            }
                            exit={{
                                opacity: 0,
                                transition: {
                                    duration: 0.6,
                                    ease: "easeInOut",
                                },
                            }}
                            transition={
                                isSucking
                                    ? { duration: 0.8, ease: "anticipate" }
                                    : {
                                          x: {
                                              duration: 22,
                                              ease: "linear",
                                              repeat: Infinity,
                                              repeatDelay: 10,
                                          },
                                          y: {
                                              duration: 22,
                                              ease: "easeInOut",
                                              repeat: Infinity,
                                              repeatDelay: 10,
                                          },
                                          rotate: {
                                              duration: 22,
                                              ease: "easeInOut",
                                              repeat: Infinity,
                                              repeatDelay: 10,
                                          },
                                      }
                            }
                        />
                    </>
                )}
            </AnimatePresence>

            {!isLandingPage && <Navbar />}

            <React.Suspense
                fallback={<RouteFallback>{t("loading")}</RouteFallback>}
            >
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<LandingPage />} />
                        <Route
                            path="/characters"
                            element={<CharactersPage />}
                        />
                        <Route path="/episodes" element={<EpisodesPage />} />
                        <Route path="/locations" element={<LocationsPage />} />
                        <Route path="/squad" element={<SquadPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </AnimatePresence>
            </React.Suspense>

            {!isLandingPage && <RickJerryWarning />}
            {!isLandingPage && !isSquadPage && <SquadBar />}
        </ThemeProvider>
    );
}

function App() {
    return (
        <ThemeContextProvider>
            <LanguageProvider>
                <SquadProvider>
                    <BrowserRouter>
                        <ScrollToTop />
                        <ErrorBoundary>
                            <ThemedApp />
                        </ErrorBoundary>
                    </BrowserRouter>
                </SquadProvider>
            </LanguageProvider>
        </ThemeContextProvider>
    );
}

export default App;
