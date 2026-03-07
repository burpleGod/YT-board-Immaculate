import { C, defaultSettings } from "./constants.js";

// ── Module-level state for storage debouncing ──
let _storageSizeTimer = null;
let _softWarnShown = false;

// ── Color conversion (handles hex, rgb(), rgba()) ──
export function hexToRgb(hex) {
  if (!hex) return "0,0,0";
  // Handle rgb(r,g,b) format
  const rgbMatch = hex.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (rgbMatch) return `${rgbMatch[1]},${rgbMatch[2]},${rgbMatch[3]}`;
  // Handle rgba(r,g,b,a) format
  const rgbaMatch = hex.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*[\d.]+\s*\)$/);
  if (rgbaMatch) return `${rgbaMatch[1]},${rgbaMatch[2]},${rgbaMatch[3]}`;
  // Handle #rrggbb hex format
  if (hex.startsWith("#") && hex.length >= 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return `${r},${g},${b}`;
  }
  // Unrecognized format
  return "0,0,0";
}

// ── Persistence utilities ──
export function loadState(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

// Load themeSettings by merging lightweight meta + heavy images from separate keys
export function loadThemeSettings() {
  const meta   = loadState("hg_theme_meta",   defaultSettings());
  const images = loadState("hg_theme_images", {});
  // Re-merge bgImages back into each tab's theme
  const merged = { ...meta };
  for (const tabKey of Object.keys(merged)) {
    merged[tabKey] = { ...merged[tabKey], bgImages: images[tabKey] || [] };
  }
  return merged;
}

// Save themeSettings split across two keys: meta (small) + images (large)
export function saveThemeSettings(themeSettings) {
  const meta   = {};
  const images = {};
  for (const [tabKey, tabTheme] of Object.entries(themeSettings)) {
    const { bgImages, ...rest } = tabTheme;
    meta[tabKey]   = rest;
    images[tabKey] = bgImages || [];
  }
  saveState("hg_theme_meta",   meta);
  saveState("hg_theme_images", images);
}

export function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Debounce the size check — runs at most once per 2s regardless of write frequency
    clearTimeout(_storageSizeTimer);
    _storageSizeTimer = setTimeout(() => checkStorageSize(), 2000);
  } catch (e) {
    if (e instanceof DOMException && (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED")) {
      alert("[Harold Grayblood] Storage is full — your last change could not be saved.\n\nTo free space, go to Settings → Reset All Data, or remove gallery images and background photos.");
    } else {
      console.warn(`[HG] Failed to save "${key}":`, e);
    }
  }
}

export function checkStorageSize() {
  let total = 0;
  for (const key in localStorage) {
    if (key.startsWith("hg_")) {
      total += (localStorage.getItem(key) || "").length;
    }
  }
  const mb = (total / 1024 / 1024).toFixed(2);
  if (total > 3 * 1024 * 1024 && !_softWarnShown) {
    _softWarnShown = true;
    alert(`[Harold Grayblood] Storage is getting full (${mb}MB used).\n\nConsider removing gallery images or background photos to avoid losing data. You can reset all data in The Forge → Danger Zone.`);
  }
  if (total <= 3 * 1024 * 1024) {
    _softWarnShown = false; // reset if usage drops (e.g. after image removal)
  }
  return mb;
}

// ── Format helpers ──
export function defaultFormat() { return {font:"kalam",size:18,align:"left",bold:false,italic:false}; }
export function fontFamilyMap(f) { return {kalam:"'Kalam',cursive",cinzel:"'Cinzel',serif",serif:"Georgia,serif",monospace:"'Courier New',monospace"}[f]||"'Kalam',cursive"; }

// ── Style factory functions ──
export function themedInput(ts) {
  return { background:"rgba(0,0,0,0.4)", border:`1px solid ${C.ashDim}`, color:ts?.fontColor||C.cream, fontFamily:"'Cinzel',serif", fontSize:13, padding:"7px 11px", width:"100%", backdropFilter:"blur(4px)" };
}

export function iconBtnStyle(color) {
  return { background:"none", border:`1px solid ${color}`, color, cursor:"pointer", fontSize:10, padding:"4px 10px", fontFamily:"'Cinzel',serif", letterSpacing:2 };
}

export function accentBtnStyle(color) {
  return { background:`rgba(${hexToRgb(color)},0.12)`, border:`1px solid ${color}`, color, padding:"7px 18px", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:2, textDecoration:"none", display:"inline-block" };
}

export function linkBtnStyle(border, bg, color) {
  return { background:bg||"transparent", border:`1px solid ${border}`, color:color||border, padding:"8px 18px", textDecoration:"none", fontFamily:"'Crimson Text',Georgia,serif", fontSize:12, letterSpacing:1, display:"inline-block", transition:"all 0.2s" };
}

// ── Style object constants ──
export const ghostBtnStyle = { background:"rgba(255,255,255,0.04)", border:`1px solid ${C.ashDim}`, color:C.ash, cursor:"pointer", padding:"6px 14px", fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:2, transition:"all 0.2s" };
export const kalamInput = { background:"rgba(0,0,0,0.35)", border:`1px solid rgba(139,101,32,0.4)`, color:C.ink, fontFamily:"'Kalam',cursive", fontSize:16, padding:"8px 12px", width:"100%" };
export const ytInput = { background:"rgba(0,0,0,0.5)", border:`1px solid ${C.ashDim}`, color:C.cream, fontFamily:"'Crimson Text',Georgia,serif", fontSize:14, padding:"7px 11px", width:"100%" };
export const toolInput = { background:"rgba(255,255,255,0.05)", border:`1px solid ${C.ashDim}`, color:C.cream, fontFamily:"'Cinzel',serif", fontSize:11, padding:"4px 8px", cursor:"pointer" };
