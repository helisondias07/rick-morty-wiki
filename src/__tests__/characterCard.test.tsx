import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "../styles/theme";
import { CharacterCard } from "../components/Card";
import { SquadContext } from "../context/SquadContext";
import { LanguageProvider } from "../context/LanguageContext";
import { Character } from "../types";

const mockSquadContext = {
    squad: [],
    addToSquad: vi.fn(),
    removeFromSquad: vi.fn(),
    clearSquad: vi.fn(),
    isInSquad: vi.fn(() => false),
    isFull: false,
};

const mockCharacter: Character = {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
    url: "https://rickandmortyapi.com/api/character/1",
    created: "",
    location: { name: "Citadel of Ricks", url: "" },
    origin: { name: "Earth (C-137)", url: "" },
    episode: [],
};

function renderCard(
    character: Character = mockCharacter,
    onPreview?: (character: Character) => void,
) {
    return render(
        <ThemeProvider theme={lightTheme}>
            <LanguageProvider>
                <SquadContext.Provider value={mockSquadContext}>
                    <CharacterCard
                        character={character}
                        onPreview={onPreview}
                    />
                </SquadContext.Provider>
            </LanguageProvider>
        </ThemeProvider>,
    );
}

describe("CharacterCard", () => {
    it("renders the character name", () => {
        renderCard();
        expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    });

    it("renders the character status in Portuguese by default", () => {
        renderCard();
        expect(screen.getByText("Vivo")).toBeInTheDocument();
    });

    it("renders the character species", () => {
        renderCard();
        expect(screen.getByText("Humano")).toBeInTheDocument();
    });

    it("renders the location name", () => {
        renderCard();
        expect(screen.getByText(/Cidadela dos Ricks/)).toBeInTheDocument();
    });

    it("renders add to squad button when not in squad in Portuguese", () => {
        renderCard();
        expect(
            screen.getByRole("button", { name: /adicionar ao esquadrão/i }),
        ).toBeInTheDocument();
    });

    it('shows "No Esquadrão" button when character is in squad in Portuguese', () => {
        const inSquadContext = {
            ...mockSquadContext,
            isInSquad: vi.fn(() => true),
        };
        render(
            <ThemeProvider theme={lightTheme}>
                <LanguageProvider>
                    <SquadContext.Provider value={inSquadContext}>
                        <CharacterCard character={mockCharacter} />
                    </SquadContext.Provider>
                </LanguageProvider>
            </ThemeProvider>,
        );
        expect(screen.getByText("No Esquadrão")).toBeInTheDocument();
    });

    it("shows the limit message when squad is full and character is not in it", () => {
        const fullContext = { ...mockSquadContext, isFull: true };
        render(
            <ThemeProvider theme={lightTheme}>
                <LanguageProvider>
                    <SquadContext.Provider value={fullContext}>
                        <CharacterCard character={mockCharacter} />
                    </SquadContext.Provider>
                </LanguageProvider>
            </ThemeProvider>,
        );
        expect(screen.getByText("Limite atingido")).toBeInTheDocument();
    });

    it("calls preview handler when the card is clicked", async () => {
        const user = userEvent.setup();
        const handlePreview = vi.fn();

        renderCard(mockCharacter, handlePreview);

        await user.click(
            screen.getByRole("button", {
                name: /ver detalhes de rick sanchez/i,
            }),
        );

        expect(handlePreview).toHaveBeenCalledWith(mockCharacter);
    });
});
