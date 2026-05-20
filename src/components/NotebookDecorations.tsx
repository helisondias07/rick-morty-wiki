import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import type { TranslationKeys } from "../i18n/translations";

type NotebookTranslator = (key: TranslationKeys) => string;
type NotebookLanguage = "pt" | "en";

const HandwrittenNote = styled(motion.div)<{
    $top?: string;
    $topMobile?: string;
    $left?: string;
    $leftMobile?: string;
    $right?: string;
    $rightMobile?: string;
    $rotate?: string;
    $rotateMobile?: string;
    $minWidth?: number;
}>`
    position: absolute;
    top: ${({ $top }) => $top || "10%"};
    ${({ $left }) => $left && `left: ${$left};`}
    ${({ $right }) => $right && `right: ${$right};`}
  transform: rotate(${({ $rotate }) => $rotate || "0deg"});
    font-family: "Architects Daughter", "Caveat", cursive;
    font-size: clamp(0.95rem, 2vw, 1.15rem);
    color: #1d3f72; /* Cor de caneta esferográfica azul */
    pointer-events: none;
    max-width: 250px;
    line-height: 1.4;
    z-index: 3;
    opacity: 0.38; /* Mantendo sutil como textura e easter egg */

    /* Esconde a nota em telas menores que o minWidth definido */
    ${({ $minWidth }) =>
        $minWidth &&
        `
    @media (max-width: ${$minWidth}px) {
      display: none;
    }
  `}

    @media (max-width: 768px) {
        font-size: clamp(0.72rem, 2.3vw, 0.85rem);
        opacity: 0.32;
        max-width: 145px;
        top: ${({ $topMobile, $top }) => $topMobile || $top};

        /* Reaplica o alinhamento de forma limpa no mobile */
        ${({ $leftMobile }) =>
            $leftMobile && `left: ${$leftMobile}; right: auto;`}
        ${({ $rightMobile }) =>
            $rightMobile && `right: ${$rightMobile}; left: auto;`}
    transform: rotate(${({ $rotateMobile, $rotate }) =>
            $rotateMobile || $rotate});
    }

    @media (max-width: 360px) {
        font-size: 0.65rem;
        max-width: 50px;
        opacity: 0.45; /* Um pouco mais opaco para manter legível com fonte menor */
    }
`;

const CoffeeStain = styled.div`
    position: absolute;
    bottom: 4%;
    left: 4%;
    width: 170px;
    height: 170px;
    pointer-events: none;
    z-index: 1;
    opacity: 0.16;

    @media (max-width: 768px) {
        display: none;
    }
`;

const GreenSplat = styled.div<{
    $top: string;
    $left?: string;
    $right?: string;
    $size?: string;
    $topMobile?: string;
    $leftMobile?: string;
    $rightMobile?: string;
    $sizeMobile?: string;
}>`
    position: absolute;
    top: ${({ $top }) => $top};
    ${({ $left }) => $left && `left: ${$left};`}
    ${({ $right }) => $right && `right: ${$right};`}
  width: ${({ $size }) => $size || "45px"};
    height: ${({ $size }) => $size || "45px"};
    pointer-events: none;
    z-index: 1;
    opacity: 0.7;
    filter: drop-shadow(0 2px 4px rgba(151, 206, 76, 0.3));

    @media (max-width: 768px) {
        display: none;
    }
`;

interface NoteItem {
    id: string;
    top?: string;
    topMobile?: string;
    left?: string;
    leftMobile?: string;
    right?: string;
    rightMobile?: string;
    rotate?: string;
    rotateMobile?: string;
    color?: string;
    minWidth?: number;
    content: (
        t: NotebookTranslator,
        lang?: NotebookLanguage,
    ) => React.ReactNode;
}

