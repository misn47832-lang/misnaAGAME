const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ingredientCountEl = document.getElementById('ingredientCount');
const cookStageEl = document.getElementById('cookStage');
const customerNameEl = document.getElementById('customerName');
const coinsEl = document.getElementById('coins');
const gameLog = document.getElementById('gameLog');

const addIngredientBtn = document.getElementById('addIngredient');
const cookDishBtn = document.getElementById('cookDish');
const sellDishBtn = document.getElementById('sellDish');

const customers = [
  { name: 'Kelinci', color: '#ff9f9f', price: 14, ears: 'long' },
  { name: 'Rusa', color: '#c68456', price: 18, ears: 'small' },
  { name: 'Ayam', color: '#f3d180', price: 11, ears: 'short' },
  { name: 'Kucing', color: '#b9d3df', price: 13, ears: 'pointy' },
];

const gameState = {
  ingredients: 0,
  cookProgress: 0,
  currentCustomer: null,
  coins: 0,
  steamPower: 0,
  bearBounce: 0,
  buyerProgress: 0,
  saleFlash: 0,
};

function log(message) {
  const entry = document.createElement('div');
  entry.textContent = `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — ${message}`;
  gameLog.prepend(entry);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomCustomer() {
  return customers[Math.floor(Math.random() * customers.length)];
}

function spawnCustomer() {
  if (!gameState.currentCustomer) {
    gameState.currentCustomer = randomCustomer();
    gameState.buyerProgress = 0;
    log(`${gameState.currentCustomer.name} datang sebagai pelanggan.`);
    updateStatus();
  }
}

function updateStatus() {
  ingredientCountEl.textContent = gameState.ingredients;
  coinsEl.textContent = gameState.coins;
  cookStageEl.textContent = gameState.cookProgress === 0 ? 'Belum' : gameState.cookProgress < 3 ? 'Setengah Matang' : 'Matang';
  customerNameEl.textContent = gameState.currentCustomer ? gameState.currentCustomer.name : '-';
}

function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawCustomer(x, y, animal) {
  const bodyRadius = 36;
  ctx.fillStyle = animal.color;
  ctx.beginPath();
  ctx.ellipse(x, y, bodyRadius, 42, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - 12, y - 18, 9, 0, Math.PI * 2);
  ctx.arc(x + 12, y - 18, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#3b2312';
  ctx.beginPath();
  ctx.arc(x - 12, y - 18, 4, 0, Math.PI * 2);
  ctx.arc(x + 12, y - 18, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#3b2312';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y - 2, 7, 0, Math.PI);
  ctx.stroke();

  ctx.fillStyle = animal.color;
  if (animal.ears === 'long') {
    ctx.beginPath();
    ctx.ellipse(x - 26, y - 48, 10, 26, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 26, y - 48, 10, 26, 0.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (animal.ears === 'pointy') {
    ctx.beginPath();
    ctx.moveTo(x - 20, y - 38);
    ctx.lineTo(x - 10, y - 58);
    ctx.lineTo(x - 2, y - 34);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 20, y - 38);
    ctx.lineTo(x + 10, y - 58);
    ctx.lineTo(x + 2, y - 34);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.ellipse(x - 18, y - 42, 10, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 18, y - 42, 10, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawKitchen() {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const wall = ctx.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, '#daeeff');
  wall.addColorStop(0.6, '#eef1e7');
  wall.addColorStop(1, '#f8ede1');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#eef2db';
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 14; col++) {
      const size = 36;
      const x = col * size + (row % 2 ? 18 : 0);
      const y = 288 + row * 18;
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = '#b3b8a8';
      ctx.fillRect(x, y, 14, 14);
    }
  }
  ctx.globalAlpha = 1;

  const windowGradient = ctx.createLinearGradient(520, 40, 780, 220);
  windowGradient.addColorStop(0, '#9ad8ff');
  windowGradient.addColorStop(1, '#e8f5ff');
  ctx.fillStyle = windowGradient;
  drawRoundedRect(520, 30, 310, 190, 18);
  ctx.fill();

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(660, 30);
  ctx.lineTo(660, 220);
  ctx.moveTo(520, 120);
  ctx.lineTo(830, 120);
  ctx.stroke();

  ctx.fillStyle = '#b18956';
  drawRoundedRect(720, 18, 20, 26, 10);
  ctx.fill();

  ctx.fillStyle = '#c7a67a';
  ctx.fillRect(40, 54, 560, 26);
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = '#f8f3eb';
    ctx.beginPath();
    ctx.ellipse(90 + i * 110, 68, 30, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#d6c1a0';
  drawRoundedRect(80, 120, 100, 170, 18);
  ctx.fill();
  ctx.fillStyle = '#d6c1a0';
  drawRoundedRect(220, 120, 70, 150, 16);
  ctx.fill();
  ctx.fillStyle = '#d6c1a0';
  drawRoundedRect(330, 120, 52, 132, 14);
  ctx.fill();

  ctx.fillStyle = '#9f7c60';
  drawRoundedRect(160, 340, 520, 100, 24);
  ctx.fill();
  ctx.fillStyle = '#49382b';
  drawRoundedRect(170, 355, 500, 70, 18);
  ctx.fill();

  ctx.fillStyle = '#5a5a5a';
  ctx.beginPath();
  ctx.ellipse(380, 380, 108, 48, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(272, 380, 216, 96);
  ctx.fillStyle = '#3c3c3c';
  ctx.fillRect(250, 400, 32, 14);
  ctx.fillRect(618, 400, 32, 14);
  ctx.fillStyle = '#e4f0d9';
  ctx.fillRect(292, 408, 216, 28);

  if (gameState.cookProgress > 0) {
    ctx.fillStyle = '#e6cb99';
    ctx.beginPath();
    ctx.ellipse(380, 404, 86, 30, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const steamAlpha = clamp(gameState.steamPower * 0.12, 0, 1);
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `rgba(255,255,255,${steamAlpha * (1 - i * 0.18)})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(350 + i * 25, 360 - i * 20);
    ctx.bezierCurveTo(328 + i * 26, 330 - i * 28, 360 + i * 24, 310 - i * 30, 350 + i * 24, 280 - i * 35);
    ctx.stroke();
  }

  const bearX = 240;
  const bearY = 420 + Math.sin(gameState.bearBounce) * 4;
  ctx.fillStyle = '#8f6a45';
  ctx.beginPath();
  ctx.ellipse(bearX, bearY - 8, 84, 92, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(bearX, bearY - 100, 56, 58, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#d2b88a';
  ctx.beginPath();
  ctx.ellipse(bearX, bearY - 18, 46, 36, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#5b3d27';
  ctx.beginPath();
  ctx.arc(bearX - 18, bearY - 104, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bearX + 18, bearY - 104, 13, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#322116';
  ctx.beginPath();
  ctx.arc(bearX - 12, bearY - 108, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bearX + 12, bearY - 108, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#322116';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(bearX, bearY - 92, 12, 0, Math.PI);
  ctx.stroke();

  ctx.fillStyle = '#ac8a61';
  ctx.beginPath();
  ctx.ellipse(bearX, bearY - 18, 18, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#8f6a45';
  ctx.beginPath();
  ctx.ellipse(bearX - 82, bearY - 20, 22, 56, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(bearX + 82, bearY - 10, 22, 56, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(bearX - 45, bearY - 55, 90, 80);
  ctx.fillStyle = '#f0c275';
  drawRoundedRect(bearX - 45, bearY - 55, 90, 80, 20);
  ctx.fill();
  ctx.fillStyle = '#e0a53a';
  ctx.fillRect(bearX - 45, bearY - 10, 90, 12);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(750, 40, 124, 62);
  ctx.fillStyle = '#836141';
  ctx.font = '700 19px Inter, sans-serif';
  ctx.fillText('WARUNG KOKI', 760, 68);
  ctx.fillStyle = '#5d412c';
  ctx.font = '600 14px Inter, sans-serif';
  ctx.fillText('Beruang Lezat', 760, 92);

  ctx.fillStyle = '#fff7e4';
  drawRoundedRect(620, 260, 240, 180, 20);
  ctx.fill();
  ctx.fillStyle = '#d7c3a8';
  ctx.fillRect(620, 440, 240, 18);

  ctx.fillStyle = '#5b4329';
  ctx.font = '600 16px Inter, sans-serif';
  ctx.fillText('Tempat Pelanggan', 640, 282);

  if (gameState.currentCustomer) {
    const progress = Math.min(1, gameState.buyerProgress);
    const x = 870 - progress * 260;
    const y = 375;
    drawCustomer(x, y, gameState.currentCustomer);

    ctx.fillStyle = '#ffd382';
    ctx.fillRect(640, 500, 220 * progress, 14);
    ctx.strokeStyle = '#9a7046';
    ctx.lineWidth = 2;
    ctx.strokeRect(640, 500, 220, 14);
  }

  ctx.fillStyle = '#5b4329';
  ctx.font = '600 18px Inter, sans-serif';
  ctx.fillText('Belanja: ' + (gameState.currentCustomer ? `${gameState.currentCustomer.name} - ${gameState.currentCustomer.price} koin` : 'Menunggu...'), 640, 522);

  if (gameState.saleFlash > 0) {
    const alpha = clamp(gameState.saleFlash, 0, 1);
    ctx.fillStyle = `rgba(255, 255, 160, ${alpha})`;
    drawRoundedRect(250, 160, 400, 100, 26);
    ctx.fill();
    ctx.fillStyle = `rgba(85, 50, 20, ${alpha})`;
    ctx.font = '700 26px Inter, sans-serif';
    ctx.fillText('Transaksi Sukses!', 310, 220);
  }
}

function update() {
  gameState.bearBounce += 0.04;
  if (gameState.cookProgress > 0) {
    gameState.steamPower = Math.min(20, gameState.steamPower + 0.4);
  } else {
    gameState.steamPower = Math.max(0, gameState.steamPower - 0.6);
  }

  if (gameState.currentCustomer) {
    gameState.buyerProgress = Math.min(1, gameState.buyerProgress + 0.009);
  }

  gameState.saleFlash = Math.max(0, gameState.saleFlash - 0.02);
  drawKitchen();
  requestAnimationFrame(update);
}

addIngredientBtn.addEventListener('click', () => {
  gameState.ingredients += 1;
  log(`Beruang menambah bahan ke panci. Total bahan: ${gameState.ingredients}.`);
  updateStatus();
  spawnCustomer();
});

cookDishBtn.addEventListener('click', () => {
  if (gameState.ingredients === 0) {
    log('Tambahkan bahan dulu sebelum memasak.');
    return;
  }
  if (gameState.cookProgress >= 3) {
    log('Hidangan sudah matang. Siap dijual!');
    return;
  }

  gameState.cookProgress += 1;
  if (gameState.cookProgress === 1) {
    log('Beruang mulai memasak. Wangi mulai tercium.');
  } else if (gameState.cookProgress === 2) {
    log('Masak setengah matang. Pelanggan semakin penasaran.');
  } else {
    log('Hidangan matang sempurna dan siap dijual!');
  }
  updateStatus();
  spawnCustomer();
});

sellDishBtn.addEventListener('click', () => {
  if (!gameState.currentCustomer) {
    log('Belum ada pelanggan, tunggu hewan datang.');
    return;
  }
  if (gameState.cookProgress < 3) {
    log('Masak sampai matang dulu baru jual.');
    return;
  }

  const sale = gameState.currentCustomer.price;
  gameState.coins += sale;
  gameState.ingredients = 0;
  gameState.cookProgress = 0;
  gameState.currentCustomer = null;
  gameState.buyerProgress = 0;
  gameState.saleFlash = 1;
  log(`Beruang menjual hidangan kepada pelanggan dan mendapatkan ${sale} koin!`);
  updateStatus();
  setTimeout(spawnCustomer, 1400);
});

function init() {
  updateStatus();
  spawnCustomer();
  update();
  log('Game dimulai. Tambahkan bahan, masak, lalu jual ke pembeli.');
}

init();
