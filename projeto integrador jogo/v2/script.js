window.addEventListener('DOMContentLoaded', () => {
  const player = document.getElementById('player');
  const container = document.getElementById('game-container');
  const gameOverScreen = document.getElementById('game-over-screen');

  const trashSprites = ['lixo1.png', 'lixo2.png', 'lixo3.png', 'lixo4.png', 'lixo5.png', 'lixo6.png', 'lixo7.png', 'lixo8.png'];

  let currentLane = 1;
  let score = 0;
  let lives = 3;
  let combo = 1;
  let distance = 0;
  let baseSpeed = 5;
  let isGameOver = false;
  let spawnTimer = null;

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

  window.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    const key = e.key.toLowerCase();

    if (key === 'arrowup' || key === 'w') {
      if (currentLane > 0) currentLane--;
    } else if (key === 'arrowdown' || key === 's') {
      if (currentLane < 2) currentLane++;
    }
    updatePlayerPos();
  });

  function getBiome(dist) {
    if (dist < 1000) return "América do Sul";
    if (dist < 2500) return "Ásia";
    if (dist < 4000) return "África";
    if (dist < 5500) return "Europa";
    return "Antártida";
  }

  function spawnItem() {
    if (isGameOver) return;
    const item = document.createElement('div');
    
    const isTrash = Math.random() > 0.35; 
    const randomLane = Math.floor(Math.random() * 3);

    item.className = `item ${isTrash ? 'trash' : 'nature'}`;
    item.dataset.isTrash = isTrash;

    if (isTrash) {
      const randomTrash = trashSprites[Math.floor(Math.random() * trashSprites.length)];
      item.style.backgroundImage = `url('${randomTrash}')`;
    } else {
      item.style.backgroundImage = "url('arvore.png')";
    }

    item.style.top = (getLaneY(randomLane) + 23) + 'px';
    item.style.left = (window.innerWidth + 60) + 'px';

    container.appendChild(item);
  }

  function gameLoop() {
    if (!isGameOver) {
      distance += 1;
      baseSpeed = updateGameSpeed(distance);

      const currentBiome = getBiome(distance);

      // Converte o nome do bioma para classe CSS (ex: "biome-america-do-sul")
      const biomeClass = 'biome-' + currentBiome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-');

      // Aplica a classe diretamente no BODY para alternar a cor da borda
      if (!document.body.classList.contains(biomeClass)) {
        document.body.className = biomeClass;
      }

      document.getElementById('score-display').innerText = score;
      document.getElementById('combo-display').innerText = combo + 'x';
      document.getElementById('dist-display').innerText = distance + 'm';
      document.getElementById('biome-display').innerText = currentBiome;
      document.getElementById('lives-display').innerText = '♥'.repeat(Math.max(0, lives));

      const items = document.querySelectorAll('.item');
      const pRect = player.getBoundingClientRect();

      items.forEach(item => {
        let currentLeft = parseFloat(item.style.left);
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

      requestAnimationFrame(gameLoop);
    }
  }

  function triggerGameOver() {
    isGameOver = true;
    clearInterval(spawnTimer);
    document.getElementById('final-stats').innerText = 
      `Você percorreu ${distance}m e acumulou ${score} pontos!`;
    gameOverScreen.style.display = 'flex';
  }

  window.resetGame = function() {
    document.querySelectorAll('.item').forEach(i => i.remove());
    score = 0; lives = 3; combo = 1; distance = 0; baseSpeed = 5;
    currentLane = 1; isGameOver = false;
    document.body.className = '';
    updatePlayerPos();
    gameOverScreen.style.display = 'none';
    spawnTimer = setInterval(spawnItem, 700);
    gameLoop();
  };

  window.addEventListener('resize', updatePlayerPos);

  // Apenas posiciona o personagem e aguarda o clique no botão JOGAR
  updatePlayerPos();

  window.startGame = function() {
    const startScreen = document.getElementById('start-screen');
    if (startScreen) startScreen.style.display = 'none';

    score = 0; lives = 3; combo = 1; distance = 0; baseSpeed = 5;
    currentLane = 1; isGameOver = false;
    document.body.className = '';

    updatePlayerPos();
    if (spawnTimer) clearInterval(spawnTimer);
    spawnTimer = setInterval(spawnItem, 700);
    gameLoop();
  };
});