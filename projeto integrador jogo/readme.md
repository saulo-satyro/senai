# Corra pelo Mundo — Versão Alfa (v1.0-alpha)

Corra pelo Mundo é um jogo web de corrida infinita (endless runner) com foco educacional e ambiental. O jogador desvia de obstáculos da natureza e coleta resíduos recicláveis enquanto atravessa diferentes biomas do planeta.

O projeto foi desenvolvido em HTML5, CSS3 e JavaScript Vanilla (ES6), funcionando 100% offline e localmente, sem dependência de bibliotecas ou frameworks externos.

---

## Como Executar o Jogo

### Opção 1: Execução Local (Offline)
1. Clique no botão verde Code no topo desta página e selecione Download ZIP.
2. Extraia o arquivo .zip em qualquer pasta do seu computador.
3. Clique duas vezes no arquivo index.html para abrir e jogar diretamente em qualquer navegador web.

### Opção 2: Jogar Online (GitHub Pages)
Acesse a versão alfa jogável diretamente pelo navegador:  
https://seu-usuario.github.io/nome-do-repositorio/ (substitua pelo seu link do GitHub Pages)

---

## Controles e Jogabilidade

| Comando | Teclas | Ação |
| :--- | :--- | :--- |
| Mover para Cima | W ou Seta para Cima | Troca o personagem para a faixa superior |
| Mover para Baixo | S ou Seta para Baixo | Troca o personagem para a faixa inferior |

* Coletáveis (Lixos Recicláveis): Aumentam sua pontuação e mantêm seu multiplicador de combo.
* Obstáculos (Árvores): Representam a preservação da natureza; colidir com elas faz perder 1 vida.

---

## Modelo Matemático e Biomas

A velocidade escalar dos elementos na pista ($V$) aumenta progressivamente a cada $500\text{m}$ percorridos, utilizando a seguinte função piso:

$$V(d) = 5 + \lfloor d / 500 \rfloor \times 1.5$$

| Distância ($d$) | Bioma Atual | Velocidade Base ($V$) |
| :--- | :--- | :--- |
| 0m – 999m | América do Sul | 5.0 - 6.5 px/frame |
| 1000m – 2499m | Ásia | 8.0 - 11.0 px/frame |
| 2500m – 3999m | África | 12.5 - 15.5 px/frame |
| 4000m – 5499m | Europa | 17.0 - 18.5 px/frame |
| ≥ 5500m | Antártida | ≥ 20.0 px/frame |

* Probabilidade de Geração (Spawn): 65% Lixos recicláveis ($P = 0.65$) vs. 35% Árvores ($P = 0.35$).

---

## Recursos de Acessibilidade e Design Visual

* Contorno para Daltonismo: Todos os elementos possuem um filtro CSS drop-shadow com contornos coloridos para facilitar a diferenciação por alto contraste:
  * Lixos (Coletáveis): Contorno Vermelho (#ff4757).
  * Árvores (Obstáculos): Contorno Verde (#2ed573).
* Preservação de Pixel Art: Aplicação da propriedade CSS image-rendering: pixelated para manter traços limpos sem interpolação borrada.

---

## Estrutura do Repositório

```text
├── index.html       # Estrutura HTML5 semântica e montagem da tela/HUD
├── style.css        # Estilização responsiva, animações em Keyframes e filtros
├── script.js       # Game loop (requestAnimationFrame), colisão AABB e física
└── assets/          # Recursos gráficos em Pixel Art criados pelo estudante
    ├── player_sheet.png  # Sprite Sheet do personagem (272x63px)
    ├── arvore.png        # Sprite do obstáculo
    └── lixo1.png ... lixo8.png # Sprites dos 8 tipos de resíduos
