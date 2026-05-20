import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CharacterSpotlightModal } from "../../components/CharacterSpotlightModal";
import {
    IntroEyebrow,
    IntroSubtitle,
    IntroTitle,
    PageIntro,
} from "../../components/PageIntro";
import { useSquad } from "../../hooks/useSquad";
import { useLanguage } from "../../context/LanguageContext";
import {
    calcSurvivalScore,
    getRickAnalysis,
    getRandomMission,
} from "./squadData";
import { translateSpecies } from "../../utils/translate";

const Page = styled(motion.main)`
    min-height: calc(100dvh - 64px);
    width: 100%;
    max-width: 1160px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
    overflow: visible;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    position: relative;
    z-index: 1;

    @media (max-width: 768px) {
        min-height: calc(100dvh - 64px);
        padding: 1rem;
    }
`;

const Button = styled(motion.button)<{
    $variant?: "primary" | "secondary" | "danger";
}>`
    min-height: 36px;
    padding: 0.55rem 0.9rem;
    border-radius: 10px;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border: 1px solid
        ${({ theme, $variant }) =>
            $variant === "danger"
                ? "rgba(224, 90, 71, 0.45)"
                : $variant === "primary"
                  ? theme.primary
                  : theme.border};
    background: ${({ theme, $variant }) =>
        $variant === "danger"
            ? "rgba(224, 90, 71, 0.08)"
            : $variant === "primary"
              ? theme.primary
              : theme.surfaceCard};
    color: ${({ theme, $variant }) =>
        $variant === "danger"
            ? theme.statusDead
            : $variant === "primary"
              ? "#0d0d14"
              : theme.text};
    box-shadow: ${({ theme, $variant }) =>
        $variant === "primary" && theme.background === "#0d0d14"
            ? "0 10px 24px rgba(151, 206, 76, 0.22)"
            : "none"};

    &:hover {
        transform: translateY(-1px);
        border-color: ${({ theme, $variant }) =>
            $variant === "danger" ? theme.statusDead : theme.primary};
    }

    @media (max-width: 480px) {
        flex: 1;
    }
`;

const DashboardGrid = styled.section`
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
    gap: 0.75rem;
    flex: 0 0 auto;

    @media (max-width: 980px) {
        grid-template-columns: 1fr;
    }
`;

const Panel = styled.section`
    background: ${({ theme }) => theme.surfaceCard};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 16px;
    box-shadow: ${({ theme }) => theme.cardShadow};
    padding: 1rem;
    position: relative;
    z-index: 1;
    isolation: isolate;
`;

const MembersPanel = styled(Panel)`
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 1rem 1rem 0.9rem;
    background:
        radial-gradient(
            circle at top center,
            rgba(151, 206, 76, 0.05),
            transparent 34%
        ),
        ${({ theme }) => theme.surfaceCard};
`;

const PanelTitle = styled.h2`
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.primaryDeep};
    margin-bottom: 0.7rem;
`;

const MembersTitle = styled(PanelTitle)`
    text-align: center;
    font-size: 0.9rem;
    margin-bottom: 0.35rem;
`;

const MembersGridArea = styled.div`
    flex: 0 0 auto;
    min-height: 0;
    display: flex;
    align-items: flex-start;
    padding-top: 0.1rem;
`;

const HeroPanel = styled(Panel)`
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.85rem;
    align-items: center;
    padding: 0.9rem 1rem;

    @media (max-width: 620px) {
        grid-template-columns: 1fr;
    }
`;

const ScoreRing = styled.div<{ $score: number }>`
    width: 108px;
    aspect-ratio: 1;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background:
        radial-gradient(
            circle at center,
            ${({ theme }) => theme.surfaceCard} 0 57%,
            transparent 58%
        ),
        conic-gradient(
            ${({ $score }) =>
                    $score >= 70
                        ? "#97ce4c"
                        : $score >= 40
                          ? "#f0a500"
                          : "#e05a47"}
                ${({ $score }) => $score * 3.6}deg,
            ${({ theme }) =>
                    theme.background === "#0d0d14"
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.08)"}
                0
        );
`;

const ScoreValue = styled.strong<{ $score: number }>`
    font-family: "Courier New", monospace;
    font-size: 1.75rem;
    color: ${({ $score }) =>
        $score >= 70 ? "#448C3F" : $score >= 40 ? "#b7791f" : "#e05a47"};
`;