const rickNotes: NoteItem[] = [
    // === LADO ESQUERDO ===
    {
        id: "note-c137",
        top: "16%",
        topMobile: "16%",
        left: "6%",
        leftMobile: "8px",
        rotate: "-3deg",
        rotateMobile: "-2deg",
        minWidth: 300,
        content: (t) => {
            const lines = t("note_c137").split("\n");
            return (
                <>
                    {lines[0]}
                    <br />
                    {lines[1]}
                </>
            );
        },
    },
    {
        id: "note-collapse",
        top: "32%",
        left: "4%",
        rotate: "2deg",
        minWidth: 1024,
        content: (t) => <>{t("note_collapse")}</>,
    },
    {
        id: "note-fluid",
        top: "48%",
        topMobile: "74%",
        left: "6%",
        leftMobile: "8px",
        rotate: "-1deg",
        rotateMobile: "-1deg",
        minWidth: 300,
        content: (t) => (
            <>
                {t("note_fluid_title")}
                <br />- {t("note_fluid_dark_matter")}
                <br />- {t("note_fluid_quantum_carb")}
                <br />- {t("note_fluid_water")}
            </>
        ),
    },
    {
        id: "note-cats",
        top: "64%",
        left: "5%",
        rotate: "3deg",
        color: "#8c1c1c",
        minWidth: 1024,
        content: (t) => {
            const lines = t("note_cats").split("\n");
            return (
                <>
                    {lines[0]}
                    <br />
                    {lines[1]}
                </>
            );
        },
    },
    {
        id: "note-fail",
        top: "80%",
        left: "4%",
        rotate: "-2deg",
        minWidth: 1280,
        content: (t) => (
            <>
                {t("note_fail")}{" "}
                <span style={{ position: "relative", display: "inline-block" }}>
                    Morty
                    <span
                        style={{
                            position: "absolute",
                            left: "-2px",
                            right: "-2px",
                            top: "50%",
                            height: "2px",
                            background: "#8c1c1c",
                            transform: "rotate(-4deg)",
                            borderRadius: "1px",
                        }}
                    ></span>
                </span>
            </>
        ),
    },

    // === LADO DIREITO ===
    {
        id: "note-warning",
        top: "16%",
        topMobile: "16%",
        right: "6%",
        rightMobile: "8px",
        rotate: "-4deg",
        rotateMobile: "-3deg",
        color: "#8c1c1c",
        minWidth: 300,
        content: (t) => {
            const lines = t("note_warning").split("\n");
            return (
                <>
                    {lines[0]}
                    <br />
                    {lines[1]}
                </>
            );
        },
    },
    {
        id: "note-checklist",
        top: "32%",
        right: "7%",
        rotate: "1deg",
        minWidth: 1024,
        content: (t) => (
            <>
                {t("note_checklist_title")}
                <br />
                {t("note_checklist_portal")}
                <br />
                {t("note_checklist_core")}
                <br />
                {t("note_checklist_pickles")}
            </>
        ),
    },
    {
        id: "note-jerry",
        top: "50%",
        right: "4%",
        rotate: "-2deg",
        minWidth: 1024,
        content: (t) => <>{t("note_jerry")}</>,
    },
    {
        id: "note-squirrels",
        top: "66%",
        right: "6%",
        rotate: "3deg",
        minWidth: 1280,
        content: (t) => <>{t("note_squirrels")}</>,
    },
    {
        id: "note-wubba",
        top: "82%",
        topMobile: "82%",
        right: "6%",
        rightMobile: "8px",
        rotate: "-1deg",
        rotateMobile: "-1deg",
        minWidth: 300,
        content: (t) => <>{t("note_wubba")}</>,
    },
];

