window.addEventListener('DOMContentLoaded', () => {
  const player = document.getElementById('player');
  const container = document.getElementById('game-container');
  const gameOverScreen = document.getElementById('game-over-screen');


// Adicione aqui os nomes exatos de todos os PNGs de lixo que você criou
const trashSprites = ['lixo1.png', 'lixo2.png', 'lixo3.png', 'lixo4.png', 'lixo5.png', 'lixo6.png', 'lixo7.png', 'lixo8.png'];


  function getLaneY(index) {
  const heights = [0.25, 0.50, 0.75];
  return (window.innerHeight * heights[index]) - 63; // Desconta 63px para centralizar
}
  let currentLane = 1;
  let score = 0;
  let lives = 3;
  let combo = 1;
  let distance = 0;
  let baseSpeed = 5;
  let isGameOver = false;
  let spawnTimer = null;

  function updatePlayerPos() {
    if (player) {
      player.style.top = getLaneY(currentLane) + 'px';
    }
  }

  // Movimento por teclado
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
    
    // Proporção: 65% Lixo, 35% Árvores
    const isTrash = Math.random() > 0.35; 
    const randomLane = Math.floor(Math.random() * 3);

    item.className = `item ${isTrash ? 'trash' : 'nature'}`;
    item.dataset.isTrash = isTrash;

    if (isTrash) {
      // Sorteia um dos sprites da sua lista de lixos
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
      baseSpeed = 5 + Math.floor(distance / 500) * 1.5;

      const currentBiome = getBiome(distance);

      // Converte "América do Sul" para "biome-america-do-sul"
      const biomeClass = 'biome-' + currentBiome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-');

      // Aplica a classe CSS do bioma atual no container
      if (!container.classList.contains(biomeClass)) {
        container.className = biomeClass;
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
        } else if (currentLeft < -50) {
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
    updatePlayerPos();
    gameOverScreen.style.display = 'none';
    spawnTimer = setInterval(spawnItem, 1200);
    gameLoop();
  };

  window.addEventListener('resize', updatePlayerPos);

  updatePlayerPos();
  spawnTimer = setInterval(spawnItem, 1200);
  gameLoop();
});