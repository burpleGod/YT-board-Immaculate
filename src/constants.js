// ── Color system ──
export const C = {
  black:"#000000", ember:"#ff6b1a", gold:"#d4a843", goldDim:"#8a6520",
  cream:"#e8d5a3", frost:"#8ab4d4", ash:"#666", ashDim:"#2a2a2a",
  ink:"#160c03", inkMid:"#2d1a08", red:"#c0392b", green:"#28a050",
};

// ── App constants ──
export const RUNES = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ".split("");
export const YT_CHANNEL = "https://www.youtube.com/@AntlamTE";
export const TABS = ["youtube","skyrim","gallery","settings"];
export const TAB_LABELS = { skyrim:"⚔ Skyrim", youtube:"▶ YouTube", gallery:"🖼 Gallery", settings:"⚙ The Forge", ideas:"📜 Ideas", journal:"✒ Journal" };
export const SKYRIM_SUBTABS = [
  { id:"ideas",   icon:"📜", label:"Ideas Board" },
  { id:"journal", icon:"✒", label:"Journal"      },
];

export const PARCHMENT = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='600' height='600' fill='%23c4a05a'/%3E%3Crect width='600' height='600' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E`;

export const DEFAULT_CATEGORIES = ["Character Concept","Roleplay Rule","Quest Idea","Build Note","Lore Note","Mod Idea"];
export const EPISODE_STATUSES = ["planned","scripted","recorded","edited","uploaded"];
export const STATUS_COLORS = {
  planned:  {bg:"rgba(100,100,100,0.15)",border:"#444",text:"#888"},
  scripted: {bg:"rgba(138,101,32,0.15)", border:C.goldDim,text:C.goldDim},
  recorded: {bg:"rgba(90,120,180,0.15)", border:"#5a78b4",text:"#8ab4d4"},
  edited:   {bg:"rgba(180,120,30,0.15)", border:"#b4782a",text:"#d4a843"},
  uploaded: {bg:"rgba(40,160,80,0.15)",  border:"#28a050",text:"#4cd080"},
};
export const FONT_OPTIONS = [{value:"kalam",label:"Kalam (Handwritten)"},{value:"cinzel",label:"Cinzel (Formal)"},{value:"serif",label:"Georgia (Classic)"},{value:"monospace",label:"Mono (Runic)"}];
export const SIZE_OPTIONS = [14,16,18,20,22,24,28];

// ── Default factories ──
// Default per-tab theme settings
export const defaultTabTheme = () => ({
  bgImages: [],         // array of base64 strings
  bgMode: "static",     // "static" | "slideshow" | "none"
  bgOverlay: 0.5,       // 0-1
  accentColor: C.gold,
  boxBg: "rgba(0,0,0,0.75)",
  fontColor: C.cream,
  slideshowInterval: 5, // seconds
});

export const defaultSettings = () => ({
  skyrim:   { ...defaultTabTheme(), accentColor: C.gold },
  ideas:    { ...defaultTabTheme() },
  journal:  { ...defaultTabTheme() },
  youtube:  { ...defaultTabTheme(), accentColor:"#ff4444" },
  gallery:  { ...defaultTabTheme() },
  settings: { ...defaultTabTheme() },
});

// ── Init data ──
// Generic empty defaults — new users start with a blank app.
// Harold's personal seed data lives in src/harold-seed.js (not imported by the app).
export const INIT_IDEAS    = [];
export const INIT_JOURNAL  = [];
export const INIT_EPISODES = [];

// ── Calendar colors ──
export const CAL_BG      = "#e8dcc8";
export const CAL_BORDER  = "#c4aa80";
export const CAL_TEXT    = "#5a4a30";
export const CAL_SUBTEXT = "#8a7a60";
export const CAL_EMPTY   = "#ddd3bc";
export const CAL_HDR_BG  = "#8b1a1a";
export const CAL_HDR_TXT = "#f5e8d8";
