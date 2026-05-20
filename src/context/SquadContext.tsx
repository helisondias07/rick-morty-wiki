import React, { createContext, useState, useCallback, ReactNode } from "react";
import { Character } from "../types";

const MAX_SQUAD = 5;

type MainCharacterKey = "rick" | "morty" | "summer" | "beth" | "jerry";
type InteractionTone = "neutral" | "warning" | "relief";

type LocalizedQuote = {
    pt: string;
    en: string;
};

interface SquadInteractionDetail {
    speaker: MainCharacterKey;
    tone?: InteractionTone;
    quote: LocalizedQuote;
}

interface SquadContextValue {
    squad: Character[];
    addToSquad: (character: Character) => void;
    removeFromSquad: (id: number) => void;
    clearSquad: () => void;
    isInSquad: (id: number) => boolean;
    isFull: boolean;
}

export const SquadContext = createContext<SquadContextValue | null>(null);

const MAIN_CHARACTER_BY_NAME: Record<string, MainCharacterKey> = {
    "rick sanchez": "rick",
    "morty smith": "morty",
    "summer smith": "summer",
    "beth smith": "beth",
    "jerry smith": "jerry",
};

function normalizeName(name: string) {
    return name.trim().toLowerCase();
}

function getMainCharacterKey(character: Character): MainCharacterKey | null {
    return MAIN_CHARACTER_BY_NAME[normalizeName(character.name)] ?? null;
}

function hasNameToken(members: Character[], token: string) {
    return members.some((member) => normalizeName(member.name).includes(token));
}

function countMembersByToken(members: Character[], token: string) {
    return members.filter((member) =>
        normalizeName(member.name).includes(token),
    ).length;
}

function countHumans(members: Character[]) {
    return members.filter((member) => member.species === "Human").length;
}

function countDead(members: Character[]) {
    return members.filter((member) => member.status === "Dead").length;
}

function countSmithFamily(members: Character[]) {
    return members.filter((member) =>
        normalizeName(member.name).includes("smith"),
    ).length;
}

function uniqueSpeciesCount(members: Character[]) {
    return new Set(members.map((member) => member.species)).size;
}

function hashString(value: string) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
        hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }
    return hash;
}

function dispatchInteraction(detail: SquadInteractionDetail) {
    window.dispatchEvent(
        new CustomEvent<SquadInteractionDetail>("squad-character-interaction", {
            detail,
        }),
    );
}

function pickQuote(options: LocalizedQuote[], seed: number) {
    return options[seed % options.length];
}

function createInteraction(
    speaker: MainCharacterKey,
    options: LocalizedQuote[],
    seed: number,
    tone: InteractionTone = "neutral",
): SquadInteractionDetail {
    return {
        speaker,
        tone,
        quote: pickQuote(options, seed),
    };
}

function hasExactName(members: Character[], exactName: string) {
    return members.some((member) => normalizeName(member.name) === exactName);
}

