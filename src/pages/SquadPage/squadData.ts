import { Character } from "../../types";

type Language = "pt" | "en";

type LocalizedText = {
    pt: string;
    en: string;
};

type MissionDefinition = {
    planet: LocalizedText;
    objective: LocalizedText;
    outcome: LocalizedText;
};

function hashString(value: string) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
        hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }
    return hash;
}

function pickVariant(options: string[], seed: number, offset: number) {
    return options[(seed + offset) % options.length];
}

function normalizeName(name: string) {
    return name.trim().toLowerCase();
}

function countByNameToken(squad: Character[], token: string) {
    return squad.filter((member) => normalizeName(member.name).includes(token))
        .length;
}

function countSmithFamily(squad: Character[]) {
    return squad.filter((member) =>
        normalizeName(member.name).includes("smith"),
    ).length;
}

export function calcSurvivalScore(squad: Character[]): number {
    if (!squad.length) return 0;

    let score = 0;
    squad.forEach((character) => {
        if (character.status === "Alive") score += 20;
        else if (character.status === "unknown") score += 12;
        else score += 4;
    });

    const uniqueSpecies = new Set(squad.map((character) => character.species))
        .size;
    score += (uniqueSpecies - 1) * 5;

    return Math.min(100, Math.round((score / (squad.length * 20)) * 100));
}

