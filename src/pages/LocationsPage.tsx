import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { Location, LocationFilters, Character } from "../types";
import { getLocations } from "../services/locationService";
import { getCharactersByIds } from "../services/characterService";
import { FilterBar } from "../components/FilterBar";
import { Modal } from "../components/Modal";
import { PageIntro } from "../components/PageIntro";
import { useLanguage } from "../context/LanguageContext";
import {
    translateType,
    translateDimension,
    translateLocationName,
} from "../utils/translate";

const Page = styled(motion.div)`
    padding: 1rem 1.5rem 120px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;

    @media (max-width: 768px) {
        padding: 1rem 1rem 120px;
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-auto-rows: minmax(148px, 1fr);
    gap: 0.75rem;
    min-width: 0;

    @media (min-width: 1025px) {
        align-items: stretch;
    }

    @media (max-width: 1024px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
`;

const LocationCard = styled(motion.div)`
    background: ${({ theme }) => theme.surfaceCard};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 12px;
    padding: 0.8rem 1rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-width: 0;
    overflow: hidden;
    position: relative;
    transition:
        background-color var(--theme-transition-duration, 0.8s) ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.2s ease;

    &:hover {
        border-color: #97ce4c;
        box-shadow: 0 0 12px rgba(151, 206, 76, 0.2);
        transform: translateY(-2px);
    }

    @media (min-width: 1025px) {
        padding: 0.45rem 0.75rem;
        gap: 0.25rem;
    }
`;

const LocHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    min-width: 0;

    @media (max-width: 820px) {
        align-items: flex-start;
        flex-direction: column;
    }
`;

const LocFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    margin-top: auto;
    min-width: 0;

    @media (max-width: 820px) {
        align-items: flex-start;
        flex-direction: column;
    }
`;

const LocName = styled.h3`
    font-weight: 700;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    width: 100%;

    @media (min-width: 1025px) {
        font-size: 0.85rem;
        max-width: 60%;
    }

    @media (max-width: 820px) {
        max-width: 100%;
    }
`;

const LocTag = styled.span`
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
    border-radius: 5px;
    background: rgba(151, 206, 76, 0.15);
    color: #97ce4c;
    font-weight: 600;
    display: inline-block;
    width: fit-content;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 0 1 auto;

    @media (min-width: 1025px) {
        font-size: 0.65rem;
        padding: 0.1rem 0.3rem;
    }
`;

const LocDim = styled.span`
    font-size: 0.75rem;
    color: ${({ theme }) => theme.textMuted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;

    @media (min-width: 1025px) {
        font-size: 0.7rem;
        max-width: 70%;
    }

    @media (max-width: 820px) {
        max-width: 100%;
    }
`;

const ResidentCount = styled.span`
    font-size: 0.75rem;
    color: ${({ theme }) => theme.textSecondary};
    margin-top: auto;
    white-space: nowrap;
    flex: 0 0 auto;

    @media (min-width: 1025px) {
        font-size: 0.7rem;
    }
`;

const markerPulse = keyframes`
  0%, 100% {
    transform: translate(-50%, -50%) scale(0.92);
    box-shadow: 0 0 0 5px rgba(151, 206, 76, 0.1), 0 0 14px rgba(151, 206, 76, 0.34);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.08);
    box-shadow: 0 0 0 8px rgba(151, 206, 76, 0.16), 0 0 24px rgba(151, 206, 76, 0.56);
  }
`;

const radarPing = keyframes`
  0% {
    opacity: 0.46;
    transform: translate(-50%, -50%) scale(0.35);
  }
  72%, 100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(2.8);
  }
`;

const scanSweep = keyframes`
  0% {
    transform: translateX(-120%) skewX(-18deg);
  }
  100% {
    transform: translateX(220%) skewX(-18deg);
  }
`;

const signalBreath = keyframes`
  0%, 100% {
    border-color: rgba(151, 206, 76, 0.22);
    box-shadow: none;
  }
  50% {
    border-color: rgba(151, 206, 76, 0.48);
    box-shadow: 0 0 12px rgba(151, 206, 76, 0.16);
  }
`;

