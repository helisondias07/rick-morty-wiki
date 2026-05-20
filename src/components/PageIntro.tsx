import React from "react";
import styled from "styled-components";

const Wrapper = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.25rem;
    margin-bottom: 1.25rem;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.9rem;
        margin-bottom: 1rem;
    }
`;

const Copy = styled.div`
    min-width: 0;
`;

export const IntroEyebrow = styled.span`
    display: inline-block;
    margin-bottom: 0.3rem;
    color: ${({ theme }) => theme.primaryDeep};
    font-size: 0.75rem;
    font-weight: 900;
    letter-spacing: 0.16em;
    text-transform: uppercase;
`;

export const IntroTitle = styled.h1.attrs({ className: "page-title" })`
    margin: 0;
    line-height: 0.95;
`;

export const IntroSubtitle = styled.p`
    margin-top: 0.45rem;
    color: ${({ theme }) => theme.textMuted};
    font-size: clamp(0.92rem, 1.3vw, 1rem);
    line-height: 1.45;
    max-width: 62ch;
`;

const Actions = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        width: 100%;
        justify-content: flex-start;
    }
`;

interface PageIntroProps {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    eyebrow?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}

export function PageIntro({
    title,
    subtitle,
    eyebrow,
    actions,
    className,
}: PageIntroProps) {
    return (
        <Wrapper className={className}>
            <Copy>
                {eyebrow ? <IntroEyebrow>{eyebrow}</IntroEyebrow> : null}
                <IntroTitle>{title}</IntroTitle>
                {subtitle ? <IntroSubtitle>{subtitle}</IntroSubtitle> : null}
            </Copy>
            {actions ? <Actions>{actions}</Actions> : null}
        </Wrapper>
    );
}