const SummaryTitle = styled.h3`
    color: ${({ theme }) => theme.text};
    font-size: 1.05rem;
    margin-bottom: 0.3rem;
`;

const SummaryText = styled.p`
    color: ${({ theme }) => theme.textMuted};
    line-height: 1.35;
    margin-bottom: 0.55rem;
    font-size: 0.86rem;
`;

const StatGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(90px, 1fr));
    gap: 0.55rem;

    @media (max-width: 620px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const StatCard = styled.div`
    background: ${({ theme }) => theme.surfaceHover};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 12px;
    padding: 0.5rem 0.58rem;
`;

const StatValue = styled.div`
    color: ${({ theme }) => theme.text};
    font-size: 1.1rem;
    font-weight: 900;
`;

const StatLabel = styled.div`
    color: ${({ theme }) => theme.textMuted};
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 0.2rem;
`;

const AnalysisPanel = styled(Panel)`
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    padding: 0.9rem 1rem;
`;

const RickAnalysis = styled.blockquote`
    margin: 0;
    color: ${({ theme }) => theme.text};
    line-height: 1.45;
    font-style: italic;
    border-left: 3px solid ${({ theme }) => theme.primary};
    padding-left: 1rem;
    font-size: 0.86rem;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const DiagnosisText = styled(RickAnalysis)`
    -webkit-line-clamp: 8;
`;

const SignalGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.55rem;

    @media (max-width: 520px) {
        grid-template-columns: 1fr;
    }
`;

const SignalCard = styled.div`
    background: ${({ theme }) => theme.surfaceHover};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 12px;
    padding: 0.65rem;
`;

const SignalLabel = styled.div`
    color: ${({ theme }) => theme.textMuted};
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.35rem;
`;

const SignalValue = styled.div`
    color: ${({ theme }) => theme.text};
    font-weight: 800;
`;

const CharacterGrid = styled.section`
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.9rem;
    width: 100%;
    flex: 0 0 auto;
    align-content: start;
    align-items: start;

    @media (max-width: 1100px) {
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    }

    @media (max-width: 900px) {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 0.75rem;
    }
`;

const MembersStats = styled(SignalGrid)`
    max-width: 920px;
    width: 100%;
    margin: 0 auto 0.5rem;
    grid-template-columns: repeat(4, minmax(0, 1fr));

    @media (max-width: 780px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
`;

const MembersFooter = styled.div`
    margin-top: auto;
    min-height: 112px;
    padding-top: 0.85rem;
    border-top: 1px solid ${({ theme }) => theme.border};
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
    gap: 0.9rem;
    align-items: center;

    @media (max-width: 860px) {
        grid-template-columns: 1fr;
        min-height: auto;
    }
`;

const MembersFooterLead = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const MembersFooterTitle = styled.h3`
    margin: 0;
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.cyan};
`;

const MembersFooterText = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.textMuted};
    line-height: 1.5;
    font-size: 0.82rem;
    max-width: 56ch;
`;

const MembersInsights = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

const InsightChip = styled.div`
    padding: 0.45rem 0.7rem;
    border-radius: 999px;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.surfaceHover};
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.04em;
`;

const MembersFooterAside = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
`;

const CrewAvatars = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 0.45rem;

    @media (max-width: 860px) {
        justify-content: flex-start;
    }
`;

const CrewMiniAvatar = styled.img`
    width: 34px;
    height: 34px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${({ theme }) => theme.surfaceCard};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.border};
`;

const SurvivalBar = styled.div`
    width: 100%;
    height: 12px;
    border-radius: 999px;
    overflow: hidden;
    background: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.06)"};
    display: flex;
`;

const SurvivalSegment = styled.div<{
    $tone: "alive" | "dead" | "unknown";
    $width: number;
}>`
    width: ${({ $width }) => `${$width}%`};
    min-width: ${({ $width }) => ($width > 0 ? "10px" : "0")};
    background: ${({ $tone }) =>
        $tone === "alive"
            ? "#97ce4c"
            : $tone === "dead"
              ? "#e05a47"
              : "#08BAE3"};
    transition: width 0.25s ease;
`;

const CharacterCard = styled(motion.article)`
    background: ${({ theme }) => theme.surfaceCard};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    box-shadow: ${({ theme }) => theme.cardShadow};
    display: flex;
    flex-direction: column;
    min-height: 0;
    transition:
        transform 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-3px);
        border-color: ${({ theme }) => theme.primary};
        box-shadow: ${({ theme }) => theme.cardShadowHover};
    }
