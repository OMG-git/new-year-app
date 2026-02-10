// Stamp and zodiac data

export const ZODIAC_ANIMALS = [
    { id: 'ne', name: '子（ねずみ）', emoji: '🐭', year: 2020 },
    { id: 'ushi', name: '丑（うし）', emoji: '🐮', year: 2021 },
    { id: 'tora', name: '寅（とら）', emoji: '🐯', year: 2022 },
    { id: 'u', name: '卯（うさぎ）', emoji: '🐰', year: 2023 },
    { id: 'tatsu', name: '辰（たつ）', emoji: '🐲', year: 2024 },
    { id: 'mi', name: '巳（へび）', emoji: '🐍', year: 2025 },
    { id: 'uma', name: '午（うま）', emoji: '🐴', year: 2026 },
    { id: 'hitsuji', name: '未（ひつじ）', emoji: '🐑', year: 2027 },
    { id: 'saru', name: '申（さる）', emoji: '🐵', year: 2028 },
    { id: 'tori', name: '酉（とり）', emoji: '🐔', year: 2029 },
    { id: 'inu', name: '戌（いぬ）', emoji: '🐶', year: 2030 },
    { id: 'i', name: '亥（いのしし）', emoji: '🐗', year: 2031 },
];

// Determine current year zodiac
export function getCurrentZodiac() {
    const year = new Date().getFullYear();
    return ZODIAC_ANIMALS.find(z => (year - z.year) % 12 === 0) || ZODIAC_ANIMALS[6];
}

// Decorative stamps grouped by category
export const STAMPS = {
    zodiac: [], // populated dynamically from selected zodiac
    newyear: [
        { emoji: '🎍', name: '門松' },
        { emoji: '🎋', name: '七夕飾り' },
        { emoji: '🧧', name: 'ぽち袋' },
        { emoji: '🏮', name: '提灯' },
        { emoji: '⛩️', name: '鳥居' },
        { emoji: '🔔', name: '鈴' },
        { emoji: '🪭', name: '扇子' },
        { emoji: '🎌', name: '日の丸' },
        { emoji: '🎐', name: '風鈴' },
    ],
    nature: [
        { emoji: '🌸', name: '桜' },
        { emoji: '🌺', name: 'ハイビスカス' },
        { emoji: '🌹', name: 'バラ' },
        { emoji: '🌻', name: 'ひまわり' },
        { emoji: '🍀', name: '四葉' },
        { emoji: '🎄', name: 'クリスマスツリー' },
        { emoji: '🌅', name: '日の出' },
        { emoji: '🗻', name: '富士山' },
        { emoji: '🌙', name: '三日月' },
    ],
    lucky: [
        { emoji: '💰', name: '金袋' },
        { emoji: '🎊', name: 'くす玉' },
        { emoji: '🎉', name: 'パーティ' },
        { emoji: '✨', name: 'キラキラ' },
        { emoji: '⭐', name: '星' },
        { emoji: '🌟', name: '輝く星' },
        { emoji: '🎀', name: 'リボン' },
        { emoji: '💫', name: '流れ星' },
        { emoji: '🎶', name: '音符' },
    ],
};

// Get all stamps including current zodiac
export function getAllStamps(zodiac) {
    const zodiacStamps = [
        { emoji: zodiac.emoji, name: zodiac.name },
        { emoji: zodiac.emoji, name: `${zodiac.name}2` },
    ];
    return [...zodiacStamps, ...STAMPS.newyear, ...STAMPS.nature, ...STAMPS.lucky];
}