function getIconicCharacterInteraction(
    prev: Character[],
    next: Character[],
    added: Character,
    seed: number,
): SquadInteractionDetail | null {
    const addedName = normalizeName(added.name);

    if (
        addedName === "evil morty" ||
        (addedName.includes("morty") && hasExactName(prev, "evil morty"))
    ) {
        return createInteraction(
            "morty",
            [
                {
                    pt: "Evil Morty no esquadrão? Isso não é reforço, é uma cláusula escondida no contrato com o caos.",
                    en: "Evil Morty on the squad? That is not reinforcement, that is a hidden clause in chaos itself.",
                },
                {
                    pt: "Tem um Morty maligno na formação. Excelente, agora até o silêncio do time parece ameaça calculada.",
                    en: "There is an Evil Morty in the formation. Great, now even the team silence feels like a calculated threat.",
                },
            ],
            seed,
            "warning",
        );
    }

    if (
        addedName.includes("birdperson") ||
        addedName.includes("phoenixperson")
    ) {
        return createInteraction(
            "rick",
            [
                {
                    pt: "Birdperson entrando. Finalmente alguém com presença tática e quantidade administrável de drama existencial.",
                    en: "Birdperson joining. Finally, someone with tactical presence and a manageable amount of existential drama.",
                },
                {
                    pt: "Birdperson no time. Bom. Agora temos honra, melancolia e poder de fogo cerimonial.",
                    en: "Birdperson on the team. Good. Now we have honor, melancholy and ceremonial firepower.",
                },
            ],
            seed,
            "relief",
        );
    }

    if (addedName.includes("squanch")) {
        return createInteraction(
            "rick",
            [
                {
                    pt: "Squanchy no time. Isso aumenta a agressividade operacional e reduz a sobriedade geral.",
                    en: "Squanchy on the team. That raises operational aggression and lowers overall sobriety.",
                },
                {
                    pt: "Tá, com Squanchy junto a missão ficou menos elegante e muito mais divertida.",
                    en: "Okay, with Squanchy around the mission got less elegant and much more fun.",
                },
            ],
            seed,
            "relief",
        );
    }

    if (addedName.includes("mr. meeseeks") || addedName.includes("meeseeks")) {
        return createInteraction(
            "jerry",
            [
                {
                    pt: "Meeseeks no esquadrão? Ah não... isso sempre começa útil e termina em gritaria educativa.",
                    en: "Meeseeks on the squad? Oh no... that always starts useful and ends in educational screaming.",
                },
                {
                    pt: "Um Mr. Meeseeks entrou. Então a missão agora tem prazo curto e colapso emocional embutido.",
                    en: "A Mr. Meeseeks just joined. So the mission now has a short deadline and built-in emotional collapse.",
                },
            ],
            seed,
            "warning",
        );
    }

    if (addedName.includes("unity")) {
        return createInteraction(
            "rick",
            [
                {
                    pt: "Unity no time. Excelente. Agora a coordenação pode ser perfeita e emocionalmente devastadora.",
                    en: "Unity on the squad. Excellent. Now coordination can be flawless and emotionally devastating.",
                },
                {
                    pt: "Com Unity na missão, pelo menos alguém aqui sabe gerenciar multidões e meus arrependimentos.",
                    en: "With Unity on the mission, at least someone here knows how to manage crowds and my regrets.",
                },
            ],
            seed,
            "relief",
        );
    }

    if (addedName.includes("noob-noob")) {
        return createInteraction(
            "rick",
            [
                {
                    pt: "Noob-Noob? Tá aí uma adição que eu respeito mais do que deveria.",
                    en: "Noob-Noob? That is an addition I respect more than I should.",
                },
                {
                    pt: "Noob-Noob entrou. Isso por algum motivo aumenta o moral do time em 12%.",
                    en: "Noob-Noob joined. For some reason that raises squad morale by 12%.",
                },
            ],
            seed,
            "relief",
        );
    }

    if (addedName.includes("abradolf lincler")) {
        return createInteraction(
            "summer",
            [
                {
                    pt: "Abradolf Lincler no esquadrão? Isso parece erro histórico armado até os dentes.",
                    en: "Abradolf Lincler on the squad? That sounds like an armed historical mistake.",
                },
                {
                    pt: "Legal, agora temos um dilema moral ambulante com potencial de explosão.",
                    en: "Cool, now we have a walking moral dilemma with explosive potential.",
                },
            ],
            seed,
            "warning",
        );
    }

    if (
        addedName.includes("pickle rick") ||
        (addedName.includes("pickle") && countMembersByToken(next, "rick") >= 2)
    ) {
        return createInteraction(
            "rick",
            [
                {
                    pt: "Pickle Rick detectado. Isso não ajuda taticamente tanto quanto ajuda meu ego, o que já basta.",
                    en: "Pickle Rick detected. That does not help tactically as much as it helps my ego, which is already enough.",
                },
                {
                    pt: "Temos um Rick em formato de picles. A missão oficialmente entrou na zona de excelência questionável.",
                    en: "We have a Rick in pickle form. The mission has officially entered the questionable excellence zone.",
                },
            ],
            seed,
            "relief",
        );
    }

    if (
        hasExactName(next, "evil morty") &&
        countMembersByToken(next, "morty") >= 2
    ) {
        return createInteraction(
            "morty",
            [
                {
                    pt: "Morty comum com Evil Morty no mesmo time? Isso é literalmente como pesadelos ganham orçamento.",
                    en: "A regular Morty with Evil Morty on the same team? That is literally how nightmares get funding.",
                },
                {
                    pt: "Tem mais de um Morty e um deles é o pior cenário possível. Excelente, ótimo, maravilhoso.",
                    en: "There is more than one Morty and one of them is the worst possible version. Great, fantastic, wonderful.",
                },
            ],
            seed,
            "warning",
        );
    }

    return null;
}