`;

const RemoveButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 30px;
    margin-top: auto;
    padding: 0 0.65rem;
    border-radius: 999px;
    color: ${({ theme }) => theme.statusDead};
    background: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "rgba(224, 90, 71, 0.12)"
            : "rgba(224, 90, 71, 0.08)"};
    border: 1px solid rgba(224, 90, 71, 0.32);
    font-size: 0.64rem;
    font-weight: 900;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    transition:
        background 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;

    &:hover {
        background: ${({ theme }) => theme.statusDead};
        color: #fff;
        transform: translateY(-1px);
    }
`;

const EmptySlotCard = styled(motion.article)`
    background: linear-gradient(180deg, ${({ theme }) => theme.surfaceHover}, ${({ theme }) => theme.surfaceCard});
    border: 1.5px dashed ${({ theme }) => theme.border};
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    min-height: 220px;
    transition: all 0.2s ease;
    
    &:hover, &:focus-visible {
        border-color: ${({ theme }) => theme.primary};
        background: ${({ theme }) => theme.surfaceHover};
        outline: none;
        transform: translateY(-3px);
    }
`;

const PlusIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${({ theme }) => theme.surfaceCard};
    border: 1.5px dashed ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    ${EmptySlotCard}:hover & {
        background: ${({ theme }) => theme.primary};
        color: #0d0d14;
        border-style: solid;
    }
`;

const EmptySlotText = styled.span`
    color: ${({ theme }) => theme.textMuted};
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.2s ease;

    ${EmptySlotCard}:hover & {
        color: ${({ theme }) => theme.primary};
    }
`;

const CharacterImage = styled.img`
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: contain;
    background:
        radial-gradient(
            circle at top center,
            rgba(151, 206, 76, 0.1),
            transparent 60%
        ),
        linear-gradient(180deg, rgba(8, 186, 227, 0.08), transparent 42%),
        ${({ theme }) => theme.surfaceHover};
    padding: 0.45rem;
    display: block;
`;

const CharacterInfo = styled.div`
    padding: 0.7rem;
    min-width: 0;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 0.2rem;
`;

const CharacterPreviewArea = styled.div`
    cursor: pointer;

    &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.primary};
        outline-offset: -2px;
    }
`;

const CharacterName = styled.h3`
    font-size: 0.82rem;
    color: ${({ theme }) => theme.text};
    margin-bottom: 0.08rem;
    overflow: hidden;
    min-width: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

const CharacterMeta = styled.div`
    color: ${({ theme }) => theme.textMuted};
    font-size: 0.68rem;
    line-height: 1.4;
`;

const StatusDot = styled.span<{ $status: string }>`
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 0.4rem;
    background: ${({ $status }) =>
        $status === "Alive"
            ? "#97ce4c"
            : $status === "Dead"
              ? "#e05a47"
              : "#888"};
`;

const MissionPanel = styled(Panel)`
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.75rem;
    align-items: center;
    flex: 0 0 auto;

    @media (max-width: 700px) {
        grid-template-columns: 1fr;
    }
`;

const MissionPreview = styled.p`
    color: ${({ theme }) => theme.textMuted};
    line-height: 1.35;
    font-size: 0.86rem;
`;

const EmptyState = styled(Panel)`
    min-height: min(520px, calc(100vh - 120px));
    display: grid;
    grid-template-columns: minmax(300px, 0.85fr) minmax(360px, 1.15fr);
    align-items: center;
    gap: clamp(1.5rem, 4vw, 3.5rem);
    padding: clamp(1.75rem, 4vw, 3rem);

    @media (max-width: 820px) {
        grid-template-columns: 1fr;
        text-align: center;
    }
`;

const EmptyCounter = styled.div`
    width: 116px;
    height: 116px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    margin-bottom: 1.2rem;
    background: ${({ theme }) => theme.surfaceHover};
    border: 1px dashed ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primaryDeep};
    font-size: 1.25rem;
    font-weight: 900;
    font-family: "Courier New", monospace;

    @media (max-width: 820px) {
        margin-left: auto;
        margin-right: auto;
    }
`;

const EmptyLead = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    ${IntroEyebrow} {
        margin-bottom: 0.4rem;
    }

    ${IntroTitle} {
        margin-bottom: 0.7rem;
    }

    ${IntroSubtitle} {
        margin-bottom: 1.15rem;
        max-width: 430px;
    }

    @media (max-width: 820px) {
        align-items: center;
    }
