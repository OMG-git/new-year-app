// Canvas Manager - Fabric.js integration for the New Year card editor
import * as fabric from 'fabric';

// Postcard size in pixels (roughly 300 DPI for 100x148mm)
const CANVAS_WIDTH = 708;
const CANVAS_HEIGHT = 1048;

export class CanvasManager {
    constructor(canvasId) {
        this.fabricCanvas = null;
        this.canvasId = canvasId;
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 30;
        this.currentFace = 'design'; // 'design' or 'address'
        this.designState = null;
        this.addressState = null;
        this.onSelectionChange = null;
    }

    init() {
        this.fabricCanvas = new fabric.Canvas(this.canvasId, {
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            backgroundColor: '#FFFFFF',
            preserveObjectStacking: true,
        });

        // Listen for selection events
        this.fabricCanvas.on('selection:created', (e) => this._handleSelection(e));
        this.fabricCanvas.on('selection:updated', (e) => this._handleSelection(e));
        this.fabricCanvas.on('selection:cleared', () => this._handleSelectionCleared());
        this.fabricCanvas.on('object:modified', () => this.saveHistory());

        this.saveHistory();
        return this;
    }

    _handleSelection(e) {
        if (this.onSelectionChange) {
            this.onSelectionChange(e.selected?.[0] || null);
        }
    }

    _handleSelectionCleared() {
        if (this.onSelectionChange) {
            this.onSelectionChange(null);
        }
    }

    // --- Background ---
    setBackgroundColor(color) {
        this.fabricCanvas.backgroundColor = color;
        this.fabricCanvas.renderAll();
        this.saveHistory();
    }

    setBackgroundGradient(color1, color2, direction) {
        const coords = this._gradientCoords(direction);
        const gradient = new fabric.Gradient({
            type: 'linear',
            coords,
            colorStops: [
                { offset: 0, color: color1 },
                { offset: 1, color: color2 },
            ],
        });
        this.fabricCanvas.backgroundColor = gradient;
        this.fabricCanvas.renderAll();
        this.saveHistory();
    }

    _gradientCoords(direction) {
        switch (direction) {
            case 'to right': return { x1: 0, y1: 0, x2: CANVAS_WIDTH, y2: 0 };
            case 'to bottom right': return { x1: 0, y1: 0, x2: CANVAS_WIDTH, y2: CANVAS_HEIGHT };
            default: return { x1: 0, y1: 0, x2: 0, y2: CANVAS_HEIGHT }; // to bottom
        }
    }

    setBackgroundPattern(patternType, color1, color2) {
        const patternCanvas = document.createElement('canvas');
        const size = 40;
        patternCanvas.width = size;
        patternCanvas.height = size;
        const ctx = patternCanvas.getContext('2d');

        ctx.fillStyle = color2;
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = color1;

        switch (patternType) {
            case 'ichimatsu': // Checkered
                ctx.fillRect(0, 0, size / 2, size / 2);
                ctx.fillRect(size / 2, size / 2, size / 2, size / 2);
                break;
            case 'asanoha': // Hemp leaf
                ctx.strokeStyle = color1;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(size / 2, 0); ctx.lineTo(size / 2, size);
                ctx.moveTo(0, size / 2); ctx.lineTo(size, size / 2);
                ctx.moveTo(0, 0); ctx.lineTo(size, size);
                ctx.moveTo(size, 0); ctx.lineTo(0, size);
                ctx.stroke();
                break;
            case 'seigaiha': // Wave
                ctx.strokeStyle = color1;
                ctx.lineWidth = 1.5;
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.arc(size / 2, size, size / 2 - i * 6, Math.PI, 0);
                    ctx.stroke();
                }
                break;
            case 'sayagata': // Swastika pattern
                ctx.strokeStyle = color1;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(0, size / 4); ctx.lineTo(size * 3 / 4, size / 4);
                ctx.lineTo(size * 3 / 4, size);
                ctx.moveTo(size, size * 3 / 4); ctx.lineTo(size / 4, size * 3 / 4);
                ctx.lineTo(size / 4, 0);
                ctx.stroke();
                break;
        }

