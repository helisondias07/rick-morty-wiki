import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    useMemo,
} from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { Character, CharacterFilters } from "../types";
import { getCharacters } from "../services/characterService";
import { CharacterCard } from "../components/Card";
import { CharacterSpotlightModal } from "../components/CharacterSpotlightModal";
import { FilterBar } from "../components/FilterBar";
import { PageIntro } from "../components/PageIntro";
import { SkeletonCard } from "../components/SkeletonCard/SkeletonCard";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useLanguage } from "../context/LanguageContext";

const Page = styled(motion.div)`
    padding: 1rem 1.5rem 120px;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;

    @media (max-width: 768px) {
        padding: 1rem 1rem 120px;
    }
`;

const Grid = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

    @media (max-width: 760px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
    }

    @media (max-width: 480px) {
        gap: 0.85rem;
    }

    @media (max-width: 360px) {
        grid-template-columns: 1fr;
    }
`;

const EmptyStateContainer = styled.div`
    text-align: center;
    padding: 4rem 2rem;
    color: rgba(255, 255, 255, 0.4);
    font-size: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
        max-width: 400px;
        margin-top: 0.5rem;
    }
`;

const Sentinel = styled.div`
    height: 1px;
`;

const ErrorMsg = styled.div.attrs({
    role: "alert",
})`
    text-align: center;
    padding: 3rem;
    color: ${({ theme }) => theme.statusDead};
    font-weight: 600;
`;

const EndMessage = styled.div`
    text-align: center;
    padding: 3rem 2rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    position: relative;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 20%;
        right: 20%;
        height: 1px;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(151, 206, 76, 0.3),
            transparent
        );
    }

    h3 {
        font-family: "Get Schwifty", "Creepster", cursive;
        color: #97ce4c;
        font-size: 1.8rem;
        letter-spacing: 1px;
        text-shadow: 0 0 10px rgba(151, 206, 76, 0.4);
    }

    p {
        color: ${({ theme }) => theme.textMuted};
        font-size: 0.95rem;
        max-width: 400px;
        line-height: 1.5;
    }
`;

const LoadingIndicator = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    width: 100%;

    .portal-spinner {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 4px dashed rgba(151, 206, 76, 0.3);
        border-top: 4px solid #97ce4c;
        border-bottom: 4px solid #97ce4c;
        box-shadow:
            0 0 20px rgba(151, 206, 76, 0.4),
            inset 0 0 10px rgba(151, 206, 76, 0.2);
        animation: spin 1.5s linear infinite;
    }

    .loading-text {
        color: #97ce4c;
        font-weight: 600;
        letter-spacing: 2px;
        font-size: 0.85rem;
        text-transform: uppercase;
        animation: pulseText 1.5s ease-in-out infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
            filter: hue-rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
            filter: hue-rotate(30deg);
        }
    }

    @keyframes pulseText {
        0%,
        100% {
            opacity: 0.6;
        }
        50% {
            opacity: 1;
            text-shadow: 0 0 8px rgba(151, 206, 76, 0.6);
        }
    }
`;

