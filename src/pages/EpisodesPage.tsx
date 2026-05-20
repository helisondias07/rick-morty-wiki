import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { Episode, EpisodeFilters, Character } from "../types";
import {
    getAllEpisodes,
    getEpisodeSynopsis,
    translateEpisodeSummaryToPortuguese,
    type EpisodeSynopsisData,
} from "../services/episodeService";
import { getCharactersByIds } from "../services/characterService";
import { FilterBar } from "../components/FilterBar";
import { Modal } from "../components/Modal";
import { PageIntro } from "../components/PageIntro";
import { useLanguage } from "../context/LanguageContext";
import { translateAirDate } from "../utils/translate";

const Page = styled(motion.div)`
    padding: 1rem 1.5rem 120px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;

    @media (max-width: 768px) {
        padding: 1rem 1rem 120px;
    }
`;

const EpisodeList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    @media (min-width: 1025px) {
        gap: 0.5rem;
    }
`;

const EpisodeRow = styled(motion.div)`
    background: ${({ theme }) => theme.surfaceCard};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 14px;
    padding: 1.1rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    cursor: pointer;
    transition:
        background-color var(--theme-transition-duration, 0.8s) ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.2s ease;

    &:hover {
        border-color: #97ce4c;
        box-shadow: 0 0 12px rgba(151, 206, 76, 0.15);
        transform: translateY(-2px);
    }

    @media (max-width: 640px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.6rem;
    }

    @media (min-width: 1025px) {
        padding: 0.5rem 1rem;
        border-radius: 10px;
    }
`;

const EpisodeCode = styled.span`
    font-size: 0.78rem;
    font-weight: 700;
    padding: 0.25rem 0.6rem;
    border-radius: 6px;
    background: rgba(151, 206, 76, 0.15);
    color: #97ce4c;
    white-space: nowrap;

    @media (min-width: 1025px) {
        font-size: 0.72rem;
        padding: 0.15rem 0.4rem;
    }
`;

const EpisodeName = styled.span`
    font-weight: 600;
    font-size: 0.95rem;
    flex: 1;
    color: ${({ theme }) => theme.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 640px) {
        white-space: normal;
        overflow: visible;
        text-overflow: initial;
    }

    @media (min-width: 1025px) {
        font-size: 0.88rem;
    }
`;

const AirDate = styled.span`
    font-size: 0.8rem;
    color: ${({ theme }) => theme.textMuted};
    white-space: nowrap;

    @media (max-width: 480px) {
        white-space: normal;
    }

    @media (min-width: 1025px) {
        font-size: 0.75rem;
    }
`;

const EpisodeRowMeta = styled.span`
    color: ${({ theme }) => theme.textMuted};
    font-size: 0.8rem;
    white-space: nowrap;
    font-weight: 600;

    @media (max-width: 480px) {
        font-size: 0.76rem;
    }
`;

const Pagination = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 0.75rem;
    }

    @media (min-width: 1025px) {
        margin-top: 0.5rem;
    }
`;

const PageBtn = styled.button<{ $active?: boolean }>`
    padding: 0.55rem 1.25rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.88rem;
    background: ${({ theme, $active }) =>
        $active ? theme.primary : theme.surfaceCard};
    color: ${({ $active }) => ($active ? "#0d0d14" : "#97ce4c")};
    border: 1.5px solid #97ce4c;
    transition: all 0.2s ease;
    min-height: 44px;

    &:disabled {
        opacity: 0.35;
        cursor: not-allowed;
        border-color: ${({ theme }) =>
            theme.background === "#0d0d14"
                ? "rgba(151, 206, 76, 0.2)"
                : "rgba(0, 0, 0, 0.15)"};
        color: ${({ theme }) =>
            theme.background === "#0d0d14"
                ? "rgba(255, 255, 255, 0.3)"
                : "rgba(0, 0, 0, 0.35)"};
    }

    &:not(:disabled):hover {
        background: #97ce4c;
        color: #0d0d14;
    }

    @media (max-width: 480px) {
        width: 100%;
    }

    @media (min-width: 1025px) {
        padding: 0.25rem 0.75rem;
        min-height: 32px;
        font-size: 0.8rem;
        border-radius: 8px;
    }
`;

const PageInfo = styled.span`
    font-size: 0.85rem;
    color: ${({ theme }) => theme.textMuted};
`;

const EpisodeHero = styled.div`
    margin-bottom: 1rem;

    @media (max-width: 768px) {
        margin-bottom: 0.8rem;
    }
`;

