# Rick and Morty Wiki

Esta é uma aplicação front-end desenvolvida para o desafio técnico de Desenvolvedor Front-end Júnior. A ideia principal é explorar os recursos da API oficial de Rick and Morty, focando na listagem de personagens, episódios e localizações. O objetivo foi criar um projeto demonstrando qualidade de código, arquitetura bem definida e uma experiência de usuário fluida.

**[Acesse a aplicação ao vivo aqui (Live Preview)](https://rick-morty-wiki-steel-delta.vercel.app/)**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![styled-components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

## Funcionalidades

A aplicação permite visualizar os personagens em um painel interativo, com rolagem infinita implementada de forma nativa e filtros de busca por nome, status e espécie. Ao navegar pelos episódios e localizações, existe uma relação lógica onde o sistema identifica quais personagens participaram daquele episódio ou vivem naquele planeta, buscando esses dados agrupados de forma ágil.

Um dos diferenciais do projeto é a página dedicada ao **Esquadrão**. Em vez de uma simples lista de personagens favoritados, foi criada uma seção inteira onde é possível comparar os atributos dos recrutas, verificar a chance de sobrevivência da equipe e simular missões aleatórias com uma análise divertida do próprio Rick Sanchez. Além disso, todo o sistema suporta troca de idioma (inglês/português) e conta com alternância dinâmica entre modo escuro e claro, salvando a sua preferência.

Este projeto foi desenvolvido majoritariamente à mão, durante uma imersão de 20 horas seguidas de trabalho. O uso de Inteligência Artificial foi limitado apenas como ferramenta de suporte pontual, auxiliando na matemática das animações gerais da interface e na estruturação inicial da suíte de testes.

## Arquitetura e Tecnologias

Para construir tudo isso, a base tecnológica escolhida foi **React com TypeScript**, utilizando o **Vite** como ambiente de desenvolvimento rápido. O gerenciamento de estilos e temas foi feito com **styled-components**, permitindo componentização forte e controle visual global. 

A navegação entre as páginas acontece através do **React Router DOM**. As transições foram feitas com **Framer Motion** e a comunicação com o servidor usa a ferramenta nativa do navegador (Fetch API), incluindo travas de segurança para evitar que várias requisições atropelem umas as outras (AbortController). Todo o projeto conta com testes de funcionalidade escritos com **Vitest**.

Nenhuma biblioteca externa de visual pronto (como MUI, Chakra ou Bootstrap) foi utilizada. Todos os botões, listas, animações de carregamento e componentes da interface foram arquitetados do zero com CSS-in-JS. A estrutura do projeto foi pensada para manter organização limpa separando páginas, componentes visuais estáticos, serviços da API e regras de estado global em Contextos.

## Desafios Encontrados

Durante o desenvolvimento, alguns desafios técnicos interessantes surgiram:
- **O controle de estado da rolagem infinita:** Resolvido não com ouvintes de scroll pesados, mas sim através da *Intersection Observer API* em um elemento âncora invisível no fim da lista para garantir ótima performance.
- **O mapeamento lógico dos dados da API:** Como os residentes de localizações vêm da API como arrays de links, foi construída uma expressão regular (Regex) para extrair as numerações das URLs e fazer um disparo único em lote (`/character/1,2,3`) para buscar vários personagens de uma vez, reduzindo o tráfego de rede drasticamente.
- **Gerenciamento de Foco e Acessibilidade:** A implementação manual de um sistema de *Focus Trap* nos modais exigiu um hook dedicado que intercepta eventos do teclado para garantir que a navegação não vaze para os elementos de trás quando um modal está aberto.

## Como Rodar Localmente

Para rodar o projeto localmente no seu computador, siga os passos:
1. Faça o clone deste repositório.
2. Instale as dependências usando o comando `npm install`.
3. Inicialize a aplicação em modo de desenvolvimento rodando `npm run dev`.
4. Caso queira rodar a bateria de testes, use `npm run test` no terminal.

---
Autor: Helison Dias

<a href="https://helisondias.vercel.app/" target="_blank">Portfólio</a><br/>
<a href="https://www.linkedin.com/in/helisondias/" target="_blank">LinkedIn</a><br/>
<a href="https://github.com/helisondias07" target="_blank">GitHub</a><br/>
<a href="https://git.fbits.net/AGENCIAOASIS_helison" target="_blank">GitLab</a>
