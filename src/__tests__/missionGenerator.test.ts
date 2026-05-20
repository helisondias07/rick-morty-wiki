import { afterEach, describe, expect, it, vi } from "vitest";
import { getRandomMission } from "../pages/SquadPage/squadData";
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

afterEach(() => {
    vi.restoreAllMocks();
});

describe("Mission generator", () => {
    it("avoids immediately repeating the previous planet", () => {
        vi.spyOn(Math, "random").mockReturnValue(0);

        const firstMission = getRandomMission("en", null, []);
        const nextMission = getRandomMission("en", firstMission.planet, []);

        expect(nextMission.planet).not.toBe(firstMission.planet);
    });

    it("adds squad flavor text when the formation has multiple Ricks", () => {
        vi.spyOn(Math, "random").mockReturnValue(0);

        const mission = getRandomMission("en", null, [
            makeCharacter(1, "Rick Sanchez", { species: "Human" }),
            makeCharacter(2, "Rick Prime", { species: "Alien" }),
        ]);

        expect(mission.objective).toContain(
            "Coordinate multiple Ricks without letting the mission devolve into a scientific ego contest.",
        );
        expect(mission.outcome).toContain(
            "The Ricks disagreed about almost everything, which accidentally covered every weakness in the plan.",
        );
    });
});
