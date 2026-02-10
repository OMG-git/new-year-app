// Main Application Controller
import { CanvasManager } from './canvas/CanvasManager.js';
import { TEMPLATES, TEMPLATE_CATEGORIES, renderTemplateThumbnail } from './data/templates.js';
import { ZODIAC_ANIMALS, getCurrentZodiac, getAllStamps } from './data/stamps.js';
import './styles/main.css';

class NengaApp {
  constructor() {
    this.canvasManager = null;
    this.currentZodiac = getCurrentZodiac();
    this.currentCategory = 'all';
    this.init();
  }

  init() {
    this.bindTopPage();
    this.bindEditor();
    this.bindToolPanels();
    this.renderTemplates();
    this.renderStamps();
    this.renderZodiac();

    // Responsive resize
    window.addEventListener('resize', () => {
      if (this.canvasManager) {
        this.canvasManager.fitToScreen();
      }
    });
  }

  // ====== Page Navigation ======

  showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
  }

  // ====== Top Page ======
  bindTopPage() {
    // Category tabs
    document.querySelectorAll('.cat-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentCategory = tab.dataset.category;
        this.renderTemplates();
      });
    });

    // Resume button
    const resumeContainer = document.getElementById('resume-container');
    if (localStorage.getItem('nenga_design')) {
      resumeContainer.style.display = 'block';
    }

    document.getElementById('btn-resume').addEventListener('click', () => {
      this.openEditor(null);
      setTimeout(async () => {
        const success = await this.canvasManager.loadFromLocal();
        if (success) {
          this.showToast('保存データを読み込みました');
        } else {
          this.showToast('保存データの読み込みに失敗しました');
        }
      }, 100);
    });

    // Blank canvas button
    document.getElementById('btn-blank').addEventListener('click', () => {
      this.openEditor(null);
    });
  }

  renderTemplates() {
    const grid = document.getElementById('template-grid');
    grid.innerHTML = '';

    const filtered = this.currentCategory === 'all'
      ? TEMPLATES
      : TEMPLATES.filter(t => t.category === this.currentCategory);

    filtered.forEach(template => {
      const card = document.createElement('div');
      card.className = 'template-card';
      const thumbSrc = renderTemplateThumbnail(template);
      card.innerHTML = `
        <img class="thumb" src="${thumbSrc}" alt="${template.name}">
        <div class="card-label">${template.name}</div>
      `;
      card.addEventListener('click', () => this.openEditor(template));
      grid.appendChild(card);
    });
  }

  // ====== Editor ======
  openEditor(template) {
    this.showPage('editor-page');
    if (!this.canvasManager) {
      this.canvasManager = new CanvasManager('main-canvas').init();
      this.canvasManager.onSelectionChange = (obj) => this.onObjectSelected(obj);
    }

    if (template) {
      this.canvasManager.loadTemplate(template);
    } else {
      this.canvasManager.clear();
    }

    // Reset face to design
    document.querySelectorAll('.face-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.face-tab[data-face="design"]').classList.add('active');

    // Fit to screen after a short delay to ensure layout is ready
    setTimeout(() => {
      this.canvasManager.fitToScreen();
    }, 50);
  }

  bindEditor() {
    // Back button
    document.getElementById('btn-back').addEventListener('click', () => {
      this.canvasManager.saveToLocal();
      this.showPage('top-page');
    });

    // Face tabs (design / address)
    document.querySelectorAll('.face-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.face-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.canvasManager.switchFace(tab.dataset.face);
      });
    });

    // Undo / Redo
    document.getElementById('btn-undo').addEventListener('click', () => {
      this.canvasManager.undo();
    });
    document.getElementById('btn-redo').addEventListener('click', () => {
      this.canvasManager.redo();
    });

    // Save
    document.getElementById('btn-save').addEventListener('click', () => {
      this.canvasManager.saveToLocal();
      document.getElementById('resume-container').style.display = 'block';
      this.showToast('保存しました');
    });

    // Print
    document.getElementById('btn-print').addEventListener('click', () => {
      const dataUrl = this.canvasManager.toDataURL();
      document.getElementById('print-image').src = dataUrl;
      setTimeout(() => window.print(), 300);
    });

    // Download
    document.getElementById('btn-download').addEventListener('click', () => {
      const dataUrl = this.canvasManager.toDataURL();
      const link = document.createElement('a');
      link.download = `年賀状_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    });
  }

  // ====== Tool Panels ======
  bindToolPanels() {
    // Tool tab switching
    document.querySelectorAll('.tool-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`panel-${tab.dataset.tool}`).classList.add('active');
      });
    });

    this.bindTextPanel();
    this.bindImagePanel();
    this.bindBackgroundPanel();
  }

  // --- Text Panel ---
  bindTextPanel() {
    // Add text
    document.getElementById('btn-add-text').addEventListener('click', () => {
      this.canvasManager.addText('テキスト', {
        fontSize: 36,
        fontFamily: 'Noto Serif JP',
      });
    });

    // Preset texts
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.canvasManager.addText(btn.dataset.text, {
          fontSize: 36,
          fontFamily: 'Noto Serif JP',
          fill: '#D4342A',
        });
      });
    });

    // Font family
    document.getElementById('font-family').addEventListener('change', (e) => {
      this.canvasManager.updateActiveObject({ fontFamily: e.target.value });
    });

    // Font size
    const fontSizeInput = document.getElementById('font-size');
    const fontSizeVal = document.getElementById('font-size-val');
    fontSizeInput.addEventListener('input', (e) => {
      const size = parseInt(e.target.value);
      fontSizeVal.textContent = `${size}px`;
      this.canvasManager.updateActiveObject({ fontSize: size });
    });

    // Font color
    document.getElementById('font-color').addEventListener('input', (e) => {
      this.canvasManager.updateActiveObject({ fill: e.target.value });
    });

    // Bold
    document.getElementById('btn-bold').addEventListener('click', () => {
      const obj = this.canvasManager.getActiveObject();
      if (obj) {
        const isBold = obj.fontWeight === 'bold';
        this.canvasManager.updateActiveObject({ fontWeight: isBold ? 'normal' : 'bold' });
        document.getElementById('btn-bold').classList.toggle('active', !isBold);
      }
    });

    // Vertical text (simulated by adding \n between chars)
    document.getElementById('btn-vertical').addEventListener('click', () => {
      const obj = this.canvasManager.getActiveObject();
      if (obj && obj.type === 'textbox') {
        const text = obj.text.replace(/\n/g, '');
        const verticalText = text.split('').join('\n');
        const isCurrentlyVertical = obj.text.includes('\n') && !obj._isVertical;
        if (obj._isVertical) {
          obj.set({ text: obj._originalText || text, width: 400 });
          obj._isVertical = false;
        } else {
          obj._originalText = text;
          obj.set({ text: verticalText, width: 60 });
          obj._isVertical = true;
        }
        this.canvasManager.getCanvas().renderAll();
        document.getElementById('btn-vertical').classList.toggle('active', obj._isVertical);
      }
    });

    // Delete
    document.getElementById('btn-delete-obj').addEventListener('click', () => {
      this.canvasManager.deleteActiveObject();
    });
  }

  // --- Image Panel ---
  bindImagePanel() {
    const fileInput = document.getElementById('image-input');

    document.getElementById('btn-upload-image').addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          this.canvasManager.addImage(img);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
      fileInput.value = '';
    });

    document.getElementById('btn-delete-img')?.addEventListener('click', () => {
      this.canvasManager.deleteActiveObject();
    });
  }

  // --- Background Panel ---
  bindBackgroundPanel() {
    const bgType = document.getElementById('bg-type');
    const colorGroup = document.getElementById('bg-color-group');
    const gradGroup = document.getElementById('bg-gradient-group');
    const patternGroup = document.getElementById('bg-pattern-group');

    bgType.addEventListener('change', () => {
      colorGroup.style.display = bgType.value === 'color' ? '' : 'none';
      gradGroup.style.display = bgType.value === 'gradient' ? '' : 'none';
      patternGroup.style.display = bgType.value === 'pattern' ? '' : 'none';
    });

    // Solid color
    document.getElementById('bg-color').addEventListener('input', (e) => {
      this.canvasManager.setBackgroundColor(e.target.value);
    });

    // Gradient
    const applyGradient = () => {
      this.canvasManager.setBackgroundGradient(
        document.getElementById('bg-grad1').value,
        document.getElementById('bg-grad2').value,
        document.getElementById('bg-grad-dir').value,
      );
    };
    document.getElementById('bg-grad1').addEventListener('input', applyGradient);
    document.getElementById('bg-grad2').addEventListener('input', applyGradient);
    document.getElementById('bg-grad-dir').addEventListener('change', applyGradient);

    // Pattern
    let currentPattern = 'ichimatsu';
    document.querySelectorAll('.pattern-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPattern = btn.dataset.pattern;
        this.canvasManager.setBackgroundPattern(
          currentPattern,
          document.getElementById('pattern-color1').value,
          document.getElementById('pattern-color2').value,
        );
      });
    });
    document.getElementById('pattern-color1').addEventListener('input', () => {
      this.canvasManager.setBackgroundPattern(
        currentPattern,
        document.getElementById('pattern-color1').value,
        document.getElementById('pattern-color2').value,
      );
    });
    document.getElementById('pattern-color2').addEventListener('input', () => {
      this.canvasManager.setBackgroundPattern(
        currentPattern,
        document.getElementById('pattern-color1').value,
        document.getElementById('pattern-color2').value,
      );
    });
  }

  // ====== Stamps ======
  renderStamps() {
    const grid = document.getElementById('stamp-grid');
    grid.innerHTML = '';
    const stamps = getAllStamps(this.currentZodiac);
    stamps.forEach(stamp => {
      const item = document.createElement('div');
      item.className = 'stamp-item';
      item.textContent = stamp.emoji;
      item.title = stamp.name;
      item.addEventListener('click', () => {
        this.canvasManager.addEmoji(stamp.emoji);
      });
      grid.appendChild(item);
    });
  }

  // ====== Zodiac ======
  renderZodiac() {
    const grid = document.getElementById('zodiac-grid');
    grid.innerHTML = '';
    ZODIAC_ANIMALS.forEach(zodiac => {
      const item = document.createElement('div');
      item.className = `zodiac-item ${zodiac.id === this.currentZodiac.id ? 'active' : ''}`;
      item.innerHTML = `
        <span class="zodiac-emoji">${zodiac.emoji}</span>
        <span class="zodiac-name">${zodiac.name}</span>
      `;
      item.addEventListener('click', () => {
        this.currentZodiac = zodiac;
        this.renderZodiac();
        this.renderStamps();
      });
      grid.appendChild(item);
    });
  }

  // ====== Object Selection Handler ======
  onObjectSelected(obj) {
    const textProps = document.getElementById('text-props');
    const imageProps = document.getElementById('image-props');

    if (!obj) {
      textProps.style.display = 'none';
      imageProps.style.display = 'none';
      return;
    }

    if (obj.type === 'textbox' || obj.type === 'text') {
      textProps.style.display = '';
      imageProps.style.display = 'none';

      // Sync UI
      if (obj.fontFamily) {
        const fontSelect = document.getElementById('font-family');
        for (const opt of fontSelect.options) {
          if (opt.value === obj.fontFamily) {
            fontSelect.value = obj.fontFamily;
            break;
          }
        }
      }
      document.getElementById('font-size').value = obj.fontSize || 36;
      document.getElementById('font-size-val').textContent = `${obj.fontSize || 36}px`;
      document.getElementById('font-color').value = obj.fill || '#333333';
      document.getElementById('btn-bold').classList.toggle('active', obj.fontWeight === 'bold');
      document.getElementById('btn-vertical').classList.toggle('active', !!obj._isVertical);

      // Switch to text panel
      document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
      document.querySelector('.tool-tab[data-tool="text"]').classList.add('active');
      document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-text').classList.add('active');
    } else if (obj.type === 'image') {
      textProps.style.display = 'none';
      imageProps.style.display = '';

      // Switch to image panel
      document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
      document.querySelector('.tool-tab[data-tool="image"]').classList.add('active');
      document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-image').classList.add('active');
    }
  }

  // ====== Toast Notification ======
  showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%;
        transform: translateX(-50%); padding: 12px 24px;
        background: rgba(40, 167, 69, 0.9); color: #fff;
        border-radius: 8px; font-size: 0.9rem;
        z-index: 9999; opacity: 0;
        transition: opacity 0.3s ease;
        font-family: var(--font-sans);
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 2000);
  }
}

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
  new NengaApp();
});