export function getRickAnalysis(squad: Character[], lang: Language): string {
    const deadCount = squad.filter((member) => member.status === "Dead").length;
    const aliveCount = squad.filter(
        (member) => member.status === "Alive",
    ).length;
    const unknownCount = squad.filter(
        (member) => member.status === "unknown",
    ).length;
    const humanCount = squad.filter(
        (member) => member.species === "Human",
    ).length;
    const uniqueSpecies = new Set(squad.map((member) => member.species)).size;
    const rickCount = countByNameToken(squad, "rick");
    const mortyCount = countByNameToken(squad, "morty");
    const jerryCount = countByNameToken(squad, "jerry");
    const smithCount = countSmithFamily(squad);
    const hasRick = rickCount > 0;
    const hasMorty = mortyCount > 0;
    const hasJerry = jerryCount > 0;
    const hasSummer = countByNameToken(squad, "summer") > 0;
    const hasBeth = countByNameToken(squad, "beth") > 0;
    const seed = hashString(
        squad
            .map((member) => `${member.id}:${member.name}`)
            .sort()
            .join("|"),
    );
    const lines: string[] = [];

    const addLine = (
        ptOptions: string[],
        enOptions: string[],
        offset: number,
    ) => {
        const text =
            lang === "pt"
                ? pickVariant(ptOptions, seed, offset)
                : pickVariant(enOptions, seed, offset);

        if (!lines.includes(text)) {
            lines.push(text);
        }
    };

    if (rickCount > 1) {
        addLine(
            [
                "Mais de um Rick no mesmo esquadrão. Isso é genial ou profundamente irresponsável. Então... perfeito.",
                "Ricks múltiplos detectados. O ego da equipe já preencheu duas dimensões sozinho.",
                "Dois Ricks ou mais. Excelente. Agora ninguém vai aceitar estar errado nunca mais.",
            ],
            [
                "More than one Rick on the squad. That is genius or deeply irresponsible. So... perfect.",
                "Multiple Ricks detected. The team ego now occupies at least two dimensions by itself.",
                "Two Ricks or more. Excellent. Now nobody will ever accept being wrong again.",
            ],
            0,
        );
    }

    if (mortyCount > 1) {
        addLine(
            [
                "Tem mais de um Morty aqui. A ansiedade coletiva desse grupo já merece classificação própria.",
                "Dois Mortys no mesmo time. Isso é basicamente um coral de pânico interdimensional.",
                "Múltiplos Mortys. Se um entrar em crise, os outros provavelmente fazem eco.",
            ],
            [
                "There is more than one Morty here. The collective anxiety of this team deserves its own classification.",
                "Two Mortys on the same team. This is basically an interdimensional panic choir.",
                "Multiple Mortys. If one panics, the others will probably harmonize.",
            ],
            1,
        );
    }

    if (jerryCount > 1) {
        addLine(
            [
                "Mais de um Jerry? Isso não é composição de equipe, é teste de paciência com orçamento alto.",
                "Dois Jerrys no arquivo. A ameaça agora é emocional, logística e espiritualmente constrangedora.",
                "Múltiplos Jerrys confirmados. O risco de decisões ruins acabou de ganhar redundância.",
            ],
            [
                "More than one Jerry? That is not squad building, that is a patience test with funding.",
                "Two Jerrys in the file. The threat is now emotional, logistical and spiritually embarrassing.",
                "Multiple Jerrys confirmed. Bad decisions just gained redundancy.",
            ],
            2,
        );
    }

    if (hasRick && mortyCount >= 2) {
        addLine(
            [
                "Um Rick liderando mais de um Morty. Isso tem cheiro de plano terrível com margem estatística.",
                "Rick cercado de Mortys. A clássica configuração “alguém vai aprender a sofrer”.",
                "Você montou uma pequena linha de produção de trauma pro Rick. Eficiente, admito.",
            ],
            [
                "One Rick leading more than one Morty. This smells like a terrible plan with statistical padding.",
                "Rick surrounded by Mortys. The classic “someone is about to learn suffering” setup.",
                "You built Rick a small trauma assembly line. Efficient, I will admit.",
            ],
            3,
        );
    }

    if (deadCount >= 2) {
        addLine(
            [
                `${deadCount} mortos no esquadrão. Você está montando uma missão ou um estudo de caso paranormal?`,
                `${deadCount} membros mortos. Se isso funcionar, vai ser por acidente ou necromancia casual.`,
                `${deadCount} cadáveres táticos confirmados. O lado bom é que eles não reclamam do plano.`,
            ],
            [
                `${deadCount} dead members on the squad. Are you building a mission or a paranormal case study?`,
                `${deadCount} dead members. If this works, it will be because of accident or casual necromancy.`,
                `${deadCount} tactical corpses confirmed. Upside: they do not complain about the plan.`,
            ],
            4,
        );
    }

    if (unknownCount >= 2) {
        addLine(
            [
                `${unknownCount} status desconhecidos. Gosto do mistério, odeio depender dele.`,
                `Muitos membros com status “desconhecido”. Excelente, agora até o prontuário mente pra mim.`,
                `Dois ou mais “desconhecidos”. Isso é equipe ou caixa-surpresa radioativa?`,
            ],
            [
                `${unknownCount} unknown status members. I like mystery, I hate depending on it.`,
                "Too many members marked as “unknown.” Great, now even the medical file lies to me.",
                "Two or more “unknowns.” Is this a squad or a radioactive blind box?",
            ],
            5,
        );
    }

    if (aliveCount === squad.length) {
        addLine(
            [
                "Todo mundo vivo. Um milagre estatístico. Aproveita antes que o universo perceba.",
                "Equipe inteira respirando. Isso é o máximo de otimismo que eu consigo oferecer.",
                "Todos vivos por enquanto. Não estraga esse momento raro.",
            ],
            [
                "Everyone is alive. A statistical miracle. Enjoy it before the universe notices.",
                "Full team still breathing. That is the most optimism I can offer.",
                "Everyone is alive for now. Do not ruin this rare moment.",
            ],
            6,
        );
    }

    if (uniqueSpecies >= 4) {
        addLine(
            [
                "Quatro espécies ou mais. Finalmente alguma diversidade útil em vez de repetição suburbana.",
                "Essa mistura de espécies eu respeito. Parece missão do multiverso, não reunião de condomínio.",
                "Diversidade biológica alta. Agora sim a equipe parece cara e perigosa.",
            ],
            [
                "Four species or more. Finally some useful diversity instead of suburban repetition.",
                "This species mix I respect. Looks like a multiverse mission, not a homeowners meeting.",
                "High biological diversity. Now the squad finally looks expensive and dangerous.",
            ],
            7,
        );
    }

    if (humanCount === squad.length) {
        addLine(
            [
                "Todos humanos. A espécie mais medíocre do universo continua insistindo em protagonismo.",
                "Equipe 100% humana. Se aparecer um botão alienígena, alguém vai apertar sem ler.",
                "Tudo humano. Impressionante como vocês conseguem formar um esquadrão e uma decepção ao mesmo tempo.",
            ],
            [
                "All humans. The most mediocre species in the universe keeps insisting on being the protagonist.",
                "100% human team. If an alien button shows up, someone will press it without reading.",
                "All human. Impressive how you can build a squad and a disappointment at the same time.",
            ],
            8,
        );
    }

    if (smithCount >= 4) {
        addLine(
            [
                "Isso deixou de ser esquadrão e virou reunião da família Smith com potencial de explosão.",
                "Smith demais no mesmo arquivo. Se der errado, a terapia entra como despesa operacional.",
                "Quase todo mundo é da mesma família. Então o risco agora é cósmico e hereditário.",
            ],
            [
                "This stopped being a squad and became a Smith family meeting with explosive potential.",
                "Too many Smiths in the same file. If this goes wrong, therapy counts as an operational cost.",
                "Almost everyone is from the same family. So the danger is now cosmic and hereditary.",
            ],
            9,
        );
    }

    if (hasRick && hasMorty && hasSummer && hasBeth && hasJerry) {
        addLine(
            [
                "A família principal inteira reunida. Isso é o pacote premium de trauma e competência desigual.",
                "Rick, Morty, Summer, Beth e Jerry no mesmo time. Isso não é tática, é um especial de temporada.",
                "Esquadrão completo da família. Se falhar, pelo menos o jantar rende assunto por uns quinze anos.",
            ],
            [
                "The full core family is assembled. This is the premium package of trauma and uneven competence.",
                "Rick, Morty, Summer, Beth and Jerry on the same team. This is not tactics, this is a season special.",
                "Full family squad. If it fails, at least dinner conversations are set for fifteen years.",
            ],
            10,
        );
    }

    if (hasJerry) {
        addLine(
            [
                "Jerry detectado. Ajustando automaticamente a margem de erro para “decepcionante”.",
                "Tem Jerry no esquadrão. Então metade do plano agora é impedir iniciativa espontânea.",
                "Jerry incluso. Isso reduz a confiança, mas aumenta a capacidade do time de servir como exemplo ruim.",
            ],
            [
                "Jerry detected. Automatically adjusting the error margin to “disappointing.”",
                "Jerry is on the squad. So half the strategy is now preventing spontaneous initiative.",
                "Jerry included. That lowers confidence, but improves the team as a cautionary example.",
            ],
            11,
        );
    }

    if (!lines.length) {
        addLine(
            [
                "*urp* Esquadrão mediano. Nada me impressiona mais. Vamos logo.",
                "*urp* Formação aceitável. Não me emociona, mas já vi muito pior.",
                "*urp* Dá pra trabalhar com isso. Com relutância, equipamento extra e zero fé.",
            ],
            [
                "*urp* Average squad. Nothing impresses me anymore. Let us move.",
                "*urp* Acceptable formation. Not inspiring, but I have seen much worse.",
                "*urp* I can work with this. Reluctantly, with extra gear and zero faith.",
            ],
            12,
        );
    }

    return lines.slice(0, 4).join(" ");
}

