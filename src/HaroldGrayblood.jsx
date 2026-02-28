import { useState, useEffect, useRef } from "react";
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

// ── Constants ──────────────────────────────────────────────────────────────
const RUNES = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ".split("");
const YT_CHANNEL = "https://www.youtube.com/@AntlamTE";
const TABS = ["youtube","skyrim","gallery","settings"];
const TAB_LABELS = { skyrim:"⚔ Skyrim", youtube:"▶ YouTube", gallery:"🖼 Gallery", settings:"⚙ The Forge" };
const SKYRIM_SUBTABS = [
  { id:"ideas",   icon:"📜", label:"Ideas Board" },
  { id:"journal", icon:"✒", label:"Journal"      },
];

const C = {
  black:"#000000", ember:"#ff6b1a", gold:"#d4a843", goldDim:"#8a6520",
  cream:"#e8d5a3", frost:"#8ab4d4", ash:"#666", ashDim:"#2a2a2a",
  ink:"#160c03", inkMid:"#2d1a08", red:"#c0392b", green:"#28a050",
};

const PARCHMENT = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='600' height='600' fill='%23c4a05a'/%3E%3Crect width='600' height='600' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E`;

const DEFAULT_CATEGORIES = ["Character Concept","Roleplay Rule","Quest Idea","Build Note","Lore Note","Mod Idea"];
const EPISODE_STATUSES = ["planned","scripted","recorded","edited","uploaded"];
const STATUS_COLORS = {
  planned:  {bg:"rgba(100,100,100,0.15)",border:"#444",text:"#888"},
  scripted: {bg:"rgba(138,101,32,0.15)", border:C.goldDim,text:C.goldDim},
  recorded: {bg:"rgba(90,120,180,0.15)", border:"#5a78b4",text:"#8ab4d4"},
  edited:   {bg:"rgba(180,120,30,0.15)", border:"#b4782a",text:"#d4a843"},
  uploaded: {bg:"rgba(40,160,80,0.15)",  border:"#28a050",text:"#4cd080"},
};
const FONT_OPTIONS = [{value:"kalam",label:"Kalam (Handwritten)"},{value:"cinzel",label:"Cinzel (Formal)"},{value:"serif",label:"Georgia (Classic)"},{value:"monospace",label:"Mono (Runic)"}];
const SIZE_OPTIONS = [14,16,18,20,22,24,28];

// Default per-tab theme settings
const defaultTabTheme = () => ({
  bgImages: [],         // array of base64 strings
  bgMode: "static",     // "static" | "slideshow" | "none"
  bgOverlay: 0.5,       // 0-1
  accentColor: C.gold,
  boxBg: "rgba(0,0,0,0.75)",
  fontColor: C.cream,
  slideshowInterval: 5, // seconds
});

const defaultSettings = () => ({
  skyrim:   { ...defaultTabTheme(), accentColor: C.gold },
  ideas:    { ...defaultTabTheme() },
  journal:  { ...defaultTabTheme() },
  youtube:  { ...defaultTabTheme(), accentColor:"#ff4444" },
  gallery:  { ...defaultTabTheme() },
  settings: { ...defaultTabTheme() },
});

// ── Persistence utilities ──────────────────────────────────────────────────
function loadState(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

// Load themeSettings by merging lightweight meta + heavy images from separate keys
function loadThemeSettings() {
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
function saveThemeSettings(themeSettings) {
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

let _storageSizeTimer = null;
let _softWarnShown = false;

function saveState(key, value) {
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

function checkStorageSize() {
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

// ── Init data ──────────────────────────────────────────────────────────────
const INIT_IDEAS = [
  {id:1,category:"Character Concept",title:"The Oathbreaker's Redemption",content:"Harold once swore to protect a village, only to flee when the draugr came. Now he walks back toward danger — every time.",tags:["redemption","oath","guilt"]},
  {id:2,category:"Roleplay Rule",title:"No Fast Travel",content:"Every step of Skyrim must be walked. The road is the story.",tags:["immersion","travel"]},
  {id:3,category:"Quest Idea",title:"The Grey Blood Pact",content:"Find the origin of the Grayblood name. A blood oath made three generations ago with a Daedric Prince.",tags:["daedra","lore","family"]},
];
const INIT_JOURNAL = [
  {id:1,date:"17th of Last Seed, 4E 201",title:"Helgen",format:{font:"kalam",size:18,align:"left",bold:false,italic:false},body:"They nearly took my head today. A dragon — gods, a real dragon — saved me without meaning to.\n\nThe Imperials had me on the block. I thought of nothing. Not family, not the debts, not the blood I owe. Just the cold stone and the headsman's shadow.\n\nThen the sky broke open.\n\nI ran with a Stormcloak. Ralof. He seems decent enough for a rebel. We parted ways at the keep's edge. I told him nothing about myself. That felt right."},
];
const INIT_EPISODES = [
  {id:1,title:"Harold Grayblood — Origins",episode:1,status:"uploaded",description:"The beginning of Harold's journey. Helgen, the dragon attack, and the road to Riverwood.",thumbnail:null,thumbnailName:"",tags:["intro","helgen"],notes:"Strong opener. Hook was the execution scene.",scheduledDate:""},
  {id:2,title:"The Road to Whiterun",episode:2,status:"recorded",description:"Harold walks every step. No fast travel. The plains of Whiterun hold more than they seem.",thumbnail:null,thumbnailName:"",tags:["travel","whiterun"],notes:"B-roll of sunrise worked great.",scheduledDate:"2025-02-28"},
  {id:3,title:"Joining the Companions",episode:3,status:"planned",description:"Does a man of grey honour belong among warriors?",thumbnail:null,thumbnailName:"",tags:["companions","honour"],notes:"",scheduledDate:"2025-03-07"},
];

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

// ══════════════════════════════════════════════════════════════════════════════
// TAB BACKGROUND
// ══════════════════════════════════════════════════════════════════════════════
function TabBackground({ ts }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const imgs = ts.bgImages || [];

  useEffect(() => {
    if (ts.bgMode !== "slideshow" || imgs.length < 2) return;
    const iv = setInterval(() => {
      setFade(false);
      setTimeout(() => { setSlideIdx(i => (i+1) % imgs.length); setFade(true); }, 600);
    }, (ts.slideshowInterval || 5) * 1000);
    return () => clearInterval(iv);
  }, [ts.bgMode, imgs.length, ts.slideshowInterval]);

  if (!imgs.length || ts.bgMode === "none") return null;

  const src = imgs[ts.bgMode === "slideshow" ? slideIdx % imgs.length : 0];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:`url(${src})`,
        backgroundSize:"cover", backgroundPosition:"center",
        opacity: fade ? 1 : 0,
        transition:"opacity 0.6s ease",
      }} />
      <div style={{ position:"absolute", inset:0, background:`rgba(0,0,0,${ts.bgOverlay ?? 0.5})` }} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NAV
// ══════════════════════════════════════════════════════════════════════════════
function Nav({ tab, setTab, ts }) {
  const accent = ts.accentColor || C.gold;
  const [skyrimHover, setSkyrimHover] = useState(false);
  const hoverTimer = useRef(null);

  const showDropdown  = () => { clearTimeout(hoverTimer.current); setSkyrimHover(true); };
  const hideDropdown  = () => { hoverTimer.current = setTimeout(() => setSkyrimHover(false), 300); };

  return (
    <nav style={{ display:"flex", justifyContent:"center", padding:"16px 0 0", gap:0, position:"relative", zIndex:50, flexWrap:"wrap" }}>

      {/* ── Skyrim tab with dropdown ── */}
      <div
        style={{position:"relative", paddingBottom: skyrimHover ? 4 : 0}}
        onMouseEnter={showDropdown}
        onMouseLeave={hideDropdown}
      >
        <button
          onClick={() => setTab("skyrim")}
          style={{
            background: tab==="skyrim" ? `rgba(${hexToRgb(accent)},0.12)` : "rgba(0,0,0,0.5)",
            border:`1px solid ${tab==="skyrim" ? accent : C.ashDim}`,
            borderRight:"none",
            color: tab==="skyrim" ? accent : C.ash,
            padding:"8px 24px", cursor:"pointer",
            fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:2,
            textTransform:"uppercase", transition:"all 0.2s",
            backdropFilter:"blur(4px)",
            display:"flex", alignItems:"center", gap:6,
          }}
        >
          ⚔ Skyrim
          <span style={{fontSize:8, opacity:0.6, marginLeft:2}}>▾</span>
        </button>

        {/* Dropdown */}
        {skyrimHover && (
          <div
            className="dropdown-enter"
            onMouseEnter={showDropdown}
            onMouseLeave={hideDropdown}
            style={{
              position:"absolute", top:"100%", marginTop:-4, left:0, zIndex:100,
              minWidth:180,
              background:"rgba(8,5,2,0.97)",
              border:`1px solid ${accent}`,
              borderTop:`2px solid ${accent}`,
              boxShadow:`0 12px 40px rgba(0,0,0,0.7), 0 0 20px rgba(${hexToRgb(accent)},0.1)`,
              backdropFilter:"blur(12px)",
              overflow:"hidden",
            }}
          >
            <div style={{padding:"8px 14px 6px",fontSize:9,color:C.goldDim,letterSpacing:3,fontFamily:"'Cinzel',serif",borderBottom:`1px solid ${C.ashDim}`}}>THE ROAD</div>
            {SKYRIM_SUBTABS.map(sub => (
              <button
                key={sub.id}
                onClick={() => { setTab(sub.id); setSkyrimHover(false); }}
                style={{
                  display:"flex", alignItems:"center", gap:10,
                  width:"100%", background:"none", border:"none",
                  padding:"11px 16px", cursor:"pointer", textAlign:"left",
                  fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:2,
                  color: tab===sub.id ? accent : C.cream,
                  borderLeft: tab===sub.id ? `2px solid ${accent}` : "2px solid transparent",
                  transition:"all 0.15s",
                }}
                onMouseEnter={e=>{e.currentTarget.style.background=`rgba(${hexToRgb(accent)},0.08)`;e.currentTarget.style.color=accent;}}
                onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=tab===sub.id?accent:C.cream;}}
              >
                <span style={{fontSize:14}}>{sub.icon}</span>
                {sub.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Remaining tabs ── */}
      {TABS.filter(t=>t!=="skyrim").map((t,i,arr) => (
        <button key={t} onClick={() => setTab(t)} style={{
          background: tab===t ? `rgba(${hexToRgb(accent)},0.12)` : "rgba(0,0,0,0.5)",
          border:`1px solid ${tab===t ? accent : C.ashDim}`,
          borderRight: i<arr.length-1 ? "none" : `1px solid ${tab===t ? accent : C.ashDim}`,
          color: tab===t ? accent : C.ash,
          padding:"8px 24px", cursor:"pointer",
          fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:2,
          textTransform:"uppercase", transition:"all 0.2s",
          backdropFilter:"blur(4px)",
        }}>{TAB_LABELS[t]}</button>
      ))}
    </nav>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SKYRIM PAGE (was Home)
// ══════════════════════════════════════════════════════════════════════════════
function SkyrimPage({ mounted, ts, setTab }) {
  const hasCustomBg = ts.bgImages?.length > 0 && ts.bgMode !== "none";
  const accent = ts.accentColor || C.gold;
  return (
    <div style={{ flex:1, position:"relative", overflow:"hidden", minHeight:"calc(100vh - 56px)" }}>
      {/* Mountains only if no custom bg */}
      {!hasCustomBg && <>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,#000 0%,#050810 25%,#0a1020 50%,#0d0a06 75%,#000 100%)" }} />
        {Array.from({length:70}).map((_,i) => (
          <div key={i} style={{ position:"absolute", left:`${(i*37+i*i*13)%100}%`, top:`${(i*29+i*7)%55}%`, width:i%5===0?2:1, height:i%5===0?2:1, borderRadius:"50%", background:i%7===0?C.frost:"#fff", animation:`starTwinkle ${2+(i%4)}s ease-in-out ${(i*0.3)%3}s infinite`, opacity:0.4+(i%3)*0.15 }} />
        ))}
        <svg viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice" style={{ position:"absolute", bottom:0, left:0, width:"100%", height:"75%" }}>
          <path d="M0,520 L0,280 L80,200 L160,240 L260,140 L360,210 L440,160 L520,220 L600,120 L680,190 L760,100 L840,180 L920,130 L1000,200 L1100,110 L1200,190 L1300,150 L1380,220 L1440,180 L1440,520 Z" fill="#060408"/>
          <path d="M0,520 L0,360 L100,270 L200,310 L320,200 L420,270 L500,220 L600,290 L700,180 L800,260 L900,200 L1000,280 L1100,210 L1200,290 L1300,230 L1380,300 L1440,260 L1440,520 Z" fill="#0a080c"/>
          <path d="M600,120 L620,140 L640,125 L660,145 L680,120 Z" fill="rgba(180,200,220,0.12)"/>
          <path d="M760,100 L780,125 L800,108 L820,130 L840,110 Z" fill="rgba(180,200,220,0.10)"/>
          <path d="M0,520 L0,420 L120,300 L240,370 L360,280 L460,350 L560,260 L660,340 L760,240 L860,330 L960,270 L1060,360 L1160,290 L1280,380 L1380,310 L1440,370 L1440,520 Z" fill="#07050a"/>
          <path d="M560,260 L580,285 L600,265 L620,288 L640,268 Z" fill="rgba(200,220,240,0.15)"/>
          <path d="M760,240 L782,268 L804,248 L826,272 L848,252 Z" fill="rgba(200,220,240,0.18)"/>
        </svg>
        <div style={{position:"absolute",bottom:0,left:"-10%",width:"120%",height:"38%",background:"radial-gradient(ellipse 80% 100% at 50% 100%,rgba(180,170,160,0.22) 0%,rgba(140,130,120,0.08) 60%,transparent 100%)",animation:"fogDrift1 22s ease-in-out infinite",filter:"blur(18px)",transformOrigin:"bottom center"}}/>
        <div style={{position:"absolute",bottom:"10%",left:"-15%",width:"130%",height:"30%",background:"radial-gradient(ellipse 90% 100% at 40% 100%,rgba(160,155,150,0.16) 0%,rgba(120,115,110,0.06) 55%,transparent 100%)",animation:"fogDrift2 30s ease-in-out infinite",filter:"blur(28px)",transformOrigin:"bottom center"}}/>
        <div style={{position:"absolute",bottom:"20%",left:"-5%",width:"110%",height:"25%",background:"radial-gradient(ellipse 70% 100% at 60% 100%,rgba(140,135,130,0.10) 0%,transparent 70%)",animation:"fogDrift3 38s ease-in-out infinite",filter:"blur(35px)",transformOrigin:"bottom center"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"18%",background:"linear-gradient(0deg,rgba(150,145,140,0.18) 0%,transparent 100%)",filter:"blur(8px)"}}/>
      </>}

      {/* Central content */}
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", paddingBottom:"8%" }}>
        <div style={{fontSize:12,letterSpacing:10,color:accent||C.goldDim,marginBottom:28,opacity:mounted?1:0,animation:mounted?"fadeUp 1s ease both":"none",userSelect:"none"}} className="rune-glow">{RUNES.slice(0,10).join(" ")}</div>

        <div style={{width:"min(500px,85%)",height:1,background:`linear-gradient(90deg,transparent,${accent||C.ember},transparent)`,marginBottom:28,opacity:mounted?1:0,animation:mounted?"fadeUp 1s ease 0.2s both":"none"}}/>

        <h1 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:"clamp(26px,5.5vw,68px)",margin:"0 0 8px",background:`linear-gradient(180deg,#fff 0%,${accent||C.gold} 45%,${C.ember} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:6,textAlign:"center",opacity:mounted?1:0,animation:mounted?"fadeUp 1s ease 0.4s both":"none"}}>HAROLD GRAYBLOOD</h1>

        <p style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(10px,1.8vw,15px)",letterSpacing:6,color:ts.fontColor||C.frost,margin:"0 0 28px",textTransform:"uppercase",opacity:mounted?1:0,animation:mounted?"fadeUp 1s ease 0.6s both":"none"}}>Gate to Sovngarde Edition</p>

        <div style={{width:"min(500px,85%)",height:1,background:`linear-gradient(90deg,transparent,${accent||C.ember},transparent)`,marginBottom:36,opacity:mounted?1:0,animation:mounted?"fadeUp 1s ease 0.7s both":"none"}}/>

        {/* Quick nav cards */}
        <div style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center",opacity:mounted?1:0,animation:mounted?"fadeUp 1s ease 0.9s both":"none"}}>
          {SKYRIM_SUBTABS.map(sub=>(
            <button
              key={sub.id}
              onClick={()=>setTab(sub.id)}
              style={{
                background:"rgba(0,0,0,0.55)",
                border:`1px solid ${C.goldDim}`,
                borderTop:`2px solid ${accent||C.gold}`,
                color:C.cream,
                padding:"18px 32px",
                cursor:"pointer",
                fontFamily:"'Cinzel',serif",
                fontSize:12,
                letterSpacing:3,
                textTransform:"uppercase",
                backdropFilter:"blur(8px)",
                transition:"all 0.22s",
                display:"flex", flexDirection:"column", alignItems:"center", gap:8,
                minWidth:140,
              }}
              onMouseEnter={e=>{
                e.currentTarget.style.background=`rgba(${hexToRgb(accent||C.gold)},0.12)`;
                e.currentTarget.style.borderColor=accent||C.gold;
                e.currentTarget.style.color=accent||C.gold;
                e.currentTarget.style.transform="translateY(-3px)";
                e.currentTarget.style.boxShadow=`0 8px 30px rgba(${hexToRgb(accent||C.gold)},0.2)`;
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.background="rgba(0,0,0,0.55)";
                e.currentTarget.style.borderColor=C.goldDim;
                e.currentTarget.style.color=C.cream;
                e.currentTarget.style.transform="translateY(0)";
                e.currentTarget.style.boxShadow="none";
              }}
            >
              <span style={{fontSize:24}}>{sub.icon}</span>
              {sub.label}
            </button>
          ))}
        </div>

        <p style={{fontFamily:"'Cinzel',serif",fontSize:11,color:C.ash,letterSpacing:3,marginTop:32,maxWidth:420,lineHeight:2.2,textAlign:"center",opacity:mounted?1:0,animation:mounted?"fadeUp 1s ease 1.1s both":"none"}}>"Not all who walk toward Sovngarde seek death.<br/>Some seek the road itself."</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// IDEAS PAGE
// ══════════════════════════════════════════════════════════════════════════════
function IdeasPage({ ideas, setIdeas, categories, setCategories, ts }) {
  const [filterCat, setFilterCat] = useState("All");
  const [newIdea, setNewIdea]     = useState(null);
  const [expandId, setExpandId]   = useState(null);
  const [newCatName, setNewCatName] = useState("");
  const [showCatMgr, setShowCatMgr] = useState(false);
  const accent = ts.accentColor || C.gold;
  const filtered = filterCat==="All" ? ideas : ideas.filter(i=>i.category===filterCat);

  const addIdea = () => { if(!newIdea?.title?.trim()) return; setIdeas(p=>[...p,{...newIdea,id:Date.now(),tags:newIdea.tags||[]}]); setNewIdea(null); };
  const removeIdea = (id,e) => { e.stopPropagation(); setIdeas(p=>p.filter(i=>i.id!==id)); };
  const addCategory = () => { const n=newCatName.trim(); if(!n||categories.includes(n)) return; setCategories(p=>[...p,n]); setNewCatName(""); };
  const removeCategory = (cat) => { setCategories(p=>p.filter(c=>c!==cat)); setIdeas(p=>p.map(i=>i.category===cat?{...i,category:"Uncategorised"}:i)); if(filterCat===cat) setFilterCat("All"); };

  return (
    <PageShell ts={ts}>
      <PageHeader title="Idea Board" rune="📜" accent={accent} />
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20,alignItems:"center"}}>
        {["All",...categories].map(cat=>(
          <FilterBtn key={cat} active={filterCat===cat} onClick={()=>setFilterCat(cat)} accent={accent}>{cat}</FilterBtn>
        ))}
        <button onClick={()=>setShowCatMgr(p=>!p)} style={{...ghostBtnStyle,fontSize:10,padding:"5px 12px"}}>⚙ ORDER BY</button>
        <button onClick={()=>setNewIdea({title:"",category:categories[0]||"",content:"",tags:[]})} style={{marginLeft:"auto",...accentBtnStyle(C.ember)}}>+ MARK THE LEDGER</button>
      </div>
      {showCatMgr && (
        <Box ts={ts} style={{marginBottom:20}}>
          <FieldLabel accent={accent}>ORDER THE CODEX</FieldLabel>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
            {categories.map(cat=>(
              <div key={cat} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.03)",border:`1px solid ${C.ashDim}`,padding:"4px 10px"}}>
                <span style={{fontSize:12,color:ts.fontColor||C.cream}}>{cat}</span>
                <button onClick={()=>removeCategory(cat)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:14,padding:0}}>×</button>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={newCatName} onChange={e=>setNewCatName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCategory()} placeholder="Name a new order..." style={themedInput(ts)} />
            <ActionBtn onClick={addCategory} accent={accent}>Add</ActionBtn>
          </div>
        </Box>
      )}
      {newIdea && (
        <Box ts={ts} style={{marginBottom:20}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <input value={newIdea.title} onChange={e=>setNewIdea(n=>({...n,title:e.target.value}))} placeholder="Title..." style={themedInput(ts)} />
            <select value={newIdea.category} onChange={e=>setNewIdea(n=>({...n,category:e.target.value}))} style={{...themedInput(ts),cursor:"pointer"}}>
              {categories.map(c=><option key={c} value={c} style={{background:"#111"}}>{c}</option>)}
            </select>
          </div>
          <textarea value={newIdea.content} onChange={e=>setNewIdea(n=>({...n,content:e.target.value}))} placeholder="Describe the idea..." style={{...themedInput(ts),width:"100%",minHeight:80,resize:"vertical",boxSizing:"border-box",marginBottom:12}} />
          <input value={(newIdea.tags||[]).join(", ")} onChange={e=>setNewIdea(n=>({...n,tags:e.target.value.split(",").map(t=>t.trim()).filter(Boolean)}))} placeholder="Tags: comma separated..." style={{...themedInput(ts),width:"100%",boxSizing:"border-box",marginBottom:12}} />
          <div style={{display:"flex",gap:8}}><ActionBtn onClick={addIdea} accent={accent}>Save</ActionBtn><ActionBtn onClick={()=>setNewIdea(null)}>Cancel</ActionBtn></div>
        </Box>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {filtered.map(idea=>(
          <div key={idea.id} onClick={()=>setExpandId(expandId===idea.id?null:idea.id)} style={{background:expandId===idea.id?`rgba(${hexToRgb(accent)},0.06)`:ts.boxBg||"rgba(0,0,0,0.6)",border:`1px solid ${expandId===idea.id?accent:C.ashDim}`,borderTop:`2px solid ${expandId===idea.id?accent:C.goldDim}`,padding:16,cursor:"pointer",transition:"all 0.2s",backdropFilter:"blur(6px)"}}>
            <div style={{fontSize:9,letterSpacing:3,color:C.goldDim,textTransform:"uppercase",marginBottom:6}}>{idea.category}</div>
            <div style={{fontSize:15,color:accent,marginBottom:8,letterSpacing:1}}>{idea.title}</div>
            {expandId===idea.id && <div style={{fontSize:13,color:ts.fontColor||C.cream,lineHeight:1.8,marginBottom:10,opacity:0.9}}>{idea.content}</div>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{idea.tags.map(t=><span key={t} style={{fontSize:9,background:"rgba(138,101,32,0.2)",border:`1px solid ${C.ashDim}`,color:C.goldDim,padding:"1px 7px",letterSpacing:1}}>{t}</span>)}</div>
              <button onClick={e=>removeIdea(idea.id,e)} style={{background:"none",border:"none",color:C.ashDim,cursor:"pointer",fontSize:18}}>×</button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length===0 && <EmptyState text="The ledger sits empty. Every great chronicle begins with a single thought scratched into parchment." />}
    </PageShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// JOURNAL PAGE
// ══════════════════════════════════════════════════════════════════════════════
function JournalPage({ journal, setJournal, ts }) {
  const [newEntry, setNewEntry]   = useState(null);
  const [expandId, setExpandId]   = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [fullscreen, setFullscreen] = useState(null);
  const accent = ts.accentColor || C.gold;
  const fsEntry = journal.find(e=>e.id===fullscreen);

  const saveNew = () => { if(!newEntry?.title?.trim()) return; setJournal(p=>[{...newEntry,id:Date.now(),format:newEntry.format||defaultFormat()},...p]); setNewEntry(null); };
  const saveEdit = () => { setJournal(p=>p.map(e=>e.id===editEntry.id?editEntry:e)); setExpandId(editEntry.id); setEditEntry(null); };
  const removeEntry = (id,e) => { e.stopPropagation(); setJournal(p=>p.filter(e=>e.id!==id)); if(expandId===id) setExpandId(null); };

  if (fsEntry) return <FullscreenJournal entry={fsEntry} onClose={()=>setFullscreen(null)} accent={accent} />;

  return (
    <PageShell ts={ts}>
      <PageHeader title="The Journal of Harold Grayblood" rune="✒" accent={accent} />
      <div style={{marginBottom:20,display:"flex",justifyContent:"flex-end"}}>
        <button onClick={()=>setNewEntry({date:"",title:"",body:"",format:defaultFormat()})} style={accentBtnStyle(C.ember)}>+ NEW ENTRY</button>
      </div>
      {newEntry && <JournalEntryForm entry={newEntry} setEntry={setNewEntry} onSave={saveNew} onCancel={()=>setNewEntry(null)} label="New Entry" ts={ts} accent={accent} />}
      {editEntry && <JournalEntryForm entry={editEntry} setEntry={setEditEntry} onSave={saveEdit} onCancel={()=>setEditEntry(null)} label="Editing Entry" ts={ts} accent={accent} />}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {journal.map(entry=>{
          const isExp=expandId===entry.id, isEdit=editEntry?.id===entry.id;
          if(isEdit) return null;
          return (
            <div key={entry.id} onClick={()=>setExpandId(isExp?null:entry.id)} style={{cursor:"pointer",border:`1px solid ${isExp?accent:C.ashDim}`,borderLeft:`3px solid ${isExp?C.ember:C.ashDim}`,transition:"all 0.25s",overflow:"hidden",backdropFilter:"blur(6px)"}}>
              <div style={{padding:"12px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",background:isExp?`rgba(${hexToRgb(accent)},0.06)`:(ts.boxBg||"rgba(0,0,0,0.6)")}}>
                <div>
                  <div style={{fontSize:10,color:C.goldDim,letterSpacing:3,marginBottom:3}}>{entry.date||"Undated"}</div>
                  <div style={{fontSize:15,color:isExp?accent:(ts.fontColor||C.cream),letterSpacing:1}}>{entry.title}</div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}} onClick={e=>e.stopPropagation()}>
                  {isExp && <>
                    <button onClick={()=>setFullscreen(entry.id)} style={iconBtnStyle("#8ab4d4")}>⛶ FULLSCREEN</button>
                    <button onClick={()=>{setEditEntry(entry);setExpandId(null);}} style={iconBtnStyle(C.goldDim)}>EDIT</button>
                  </>}
                  <button onClick={e=>removeEntry(entry.id,e)} style={{background:"none",border:"none",color:C.ashDim,cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>
                </div>
              </div>
              {isExp && <ParchmentView entry={entry} />}
            </div>
          );
        })}
      </div>
      {journal.length===0&&!newEntry&&<EmptyState text="The pages are bare. The road behind you is long — it deserves to be remembered." />}
    </PageShell>
  );
}

function ParchmentView({ entry }) {
  const fmt = entry.format||defaultFormat();
  return (
    <div style={{background:`url("${PARCHMENT}")`,backgroundSize:"600px 600px",borderTop:`1px solid ${C.goldDim}`,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(8,4,1,0.52)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,boxShadow:"inset 0 0 60px rgba(0,0,0,0.7)",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:1,padding:"32px 44px 36px"}}>
        <div style={{textAlign:"center",fontSize:18,color:C.inkMid,marginBottom:20,opacity:0.5,letterSpacing:10}}>— ✦ —</div>
        <div style={{fontFamily:fontFamilyMap(fmt.font),fontSize:fmt.size||18,lineHeight:2.1,color:C.ink,whiteSpace:"pre-wrap",textAlign:fmt.align||"left",fontWeight:fmt.bold?"700":"400",fontStyle:fmt.italic?"italic":"normal"}}>{entry.body}</div>
        <div style={{textAlign:"right",marginTop:24,fontFamily:"'Kalam',cursive",fontSize:18,color:C.inkMid,fontStyle:"italic",opacity:0.7}}>— Harold Grayblood</div>
        <div style={{textAlign:"center",fontSize:16,color:C.inkMid,marginTop:12,opacity:0.45,letterSpacing:10}}>— ✦ —</div>
      </div>
    </div>
  );
}

function FullscreenJournal({ entry, onClose, accent }) {
  const fmt = entry.format||defaultFormat();
  return (
    <div style={{position:"fixed",inset:0,zIndex:100,background:`url("${PARCHMENT}")`,backgroundSize:"600px 600px",display:"flex",flexDirection:"column",overflow:"auto"}}>
      <div style={{position:"fixed",inset:0,background:"rgba(6,3,1,0.48)",pointerEvents:"none"}}/>
      <div style={{position:"fixed",inset:0,boxShadow:"inset 0 0 100px rgba(0,0,0,0.7)",pointerEvents:"none"}}/>
      <div style={{position:"sticky",top:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 32px",background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)",borderBottom:`1px solid rgba(138,101,32,0.3)`}}>
        <div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:C.goldDim,letterSpacing:3}}>{entry.date||"Undated"}</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:17,color:accent,letterSpacing:2}}>{entry.title}</div>
        </div>
        <button onClick={onClose} style={accentBtnStyle(C.ember)}>✕ CLOSE</button>
      </div>
      <div style={{flex:1,position:"relative",zIndex:1,padding:"60px min(80px,8vw)",maxWidth:900,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
        <div style={{textAlign:"center",fontSize:20,color:C.inkMid,marginBottom:32,opacity:0.5,letterSpacing:12}}>— ✦ ✦ ✦ —</div>
        <div style={{fontFamily:fontFamilyMap(fmt.font),fontSize:Math.max(fmt.size||18,20),lineHeight:2.2,color:C.ink,whiteSpace:"pre-wrap",textAlign:fmt.align||"left",fontWeight:fmt.bold?"700":"400",fontStyle:fmt.italic?"italic":"normal"}}>{entry.body}</div>
        <div style={{textAlign:"right",marginTop:44,fontFamily:"'Kalam',cursive",fontSize:22,color:C.inkMid,fontStyle:"italic",opacity:0.75}}>— Harold Grayblood</div>
        <div style={{textAlign:"center",fontSize:18,color:C.inkMid,marginTop:20,opacity:0.4,letterSpacing:12}}>— ✦ ✦ ✦ —</div>
      </div>
    </div>
  );
}

function JournalEntryForm({ entry, setEntry, onSave, onCancel, label, ts, accent }) {
  const fmt = entry.format||defaultFormat();
  const setFmt = (k,v) => setEntry(e=>({...e,format:{...(e.format||defaultFormat()),[k]:v}}));
  return (
    <div style={{background:`url("${PARCHMENT}")`,backgroundSize:"600px 600px",border:`1px solid ${C.goldDim}`,marginBottom:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(6,3,1,0.55)",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:1,padding:22}}>
        <div style={{fontSize:10,letterSpacing:3,color:C.goldDim,marginBottom:12}}>{label.toUpperCase()}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <input value={entry.date} onChange={e=>setEntry(n=>({...n,date:e.target.value}))} placeholder="The date, if you recall..." style={{...kalamInput}} />
          <input value={entry.title} onChange={e=>setEntry(n=>({...n,title:e.target.value}))} placeholder="Name this passage..." style={kalamInput} />
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10,padding:"8px 10px",background:"rgba(0,0,0,0.4)",border:`1px solid rgba(138,101,32,0.25)`,alignItems:"center"}}>
          <select value={fmt.font} onChange={e=>setFmt("font",e.target.value)} style={{...toolInput,minWidth:150}}>{FONT_OPTIONS.map(f=><option key={f.value} value={f.value} style={{background:"#111"}}>{f.label}</option>)}</select>
          <select value={fmt.size} onChange={e=>setFmt("size",Number(e.target.value))} style={{...toolInput,minWidth:60}}>{SIZE_OPTIONS.map(s=><option key={s} value={s} style={{background:"#111"}}>{s}px</option>)}</select>
          <div style={{width:1,height:20,background:C.ashDim}}/>
          <ToggleBtn active={fmt.bold} onClick={()=>setFmt("bold",!fmt.bold)} label="B" extraStyle={{fontWeight:"700"}}/>
          <ToggleBtn active={fmt.italic} onClick={()=>setFmt("italic",!fmt.italic)} label="I" extraStyle={{fontStyle:"italic"}}/>
          <div style={{width:1,height:20,background:C.ashDim}}/>
          {["left","center","right"].map(a=><ToggleBtn key={a} active={fmt.align===a} onClick={()=>setFmt("align",a)} label={a==="left"?"⬅":a==="center"?"☰":"➡"}/>)}
        </div>
        <div style={{padding:"8px 12px",marginBottom:10,background:"rgba(196,160,90,0.08)",border:`1px solid rgba(138,101,32,0.2)`,fontFamily:fontFamilyMap(fmt.font),fontSize:Math.min(fmt.size,15),color:C.paper,fontWeight:fmt.bold?"700":"400",fontStyle:fmt.italic?"italic":"normal",textAlign:fmt.align}}>— a sample of the hand —</div>
        <textarea value={entry.body} onChange={e=>setEntry(n=>({...n,body:e.target.value}))} placeholder="Set quill to parchment. What did the road demand of you today?" style={{...kalamInput,width:"100%",minHeight:200,resize:"vertical",boxSizing:"border-box",marginBottom:14,lineHeight:2,fontFamily:fontFamilyMap(fmt.font),fontSize:fmt.size,fontWeight:fmt.bold?"700":"400",fontStyle:fmt.italic?"italic":"normal",textAlign:fmt.align}}/>
        <div style={{display:"flex",gap:8}}><ActionBtn onClick={onSave} accent={accent}>Save Entry</ActionBtn><ActionBtn onClick={onCancel}>Cancel</ActionBtn></div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// YOUTUBE PAGE
// ══════════════════════════════════════════════════════════════════════════════
function YouTubePage({ episodes, setEpisodes, ts }) {
  const [newEp, setNewEp]         = useState(null);
  const [expandId, setExpandId]   = useState(null);
  const [editEp, setEditEp]       = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [view, setView]           = useState("list");
  const [viewKey, setViewKey]     = useState(0);
  const [calSelectedEp, setCalSelectedEp] = useState(null); // episode selected from calendar
  const accent = "#ff4444";
  const filtered = filterStatus==="all" ? episodes : episodes.filter(e=>e.status===filterStatus);
  const counts = EPISODE_STATUSES.reduce((a,s)=>({...a,[s]:episodes.filter(e=>e.status===s).length}),{});

  const switchView = (v) => { setView(v); setViewKey(k=>k+1); setCalSelectedEp(null); };

  const addEpisode = () => {
    if(!newEp?.title?.trim()) return;
    const next = Math.max(0,...episodes.map(e=>e.episode||0))+1;
    setEpisodes(p=>[...p,{...newEp,id:Date.now(),episode:newEp.episode||next,tags:newEp.tags||[],thumbnail:newEp.thumbnail||null}]);
    setNewEp(null);
  };
  const saveEdit = () => { setEpisodes(p=>p.map(e=>e.id===editEp.id?editEp:e)); setExpandId(editEp.id); setEditEp(null); };
  const removeEp = (id,e) => { e.stopPropagation(); setEpisodes(p=>p.filter(ep=>ep.id!==id)); if(calSelectedEp?.id===id) setCalSelectedEp(null); };
  const cycleStatus = (id,e) => { e.stopPropagation(); setEpisodes(p=>p.map(ep=>{ if(ep.id!==id) return ep; const i=EPISODE_STATUSES.indexOf(ep.status); return{...ep,status:EPISODE_STATUSES[(i+1)%EPISODE_STATUSES.length]}; })); };

  return (
    <PageShell ts={ts}>
      <PageHeader title="YouTube — AntlamTE" rune="▶" accent={accent} fontOverride="'Crimson Text', Georgia, serif" />

      {/* Channel banner */}
      <div style={{marginBottom:24,padding:"16px 22px",background:"rgba(255,0,0,0.07)",border:"1px solid rgba(255,50,50,0.3)",borderLeft:"3px solid #ff3333",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,backdropFilter:"blur(6px)"}}>
        <div>
          <div style={{fontSize:10,letterSpacing:3,color:"#cc4444",marginBottom:3,fontFamily:"'Crimson Text',Georgia,serif"}}>YOUR CHANNEL</div>
          <div style={{fontFamily:"'Crimson Text',Georgia,serif",fontSize:20,color:C.cream,letterSpacing:1}}>@AntlamTE</div>
          <div style={{fontSize:12,color:C.ash,marginTop:2,fontFamily:"'Crimson Text',Georgia,serif"}}>Harold Grayblood — Gate to Sovngarde Edition</div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <a href={YT_CHANNEL} target="_blank" rel="noreferrer" style={{...linkBtnStyle("#ff3333","rgba(255,50,50,0.15)")}}>▶ OPEN CHANNEL</a>
          <a href={`${YT_CHANNEL}/videos`} target="_blank" rel="noreferrer" style={{...linkBtnStyle(C.ashDim,"transparent",C.ash)}}>ALL VIDEOS</a>
          <a href="https://studio.youtube.com" target="_blank" rel="noreferrer" style={{...linkBtnStyle(C.ashDim,"transparent",C.ash)}}>⚙ STUDIO</a>
        </div>
      </div>

      {/* Status summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(90px,1fr))",gap:8,marginBottom:20}}>
        {EPISODE_STATUSES.map(s=>{ const sc=STATUS_COLORS[s]; return (
          <div key={s} onClick={()=>setFilterStatus(filterStatus===s?"all":s)} style={{background:filterStatus===s?sc.bg:"rgba(0,0,0,0.4)",border:`1px solid ${filterStatus===s?sc.border:C.ashDim}`,padding:"10px 12px",cursor:"pointer",textAlign:"center",transition:"all 0.2s",backdropFilter:"blur(4px)"}}>
            <div style={{fontSize:22,color:sc.text,fontFamily:"'Crimson Text',Georgia,serif",fontWeight:600}}>{counts[s]||0}</div>
            <div style={{fontSize:9,letterSpacing:2,color:sc.text,textTransform:"uppercase",marginTop:2,fontFamily:"'Crimson Text',Georgia,serif"}}>{s}</div>
          </div>
        );})}
      </div>

      {/* Controls */}
      <div style={{display:"flex",gap:8,marginBottom:18,alignItems:"center",flexWrap:"wrap"}}>
        <FilterBtn active={filterStatus==="all"} onClick={()=>setFilterStatus("all")} accent={accent}>All</FilterBtn>
        <button onClick={()=>switchView(view==="list"?"calendar":"list")} style={{...ghostBtnStyle,fontSize:10,padding:"5px 14px"}}>{view==="list"?"📅 Calendar View":"📋 List View"}</button>
        <button onClick={()=>setNewEp({title:"",episode:"",status:"planned",description:"",thumbnail:null,thumbnailName:"",tags:[],notes:"",scheduledDate:""})} style={{marginLeft:"auto",...accentBtnStyle(accent)}}>+ NEW EPISODE</button>
      </div>

      {newEp && <EpisodeForm ep={newEp} setEp={setNewEp} onSave={addEpisode} onCancel={()=>setNewEp(null)} label="New Episode" accent={accent} ts={ts}/>}
      {editEp && <EpisodeForm ep={editEp} setEp={setEditEp} onSave={saveEdit} onCancel={()=>setEditEp(null)} label="Edit Episode" accent={accent} ts={ts}/>}

      {view==="calendar" ? (
        <div key={viewKey} className="cal-enter">
          <YouTubeCalendar
            episodes={episodes}
            setEpisodes={setEpisodes}
            accent={accent}
            ts={ts}
            calSelectedEp={calSelectedEp}
            setCalSelectedEp={setCalSelectedEp}
            onCreateEpisode={(dateStr)=>{
              const next=Math.max(0,...episodes.map(e=>e.episode||0))+1;
              setNewEp({title:"",episode:next,status:"planned",description:"",thumbnail:null,thumbnailName:"",tags:[],notes:"",scheduledDate:dateStr});
            }}
          />
          {/* Episode detail panel below calendar */}
          {calSelectedEp && (() => {
            const ep = episodes.find(e=>e.id===calSelectedEp.id) || calSelectedEp;
            const sc = STATUS_COLORS[ep.status]||STATUS_COLORS.planned;
            return (
              <div className="pop-in" style={{marginTop:16,background:ts.boxBg||"rgba(0,0,0,0.8)",border:`1px solid ${sc.border}`,borderTop:`3px solid ${sc.border}`,backdropFilter:"blur(8px)"}}>
                {/* Header */}
                <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.ashDim}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <div style={{background:sc.bg,border:`1px solid ${sc.border}`,padding:"4px 10px",fontFamily:"'Crimson Text',Georgia,serif",fontSize:12,color:sc.text}}>EP{ep.episode||"?"}</div>
                    <div>
                      <div style={{fontFamily:"'Cinzel',serif",fontSize:16,color:accent,letterSpacing:1}}>{ep.title}</div>
                      {ep.scheduledDate && <div style={{fontSize:11,color:C.ash,marginTop:2,fontFamily:"'Crimson Text',Georgia,serif"}}>📅 {ep.scheduledDate}</div>}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <button
                      onClick={e=>cycleStatus(ep.id,e)}
                      style={{background:sc.bg,border:`1px solid ${sc.border}`,color:sc.text,padding:"5px 12px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2}}
                    >{ep.status} ↻</button>
                    <button onClick={()=>{setEditEp(ep);setCalSelectedEp(null);}} style={iconBtnStyle(C.goldDim)}>EDIT</button>
                    <button onClick={e=>removeEp(ep.id,e)} style={{background:"none",border:"none",color:C.ashDim,cursor:"pointer",fontSize:20}}>×</button>
                    <button onClick={()=>setCalSelectedEp(null)} style={{background:"none",border:`1px solid ${C.ashDim}`,color:C.ash,cursor:"pointer",padding:"4px 10px",fontFamily:"'Cinzel',serif",fontSize:10}}>✕</button>
                  </div>
                </div>
                {/* Body */}
                <div style={{padding:"18px 20px",display:"grid",gridTemplateColumns:ep.thumbnail?"180px 1fr 1fr":"1fr 1fr",gap:20}}>
                  {ep.thumbnail && (
                    <div>
                      <FieldLabel accent={accent}>Thumbnail</FieldLabel>
                      <img src={ep.thumbnail} alt="thumbnail" style={{width:"100%",border:`1px solid ${C.ashDim}`,display:"block"}}/>
                    </div>
                  )}
                  <div>
                    <FieldLabel accent={accent}>Description</FieldLabel>
                    <div style={{fontSize:14,color:ts.fontColor||C.cream,lineHeight:1.8,fontFamily:"'Crimson Text',Georgia,serif"}}>{ep.description||<em style={{color:C.ash}}>No description</em>}</div>
                  </div>
                  <div>
                    <FieldLabel accent={accent}>Thumbnail Concept</FieldLabel>
                    <div style={{fontSize:14,color:ts.fontColor||C.cream,lineHeight:1.7,fontStyle:"italic",fontFamily:"'Crimson Text',Georgia,serif",marginBottom:ep.notes?12:0}}>{ep.thumbnailName||<em style={{color:C.ash}}>None</em>}</div>
                    {ep.notes && <>
                      <FieldLabel accent={accent}>Production Notes</FieldLabel>
                      <div style={{fontSize:13,color:C.ash,lineHeight:1.7,fontFamily:"'Crimson Text',Georgia,serif"}}>{ep.notes}</div>
                    </>}
                    {ep.tags?.length>0 && (
                      <div style={{marginTop:12,display:"flex",gap:4,flexWrap:"wrap"}}>
                        {ep.tags.map(t=><span key={t} style={{fontSize:9,background:"rgba(138,101,32,0.2)",border:`1px solid ${C.ashDim}`,color:C.goldDim,padding:"2px 8px",letterSpacing:1}}>{t}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
          {editEp && <EpisodeForm ep={editEp} setEp={setEditEp} onSave={saveEdit} onCancel={()=>setEditEp(null)} label="Edit Episode" accent={accent} ts={ts}/>}
        </div>
      ) : (
        <div key={viewKey} className="cal-enter" style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map(ep=>{
            const isExp=expandId===ep.id, isEdit=editEp?.id===ep.id;
            if(isEdit) return null;
            const sc=STATUS_COLORS[ep.status]||STATUS_COLORS.planned;
            return (
              <div key={ep.id} onClick={()=>setExpandId(isExp?null:ep.id)} style={{cursor:"pointer",border:`1px solid ${isExp?sc.border:C.ashDim}`,borderLeft:`3px solid ${sc.border}`,background:isExp?sc.bg:(ts.boxBg||"rgba(0,0,0,0.6)"),transition:"all 0.2s",backdropFilter:"blur(6px)"}}>
                <div style={{padding:"12px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,flex:1}}>
                    {ep.thumbnail && <img src={ep.thumbnail} alt="thumb" style={{width:56,height:36,objectFit:"cover",border:`1px solid ${C.ashDim}`,flexShrink:0}}/>}
                    <div style={{background:sc.bg,border:`1px solid ${sc.border}`,padding:"3px 8px",fontFamily:"'Crimson Text',Georgia,serif",fontSize:11,color:sc.text,whiteSpace:"nowrap"}}>EP{ep.episode||"?"}</div>
                    <div>
                      <div style={{fontSize:15,color:isExp?accent:(ts.fontColor||C.cream),fontFamily:"'Crimson Text',Georgia,serif"}}>{ep.title}</div>
                      {ep.scheduledDate && <div style={{fontSize:10,color:C.ash,marginTop:2,fontFamily:"'Crimson Text',Georgia,serif"}}>📅 {ep.scheduledDate}</div>}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}} onClick={e=>e.stopPropagation()}>
                    <button onClick={e=>cycleStatus(ep.id,e)} style={{background:sc.bg,border:`1px solid ${sc.border}`,color:sc.text,padding:"3px 10px",cursor:"pointer",fontFamily:"'Crimson Text',Georgia,serif",fontSize:10,letterSpacing:1}}>{ep.status} ↻</button>
                    {isExp && <button onClick={()=>{setEditEp(ep);setExpandId(null);}} style={iconBtnStyle(C.goldDim)}>EDIT</button>}
                    <button onClick={e=>removeEp(ep.id,e)} style={{background:"none",border:"none",color:C.ashDim,cursor:"pointer",fontSize:20}}>×</button>
                  </div>
                </div>
                {isExp && (
                  <div style={{padding:"0 18px 18px",borderTop:`1px solid ${C.ashDim}`}}>
                    <div style={{display:"grid",gridTemplateColumns:ep.thumbnail?"200px 1fr 1fr":"1fr 1fr",gap:18,marginTop:14}}>
                      {ep.thumbnail && <div><FieldLabel accent={accent}>Thumbnail</FieldLabel><img src={ep.thumbnail} alt="thumbnail" style={{width:"100%",border:`1px solid ${C.ashDim}`}}/></div>}
                      <div><FieldLabel accent={accent}>Description</FieldLabel><div style={{fontSize:14,color:ts.fontColor||C.cream,lineHeight:1.8,fontFamily:"'Crimson Text',Georgia,serif"}}>{ep.description||<em style={{color:C.ash}}>None</em>}</div></div>
                      <div>
                        <FieldLabel accent={accent}>Thumbnail Concept</FieldLabel>
                        <div style={{fontSize:14,color:ts.fontColor||C.cream,lineHeight:1.7,fontStyle:"italic",fontFamily:"'Crimson Text',Georgia,serif"}}>{ep.thumbnailName||<em style={{color:C.ash}}>None</em>}</div>
                        {ep.notes&&<><FieldLabel accent={accent} style={{marginTop:12}}>Notes</FieldLabel><div style={{fontSize:13,color:C.ash,lineHeight:1.7,fontFamily:"'Crimson Text',Georgia,serif"}}>{ep.notes}</div></>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length===0 && <EmptyState text="No chronicles recorded. The deeds of Harold Grayblood wait to be witnessed."/>}
        </div>
      )}
    </PageShell>
  );
}

// ── YouTube Calendar ───────────────────────────────────────────────────────
const CAL_BG      = "#e8dcc8";
const CAL_BORDER  = "#c4aa80";
const CAL_TEXT    = "#5a4a30";
const CAL_SUBTEXT = "#8a7a60";
const CAL_EMPTY   = "#ddd3bc";
const CAL_HDR_BG  = "#8b1a1a";
const CAL_HDR_TXT = "#f5e8d8";

function YouTubeCalendar({ episodes, setEpisodes, accent, ts, calSelectedEp, setCalSelectedEp, onCreateEpisode }) {
  const today = new Date();
  const [year, setYear]       = useState(today.getFullYear());
  const [month, setMonth]     = useState(today.getMonth());
  const [hoverDay, setHoverDay] = useState(null);
  const [ctxMenu, setCtxMenu]   = useState(null); // { x, y, dateStr }

  const daysInMonth = new Date(year, month+1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();
  const monthName   = new Date(year, month).toLocaleString("default",{month:"long"});

  const epsByDate = {};
  episodes.forEach(ep => {
    if (ep.scheduledDate) {
      if (!epsByDate[ep.scheduledDate]) epsByDate[ep.scheduledDate] = [];
      epsByDate[ep.scheduledDate].push(ep);
    }
  });

  const prevMonth = () => { if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); setCtxMenu(null); };
  const nextMonth = () => { if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); setCtxMenu(null); };

  const cycleEpStatus = (epId) => {
    setEpisodes(p=>p.map(ep=>{ if(ep.id!==epId) return ep; const i=EPISODE_STATUSES.indexOf(ep.status); return{...ep,status:EPISODE_STATUSES[(i+1)%EPISODE_STATUSES.length]}; }));
    // keep calSelectedEp in sync
    setCalSelectedEp(prev => prev?.id===epId ? {...prev, status: EPISODE_STATUSES[(EPISODE_STATUSES.indexOf(prev.status)+1)%EPISODE_STATUSES.length]} : prev);
  };

  // Close context menu on outside click
  useEffect(() => {
    const close = () => setCtxMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const handleDayRightClick = (e, dateStr) => {
    e.preventDefault();
    e.stopPropagation();
    setCtxMenu({ x: e.clientX, y: e.clientY, dateStr });
  };

  return (
    <div style={{background:CAL_BG, border:`1px solid ${CAL_BORDER}`, boxShadow:"0 4px 32px rgba(0,0,0,0.4)", position:"relative"}}>

      {/* Month navigation */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 24px",background:CAL_BG,borderBottom:`2px solid ${CAL_BORDER}`}}>
        <button onClick={prevMonth} style={{background:"none",border:`1px solid ${CAL_BORDER}`,color:CAL_TEXT,cursor:"pointer",padding:"4px 14px",fontFamily:"'Crimson Text',Georgia,serif",fontSize:18,lineHeight:1}}>‹</button>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:18,color:CAL_TEXT,letterSpacing:4,textTransform:"uppercase"}}>{monthName} <span style={{color:CAL_SUBTEXT}}>{year}</span></div>
        <button onClick={nextMonth} style={{background:"none",border:`1px solid ${CAL_BORDER}`,color:CAL_TEXT,cursor:"pointer",padding:"4px 14px",fontFamily:"'Crimson Text',Georgia,serif",fontSize:18,lineHeight:1}}>›</button>
      </div>

      {/* Right-click hint */}
      <div style={{padding:"6px 16px",background:"rgba(139,26,26,0.08)",borderBottom:`1px solid ${CAL_BORDER}`,fontSize:10,color:CAL_SUBTEXT,fontFamily:"'Cinzel',serif",letterSpacing:2,textAlign:"center"}}>
        RIGHT-CLICK ANY DAY TO MARK A DATE FOR THE CHRONICLES &nbsp;·&nbsp; SELECT AN ENTRY TO VIEW THE PASSAGE
      </div>

      {/* Weekday header */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:CAL_HDR_BG}}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,i)=>(
          <div key={d} style={{padding:"9px 4px",textAlign:"center",fontSize:11,color:CAL_HDR_TXT,letterSpacing:2,fontFamily:"'Cinzel',serif",fontWeight:600,borderRight:i<6?"1px solid rgba(255,255,255,0.12)":"none"}}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
        {Array.from({length:firstDay}).map((_,i)=>(
          <div key={`e${i}`} style={{minHeight:88,borderRight:`1px solid ${CAL_BORDER}`,borderBottom:`1px solid ${CAL_BORDER}`,background:CAL_EMPTY}}/>
        ))}

        {Array.from({length:daysInMonth}).map((_,i)=>{
          const d       = i+1;
          const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const dayEps  = epsByDate[dateStr]||[];
          const isToday = today.getFullYear()===year && today.getMonth()===month && today.getDate()===d;
          const isHover = hoverDay===dateStr;
          const hasSelected = dayEps.some(e=>e.id===calSelectedEp?.id);

          return (
            <div
              key={d}
              onMouseEnter={()=>setHoverDay(dateStr)}
              onMouseLeave={()=>setHoverDay(null)}
              onContextMenu={e=>handleDayRightClick(e, dateStr)}
              style={{
                minHeight:88,
                borderRight:`1px solid ${CAL_BORDER}`,
                borderBottom:`1px solid ${CAL_BORDER}`,
                padding:"6px 8px",
                background: hasSelected ? "rgba(139,26,26,0.10)" : isToday ? "rgba(255,68,68,0.07)" : isHover ? "rgba(0,0,0,0.04)" : "transparent",
                transition:"background 0.15s",
                position:"relative",
                cursor:"context-menu",
              }}
            >
              {/* Day number */}
              <div style={{fontSize:13,color:isToday?CAL_HDR_BG:CAL_TEXT,fontFamily:"'Cinzel',serif",fontWeight:isToday?"700":"400",marginBottom:4,display:"flex",alignItems:"center",gap:5,userSelect:"none"}}>
                {isToday && <span style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:CAL_HDR_BG,flexShrink:0}}/>}
                {d}
              </div>

              {/* Episode chips */}
              {dayEps.slice(0,3).map(ep=>{
                const sc    = STATUS_COLORS[ep.status]||STATUS_COLORS.planned;
                const isSel = calSelectedEp?.id===ep.id;
                return (
                  <div
                    key={ep.id}
                    onClick={e=>{ e.stopPropagation(); setCalSelectedEp(isSel?null:ep); }}
                    title={`EP${ep.episode} — ${ep.title} [${ep.status}]`}
                    style={{
                      fontSize:10,
                      background: isSel ? sc.border : sc.bg,
                      border:`1px solid ${sc.border}`,
                      color: isSel ? "#fff" : sc.text,
                      padding:"2px 6px", marginBottom:3,
                      overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis",
                      fontFamily:"'Crimson Text',Georgia,serif",
                      cursor:"pointer", transition:"all 0.15s", borderRadius:2,
                      boxShadow: isSel ? `0 0 8px ${sc.border}60` : "none",
                    }}
                  >
                    EP{ep.episode||"?"} {ep.title}
                  </div>
                );
              })}
              {dayEps.length>3 && <div style={{fontSize:9,color:CAL_SUBTEXT,fontFamily:"'Cinzel',serif",letterSpacing:1}}>+{dayEps.length-3} more</div>}

              {/* Right-click add hint on hover (empty day) */}
              {isHover && dayEps.length===0 && (
                <div style={{position:"absolute",bottom:4,right:6,fontSize:9,color:CAL_SUBTEXT,fontFamily:"'Cinzel',serif",letterSpacing:1,opacity:0.6,pointerEvents:"none"}}>right-click</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{display:"flex",gap:12,padding:"10px 16px",background:CAL_EMPTY,borderTop:`1px solid ${CAL_BORDER}`,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:9,color:CAL_SUBTEXT,fontFamily:"'Cinzel',serif",letterSpacing:2,marginRight:4}}>STATUS:</span>
        {EPISODE_STATUSES.map(s=>{ const sc=STATUS_COLORS[s]; return (
          <div key={s} style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:10,height:10,background:sc.bg,border:`1px solid ${sc.border}`,borderRadius:2}}/>
            <span style={{fontSize:9,color:CAL_SUBTEXT,fontFamily:"'Crimson Text',Georgia,serif",textTransform:"capitalize"}}>{s}</span>
          </div>
        );})}
      </div>

      {/* Right-click context menu */}
      {ctxMenu && (
        <div
          className="pop-in"
          onClick={e=>e.stopPropagation()}
          style={{
            position:"fixed", left:ctxMenu.x, top:ctxMenu.y, zIndex:999,
            background:"#fff8f0", border:`1px solid ${CAL_BORDER}`,
            borderTop:`3px solid ${CAL_HDR_BG}`,
            boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
            minWidth:220, overflow:"hidden",
          }}
        >
          <div style={{padding:"10px 16px",background:CAL_HDR_BG,borderBottom:`1px solid ${CAL_BORDER}`}}>
            <div style={{fontSize:9,color:CAL_HDR_TXT,letterSpacing:3,fontFamily:"'Cinzel',serif",textTransform:"uppercase"}}>MARK THE DATE</div>
            <div style={{fontSize:13,color:CAL_HDR_TXT,fontFamily:"'Crimson Text',Georgia,serif",marginTop:2}}>{ctxMenu.dateStr}</div>
          </div>
          <div style={{padding:"8px 0"}}>
            <button
              onClick={()=>{ onCreateEpisode(ctxMenu.dateStr); setCtxMenu(null); }}
              style={{display:"block",width:"100%",background:"none",border:"none",padding:"10px 16px",cursor:"pointer",textAlign:"left",fontFamily:"'Crimson Text',Georgia,serif",fontSize:14,color:CAL_TEXT,transition:"background 0.1s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(139,26,26,0.08)"}
              onMouseLeave={e=>e.currentTarget.style.background="none"}
            >
              📜 &nbsp; Open a new chronicle on this date
            </button>
            {(epsByDate[ctxMenu.dateStr]||[]).length > 0 && (
              <>
                <div style={{height:1,background:CAL_BORDER,margin:"4px 0"}}/>
                <div style={{padding:"4px 16px 2px",fontSize:9,color:CAL_SUBTEXT,letterSpacing:2,fontFamily:"'Cinzel',serif"}}>CHRONICLES MARKED HERE</div>
                {(epsByDate[ctxMenu.dateStr]||[]).map(ep=>{
                  const sc=STATUS_COLORS[ep.status]||STATUS_COLORS.planned;
                  return (
                    <button
                      key={ep.id}
                      onClick={()=>{ setCalSelectedEp(ep); setCtxMenu(null); }}
                      style={{display:"block",width:"100%",background:"none",border:"none",padding:"8px 16px",cursor:"pointer",textAlign:"left",fontFamily:"'Crimson Text',Georgia,serif",fontSize:13,color:CAL_TEXT,transition:"background 0.1s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(139,26,26,0.06)"}
                      onMouseLeave={e=>e.currentTarget.style.background="none"}
                    >
                      <span style={{fontSize:10,background:sc.bg,border:`1px solid ${sc.border}`,color:sc.text,padding:"1px 6px",marginRight:8,borderRadius:2}}>EP{ep.episode}</span>
                      {ep.title}
                    </button>
                  );
                })}
              </>
            )}
            <div style={{height:1,background:CAL_BORDER,margin:"4px 0"}}/>
            <button
              onClick={()=>setCtxMenu(null)}
              style={{display:"block",width:"100%",background:"none",border:"none",padding:"8px 16px",cursor:"pointer",textAlign:"left",fontFamily:"'Crimson Text',Georgia,serif",fontSize:13,color:CAL_SUBTEXT}}
            >✕ &nbsp; Leave it unmarked</button>
          </div>
        </div>
      )}
    </div>
  );
}

function EpisodeForm({ ep, setEp, onSave, onCancel, label, accent, ts }) {
  const fileRef = useRef();
  const handleThumb = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEp(n=>({...n,thumbnail:ev.target.result,thumbnailName:file.name}));
    reader.readAsDataURL(file);
  };
  return (
    <div style={{background:ts.boxBg||"rgba(0,0,0,0.8)",border:`1px solid ${C.goldDim}`,padding:18,marginBottom:18,backdropFilter:"blur(6px)"}}>
      <div style={{fontSize:10,letterSpacing:3,color:C.goldDim,marginBottom:12,fontFamily:"'Crimson Text',Georgia,serif"}}>{label.toUpperCase()}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 80px 1fr",gap:10,marginBottom:10}}>
        <input value={ep.title} onChange={e=>setEp(n=>({...n,title:e.target.value}))} placeholder="Name this chapter..." style={ytInput} />
        <input value={ep.episode} onChange={e=>setEp(n=>({...n,episode:e.target.value}))} placeholder="Ep #" style={ytInput} />
        <select value={ep.status} onChange={e=>setEp(n=>({...n,status:e.target.value}))} style={{...ytInput,cursor:"pointer"}}>
          {EPISODE_STATUSES.map(s=><option key={s} value={s} style={{background:"#111"}}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <input value={ep.scheduledDate||""} onChange={e=>setEp(n=>({...n,scheduledDate:e.target.value}))} type="date" placeholder="Scheduled date" style={ytInput}/>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleThumb}/>
          <button onClick={()=>fileRef.current.click()} style={{...ghostBtnStyle,flex:1,fontSize:11}}>
            {ep.thumbnail ? "✓ Thumbnail Uploaded" : "📷 Upload Thumbnail"}
          </button>
          {ep.thumbnail && <button onClick={()=>setEp(n=>({...n,thumbnail:null,thumbnailName:""}))} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:18}}>×</button>}
        </div>
      </div>
      {ep.thumbnail && <img src={ep.thumbnail} alt="thumb preview" style={{height:80,marginBottom:10,border:`1px solid ${C.ashDim}`,objectFit:"cover"}}/>}
      <textarea value={ep.description} onChange={e=>setEp(n=>({...n,description:e.target.value}))} placeholder="What unfolds in this chronicle..." style={{...ytInput,width:"100%",minHeight:60,resize:"vertical",boxSizing:"border-box",marginBottom:10}}/>
      <input value={ep.thumbnailName||""} onChange={e=>setEp(n=>({...n,thumbnailName:e.target.value}))} placeholder="Vision for the face of this chapter..." style={{...ytInput,width:"100%",boxSizing:"border-box",marginBottom:10}}/>
      <input value={(ep.tags||[]).join(", ")} onChange={e=>setEp(n=>({...n,tags:e.target.value.split(",").map(t=>t.trim()).filter(Boolean)}))} placeholder="Tags: comma separated..." style={{...ytInput,width:"100%",boxSizing:"border-box",marginBottom:10}}/>
      <textarea value={ep.notes} onChange={e=>setEp(n=>({...n,notes:e.target.value}))} placeholder="Notes from the forge..." style={{...ytInput,width:"100%",minHeight:50,resize:"vertical",boxSizing:"border-box",marginBottom:14}}/>
      <div style={{display:"flex",gap:8}}><ActionBtn onClick={onSave} accent={accent}>Save</ActionBtn><ActionBtn onClick={onCancel}>Cancel</ActionBtn></div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GALLERY PAGE
// ══════════════════════════════════════════════════════════════════════════════
function GalleryPage({ gallery, setGallery, ts, galleryCategories, setGalleryCategories }) {
  const fileRef  = useRef();
  const [lightbox, setLightbox] = useState(null);
  const [filterCat, setFilterCat] = useState("All");
  const [showCatMgr, setShowCatMgr] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const accent = ts.accentColor || C.gold;

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (window.hgStorage?.saveImage) {
        const id = Date.now() + Math.random();
        const reader = new FileReader();
        reader.onload = async (ev) => {
          await window.hgStorage.saveImage(id, ev.target.result, file.type, file.name);
          setGallery(p => [...p, { id, src: `hgdata://images/${id}`, name: file.name, caption: "", tag: "", category: "Uncategorized" }]);
        };
        reader.readAsArrayBuffer(file);
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => setGallery(p => [...p, { id: Date.now() + Math.random(), src: ev.target.result, name: file.name, caption: "", tag: "", category: "Uncategorized" }]);
        reader.readAsDataURL(file);
      }
    });
    e.target.value = "";
  };

  const updateGalleryItem = (id,key,val) => setGallery(p=>p.map(g=>g.id===id?{...g,[key]:val}:g));
  const removeGalleryItem = (id) => {
    const img = gallery.find(g => g.id === id);
    if (img?.src?.startsWith("hgdata://")) window.hgStorage?.deleteImage?.(id);
    setGallery(p=>p.filter(g=>g.id!==id));
    if(lightbox?.id===id) setLightbox(null);
  };
  const addCategory = () => { const n=newCatName.trim(); if(!n||galleryCategories.includes(n)) return; setGalleryCategories(p=>[...p,n]); setNewCatName(""); };
  const removeCategory = (cat) => { setGalleryCategories(p=>p.filter(c=>c!==cat)); setGallery(p=>p.map(g=>g.category===cat?{...g,category:"Uncategorized"}:g)); if(filterCat===cat) setFilterCat("All"); };

  const filtered = filterCat==="All" ? gallery : gallery.filter(g=>(g.category||"Uncategorized")===filterCat);

  return (
    <PageShell ts={ts}>
      <PageHeader title="Gallery" rune="🖼" accent={accent} />
      <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handleUpload}/>
        <button onClick={()=>fileRef.current.click()} style={accentBtnStyle(accent)}>+ ADD TO THE GALLERY</button>
        <span style={{fontSize:12,color:C.ash,fontFamily:"'Crimson Text',Georgia,serif"}}>{gallery.length} relic{gallery.length!==1?"s":""} preserved</span>
      </div>

      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16,alignItems:"center"}}>
        {["All","Uncategorized",...galleryCategories].map(cat=>(
          <FilterBtn key={cat} active={filterCat===cat} onClick={()=>setFilterCat(cat)} accent={accent}>{cat}</FilterBtn>
        ))}
        <button onClick={()=>setShowCatMgr(p=>!p)} style={{...ghostBtnStyle,fontSize:10,padding:"5px 12px"}}>⚙ MANAGE COLLECTIONS</button>
      </div>

      {showCatMgr && (
        <Box ts={ts} style={{marginBottom:20}}>
          <FieldLabel accent={accent}>Manage Collections</FieldLabel>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
            {galleryCategories.map(cat=>(
              <div key={cat} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.03)",border:`1px solid ${C.ashDim}`,padding:"4px 10px"}}>
                <span style={{fontSize:12,color:ts.fontColor||C.cream}}>{cat}</span>
                <button onClick={()=>removeCategory(cat)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:14,padding:0}}>×</button>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={newCatName} onChange={e=>setNewCatName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCategory()} placeholder="New collection name..." style={themedInput(ts)} />
            <ActionBtn onClick={addCategory} accent={accent}>Add</ActionBtn>
          </div>
        </Box>
      )}

      {filtered.length===0 && <EmptyState text="The gallery stands bare as a looted barrow. The world of Skyrim is worth remembering in image."/>}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
        {filtered.map(img=>(
          <div key={img.id} style={{background:ts.boxBg||"rgba(0,0,0,0.6)",border:`1px solid ${C.ashDim}`,overflow:"hidden",backdropFilter:"blur(4px)"}}>
            <div style={{position:"relative",cursor:"pointer"}} onClick={()=>setLightbox(img)}>
              <img src={img.src} alt={img.name} style={{width:"100%",height:150,objectFit:"cover",display:"block"}}/>
              <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0)",transition:"background 0.2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.3)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0)"}/>
            </div>
            <div style={{padding:"10px 12px"}}>
              <input value={img.caption||""} onChange={e=>updateGalleryItem(img.id,"caption",e.target.value)} placeholder="Add caption..." style={{...themedInput(ts),fontSize:12,marginBottom:8,width:"100%",boxSizing:"border-box"}}/>
              <select value={img.category||"Uncategorized"} onChange={e=>updateGalleryItem(img.id,"category",e.target.value)} style={{...themedInput(ts),fontSize:11,marginBottom:6,cursor:"pointer",width:"100%",boxSizing:"border-box"}}>
                <option value="Uncategorized" style={{background:"#111"}}>Uncategorized</option>
                {galleryCategories.map(c=><option key={c} value={c} style={{background:"#111"}}>{c}</option>)}
              </select>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <input value={img.tag||""} onChange={e=>updateGalleryItem(img.id,"tag",e.target.value)} placeholder="Tag..." style={{...themedInput(ts),fontSize:11,width:"60%"}}/>
                <button onClick={()=>removeGalleryItem(img.id)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:18}}>×</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}} onClick={()=>setLightbox(null)}>
          <img src={lightbox.src} alt={lightbox.name} style={{maxWidth:"90vw",maxHeight:"80vh",objectFit:"contain",border:`1px solid ${C.goldDim}`}}/>
          {lightbox.caption && <div style={{marginTop:16,color:C.cream,fontFamily:"'Crimson Text',Georgia,serif",fontSize:16,letterSpacing:1}}>{lightbox.caption}</div>}
          <div style={{marginTop:10,color:C.ash,fontSize:11,letterSpacing:2}}>CLICK TO CLOSE</div>
        </div>
      )}
    </PageShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ══════════════════════════════════════════════════════════════════════════════
function SettingsPage({ themeSettings, updateTheme, ts, updateReady, appVersion, gallery }) {
  const [activeTab, setActiveTab] = useState("skyrim");
  const [importMsg, setImportMsg] = useState("");
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const s = themeSettings[activeTab] || defaultTabTheme();
  const accent = ts.accentColor || C.gold;
  const fileRef = useRef();

  const handleBgUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (window.hgStorage?.saveImage) {
        // Electron path
        const id = Date.now() + Math.random();
        const reader = new FileReader();
        reader.onload = async (ev) => {
          await window.hgStorage.saveImage(id, ev.target.result, file.type, file.name);
          updateTheme(activeTab, "bgImages", [...(themeSettings[activeTab].bgImages || []), `hgdata://images/${id}`]);
        };
        reader.readAsArrayBuffer(file);
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => updateTheme(activeTab, "bgImages", [...(themeSettings[activeTab].bgImages || []), ev.target.result]);
        reader.readAsDataURL(file);
      }
    });
    e.target.value = "";
  };

  const removeBgImage = (idx) => {
    const imgs = [...(s.bgImages || [])];
    const removed = imgs[idx];
    if (removed?.startsWith("hgdata://")) {
      const id = removed.replace("hgdata://images/", "").split("/")[0];
      window.hgStorage?.deleteImage?.(id);
    }
    imgs.splice(idx, 1);
    updateTheme(activeTab, "bgImages", imgs);
  };

  const exportJSON = async () => {
    const keys = ["hg_ideas","hg_journal","hg_episodes","hg_categories","hg_gallery","hg_theme_meta","hg_theme_images"];
    const data = { version: 1, exportedAt: new Date().toISOString() };
    keys.forEach(k => { const v = localStorage.getItem(k); if (v !== null) data[k] = JSON.parse(v); });
    const imgs = await window.hgStorage?.readAllImages?.() ?? {};
    data._images = imgs;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `harold-grayblood-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportMarkdown = () => {
    const journal = JSON.parse(localStorage.getItem("hg_journal") || "[]");
    const lines = journal.map(e => {
      const parts = [`## ${e.title || "Untitled"}`, `*${e.date || ""}*`, "", e.body || ""];
      return parts.join("\n");
    });
    const md = `# Harold Grayblood — Journal\n\n${lines.join("\n\n---\n\n")}`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `harold-grayblood-journal-${new Date().toISOString().slice(0,10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const keys = ["hg_ideas","hg_journal","hg_episodes","hg_categories","hg_gallery","hg_theme_meta","hg_theme_images"];
        const hasAny = keys.some(k => k in data);
        if (!hasAny) { setImportMsg("Invalid backup file — no recognised data found."); return; }
        if (!window.confirm("This will replace all your current data with the backup. Continue?")) return;
        keys.forEach(k => { if (k in data) localStorage.setItem(k, JSON.stringify(data[k])); });
        // Restore hgdata:// images if present
        if (data._images && window.hgStorage?.saveImage) {
          for (const [id, dataUrl] of Object.entries(data._images)) {
            const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
            if (!match) continue;
            const mime = match[1];
            const b64 = match[2];
            const bin = atob(b64);
            const ab = new ArrayBuffer(bin.length);
            const view = new Uint8Array(ab);
            for (let i = 0; i < bin.length; i++) view[i] = bin.charCodeAt(i);
            await window.hgStorage.saveImage(id, ab, mime, id);
          }
        }
        window.location.reload();
      } catch {
        setImportMsg("Could not read file — make sure it is a valid Harold Grayblood backup.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const resetAllData = () => {
    if (!window.confirm("Reset ALL data? This will wipe all ideas, journal entries, episodes, gallery images, and theme settings. This cannot be undone.")) return;
    ["hg_ideas","hg_journal","hg_episodes","hg_categories","hg_gallery","hg_theme_meta","hg_theme_images"]
      .forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  return (
    <PageShell ts={ts}>
      <PageHeader title="The Forge" rune="⚙" accent={accent}/>
      <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:24,alignItems:"start"}}>
        {/* Tab selector */}
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          <div style={{fontSize:9,letterSpacing:3,color:C.goldDim,marginBottom:8,textTransform:"uppercase"}}>Customize Tab</div>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)} style={{background:activeTab===t?"rgba(212,168,67,0.1)":"rgba(0,0,0,0.4)",border:`1px solid ${activeTab===t?accent:C.ashDim}`,color:activeTab===t?accent:C.ash,padding:"8px 14px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,textAlign:"left",transition:"all 0.2s",backdropFilter:"blur(4px)"}}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Settings panel */}
        <div style={{display:"flex",flexDirection:"column",gap:18}}>
          <Box ts={ts}>
            <FieldLabel accent={accent}>Background Images — {TAB_LABELS[activeTab]}</FieldLabel>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handleBgUpload}/>
            <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
              <button onClick={()=>fileRef.current.click()} style={ghostBtnStyle}>+ Upload Background Photos</button>
              <button onClick={()=>setShowGalleryPicker(p=>!p)} style={ghostBtnStyle}>🖼 Pick from Gallery</button>
            </div>
            {showGalleryPicker && (
              <div style={{marginBottom:12,border:`1px solid ${C.ashDim}`,padding:10}}>
                {(gallery||[]).length === 0
                  ? <div style={{fontSize:11,color:C.ash,fontStyle:"italic"}}>No gallery images yet.</div>
                  : <div style={{display:"flex",gap:8,flexWrap:"wrap",maxHeight:200,overflowY:"auto"}}>
                      {(gallery||[]).map(img=>(
                        <div
                          key={img.id}
                          title={img.name}
                          onClick={()=>{ updateTheme(activeTab,"bgImages",[...(themeSettings[activeTab].bgImages||[]),img.src]); setShowGalleryPicker(false); }}
                          style={{cursor:"pointer",border:`2px solid ${C.ashDim}`,transition:"border-color 0.15s"}}
                          onMouseEnter={e=>e.currentTarget.style.borderColor=accent}
                          onMouseLeave={e=>e.currentTarget.style.borderColor=C.ashDim}
                        >
                          <img src={img.src} alt={img.name} style={{width:80,height:50,objectFit:"cover",display:"block"}}/>
                        </div>
                      ))}
                    </div>
                }
              </div>
            )}
            {s.bgImages?.length>0 && (
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                {s.bgImages.map((img,i)=>(
                  <div key={i} style={{position:"relative"}}>
                    <img src={img} alt="" style={{width:80,height:50,objectFit:"cover",border:`1px solid ${C.ashDim}`}}/>
                    <button onClick={()=>removeBgImage(i)} style={{position:"absolute",top:-6,right:-6,background:C.red,border:"none",color:"#fff",width:18,height:18,cursor:"pointer",fontSize:12,borderRadius:"50%",lineHeight:"18px",textAlign:"center",padding:0}}>×</button>
                  </div>
                ))}
              </div>
            )}
            <FieldLabel accent={accent} style={{marginTop:4}}>Background Mode</FieldLabel>
            <div style={{display:"flex",gap:8,marginBottom:4}}>
              {["none","static","slideshow"].map(m=>(
                <ToggleBtn key={m} active={s.bgMode===m} onClick={()=>updateTheme(activeTab,"bgMode",m)} label={m.charAt(0).toUpperCase()+m.slice(1)}/>
              ))}
            </div>
            {s.bgMode==="slideshow" && (
              <div style={{marginTop:8}}>
                <FieldLabel accent={accent}>Slideshow Interval (seconds)</FieldLabel>
                <input type="number" min={2} max={60} value={s.slideshowInterval||5} onChange={e=>updateTheme(activeTab,"slideshowInterval",Number(e.target.value))} style={{...themedInput(ts),width:80}}/>
              </div>
            )}
            <div style={{marginTop:12}}>
              <FieldLabel accent={accent}>Background Overlay Darkness</FieldLabel>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <input type="range" min={0} max={1} step={0.05} value={s.bgOverlay??0.5} onChange={e=>updateTheme(activeTab,"bgOverlay",Number(e.target.value))} style={{flex:1,accentColor:accent}}/>
                <span style={{fontSize:12,color:C.ash,minWidth:36}}>{Math.round((s.bgOverlay??0.5)*100)}%</span>
              </div>
            </div>
          </Box>

          <Box ts={ts}>
            <FieldLabel accent={accent}>Colors — {TAB_LABELS[activeTab]}</FieldLabel>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
              {[
                ["accentColor","Accent Color"],
                ["fontColor","Text Color"],
                ["boxBg","Box Background"],
              ].map(([key,label])=>(
                <div key={key}>
                  <FieldLabel accent={accent}>{label}</FieldLabel>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <input type="color" value={key==="boxBg"?"#000000":(s[key]||C.gold)} onChange={e=>updateTheme(activeTab,key,e.target.value)} style={{width:36,height:28,border:`1px solid ${C.ashDim}`,background:"none",cursor:"pointer",padding:2}}/>
                    <input value={s[key]||""} onChange={e=>updateTheme(activeTab,key,e.target.value)} placeholder="rgba or hex..." style={{...themedInput(ts),fontSize:11,flex:1}}/>
                  </div>
                </div>
              ))}
            </div>
          </Box>

          <Box ts={ts}>
            <FieldLabel accent={accent}>Preview</FieldLabel>
            <div style={{padding:"16px 20px",background:s.boxBg||"rgba(0,0,0,0.7)",border:`1px solid ${s.accentColor||C.gold}`,borderTop:`2px solid ${s.accentColor||C.gold}`}}>
              <div style={{fontSize:10,letterSpacing:3,color:s.accentColor||C.gold,marginBottom:6}}>THE THRESHOLD</div>
              <div style={{fontSize:16,color:s.fontColor||C.cream}}>As the embers settle, so shall your colours.</div>
              <div style={{fontSize:12,color:C.ash,marginTop:4}}>The hearthstone holds.</div>
            </div>
          </Box>

          {/* ── Data & Backup ── */}
          <Box ts={ts}>
            <FieldLabel accent={accent}>Data &amp; Backup</FieldLabel>
            <div style={{fontSize:12,color:C.ash,marginBottom:14,lineHeight:1.7}}>
              Export your data as a JSON backup or readable Markdown journal. Import a backup to restore all data.
              {appVersion && <span style={{marginLeft:12,color:C.goldDim}}>v{appVersion}</span>}
            </div>
            {updateReady && (
              <button
                onClick={() => window.hgStorage?.installUpdate?.()}
                style={{display:"block",marginBottom:14,background:"rgba(212,168,67,0.15)",border:`1px solid ${C.gold}`,color:C.gold,padding:"9px 22px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:2}}
              >
                ⬇ Update Ready — Restart to Install
              </button>
            )}
            <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:10}}>
              <button onClick={exportJSON} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${C.ashDim}`,color:C.ash,padding:"8px 18px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2}}>
                Export All Data (JSON)
              </button>
              <button onClick={exportMarkdown} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${C.ashDim}`,color:C.ash,padding:"8px 18px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2}}>
                Export Journal (Markdown)
              </button>
              <label style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${C.ashDim}`,color:C.ash,padding:"8px 18px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2}}>
                Import Backup (JSON)
                <input type="file" accept=".json" style={{display:"none"}} onChange={importJSON}/>
              </label>
            </div>
            {importMsg && <div style={{fontSize:12,color:C.red,marginTop:6}}>{importMsg}</div>}
          </Box>

          {/* ── Danger Zone ── */}
          <Box ts={ts} style={{border:`1px solid ${C.red}`,borderTop:`2px solid ${C.red}`}}>
            <FieldLabel accent={C.red}>Danger Zone</FieldLabel>
            <div style={{fontSize:12,color:C.ash,marginBottom:14,lineHeight:1.7}}>
              Permanently wipes all stored data — ideas, journal, episodes, gallery, and theme settings — and reloads the app to factory defaults. Use this if storage is full or data has become corrupted.
            </div>
            <button
              onClick={resetAllData}
              style={{background:"rgba(192,57,43,0.12)",border:`1px solid ${C.red}`,color:C.red,padding:"9px 22px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:2,transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(192,57,43,0.25)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(192,57,43,0.12)";}}
            >
              ⚠ RESET ALL DATA
            </button>
          </Box>
        </div>
      </div>
    </PageShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════
function PageShell({ ts, children }) {
  return (
    <div style={{ padding:"26px 32px 80px", width:"100%", boxSizing:"border-box", position:"relative", zIndex:1 }}>
      {children}
    </div>
  );
}

function Box({ ts, children, style }) {
  return (
    <div style={{ background:ts?.boxBg||"rgba(0,0,0,0.7)", border:`1px solid ${C.ashDim}`, padding:18, backdropFilter:"blur(6px)", ...style }}>
      {children}
    </div>
  );
}

function PageHeader({ title, rune, accent, fontOverride }) {
  return (
    <div style={{ marginBottom:22, paddingBottom:12, borderBottom:`1px solid ${C.ashDim}` }}>
      <div style={{fontSize:10,color:C.goldDim,letterSpacing:4,marginBottom:5,textTransform:"uppercase",fontFamily:fontOverride||"'Cinzel',serif"}}>{rune} Harold Grayblood</div>
      <h2 style={{margin:0,fontFamily:fontOverride||"'Cinzel',serif",fontSize:"clamp(15px,2.5vw,24px)",color:accent||C.gold,fontWeight:400,letterSpacing:3}}>{title}</h2>
    </div>
  );
}

function FieldLabel({ children, accent, style }) {
  return <div style={{fontSize:9,letterSpacing:3,color:accent||C.goldDim,textTransform:"uppercase",marginBottom:6,...style}}>{children}</div>;
}

function FilterBtn({ active, onClick, accent, children }) {
  return (
    <button onClick={onClick} style={{background:active?`rgba(${hexToRgb(accent||C.gold)},0.12)`:"rgba(0,0,0,0.4)",border:`1px solid ${active?(accent||C.gold):C.ashDim}`,color:active?(accent||C.gold):C.ash,padding:"5px 14px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,textTransform:"uppercase",transition:"all 0.2s",backdropFilter:"blur(4px)"}}>
      {children}
    </button>
  );
}

function ActionBtn({ onClick, accent, children }) {
  return <button onClick={onClick} style={{background:accent?`rgba(${hexToRgb(accent)},0.12)`:"rgba(255,255,255,0.05)",border:`1px solid ${accent||C.ashDim}`,color:accent||C.ash,padding:"7px 20px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:2,transition:"all 0.2s"}}>{children}</button>;
}

function ToggleBtn({ active, onClick, label, extraStyle }) {
  return <button onClick={onClick} style={{background:active?"rgba(212,168,67,0.18)":"transparent",border:`1px solid ${active?C.gold:C.ashDim}`,color:active?C.gold:C.ash,padding:"3px 10px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:12,transition:"all 0.15s",...extraStyle}}>{label}</button>;
}

function EmptyState({ text }) {
  return <div style={{textAlign:"center",padding:"50px 20px",color:C.ashDim,fontSize:12,letterSpacing:4,textTransform:"uppercase"}}>{text}</div>;
}

// ── Style helpers ──────────────────────────────────────────────────────────
function themedInput(ts) {
  return { background:"rgba(0,0,0,0.4)", border:`1px solid ${C.ashDim}`, color:ts?.fontColor||C.cream, fontFamily:"'Cinzel',serif", fontSize:13, padding:"7px 11px", width:"100%", backdropFilter:"blur(4px)" };
}

function iconBtnStyle(color) {
  return { background:"none", border:`1px solid ${color}`, color, cursor:"pointer", fontSize:10, padding:"4px 10px", fontFamily:"'Cinzel',serif", letterSpacing:2 };
}

function accentBtnStyle(color) {
  return { background:`rgba(${hexToRgb(color)},0.12)`, border:`1px solid ${color}`, color, padding:"7px 18px", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:2, textDecoration:"none", display:"inline-block" };
}

function linkBtnStyle(border, bg, color) {
  return { background:bg||"transparent", border:`1px solid ${border}`, color:color||border, padding:"8px 18px", textDecoration:"none", fontFamily:"'Crimson Text',Georgia,serif", fontSize:12, letterSpacing:1, display:"inline-block", transition:"all 0.2s" };
}

function hexToRgb(hex) {
  if (!hex || !hex.startsWith("#")) return "212,168,67";
  const r = parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

function defaultFormat() { return {font:"kalam",size:18,align:"left",bold:false,italic:false}; }
function fontFamilyMap(f) { return {kalam:"'Kalam',cursive",cinzel:"'Cinzel',serif",serif:"Georgia,serif",monospace:"'Courier New',monospace"}[f]||"'Kalam',cursive"; }

const ghostBtnStyle = { background:"rgba(255,255,255,0.04)", border:`1px solid ${C.ashDim}`, color:C.ash, cursor:"pointer", padding:"6px 14px", fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:2, transition:"all 0.2s" };
const kalamInput = { background:"rgba(0,0,0,0.35)", border:`1px solid rgba(139,101,32,0.4)`, color:C.ink, fontFamily:"'Kalam',cursive", fontSize:16, padding:"8px 12px", width:"100%" };
const ytInput = { background:"rgba(0,0,0,0.5)", border:`1px solid ${C.ashDim}`, color:C.cream, fontFamily:"'Crimson Text',Georgia,serif", fontSize:14, padding:"7px 11px", width:"100%" };
const toolInput = { background:"rgba(255,255,255,0.05)", border:`1px solid ${C.ashDim}`, color:C.cream, fontFamily:"'Cinzel',serif", fontSize:11, padding:"4px 8px", cursor:"pointer" };
