import { useState, useEffect } from "react";
import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/600.css";
import "@fontsource/cinzel-decorative/400.css";
import "@fontsource/cinzel-decorative/700.css";
import "@fontsource/kalam/300.css";
import "@fontsource/kalam/400.css";
import "@fontsource/kalam/700.css";
import "@fontsource/eb-garamond/400.css";
import "@fontsource/eb-garamond/400-italic.css";
import "@fontsource/eb-garamond/600.css";
import "@fontsource/eb-garamond/600-italic.css";
import "@fontsource/crimson-text/400.css";
import "@fontsource/crimson-text/400-italic.css";
import "@fontsource/crimson-text/600.css";
import "@fontsource/crimson-text/600-italic.css";

import {
  C, DEFAULT_CATEGORIES, defaultTabTheme,
  INIT_IDEAS, INIT_JOURNAL, INIT_EPISODES,
} from "./constants.js";

import {
  loadState, saveState, loadThemeSettings, saveThemeSettings, checkStorageSize,
} from "./utils.js";

import { Nav } from "./molecules/Nav.jsx";
import { TabBackground } from "./templates/TabBackground.jsx";
import { SkyrimPage } from "./pages/SkyrimPage.jsx";
import { IdeasPage } from "./pages/IdeasPage.jsx";
import { JournalPage } from "./pages/JournalPage.jsx";
import { YouTubePage } from "./pages/YouTubePage.jsx";
import { GalleryPage } from "./pages/GalleryPage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";

// ── Global styles ──────────────────────────────────────────────────────────
const styleEl = document.createElement("style");
styleEl.textContent = `
  @keyframes fogDrift1 { 0%{transform:translateX(-8%) scaleY(1);opacity:0.18} 50%{transform:translateX(4%) scaleY(1.08);opacity:0.28} 100%{transform:translateX(-8%) scaleY(1);opacity:0.18} }
  @keyframes fogDrift2 { 0%{transform:translateX(6%) scaleY(1);opacity:0.13} 50%{transform:translateX(-5%) scaleY(1.1);opacity:0.22} 100%{transform:translateX(6%) scaleY(1);opacity:0.13} }
  @keyframes fogDrift3 { 0%{transform:translateX(-3%) scaleY(1);opacity:0.10} 60%{transform:translateX(7%) scaleY(1.06);opacity:0.20} 100%{transform:translateX(-3%) scaleY(1);opacity:0.10} }
  @keyframes starTwinkle { 0%,100%{opacity:0.6} 50%{opacity:1} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes runeGlow { 0%,100%{text-shadow:0 0 6px rgba(212,168,67,0.3)} 50%{text-shadow:0 0 18px rgba(212,168,67,0.8)} }
  @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideshow { 0%{opacity:1} 45%{opacity:1} 50%{opacity:0} 95%{opacity:0} 100%{opacity:1} }
  @keyframes tabEnter { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes calEnter { from{opacity:0;transform:scale(0.98)} to{opacity:1;transform:scale(1)} }
  @keyframes popIn { from{opacity:0;transform:scale(0.95) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
  .tab-enter { animation: tabEnter 0.32s cubic-bezier(0.22,1,0.36,1) both; }
  .cal-enter  { animation: calEnter 0.25s cubic-bezier(0.22,1,0.36,1) both; }
  .pop-in     { animation: popIn 0.22s cubic-bezier(0.22,1,0.36,1) both; }
  @keyframes dropDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  .dropdown-enter { animation: dropDown 0.18s cubic-bezier(0.22,1,0.36,1) both; }
  .rune-glow { animation: runeGlow 3s ease-in-out infinite; }
  textarea:focus, input:focus, select:focus { outline:none; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:#000; }
  ::-webkit-scrollbar-thumb { background:#2a1f0f; border-radius:3px; }
  .ep-font { font-family: 'Crimson Text', Georgia, serif !important; }
`;
document.head.appendChild(styleEl);


// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function HaroldGrayblood() {
  const [tab, setTab]               = useState("youtube");
  const [animKey, setAnimKey]       = useState(0);
  const [ideas, setIdeas]           = useState(() => loadState("hg_ideas", INIT_IDEAS));
  const [journal, setJournal]       = useState(() => loadState("hg_journal", INIT_JOURNAL));
  const [episodes, setEpisodes]     = useState(() => loadState("hg_episodes", INIT_EPISODES));
  const [categories, setCategories] = useState(() => loadState("hg_categories", DEFAULT_CATEGORIES));
  const [gallery, setGallery]       = useState(() => loadState("hg_gallery", []));
  const [galleryCategories, setGalleryCategories] = useState(() => loadState("hg_gallery_categories", ["Screenshots","Characters","Landscapes","Concept Art"]));
  const [themeSettings, setThemeSettings] = useState(() => loadThemeSettings());
  const [mounted, setMounted]       = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const [appVersion, setAppVersion]   = useState("");

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
    checkStorageSize();
    if (window.hgStorage?.getVersion) {
      window.hgStorage.getVersion().then(v => setAppVersion(v || ""));
    }
    if (window.hgStorage?.onUpdateReady) {
      window.hgStorage.onUpdateReady(() => setUpdateReady(true));
    }
  }, []);

  useEffect(() => saveState("hg_ideas", ideas), [ideas]);
  useEffect(() => saveState("hg_journal", journal), [journal]);
  useEffect(() => saveState("hg_episodes", episodes), [episodes]);
  useEffect(() => saveState("hg_categories", categories), [categories]);
  useEffect(() => saveState("hg_gallery", gallery), [gallery]);
  useEffect(() => saveState("hg_gallery_categories", galleryCategories), [galleryCategories]);
  useEffect(() => saveThemeSettings(themeSettings), [themeSettings]);

  const switchTab = (t) => { setTab(t); setAnimKey(k=>k+1); };
  const ts = themeSettings[tab] || themeSettings["youtube"] || defaultTabTheme();
  const updateTheme = (tabKey, key, val) => setThemeSettings(p => ({ ...p, [tabKey]: { ...p[tabKey], [key]: val } }));

  return (
    <div style={{ background:C.black, minHeight:"100vh", color:C.cream, fontFamily:"'Cinzel',serif", display:"flex", flexDirection:"column", position:"relative" }}>
      <TabBackground ts={ts} />
      <Nav tab={tab} setTab={switchTab} ts={ts} />
      <div key={animKey} className="tab-enter" style={{ flex:1, display:"flex", flexDirection:"column", position:"relative", zIndex:1 }}>
        {tab==="skyrim"   && <SkyrimPage mounted={mounted} ts={ts} setTab={switchTab} />}
        {tab==="ideas"    && <IdeasPage ideas={ideas} setIdeas={setIdeas} categories={categories} setCategories={setCategories} ts={ts} />}
        {tab==="journal"  && <JournalPage journal={journal} setJournal={setJournal} ts={ts} />}
        {tab==="youtube"  && <YouTubePage episodes={episodes} setEpisodes={setEpisodes} ts={ts} />}
        {tab==="gallery"  && <GalleryPage gallery={gallery} setGallery={setGallery} ts={ts} galleryCategories={galleryCategories} setGalleryCategories={setGalleryCategories} />}
        {tab==="settings" && <SettingsPage themeSettings={themeSettings} updateTheme={updateTheme} ts={ts} updateReady={updateReady} appVersion={appVersion} gallery={gallery} />}
      </div>
    </div>
  );
}








// (SettingsPage extracted to src/pages/SettingsPage.jsx)
