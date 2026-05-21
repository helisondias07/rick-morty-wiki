import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { Character } from "../types";
import { StatusBadge } from "./StatusBadge";
import { useSquad } from "../hooks/useSquad";
import { useLanguage } from "../context/LanguageContext";
import { translateSpecies, translateLocationName } from "../utils/translate";

const CardWrapper = styled(motion.article)<{ $interactive: boolean }>`
    background: ${({ theme }) => theme.surfaceCard};
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.border};
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: ${({ theme }) => theme.cardShadow};
    transition:
        background-color var(--theme-transition-duration, 0.8s) ease,
        border-color 0.25s ease,
        box-shadow 0.25s ease,
        transform 0.25s ease;
    cursor: ${({ $interactive }) => ($interactive ? "pointer" : "default")};

    &:hover {
        border-color: rgba(151, 206, 76, 0.5);
        box-shadow: 0 0 16px rgba(151, 206, 76, 0.2);
        transform: translateY(-4px);
    }

    @media (max-width: 480px) {
        border-radius: 12px;
    }
`;

const Image = styled.img.attrs({
    decoding: "async",
})`
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    transition: transform 0.4s ease;

    ${CardWrapper}:hover & {
        transform: scale(1.04);
    }
`;

const ImageWrapper = styled.div`
    overflow: hidden;
`;

const Info = styled.div`
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;

    @media (max-width: 480px) {
        padding: 0.8rem;
        gap: 0.35rem;
    }
`;

const Name = styled.h3`
    font-size: 1.05rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 480px) {
        font-size: 0.86rem;
        line-height: 1.2;
    }
`;

const Species = styled.span`
    font-size: 0.8rem;
    color: ${({ theme }) => theme.textMuted};

    @media (max-width: 480px) {
        font-size: 0.7rem;
    }
`;

const Location = styled.span`
    font-size: 0.78rem;
    color: ${({ theme }) => theme.textSecondary};
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (max-width: 480px) {
        font-size: 0.68rem;
    }
`;

const AddButton = styled.button<{ $inSquad: boolean; $disabled: boolean }>`
    margin-top: auto; /* Empurra pro fundo */
    padding: 0.72rem 0.7rem;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 800;
    width: 100%;
    min-height: 44px;
    line-height: 1.15;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    cursor: pointer;

    svg {
        flex: 0 0 auto;
        width: 16px;
        height: 16px;
        transition: transform 0.3s ease;
    }

    @media (max-width: 480px) {
        padding: 0.58rem 0.45rem;
        border-radius: 8px;
        font-size: 0.58rem;
        min-height: 38px;
        gap: 0.25rem;

        svg {
            width: 14px;
            height: 14px;
        }
    }

    ${({ $inSquad, $disabled, theme }) => {
        if ($inSquad) {
            return `
        background: #97ce4c;
        color: #0d0d14;
        border: 2px solid #97ce4c;
        box-shadow: 0 4px 15px rgba(151, 206, 76, 0.35);
        cursor: default;

        svg { transform: scale(1.1); }
      `;
        }

        if ($disabled) {
            return `
        background: ${theme.background === "#0d0d14" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"};
        color: ${theme.textMuted};
        border: 2px dashed ${theme.border};
        cursor: not-allowed;
      `;
        }

        // Estado padrão (Pronto para adicionar)
        return `
      background: transparent;
      color: ${theme.text};
      border: 2px solid ${theme.border};

      &:hover {
        background: rgba(151, 206, 76, 0.1);
        border-color: #97ce4c;
        color: #97ce4c;
        box-shadow: 0 4px 15px rgba(151, 206, 76, 0.15);

        svg { transform: rotate(90deg); }
      }
    `;
    }}
`;

const FALLBACK_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none"><rect width="300" height="300" fill="%231a1a24"/><circle cx="150" cy="110" r="50" fill="%2397ce4c" opacity="0.3"/><path d="M70 240C70 190 110 170 150 170C190 170 230 190 230 240" stroke="%2397ce4c" stroke-width="8" stroke-linecap="round" opacity="0.3"/><circle cx="150" cy="150" r="130" stroke="%2397ce4c" stroke-width="4" stroke-dasharray="8 8" opacity="0.2"/></svg>`;

interface Props {
    character: Character;
    onPreview?: (character: Character) => void;
}

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: "easeOut" },
    },
} as const;