`;

const EmptyPreview = styled.div`
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: clamp(0.55rem, 1.2vw, 0.9rem);
    align-items: center;
    justify-self: center;
    width: min(100%, 560px);

    @media (max-width: 640px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media (max-width: 420px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
`;

const EmptySlot = styled.div`
    min-height: 176px;
    border-radius: 14px;
    border: 1.5px dashed ${({ theme }) => theme.border};
    background: linear-gradient(
        180deg,
        ${({ theme }) => theme.surfaceHover},
        ${({ theme }) => theme.surfaceCard}
    );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.85rem 0.65rem;
    color: ${({ theme }) => theme.textMuted};
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;

    &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1px solid ${({ theme }) => theme.border};
        margin: 0;
        background: ${({ theme }) => theme.surfaceCard};
    }

    @media (max-width: 520px) {
        min-height: 120px;
        padding: 0.55rem;
        font-size: 0.58rem;
    }
`;

const ModalOverlay = styled(motion.div)`
    position: fixed;
    inset: 0;
    background: ${({ theme }) => theme.overlayBg};
    backdrop-filter: blur(8px);
    z-index: 500;
    display: grid;
    place-items: center;
    padding: clamp(0.75rem, 2vw, 1.25rem);
`;

const MissionModal = styled(motion.div)`
    width: min(680px, calc(100vw - 2rem));
    max-height: calc(100dvh - 2rem);
    overflow-y: auto;
    background: ${({ theme }) => theme.surfaceCard};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 18px;
    padding: 1.5rem;
    box-shadow: ${({ theme }) => theme.cardShadowHover};

    @media (max-width: 640px) {
        width: min(96vw, 100vw);
        max-height: calc(100dvh - 1rem);
        padding: 1rem;
        border-radius: 16px;
    }
`;

const MissionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: flex-start;
    margin-bottom: 1rem;

    @media (max-width: 560px) {
        flex-direction: column;
    }
`;

const MissionTag = styled.div`
    color: ${({ theme }) => theme.primaryDeep};
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-weight: 900;
    margin-bottom: 0.65rem;
`;

const MissionPlanet = styled.h2`
    color: ${({ theme }) => theme.text};
    font-size: 1.6rem;
    margin-bottom: 0.45rem;
`;

const MissionRiskBadge = styled.div<{ $score: number }>`
    flex: 0 0 auto;
    border-radius: 999px;
    padding: 0.55rem 0.75rem;
    border: 1px solid
        ${({ $score }) =>
            $score >= 70
                ? "rgba(151, 206, 76, 0.55)"
                : $score >= 40
                  ? "rgba(240, 165, 0, 0.55)"
                  : "rgba(224, 90, 71, 0.55)"};
    background: ${({ theme, $score }) =>
        $score >= 70
            ? theme.background === "#0d0d14"
                ? "rgba(151, 206, 76, 0.14)"
                : "rgba(151, 206, 76, 0.12)"
            : $score >= 40
              ? "rgba(240, 165, 0, 0.12)"
              : "rgba(224, 90, 71, 0.12)"};
    color: ${({ $score }) =>
        $score >= 70 ? "#448C3F" : $score >= 40 ? "#b7791f" : "#e05a47"};
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
`;

const MissionObjective = styled.p`
    color: ${({ theme }) => theme.textMuted};
    line-height: 1.55;
`;

const MissionIntelGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.65rem;
    padding: 0.85rem 0;
    border-top: 1px solid ${({ theme }) => theme.border};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    margin-bottom: 1rem;

    @media (max-width: 560px) {
        grid-template-columns: 1fr;
    }
`;

const MissionIntelCard = styled.div`
    background: ${({ theme }) => theme.surfaceHover};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 12px;
    padding: 0.75rem;
`;

const MissionIntelLabel = styled.div`
    color: ${({ theme }) => theme.textMuted};
    font-size: 0.66rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 0.35rem;
`;

const MissionIntelValue = styled.div`
    color: ${({ theme }) => theme.text};
    font-weight: 900;
    line-height: 1.25;
`;

const MissionCrew = styled.div`
    display: flex;
    align-items: center;
    gap: 0.45rem;
    margin-bottom: 1rem;
`;

const CrewAvatar = styled.img`
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${({ theme }) => theme.surfaceCard};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.border};
`;

const MissionOutcome = styled.div`
    background: ${({ theme }) => theme.surfaceHover};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 12px;
    color: ${({ theme }) => theme.text};
    line-height: 1.6;
    padding: 1rem;
    margin-bottom: 1rem;
