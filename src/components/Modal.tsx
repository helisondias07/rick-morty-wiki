import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

const Overlay = styled(motion.div)`
    position: fixed;
    inset: 0;
    background: ${({ theme }) => theme.overlayBg};
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(0.75rem, 2vw, 1.25rem);
    overflow: hidden;
    overscroll-behavior: contain;
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);

    @media (max-width: 768px) {
        align-items: flex-start;
        padding: 0.5rem;
    }
`;

const ModalBox = styled(motion.div)`
    background: ${({ theme }) => theme.surfaceCard || theme.surface};
    border-radius: 20px;
    border: 1px solid ${({ theme }) => theme.border};
    width: min(800px, calc(100vw - 2rem));
    max-height: calc(100vh - 2rem);
    max-height: calc(100dvh - 2rem);
    overflow: hidden;
    position: relative;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
    margin: auto;
    display: flex;
    flex-direction: column;

    @media (max-width: 1024px) {
        width: min(92vw, 800px);
        max-height: calc(100vh - 2rem);
        max-height: calc(100dvh - 2rem);
        border-radius: 18px;
    }

    @media (max-width: 768px) {
        width: min(94vw, 32rem);
        max-height: calc(100vh - 1rem);
        max-height: calc(100dvh - 1rem);
        border-radius: 16px;
    }

    @media (max-width: 480px) {
        width: min(94vw, 100vw);
        max-height: calc(100vh - 0.5rem);
        max-height: calc(100dvh - 0.5rem);
        border-radius: 14px;
    }
`;

const Header = styled.div`
    padding: 1.5rem 1.5rem 0.5rem;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    @media (max-width: 768px) {
        padding: 1rem 1rem 0.4rem;
        gap: 0.75rem;
    }

    @media (max-width: 480px) {
        align-items: flex-start;
    }
`;

const Title = styled.h2`
    font-size: clamp(1.1rem, 4vw, 1.4rem);
    font-weight: 700;
    color: #08bae3;
    text-shadow: 0 0 10px rgba(8, 186, 227, 0.2);
    line-height: 1.3;
    min-width: 0;
    word-break: break-word;

    @media (max-width: 768px) {
        font-size: 1rem;
        line-height: 1.25;
    }
`;

const CloseButton = styled.button`
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(151, 206, 76, 0.15);
    color: #97ce4c;
    font-size: 1.2rem;
    flex-shrink: 0;
    transition: all 0.2s ease;
    min-height: 44px; /* Acessibilidade: área de toque adequada */

    &:hover {
        background: #e05a47;
        color: #fff;
    }

    @media (max-width: 768px) {
        width: 34px;
        height: 34px;
        font-size: 1rem;
    }
`;

const Body = styled.div`
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
    overscroll-behavior: contain;

    @media (max-width: 768px) {
        padding: 0.9rem;
        padding-bottom: max(0.9rem, env(safe-area-inset-bottom));
    }

    @media (max-width: 480px) {
        padding: 0.8rem;
        padding-bottom: max(0.8rem, env(safe-area-inset-bottom));
    }
`;

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // fecha o modal ao apertar a tecla ESC, foca ciclicamente (Focus Trap) e trava o scroll do body
    useEffect(() => {
        if (!isOpen) return;

        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onClose();
                return;
            }

            if (e.key === "Tab") {
                if (!modalRef.current) return;
                const focusableElements = modalRef.current.querySelectorAll(
                    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length === 0) return;

                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey) {
                    if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        }

        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";

        // Trazer o foco para o modal logo após renderizar para que o focus trap inicie do lugar certo
        const timer = setTimeout(() => {
            if (modalRef.current) modalRef.current.focus();
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <Overlay
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                    aria-modal="true"
                    role="dialog"
                >
                    <ModalBox
                        ref={modalRef}
                        tabIndex={-1}
                        initial={{ opacity: 0, scale: 0.94, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 30 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ outline: "none" }}
                    >
                        <Header>
                            <Title>{title}</Title>
                            <CloseButton
                                onClick={onClose}
                                aria-label="Fechar"
                                autoFocus // Acessibilidade: foca o botão ao abrir
                            >
                                ✕
                            </CloseButton>
                        </Header>
                        <Body>{children}</Body>
                    </ModalBox>
                </Overlay>
            )}
        </AnimatePresence>
    );
}