const rickInfiniteNotes: NoteItem[] = [
    {
        id: "inf-note-1",
        minWidth: 300, // Visível no mobile
        content: () => (
            <>
                Fluido portal instável
                <br />
                após 3 saltos
            </>
        ),
    },
    {
        id: "inf-note-2",
        minWidth: 1024,
        color: "#8c1c1c",
        content: () => (
            <>
                Nível de radiação:
                <br />
                <span
                    style={{
                        fontWeight: "bold",
                        fontSize: "1.05rem",
                        letterSpacing: "0.5px",
                    }}
                >
                    ABSURDAMENTE ALTO
                </span>
            </>
        ),
    },
    {
        id: "inf-note-3",
        minWidth: 1024,
        content: () => (
            <>
                Teste #884:
                <br />
                resultado{" "}
                <span style={{ textDecoration: "line-through", opacity: 0.6 }}>
                    positivo
                </span>
                <br />
                <span style={{ fontWeight: "600" }}>
                    inconclusivo (ou explodiu)
                </span>
            </>
        ),
    },
    {
        id: "inf-note-4",
        minWidth: 1024,
        content: () => (
            <>
                Amostra contaminada
                <br />
                pelo{" "}
                <span style={{ position: "relative", display: "inline-block" }}>
                    Morty
                    <span
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            top: "50%",
                            height: "2px",
                            background: "#8c1c1c",
                            transform: "rotate(-4deg)",
                        }}
                    ></span>
                </span>
            </>
        ),
    },
    {
        id: "inf-note-5",
        minWidth: 1024,
        color: "#8c1c1c",
        content: () => (
            <>
                Cuidado:
                <br />
                <span style={{ borderBottom: "2px dashed #8c1c1c" }}>
                    microfissura dimensional
                </span>
            </>
        ),
    },
    {
        id: "inf-note-6",
        minWidth: 1024,
        content: () => (
            <>
                A realidade está
                <br />
                vazando novamente...
            </>
        ),
    },
    {
        id: "inf-note-7",
        minWidth: 1024,
        content: () => <>Portal sincronizado em 87%</>,
    },
    {
        id: "inf-note-8",
        minWidth: 1024,
        content: () => (
            <>
                Campo gravitacional
                <br />
                irregular (G ≈ 4.12)
            </>
        ),
    },
    {
        id: "inf-note-9",
        minWidth: 1024,
        color: "#8c1c1c",
        content: () => (
            <>
                <span
                    style={{
                        position: "relative",
                        display: "inline-block",
                        padding: "0 4px",
                    }}
                >
                    NÃO
                    <svg
                        style={{
                            position: "absolute",
                            top: "-2px",
                            left: 0,
                            width: "100%",
                            height: "120%",
                            fill: "none",
                            stroke: "#8c1c1c",
                            strokeWidth: 1.5,
                        }}
                    >
                        <ellipse
                            cx="50%"
                            cy="50%"
                            rx="48%"
                            ry="45%"
                            strokeDasharray="15 3"
                        />
                    </svg>
                </span>{" "}
                olhar diretamente
                <br />
                para o núcleo!
            </>
        ),
    },
    {
        id: "inf-note-10",
        minWidth: 1024,
        content: () => (
            <>
                Matéria escura
                <br />
                reagindo ao som
            </>
        ),
    },
    {
        id: "inf-note-11",
        minWidth: 1024,
        content: () => (
            <>
                <span style={{ textDecoration: "line-through", opacity: 0.6 }}>
                    Jerry
                </span>{" "}
                NÃO pode
                <br />
                tocar nisso de jeito nenhum
            </>
        ),
    },
    {
        id: "inf-note-12",
        minWidth: 300, // Visível no mobile
        color: "#8c1c1c",
        content: () => <>Morty derrubou tudo de novo...</>,
    },
    {
        id: "inf-note-13",
        minWidth: 1024,
        content: () => (
            <span style={{ opacity: 0.85 }}>
                isso parecia uma boa ideia ontem
            </span>
        ),
    },
    {
        id: "inf-note-14",
        minWidth: 1024,
        content: () => <>não alimentar os parasitas</>,
    },
    {
        id: "inf-note-15",
        minWidth: 300, // Visível no mobile
        content: () => <>não confiar em esquilos</>,
    },
    {
        id: "inf-note-16",
        minWidth: 1024,
        color: "#8c1c1c",
        content: () => (
            <>
                se isso estiver pegando fogo:
                <br />
                <span
                    style={{
                        position: "relative",
                        display: "inline-block",
                        padding: "2px 8px",
                        fontWeight: "bold",
                    }}
                >
                    CORRA
                    <svg
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            fill: "none",
                            stroke: "#8c1c1c",
                            strokeWidth: 1.8,
                        }}
                    >
                        <rect
                            x="2"
                            y="2"
                            width="90%"
                            height="80%"
                            rx="3"
                            strokeDasharray="30 5"
                        />
                    </svg>
                </span>
            </>
        ),
    },
    {
        id: "inf-note-17",
        minWidth: 1024,
        content: () => (
            <>
                provavelmente seguro*
                <br />
                <span style={{ fontSize: "0.8rem", opacity: 0.75 }}>
                    *talvez não
                </span>
            </>
        ),
    },
    {
        id: "inf-note-18",
        minWidth: 1024,
        content: () => <>quem apertou esse botão?</>,
    },
    {
        id: "inf-note-19",
        minWidth: 1024,
        content: () => <>universo descartável v2.4</>,
    },
    {
        id: "inf-note-20",
        minWidth: 300, // Visível no mobile
        content: () => (
            <>
                nota:
                <br />
                comprar mais plutônio
            </>
        ),
    },
    {
        id: "inf-note-21",
        minWidth: 1024,
        content: () => (
            <>
                lembrar:
                <br />
                desintegrar clones defeituosos
            </>
        ),
    },
    {
        id: "inf-note-22",
        minWidth: 1024,
        content: () => (
            <>
                portal verde = seguro
                <br />
                portal roxo = <span style={{ color: "#8c1c1c" }}>fugir</span>
            </>
        ),
    },
    {
        id: "inf-note-23",
        minWidth: 1024,
        content: () => <>não abrir após meia-noite</>,
    },
    {
        id: "inf-note-24",
        minWidth: 1024,
        content: () => <>corrigir falha temporal depois...</>,
    },
    {
        id: "inf-note-25",
        minWidth: 1024,
        content: () => (
            <>
                Rick &gt;{" "}
                <span style={{ textDecoration: "line-through", opacity: 0.6 }}>
                    Conselho dos Ricks
                </span>
            </>
        ),
    },
    {
        id: "inf-note-26",
        minWidth: 300, // Visível no mobile
        content: () => <>dimensão aceitável: C-137</>,
    },
    {
        id: "inf-note-27",
        minWidth: 1024,
        color: "#8c1c1c",
        content: () => <>dimensão proibida: J19-Zeta-7</>,
    },
    {
        id: "inf-note-28",
        minWidth: 1024,
        content: () => (
            <>
                densidade quântica:
                <br />
                <span style={{ fontFamily: "monospace", fontSize: "0.95rem" }}>
                    4.22 μp
                </span>
            </>
        ),
    },
    {
        id: "inf-note-29",
        minWidth: 1024,
        color: "#8c1c1c",
        content: () => (
            <>
                instabilidade temporal:{" "}
                <span style={{ fontWeight: "bold" }}>CRÍTICA</span>
            </>
        ),
    },
    {
        id: "inf-note-30",
        minWidth: 1024,
        content: () => <>ΔT ≠ realidade linear</>,
    },
    {
        id: "inf-note-31",
        minWidth: 1024,
        content: () => (
            <>
                energia interdimensional:
                <br />
                sobrecarregada
            </>
        ),
    },
    {
        id: "inf-note-32",
        minWidth: 1024,
        color: "#8c1c1c",
        content: () => <>núcleo quântico superaquecendo!</>,
    },
    {
        id: "inf-note-33",
        minWidth: 1024,
        content: () => <>falha na compressão molecular</>,
    },
    {
        id: "inf-note-34",
        minWidth: 1024,
        content: () => <>campo portal oscilando ~~~</>,
    },
    {
        id: "inf-note-35",
        minWidth: 1024,
        content: () => <>assinatura dimensional detectada</>,
    },
    {
        id: "inf-note-36",
        minWidth: 1024,
        content: () => (
            <>
                [✓] portal aberto
                <br />
                [✓] combustível
                <br />[ ] Morty útil <i>(improvável)</i>
            </>
        ),
    },
    {
        id: "inf-note-37",
        minWidth: 1024,
        color: "#8c1c1c",
        content: () => <>resultado: terrível</>,
    },
    {
        id: "inf-note-38",
        minWidth: 300, // Visível no mobile
        content: () => (
            <span
                style={{
                    border: "1.5px solid #1d3f72",
                    padding: "2px 4px",
                    borderRadius: "4px",
                }}
            >
                NÃO TOCAR
            </span>
        ),
    },
    {
        id: "inf-note-39",
        minWidth: 1024,
        content: () => <>talvez funcione...</>,
    },
    {
        id: "inf-note-40",
        minWidth: 1024,
        content: () => <>isso veio de outra dimensão</>,
    },
    {
        id: "inf-note-41",
        minWidth: 1024,
        color: "#8c1c1c",
        content: () => <>risco biológico nível 4</>,
    },
    {
        id: "inf-note-42",
        minWidth: 1024,
        content: () => <>anti-matéria vazando...</>,
    },
    {
        id: "inf-note-43",
        minWidth: 1024,
        content: () => <b>reiniciar universo? [S/N]</b>,
    },
    {
        id: "inf-note-44",
        minWidth: 1024,
        color: "#8c1c1c",
        content: () => (
            <>
                ATENÇÃO:
                <br />
                turbulência interdimensional
            </>
        ),
    },
    {
        id: "inf-note-45",
        minWidth: 1024,
        content: () => <i>atravesse por sua conta e risco</i>,
    },
    {
        id: "inf-note-46",
        minWidth: 1024,
        content: () => <>o Morty nunca lê os avisos</>,
    },
    {
        id: "inf-note-47",
        minWidth: 1024,
        color: "#8c1c1c",
        content: () => (
            <>
                NÃO misturar:
                <br />
                fluido portal + bateria quântica!
            </>
        ),
    },
    {
        id: "inf-note-48",
        minWidth: 300, // Visível no mobile
        content: () => (
            <>
                obs:
                <br />a gosma verde está viva
            </>
        ),
    },
];

