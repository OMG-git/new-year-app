// Template definitions for the New Year card app
// Each template defines canvas objects and background

export const TEMPLATE_CATEGORIES = {
  all: 'すべて',
  japanese: '和風',
  pop: 'ポップ',
  simple: 'シンプル',
  photo: '写真フレーム',
};

export const TEMPLATES = [
  // === Japanese (和風) ===
  {
    id: 'shochikubai',
    name: '松竹梅',
    category: 'japanese',
    background: { type: 'color', value: '#FDF5E6' },
    objects: [
      { type: 'text', text: '謹賀新年', left: 350, top: 200, fontSize: 72, fontFamily: 'Noto Serif JP', fill: '#8B0000', textAlign: 'center' },
      { type: 'text', text: '本年もよろしく\nお願いいたします', left: 350, top: 500, fontSize: 28, fontFamily: 'Noto Serif JP', fill: '#333', textAlign: 'center' },
      { type: 'emoji', text: '🎍', left: 100, top: 150, fontSize: 80 },
      { type: 'emoji', text: '🎋', left: 550, top: 150, fontSize: 80 },
      { type: 'emoji', text: '🌸', left: 100, top: 700, fontSize: 60 },
      { type: 'emoji', text: '🌸', left: 580, top: 700, fontSize: 60 },
    ],
    thumbBg: '#FDF5E6',
    thumbEmoji: '🎍',
  },
  {
    id: 'akafuji',
    name: '赤富士',
    category: 'japanese',
    background: { type: 'gradient', color1: '#FF6B35', color2: '#FFC947', direction: 'to bottom' },
    objects: [
      { type: 'text', text: '謹賀新年', left: 350, top: 180, fontSize: 68, fontFamily: 'Noto Serif JP', fill: '#FFFFFF', textAlign: 'center' },
      { type: 'emoji', text: '🗻', left: 350, top: 450, fontSize: 160 },
      { type: 'text', text: '明けましておめでとうございます', left: 350, top: 750, fontSize: 24, fontFamily: 'Noto Serif JP', fill: '#FFF8DC', textAlign: 'center' },
      { type: 'emoji', text: '☀️', left: 350, top: 80, fontSize: 50 },
    ],
    thumbBg: 'linear-gradient(to bottom, #FF6B35, #FFC947)',
    thumbEmoji: '🗻',
  },
  {
    id: 'washi',
    name: '和紙風',
    category: 'japanese',
    background: { type: 'color', value: '#F5F0E8' },
    objects: [
      { type: 'text', text: '迎春', left: 200, top: 300, fontSize: 96, fontFamily: 'Noto Serif JP', fill: '#D4342A', textAlign: 'center' },
      { type: 'text', text: '旧年中は大変\nお世話になりました', left: 450, top: 500, fontSize: 26, fontFamily: 'Noto Serif JP', fill: '#555', textAlign: 'center' },
      { type: 'emoji', text: '🌅', left: 550, top: 100, fontSize: 70 },
      { type: 'emoji', text: '🎐', left: 100, top: 600, fontSize: 50 },
    ],
    thumbBg: '#F5F0E8',
    thumbEmoji: '🌅',
  },

  // === Pop (ポップ) ===
  {
    id: 'colorful',
    name: 'カラフル',
    category: 'pop',
    background: { type: 'gradient', color1: '#667eea', color2: '#764ba2', direction: 'to bottom right' },
    objects: [
      { type: 'text', text: 'HAPPY\nNEW YEAR', left: 350, top: 250, fontSize: 64, fontFamily: 'Noto Sans JP', fill: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },
      { type: 'text', text: '2026', left: 350, top: 500, fontSize: 80, fontFamily: 'Noto Sans JP', fill: '#FFD700', fontWeight: 'bold', textAlign: 'center' },
      { type: 'emoji', text: '🎉', left: 120, top: 100, fontSize: 60 },
      { type: 'emoji', text: '✨', left: 550, top: 120, fontSize: 50 },
      { type: 'emoji', text: '🎊', left: 100, top: 650, fontSize: 50 },
      { type: 'emoji', text: '🌟', left: 560, top: 680, fontSize: 50 },
    ],
    thumbBg: 'linear-gradient(to bottom right, #667eea, #764ba2)',
    thumbEmoji: '🎉',
  },
  {
    id: 'pastel',
    name: 'パステル',
    category: 'pop',
    background: { type: 'gradient', color1: '#ffecd2', color2: '#fcb69f', direction: 'to bottom' },
    objects: [
      { type: 'text', text: 'あけまして\nおめでとう\nございます', left: 350, top: 280, fontSize: 44, fontFamily: 'Zen Maru Gothic', fill: '#e17055', textAlign: 'center' },
      { type: 'emoji', text: '🌸', left: 150, top: 100, fontSize: 50 },
      { type: 'emoji', text: '🌷', left: 530, top: 130, fontSize: 50 },
      { type: 'emoji', text: '🎀', left: 350, top: 650, fontSize: 60 },
    ],
    thumbBg: 'linear-gradient(to bottom, #ffecd2, #fcb69f)',
    thumbEmoji: '🌸',
  },
  {
    id: 'retro',
    name: 'レトロ',
    category: 'pop',
    background: { type: 'color', value: '#2C3E50' },
    objects: [
      { type: 'text', text: '賀正', left: 350, top: 250, fontSize: 100, fontFamily: 'Noto Serif JP', fill: '#E74C3C', textAlign: 'center' },
      { type: 'text', text: '二〇二六年 元旦', left: 350, top: 550, fontSize: 30, fontFamily: 'Noto Serif JP', fill: '#ECF0F1', textAlign: 'center' },
      { type: 'emoji', text: '⭐', left: 150, top: 100, fontSize: 40 },
      { type: 'emoji', text: '⭐', left: 530, top: 100, fontSize: 40 },
    ],
    thumbBg: '#2C3E50',
    thumbEmoji: '⭐',
  },

  // === Simple (シンプル) ===
  {
    id: 'minimal',
    name: 'ミニマル白',
    category: 'simple',
    background: { type: 'color', value: '#FFFFFF' },
    objects: [
      { type: 'text', text: '謹賀新年', left: 350, top: 350, fontSize: 56, fontFamily: 'Noto Serif JP', fill: '#333333', textAlign: 'center' },
      { type: 'text', text: '2026', left: 350, top: 500, fontSize: 36, fontFamily: 'Noto Sans JP', fill: '#999999', textAlign: 'center' },
    ],
    thumbBg: '#FFFFFF',
    thumbEmoji: '✉️',
  },
  {
    id: 'monotone',
    name: 'モノトーン',
    category: 'simple',
    background: { type: 'color', value: '#1a1a1a' },
    objects: [
      { type: 'text', text: 'Happy\nNew Year', left: 350, top: 300, fontSize: 52, fontFamily: 'Noto Sans JP', fill: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },
      { type: 'text', text: '2026', left: 350, top: 550, fontSize: 40, fontFamily: 'Noto Sans JP', fill: '#666666', textAlign: 'center' },
    ],
    thumbBg: '#1a1a1a',
    thumbEmoji: '🖤',
  },

  // === Photo Frame (写真フレーム) ===
  {
    id: 'photo-center',
    name: '中央写真枠',
    category: 'photo',
    background: { type: 'color', value: '#FFF8F0' },
    objects: [
      { type: 'text', text: '謹賀新年', left: 350, top: 100, fontSize: 48, fontFamily: 'Noto Serif JP', fill: '#D4342A', textAlign: 'center' },
      { type: 'rect', left: 350, top: 430, width: 400, height: 350, fill: '#E8E0D8', stroke: '#D4A855', strokeWidth: 3 },
      { type: 'text', text: '写真をここに\nドロップ', left: 350, top: 430, fontSize: 22, fontFamily: 'Noto Sans JP', fill: '#999', textAlign: 'center' },
      { type: 'text', text: '本年もよろしくお願いいたします', left: 350, top: 720, fontSize: 20, fontFamily: 'Noto Serif JP', fill: '#555', textAlign: 'center' },
    ],
    thumbBg: '#FFF8F0',
    thumbEmoji: '📷',
  },
  {
    id: 'photo-collage',
    name: 'コラージュ風',
    category: 'photo',
    background: { type: 'gradient', color1: '#f093fb', color2: '#f5576c', direction: 'to bottom right' },
    objects: [
      { type: 'text', text: '2026', left: 350, top: 100, fontSize: 72, fontFamily: 'Noto Sans JP', fill: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },
      { type: 'rect', left: 180, top: 350, width: 200, height: 200, fill: 'rgba(255,255,255,0.3)', stroke: '#fff', strokeWidth: 2 },
      { type: 'rect', left: 520, top: 350, width: 200, height: 200, fill: 'rgba(255,255,255,0.3)', stroke: '#fff', strokeWidth: 2 },
      { type: 'text', text: 'Happy New Year!', left: 350, top: 650, fontSize: 28, fontFamily: 'Noto Sans JP', fill: '#FFFFFF', textAlign: 'center' },
    ],
    thumbBg: 'linear-gradient(to bottom right, #f093fb, #f5576c)',
    thumbEmoji: '🎞',
  },
];

// Generate thumbnail canvas for template card
export function renderTemplateThumbnail(template) {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 296;
  const ctx = canvas.getContext('2d');

  // Background
  if (template.thumbBg.startsWith('linear-gradient')) {
    // parse gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 296);
    const colors = template.thumbBg.match(/#[0-9a-fA-F]{6}/g) || ['#ccc', '#eee'];
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1] || colors[0]);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = template.thumbBg;
  }
  ctx.fillRect(0, 0, 200, 296);

  // Emoji in center
  ctx.font = '60px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(template.thumbEmoji, 100, 120);

  // Name
  ctx.font = '14px "Noto Sans JP", sans-serif';
  ctx.fillStyle = template.thumbBg === '#1a1a1a' || template.thumbBg === '#2C3E50' ? '#fff' : '#333';
  ctx.fillText(template.name, 100, 230);

  return canvas.toDataURL();
}