        const pattern = new fabric.Pattern({
            source: patternCanvas,
            repeat: 'repeat',
        });
        this.fabricCanvas.backgroundColor = pattern;
        this.fabricCanvas.renderAll();
        this.saveHistory();
    }

    // --- Text ---
    addText(text, options = {}) {
        const textObj = new fabric.Textbox(text, {
            left: options.left || CANVAS_WIDTH / 2,
            top: options.top || CANVAS_HEIGHT / 2,
            fontSize: options.fontSize || 36,
            fontFamily: options.fontFamily || 'Noto Serif JP',
            fill: options.fill || '#333333',
            fontWeight: options.fontWeight || 'normal',
            textAlign: options.textAlign || 'center',
            originX: 'center',
            originY: 'center',
            width: options.width || 400,
            editable: true,
            cursorColor: '#D4342A',
            cursorWidth: 2,
            padding: 8,
        });
        this.fabricCanvas.add(textObj);
        this.fabricCanvas.setActiveObject(textObj);
        this.fabricCanvas.renderAll();
        this.saveHistory();
        return textObj;
    }

    // --- Emoji / Stamp ---
    addEmoji(emoji, options = {}) {
        const text = new fabric.FabricText(emoji, {
            left: options.left || CANVAS_WIDTH / 2,
            top: options.top || CANVAS_HEIGHT / 2,
            fontSize: options.fontSize || 60,
            originX: 'center',
            originY: 'center',
        });
        this.fabricCanvas.add(text);
        this.fabricCanvas.setActiveObject(text);
        this.fabricCanvas.renderAll();
        this.saveHistory();
        return text;
    }

    // --- Image ---
    addImage(imgElement, options = {}) {
        const img = new fabric.FabricImage(imgElement, {
            left: options.left || CANVAS_WIDTH / 2,
            top: options.top || CANVAS_HEIGHT / 2,
            originX: 'center',
            originY: 'center',
        });
        // Scale to fit if too large
        const maxW = CANVAS_WIDTH * 0.8;
        const maxH = CANVAS_HEIGHT * 0.6;
        if (img.width > maxW || img.height > maxH) {
            const scale = Math.min(maxW / img.width, maxH / img.height);
            img.scale(scale);
        }
        this.fabricCanvas.add(img);
        this.fabricCanvas.setActiveObject(img);
        this.fabricCanvas.renderAll();
        this.saveHistory();
        return img;
    }

    // --- Rectangle (for photo frames) ---
    addRect(options = {}) {
        const rect = new fabric.Rect({
            left: options.left || CANVAS_WIDTH / 2,
            top: options.top || CANVAS_HEIGHT / 2,
            width: options.width || 300,
            height: options.height || 200,
            fill: options.fill || 'rgba(200,200,200,0.3)',
            stroke: options.stroke || '#ccc',
            strokeWidth: options.strokeWidth || 2,
            originX: 'center',
            originY: 'center',
            rx: 4,
            ry: 4,
        });
        this.fabricCanvas.add(rect);
        this.fabricCanvas.renderAll();
        return rect;
    }

    // --- Selection ---
    getActiveObject() {
        return this.fabricCanvas.getActiveObject();
    }

    deleteActiveObject() {
        const obj = this.fabricCanvas.getActiveObject();
        if (obj) {
            this.fabricCanvas.remove(obj);
            this.fabricCanvas.renderAll();
            this.saveHistory();
        }
    }

    updateActiveObject(props) {
        const obj = this.fabricCanvas.getActiveObject();
        if (obj) {
            obj.set(props);
            this.fabricCanvas.renderAll();
        }
    }

    // --- History (Undo/Redo) ---
    saveHistory() {
        const state = JSON.stringify(this.fabricCanvas.toJSON());
        // Remove future states if we're not at the end
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        this.history.push(state);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        this.historyIndex = this.history.length - 1;
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this._loadState(this.history[this.historyIndex]);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this._loadState(this.history[this.historyIndex]);
        }
    }

    async _loadState(stateJson) {
        await this.fabricCanvas.loadFromJSON(stateJson);
        this.fabricCanvas.renderAll();
    }

    // --- Face Switching ---
    async switchFace(face) {
        // Save current face state
        if (this.currentFace === 'design') {
            this.designState = JSON.stringify(this.fabricCanvas.toJSON());
        } else {
            this.addressState = JSON.stringify(this.fabricCanvas.toJSON());
        }

        this.currentFace = face;

        if (face === 'design' && this.designState) {
            await this.fabricCanvas.loadFromJSON(this.designState);
            this.fabricCanvas.renderAll();
        } else if (face === 'address') {
            if (this.addressState) {
                await this.fabricCanvas.loadFromJSON(this.addressState);
                this.fabricCanvas.renderAll();
            } else {
                this._initAddressFace();
            }
        }
    }

    _initAddressFace() {
        this.fabricCanvas.clear();
        this.fabricCanvas.backgroundColor = '#FFFFFF';

        // Postal code boxes
        const postalBoxStartX = 390;
        const postalBoxY = 60;
        const boxSize = 36;
        const boxGap = 6;
        for (let i = 0; i < 7; i++) {
            const x = postalBoxStartX + i * (boxSize + boxGap);
            const rect = new fabric.Rect({
                left: x,
                top: postalBoxY,
                width: boxSize,
                height: boxSize * 1.2,
                fill: 'transparent',
                stroke: i < 3 ? '#D4342A' : '#D4342A',
                strokeWidth: 1.5,
                selectable: false,
                evented: false,
            });
            this.fabricCanvas.add(rect);
        }

        // Postal code separator dash
        const dashX = postalBoxStartX + 3 * (boxSize + boxGap) - boxGap / 2;
        const dash = new fabric.Rect({
            left: dashX - 6,
            top: postalBoxY + boxSize * 0.5,
            width: 8,
            height: 2,
            fill: '#D4342A',
            selectable: false,
            evented: false,
        });
        this.fabricCanvas.add(dash);

        // Recipient address
        const addrText = new fabric.Textbox('東京都千代田区\n一丁目１番地', {
            left: 500,
            top: 200,
            fontSize: 26,
            fontFamily: 'Noto Serif JP',
            fill: '#333',
            textAlign: 'left',
            width: 40,
            originX: 'center',
        });
        this.fabricCanvas.add(addrText);

        // Recipient name
        const nameText = new fabric.Textbox('年賀　太郎　様', {
            left: 350,
            top: 300,
            fontSize: 38,
            fontFamily: 'Noto Serif JP',
            fill: '#333',
            textAlign: 'center',
            width: 60,
            originX: 'center',
        });
        this.fabricCanvas.add(nameText);

        // Sender section
        const senderAddr = new fabric.Textbox('東京都渋谷区\n二丁目２番地', {
            left: 150,
            top: 600,
            fontSize: 18,
            fontFamily: 'Noto Serif JP',
            fill: '#555',
            textAlign: 'left',
            width: 30,
            originX: 'center',
        });
        this.fabricCanvas.add(senderAddr);

        const senderName = new fabric.Textbox('差出　花子', {
            left: 100,
            top: 650,
            fontSize: 22,
            fontFamily: 'Noto Serif JP',
            fill: '#555',
            textAlign: 'center',
            width: 40,
            originX: 'center',
        });
        this.fabricCanvas.add(senderName);

        this.fabricCanvas.renderAll();
        this.saveHistory();
    }

    // --- Load Template ---
    loadTemplate(template) {
        this.fabricCanvas.clear();

        // Set background
        const bg = template.background;
        if (bg.type === 'gradient') {
            this.setBackgroundGradient(bg.color1, bg.color2, bg.direction);
        } else {
            this.setBackgroundColor(bg.value);
        }

        // Add objects
        template.objects.forEach(obj => {
            switch (obj.type) {
                case 'text':
                    this.addText(obj.text, obj);
                    break;
                case 'emoji':
                    this.addEmoji(obj.text, obj);
                    break;
                case 'rect':
                    this.addRect(obj);
                    break;
            }
        });

        this.fabricCanvas.discardActiveObject();
        this.fabricCanvas.renderAll();
        this.history = [];
        this.historyIndex = -1;
        this.saveHistory();
    }

    // --- Export ---
    toDataURL() {
        return this.fabricCanvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2, // 2x resolution for print quality
        });
    }

    // --- localStorage ---
    saveToLocal(key = 'nenga_design') {
        const data = {
            version: '1.0',
            design: this.designState || JSON.stringify(this.fabricCanvas.toJSON()),
            address: this.addressState,
            savedAt: new Date().toISOString(),
        };
        if (this.currentFace === 'design') {
            data.design = JSON.stringify(this.fabricCanvas.toJSON());
        } else {
            data.address = JSON.stringify(this.fabricCanvas.toJSON());
        }
        localStorage.setItem(key, JSON.stringify(data));
    }

    async loadFromLocal(key = 'nenga_design') {
        const raw = localStorage.getItem(key);
        if (!raw) return false;
        try {
            const data = JSON.parse(raw);
            if (data.design) {
                this.designState = data.design;
                await this.fabricCanvas.loadFromJSON(data.design);
                this.fabricCanvas.renderAll();
            }
            if (data.address) {
                this.addressState = data.address;
            }
            this.currentFace = 'design';
            this.saveHistory();
            return true;
        } catch (e) {
            console.error('Failed to load saved design:', e);
            return false;
        }
    }

    clear() {
        this.fabricCanvas.clear();
        this.fabricCanvas.backgroundColor = '#FFFFFF';
        this.fabricCanvas.renderAll();
        this.history = [];
        this.historyIndex = -1;
        this.saveHistory();
    }

    getCanvas() {
        return this.fabricCanvas;
    }
}