// Helper para gerar números pseudo-aleatórios determinísticos baseados em sementes de texto
function seedRandom(seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return function () {
        const x = Math.sin(hash++) * 10000;
        return x - Math.floor(x);
    };
}

interface NotebookDecorationsProps {
    blockCount?: number;
}

export function NotebookDecorations({
    blockCount = 60,
}: NotebookDecorationsProps) {
    const { t } = useLanguage();

    // Repete o conjunto de anotações a cada 100vh para cobrir o scroll infinito
    const blocks = Array.from({ length: blockCount });

    return (
        <>
            {blocks.map((_, blockIdx) => {
                const topOffset = blockIdx * 100;

                // Se for o bloco inicial (bloco 0), mantém o design determinístico original idêntico
                if (blockIdx === 0) {
                    return (
                        <div
                            key={`notebook-block-${blockIdx}`}
                            style={{
                                position: "absolute",
                                top: `${topOffset}vh`,
                                left: 0,
                                right: 0,
                                height: "100vh",
                                pointerEvents: "none",
                                zIndex: 0,
                            }}
                        >
                            {/* Notas manuscritas do Rick originais */}
                            {rickNotes.map((note) => (
                                <HandwrittenNote
                                    key={`${note.id}-b${blockIdx}`}
                                    $top={note.top}
                                    $topMobile={note.topMobile}
                                    $left={note.left}
                                    $leftMobile={note.leftMobile}
                                    $right={note.right}
                                    $rightMobile={note.rightMobile}
                                    $rotate={note.rotate}
                                    $rotateMobile={note.rotateMobile}
                                    $minWidth={note.minWidth}
                                    style={
                                        note.color
                                            ? { color: note.color }
                                            : undefined
                                    }
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {note.content(t)}
                                </HandwrittenNote>
                            ))}

                            {/* Mancha de café realista e detalhada no bloco 0 */}
                            <CoffeeStain style={{ opacity: 0.28 }}>
                                <svg
                                    viewBox="0 0 200 200"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        pointerEvents: "none",
                                    }}
                                >
                                    <defs>
                                        <filter
                                            id={`coffee-filter-${blockIdx}`}
                                            x="-20%"
                                            y="-20%"
                                            width="140%"
                                            height="140%"
                                        >
                                            <feTurbulence
                                                type="fractalNoise"
                                                baseFrequency="0.04"
                                                numOctaves="4"
                                                result="noise"
                                            />
                                            <feDisplacementMap
                                                in="SourceGraphic"
                                                in2="noise"
                                                scale="8"
                                                xChannelSelector="R"
                                                yChannelSelector="G"
                                                result="displaced"
                                            />
                                            <feGaussianBlur
                                                in="displaced"
                                                stdDeviation="0.8"
                                            />
                                        </filter>
                                        <radialGradient
                                            id={`coffee-grad-${blockIdx}`}
                                            cx="50%"
                                            cy="50%"
                                            r="50%"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#4a2c11"
                                                stopOpacity="0.05"
                                            />
                                            <stop
                                                offset="70%"
                                                stopColor="#5c3816"
                                                stopOpacity="0.15"
                                            />
                                            <stop
                                                offset="90%"
                                                stopColor="#6d421d"
                                                stopOpacity="0.35"
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#4a2c11"
                                                stopOpacity="0.55"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#301c0a"
                                                stopOpacity="0.75"
                                            />
                                        </radialGradient>
                                        <radialGradient
                                            id={`splat-grad-${blockIdx}`}
                                            cx="50%"
                                            cy="50%"
                                            r="50%"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#5c3816"
                                                stopOpacity="0.6"
                                            />
                                            <stop
                                                offset="85%"
                                                stopColor="#4a2c11"
                                                stopOpacity="0.75"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#301c0a"
                                                stopOpacity="0.85"
                                            />
                                        </radialGradient>
                                    </defs>
                                    <g
                                        filter={`url(#coffee-filter-${blockIdx})`}
                                    >
                                        <path
                                            d="M 100 25 C 145 23, 177 55, 175 100 C 173 145, 145 177, 100 175 C 55 173, 23 145, 25 100 C 27 55, 55 23, 100 25 Z"
                                            fill="none"
                                            stroke={`url(#coffee-grad-${blockIdx})`}
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M 102 33 C 140 31, 169 60, 167 98 C 165 136, 140 165, 102 163 C 64 161, 35 136, 37 98 C 39 60, 64 31, 102 33 Z"
                                            fill="none"
                                            stroke={`url(#coffee-grad-${blockIdx})`}
                                            strokeWidth="2.5"
                                            opacity="0.65"
                                        />
                                        <path
                                            d="M 60 160 Q 50 190 42 165 Q 40 150 55 145"
                                            fill={`url(#splat-grad-${blockIdx})`}
                                        />
                                        <circle
                                            cx="95"
                                            cy="105"
                                            r="35"
                                            fill={`url(#coffee-grad-${blockIdx})`}
                                            opacity="0.45"
                                        />
                                        <circle
                                            cx="165"
                                            cy="45"
                                            r="5"
                                            fill={`url(#splat-grad-${blockIdx})`}
                                        />
                                        <circle
                                            cx="178"
                                            cy="65"
                                            r="2.5"
                                            fill={`url(#splat-grad-${blockIdx})`}
                                        />
                                        <circle
                                            cx="145"
                                            cy="30"
                                            r="3.5"
                                            fill={`url(#splat-grad-${blockIdx})`}
                                        />
                                        <circle
                                            cx="35"
                                            cy="140"
                                            r="4.5"
                                            fill={`url(#splat-grad-${blockIdx})`}
                                        />
                                        <circle
                                            cx="22"
                                            cy="115"
                                            r="3"
                                            fill={`url(#splat-grad-${blockIdx})`}
                                        />
                                        <circle
                                            cx="50"
                                            cy="40"
                                            r="2"
                                            fill={`url(#splat-grad-${blockIdx})`}
                                        />
                                    </g>
                                </svg>
                            </CoffeeStain>

                            {/* Respingos de fluido de portal verde */}
                            <GreenSplat
                                $top="48%"
                                $left="230px"
                                $size="36px"
                                $topMobile="69%"
                                $leftMobile="110px"
                                $sizeMobile="22px"
                            >
                                <svg
                                    viewBox="0 0 100 100"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        fill: "#97ce4c",
                                    }}
                                >
                                    <path d="M 50 20 C 55 10, 65 15, 60 25 C 70 20, 80 30, 70 40 C 85 45, 80 60, 70 60 C 75 75, 60 80, 50 70 C 40 80, 25 75, 30 60 C 20 60, 15 45, 30 40 C 20 30, 30 20, 40 25 C 35 15, 45 10, 50 20 Z" />
                                    <circle cx="20" cy="25" r="4" />
                                    <circle cx="82" cy="35" r="3" />
                                    <circle cx="75" cy="75" r="5" />
                                </svg>
                            </GreenSplat>

                            <GreenSplat
                                $top="38%"
                                $left="65px"
                                $size="22px"
                                $topMobile="78%"
                                $leftMobile="135px"
                                $sizeMobile="15px"
                            >
                                <svg
                                    viewBox="0 0 100 100"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        fill: "#97ce4c",
                                    }}
                                >
                                    <path d="M 50 20 C 55 10, 65 15, 60 25 C 70 20, 80 30, 70 40 C 85 45, 80 60, 70 60 C 75 75, 60 80, 50 70 C 40 80, 25 75, 30 60 C 20 60, 15 45, 30 40 C 20 30, 30 20, 40 25 C 35 15, 45 10, 50 20 Z" />
                                </svg>
                            </GreenSplat>
                        </div>
                    );
                }

                // Para os blocos subsequentes (scroll infinito), geramos combinações aleatórias das referências novas
                const rng = seedRandom(`notebook-block-${blockIdx}`);

                // Embaralha as novas frases para garantir mistura aleatória
                const shuffledPool = [...rickInfiniteNotes].sort(
                    () => rng() - 0.5,
                );

                // Define 4 faixas verticais (slots) que nunca se sobrepõem
                const slots = [
                    { min: 12, max: 26 },
                    { min: 30, max: 44 },
                    { min: 48, max: 62 },
                    { min: 66, max: 80 },
                ];

                // Embaralha as faixas verticais para distribuir as notas aleatoriamente
                const shuffledSlots = [...slots].sort(() => rng() - 0.5);

                // Seleciona de 2 a 3 notas para este bloco
                const count = Math.floor(rng() * 2) + 2;
                const selectedSlots = shuffledSlots.slice(0, count);

                // Renderiza cada anotação associada a uma faixa vertical exclusiva (sem sobreposições)
                const renderedNotes = selectedSlots.map((slot, idx) => {
                    const note = shuffledPool[idx % shuffledPool.length];
                    const side = rng() > 0.5 ? "left" : "right";

                    // Gera posições verticais dentro do limite seguro daquela faixa
                    const topPercent =
                        Math.floor(slot.min + rng() * (slot.max - slot.min)) +
                        "%";
                    const sidePercent = Math.floor(4 + rng() * 3) + "%"; // 4% a 6%
                    const rotateDeg = Math.floor(-5 + rng() * 10) + "deg";
                    const color =
                        note.color || (rng() > 0.8 ? "#8c1c1c" : "#1d3f72");

                    return (
                        <HandwrittenNote
                            key={`rand-${note.id}-b${blockIdx}-${idx}`}
                            $top={topPercent}
                            $topMobile={topPercent}
                            $left={side === "left" ? sidePercent : undefined}
                            $leftMobile={side === "left" ? "8px" : undefined}
                            $right={side === "right" ? sidePercent : undefined}
                            $rightMobile={side === "right" ? "8px" : undefined}
                            $rotate={rotateDeg}
                            $rotateMobile={rotateDeg}
                            $minWidth={note.minWidth}
                            style={{ color }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.85 }} // Nitidez total para legibilidade
                            transition={{ duration: 0.3 }}
                        >
                            {note.content(t)}
                        </HandwrittenNote>
                    );
                });

                // Manchas e respingos aleatórios
                const showCoffee = rng() > 0.65;
                const showSplat1 = rng() > 0.5;
                const showSplat2 = rng() > 0.5;

                const coffeeSide = rng() > 0.5 ? "left" : "right";
                const coffeeBottom = Math.floor(5 + rng() * 20) + "%";
                const coffeeOffset = Math.floor(2 + rng() * 5) + "%";
                const coffeeScale = 0.7 + rng() * 0.5;

                return (
                    <div
                        key={`notebook-block-${blockIdx}`}
                        style={{
                            position: "absolute",
                            top: `${topOffset}vh`,
                            left: 0,
                            right: 0,
                            height: "100vh",
                            pointerEvents: "none",
                            zIndex: 0,
                        }}
                    >
                        {renderedNotes}

                        {showCoffee && (
                            <CoffeeStain
                                style={{
                                    bottom: coffeeBottom,
                                    left:
                                        coffeeSide === "left"
                                            ? coffeeOffset
                                            : "auto",
                                    right:
                                        coffeeSide === "right"
                                            ? coffeeOffset
                                            : "auto",
                                    transform: `scale(${coffeeScale})`,
                                    opacity: 0.28,
                                }}
                            >
                                <svg
                                    viewBox="0 0 200 200"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        pointerEvents: "none",
                                    }}
                                >
                                    <defs>
                                        <filter
                                            id={`coffee-filter-${blockIdx}`}
                                            x="-20%"
                                            y="-20%"
                                            width="140%"
                                            height="140%"
                                        >
                                            <feTurbulence
                                                type="fractalNoise"
                                                baseFrequency="0.04"
                                                numOctaves="4"
                                                result="noise"
                                            />
                                            <feDisplacementMap
                                                in="SourceGraphic"
                                                in2="noise"
                                                scale="8"
                                                xChannelSelector="R"
                                                yChannelSelector="G"
                                                result="displaced"
                                            />
                                            <feGaussianBlur
                                                in="displaced"
                                                stdDeviation="0.8"
                                            />
                                        </filter>
                                        <radialGradient
                                            id={`coffee-grad-${blockIdx}`}
                                            cx="50%"
                                            cy="50%"
                                            r="50%"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#4a2c11"
                                                stopOpacity="0.05"
                                            />
                                            <stop
                                                offset="70%"
                                                stopColor="#5c3816"
                                                stopOpacity="0.15"
                                            />
                                            <stop
                                                offset="90%"
                                                stopColor="#6d421d"
                                                stopOpacity="0.35"
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#4a2c11"
                                                stopOpacity="0.55"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#301c0a"
                                                stopOpacity="0.75"
                                            />
                                        </radialGradient>
                                        <radialGradient
                                            id={`splat-grad-${blockIdx}`}
                                            cx="50%"
                                            cy="50%"
                                            r="50%"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#5c3816"
                                                stopOpacity="0.6"
                                            />
                                            <stop
                                                offset="85%"
                                                stopColor="#4a2c11"
                                                stopOpacity="0.75"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#301c0a"
                                                stopOpacity="0.85"
                                            />
                                        </radialGradient>
                                    </defs>
                                    <g
                                        filter={`url(#coffee-filter-${blockIdx})`}
                                    >
                                        <path
                                            d="M 100 25 C 145 23, 177 55, 175 100 C 173 145, 145 177, 100 175 C 55 173, 23 145, 25 100 C 27 55, 55 23, 100 25 Z"
                                            fill="none"
                                            stroke={`url(#coffee-grad-${blockIdx})`}
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M 102 33 C 140 31, 169 60, 167 98 C 165 136, 140 165, 102 163 C 64 161, 35 136, 37 98 C 39 60, 64 31, 102 33 Z"
                                            fill="none"
                                            stroke={`url(#coffee-grad-${blockIdx})`}
                                            strokeWidth="2.5"
                                            opacity="0.65"
                                        />
                                        <path
                                            d="M 60 160 Q 50 190 42 165 Q 40 150 55 145"
                                            fill={`url(#splat-grad-${blockIdx})`}
                                        />
                                        <circle
                                            cx="95"
                                            cy="105"
                                            r="35"
                                            fill={`url(#coffee-grad-${blockIdx})`}
                                            opacity="0.45"
                                        />
                                        <circle
                                            cx="165"
                                            cy="45"
                                            r="5"
                                            fill={`url(#splat-grad-${blockIdx})`}
                                        />
                                        <circle
                                            cx="178"
                                            cy="65"
                                            r="2.5"
                                            fill={`url(#splat-grad-${blockIdx})`}
                                        />
                                        <circle
                                            cx="145"
                                            cy="30"
                                            r="3.5"
                                            fill={`url(#splat-grad-${blockIdx})`}
                                        />
                                        <circle
                                            cx="35"
                                            cy="140"
                                            r="4.5"
                                            fill={`url(#splat-grad-${blockIdx})`}
                                        />
                                        <circle
                                            cx="22"
                                            cy="115"
                                            r="3"
                                            fill={`url(#splat-grad-${blockIdx})`}
                                        />
                                        <circle
                                            cx="50"
                                            cy="40"
                                            r="2"
                                            fill={`url(#splat-grad-${blockIdx})`}
                                        />
                                    </g>
                                </svg>
                            </CoffeeStain>
                        )}

                        {showSplat1 && (
                            <GreenSplat
                                $top={Math.floor(10 + rng() * 80) + "%"}
                                $left={Math.floor(60 + rng() * 180) + "px"}
                                $size={Math.floor(20 + rng() * 20) + "px"}
                                $topMobile="70%"
                                $leftMobile="110px"
                                $sizeMobile="18px"
                            >
                                <svg
                                    viewBox="0 0 100 100"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        fill: "#97ce4c",
                                    }}
                                >
                                    <path d="M 50 20 C 55 10, 65 15, 60 25 C 70 20, 80 30, 70 40 C 85 45, 80 60, 70 60 C 75 75, 60 80, 50 70 C 40 80, 25 75, 30 60 C 20 60, 15 45, 30 40 C 20 30, 30 20, 40 25 C 35 15, 45 10, 50 20 Z" />
                                    <circle cx="20" cy="25" r="4" />
                                    <circle cx="82" cy="35" r="3" />
                                    <circle cx="75" cy="75" r="5" />
                                </svg>
                            </GreenSplat>
                        )}

                        {showSplat2 && (
                            <GreenSplat
                                $top={Math.floor(10 + rng() * 80) + "%"}
                                $right={Math.floor(60 + rng() * 180) + "px"}
                                $size={Math.floor(15 + rng() * 15) + "px"}
                                $topMobile="80%"
                                $rightMobile="110px"
                                $sizeMobile="12px"
                            >
                                <svg
                                    viewBox="0 0 100 100"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        fill: "#97ce4c",
                                    }}
                                >
                                    <path d="M 50 20 C 55 10, 65 15, 60 25 C 70 20, 80 30, 70 40 C 85 45, 80 60, 70 60 C 75 75, 60 80, 50 70 C 40 80, 25 75, 30 60 C 20 60, 15 45, 30 40 C 20 30, 30 20, 40 25 C 35 15, 45 10, 50 20 Z" />
                                </svg>
                            </GreenSplat>
                        )}
                    </div>
                );
            })}
        </>
    );
}
