import React, { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../context/LanguageContext";
import { MoonIcon, SunIcon } from "./ThemeToggleIcons";
import pickleRickImg from "../assets/pickle-rick.png";

const Nav = styled.nav`
    position: sticky;
    top: 0;
    z-index: 100;
    background: ${({ theme }) => theme.navBg};
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid ${({ theme }) => theme.border};
    height: 64px;
`;

const NavContainer = styled.div<{ $isWide: boolean }>`
    width: 100%;
    max-width: ${({ $isWide }) => ($isWide ? "1400px" : "1200px")};
    margin: 0 auto;
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    gap: 1rem;

    @media (max-width: 960px) {
        padding: 0 1rem;
    }
`;

const Brand = styled(Link)`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    cursor: pointer;
`;

const BrandIcon = styled.img.attrs({
    width: 32,
    height: 32,
    decoding: "async",
})`
    width: 32px;
    height: 32px;
    object-fit: contain;
    filter: drop-shadow(0 0 6px rgba(151, 206, 76, 0.6));
`;

const LogoText = styled.span`
    font-family: "Creepster", "Impact", sans-serif;
    font-size: clamp(1rem, 4vw, 1.45rem);
    color: #08bae3;
    text-shadow: 0 0 20px rgba(8, 186, 227, 0.4);

    @media (max-width: 1080px) {
        font-size: 1.1rem;
    }

    @media (max-width: 960px) {
        font-size: 1rem;
    }
`;

const NavLinks = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;

    @media (max-width: 960px) {
        display: none;
    }
`;

const StyledLink = styled(NavLink)`
    padding: 0.5rem 0.25rem;
    font-weight: 500;
    font-size: 0.92rem;
    color: ${({ theme }) => theme.textSecondary};
    transition: all 0.2s ease;
    position: relative;

    &:hover {
        color: ${({ theme }) => theme.primary};
    }

    &.active {
        color: ${({ theme }) => theme.primary};
        border-bottom: 2px solid ${({ theme }) => theme.primary};
        font-weight: 600;
    }
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;

    @media (max-width: 960px) {
        display: none;
    }
`;

const SlideToggle = styled.button<{ $width?: string }>`
    position: relative;
    width: ${({ $width }) => $width || "84px"};
    height: 36px;
    background: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "rgba(28, 28, 46, 0.6)"
            : "rgba(255, 255, 255, 0.8)"};
    border: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "1px solid rgba(151, 206, 76, 0.3)"
            : "1.5px solid #000000"};
    border-radius: 20px;
    display: flex;
    align-items: center;
    padding: 0;
    cursor: pointer;
    overflow: hidden;
    box-shadow: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "0 4px 12px rgba(0, 0, 0, 0.2)"
            : "2px 2px 0px #000000"};
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
    -webkit-tap-highlight-color: transparent;
`;

const SlideIndicator = styled(motion.div)`
    position: absolute;
    width: calc(50% - 4px);
    height: calc(100% - 8px);
    background: #97ce4c;
    border-radius: 16px;
    top: 4px;
    left: 4px;
    z-index: 1;
    box-shadow: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "0 0 10px rgba(151, 206, 76, 0.4)"
            : "none"};
    border: ${({ theme }) =>
        theme.background === "#0d0d14" ? "none" : "1px solid #000000"};
`;

const ToggleText = styled.span<{ $isActive: boolean }>`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 700;
    z-index: 2;
    color: ${({ $isActive, theme }) =>
        $isActive
            ? "#0d0d14"
            : theme.background === "#0d0d14"
              ? "rgba(255, 255, 255, 0.6)"
              : "rgba(0, 0, 0, 0.6)"};
    transition: color 0.3s ease;
    pointer-events: none;
`;

/* Menu Mobile Hamburguer */
const Hamburger = styled.button`
    display: none;
    font-size: 1.6rem;
    color: #97ce4c;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;

    @media (max-width: 960px) {
        display: flex;
    }
`;

const MobileDropdown = styled.div<{ $open: boolean }>`
    display: ${({ $open }) => ($open ? "flex" : "none")};
    flex-direction: column;
    background: ${({ theme }) => theme.navBg};
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border-bottom: 2px solid #97ce4c;
    position: absolute;
    top: 64px;
    left: 0;
    width: 100%;
    max-height: calc(100vh - 64px);
    max-height: calc(100dvh - 64px);
    overflow-y: auto;
    padding: 1.25rem 1.5rem max(1.25rem, env(safe-area-inset-bottom));
    gap: 1.25rem;
    z-index: 99;
    box-shadow: ${({ theme }) =>
        theme.background === "#0d0d14"
            ? "0 10px 30px rgba(0, 0, 0, 0.5)"
            : "0 10px 30px rgba(0, 0, 0, 0.08)"};

    @media (min-width: 961px) {
        display: none;
    }