export function getAddInteraction(
    prev: Character[],
    added: Character,
): SquadInteractionDetail | null {
    const next = [...prev, added];
    const seed = hashString(
        `${next.map((member) => `${member.id}:${member.name}`).join("|")}|add:${added.id}`,
    );
    const addedName = normalizeName(added.name);
    const addedKey = getMainCharacterKey(added);
    const addedIsRick = addedName.includes("rick");
    const addedIsMorty = addedName.includes("morty");
    const addedIsSummer = addedName.includes("summer");
    const addedIsBeth = addedName.includes("beth");
    const addedIsJerry = addedName.includes("jerry");
    const hasRick = hasNameToken(prev, "rick");
    const hasMorty = hasNameToken(prev, "morty");
    const hasSummer = hasNameToken(prev, "summer");
    const hasBeth = hasNameToken(prev, "beth");
    const hasJerry = hasNameToken(prev, "jerry");
    const mortyCount = countMembersByToken(next, "morty");
    const rickCount = countMembersByToken(next, "rick");
    const jerryCount = countMembersByToken(next, "jerry");
    const humanCount = countHumans(next);
    const deadCount = countDead(next);
    const smithCount = countSmithFamily(next);
    const speciesCount = uniqueSpeciesCount(next);
    const iconicInteraction = getIconicCharacterInteraction(
        prev,
        next,
        added,
        seed,
    );

    if (iconicInteraction) {
        return iconicInteraction;
    }

    if ((addedIsJerry && hasRick) || (addedIsRick && hasJerry)) {
        return createInteraction(
            "rick",
            [
                {
                    pt: "O JERRY? É SÉRIO? VOCÊ VAI COLOCAR O JERRY NISSO?",
                    en: "JERRY? SERIOUSLY? YOU ARE PUTTING JERRY ON THIS THING?",
                },
                {
                    pt: "Misturar Rick com Jerry no mesmo time devia exigir autorização intergaláctica.",
                    en: "Putting Rick and Jerry on the same team should require intergalactic authorization.",
                },
                {
                    pt: "Ótimo, um gênio e um erro estatístico no mesmo esquadrão. Que combinação elegante.",
                    en: "Great, a genius and a statistical mistake in the same squad. Elegant combination.",
                },
            ],
            seed,
            "warning",
        );
    }

    if (addedIsMorty && mortyCount >= 2) {
        return createInteraction(
            "morty",
            [
                {
                    pt: "Dois Mortys? Isso nunca acaba com terapia suficiente. Nunca.",
                    en: "Two Mortys? There is never enough therapy for that. Never.",
                },
                {
                    pt: "Tem mais de um Morty aqui. Isso parece exatamente o tipo de ideia que explode uma realidade.",
                    en: "There is more than one Morty here. That sounds exactly like the kind of idea that blows up a reality.",
                },
                {
                    pt: "Outro Morty? Ah não. Isso vai virar competição de pânico dimensional, né?",
                    en: "Another Morty? Oh no. This is turning into dimensional panic competition, right?",
                },
            ],
            seed,
            "warning",
        );
    }

    if (addedIsRick && rickCount >= 2) {
        return createInteraction(
            "rick",
            [
                {
                    pt: "Dois Ricks no mesmo esquadrão. Isso ou salva a missão ou apaga a linha do tempo. Sem meio-termo.",
                    en: "Two Ricks on the same squad. This either saves the mission or erases the timeline. No middle ground.",
                },
                {
                    pt: "Outro Rick? Finalmente alguém com chance mínima de acompanhar meu raciocínio.",
                    en: "Another Rick? Finally someone with the slightest chance of keeping up with my thinking.",
                },
                {
                    pt: "Ricks múltiplos detectados. Ego crítico. Potência de fogo aceitável.",
                    en: "Multiple Ricks detected. Critical ego levels. Acceptable firepower.",
                },
            ],
            seed,
            "relief",
        );
    }

    if (addedIsJerry && jerryCount >= 2) {
        return createInteraction(
            "summer",
            [
                {
                    pt: "Dois Jerrys? Então o plano agora é sobreviver apesar da equipe, né?",
                    en: "Two Jerrys? So the plan now is to survive despite the team, right?",
                },
                {
                    pt: "Duplicar Jerry não conta como estratégia. Conta como condição climática ruim.",
                    en: "Doubling Jerry is not strategy. It is bad weather.",
                },
                {
                    pt: "Legal, dois Jerrys. Se aparecer um botão brilhando, segura as mãos dos dois.",
                    en: "Cool, two Jerrys. If a glowing button appears, hold both their hands.",
                },
            ],
            seed,
            "warning",
        );
    }

    if ((addedIsRick && hasMorty) || (addedIsMorty && hasRick)) {
        return createInteraction(
            "morty",
            [
                {
                    pt: "Eu sabia que isso ia virar trabalho não remunerado em outra dimensão.",
                    en: "I knew this was going to become unpaid work in another dimension.",
                },
                {
                    pt: "Ótimo, Rick e Morty na mesma equipe. O universo nunca aprende mesmo.",
                    en: "Great, Rick and Morty on the same team. The universe never learns.",
                },
                {
                    pt: "Isso tem muita cara de “Missão simples, Morty” e depois alguém perde um braço quântico.",
                    en: "This has strong “Simple mission, Morty” energy right before someone loses a quantum arm.",
                },
            ],
            seed,
        );
    }

    if ((addedIsSummer && hasRick) || (addedIsRick && hasSummer)) {
        return createInteraction(
            "summer",
            [
                {
                    pt: "Finalmente uma missão com sarcasmo, tecnologia ilegal e alguma chance de eu salvar todo mundo.",
                    en: "Finally, a mission with sarcasm, illegal tech and a chance for me to save everyone.",
                },
                {
                    pt: "Rick e Summer? Agora sim isso parece uma operação com estilo e crimes suficientes.",
                    en: "Rick and Summer? Now this feels like an operation with style and enough crimes.",
                },
                {
                    pt: "Tá, isso eu aceito. Pelo menos metade do time sabe improvisar sob fogo alienígena.",
                    en: "Okay, this I can work with. At least half the team can improvise under alien fire.",
                },
            ],
            seed,
            "relief",
        );
    }

    if ((addedIsBeth && hasRick) || (addedIsRick && hasBeth)) {
        return createInteraction(
            "beth",
            [
                {
                    pt: "Pai, se isso terminar em trauma familiar, eu vou fingir que estou surpresa.",
                    en: "Dad, if this ends in family trauma, I will pretend to be surprised.",
                },
                {
                    pt: "Rick e Beth no mesmo arquivo. Isso explica a competência e o dano emocional.",
                    en: "Rick and Beth in the same file. That explains the competence and the emotional damage.",
                },
                {
                    pt: "Ótimo. Agora além de missão interdimensional, isso também virou questão paterna mal resolvida.",
                    en: "Great. Besides an interdimensional mission, this is now unresolved father-daughter business.",
                },
            ],
            seed,
        );
    }

    if ((addedIsBeth && hasJerry) || (addedIsJerry && hasBeth)) {
        return createInteraction(
            "beth",
            [
                {
                    pt: "Jerry, tenta não transformar apoio emocional em risco dimensional.",
                    en: "Jerry, try not to turn emotional support into dimensional risk.",
                },
                {
                    pt: "Se o Jerry tocar em alguma alavanca alienígena, eu finjo que não conheço ninguém aqui.",
                    en: "If Jerry touches any alien lever, I am pretending I do not know anyone here.",
                },
                {
                    pt: "Perfeito. Casamento, caos e alguma criatura com tentáculos. Clássico.",
                    en: "Perfect. Marriage, chaos and some tentacled creature. Classic.",
                },
            ],
            seed,
        );
    }

    if ((addedIsSummer && hasMorty) || (addedIsMorty && hasSummer)) {
        return createInteraction(
            "summer",
            [
                {
                    pt: "Morty, fica perto. Se der errado, pelo menos a culpa parece sua.",
                    en: "Morty, stay close. If it goes wrong, at least it looks like your fault.",
                },
                {
                    pt: "Summer com Morty? Agora a missão tem testemunha e bode expiatório.",
                    en: "Summer with Morty? Now the mission has a witness and a scapegoat.",
                },
                {
                    pt: "Ótimo, irmão mais novo na equipe. Isso reduz a dignidade, mas aumenta o entretenimento.",
                    en: "Great, little brother on the team. That lowers dignity, but boosts entertainment.",
                },
            ],
            seed,
        );
    }

    if ((addedIsJerry && hasMorty) || (addedIsMorty && hasJerry)) {
        return createInteraction(
            "morty",
            [
                {
                    pt: "Pai, por favor não negocia com nenhuma entidade brilhante hoje.",
                    en: "Dad, please do not negotiate with any glowing entity today.",
                },
                {
                    pt: "Tudo bem, eu consigo lidar com monstros cósmicos. O problema é o meu pai improvisando.",
                    en: "I can deal with cosmic monsters. My problem is my dad improvising.",
                },
                {
                    pt: "Isso seria menos assustador se o perigo fosse só alienígena.",
                    en: "This would be less scary if the danger was only alien.",
                },
            ],
            seed,
            "warning",
        );
    }

    if ((addedIsBeth && hasSummer) || (addedIsSummer && hasBeth)) {
        return createInteraction(
            "summer",
            [
                {
                    pt: "Mãe no esquadrão? Legal. Agora isso parece terapia com explosões.",
                    en: "Mom in the squad? Cool. Now this feels like therapy with explosions.",
                },
                {
                    pt: "Summer e Beth juntas? Isso parece uma missão eficiente e passivo-agressiva.",
                    en: "Summer and Beth together? This looks efficient and passive-aggressive.",
                },
                {
                    pt: "Beleza, agora temos estratégia, julgamento e décadas de assunto mal resolvido.",
                    en: "Nice, now we have strategy, judgment and decades of unresolved issues.",
                },
            ],
            seed,
        );
    }

    if ((addedIsBeth && hasMorty) || (addedIsMorty && hasBeth)) {
        return createInteraction(
            "beth",
            [
                {
                    pt: "Morty, se seu avô te entregar um dispositivo, pergunta primeiro se explode.",
                    en: "Morty, if your grandfather hands you a device, ask if it explodes first.",
                },
                {
                    pt: "Morty no time eu entendo. O que eu não entendo é por que isso sempre vira crise médica.",
                    en: "Morty on the team I understand. What I do not understand is why this always becomes a medical crisis.",
                },
                {
                    pt: "Só me promete uma coisa, Morty: nenhum fluido alienígena sem etiqueta.",
                    en: "Just promise me one thing, Morty: no unlabeled alien fluids.",
                },
            ],
            seed,
        );
    }

    if ((addedIsJerry && hasSummer) || (addedIsSummer && hasJerry)) {
        return createInteraction(
            "summer",
            [
                {
                    pt: "Pai, modo sobrevivência: respira, não discursa e não aperta botões.",
                    en: "Dad, survival mode: breathe, do not give speeches and do not press buttons.",
                },
                {
                    pt: "Summer com Jerry? Isso exige plano A, plano B e um plano para impedir o Jerry.",
                    en: "Summer with Jerry? That requires plan A, plan B and one plan specifically to stop Jerry.",
                },
                {
                    pt: "Tá, eu cuido da missão. Você cuida de não envergonhar a espécie humana, pai.",
                    en: "Fine, I will handle the mission. You handle not embarrassing the human species, dad.",
                },
            ],
            seed,
            "warning",
        );
    }

    if (added.status === "Dead" && deadCount >= 2) {
        return createInteraction(
            "rick",
            [
                {
                    pt: "Dois mortos no esquadrão. Excelente. Agora a logística inclui necromancia improvisada.",
                    en: "Two dead members on the squad. Excellent. Now logistics includes improvised necromancy.",
                },
                {
                    pt: "Você realmente está empilhando cadáveres táticos. Isso é ousado até pros meus padrões.",
                    en: "You are really stacking tactical corpses. That is bold even by my standards.",
                },
                {
                    pt: "Mais um morto? Tá bom. Se ninguém respirar, pelo menos ninguém reclama.",
                    en: "Another dead one? Fine. If nobody breathes, at least nobody complains.",
                },
            ],
            seed,
            "warning",
        );
    }

    if (speciesCount >= 4) {
        return createInteraction(
            "rick",
            [
                {
                    pt: "Olha só, diversidade real. Finalmente um esquadrão que parece o multiverso em vez de um churrasco suburbano.",
                    en: "Look at that, actual diversity. Finally a squad that resembles the multiverse instead of a suburban cookout.",
                },
                {
                    pt: "Quatro espécies ou mais. Agora isso tem cara de operação interdimensional de verdade.",
                    en: "Four species or more. Now this actually looks like a real interdimensional operation.",
                },
                {
                    pt: "Heterogêneo, imprevisível e perigosamente funcional. Eu aprovo com relutância.",
                    en: "Heterogeneous, unpredictable and dangerously functional. I reluctantly approve.",
                },
            ],
            seed,
            "relief",
        );
    }

    if (humanCount >= 4) {
        return createInteraction(
            "rick",
            [
                {
                    pt: "Quase todo mundo humano. Isso não é um esquadrão, é fila de mercado com trauma espacial.",
                    en: "Almost everyone is human. This is not a squad, it is a grocery line with space trauma.",
                },
                {
                    pt: "Muita humanidade junta. Se aparecer tecnologia avançada, alguém vai lamber.",
                    en: "Too much humanity in one place. If advanced technology shows up, someone will lick it.",
                },
                {
                    pt: "Todos esses humanos no mesmo time... incrível como a mediocridade se organiza.",
                    en: "All these humans on the same team... amazing how mediocrity organizes itself.",
                },
            ],
            seed,
            "warning",
        );
    }

    if (smithCount >= 4) {
        return createInteraction(
            "beth",
            [
                {
                    pt: "Isso parou de ser um esquadrão e virou reunião de família com armamento indevido.",
                    en: "This stopped being a squad and turned into a family meeting with inappropriate weapons.",
                },
                {
                    pt: "Tem Smith demais nesse arquivo. Se der errado, a terapia vai ficar caríssima.",
                    en: "There are too many Smiths in this file. If this goes wrong, therapy is getting expensive.",
                },
                {
                    pt: "É oficial: isso agora é um problema hereditário com passe interdimensional.",
                    en: "It is official: this is now a hereditary problem with interdimensional clearance.",
                },
            ],
            seed,
        );
    }

    if (next.length === MAX_SQUAD) {
        return createInteraction(
            "rick",
            [
                {
                    pt: "Cinco vagas preenchidas. Agora sim temos gente suficiente pra culpar quando tudo der errado.",
                    en: "Five slots filled. Now we finally have enough people to blame when everything goes wrong.",
                },
                {
                    pt: "Esquadrão completo. Estatisticamente eficiente, emocionalmente insustentável. Perfeito.",
                    en: "Full squad. Statistically efficient, emotionally unsustainable. Perfect.",
                },
                {
                    pt: "Capacidade máxima atingida. Isso ou vira lenda multiversal ou processo coletivo.",
                    en: "Maximum capacity reached. This either becomes multiversal legend or a class action lawsuit.",
                },
            ],
            seed,
            "relief",
        );
    }

    if (addedKey === "rick") {
        return createInteraction(
            "rick",
            [
                {
                    pt: "Boa. Agora a equipe tem pelo menos um cérebro funcional.",
                    en: "Good. Now the team has at least one functional brain.",
                },
                {
                    pt: "Adicionando Rick ao time? Finalmente alguém teve uma ideia utilizável.",
                    en: "Adding Rick to the squad? Finally someone had a usable idea.",
                },
            ],
            seed,
            "relief",
        );
    }

    if (addedKey === "morty") {
        return createInteraction(
            "morty",
            [
                {
                    pt: "Tá bom... eu entro. Mas se tiver aranhas telepáticas eu vou reclamar o tempo todo.",
                    en: "Fine... I am in. But if there are telepathic spiders, I am complaining the whole time.",
                },
                {
                    pt: "Eu só espero que isso seja uma missão curta e com poucas secreções alienígenas.",
                    en: "I just hope this is a short mission with minimal alien secretions.",
                },
            ],
            seed,
        );
    }

    if (addedKey === "summer") {
        return createInteraction(
            "summer",
            [
                {
                    pt: "Boa escolha. Finalmente alguém que entende estética tática e caos funcional.",
                    en: "Good pick. Finally someone who understands tactical style and functional chaos.",
                },
                {
                    pt: "Summer entrando. As chances de sucesso e deboche subiram ao mesmo tempo.",
                    en: "Summer joining. Success odds and sarcasm levels just went up together.",
                },
            ],
            seed,
            "relief",
        );
    }

    if (addedKey === "beth") {
        return createInteraction(
            "beth",
            [
                {
                    pt: "Ótimo. Alguém aqui finalmente sabe improvisar sem perder completamente a dignidade.",
                    en: "Great. Someone here finally knows how to improvise without completely losing dignity.",
                },
                {
                    pt: "Beth no time. Agora temos medicina, trauma e algum senso de responsabilidade.",
                    en: "Beth on the team. Now we have medicine, trauma and some sense of responsibility.",
                },
            ],
            seed,
        );
    }

    if (addedKey === "jerry") {
        return createInteraction(
            "jerry",
            [
                {
                    pt: "Ei, eu posso ser útil. Tipo... emocionalmente. Às vezes. Talvez.",
                    en: "Hey, I can be useful. Emotionally. Sometimes. Maybe.",
                },
                {
                    pt: "Certo, eu entrei no esquadrão. Isso parece uma oportunidade de crescimento pessoal, né?",
                    en: "Okay, I made the squad. This feels like a personal growth opportunity, right?",
                },
            ],
            seed,
        );
    }

    return null;
}

