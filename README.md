# 🍀 Mega Sena Simulator

Um simulador completo para a Mega Sena, desenvolvido para ajudar na gestão de apostas em grupo, testes de probabilidade e verificação de resultados.

![Mega Sena Simulator](public/screenshot.png) (Adicione um screenshot se desejar)

## 🚀 Funcionalidades

### 📋 Gestão de Jogos
- **Registro de Jogos**: Adicione jogos manualmente ou gere aleatoriamente.
- **Agrupamento por Jogador**: Organize suas apostas por nome de quem as fez, com visualização colapsável.
- **Persistência Local**: Todos os dados são salvos no navegador (LocalStorage), garantindo que nada se perca ao fechar a página.

### 🎲 Geração Inteligente
- **Modo Livre**: Números totalmente aleatórios.
- **Evitar Repetições**: Opção para gerar novos jogos evitando números que já foram usados em outras apostas do mesmo banco de dados.

### 🎰 Sorteios e Simulações
- **Sorteio Manual**: Insira os números de um concurso oficial para conferir seus acertos.
- **Sorteio Aleatório**: Simule um sorteio comum da Mega Sena.
- **Aleatório dos Jogos**: Sorteia números baseando-se apenas nos números que já foram apostados.
- **🔍 Buscar Ganhador (Deep Search)**: Um recurso potente que realiza sorteios sucessivos até que haja pelo menos um ganhador (Quadra, Quina ou Sena) entre os jogos registrados. 
  - Exibe o **tempo total** da busca.
  - Mostra o **número de tentativas** necessárias.
  - Oferece uma lista completa de todos os sorteios falhos realizados durante a busca.

### 🏆 Conferência de Resultados
- Destaque visual dos números sorteados em cada cartão.
- Identificação automática de **Quadra (4 acertos)**, **Quina (5 acertos)** e **Sena (6 acertos)**.
- Modal de ganhadores com resumo detalhado.

## 🛠️ Tecnologias

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: CSS Modules (Vanilla CSS moderno)
- **Estado**: Hooks customizados e LocalStorage para persistência.
- **PWA**: Suporte para instalação e funcionamento offline.

## 📦 Como rodar o projeto

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔧 Build e Deploy

Para gerar a versão de produção:
```bash
npm run build
```

---
Desenvolvido para fins de simulação e entretenimento. Boa sorte! 🍀
