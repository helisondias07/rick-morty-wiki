const speciesMap: Record<string, string> = {
  'human': 'Humano',
  'alien': 'Alienígena',
  'humanoid': 'Humanoide',
  'robot': 'Robô',
  'poopybutthole': 'Poopybutthole',
  'mythological creature': 'Criatura Mitológica',
  'animal': 'Animal',
  'disease': 'Doença',
  'cronenberg': 'Cronenberg',
  'unknown': 'Desconhecido'
};

const statusMap: Record<string, string> = {
  'alive': 'Vivo',
  'dead': 'Morto',
  'unknown': 'Desconhecido'
};

const genderMap: Record<string, string> = {
  'male': 'Masculino',
  'female': 'Feminino',
  'genderless': 'Sem Gênero',
  'unknown': 'Desconhecido'
};

const typeMap: Record<string, string> = {
  'planet': 'Planeta',
  'cluster': 'Aglomerado',
  'space station': 'Estação Espacial',
  'microverse': 'Microverso',
  'tv': 'TV',
  'resort': 'Resort',
  'fantasy town': 'Cidade de Fantasia',
  'dream': 'Sonho',
  'custom': 'Customizado',
  'unknown': 'Desconhecido'
};

const nameMap: Record<string, string> = {
  'earth (replacement dimension)': 'Terra (Dimensão de Substituição)',
  'earth (c-137)': 'Terra (C-137)',
  'earth (5-126)': 'Terra (5-126)',
  'citadel of ricks': 'Cidadela dos Ricks',
  'post-apocalyptic earth': 'Terra Pós-Apocalíptica',
  'purge planet': 'Planeta do Expurgo',
  'cronenberg earth': 'Terra Cronenberg',
  'giant\'s town': 'Cidade dos Gigantes',
  'bird world': 'Mundo Pássaro',
  'worldender\'s lair': 'Guarida do Worldender',
  'mr. goldenfold\'s dream': 'Sonho do Sr. Goldenfold',
  'st. gloopy noops hospital': 'Hospital St. Gloopy Noops',
  'anatomy park': 'Parque de Anatomia',
  'immortality field resort': 'Resort do Campo de Imortalidade',
  'interdimensional cable': 'Cabo Interdimensional',
  'unknown': 'Desconhecido'
};

const monthMap: Record<string, string> = {
  'january': 'janeiro',
  'february': 'fevereiro',
  'march': 'março',
  'april': 'abril',
  'may': 'maio',
  'june': 'junho',
  'july': 'julho',
  'august': 'agosto',
  'september': 'setembro',
  'october': 'outubro',
  'november': 'novembro',
  'december': 'dezembro'
};

export function translateSpecies(species: string, lang: string): string {
  if (lang !== 'pt') return species;
  const key = species.toLowerCase();
  return speciesMap[key] || species;
}

export function translateStatus(status: string, lang: string): string {
  if (lang !== 'pt') return status;
  const key = status.toLowerCase();
  return statusMap[key] || status;
}

export function translateGender(gender: string, lang: string): string {
  if (lang !== 'pt') return gender;
  const key = gender.toLowerCase();
  return genderMap[key] || gender;
}

export function translateType(type: string, lang: string): string {
  if (lang !== 'pt') return type;
  const key = type.toLowerCase();
  return typeMap[key] || type;
}

export function translateLocationName(name: string, lang: string): string {
  if (lang !== 'pt') return name;
  const key = name.toLowerCase();
  if (nameMap[key]) return nameMap[key];

  // Substituições comuns em nomes compostos
  let translated = name;
  translated = translated.replace(/\bEarth\b/gi, 'Terra');
  translated = translated.replace(/\bDimension\b/gi, 'Dimensão');
  translated = translated.replace(/\bReplacement Dimension\b/gi, 'Dimensão de Substituição');
  translated = translated.replace(/\bunknown\b/gi, 'Desconhecido');
  return translated;
}

export function translateDimension(dimension: string, lang: string): string {
  if (lang !== 'pt') return dimension;
  const key = dimension.toLowerCase();
  if (key === 'unknown') return 'Desconhecido';

  let translated = dimension;
  // Substitui "Dimension" por "Dimensão"
  translated = translated.replace(/\bDimension\b/gi, 'Dimensão');
  // Substitui outras palavras comuns
  translated = translated.replace(/\bReplacement Dimension\b/gi, 'Dimensão de Substituição');
  translated = translated.replace(/\bCronenberg Dimension\b/gi, 'Dimensão Cronenberg');
  translated = translated.replace(/\bFantasy Dimension\b/gi, 'Dimensão de Fantasia');
  translated = translated.replace(/\bunknown\b/gi, 'desconhecido');
  return translated;
}

export function translateAirDate(dateStr: string, lang: string): string {
  if (lang !== 'pt') return dateStr;
  
  // O formato retornado pela API costuma ser "December 2, 2013"
  const regex = /^([a-zA-Z]+)\s+(\d+),\s+(\d+)$/;
  const match = dateStr.match(regex);
  if (match) {
    const monthEnglish = match[1].toLowerCase();
    const day = match[2];
    const year = match[3];
    const monthPortuguese = monthMap[monthEnglish] || match[1];
    return `${day} de ${monthPortuguese} de ${year}`;
  }
  
  return dateStr;
}