const EpisodeSummaryCard = styled.div`
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 16px;
    background: ${({ theme }) => theme.surfaceHover};
    padding: 1rem;

    @media (max-width: 768px) {
        border-radius: 14px;
        padding: 0.85rem;
    }
`;

const EpisodeSummaryLabel = styled.div`
    color: ${({ theme }) => theme.primaryDeep};
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 0.55rem;

    @media (max-width: 768px) {
        font-size: 0.66rem;
        margin-bottom: 0.45rem;
    }
`;

const EpisodeSummaryText = styled.p`
    color: ${({ theme }) => theme.text};
    line-height: 1.7;
    font-size: 0.95rem;

    @media (max-width: 768px) {
        font-size: 0.88rem;
        line-height: 1.55;
    }
`;

const EpisodeMeta = styled.p`
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
    color: ${({ theme }) => theme.textMuted};
    line-height: 1.5;

    @media (max-width: 768px) {
        font-size: 0.78rem;
        margin-bottom: 0.6rem;
    }
`;

const CharGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 0.75rem;
    margin-top: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
        gap: 0.6rem;
        margin-top: 0.8rem;
    }

    @media (max-width: 480px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.55rem;
    }
`;

const CharAvatar = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    text-align: center;

    @media (max-width: 768px) {
        gap: 0.3rem;
    }
`;

const CharImg = styled.img`
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(151, 206, 76, 0.2);

    @media (max-width: 768px) {
        width: 56px;
        height: 56px;
    }
`;

const CharName = styled.span`
    font-size: 0.7rem;
    color: ${({ theme }) => theme.textSecondary};
    line-height: 1.2;

    @media (max-width: 768px) {
        font-size: 0.62rem;
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

const ErrorMsg = styled.div.attrs({
    role: "alert",
})`
    text-align: center;
    padding: 3rem;
    color: ${({ theme }) => theme.statusDead};
    font-weight: 600;
