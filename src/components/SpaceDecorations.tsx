import React from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.2; filter: drop-shadow(0 0 5px rgba(8, 186, 227, 0.4)); }
  50% { opacity: 0.7; filter: drop-shadow(0 0 12px rgba(8, 186, 227, 0.8)); }
`;

const Container = styled.div`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
`;

const HudText = styled(motion.div)<{
    $top: string;
    $left?: string;
    $right?: string;
    $color?: string;
    $delay?: number;
}>`
    position: absolute;
    top: ${({ $top }) => $top};
    ${({ $left }) => $left && `left: ${$left};`}
    ${({ $right }) => $right && `right: ${$right};`}
  font-family: 'Courier New', Courier, monospace;
    font-size: 0.8rem;
    color: ${({ $color }) => $color || "#08BAE3"};
    opacity: 0.5;
    letter-spacing: 1.5px;
    animation: ${pulseGlow} ${({ $delay }) => 3 + ($delay || 0)}s ease-in-out
        infinite;

    &::before {
        content: "";
        position: absolute;
        left: -12px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 4px;
        background-color: ${({ $color }) => $color || "#08BAE3"};
        border-radius: 50%;
    }

    @media (max-width: 1024px) {
        display: none;
    }
`;

const Scanlines = styled.div`
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 10;
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 0) 50%,
        rgba(0, 0, 0, 0.1) 50%,
        rgba(0, 0, 0, 0.1)
    );
    background-size: 100% 4px;
    opacity: 0.4;
`;

const HudFrame = styled.div`
    position: absolute;
    inset: 2rem;
    pointer-events: none;
    z-index: 5;
    border: 1px solid rgba(8, 186, 227, 0.05);

    &::before,
    &::after {
        content: "";
        position: absolute;
        width: 40px;
        height: 40px;
        border: 2px solid rgba(8, 186, 227, 0.4);
    }

    &::before {
        top: -1px;
        left: -1px;
        border-right: none;
        border-bottom: none;
    }
    &::after {
        bottom: -1px;
        right: -1px;
        border-left: none;
        border-top: none;
    }

    @media (max-width: 1024px) {
        inset: 1rem;
    }
`;

const HudFrameInner = styled.div`
    position: absolute;
    inset: 0;

    &::before,
    &::after {
        content: "";
        position: absolute;
        width: 40px;
        height: 40px;
        border: 2px solid rgba(8, 186, 227, 0.4);
    }

    &::before {
        top: -1px;
        right: -1px;
        border-left: none;
        border-bottom: none;
    }
    &::after {
        bottom: -1px;
        left: -1px;
        border-right: none;
        border-top: none;
    }
`;

const Nebula = styled.div<{
    $top: string;
    $left?: string;
    $right?: string;
    $color: string;
}>`
    position: absolute;
    top: ${({ $top }) => $top};
    ${({ $left }) => $left && `left: ${$left};`}
    ${({ $right }) => $right && `right: ${$right};`}
  width: 60vw;
    height: 60vw;
    max-width: 800px;
    max-height: 800px;
    background: radial-gradient(
        circle,
        ${({ $color }) => $color} 0%,
        transparent 60%
    );
    opacity: 0.12;
    filter: blur(60px);
    z-index: -2;
    transform: translate(-50%, -50%);
`;

export function SpaceDecorations() {
    const { lang } = useLanguage();

    const copy = {
        leftTop:
            lang === "pt"
                ? ["SIS.DIM // C-137", "STATUS: ONLINE"]
                : ["SYS.DIM // C-137", "STATUS: ONLINE"],
        leftMid:
            lang === "pt"
                ? ["FLUIDO PORTAL: 89%", "[|||||||||.]"]
                : ["PORTAL FLUID: 89%", "[|||||||||.]"],
        leftBottom:
            lang === "pt"
                ? ["! ANOMALIA DETECTADA", "SETOR 4G"]
                : ["! ANOMALY DETECTED", "SECTOR 4G"],
        rightTop:
            lang === "pt"
                ? ["ALVO TRAVADO:", "COORD [49.33, -12.1]"]
                : ["TARGET LOCK:", "COORD [49.33, -12.1]"],
        rightMid:
            lang === "pt"
                ? ["VARRENDO SETOR...", "0 ENTIDADES ENCONTRADAS"]
                : ["SCANNING SECTOR...", "0 ENTITIES FOUND"],
        rightBottom:
            lang === "pt"
                ? ["SOBRESCRITA: FALSA", "AUTO-NAV: ESPERA"]
                : ["OVERRIDE: FALSE", "AUTO-NAV: STANDBY"],
    };

    return (
        <Container>
            <Scanlines />
            <HudFrame>
                <HudFrameInner />
            </HudFrame>

            <Nebula $top="20%" $left="10%" $color="#4b0082" />
            <Nebula $top="70%" $right="-10%" $color="#08BAE3" />

            <HudText $top="22%" $left="5%" $delay={0}>
                {copy.leftTop[0]}
                <br />
                {copy.leftTop[1]}
            </HudText>
            <HudText $top="45%" $left="4%" $color="#97ce4c" $delay={1.5}>
                {copy.leftMid[0]}
                <br />
                {copy.leftMid[1]}
            </HudText>
            <HudText $top="68%" $left="6%" $color="#E3084B" $delay={0.5}>
                {copy.leftBottom[0]}
                <br />
                {copy.leftBottom[1]}
            </HudText>

            <HudText $top="28%" $right="5%" $delay={2}>
                {copy.rightTop[0]}
                <br />
                {copy.rightTop[1]}
            </HudText>
            <HudText $top="55%" $right="4%" $delay={1}>
                {copy.rightMid[0]}
                <br />
                {copy.rightMid[1]}
            </HudText>
            <HudText $top="80%" $right="7%" $color="#97ce4c" $delay={2.5}>
                {copy.rightBottom[0]}
                <br />
                {copy.rightBottom[1]}
            </HudText>

            <div
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: "50%",
                    borderLeft: "1px dashed rgba(8, 186, 227, 0.1)",
                    transform: "translateX(-50%)",
                    zIndex: -1,
                }}
            />
        </Container>
    );
}
