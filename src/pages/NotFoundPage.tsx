import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Container = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.background};
`;

const Title = styled.h1`
  font-family: 'Get Schwifty', 'Creepster', cursive;
  color: #08BAE3;
  font-size: clamp(2.5rem, 6vw, 4rem);
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(8, 186, 227, 0.4);
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.textMuted};
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const Badge = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.35rem 0.8rem;
  border-radius: 6px;
  background: rgba(151, 206, 76, 0.15);
  color: #97ce4c;
  display: inline-block;
  margin-bottom: 3rem;
  border: 1px solid rgba(151, 206, 76, 0.3);
`;

const BackButton = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  background: ${({ theme }) => theme.primary};
  color: #0d0d14;
  border: none;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(151, 206, 76, 0.4);
    background: ${({ theme }) => theme.primaryLight};
  }
`;

const PortalSvg = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '2rem', opacity: 0.7 }}>
    <ellipse cx="100" cy="100" rx="90" ry="30" stroke="#448C3F" strokeWidth="6" strokeDasharray="12 12" />
    <ellipse cx="100" cy="100" rx="70" ry="20" stroke="#66BA4F" strokeWidth="4" opacity="0.6" />
    <ellipse cx="100" cy="100" rx="50" ry="10" stroke="#97ce4c" strokeWidth="2" opacity="0.3" />
  </svg>
);

export function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    document.title = `404 | Rick & Morty Wiki`;
  }, []);

  return (
    <Container
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <Title>{t('404_title')}</Title>
      <PortalSvg />
      <Subtitle>{t('404_subtitle')}</Subtitle>
      <Badge>ERRO-404</Badge>
      <br />
      <BackButton onClick={() => navigate('/')}>
        {t('404_back_btn')}
      </BackButton>
    </Container>
  );
}