const CoordinatePanel = styled.div<{ $x: number; $y: number }>`
    position: relative;
    flex: 1 1 auto;
    min-height: 74px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid
        ${({ theme }) =>
            theme.background === "#0d0d14"
                ? "rgba(151, 206, 76, 0.16)"
                : "rgba(43, 79, 120, 0.08)"};
    background:
        linear-gradient(rgba(8, 186, 227, 0.09) 1px, transparent 1px),
        linear-gradient(90deg, rgba(8, 186, 227, 0.09) 1px, transparent 1px),
        radial-gradient(
            circle at ${({ $x }) => $x}% ${({ $y }) => $y}%,
            rgba(151, 206, 76, 0.24),
            transparent 18%
        ),
        linear-gradient(135deg, rgba(12, 18, 30, 0.96), rgba(22, 23, 37, 0.98));
    background-size:
        18px 18px,
        18px 18px,
        auto,
        auto;

    &::before,
    &::after {
        content: "";
        position: absolute;
        background: rgba(151, 206, 76, 0.28);
        pointer-events: none;
    }

    &::before {
        left: ${({ $x }) => $x}%;
        top: 10px;
        bottom: 10px;
        width: 1px;
    }

    &::after {
        top: ${({ $y }) => $y}%;
        left: 10px;
        right: 10px;
        height: 1px;
    }

    @media (prefers-reduced-motion: no-preference) {
        .scan-sweep {
            animation: ${scanSweep} 4.8s ease-in-out infinite;
        }
    }

    @media (min-width: 1025px) {
        min-height: 68px;
    }
`;

const CoordinateMarker = styled.span<{
    $x: number;
    $y: number;
    $active: boolean;
}>`
    position: absolute;
    left: ${({ $x }) => $x}%;
    top: ${({ $y }) => $y}%;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #97ce4c;
    background: #0d0d14;
    box-shadow:
        0 0 0 6px rgba(151, 206, 76, 0.1),
        0 0 16px rgba(151, 206, 76, 0.42);
    transform: translate(-50%, -50%);
    z-index: 2;

    &::before,
    &::after {
        content: "";
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        border: 1px solid
            ${({ $active }) =>
                $active
                    ? "rgba(151, 206, 76, 0.5)"
                    : "rgba(151, 206, 76, 0.24)"};
        pointer-events: none;
    }

    @media (prefers-reduced-motion: no-preference) {
        animation: ${({ $active }) => ($active ? markerPulse : "none")} 1.7s
            ease-in-out infinite;

        &::before {
            animation: ${radarPing}
                ${({ $active }) => ($active ? "2.2s" : "4s")} ease-out infinite;
        }

        &::after {
            animation: ${radarPing}
                ${({ $active }) => ($active ? "2.2s" : "4s")} ease-out infinite;
            animation-delay: ${({ $active }) => ($active ? "0.75s" : "1.35s")};
        }
    }
`;

const ScanSweep = styled.span`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 34%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(151, 206, 76, 0.12),
        transparent
    );
    pointer-events: none;
    z-index: 1;
`;

const CoordinateReadout = styled.div`
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-content: end;
    gap: 0.3rem 0.5rem;
    padding: 0.55rem;
    background: linear-gradient(180deg, transparent 28%, rgba(8, 10, 18, 0.78));
    z-index: 1;
`;

const CoordinateItem = styled.span`
    display: flex;
    justify-content: space-between;
    gap: 0.3rem;
    min-width: 0;
    font-size: 0.62rem;
    line-height: 1.1;
    color: ${({ theme }) => theme.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.04em;

    strong {
        color: ${({ theme }) => theme.text};
        font-weight: 700;
        letter-spacing: 0;
        white-space: nowrap;
    }
`;

const SignalBadge = styled.span<{ $active: boolean }>`
    position: absolute;
    top: 0.5rem;
    left: 0.55rem;
    z-index: 2;
    padding: 0.15rem 0.35rem;
    border-radius: 5px;
    background: rgba(8, 10, 18, 0.72);
    border: 1px solid rgba(151, 206, 76, 0.22);
    color: #97ce4c;
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.06em;

    @media (prefers-reduced-motion: no-preference) {
        animation: ${({ $active }) => ($active ? signalBreath : "none")} 2.4s
            ease-in-out infinite;
    }
`;
const Pagination = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 0.75rem;
    }

    @media (min-width: 1025px) {
        margin-top: 0.5rem;
    }
`;

const PageBtn = styled.button`
    padding: 0.4rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.85rem;
    background: ${({ theme }) => theme.surfaceCard};
    color: #97ce4c;
    border: 1.5px solid #97ce4c;
    transition: all 0.2s ease;
    min-height: 38px;

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
        min-height: 44px;
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

const CharGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.75rem;
    margin-top: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
        gap: 0.6rem;
        margin-top: 0.8rem;
    }