export const CharacterCard = React.memo(function CharacterCard({
    character,
    onPreview,
}: Props) {
    const { addToSquad, isInSquad, isFull } = useSquad();
    const { t, lang } = useLanguage();
    const inSquad = isInSquad(character.id);
    const disabled = inSquad || isFull;
    const [failedImage, setFailedImage] = React.useState<string | null>(null);
    const [shouldLoadImage, setShouldLoadImage] = React.useState(false);
    const imageWrapperRef = React.useRef<HTMLDivElement | null>(null);
    const imgSrc =
        shouldLoadImage && failedImage !== character.image
            ? character.image
            : FALLBACK_IMAGE;
    const isPreviewable = typeof onPreview === "function";

    React.useEffect(() => {
        if (character.id <= 20) {
            setShouldLoadImage(true);
            return;
        }

        if (typeof IntersectionObserver === "undefined") {
            setShouldLoadImage(true);
            return;
        }

        const node = imageWrapperRef.current;
        if (!node) return;
        let timeoutId: number | undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (timeoutId) return;
                    const delay = (character.id % 5) * 60;
                    timeoutId = window.setTimeout(
                        () => {
                            setShouldLoadImage(true);
                            observer.disconnect();
                        },
                        delay,
                    );
                    return;
                }

                if (timeoutId) {
                    window.clearTimeout(timeoutId);
                    timeoutId = undefined;
                }
            },
            { rootMargin: "600px" },
        );

        observer.observe(node);
        return () => {
            observer.disconnect();
            if (timeoutId) window.clearTimeout(timeoutId);
        };
    }, [character.id]);

    const handlePreview = () => {
        onPreview?.(character);
    };

    const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (!isPreviewable) return;
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handlePreview();
        }
    };

    const getBtnContent = () => {
        if (inSquad) {
            return (
                <>
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {lang === "pt" ? "No Esquadrão" : "In Squad"}
                </>
            );
        }
        if (isFull) {
            return (
                <>
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                        ></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    {t("squad_full")}
                </>
            );
        }
        return (
            <>
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                {t("add_squad")}
            </>
        );
    };

    return (
        <CardWrapper
            variants={cardVariants}
            $interactive={isPreviewable}
            onClick={isPreviewable ? handlePreview : undefined}
            onKeyDown={handleCardKeyDown}
            role={isPreviewable ? "button" : undefined}
            tabIndex={isPreviewable ? 0 : undefined}
            aria-label={
                isPreviewable
                    ? lang === "pt"
                        ? `Ver detalhes de ${character.name}`
                        : `View details for ${character.name}`
                    : undefined
            }
        >
            <ImageWrapper ref={imageWrapperRef}>
                <Image
                    src={imgSrc}
                    alt={character.name}
                    loading="lazy"
                    onError={() => setFailedImage(character.image)}
                />
            </ImageWrapper>
            <Info>
                <Name title={character.name}>{character.name}</Name>
                <StatusBadge status={character.status} />
                <Species>{translateSpecies(character.species, lang)}</Species>
                <Location>
                    Local:{" "}
                    {translateLocationName(character.location.name, lang)}
                </Location>
                <AddButton
                    $inSquad={inSquad}
                    $disabled={disabled}
                    onClick={(event) => {
                        event.stopPropagation();
                        if (!disabled) addToSquad(character);
                    }}
                    aria-label={
                        inSquad
                            ? "Personagem já no esquadrão"
                            : "Adicionar ao esquadrão"
                    }
                >
                    {getBtnContent()}
                </AddButton>
            </Info>
        </CardWrapper>
    );
});

CharacterCard.displayName = "CharacterCard";
