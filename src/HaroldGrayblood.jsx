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

import {
  C, RUNES, YT_CHANNEL, TABS, TAB_LABELS, SKYRIM_SUBTABS,
  PARCHMENT, DEFAULT_CATEGORIES, EPISODE_STATUSES, STATUS_COLORS,
  FONT_OPTIONS, SIZE_OPTIONS, defaultTabTheme, defaultSettings,
  INIT_IDEAS, INIT_JOURNAL, INIT_EPISODES,
  CAL_BG, CAL_BORDER, CAL_TEXT, CAL_SUBTEXT, CAL_EMPTY, CAL_HDR_BG, CAL_HDR_TXT,
} from "./constants.js";

import {
  hexToRgb, loadState, saveState, loadThemeSettings, saveThemeSettings,
  checkStorageSize, defaultFormat, fontFamilyMap,
  themedInput, iconBtnStyle, accentBtnStyle, linkBtnStyle,
  ghostBtnStyle, kalamInput, ytInput, toolInput,
} from "./utils.js";

import { FilterBtn, ActionBtn, ToggleBtn } from "./atoms/Button.jsx";
import { FieldLabel } from "./atoms/Label.jsx";
import { EmptyState } from "./atoms/EmptyState.jsx";

import { Nav } from "./molecules/Nav.jsx";
import { PageHeader } from "./molecules/PageHeader.jsx";
import { StatusBadge } from "./molecules/StatusBadge.jsx";
import { FilterBar } from "./molecules/FilterBar.jsx";
import { CategoryManager } from "./molecules/CategoryManager.jsx";
import { ChannelBanner } from "./organisms/ChannelBanner.jsx";
import { YouTubeCalendar } from "./organisms/YouTubeCalendar.jsx";
import { EpisodeForm } from "./organisms/EpisodeForm.jsx";
import { JournalEntryForm } from "./organisms/JournalEntryForm.jsx";
import { IdeaCard } from "./organisms/IdeaCard.jsx";
import { GalleryCard } from "./organisms/GalleryCard.jsx";
import { ParchmentView } from "./organisms/ParchmentView.jsx";
import { JournalEntryRow } from "./organisms/JournalEntryRow.jsx";
import { EpisodeRow } from "./organisms/EpisodeRow.jsx";
import { EpisodeCard } from "./organisms/EpisodeCard.jsx";
import { FullscreenJournal } from "./organisms/FullscreenJournal.jsx";
import { PageShell } from "./templates/PageShell.jsx";
import { Box } from "./templates/Box.jsx";
import { TabBackground } from "./templates/TabBackground.jsx";
import { SkyrimPage } from "./pages/SkyrimPage.jsx";
import { IdeasPage } from "./pages/IdeasPage.jsx";

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
            <JournalEntryRow key={entry.id} entry={entry} isExp={isExp} accent={accent} ts={ts} onExpand={()=>setExpandId(isExp?null:entry.id)} onEdit={()=>{setEditEntry(entry);setExpandId(null);}} onFullscreen={()=>setFullscreen(entry.id)} onRemove={e=>removeEntry(entry.id,e)} />
          );
        })}
      </div>
      {journal.length===0&&!newEntry&&<EmptyState text="The pages are bare. The road behind you is long — it deserves to be remembered." />}
    </PageShell>
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
      <ChannelBanner />

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
          {calSelectedEp && (()=>{
            const ep = episodes.find(e=>e.id===calSelectedEp.id) || calSelectedEp;
            return (
              <EpisodeCard ep={ep} accent={accent} ts={ts} onCycleStatus={e=>cycleStatus(ep.id,e)} onEdit={()=>{setEditEp(ep);setCalSelectedEp(null);}} onRemove={e=>removeEp(ep.id,e)} onClose={()=>setCalSelectedEp(null)} />
            );
          })()}
          {editEp && <EpisodeForm ep={editEp} setEp={setEditEp} onSave={saveEdit} onCancel={()=>setEditEp(null)} label="Edit Episode" accent={accent} ts={ts}/>}
        </div>
      ) : (
        <div key={viewKey} className="cal-enter" style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map(ep=>{
            const isExp=expandId===ep.id, isEdit=editEp?.id===ep.id;
            if(isEdit) return null;
            return (
              <EpisodeRow key={ep.id} ep={ep} isExp={isExp} accent={accent} ts={ts} onExpand={()=>setExpandId(isExp?null:ep.id)} onEdit={()=>{setEditEp(ep);setExpandId(null);}} onCycleStatus={e=>cycleStatus(ep.id,e)} onRemove={e=>removeEp(ep.id,e)} />
            );
          })}
          {filtered.length===0 && <EmptyState text="No chronicles recorded. The deeds of Harold Grayblood wait to be witnessed."/>}
        </div>
      )}
    </PageShell>
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

      <FilterBar options={["All","Uncategorized",...galleryCategories]} activeFilter={filterCat} onFilterChange={setFilterCat} accent={accent} style={{marginBottom:16}}>
        <button onClick={()=>setShowCatMgr(p=>!p)} style={{...ghostBtnStyle,fontSize:10,padding:"5px 12px"}}>⚙ MANAGE COLLECTIONS</button>
      </FilterBar>

      {showCatMgr && (
        <CategoryManager categories={galleryCategories} onRemove={removeCategory} inputValue={newCatName} onInputChange={setNewCatName} onAdd={addCategory} label="Manage Collections" placeholder="New collection name..." ts={ts} accent={accent} style={{marginBottom:20}}/>
      )}

      {filtered.length===0 && <EmptyState text="The gallery stands bare as a looted barrow. The world of Skyrim is worth remembering in image."/>}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
        {filtered.map(img=>(
          <GalleryCard key={img.id} img={img} ts={ts} galleryCategories={galleryCategories} onOpenLightbox={setLightbox} onUpdate={updateGalleryItem} onRemove={removeGalleryItem} />
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