`;

const ContentContainer = styled.div`
    background: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "rgba(28, 28, 46, 0.45)"
            : "rgba(255, 255, 255, 0.75)"};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
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

    @media (min-width: 1025px) {
        padding: 1rem 1.25rem;

        > :first-child {
            margin-bottom: 0.75rem;
            padding: 0.5rem 0.75rem;
            border-radius: 12px;

            input,
            select,
            button {
                min-height: 38px;
                font-size: 0.85rem;
                padding: 0.4rem 0.75rem;
            }
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;
        margin-top: 1rem;
    }
`;

const SkeletonEpisodeRow = styled.div.attrs({
    "aria-busy": "true",
    "aria-hidden": "true",
})`
    height: 66px;
    border-radius: 14px;
    background: rgba(128, 128, 128, 0.1);
    border: 1px solid rgba(128, 128, 128, 0.15);
    opacity: 0.5;

    @media (min-width: 1025px) {
        height: 48px;
        border-radius: 10px;
    }
`;

export function EpisodesPage() {
    const { t, lang } = useLanguage();
    const [allEps, setAllEps] = useState<Episode[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<EpisodeFilters>({});
    const [selected, setSelected] = useState<Episode | null>(null);
    const [modalChars, setModalChars] = useState<Character[]>([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [synopsisLoading, setSynopsisLoading] = useState(false);
    const [selectedEpisodeMeta, setSelectedEpisodeMeta] =
        useState<EpisodeSynopsisData | null>(null);

    // define o título dinâmico baseado no idioma
    useEffect(() => {
        document.title = `${t("nav_episodes")} | Rick & Morty Wiki`;
    }, [lang, t]);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllEpisodes();
                setAllEps(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : t("error"));
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [t]);

    const handleFilterChange = useCallback((vals: Record<string, string>) => {
        setFilters({
            name: vals.name || undefined,
            episode: vals.episode || undefined,
        });
        setPage(1); // Reseta para a temporada 1 ao filtrar
    }, []);

    const openModal = async (ep: Episode) => {
        setSelected(ep);
        setModalChars([]);
        setSelectedEpisodeMeta(null);
        setModalLoading(true);
        setSynopsisLoading(true);

        // extrai os IDs das URLs dos personagens
        const extractIds = (urls: string[]): number[] => {
            return urls
                .map((url) => {
                    const match = url.match(/\/(\d+)$/);
                    return match ? parseInt(match[1], 10) : null;
                })
                .filter((id): id is number => id !== null);
        };

        const ids = extractIds(ep.characters);

        const [charsResult, synopsisResult] = await Promise.allSettled([
            getCharactersByIds(ids),
            getEpisodeSynopsis(ep.episode),
        ]);

        if (charsResult.status === "fulfilled") {
            setModalChars(charsResult.value);
        } else {
            setModalChars([]);
        }

        if (synopsisResult.status === "fulfilled") {
            const synopsisData = synopsisResult.value;

            if (synopsisData?.summary && lang === "pt") {
                try {
                    const translatedSummary =
                        await translateEpisodeSummaryToPortuguese(
                            synopsisData.summary,
                        );
                    setSelectedEpisodeMeta({
                        ...synopsisData,
                        summary: translatedSummary,
                    });
                } catch {
                    setSelectedEpisodeMeta(synopsisData);
                }
            } else {
                setSelectedEpisodeMeta(synopsisData);
            }
        } else {
            setSelectedEpisodeMeta(null);
        }

        setModalLoading(false);
        setSynopsisLoading(false);
    };

    const filterValues = {
        name: filters.name ?? "",
        episode: filters.episode ?? "",
    };
    const episodeNameSuggestions = Array.from(
        new Set(allEps.map((ep) => ep.name)),
    ).sort();
    const episodeCodeSuggestions = Array.from(
        new Set(allEps.map((ep) => ep.episode)),
    ).sort();

    const filterFields = [
        {
            key: "name",
            label: lang === "pt" ? "Nome" : "Name",
            type: "text" as const,
            placeholder:
                lang === "pt" ? "Buscar episódio..." : "Search episode...",
            suggestions: episodeNameSuggestions,
        },
        {
            key: "episode",
            label: lang === "pt" ? "Episódio" : "Episode",
            type: "text" as const,
            placeholder: "S01E01",
            suggestions: episodeCodeSuggestions,
        },
    ];

    // Helper para obter o número da temporada de um código de episódio (ex: S01E01 -> 1)
    const getSeasonNumber = (epCode: string) => {
        const match = epCode.match(/^S(\d+)/i);
        return match ? parseInt(match[1], 10) : 1;
    };

    // Determina todas as temporadas disponíveis de forma única e ordenada
    const seasons = Array.from(
        new Set(allEps.map((ep) => getSeasonNumber(ep.episode))),
    ).sort((a, b) => a - b);
    const totalPages = seasons.length > 0 ? seasons.length : 1;

    // O número da página atual seleciona a temporada correspondente
    const currentSeasonNum = seasons.length > 0 ? seasons[page - 1] : 1;

    // Filtra episódios da temporada selecionada com base nos inputs de busca
    const filteredEps = allEps.filter((ep) => {
        const epSeason = getSeasonNumber(ep.episode);
        if (epSeason !== currentSeasonNum) return false;

        if (
            filters.name &&
            !ep.name.toLowerCase().includes(filters.name.toLowerCase())
        )
            return false;
        if (
            filters.episode &&
            !ep.episode.toLowerCase().includes(filters.episode.toLowerCase())
        )
            return false;

        return true;
    });

    return (
        <Page
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <PageIntro
                title={t("episode_title")}
                subtitle={
                    !loading && filteredEps.length > 0
                        ? `${filteredEps.length} ${t("nav_episodes").toLowerCase()}`
                        : lang === "pt"
                          ? "Navegue por temporada, abra os detalhes e veja rapidamente quem apareceu em cada episódio."
                          : "Browse by season, open details and quickly inspect who appeared in each episode."
                }
            />

            <ContentContainer>
                <FilterBar
                    fields={filterFields}
                    values={filterValues}
                    onChange={handleFilterChange}
                />

                {error && <ErrorMsg>{error}</ErrorMsg>}

                {!loading && !error && filteredEps.length === 0 && (
                    <EmptyStateContainer>
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 64 64"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                                marginBottom: "1.5rem",
                                opacity: 0.6,
                                filter: "drop-shadow(0 0 8px #888)",
                            }}
                        >
                            <rect
                                x="8"
                                y="16"
                                width="48"
                                height="36"
                                rx="4"
                                stroke="#888"
                                strokeWidth="4"
                                fill="none"
                            />
                            <line
                                x1="20"
                                y1="6"
                                x2="32"
                                y2="16"
                                stroke="#888"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            <line
                                x1="44"
                                y1="6"
                                x2="32"
                                y2="16"
                                stroke="#888"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            <rect
                                x="14"
                                y="22"
                                width="28"
                                height="24"
                                fill="#333"
                            />
                            <line
                                x1="16"
                                y1="26"
                                x2="40"
                                y2="42"
                                stroke="rgba(255,255,255,0.15)"
                                strokeWidth="2"
                            />
                            <line
                                x1="16"
                                y1="36"
                                x2="40"
                                y2="30"
                                stroke="rgba(255,255,255,0.15)"
                                strokeWidth="2"
                            />
                        </svg>
                        <p>{t("empty_episodes")}</p>
                    </EmptyStateContainer>
                )}

                <EpisodeList>
                    {loading
                        ? Array.from({ length: 10 }).map((_, idx) => (
                              <SkeletonEpisodeRow key={`loading-${idx}`} />
                          ))
                        : filteredEps.map((ep, idx) => (
                              <EpisodeRow
                                  key={ep.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.03 }}
                                  onClick={() => openModal(ep)}
                              >
                                  <EpisodeCode>{ep.episode}</EpisodeCode>
                                  <EpisodeName>{ep.name}</EpisodeName>
                                  <AirDate>
                                      {t("episode_air_date")}:{" "}
                                      {translateAirDate(ep.air_date, lang)}
                                  </AirDate>
                                  <EpisodeRowMeta>
                                      {ep.characters.length}{" "}
                                      {lang === "pt" ? "personagens" : "chars"}{" "}
                                      →
                                  </EpisodeRowMeta>
                              </EpisodeRow>
                          ))}
                </EpisodeList>

                {totalPages > 1 && (
                    <Pagination>
                        <PageBtn
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                        >
                            {lang === "pt" ? "← Anterior" : "← Prev"}
                        </PageBtn>
                        <PageInfo>
                            {lang === "pt"
                                ? `Temporada ${currentSeasonNum} de ${totalPages}`
                                : `Season ${currentSeasonNum} of ${totalPages}`}
                        </PageInfo>
                        <PageBtn
                            disabled={page >= totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            {lang === "pt" ? "Próximo →" : "Next →"}
                        </PageBtn>
                    </Pagination>
                )}
            </ContentContainer>

            <Modal
                isOpen={!!selected}
                onClose={() => {
                    setSelected(null);
                    setModalChars([]);
                    setSelectedEpisodeMeta(null);
                }}
                title={selected ? `${selected.episode} — ${selected.name}` : ""}
            >
                {selected && (
                    <>
                        <EpisodeMeta>
                            {lang === "pt" ? "Data" : "Date"}:{" "}
                            {translateAirDate(selected.air_date, lang)} ·{" "}
                            {selected.characters.length}{" "}
                            {lang === "pt" ? "personagens" : "characters"}
                        </EpisodeMeta>

                        <EpisodeHero>
                            <EpisodeSummaryCard>
                                <EpisodeSummaryLabel>
                                    {lang === "pt" ? "Sinopse" : "Synopsis"}
                                </EpisodeSummaryLabel>
                                <EpisodeSummaryText>
                                    {synopsisLoading
                                        ? lang === "pt"
                                            ? "Sintonizando a sinopse deste episódio..."
                                            : "Tuning into this episode synopsis..."
                                        : selectedEpisodeMeta?.summary ||
                                          (lang === "pt"
                                              ? "Nenhuma sinopse externa foi encontrada para este episódio."
                                              : "No external synopsis was found for this episode.")}
                                </EpisodeSummaryText>
                            </EpisodeSummaryCard>
                        </EpisodeHero>

                        <EpisodeSummaryLabel>
                            {t("episode_characters")}
                        </EpisodeSummaryLabel>
                        <CharGrid>
                            {modalLoading
                                ? Array.from({ length: 8 }).map((_, idx) => (
                                      <div
                                          key={`modal-loading-${idx}`}
                                          style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "center",
                                              gap: "0.4rem",
                                          }}
                                      >
                                          <div
                                              style={{
                                                  width: 70,
                                                  height: 70,
                                                  borderRadius: "50%",
                                                  background:
                                                      "rgba(255,255,255,0.05)",
                                              }}
                                          />
                                          <div
                                              style={{
                                                  width: 60,
                                                  height: 10,
                                                  borderRadius: 4,
                                                  background:
                                                      "rgba(255,255,255,0.05)",
                                              }}
                                          />
                                      </div>
                                  ))
                                : modalChars.map((c) => (
                                      <CharAvatar key={c.id}>
                                          <CharImg
                                              src={c.image}
                                              alt={c.name}
                                              loading="lazy"
                                          />
                                          <CharName>{c.name}</CharName>
                                      </CharAvatar>
                                  ))}
                        </CharGrid>
                    </>
                )}
            </Modal>
        </Page>
    );
}