`;

const MobileLink = styled(NavLink)`
    padding: 0.5rem 0;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.textSecondary};
    border-bottom: 1px solid ${({ theme }) => theme.border};

    &.active {
        color: #97ce4c;
        font-weight: bold;
    }
`;

const MobileControlRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
`;

export function Navbar() {
    const { mode, toggleTheme } = useTheme();
    const { lang, setLang, t } = useLanguage();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const isWide = location.pathname === "/characters";

    return (
        <Nav>
            <NavContainer $isWide={isWide}>
                <Brand to="/">
                    <BrandIcon src={pickleRickImg} alt="Pickle Rick" />
                    <LogoText>Rick &amp; Morty Wiki</LogoText>
                </Brand>

                {/* Desktop Links */}
                <NavLinks>
                    <StyledLink to="/characters">
                        {t("nav_characters")}
                    </StyledLink>
                    <StyledLink to="/episodes">{t("nav_episodes")}</StyledLink>
                    <StyledLink to="/locations">
                        {t("nav_locations")}
                    </StyledLink>
                    <StyledLink to="/squad">{t("nav_squad")}</StyledLink>
                </NavLinks>

                {/* Desktop Controls */}
                <RightSection>
                    <SlideToggle
                        onClick={() => setLang(lang === "pt" ? "en" : "pt")}
                        $width="84px"
                    >
                        <SlideIndicator
                            animate={{ x: lang === "en" ? "100%" : "0%" }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                            }}
                        />
                        <ToggleText $isActive={lang === "pt"}>PT</ToggleText>
                        <ToggleText $isActive={lang === "en"}>EN</ToggleText>
                    </SlideToggle>

                    <SlideToggle
                        onClick={toggleTheme}
                        $width="84px"
                        aria-label={
                            lang === "pt"
                                ? "Alternar tema claro e escuro"
                                : "Toggle light and dark theme"
                        }
                    >
                        <SlideIndicator
                            animate={{ x: mode === "dark" ? "100%" : "0%" }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                            }}
                        />
                        <ToggleText
                            $isActive={mode !== "dark"}
                            title={lang === "pt" ? "Claro" : "Light"}
                        >
                            <SunIcon />
                        </ToggleText>
                        <ToggleText
                            $isActive={mode === "dark"}
                            title={lang === "pt" ? "Escuro" : "Dark"}
                        >
                            <MoonIcon />
                        </ToggleText>
                    </SlideToggle>
                </RightSection>

                {/* Hamburger icon for mobile view */}
                <Hamburger
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menu"
                >
                    {menuOpen ? "✕" : "☰"}
                </Hamburger>
            </NavContainer>

            {/* Mobile Menu Dropdown */}
            <MobileDropdown $open={menuOpen}>
                <MobileLink to="/characters" onClick={() => setMenuOpen(false)}>
                    {t("nav_characters")}
                </MobileLink>
                <MobileLink to="/episodes" onClick={() => setMenuOpen(false)}>
                    {t("nav_episodes")}
                </MobileLink>
                <MobileLink to="/locations" onClick={() => setMenuOpen(false)}>
                    {t("nav_locations")}
                </MobileLink>
                <MobileLink to="/squad" onClick={() => setMenuOpen(false)}>
                    {t("nav_squad")}
                </MobileLink>

                <MobileControlRow>
                    <SlideToggle
                        onClick={() => setLang(lang === "pt" ? "en" : "pt")}
                        $width="84px"
                    >
                        <SlideIndicator
                            animate={{ x: lang === "en" ? "100%" : "0%" }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                            }}
                        />
                        <ToggleText $isActive={lang === "pt"}>PT</ToggleText>
                        <ToggleText $isActive={lang === "en"}>EN</ToggleText>
                    </SlideToggle>

                    <SlideToggle
                        onClick={toggleTheme}
                        $width="84px"
                        aria-label={
                            lang === "pt"
                                ? "Alternar tema claro e escuro"
                                : "Toggle light and dark theme"
                        }
                    >
                        <SlideIndicator
                            animate={{ x: mode === "dark" ? "100%" : "0%" }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                            }}
                        />
                        <ToggleText
                            $isActive={mode !== "dark"}
                            title={lang === "pt" ? "Claro" : "Light"}
                        >
                            <SunIcon />
                        </ToggleText>
                        <ToggleText
                            $isActive={mode === "dark"}
                            title={lang === "pt" ? "Escuro" : "Dark"}
                        >
                            <MoonIcon />
                        </ToggleText>
                    </SlideToggle>
                </MobileControlRow>
            </MobileDropdown>
        </Nav>
    );
}
