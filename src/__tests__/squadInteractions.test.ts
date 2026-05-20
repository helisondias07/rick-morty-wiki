import { describe, expect, it } from "vitest";
import {
    getAddInteraction,
    getRemoveInteraction,
} from "../context/SquadContext";
import { Character } from "../types";

function makeCharacter(
    id: number,
    name: string,
    overrides: Partial<Character> = {},
): Character {
    return {
        id,
        name,
        status: "Alive",
        species: "Human",
        type: "",
        gender: "unknown",
        image: "",
        url: "",
        created: "",
        location: { name: "Earth", url: "" },
        origin: { name: "Earth", url: "" },
        episode: [],
        ...overrides,
    };
}

describe("Squad interactions", () => {
    it("creates a warning interaction when Jerry joins a squad with Rick", () => {
        const interaction = getAddInteraction(
            [makeCharacter(1, "Rick Sanchez")],
            makeCharacter(2, "Jerry Smith"),
        );

        expect(interaction).not.toBeNull();
        expect(interaction?.speaker).toBe("rick");
        expect(interaction?.tone).toBe("warning");
        expect([
            "O JERRY? É SÉRIO? VOCÊ VAI COLOCAR O JERRY NISSO?",
            "Misturar Rick com Jerry no mesmo time devia exigir autorização intergaláctica.",
            "Ótimo, um gênio e um erro estatístico no mesmo esquadrão. Que combinação elegante.",
        ]).toContain(interaction?.quote.pt);
    });

    it("uses the iconic Evil Morty interaction when he joins the squad", () => {
        const interaction = getAddInteraction(
            [makeCharacter(1, "Morty Smith")],
            makeCharacter(2, "Evil Morty", { species: "Alien" }),
        );

        expect(interaction).not.toBeNull();
        expect(interaction?.speaker).toBe("morty");
        expect(interaction?.tone).toBe("warning");
        expect([
            "Evil Morty no esquadrão? Isso não é reforço, é uma cláusula escondida no contrato com o caos.",
            "Tem um Morty maligno na formação. Excelente, agora até o silêncio do time parece ameaça calculada.",
        ]).toContain(interaction?.quote.pt);
    });

    it("creates a relief interaction for a biologically diverse squad", () => {
        const interaction = getAddInteraction(
            [
                makeCharacter(1, "Arc Trooper", { species: "Human" }),
                makeCharacter(2, "Krombopulos Mike", { species: "Gromflomite" }),
                makeCharacter(3, "Birdperson", { species: "Bird-Person" }),
            ],
            makeCharacter(4, "Gearhead", { species: "Robot" }),
        );

        expect(interaction).not.toBeNull();
        expect(interaction?.speaker).toBe("rick");
        expect(interaction?.tone).toBe("relief");
        expect([
            "Olha só, diversidade real. Finalmente um esquadrão que parece o multiverso em vez de um churrasco suburbano.",
            "Quatro espécies ou mais. Agora isso tem cara de operação interdimensional de verdade.",
            "Heterogêneo, imprevisível e perigosamente funcional. Eu aprovo com relutância.",
        ]).toContain(interaction?.quote.pt);
    });

    it("creates a relief interaction when Jerry is removed and Rick stays", () => {
        const removed = makeCharacter(2, "Jerry Smith");
        const interaction = getRemoveInteraction(removed, [
            makeCharacter(1, "Rick Sanchez"),
        ]);

        expect(interaction).not.toBeNull();
        expect(interaction?.speaker).toBe("rick");
        expect(interaction?.tone).toBe("relief");
        expect([
            "Finalmente uma decisão decente. Remover o Jerry aumentou nossas chances de sobreviver.",
            "Muito bom. Acabamos de cortar 60% da insegurança operacional.",
        ]).toContain(interaction?.quote.pt);
    });
});