`;

const MissionActions = styled.div`
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    flex-wrap: wrap;
`;

function statusLabel(status: string, lang: "pt" | "en") {
    if (status === "Alive") return lang === "pt" ? "Vivo" : "Alive";
    if (status === "Dead") return lang === "pt" ? "Morto" : "Dead";
    return lang === "pt" ? "Desconhecido" : "Unknown";
}

export function SquadPage() {
    const { squad, removeFromSquad, clearSquad } = useSquad();
    const { lang } = useLanguage();
    const navigate = useNavigate();
    const [mission, setMission] = useState<ReturnType<
        typeof getRandomMission
    > | null>(null);
    const [showMission, setShowMission] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState<
        (typeof squad)[number] | null
    >(null);

    const score = calcSurvivalScore(squad);
    const aliveCount = squad.filter((c) => c.status === "Alive").length;
    const deadCount = squad.filter((c) => c.status === "Dead").length;
    const unknownCount = squad.filter((c) => c.status === "unknown").length;
    const uniqueSpecies = new Set(squad.map((c) => c.species)).size;
    const totalEpisodes = new Set(squad.flatMap((c) => c.episode)).size;
    const alivePercent = squad.length ? (aliveCount / squad.length) * 100 : 0;
    const deadPercent = squad.length ? (deadCount / squad.length) * 100 : 0;
    const unknownPercent = squad.length
        ? (unknownCount / squad.length) * 100
        : 0;

    const bestCandidate = useMemo(() => {
        return [...squad].sort(
            (a, b) => b.episode.length - a.episode.length,
        )[0];
    }, [squad]);

    const weakLink = useMemo(() => {
        return [...squad].sort((a, b) => {
            const aPenalty = a.status === "Dead" ? -1000 : a.episode.length;
            const bPenalty = b.status === "Dead" ? -1000 : b.episode.length;
            return aPenalty - bPenalty;
        })[0];
    }, [squad]);

    const riskLabel =
        lang === "pt"
            ? score >= 70
                ? "Baixo risco"
                : score >= 40
                  ? "Risco instável"
                  : "Risco crítico"
            : score >= 70
              ? "Low risk"
              : score >= 40
                ? "Unstable risk"
                : "Critical risk";

    const scoreLabel =
        lang === "pt"
            ? score >= 70
                ? "Equipe pronta para atravessar uma fenda dimensional."
                : score >= 40
                  ? "Equipe funcional, mas Rick levaria um plano B."
                  : "Equipe caótica. Excelente para drama, péssima para sobrevivência."
            : score >= 70
              ? "Ready to cross a dimensional rift."
              : score >= 40
                ? "Usable squad, but Rick would bring a backup plan."
                : "Chaotic squad. Great for drama, terrible for survival.";

    const rickAnalysis =
        squad.length > 0 ? getRickAnalysis(squad, lang as "pt" | "en") : "";

    const startMission = () => {
        setMission(
            getRandomMission(
                lang as "pt" | "en",
                mission?.planet ?? null,
                squad,
            ),
        );
        setShowMission(true);
    };

    const newMission = () => {
        setMission(
            getRandomMission(
                lang as "pt" | "en",
                mission?.planet ?? null,
                squad,
            ),
        );
    };

    if (squad.length === 0) {
        return (
            <Page
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <EmptyState>
                    <EmptyLead>
                        <EmptyCounter>0/5</EmptyCounter>
                        <IntroEyebrow>
                            {lang === "pt" ? "Arquivo vazio" : "Empty file"}
                        </IntroEyebrow>
                        <IntroTitle>
                            {lang === "pt" ? "Meu Esquadrão" : "My Squad"}
                        </IntroTitle>
                        <IntroSubtitle>
                            {lang === "pt"
                                ? "Nenhum recruta foi selecionado. Escolha personagens para liberar análise, risco dimensional e simulação de missão."
                                : "No recruits selected yet. Choose characters to unlock analysis, dimensional risk and mission simulation."}
                        </IntroSubtitle>
                        <Button
                            $variant="primary"
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate("/characters")}
                        >
                            {lang === "pt"
                                ? "Escolher personagens"
                                : "Choose characters"}
                        </Button>
                    </EmptyLead>
                    <EmptyPreview aria-hidden="true">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <EmptySlot key={index}>
                                {lang === "pt"
                                    ? `Vaga ${index + 1}`
                                    : `Slot ${index + 1}`}
                            </EmptySlot>
                        ))}
                    </EmptyPreview>
                </EmptyState>
            </Page>
        );
    }

    return (
        <>
            <Page
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
            >
                <PageIntro
                    eyebrow={lang === "pt" ? "Arquivo C-137" : "C-137 File"}
                    title={lang === "pt" ? "Meu Esquadrão" : "My Squad"}
                    subtitle={
                        lang === "pt"
                            ? "Análise de sobrevivência, risco dimensional e simulação de missão para os personagens selecionados."
                            : "Survival analysis, dimensional risk and mission simulation for the selected characters."
                    }
                    actions={
                        <>
                            <Button
                                $variant="secondary"
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate("/characters")}
                            >
                                {lang === "pt" ? "Editar equipe" : "Edit squad"}
                            </Button>
                            <Button
                                $variant="danger"
                                whileTap={{ scale: 0.97 }}
                                onClick={clearSquad}
                            >
                                {lang === "pt" ? "Limpar" : "Clear"}
                            </Button>
                        </>
                    }
                />

                <DashboardGrid>
                    <HeroPanel>
                        <ScoreRing $score={score}>
                            <ScoreValue $score={score}>{score}%</ScoreValue>
                        </ScoreRing>
                        <div>
                            <PanelTitle>
                                {lang === "pt"
                                    ? "Prontidão dimensional"
                                    : "Dimensional readiness"}
                            </PanelTitle>
                            <SummaryTitle>{riskLabel}</SummaryTitle>
                            <SummaryText>{scoreLabel}</SummaryText>
                            <StatGrid>
                                <StatCard>
                                    <StatValue>{squad.length}/5</StatValue>
                                    <StatLabel>
                                        {lang === "pt" ? "Membros" : "Members"}
                                    </StatLabel>
                                </StatCard>
                                <StatCard>
                                    <StatValue>{aliveCount}</StatValue>
                                    <StatLabel>
                                        {lang === "pt" ? "Vivos" : "Alive"}
                                    </StatLabel>
                                </StatCard>
                                <StatCard>
                                    <StatValue>{uniqueSpecies}</StatValue>
                                    <StatLabel>
                                        {lang === "pt" ? "Espécies" : "Species"}
                                    </StatLabel>
                                </StatCard>
                                <StatCard>
                                    <StatValue>{totalEpisodes}</StatValue>
                                    <StatLabel>
                                        {lang === "pt"
                                            ? "Episódios"
                                            : "Episodes"}
                                    </StatLabel>
                                </StatCard>
                            </StatGrid>
                        </div>
                    </HeroPanel>

                    <AnalysisPanel>
                        <PanelTitle>
                            {lang === "pt"
                                ? "Diagnóstico do Rick"
                                : "Rick's diagnosis"}
                        </PanelTitle>
                        <DiagnosisText>"{rickAnalysis}"</DiagnosisText>
                    </AnalysisPanel>
                </DashboardGrid>

                <MembersPanel>
                    <MembersTitle>
                        {lang === "pt"
                            ? "Membros recrutados"
                            : "Recruited members"}
                    </MembersTitle>
                    <MembersStats>
                        <SignalCard>
                            <SignalLabel>
                                {lang === "pt" ? "Melhor ativo" : "Best asset"}
                            </SignalLabel>
                            <SignalValue>{bestCandidate?.name}</SignalValue>
                        </SignalCard>
                        <SignalCard>
                            <SignalLabel>
                                {lang === "pt" ? "Ponto fraco" : "Weak link"}
                            </SignalLabel>
                            <SignalValue>{weakLink?.name}</SignalValue>
                        </SignalCard>
                        <SignalCard>
                            <SignalLabel>
                                {lang === "pt" ? "Mortos" : "Dead"}
                            </SignalLabel>
                            <SignalValue>{deadCount}</SignalValue>
                        </SignalCard>
                        <SignalCard>
                            <SignalLabel>
                                {lang === "pt" ? "Desconhecidos" : "Unknown"}
                            </SignalLabel>
                            <SignalValue>{unknownCount}</SignalValue>
                        </SignalCard>
                    </MembersStats>
                    <MembersGridArea>
                        <CharacterGrid>
                            {squad.map((character, index) => (
                                <CharacterCard
                                    key={character.id}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <CharacterPreviewArea
                                        role="button"
                                        tabIndex={0}
                                        aria-label={
                                            lang === "pt"
                                                ? `Ver detalhes de ${character.name}`
                                                : `View details for ${character.name}`
                                        }
                                        onClick={() =>
                                            setSelectedCharacter(character)
                                        }
                                        onKeyDown={(event) => {
                                            if (
                                                event.key === "Enter" ||
                                                event.key === " "
                                            ) {
                                                event.preventDefault();
                                                setSelectedCharacter(character);
                                            }
                                        }}
                                    >
                                        <CharacterImage
                                            src={character.image}
                                            alt={character.name}
                                            loading="lazy"
                                        />
                                        <CharacterInfo>
                                            <CharacterName
                                                title={character.name}
                                            >
                                                {character.name}
                                            </CharacterName>
                                            <CharacterMeta>
                                                <StatusDot
                                                    $status={character.status}
                                                />
                                                {statusLabel(
                                                    character.status,
                                                    lang as "pt" | "en",
                                                )}
                                            </CharacterMeta>
                                            <CharacterMeta>
                                                {translateSpecies(
                                                    character.species,
                                                    lang,
                                                )}
                                            </CharacterMeta>
                                            <CharacterMeta>
                                                {character.episode.length}{" "}
                                                {lang === "pt"
                                                    ? "episódios registrados"
                                                    : "registered episodes"}
                                            </CharacterMeta>
                                        </CharacterInfo>
                                    </CharacterPreviewArea>
                                    <CharacterInfo>
                                        <RemoveButton
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                removeFromSquad(character.id);
                                            }}
                                            aria-label={`Remover ${character.name}`}
                                        >
                                            {lang === "pt"
                                                ? "Remover"
                                                : "Remove"}
                                        </RemoveButton>
                                    </CharacterInfo>
                                </CharacterCard>
                            ))}
                            {Array.from({ length: Math.max(0, 5 - squad.length) }).map((_, idx) => (
                                <EmptySlotCard
                                    key={`empty-${idx}`}
                                    onClick={() => navigate("/characters")}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            navigate("/characters");
                                        }
                                    }}
                                >
                                    <PlusIcon>+</PlusIcon>
                                    <EmptySlotText>{lang === "pt" ? "Adicionar" : "Add"}</EmptySlotText>
                                </EmptySlotCard>
                            ))}
                        </CharacterGrid>
                    </MembersGridArea>

                    <MembersFooter>
                        <MembersFooterLead>
                            <MembersFooterTitle>
                                {lang === "pt"
                                    ? "Leitura rápida da formação"
                                    : "Quick formation readout"}
                            </MembersFooterTitle>
                            <MembersFooterText>
                                {lang === "pt"
                                    ? `Esquadrão com ${aliveCount} integrante(s) vivos, ${uniqueSpecies} espécie(s) distintas e cobertura de ${totalEpisodes} episódio(s). Um perfil ${riskLabel.toLowerCase()} para incursões interdimensionais.`
                                    : `Squad with ${aliveCount} living member(s), ${uniqueSpecies} distinct species and coverage across ${totalEpisodes} episode(s). A ${riskLabel.toLowerCase()} profile for interdimensional incursions.`}
                            </MembersFooterText>
                            <MembersInsights>
                                <InsightChip>
                                    {lang === "pt"
                                        ? `Lotação: ${squad.length}/5`
                                        : `Capacity: ${squad.length}/5`}
                                </InsightChip>
                                <InsightChip>
                                    {lang === "pt"
                                        ? `Prontidão: ${score}%`
                                        : `Readiness: ${score}%`}
                                </InsightChip>
                                <InsightChip>
                                    {lang === "pt"
                                        ? `Espécies: ${uniqueSpecies}`
                                        : `Species: ${uniqueSpecies}`}
                                </InsightChip>
                            </MembersInsights>
                        </MembersFooterLead>

                        <MembersFooterAside>
                            <CrewAvatars
                                aria-label={
                                    lang === "pt"
                                        ? "Formação atual"
                                        : "Current formation"
                                }
                            >
                                {squad.map((character) => (
                                    <CrewMiniAvatar
                                        key={`mini-${character.id}`}
                                        src={character.image}
                                        alt={character.name}
                                        title={character.name}
                                    />
                                ))}
                            </CrewAvatars>
                            <SurvivalBar
                                aria-label={
                                    lang === "pt"
                                        ? "Distribuição de sobrevivência"
                                        : "Survival distribution"
                                }
                            >
                                <SurvivalSegment
                                    $tone="alive"
                                    $width={alivePercent}
                                />
                                <SurvivalSegment
                                    $tone="dead"
                                    $width={deadPercent}
                                />
                                <SurvivalSegment
                                    $tone="unknown"
                                    $width={unknownPercent}
                                />
                            </SurvivalBar>
                        </MembersFooterAside>
                    </MembersFooter>
                </MembersPanel>

                <MissionPanel>
                    <div>
                        <PanelTitle>
                            {lang === "pt"
                                ? "Simulador de missão"
                                : "Mission simulator"}
                        </PanelTitle>
                        <MissionPreview>
                            {lang === "pt"
                                ? "Gere uma missão interdimensional e veja como o esquadrão provavelmente sairia dela."
                                : "Generate an interdimensional mission and see how the squad would probably handle it."}
                        </MissionPreview>
                    </div>
                    <Button
                        $variant="primary"
                        whileTap={{ scale: 0.97 }}
                        onClick={startMission}
                    >
                        {lang === "pt" ? "Gerar missão" : "Generate mission"}
                    </Button>
                </MissionPanel>
            </Page>

            <CharacterSpotlightModal
                character={selectedCharacter}
                onClose={() => setSelectedCharacter(null)}
                allowRemove
            />

            <AnimatePresence>
                {showMission && mission && (
                    <ModalOverlay
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowMission(false)}
                    >
                        <MissionModal
                            initial={{ scale: 0.94, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.94, opacity: 0 }}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <MissionHeader>
                                <div>
                                    <MissionTag>
                                        {lang === "pt"
                                            ? "Missão ativa"
                                            : "Active mission"}
                                    </MissionTag>
                                    <MissionPlanet>
                                        {mission.planet}
                                    </MissionPlanet>
                                    <MissionObjective>
                                        {mission.objective}
                                    </MissionObjective>
                                </div>
                                <MissionRiskBadge $score={score}>
                                    {score}%{" "}
                                    {lang === "pt"
                                        ? "sobrevivência"
                                        : "survival"}
                                </MissionRiskBadge>
                            </MissionHeader>
                            <MissionCrew
                                aria-label={
                                    lang === "pt"
                                        ? "Equipe enviada"
                                        : "Assigned squad"
                                }
                            >
                                {squad.map((character) => (
                                    <CrewAvatar
                                        key={character.id}
                                        src={character.image}
                                        alt={character.name}
                                        title={character.name}
                                    />
                                ))}
                            </MissionCrew>
                            <MissionIntelGrid>
                                <MissionIntelCard>
                                    <MissionIntelLabel>
                                        {lang === "pt" ? "Risco" : "Risk"}
                                    </MissionIntelLabel>
                                    <MissionIntelValue>
                                        {riskLabel}
                                    </MissionIntelValue>
                                </MissionIntelCard>
                                <MissionIntelCard>
                                    <MissionIntelLabel>
                                        {lang === "pt"
                                            ? "Ativo principal"
                                            : "Primary asset"}
                                    </MissionIntelLabel>
                                    <MissionIntelValue>
                                        {bestCandidate?.name}
                                    </MissionIntelValue>
                                </MissionIntelCard>
                                <MissionIntelCard>
                                    <MissionIntelLabel>
                                        {lang === "pt"
                                            ? "Risco humano"
                                            : "Human risk"}
                                    </MissionIntelLabel>
                                    <MissionIntelValue>
                                        {weakLink?.name}
                                    </MissionIntelValue>
                                </MissionIntelCard>
                            </MissionIntelGrid>
                            <MissionOutcome>
                                <strong>
                                    {lang === "pt"
                                        ? "Resultado provável: "
                                        : "Likely outcome: "}
                                </strong>
                                {mission.outcome}
                            </MissionOutcome>
                            <MissionActions>
                                <Button
                                    $variant="secondary"
                                    onClick={() => setShowMission(false)}
                                >
                                    {lang === "pt" ? "Fechar" : "Close"}
                                </Button>
                                <Button $variant="primary" onClick={newMission}>
                                    {lang === "pt"
                                        ? "Nova missão"
                                        : "New mission"}
                                </Button>
                            </MissionActions>
                        </MissionModal>
                    </ModalOverlay>
                )}
            </AnimatePresence>
        </>
    );
}
