window.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const player = document.getElementById('player');
  const container = document.getElementById('game-container');
  const gameOverScreen = document.getElementById('game-over-screen');
  const startScreen = document.getElementById('start-screen');
  const tutorialScreen = document.getElementById('tutorial-screen');
  const startBtn = document.getElementById('start-btn');
  const playNowBtn = document.getElementById('play-now-btn');
  const restartBtn = document.getElementById('restart-btn');

  // Listas de Sprites
  const trashSprites = [
    'lixo1.png', 
    'lixo2.png', 
    'lixo3.png', 
    'lixo4.png', 
    'lixo5.png', 
    'lixo6.png', 
    'lixo8.png'
  ];

  const treeSprites = [
    'arvore1.png',
    'arvore2.png',
    'arvore3.png',
    'arvore4.png',
    'arvore5.png'
  ];

  // Variáveis de Estado do Jogo
  let currentLane = 1;
  let score = 0;
  let lives = 3;
  let combo = 1;
  let distance = 0;
  let baseSpeed = 5;
  let isGameOver = false;
  let isGameStarted = false;
  let spawnTimer = null;

  // Cálculo da Posição Y das 3 Pistas
  function getLaneY(index) {
    const playableHeight = window.innerHeight - 160;
    const laneCenters = [
      80 + (playableHeight * (1 / 6)),
      80 + (playableHeight * (3 / 6)),
      80 + (playableHeight * (5 / 6))
    ];
    return laneCenters[index] - 63;
  }

  function updatePlayerPos() {
    if (player) {
      player.style.top = getLaneY(currentLane) + 'px';
    }
  }

  function updateGameSpeed(dist) {
    const currentSpeed = 5 + Math.floor(dist / 500) * 1.5;
    const baseDuration = 0.4;
    const newDuration = (5 / currentSpeed) * baseDuration;
    document.documentElement.style.setProperty('--anim-duration', `${newDuration.toFixed(2)}s`);
    return currentSpeed;
  }

  function getBiome(dist) {
    if (dist < 1000) return "América do Sul";
    if (dist < 2500) return "Ásia";
    if (dist < 4000) return "África";
    if (dist < 5500) return "Europa";
    return "Antártida";
  }

  // Navegação de Telas
  function showTutorial() {
    if (startScreen) startScreen.style.display = 'none';
    if (tutorialScreen) tutorialScreen.style.display = 'flex';
  }

  function startGame() {
    if (startScreen) startScreen.style.display = 'none';
    if (tutorialScreen) tutorialScreen.style.display = 'none';
    if (gameOverScreen) gameOverScreen.style.display = 'none';

    // Limpa itens antigos da tela
    document.querySelectorAll('.item').forEach(i => i.remove());

    score = 0; 
    lives = 3; 
    combo = 1; 
    distance = 0; 
    baseSpeed = 5;
    currentLane = 1; 
    isGameOver = false;
    isGameStarted = true;
    document.body.className = '';

    updatePlayerPos();
    if (spawnTimer) clearInterval(spawnTimer);
    spawnTimer = setInterval(spawnItem, 700);
    gameLoop();
  }

  function triggerGameOver() {
    isGameOver = true;
    isGameStarted = false;
    clearInterval(spawnTimer);
    document.getElementById('final-stats').innerText = 
      `Você percorreu ${distance}m e acumulou ${score} pontos!`;
    if (gameOverScreen) gameOverScreen.style.display = 'flex';
  }

  // Geração de Obstáculos e Lixos
  // Geração de Obstáculos e Lixos
  function spawnItem() {
    if (isGameOver || !isGameStarted) return;
    const targetContainer = container || document.getElementById('game-container');
    if (!targetContainer) return;

    const item = document.createElement('img');
    // Adiciona AMBAS as classes para manter o estilo do CSS e a colisão do JS
    item.classList.add('item', 'game-item');

    // Chance de 40% Árvore / 60% Lixo
    const isObstacle = Math.random() < 0.4;

    if (isObstacle) {
      const randomTree = treeSprites[Math.floor(Math.random() * treeSprites.length)];
      item.src = randomTree;
      item.dataset.isTrash = 'false';
      item.alt = 'Árvore';
    } else {
      const randomTrash = trashSprites[Math.floor(Math.random() * trashSprites.length)];
      item.src = randomTrash;
      item.dataset.isTrash = 'true';
      item.alt = 'Lixo';
    }

    // Sorteia uma das 3 pistas (0, 1 ou 2)
    const lane = Math.floor(Math.random() * 3);
    item.style.position = 'absolute';
    item.style.left = '100vw';
    item.style.top = getLaneY(lane) + 'px';

    targetContainer.appendChild(item);
  }
  // Loop Principal
  function gameLoop() {
    if (!isGameOver && isGameStarted) {
      distance += 1;
      baseSpeed = updateGameSpeed(distance);

      const currentBiome = getBiome(distance);
      const biomeClass = 'biome-' + currentBiome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-');

      if (!document.body.classList.contains(biomeClass)) {
        document.body.className = biomeClass;
      }

      // Atualização de HUD
      if (document.getElementById('score-display')) document.getElementById('score-display').innerText = score;
      if (document.getElementById('combo-display')) document.getElementById('combo-display').innerText = combo + 'x';
      if (document.getElementById('dist-display')) document.getElementById('dist-display').innerText = distance + 'm';
      if (document.getElementById('biome-display')) document.getElementById('biome-display').innerText = currentBiome;
      if (document.getElementById('lives-display')) document.getElementById('lives-display').innerText = '♥'.repeat(Math.max(0, lives));

      // Colisão e Movimentação
      const items = document.querySelectorAll('.item');
      if (player) {
        const pRect = player.getBoundingClientRect();

        items.forEach(item => {
          let currentLeft = parseFloat(item.style.left) || window.innerWidth;
          currentLeft -= baseSpeed;
          item.style.left = currentLeft + 'px';

          const iRect = item.getBoundingClientRect();

          if (
            pRect.left < iRect.right &&
            pRect.right > iRect.left &&
            pRect.top < iRect.bottom &&
            pRect.bottom > iRect.top
          ) {
            if (item.dataset.isTrash === 'true') {
              score += 100 * combo;
              combo++;
            } else {
              lives--;
              combo = 1;
            }
            item.remove();
            if (lives <= 0) triggerGameOver();
          } else if (currentLeft < -90) {
            item.remove();
          }
        });
      }

      requestAnimationFrame(gameLoop);
    }
  }

  // Eventos de Botões e Teclado
  if (startBtn) startBtn.addEventListener('click', showTutorial);
  if (playNowBtn) playNowBtn.addEventListener('click', startGame);
  if (restartBtn) restartBtn.addEventListener('click', startGame);

  window.addEventListener('keydown', (e) => {
    if (isGameOver || !isGameStarted) return;
    const key = e.key.toLowerCase();

    if (key === 'arrowup' || key === 'w') {
      if (currentLane > 0) currentLane--;
    } else if (key === 'arrowdown' || key === 's') {
      if (currentLane < 2) currentLane++;
    }
    updatePlayerPos();
  });

  window.addEventListener('resize', updatePlayerPos);
  updatePlayerPos();
});