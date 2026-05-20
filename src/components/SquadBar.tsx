import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { useSquad } from "../hooks/useSquad";
import { useLanguage } from "../context/LanguageContext";

const pulseGreen = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(151, 206, 76, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(151, 206, 76, 0); }
`;

const Bar = styled(motion.div)`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 150;
    background: ${({ theme }) => theme.squadBarBg};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid ${({ theme }) => theme.border};
    box-shadow: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "0 -4px 40px rgba(0, 0, 0, 0.6), 0 -1px 0 rgba(151, 206, 76, 0.1)"
            : "0 -6px 28px rgba(15, 23, 42, 0.12)"};
    display: flex;
    align-items: center;
    padding: 0 2rem;
    gap: 1.5rem;
    height: 76px;

    @media (max-width: 768px) {
        height: 64px;
        padding: 0 1rem;
        gap: 0.75rem;
    }
`;

const LeftSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 120px;

    @media (max-width: 768px) {
        display: none;
    }
`;

const LabelTitle = styled.span`
    font-size: 0.7rem;
    font-weight: 600;
    color: ${({ theme }) => theme.primaryDeep};
    text-transform: uppercase;
    letter-spacing: 2px;
`;

const LabelCount = styled.span`
    font-size: 1.1rem;
    font-weight: 800;
    color: #97ce4c;
    font-family: "Courier New", monospace;
    line-height: 1;
`;

const Divider = styled.div`
    width: 1px;
    height: 40px;
    background: ${({ theme }) => theme.border};

    @media (max-width: 768px) {
        display: none;
    }
`;

const AvatarList = styled.div`
    display: flex;
    gap: 0.6rem;
    align-items: center;
    flex: 1;

    @media (max-width: 768px) {
        justify-content: center;
        gap: 0.5rem;
    }
`;

const AvatarWrapper = styled(motion.div)`
    position: relative;
    cursor: pointer;

    &:hover .tooltip {
        opacity: 1;
        transform: translateX(-50%) translateY(-4px);
    }

    &:hover .remove-overlay {
        opacity: 1;
    }
`;

const Tooltip = styled.span`
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(0px);
    background: ${({ theme }) => theme.surfaceCard};
    border: 1px solid rgba(151, 206, 76, 0.4);
    color: #97ce4c;
    font-size: 0.7rem;
    font-weight: 600;
    white-space: nowrap;
    padding: 4px 8px;
    border-radius: 6px;
    pointer-events: none;
    opacity: 0;
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
    z-index: 10;

    &::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 4px solid transparent;
        border-top-color: rgba(151, 206, 76, 0.4);
    }
`;

const Avatar = styled.img.attrs({
    decoding: "async",
})`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid #97ce4c;
    object-fit: cover;
    display: block;
    animation: ${pulseGreen} 3s ease-in-out infinite;

    @media (max-width: 768px) {
        width: 38px;
        height: 38px;
    }
`;

const RemoveOverlay = styled.div`
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(192, 57, 43, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 5;

    svg {
        width: 18px;
        height: 18px;
        stroke: #fff;
    }
`;

const Slots = styled.div`
    display: flex;
    gap: 0.6rem;
    align-items: center;

    @media (max-width: 768px) {
        gap: 0.5rem;
    }
`;

const SlotDot = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1.5px dashed rgba(151, 206, 76, 0.2);
    background: rgba(151, 206, 76, 0.02);
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
        content: "+";
        color: rgba(151, 206, 76, 0.15);
        font-size: 1.2rem;
        line-height: 1;
    }

    @media (max-width: 768px) {
        width: 38px;
        height: 38px;
    }
`;

const ProgressBar = styled.div`
    flex: 1;
    height: 3px;
    background: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "rgba(255, 255, 255, 0.06)"
            : "rgba(15, 23, 42, 0.08)"};
    border-radius: 99px;
    overflow: hidden;
    max-width: 120px;

    @media (max-width: 768px) {
        display: none;
    }
`;

const ProgressFill = styled(motion.div)`
    height: 100%;
    background: linear-gradient(to right, #97ce4c, #c4e85a);
    border-radius: 99px;
`;

const ClearBtn = styled.button`
    margin-left: auto;
    padding: 0.45rem 1rem;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(224, 90, 71, 0.8);
    border: 1px solid rgba(224, 90, 71, 0.3);
    background: rgba(224, 90, 71, 0.05);
    transition: all 0.2s ease;
    white-space: nowrap;
    letter-spacing: 0.5px;
    text-transform: uppercase;

    &:hover {
        background: rgba(224, 90, 71, 0.15);
        border-color: rgba(224, 90, 71, 0.6);
        color: #e05a47;
    }

    @media (max-width: 768px) {
        font-size: 0.65rem;
        padding: 0.35rem 0.6rem;
    }
`;

const PanelLink = styled(Link)`
    padding: 0.55rem 1rem;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 800;
    color: #0d0d14;
    background: #97ce4c;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
    text-decoration: none;
    transition:
        transform 0.2s ease,
        background 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        background: #b0e060;
    }

    @media (max-width: 768px) {
        display: none;
    }
`;

export function SquadBar() {
    const { squad, removeFromSquad, clearSquad } = useSquad();
    const { lang } = useLanguage();

    return (
        <AnimatePresence>
            {squad.length > 0 && (
                <Bar
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <LeftSection>
                        <LabelTitle>
                            {lang === "pt" ? "Esquadrão" : "Squad"}
                        </LabelTitle>
                        <LabelCount>{squad.length} / 5</LabelCount>
                    </LeftSection>

                    <Divider />

                    <AvatarList>
                        <AnimatePresence>
                            {squad.map((c) => (
                                <AvatarWrapper
                                    key={c.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                    }}
                                >
                                    <Tooltip className="tooltip">
                                        {c.name}
                                    </Tooltip>
                                    <Avatar src={c.image} alt={c.name} />
                                    <RemoveOverlay
                                        className="remove-overlay"
                                        onClick={() => removeFromSquad(c.id)}
                                        aria-label={`Remover ${c.name}`}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line
                                                x1="18"
                                                y1="6"
                                                x2="6"
                                                y2="18"
                                            ></line>
                                            <line
                                                x1="6"
                                                y1="6"
                                                x2="18"
                                                y2="18"
                                            ></line>
                                        </svg>
                                    </RemoveOverlay>
                                </AvatarWrapper>
                            ))}
                        </AnimatePresence>

                        <Slots>
                            {Array.from({ length: 5 - squad.length }).map(
                                (_, idx) => (
                                    <SlotDot key={`slot-${idx}`} />
                                ),
                            )}
                        </Slots>
                    </AvatarList>

                    <ProgressBar>
                        <ProgressFill
                            animate={{ width: `${(squad.length / 5) * 100}%` }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                    </ProgressBar>

                    <PanelLink to="/squad">
                        {lang === "pt" ? "Abrir painel" : "Open panel"}
                    </PanelLink>

                    <ClearBtn
                        onClick={clearSquad}
                        aria-label="Limpar esquadrão"
                    >
                        {lang === "pt" ? "Limpar" : "Clear"}
                    </ClearBtn>
                </Bar>
            )}
        </AnimatePresence>
    );
}