export function getRemoveInteraction(
    removed: Character | undefined,
    next: Character[],
): SquadInteractionDetail | null {
    if (!removed) return null;

    const removedName = normalizeName(removed.name);
    const removedKey = getMainCharacterKey(removed);
    const stillHasRick = hasNameToken(next, "rick");
    const stillHasMorty = hasNameToken(next, "morty");
    const stillHasSummer = hasNameToken(next, "summer");
    const seed = hashString(
        `${next.map((member) => `${member.id}:${member.name}`).join("|")}|remove:${removed.id}`,
    );

    if (removedName.includes("jerry") && stillHasRick) {
        return createInteraction(
            "rick",
            [
                {
                    pt: "Finalmente uma decisão decente. Remover o Jerry aumentou nossas chances de sobreviver.",
                    en: "Finally, a decent decision. Removing Jerry improved our survival odds.",
                },
                {
                    pt: "Muito bom. Acabamos de cortar 60% da insegurança operacional.",
                    en: "Excellent. We just cut 60% of the operational insecurity.",
                },
            ],
            seed,
            "relief",
        );
    }

    if (removedName.includes("rick") && stillHasMorty) {
        return createInteraction(
            "morty",
            [
                {
                    pt: "Espera, uma missão sem o Rick? Isso é melhor ou muito pior?",
                    en: "Wait, a mission without Rick? Is that better or much worse?",
                },
                {
                    pt: "Sem o Rick? Isso parece seguro demais pra ser verdade e perigoso demais pra confiar.",
                    en: "No Rick? This feels too safe to be true and too dangerous to trust.",
                },
            ],
            seed,
            "warning",
        );
    }

    if (removedName.includes("morty") && stillHasRick) {
        return createInteraction(
            "rick",
            [
                {
                    pt: "Sem Morty no time. Estatisticamente estranho, emocionalmente conveniente.",
                    en: "No Morty on the team. Statistically weird, emotionally convenient.",
                },
                {
                    pt: "Tiraram o Morty? Bom. Menos grito, mais eficiência.",
                    en: "You removed Morty? Good. Less screaming, more efficiency.",
                },
            ],
            seed,
        );
    }

    if (removedKey === "rick" && stillHasSummer) {
        return createInteraction(
            "summer",
            [
                {
                    pt: "Sem o Rick? Ótimo. Péssimo. Tanto faz, eu já estava carregando a equipe mesmo.",
                    en: "No Rick? Great. Terrible. Whatever, I was already carrying the team.",
                },
                {
                    pt: "Beleza, então agora o plano é improvisar sem o velho maluco. Eu consigo.",
                    en: "Fine, so now the plan is improvising without the old maniac. I can do that.",
                },
            ],
            seed,
        );
    }

    return null;
}

