import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { useLanguage } from "../context/LanguageContext";

type MainCharacterKey = "rick" | "morty" | "summer" | "beth" | "jerry";
type InteractionTone = "neutral" | "warning" | "relief";

interface SquadInteractionDetail {
    speaker: MainCharacterKey;
    tone?: InteractionTone;
    quote: {
        pt: string;
        en: string;
    };
}

const SPEAKERS: Record<MainCharacterKey, { name: string; image: string }> = {
    rick: {
        name: "Rick Sanchez",
        image: "/icons8-rick-e-morty-100.png",
    },
    morty: {
        name: "Morty Smith",
        image: "/icons8-rick-e-morty-100 (1).png",
    },
    summer: {
        name: "Summer Smith",
        image: "/icons8-ferreiro-de-verão-100.png",
    },
    beth: {
        name: "Beth Smith",
        image: "/icons8-beth-smith-100.png",
    },
    jerry: {
        name: "Jerry Smith",
        image: "/icons8-jerry-smith-100.png",
    },
};

const BubbleStage = styled(motion.aside)`
    position: fixed;
    right: 1.25rem;
    bottom: 5.75rem;
    z-index: 700;
    display: flex;
    align-items: flex-end;
    gap: 0.75rem;
    max-width: min(460px, calc(100vw - 2rem));
    pointer-events: none;

    @media (max-width: 768px) {
        left: 1rem;
        right: 1rem;
        bottom: 5rem;
        max-width: none;
    }
`;

const SpeakerAvatar = styled.img.attrs({
    decoding: "async",
})<{ $tone?: InteractionTone }>`
    flex: 0 0 auto;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: ${({ theme }) => theme.surfaceCard};
    border: 2px solid
        ${({ theme, $tone }) =>
            $tone === "warning"
                ? theme.statusDead
                : $tone === "relief"
                  ? theme.primary
                  : theme.border};
    box-shadow: ${({ theme }) => theme.cardShadow};
    object-fit: cover;

    @media (max-width: 520px) {
        width: 44px;
        height: 44px;
    }
`;

const SpeechBubble = styled.div`
    position: relative;
    background: ${({ theme }) => theme.surfaceCard};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 16px;
    box-shadow: ${({ theme }) => theme.cardShadowHover};
    padding: 0.95rem 1.05rem;

    &::after {
        content: "";
        position: absolute;
        left: -9px;
        bottom: 16px;
        width: 18px;
        height: 18px;
        background: ${({ theme }) => theme.surfaceCard};
        border-left: 1px solid ${({ theme }) => theme.border};
        border-bottom: 1px solid ${({ theme }) => theme.border};
        transform: rotate(45deg);
    }
`;

const Speaker = styled.div`
    color: ${({ theme }) => theme.primaryDeep};
    font-size: 0.68rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 0.35rem;
`;

const Quote = styled.p`
    font-size: 0.94rem;
    font-weight: 850;
    line-height: 1.42;
`;

export function RickJerryWarning() {
    const { lang } = useLanguage();
    const [interaction, setInteraction] =
        React.useState<SquadInteractionDetail | null>(null);

    React.useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const showInteraction = (event: Event) => {
            const detail = (event as CustomEvent<SquadInteractionDetail>)
                .detail;
            if (!detail?.speaker || !detail.quote) return;

            setInteraction(detail);
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setInteraction(null), 5200);
        };

        window.addEventListener("squad-character-interaction", showInteraction);

        return () => {
            window.removeEventListener(
                "squad-character-interaction",
                showInteraction,
            );
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    const speaker = interaction ? SPEAKERS[interaction.speaker] : null;

    return (
        <AnimatePresence>
            {interaction && speaker && (
                <BubbleStage
                    role="status"
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{ duration: 0.22 }}
                >
                    <SpeakerAvatar
                        src={speaker.image}
                        alt=""
                        aria-hidden="true"
                        $tone={interaction.tone}
                    />
                    <SpeechBubble>
                        <Speaker>{speaker.name}</Speaker>
                        <Quote>{interaction.quote[lang]}</Quote>
                    </SpeechBubble>
                </BubbleStage>
            )}
        </AnimatePresence>
    );
}