const MISSIONS: MissionDefinition[] = [
    {
        planet: { pt: "Blips e Chitz", en: "Blips and Chitz" },
        objective: {
            pt: "Recuperar o cristal de Roy preso dentro de uma máquina adulterada de arcade",
            en: "Recover Roy’s crystal trapped inside a tampered arcade cabinet",
        },
        outcome: {
            pt: "Missão concluída. Roy viveu outra vida inteira e alguém saiu emocionalmente devastado.",
            en: "Mission complete. Roy lived another entire life and someone left emotionally shattered.",
        },
    },
    {
        planet: { pt: "Gazorpazorp", en: "Gazorpazorp" },
        objective: {
            pt: "Negociar uma rota segura sem insultar a raça dominante feminina pela terceira vez",
            en: "Negotiate a safe route without insulting the dominant female race for the third time",
        },
        outcome: {
            pt: "A tensão foi absurda, mas o time saiu vivo. O constrangimento ficou orbital.",
            en: "Tension levels were absurd, but the squad got out alive. The embarrassment stayed in orbit.",
        },
    },
    {
        planet: { pt: "Dimensão dos Parasitas", en: "Parasite Dimension" },
        objective: {
            pt: "Descobrir quais memórias felizes foram plantadas por parasitas imitadores",
            en: "Figure out which happy memories were planted by mimic parasites",
        },
        outcome: {
            pt: "Ninguém confiou em ninguém, o que honestamente ajudou bastante.",
            en: "Nobody trusted anybody, which honestly helped a lot.",
        },
    },
    {
        planet: { pt: "QG dos Vindicators", en: "Vindicators HQ" },
        objective: {
            pt: "Sobreviver aos desafios deixados por um Rick bêbado e mal-intencionado",
            en: "Survive the challenges left by a drunk and malicious Rick",
        },
        outcome: {
            pt: "Um membro resolveu tudo. Rick continua fingindo que não ficou impressionado.",
            en: "One squad member solved everything. Rick is still pretending he was not impressed.",
        },
    },
    {
        planet: { pt: "Cidadela dos Ricks", en: "Citadel of Ricks" },
        objective: {
            pt: "Infiltrar o arquivo central e sair antes de algum Rick perceber a audácia",
            en: "Infiltrate the central archive and leave before any Rick notices the audacity",
        },
        outcome: {
            pt: "A infiltração durou pouco, mas a improvisação criminosa salvou o dia.",
            en: "The infiltration did not last long, but criminal improvisation saved the day.",
        },
    },
    {
        planet: { pt: "Froopyland", en: "Froopyland" },
        objective: {
            pt: "Resgatar um hóspede problemático sem iniciar uma monarquia paralela",
            en: "Rescue a problematic resident without starting a parallel monarchy",
        },
        outcome: {
            pt: "Houve diplomacia, confusão e um novo rei. O resgate em si foi secundário.",
            en: "There was diplomacy, confusion and a new king. The rescue itself became secondary.",
        },
    },
    {
        planet: { pt: "Dimensão C-500A", en: "Dimension C-500A" },
        objective: {
            pt: "Recuperar uma portal gun perdida em um mercado de bugigangas temporais",
            en: "Recover a lost portal gun from a temporal flea market",
        },
        outcome: {
            pt: "A arma foi encontrada, trocada, recomprada e ainda voltou cheirando a waffle.",
            en: "The gun was found, traded, bought back and still came home smelling like waffles.",
        },
    },
    {
        planet: { pt: "Anatomy Park", en: "Anatomy Park" },
        objective: {
            pt: "Reativar o parque interno sem libertar uma infecção senciente no processo",
            en: "Reactivate the internal park without freeing a sentient infection in the process",
        },
        outcome: {
            pt: "O parque voltou a funcionar por sete minutos. Considerando o histórico, é vitória.",
            en: "The park worked again for seven minutes. Considering the history, that counts as victory.",
        },
    },
    {
        planet: { pt: "Planetina Prime", en: "Planetina Prime" },
        objective: {
            pt: "Interceptar um culto ecológico interdimensional antes que ele desligue o núcleo de energia da colônia",
            en: "Intercept an interdimensional eco-cult before it shuts down the colony power core",
        },
        outcome: {
            pt: "O núcleo foi salvo e metade da equipe saiu se sentindo culpada por motivos diferentes.",
            en: "The core was saved and half the squad left feeling guilty for completely different reasons.",
        },
    },
    {
        planet: { pt: "Nuptia 4", en: "Nuptia 4" },
        objective: {
            pt: "Roubar um contrato de casamento telepático sem ficar legalmente vinculado a ninguém",
            en: "Steal a telepathic marriage contract without becoming legally bound to anyone",
        },
        outcome: {
            pt: "O contrato sumiu, dois alienígenas se divorciaram e o cartório explodiu. Missão ok.",
            en: "The contract vanished, two aliens got divorced and the registry exploded. Mission acceptable.",
        },
    },
    {
        planet: { pt: "Shleemypants Asteroid", en: "Shleemypants Asteroid" },
        objective: {
            pt: "Extrair minério instável antes da corporação local perceber que você não trabalha lá",
            en: "Extract unstable ore before the local corporation notices you do not work there",
        },
        outcome: {
            pt: "O minério foi extraído e a corporação agora culpa um sindicato fantasma.",
            en: "The ore was extracted and the corporation is now blaming a ghost union.",
        },
    },
    {
        planet: { pt: "Cronenberg Remains", en: "Cronenberg Remains" },
        objective: {
            pt: "Recuperar dados biológicos de uma Terra que já desistiu da aparência humana",
            en: "Recover biological data from an Earth that gave up on looking human",
        },
        outcome: {
            pt: "Os dados vieram limpos. O trauma visual, nem tanto.",
            en: "The data came back clean. The visual trauma did not.",
        },
    },
    {
        planet: { pt: "Bird World Outpost", en: "Bird World Outpost" },
        objective: {
            pt: "Entregar um pacote criptografado sem acionar nenhum protocolo de vingança aviária",
            en: "Deliver an encrypted package without triggering any avian revenge protocol",
        },
        outcome: {
            pt: "A entrega foi feita, mas agora existe um duelo formal marcado para terça.",
            en: "Delivery was made, but there is now a formal duel scheduled for Tuesday.",
        },
    },
    {
        planet: { pt: "Snake Jazz Sector", en: "Snake Jazz Sector" },
        objective: {
            pt: "Roubar um amplificador temporal de uma civilização que só se comunica por jazz reptiliano",
            en: "Steal a temporal amplifier from a civilization that communicates only through reptilian jazz",
        },
        outcome: {
            pt: "Tecnicamente funcionou. Musicalmente, foi um crime de guerra.",
            en: "Technically it worked. Musically, it was a war crime.",
        },
    },
    {
        planet: { pt: "Heist-Con 9000", en: "Heist-Con 9000" },
        objective: {
            pt: "Roubar o algoritmo que prevê roubos antes que outro ladrão finja que pensou nisso primeiro",
            en: "Steal the algorithm that predicts heists before another thief claims the idea first",
        },
        outcome: {
            pt: "Houve três reviravoltas, dois planos falsos e uma quantidade ofensiva de monólogos.",
            en: "There were three twists, two fake plans and an offensive amount of monologuing.",
        },
    },
    {
        planet: { pt: "Mount Space Everest", en: "Mount Space Everest" },
        objective: {
            pt: "Plantar um farol de navegação quântica no topo antes da tempestade de antimemória",
            en: "Plant a quantum navigation beacon at the summit before the antimemory storm hits",
        },
        outcome: {
            pt: "O farol foi ativado e ninguém esqueceu o próprio nome. Grande sucesso.",
            en: "The beacon was activated and nobody forgot their own name. Huge success.",
        },
    },
    {
        planet: { pt: "Toilet Planet Reserve", en: "Toilet Planet Reserve" },
        objective: {
            pt: "Recuperar um disco rígido secreto sem irritar o proprietário mais territorial do cosmos",
            en: "Recover a secret hard drive without angering the most territorial owner in the cosmos",
        },
        outcome: {
            pt: "O disco foi recuperado e a dignidade da equipe foi perdida em troca. Troca justa.",
            en: "The drive was recovered and the team dignity was lost in exchange. Fair trade.",
        },
    },
    {
        planet: { pt: "Decoy Facility Theta", en: "Decoy Facility Theta" },
        objective: {
            pt: "Descobrir se a base é real, falsa ou uma cópia da cópia antes que ela descubra você",
            en: "Figure out whether the base is real, fake or a copy of a copy before it figures out you",
        },
        outcome: {
            pt: "A instalação era falsa, mas a perseguição era bem real. Isso conta como informação útil.",
            en: "The facility was fake, but the chase was very real. That counts as useful intel.",
        },
    },
    {
        planet: {
            pt: "Intergalactic Prison Yard",
            en: "Intergalactic Prison Yard",
        },
        objective: {
            pt: "Resgatar um informante preso durante um motim planejado por oito facções ao mesmo tempo",
            en: "Extract an informant during a riot planned by eight factions at once",
        },
        outcome: {
            pt: "O informante saiu. O motim virou festival. Ninguém sabe explicar a parte dos lasers.",
            en: "The informant got out. The riot became a festival. Nobody can explain the lasers.",
        },
    },
    {
        planet: { pt: "Memory Reef", en: "Memory Reef" },
        objective: {
            pt: "Capturar uma lembrança viva que contém coordenadas para um cofre ancestral",
            en: "Capture a living memory holding coordinates to an ancestral vault",
        },
        outcome: {
            pt: "As coordenadas foram extraídas e alguém ganhou uma lembrança falsa de infância no processo.",
            en: "The coordinates were extracted and someone gained a fake childhood memory in the process.",
        },
    },
    {
        planet: { pt: "Mega Seed Garden", en: "Mega Seed Garden" },
        objective: {
            pt: "Coletar mega sementes frescas sem sofrer dano cerebral, moral ou intestinal irreversível",
            en: "Collect fresh mega seeds without irreversible brain, moral or intestinal damage",
        },
        outcome: {
            pt: "As sementes voltaram intactas. A equipe, nem tanto.",
            en: "The seeds made it back intact. The team, not so much.",
        },
    },
    {
        planet: {
            pt: "Valhalla Maintenance Ring",
            en: "Valhalla Maintenance Ring",
        },
        objective: {
            pt: "Reiniciar um anel de combate nórdico espacial sem libertar guerreiros eternos no hangar",
            en: "Restart a space-norse battle ring without unleashing eternal warriors into the hangar",
        },
        outcome: {
            pt: "O anel voltou a funcionar e a equipe saiu de lá com dois troféus e sete ameaças de duelo.",
            en: "The ring came back online and the squad left with two trophies and seven duel threats.",
        },
    },
];

