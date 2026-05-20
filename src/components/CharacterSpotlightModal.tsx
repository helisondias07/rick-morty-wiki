import React from "react";
import styled from "styled-components";
import { Character } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { useSquad } from "../hooks/useSquad";
import { Modal } from "./Modal";
import {
    translateGender,
    translateLocationName,
    translateSpecies,
    translateStatus,
} from "../utils/translate";

const Layout = styled.div`
    display: grid;
    grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
    gap: 1.25rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 0.6rem;
    }
`;

const PortraitCard = styled.div`
    background: ${({ theme }) => theme.surfaceHover};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 18px;
    overflow: hidden;

    @media (max-width: 768px) {
        width: min(100%, 180px);
        margin: 0 auto;
        border-radius: 14px;
    }

    @media (max-width: 480px) {
        width: min(100%, 140px);
    }
`;

const Portrait = styled.img.attrs({
    decoding: "async",
})`
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: contain;
    background:
        radial-gradient(
            circle at top center,
            rgba(151, 206, 76, 0.12),
            transparent 56%
        ),
        linear-gradient(180deg, rgba(8, 186, 227, 0.08), transparent 42%),
        ${({ theme }) => theme.surfaceCard};
    padding: 0.75rem;

    @media (max-width: 768px) {
        padding: 0.5rem;
    }
`;

const PortraitMeta = styled.div`
    padding: 0.85rem 1rem 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    @media (max-width: 768px) {
        padding: 0.7rem 0.75rem 0.8rem;
        gap: 0.4rem;
    }
`;

const Chip = styled.span<{ $tone?: "alive" | "dead" | "unknown" | "accent" }>`
    display: inline-flex;
    align-items: center;
    gap: 0.38rem;
    padding: 0.4rem 0.68rem;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 800;
    border: 1px solid
        ${({ $tone, theme }) =>
            $tone === "alive"
                ? "rgba(151, 206, 76, 0.38)"
                : $tone === "dead"
                  ? "rgba(224, 90, 71, 0.35)"
                  : $tone === "unknown"
                    ? "rgba(136, 136, 136, 0.35)"
                    : theme.border};
    background: ${({ $tone, theme }) =>
        $tone === "alive"
            ? "rgba(151, 206, 76, 0.12)"
            : $tone === "dead"
              ? "rgba(224, 90, 71, 0.12)"
              : $tone === "unknown"
                ? "rgba(136, 136, 136, 0.12)"
                : theme.surfaceCard};
    color: ${({ $tone, theme }) =>
        $tone === "alive"
            ? theme.primaryDeep
            : $tone === "dead"
              ? theme.statusDead
              : $tone === "unknown"
                ? theme.textMuted
                : theme.text};

    @media (max-width: 768px) {
        padding: 0.32rem 0.55rem;
        font-size: 0.66rem;
    }
`;

const DetailPanel = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (max-width: 768px) {
        gap: 0.6rem;
    }
`;

const Identity = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
`;

const Name = styled.h3`
    margin: 0;
    color: ${({ theme }) => theme.text};
    font-size: clamp(1.4rem, 3vw, 2rem);
    line-height: 1.08;

    @media (max-width: 768px) {
        font-size: 1.45rem;
    }

    @media (max-width: 480px) {
        font-size: 1.2rem;
    }
`;

const Origin = styled.p`
    color: ${({ theme }) => theme.textMuted};
    font-size: 0.95rem;
    line-height: 1.5;

    @media (max-width: 768px) {
        font-size: 0.88rem;
    }
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;

    @media (max-width: 768px) {
        gap: 0.5rem;
    }

    @media (max-width: 520px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.4rem;
    }
`;

const StatCard = styled.div`
    border-radius: 14px;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.surfaceHover};
    padding: 0.8rem 0.9rem;

    @media (max-width: 768px) {
        border-radius: 10px;
        padding: 0.5rem 0.6rem;
    }
`;

const StatLabel = styled.div`
    color: ${({ theme }) => theme.textMuted};
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 0.3rem;

    @media (max-width: 768px) {
        font-size: 0.64rem;
    }
`;

const StatValue = styled.div`
    color: ${({ theme }) => theme.text};
    font-size: 0.96rem;
    font-weight: 700;
    line-height: 1.35;
    word-break: break-word;

    @media (max-width: 768px) {
        font-size: 0.9rem;
    }
`;

const FlavorText = styled.p`
    color: ${({ theme }) => theme.textSecondary};
    line-height: 1.6;
    font-size: 0.92rem;

    @media (max-width: 768px) {
        font-size: 0.86rem;
    }

    /* Esconde em telas pequenas para evitar scroll no modal */
    @media (max-width: 480px) {
        display: none;
    }
`;

const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding-top: 0.25rem;

    @media (max-width: 768px) {
        gap: 0.6rem;
    }

    @media (max-width: 520px) {
        flex-direction: column;
    }
`;

const ActionButton = styled.button<{
    $variant?: "primary" | "secondary" | "danger";
    $disabled?: boolean;
}>`
    min-height: 44px;
    padding: 0.75rem 1rem;
    min-width: 180px;
    border-radius: 12px;
    border: 1px solid
        ${({ theme, $variant }) =>
            $variant === "danger"
                ? "rgba(224, 90, 71, 0.35)"
                : $variant === "primary"
                  ? theme.primary
                  : theme.border};
    background: ${({ theme, $variant }) =>
        $variant === "danger"
            ? "rgba(224, 90, 71, 0.12)"
            : $variant === "primary"
              ? theme.primary
              : theme.surfaceHover};
    color: ${({ theme, $variant }) =>
        $variant === "danger"
            ? theme.statusDead
            : $variant === "primary"
              ? "#0d0d14"
              : theme.text};
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

    &:disabled {
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        min-width: 150px;
        padding: 0.68rem 0.85rem;
        font-size: 0.72rem;
    }

    @media (max-width: 520px) {
        width: 100%;
        min-width: 0;
    }
