import { useState, useRef } from "react";
import { C, TAB_LABELS, defaultTabTheme } from "../constants.js";
import { ghostBtnStyle, themedInput } from "../utils.js";
import { ToggleBtn } from "../atoms/Button.jsx";
import { FieldLabel } from "../atoms/Label.jsx";
import { PageHeader } from "../molecules/PageHeader.jsx";
import { PageShell } from "../templates/PageShell.jsx";
import { Box } from "../templates/Box.jsx";

function SettingsPage({ themeSettings, updateTheme, ts, updateReady, appVersion, gallery, subscriberCount, setSubscriberCount }) {
  const [activeTab, setActiveTab] = useState("skyrim");
  const [activeSection, setActiveSection] = useState("forge");
  const [importMsg, setImportMsg] = useState("");
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const s = themeSettings[activeTab] || defaultTabTheme();
  const accent = ts.accentColor || C.gold;
  const fileRef = useRef();

  const handleBgUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (window.hgStorage?.saveImage) {
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

  const FORGE_SECTIONS = [
    {
      id: "forge",
      icon: "⚒",
      name: "THE FORGE",
      sub: "Customise backgrounds, colours & themes per tab",
    },
    {
      id: "sanctum",
      icon: "📜",
      name: "THE SANCTUM",
      sub: "Profile, backups, data export & app settings",
    },
    {
      id: "emissary",
      icon: "🔮",
      name: "THE EMISSARY",
      sub: "YouTube API connection (coming in a future age)",
    },
  ];

  const THEME_TABS = [
    { id: "youtube",  label: "▶ YouTube" },
    { id: "skyrim",   label: "⚔ Skyrim"  },
    { id: "ideas",    label: "📜 Ideas"   },
    { id: "journal",  label: "✒ Journal"  },
    { id: "gallery",  label: "🖼 Gallery"  },
    { id: "settings", label: "⚙ The Forge" },
  ];

  return (
    <PageShell>
      <PageHeader title="The Forge" rune="⚙" accent={accent}/>
      <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:24,alignItems:"start"}}>

        {/* ── Left sidebar — section navigator ── */}
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          {FORGE_SECTIONS.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              style={{
                background: activeSection===sec.id ? "rgba(212,168,67,0.1)" : "rgba(0,0,0,0.4)",
                border: `1px solid ${activeSection===sec.id ? accent : C.ashDim}`,
                color: activeSection===sec.id ? accent : C.ash,
                padding: "12px 14px",
                cursor: "pointer",
                fontFamily: "'Cinzel',serif",
                fontSize: 10,
                letterSpacing: 2,
                textAlign: "left",
                transition: "all 0.2s",
                backdropFilter: "blur(4px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 4,
              }}
            >
              <span style={{fontSize:18}}>{sec.icon}</span>
              {sec.name}
              <span style={{fontSize:9,color:activeSection===sec.id?accent:C.ash,lineHeight:1.5,letterSpacing:1,textTransform:"none",fontFamily:"'Cinzel',serif"}}>{sec.sub}</span>
            </button>
          ))}
        </div>

        {/* ── Right panel ── */}
        <div style={{display:"flex",flexDirection:"column",gap:18}}>

          {/* ════ SECTION: THE FORGE ════ */}
          {activeSection === "forge" && <>

            {/* Horizontal tab row */}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:4}}>
              {THEME_TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setActiveTab(t.id); setShowGalleryPicker(false); }}
                  style={{
                    background: activeTab===t.id ? "rgba(212,168,67,0.1)" : "rgba(0,0,0,0.4)",
                    border: `1px solid ${activeTab===t.id ? accent : C.ashDim}`,
                    color: activeTab===t.id ? accent : C.ash,
                    padding: "6px 14px",
                    cursor: "pointer",
                    fontFamily: "'Cinzel',serif",
                    fontSize: 10,
                    letterSpacing: 2,
                    transition: "all 0.2s",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Background Images box */}
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

            {/* Colors box */}
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

            {/* Preview box */}
            <Box ts={ts}>
              <FieldLabel accent={accent}>Preview</FieldLabel>
              <div style={{padding:"16px 20px",background:s.boxBg||"rgba(0,0,0,0.7)",border:`1px solid ${s.accentColor||C.gold}`,borderTop:`2px solid ${s.accentColor||C.gold}`}}>
                <div style={{fontSize:10,letterSpacing:3,color:s.accentColor||C.gold,marginBottom:6}}>THE THRESHOLD</div>
                <div style={{fontSize:16,color:s.fontColor||C.cream}}>As the embers settle, so shall your colours.</div>
                <div style={{fontSize:12,color:C.ash,marginTop:4}}>The hearthstone holds.</div>
              </div>
            </Box>
          </>}

          {/* ════ SECTION: THE SANCTUM ════ */}
          {activeSection === "sanctum" && <>

            {/* Creator Profile box */}
            <Box ts={ts}>
              <FieldLabel accent={accent}>Creator Profile</FieldLabel>
              <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                <FieldLabel>Subscriber Count</FieldLabel>
                <input
                  type="number"
                  min={0}
                  value={subscriberCount ?? 0}
                  onChange={e => setSubscriberCount(Math.max(0, parseInt(e.target.value) || 0))}
                  style={{...themedInput(ts),width:"100%"}}
                  placeholder="0"
                />
                <span style={{fontSize:"0.75rem",color:C.ash}}>Used on the Skyrim overview page (Phase 5G)</span>
              </div>
            </Box>

            {/* Data & Backup box */}
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

            {/* Danger Zone box */}
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
          </>}

          {/* ════ SECTION: THE EMISSARY ════ */}
          {activeSection === "emissary" && (
            <Box ts={ts} style={{border:`1px solid ${C.goldDim}`,borderTop:`2px solid ${accent}`}}>
              {/* Lore heading */}
              <div style={{fontSize:13,letterSpacing:3,color:accent,fontFamily:"'Cinzel',serif",marginBottom:20}}>
                🔮 &nbsp; THE EMISSARY HAS NOT YET ARRIVED
              </div>
              {/* Lore body */}
              <div style={{fontSize:14,color:ts.fontColor||C.cream,lineHeight:1.9,fontFamily:"'Crimson Text',Georgia,serif",marginBottom:20}}>
                This chamber awaits a connection to the wider realm.
                <br/><br/>
                When the Emissary is bound, your chronicles will reach beyond these walls — subscriber counts, view tallies, and the names of your sworn followers, drawn directly from the source.
              </div>
              {/* Divider */}
              <div style={{height:1,background:C.ashDim,marginBottom:20}}/>
              {/* Locked form skeleton */}
              <div style={{opacity:0.35,pointerEvents:"none",display:"flex",flexDirection:"column",gap:14}}>
                <div>
                  <FieldLabel accent={accent}>API Key</FieldLabel>
                  <input style={{...themedInput(ts),width:"100%"}} placeholder="Enter API key..." readOnly/>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <FieldLabel accent={accent} style={{marginBottom:0}}>Channel Sync</FieldLabel>
                  <ToggleBtn active={false} onClick={()=>{}} label="OFF"/>
                </div>
                <button style={ghostBtnStyle}>▶ Connect to YouTube</button>
              </div>
              {/* System note — smaller, muted, visually distinct from lore copy */}
              <div style={{fontSize:10,color:C.ash,opacity:0.6,marginTop:20,lineHeight:1.6,letterSpacing:0.5}}>
                This feature is not yet available. It will be unlocked in a future update.
              </div>
            </Box>
          )}

        </div>
      </div>
    </PageShell>
  );
}

export { SettingsPage };