function getMissionFlavorTexts(
    squad: Character[],
    lang: Language,
    seed: number,
) {
    const rickCount = countByNameToken(squad, "rick");
    const mortyCount = countByNameToken(squad, "morty");
    const jerryCount = countByNameToken(squad, "jerry");
    const humanCount = squad.filter(
        (member) => member.species === "Human",
    ).length;
    const deadCount = squad.filter((member) => member.status === "Dead").length;
    const speciesCount = new Set(squad.map((member) => member.species)).size;
    const smithCount = countSmithFamily(squad);

    const flavors: { objective: string; outcome: string }[] = [];

    if (rickCount >= 2) {
        flavors.push(
            lang === "pt"
                ? {
                      objective:
                          "Coordenar múltiplos Ricks sem permitir que a missão vire disputa de ego científico.",
                      outcome:
                          "Os Ricks discordaram em quase tudo, o que por coincidência cobriu todas as falhas do plano.",
                  }
                : {
                      objective:
                          "Coordinate multiple Ricks without letting the mission devolve into a scientific ego contest.",
                      outcome:
                          "The Ricks disagreed about almost everything, which accidentally covered every weakness in the plan.",
                  },
        );
    }

    if (mortyCount >= 2) {
        flavors.push(
            lang === "pt"
                ? {
                      objective:
                          "Conter o pânico sincronizado de múltiplos Mortys antes que ele altere a operação inteira.",
                      outcome:
                          "Os Mortys quase colapsaram em uníssono, mas o desespero coletivo acabou funcionando como alerta tático.",
                  }
                : {
                      objective:
                          "Contain the synchronized panic of multiple Mortys before it rewrites the entire operation.",
                      outcome:
                          "The Mortys nearly folded in unison, but the shared panic somehow became a tactical warning system.",
                  },
        );
    }

    if (jerryCount >= 2) {
        flavors.push(
            lang === "pt"
                ? {
                      objective:
                          "Evitar que dois Jerrys transformem instruções simples em um workshop de insegurança.",
                      outcome:
                          "Os Jerrys criaram problemas novos, mas também distraíram perfeitamente o inimigo por puro constrangimento.",
                  }
                : {
                      objective:
                          "Prevent two Jerrys from turning simple instructions into an insecurity workshop.",
                      outcome:
                          "The Jerrys created new problems, but they also distracted the enemy perfectly through sheer embarrassment.",
                  },
        );
    }

    if (speciesCount >= 4) {
        flavors.push(
            lang === "pt"
                ? {
                      objective:
                          "Explorar a diversidade biológica da equipe para acessar zonas vedadas a uma única espécie.",
                      outcome:
                          "A variedade do esquadrão virou vantagem real. Pela primeira vez, parecer um zoológico ajudou.",
                  }
                : {
                      objective:
                          "Use the squad’s biological diversity to access sectors restricted to a single species.",
                      outcome:
                          "The squad’s variety became a real advantage. For once, looking like a zoo actually helped.",
                  },
        );
    }

    if (humanCount === squad.length && squad.length > 0) {
        flavors.push(
            lang === "pt"
                ? {
                      objective:
                          "Compensar a completa ausência de vantagens alienígenas com improviso humano e sorte indevida.",
                      outcome:
                          "A humanidade da equipe não impressionou ninguém, mas a teimosia humana resolveu metade da missão.",
                  }
                : {
                      objective:
                          "Compensate for the total lack of alien advantages with human improvisation and undeserved luck.",
                      outcome:
                          "Nobody was impressed by the team’s humanity, but human stubbornness solved half the mission.",
                  },
        );
    }

    if (deadCount >= 2) {
        flavors.push(
            lang === "pt"
                ? {
                      objective:
                          "Gerenciar ativos mortos-vivos ou pós-vida sem perder o controle tático da linha de frente.",
                      outcome:
                          "Os membros mortos foram assustadoramente eficientes. O problema é que isso levantou perguntas demais.",
                  }
                : {
                      objective:
                          "Manage dead or post-life assets without losing tactical control of the front line.",
                      outcome:
                          "The dead members were disturbingly efficient. The problem is that raised far too many questions.",
                  },
        );
    }

    if (smithCount >= 4) {
        flavors.push(
            lang === "pt"
                ? {
                      objective:
                          "Impedir que o drama da família Smith ultrapasse o incidente cósmico principal.",
                      outcome:
                          "A missão foi concluída, mas ninguém concorda se isso contou como sucesso ou terapia armada.",
                  }
                : {
                      objective:
                          "Keep Smith family drama from overtaking the main cosmic incident.",
                      outcome:
                          "The mission was completed, but nobody agrees whether that counted as success or armed therapy.",
                  },
        );
    }

    if (!flavors.length) {
        flavors.push(
            lang === "pt"
                ? {
                      objective:
                          "Lidar com variáveis desconhecidas sem causar um colapso diplomático, temporal ou intestinal.",
                      outcome:
                          "A equipe improvisou com competência suspeita e saiu do outro lado com o objetivo quase intacto.",
                  }
                : {
                      objective:
                          "Handle unknown variables without causing a diplomatic, temporal or intestinal collapse.",
                      outcome:
                          "The squad improvised with suspicious competence and came out the other side with the objective mostly intact.",
                  },
        );
    }

    return flavors[seed % flavors.length];
}

export function getRandomMission(
    lang: Language,
    previousPlanet?: string | null,
    squad: Character[] = [],
) {
    const localized = MISSIONS.map((mission) => ({
        planet: mission.planet[lang],
        objective: mission.objective[lang],
        outcome: mission.outcome[lang],
    }));

    const pool =
        previousPlanet && localized.length > 1
            ? localized.filter((mission) => mission.planet !== previousPlanet)
            : localized;

    const list = pool.length ? pool : localized;
    const selectedMission = list[Math.floor(Math.random() * list.length)];

    if (!squad.length) {
        return selectedMission;
    }

    const seed = hashString(
        `${selectedMission.planet}|${squad.map((member) => `${member.id}:${member.name}`).join("|")}`,
    );
    const flavor = getMissionFlavorTexts(squad, lang, seed);

    return {
        ...selectedMission,
        objective: `${selectedMission.objective} ${flavor.objective}`,
        outcome: `${selectedMission.outcome} ${flavor.outcome}`,
    };
}