`;

const CharAvatar = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    text-align: center;

    @media (max-width: 768px) {
        gap: 0.28rem;
    }
`;

const CharImg = styled.img`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(151, 206, 76, 0.2);

    @media (max-width: 768px) {
        width: 50px;
        height: 50px;
    }
`;

const CharName = styled.span`
    font-size: 0.66rem;
    color: ${({ theme }) => theme.textSecondary};
    line-height: 1.2;

    @media (max-width: 768px) {
        font-size: 0.6rem;
    }
`;

const DetailRow = styled.div`
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
        gap: 0.65rem;
    }
`;

const DetailItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;

    @media (max-width: 768px) {
        min-width: calc(50% - 0.4rem);
    }

    span:first-child {
        font-size: 0.7rem;
        color: ${({ theme }) => theme.textMuted};
        text-transform: uppercase;
        font-weight: 600;
    }
    span:last-child {
        font-size: 0.9rem;
        font-weight: 500;
        color: ${({ theme }) => theme.text};
    }

    @media (max-width: 768px) {
        span:first-child {
            font-size: 0.64rem;
        }

        span:last-child {
            font-size: 0.82rem;
        }
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

const SkeletonLocCard = styled.div.attrs({
    "aria-busy": "true",
    "aria-hidden": "true",
})`
    height: 110px;
    border-radius: 12px;
    background: rgba(128, 128, 128, 0.1);
    border: 1px solid rgba(128, 128, 128, 0.15);
    opacity: 0.5;

    @media (min-width: 1025px) {
        height: 60px;
    }
`;

function hashLocation(value: string) {
    return Array.from(value).reduce((hash, char) => {
        return (hash * 31 + char.charCodeAt(0)) % 9973;
    }, 17);
}

function getLocationCoordinates(loc: Location) {
    const hash = hashLocation(
        `${loc.id}:${loc.name}:${loc.type}:${loc.dimension}`,
    );
    const x = ((hash * 7) % 1800) - 900;
    const y = ((hash * 11) % 1800) - 900;
    const z = ((hash * 13) % 900) - 450;

    return {
        x,
        y,
        z,
        xPercent: 18 + Math.abs(x % 65),
        yPercent: 18 + Math.abs(y % 58),
        sector: `S-${String((hash % 89) + 11).padStart(2, "0")}`,
        hasSignal: loc.residents.length > 0,
    };
}

function LocationCoordinates({ loc, lang }: { loc: Location; lang: string }) {
    const coords = getLocationCoordinates(loc);

    return (
        <CoordinatePanel
            $x={coords.xPercent}
            $y={coords.yPercent}
            aria-hidden="true"
        >
            <ScanSweep className="scan-sweep" />
            <SignalBadge $active={coords.hasSignal}>
                {coords.hasSignal
                    ? lang === "pt"
                        ? "ATIVO"
                        : "ACTIVE"
                    : lang === "pt"
                      ? "SILENTE"
                      : "QUIET"}
            </SignalBadge>
            <CoordinateMarker
                $x={coords.xPercent}
                $y={coords.yPercent}
                $active={coords.hasSignal}
            />
            <CoordinateReadout>
                <CoordinateItem>
                    {lang === "pt" ? "Setor" : "Sector"}{" "}
                    <strong>{coords.sector}</strong>
                </CoordinateItem>
                <CoordinateItem>
                    X <strong>{coords.x}</strong>
                </CoordinateItem>
                <CoordinateItem>
                    Y <strong>{coords.y}</strong>
                </CoordinateItem>
                <CoordinateItem>
                    Z <strong>{coords.z}</strong>
                </CoordinateItem>
            </CoordinateReadout>
        </CoordinatePanel>
    );
}

export function LocationsPage() {
    const { t, lang } = useLanguage();
    const [locs, setLocs] = useState<Location[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<LocationFilters>({});
    const [selected, setSelected] = useState<Location | null>(null);
    const [res, setRes] = useState<Character[]>([]);
    const [resLoad, setResLoad] = useState(false);

    // define o título dinâmico baseado no idioma
    useEffect(() => {
        document.title = `${t("nav_locations")} | Rick & Morty Wiki`;
    }, [lang, t]);

    const load = useCallback(
        async (pageNum: number, f: LocationFilters) => {
            setLoading(true);
            setError(null);
            try {
                const data = await getLocations(pageNum, f);
                setLocs(data.results);
                setTotalPages(data.info.pages);
                setTotal(data.info.count);
                setPage(pageNum);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : t("error"));
            } finally {
                setLoading(false);
            }
        },
        [t],
    );

    useEffect(() => {
        load(1, filters);
    }, [filters, load]);

    const handleFilterChange = useCallback((vals: Record<string, string>) => {
        setFilters({
            name: vals.name || undefined,
            type: vals.type || undefined,
            dimension: vals.dimension || undefined,
        });
    }, []);

    const openModal = async (loc: Location) => {
        setSelected(loc);
        setRes([]);
        setResLoad(true);

        // extrai IDs dos moradores
        const extractIds = (urls: string[]): number[] => {
            return urls
                .map((url) => {
                    const m = url.match(/\/(\d+)$/);
                    return m ? parseInt(m[1], 10) : null;
                })
                .filter((id): id is number => id !== null);
        };

        const ids = extractIds(loc.residents);
        try {
            const chars = await getCharactersByIds(ids);
            setRes(chars);
        } catch {
            setRes([]);
        } finally {
            setResLoad(false);
        }
    };

    const filterValues = {
        name: filters.name ?? "",
        type: filters.type ?? "",
        dimension: filters.dimension ?? "",
    };
    const locationNameSuggestions = Array.from(
        new Set(locs.map((loc) => loc.name)),
    ).sort();
    const locationTypeSuggestions = Array.from(
        new Set([
            "Planet",
            "Space station",
            "Microverse",
            "Dimension",
            "Cluster",
            "TV",
            "Resort",
            "Fantasy town",
            ...locs.map((loc) => loc.type).filter(Boolean),
        ]),
    ).sort();
    const locationDimensionSuggestions = Array.from(
        new Set([
            "Dimension C-137",
            "Replacement Dimension",
            "Cronenberg Dimension",
            "Fantasy Dimension",
            "Post-Apocalyptic Dimension",
            "unknown",
            ...locs.map((loc) => loc.dimension).filter(Boolean),
        ]),
    ).sort();

    const filterFields = [
        {
            key: "name",
            label: t("filter_name"),
            type: "text" as const,
            placeholder:
                lang === "pt" ? "Buscar localização..." : "Search location...",
            suggestions: locationNameSuggestions,
        },
        {
            key: "type",
            label: t("location_type"),
            type: "text" as const,
            placeholder: lang === "pt" ? "Planeta" : "Planet",
            suggestions: locationTypeSuggestions,
        },
        {
            key: "dimension",
            label: t("location_dimension"),
            type: "text" as const,
            placeholder: "C-137",
            suggestions: locationDimensionSuggestions,
        },
    ];

    return (
        <Page
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <PageIntro
                title={t("location_title")}
                subtitle={
                    total > 0
                        ? `${total} ${t("nav_locations").toLowerCase()}`
                        : lang === "pt"
                          ? "Mapeie dimensões, identifique padrões e abra cada ponto para investigar residentes conhecidos."
                          : "Map dimensions, identify patterns and open each point to inspect known residents."
                }
            />

            <ContentContainer>
                <FilterBar
                    fields={filterFields}
                    values={filterValues}
                    onChange={handleFilterChange}
                />

                {error && <ErrorMsg>{error}</ErrorMsg>}

                {!loading && !error && locs.length === 0 && (
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
                                filter: "drop-shadow(0 0 8px #08BAE3)",
                            }}
                        >
                            <circle
                                cx="32"
                                cy="32"
                                r="20"
                                stroke="#08BAE3"
                                strokeWidth="4"
                                fill="none"
                            />
                            <ellipse
                                cx="32"
                                cy="32"
                                rx="28"
                                ry="6"
                                stroke="#08BAE3"
                                strokeWidth="3"
                                fill="none"
                                transform="rotate(-15 32 32)"
                            />
                            <circle cx="24" cy="24" r="3" fill="#08BAE3" />
                            <circle cx="38" cy="36" r="2" fill="#08BAE3" />
                        </svg>
                        <p>{t("empty_locations")}</p>
                    </EmptyStateContainer>
                )}

                <Grid>
                    {loading
                        ? Array.from({ length: 12 }).map((_, idx) => (
                              <SkeletonLocCard key={`loc-sk-${idx}`} />
                          ))
                        : locs.slice(0, 16).map((loc, idx) => (
                              <LocationCard
                                  key={loc.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.04 }}
                                  onClick={() => openModal(loc)}
                              >
                                  <LocHeader>
                                      <LocName
                                          title={translateLocationName(
                                              loc.name,
                                              lang,
                                          )}
                                      >
                                          {translateLocationName(
                                              loc.name,
                                              lang,
                                          )}
                                      </LocName>
                                      <LocTag>
                                          {loc.type
                                              ? translateType(loc.type, lang)
                                              : lang === "pt"
                                                ? "Tipo desconhecido"
                                                : "Unknown type"}
                                      </LocTag>
                                  </LocHeader>
                                  <LocationCoordinates loc={loc} lang={lang} />
                                  <LocFooter>
                                      <LocDim
                                          title={
                                              loc.dimension
                                                  ? translateDimension(
                                                        loc.dimension,
                                                        lang,
                                                    )
                                                  : ""
                                          }
                                      >
                                          {loc.dimension
                                              ? translateDimension(
                                                    loc.dimension,
                                                    lang,
                                                )
                                              : lang === "pt"
                                                ? "Dimensão desc."
                                                : "Unknown dim."}
                                      </LocDim>
                                      <ResidentCount>
                                          Moradores: {loc.residents.length}
                                      </ResidentCount>
                                  </LocFooter>
                              </LocationCard>
                          ))}
                </Grid>

                {totalPages > 1 && (
                    <Pagination>
                        <PageBtn
                            disabled={page <= 1}
                            onClick={() => load(page - 1, filters)}
                        >
                            {lang === "pt" ? "← Anterior" : "← Prev"}
                        </PageBtn>
                        <PageInfo>
                            {lang === "pt"
                                ? `Página ${page} de ${totalPages}`
                                : `Page ${page} of ${totalPages}`}
                        </PageInfo>
                        <PageBtn
                            disabled={page >= totalPages}
                            onClick={() => load(page + 1, filters)}
                        >
                            {lang === "pt" ? "Próximo →" : "Next →"}
                        </PageBtn>
                    </Pagination>
                )}
            </ContentContainer>

            <Modal
                isOpen={!!selected}
                onClose={() => setSelected(null)}
                title={
                    selected ? translateLocationName(selected.name, lang) : ""
                }
            >
                {selected && (
                    <>
                        <DetailRow>
                            <DetailItem>
                                <span>{t("location_type")}</span>
                                <span>
                                    {selected.type
                                        ? translateType(selected.type, lang)
                                        : "—"}
                                </span>
                            </DetailItem>
                            <DetailItem>
                                <span>{t("location_dimension")}</span>
                                <span>
                                    {selected.dimension
                                        ? translateDimension(
                                              selected.dimension,
                                              lang,
                                          )
                                        : "—"}
                                </span>
                            </DetailItem>
                            <DetailItem>
                                <span>{t("location_residents")}</span>
                                <span>{selected.residents.length}</span>
                            </DetailItem>
                        </DetailRow>
                        <h4
                            style={{
                                fontSize: "1rem",
                                color: "#97ce4c",
                                borderBottom: "1px solid rgba(151,206,76,0.2)",
                                paddingBottom: "0.4rem",
                                marginTop: "1.2rem",
                                marginBottom: "0.8rem",
                            }}
                        >
                            {t("location_residents")}
                        </h4>
                        <CharGrid>
                            {resLoad ? (
                                Array.from({ length: 8 }).map((_, idx) => (
                                    <div
                                        key={`modal-res-${idx}`}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "0.35rem",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: "50%",
                                                background:
                                                    "rgba(255,255,255,0.05)",
                                            }}
                                        />
                                        <div
                                            style={{
                                                width: 50,
                                                height: 9,
                                                borderRadius: 4,
                                                background:
                                                    "rgba(255,255,255,0.05)",
                                            }}
                                        />
                                    </div>
                                ))
                            ) : res.length > 0 ? (
                                res.map((c) => (
                                    <CharAvatar key={c.id}>
                                        <CharImg
                                            src={c.image}
                                            alt={c.name}
                                            loading="lazy"
                                        />
                                        <CharName>{c.name}</CharName>
                                    </CharAvatar>
                                ))
                            ) : (
                                <p
                                    style={{
                                        gridColumn: "1/-1",
                                        textAlign: "center",
                                        opacity: 0.5,
                                        fontSize: "0.85rem",
                                        color: "rgba(255,255,255,0.4)",
                                        padding: "1rem 0",
                                    }}
                                >
                                    No residents data available.
                                </p>
                            )}
                        </CharGrid>
                    </>
                )}
            </Modal>
        </Page>
    );
}