export function SquadProvider({ children }: { children: ReactNode }) {
    const [squad, setSquad] = useState<Character[]>(() => {
        try {
            const saved = localStorage.getItem("rm-squad");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    React.useEffect(() => {
        localStorage.setItem("rm-squad", JSON.stringify(squad));
    }, [squad]);

    const addToSquad = useCallback((character: Character) => {
        setSquad((prev) => {
            if (prev.length >= MAX_SQUAD) return prev;
            if (prev.find((c) => c.id === character.id)) return prev;
            const interaction = getAddInteraction(prev, character);
            if (interaction) dispatchInteraction(interaction);
            return [...prev, character];
        });
    }, []);

    const removeFromSquad = useCallback((id: number) => {
        setSquad((prev) => {
            const removed = prev.find((c) => c.id === id);
            const next = prev.filter((c) => c.id !== id);
            const interaction = getRemoveInteraction(removed, next);
            if (interaction) dispatchInteraction(interaction);

            return next;
        });
    }, []);

    const clearSquad = useCallback(() => {
        setSquad([]);
    }, []);

    const isInSquad = useCallback(
        (id: number) => squad.some((c) => c.id === id),
        [squad],
    );

    const isFull = squad.length >= MAX_SQUAD;

    return (
        <SquadContext.Provider
            value={{
                squad,
                addToSquad,
                removeFromSquad,
                clearSquad,
                isInSquad,
                isFull,
            }}
        >
            {children}
        </SquadContext.Provider>
    );
}