const ContentContainer = styled.div`
    background: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "rgba(28, 28, 46, 0.45)"
            : "rgba(255, 255, 255, 0.75)"};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 16px;
    padding: 1.5rem;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "0 8px 32px rgba(0, 0, 0, 0.3)"
            : "0 8px 32px rgba(0, 0, 0, 0.05)"};
    margin-top: 1rem;
    transition:
        background var(--theme-transition-duration, 0.8s) ease,
        border-color var(--theme-transition-duration, 0.8s) ease,
        box-shadow var(--theme-transition-duration, 0.8s) ease;

    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

export function CharactersPage() {
    const { t, lang } = useLanguage();
    const [chars, setChars] = useState<Character[]>([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState<CharacterFilters>({});
    const [selectedCharacter, setSelectedCharacter] =
        useState<Character | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    // define o título dinâmico da página baseado no idioma
    useEffect(() => {
        document.title = `${t("nav_characters")} | Rick & Morty Wiki`;
    }, [lang, t]);

    const loadPage = useCallback(
        async (
            pageNum: number,
            currentFilters: CharacterFilters,
            reset: boolean,
        ) => {
            if (abortRef.current) abortRef.current.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setLoading(true);
            setError(null);

            // Previne "429 Too Many Requests": A API bloqueia se rolarmos até o final da página muito rápido (20+ requisições em ms)
            // Adicionamos um pequeno delay proposital para as páginas subsequentes (throttle)
            if (pageNum > 1) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                if (controller.signal.aborted) return;
            }

            try {
                const data = await getCharacters(
                    pageNum,
                    currentFilters,
                    controller.signal,
                );

                // console.log("chars loaded successfully:", data.results);

                if (reset) {
                    setChars(data.results);
                } else {
                    setChars((prev) => {
                        const newChars = data.results.filter(
                            (char: Character) =>
                                !prev.some((p) => p.id === char.id),
                        );
                        return [...prev, ...newChars];
                    });
                }
                setHasNext(data.info.next !== null);
                setTotal(data.info.count);
                setPage(pageNum);
            } catch (err: unknown) {
                if (err instanceof DOMException && err.name === "AbortError")
                    return;
                setError(err instanceof Error ? err.message : t("error"));
                setHasNext(false); // Evita loop infinito de erros
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        },
        [t],
    );

    useEffect(() => {
        setPage(1);
        setHasNext(true); // Reseta para tentar buscar novamente com novos filtros
        loadPage(1, filters, true);
    }, [filters, loadPage]);

    const fetchNext = useCallback(() => {
        // evita requisição duplicada se já está carregando
        if (!loading && hasNext) {
            loadPage(page + 1, filters, false);
        }
    }, [loading, hasNext, page, filters, loadPage]);

    const sentinelRef = useInfiniteScroll(fetchNext, hasNext, loading);

    const handleFilterChange = useCallback((vals: Record<string, string>) => {
        setFilters({
            name: vals.name || undefined,
            status: vals.status || undefined,
            species: vals.species || undefined,
        });
    }, []);

    const filterValues = useMemo(
        () => ({
            name: filters.name ?? "",
            status: filters.status ?? "",
            species: filters.species ?? "",
        }),
        [filters.name, filters.species, filters.status],
    );

    const characterNameSuggestions = useMemo(
        () => Array.from(new Set(chars.map((char) => char.name))).sort(),
        [chars],
    );

    const speciesSuggestions = useMemo(
        () =>
            Array.from(
                new Set([
                    "Human",
                    "Alien",
                    "Humanoid",
                    "Robot",
                    "Animal",
                    "Mythological Creature",
                    "Cronenberg",
                    "Disease",
                    "unknown",
                    ...chars.map((char) => char.species).filter(Boolean),
                ]),
            ).sort(),
        [chars],
    );

    const filterFields = useMemo(
        () => [
            {
                key: "name",
                label: t("filter_name"),
                type: "text" as const,
                placeholder: `${t("filter_placeholder_name")}`,
                suggestions: characterNameSuggestions,
            },
            {
                key: "status",
                label: t("filter_status"),
                type: "select" as const,
                options: [
                    { value: "Alive", label: t("status_alive") },
                    { value: "Dead", label: t("status_dead") },
                    { value: "unknown", label: t("status_unknown") },
                ],
            },
            {
                key: "species",
                label: t("filter_species"),
                type: "text" as const,
                placeholder: lang === "pt" ? "Humano" : "Human",
                suggestions: speciesSuggestions,
            },
        ],
        [characterNameSuggestions, lang, speciesSuggestions, t],
    );

    return (
        <Page
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <PageIntro
                title={t("characters_title")}
                subtitle={
                    total > 0
                        ? `${total} ${t("characters_found")}`
                        : lang === "pt"
                          ? "Explore personagens, descubra variantes e monte sua próxima equipe interdimensional."
                          : "Explore characters, discover variants and build your next interdimensional squad."
                }
            />

            <ContentContainer>
                <FilterBar
                    fields={filterFields}
                    values={filterValues}
                    onChange={handleFilterChange}
                />

                {/* O erro foi movido para o final da lista */}

                {!error && chars.length === 0 && !loading && (
                    <EmptyStateContainer>
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 64 64"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                                marginBottom: "1.5rem",
                                filter: "drop-shadow(0 0 8px #97ce4c)",
                            }}
                        >
                            <ellipse
                                cx="32"
                                cy="32"
                                rx="28"
                                ry="8"
                                stroke="#448C3F"
                                strokeWidth="4"
                                strokeDasharray="4 4"
                                fill="none"
                            />
                            <circle
                                cx="32"
                                cy="32"
                                r="6"
                                fill="#448C3F"
                                opacity="0.5"
                            />
                        </svg>
                        <p>{t("empty_characters")}</p>
                    </EmptyStateContainer>
                )}

                <Grid
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {chars.map((char) => (
                        <CharacterCard
                            key={char.id}
                            character={char}
                            onPreview={setSelectedCharacter}
                        />
                    ))}
                    {loading && <SkeletonCard count={page === 1 ? 10 : 5} />}
                </Grid>

                {loading && page > 1 && (
                    <LoadingIndicator>
                        <div className="portal-spinner"></div>
                        <span className="loading-text">
                            {lang === "pt"
                                ? "Sintonizando dimensões..."
                                : "Tuning dimensions..."}
                        </span>
                    </LoadingIndicator>
                )}

                {error && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "0.75rem",
                            paddingBottom: "2rem",
                            marginTop: "1rem",
                        }}
                    >
                        <ErrorMsg style={{ padding: "1rem" }}>{error}</ErrorMsg>
                        <button
                            onClick={() => {
                                setError(null);
                                setHasNext(true);
                                loadPage(page + 1, filters, false);
                            }}
                            style={{
                                padding: "0.55rem 1.25rem",
                                borderRadius: "10px",
                                fontWeight: "600",
                                background: "#97ce4c",
                                color: "#0d0d14",
                                border: "none",
                                cursor: "pointer",
                                minHeight: "44px",
                                fontSize: "0.9rem",
                                boxShadow:
                                    "0 4px 12px rgba(151, 206, 76, 0.25)",
                            }}
                        >
                            {lang === "pt" ? "Tentar Novamente" : "Retry"}
                        </button>
                    </div>
                )}

                {!hasNext && chars.length > 0 && !loading && !error && (
                    <EndMessage>
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#97ce4c"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                filter: "drop-shadow(0 0 8px rgba(151, 206, 76, 0.5))",
                            }}
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                            <path d="M2 12h20"></path>
                        </svg>
                        <h3>
                            {lang === "pt"
                                ? "Fim da Viagem"
                                : "End of the Trip"}
                        </h3>
                        <p>
                            {lang === "pt"
                                ? "Você chegou ao limite da galáxia. Não existem mais personagens neste caminho dimensional."
                                : "You've reached the edge of the galaxy. There are no more characters in this dimensional path."}
                        </p>
                    </EndMessage>
                )}

                <Sentinel ref={sentinelRef} />
            </ContentContainer>
            <CharacterSpotlightModal
                character={selectedCharacter}
                onClose={() => setSelectedCharacter(null)}
            />
        </Page>
    );
}