`;

interface CharacterSpotlightModalProps {
    character: Character | null;
    onClose: () => void;
    allowRemove?: boolean;
}

function getStatusTone(
    status: Character["status"],
): "alive" | "dead" | "unknown" {
    if (status === "Alive") return "alive";
    if (status === "Dead") return "dead";
    return "unknown";
}

export function CharacterSpotlightModal({
    character,
    onClose,
    allowRemove = false,
}: CharacterSpotlightModalProps) {
    const { lang } = useLanguage();
    const { addToSquad, removeFromSquad, isInSquad, isFull } = useSquad();

    if (!character) {
        return null;
    }

    const inSquad = isInSquad(character.id);
    const disableAdd = allowRemove ? !inSquad && isFull : inSquad || isFull;
    const title =
        lang === "pt"
            ? `Destaque do arquivo: ${character.name}`
            : `Profile spotlight: ${character.name}`;

    const handlePrimaryAction = () => {
        if (allowRemove && inSquad) {
            removeFromSquad(character.id);
            onClose();
            return;
        }

        if (!inSquad && !isFull) {
            addToSquad(character);
        }
    };

    return (
        <Modal isOpen={!!character} onClose={onClose} title={title}>
            <Layout>
                <PortraitCard>
                    <Portrait src={character.image} alt={character.name} />
                    <PortraitMeta>
                        <Chip $tone={getStatusTone(character.status)}>
                            {translateStatus(character.status, lang)}
                        </Chip>
                        <Chip $tone="accent">
                            {translateSpecies(character.species, lang)}
                        </Chip>
                        <Chip $tone="accent">
                            {translateGender(character.gender, lang)}
                        </Chip>
                    </PortraitMeta>
                </PortraitCard>

                <DetailPanel>
                    <Identity>
                        <Name>{character.name}</Name>
                        <Origin>
                            {lang === "pt"
                                ? `Último sinal conhecido em ${translateLocationName(character.location.name, lang)}.`
                                : `Last known signal near ${translateLocationName(character.location.name, lang)}.`}
                        </Origin>
                    </Identity>

                    <StatsGrid>
                        <StatCard>
                            <StatLabel>
                                {lang === "pt" ? "Origem" : "Origin"}
                            </StatLabel>
                            <StatValue>
                                {translateLocationName(
                                    character.origin.name,
                                    lang,
                                )}
                            </StatValue>
                        </StatCard>
                        <StatCard>
                            <StatLabel>
                                {lang === "pt" ? "Localização" : "Location"}
                            </StatLabel>
                            <StatValue>
                                {translateLocationName(
                                    character.location.name,
                                    lang,
                                )}
                            </StatValue>
                        </StatCard>
                        <StatCard>
                            <StatLabel>
                                {lang === "pt" ? "Tipo" : "Type"}
                            </StatLabel>
                            <StatValue>
                                {character.type ||
                                    (lang === "pt"
                                        ? "Não especificado"
                                        : "Not specified")}
                            </StatValue>
                        </StatCard>
                        <StatCard>
                            <StatLabel>
                                {lang === "pt"
                                    ? "Registros de episódios"
                                    : "Episode records"}
                            </StatLabel>
                            <StatValue>
                                {character.episode.length}{" "}
                                {lang === "pt" ? "episódio(s)" : "episode(s)"}
                            </StatValue>
                        </StatCard>
                    </StatsGrid>

                    <FlavorText>
                        {lang === "pt"
                            ? `${character.name} está catalogado como ${translateSpecies(character.species, lang).toLowerCase()} com status ${translateStatus(character.status, lang).toLowerCase()}. Use este painel para inspecionar o perfil sem perder o contexto da página.`
                            : `${character.name} is catalogued as ${translateSpecies(character.species, lang).toLowerCase()} with ${translateStatus(character.status, lang).toLowerCase()} status. Use this panel to inspect the profile without losing page context.`}
                    </FlavorText>

                    <Footer>
                        <ActionButton onClick={onClose} $variant="secondary">
                            {lang === "pt" ? "Fechar" : "Close"}
                        </ActionButton>
                        <ActionButton
                            onClick={handlePrimaryAction}
                            $variant={
                                allowRemove && inSquad ? "danger" : "primary"
                            }
                            $disabled={disableAdd}
                            disabled={disableAdd}
                        >
                            {allowRemove && inSquad
                                ? lang === "pt"
                                    ? "Remover do esquadrão"
                                    : "Remove from squad"
                                : inSquad
                                  ? lang === "pt"
                                      ? "Já no esquadrão"
                                      : "Already in squad"
                                  : isFull
                                    ? lang === "pt"
                                        ? "Esquadrão completo"
                                        : "Squad full"
                                    : lang === "pt"
                                      ? "Adicionar ao esquadrão"
                                      : "Add to squad"}
                        </ActionButton>
                    </Footer>
                </DetailPanel>
            </Layout>
        </Modal>
    );
}
