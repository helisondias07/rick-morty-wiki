import type { ApiResponse, Episode, EpisodeFilters } from "../types";

const BASE_URL = "https://rickandmortyapi.com/api";
const TVMAZE_EPISODES_URL = "https://api.tvmaze.com/shows/216/episodes";

export interface EpisodeSynopsisData {
    summary: string | null;
    image: string | null;
}

interface TvMazeEpisode {
    season: number;
    number: number;
    summary: string | null;
    image: {
        medium?: string | null;
        original?: string | null;
    } | null;
}

let episodeSynopsisCache: Promise<Map<string, EpisodeSynopsisData>> | null =
    null;
const summaryTranslationCache = new Map<string, string>();

function parseEpisodeCode(code: string) {
    const match = code.match(/^S(\d+)E(\d+)$/i);
    if (!match) return null;

    return {
        season: Number.parseInt(match[1], 10),
        number: Number.parseInt(match[2], 10),
    };
}

function stripHtmlSummary(summary: string | null) {
    if (!summary) return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(summary, "text/html");
    const text = doc.body.textContent?.replace(/\s+/g, " ").trim() ?? "";
    return text || null;
}

export async function getEpisodes(
    page: number = 1,
    filters: EpisodeFilters = {},
    signal?: AbortSignal,
): Promise<ApiResponse<Episode>> {
    const params = new URLSearchParams({ page: String(page) });
    if (filters.name) params.set("name", filters.name);
    if (filters.episode) params.set("episode", filters.episode);

    const res = await fetch(`${BASE_URL}/episode?${params}`, { signal });
    if (!res.ok) {
        if (res.status === 404)
            return {
                info: { count: 0, pages: 0, next: null, prev: null },
                results: [],
            };
        throw new Error(`Failed to fetch episodes: ${res.status}`);
    }
    return res.json();
}

export async function getAllEpisodes(signal?: AbortSignal): Promise<Episode[]> {
    const res1 = await fetch(`${BASE_URL}/episode`, { signal });
    if (!res1.ok) throw new Error(`Failed to fetch episodes: ${res1.status}`);
    const data1 = await res1.json();

    const totalPages = data1.info.pages;
    let allResults = [...data1.results];

    const promises = [];
    for (let p = 2; p <= totalPages; p++) {
        promises.push(
            fetch(`${BASE_URL}/episode?page=${p}`, { signal }).then((r) => {
                if (!r.ok)
                    throw new Error(`Failed to fetch episodes page ${p}`);
                return r.json();
            }),
        );
    }

    const restData = await Promise.all(promises);
    for (const d of restData) {
        allResults = allResults.concat(d.results);
    }

    return allResults;
}

async function loadEpisodeSynopsisMap() {
    if (!episodeSynopsisCache) {
        episodeSynopsisCache = fetch(TVMAZE_EPISODES_URL)
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch episode synopsis data: ${response.status}`,
                    );
                }

                const episodes: TvMazeEpisode[] = await response.json();
                const map = new Map<string, EpisodeSynopsisData>();

                episodes.forEach((episode) => {
                    const code = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
                    map.set(code, {
                        summary: stripHtmlSummary(episode.summary),
                        image:
                            episode.image?.medium ??
                            episode.image?.original ??
                            null,
                    });
                });

                return map;
            })
            .catch((error) => {
                episodeSynopsisCache = null;
                throw error;
            });
    }

    return episodeSynopsisCache;
}

export async function getEpisodeSynopsis(
    episodeCode: string,
): Promise<EpisodeSynopsisData | null> {
    const parsed = parseEpisodeCode(episodeCode);
    if (!parsed) return null;

    const map = await loadEpisodeSynopsisMap();
    const normalizedCode = `S${String(parsed.season).padStart(2, "0")}E${String(parsed.number).padStart(2, "0")}`;

    return map.get(normalizedCode) ?? null;
}

export async function translateEpisodeSummaryToPortuguese(summary: string) {
    if (!summary) return summary;
    const cached = summaryTranslationCache.get(summary);
    if (cached) return cached;

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(summary)}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(
            `Failed to translate episode summary: ${response.status}`,
        );
    }

    const data = await response.json();
    const translated = Array.isArray(data?.[0])
        ? data[0].map((chunk: unknown[]) => chunk?.[0] ?? "").join("")
        : summary;

    summaryTranslationCache.set(summary, translated);
    return translated;
}
