import React, { Component, ReactNode } from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: #0d0d14;
  color: #f0f6fc;
  text-align: center;
  font-family: 'Inter', sans-serif;
  position: relative;
  z-index: 10;
`;

const PortalWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 2rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  svg {
    width: 100%;
    height: 100%;
    animation: spin 6s linear infinite;
    filter: drop-shadow(0 0 15px #97ce4c);
  }
`;

const Message = styled.p`
  font-size: 1.15rem;
  color: #8b949e;
  max-width: 500px;
  margin-top: 1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Button = styled.button`
  background: #97ce4c;
  color: #0d0d14;
  border: none;
  padding: 0.85rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(151, 206, 76, 0.4);
  transition: all 0.2s ease;
  min-height: 44px; /* Acessibilidade: área de toque adequada */

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(151, 206, 76, 0.6);
    background: #66BA4F;
  }
`;

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch() {
    // Keep this hook available for error reporting integrations.
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const savedLang = localStorage.getItem('rm-lang') || 'pt';
      const errorMessage = savedLang === 'pt'
        ? "Algo deu errado. O Rick deve ter explodido o servidor."
        : "Something went wrong. Rick must have blown up the server.";
      const btnLabel = savedLang === 'pt' ? 'Recarregar Portal' : 'Reload Portal';

      return (
        <Container>
          <PortalWrapper>
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="portalGradErr" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#97ce4c" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#66BA4F" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#0d0d14" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#portalGradErr)" />
              <path d="M50 5 C 25 5, 5 25, 5 50 C 5 75, 25 95, 50 95 C 75 95, 95 75, 95 50" stroke="#97ce4c" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            </svg>
          </PortalWrapper>
          <h1 className="page-title">Wubba Lubba Dub Dub!</h1>
          <Message>{errorMessage}</Message>
          <Button onClick={this.handleReload} aria-label={btnLabel}>
            {btnLabel}
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}
