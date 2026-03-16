import { useState, useRef } from "react";
import { C, TABS, TAB_LABELS, SKYRIM_SUBTABS } from "../constants.js";
import { hexToRgb } from "../utils.js";

function Nav({ tab, setTab, ts, profiles = [], activeProfileId = null, onSwitchProfile }) {
  const accent = ts.accentColor || C.gold;
  const [skyrimHover, setSkyrimHover]   = useState(false);
  const [profileHover, setProfileHover] = useState(false);
  const hoverTimer   = useRef(null);
  const profileTimer = useRef(null);

  const showDropdown  = () => { clearTimeout(hoverTimer.current); setSkyrimHover(true); };
  const hideDropdown  = () => { hoverTimer.current = setTimeout(() => setSkyrimHover(false), 300); };
  const showProfile   = () => { clearTimeout(profileTimer.current); setProfileHover(true); };
  const hideProfile   = () => { profileTimer.current = setTimeout(() => setProfileHover(false), 300); };

  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const profileLabel  = activeProfile?.name ?? "";

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

      {/* ── Profile switcher (Electron mode only) ── */}
      {profiles.length > 0 && (
        <div
          style={{ position:"absolute", right:16, bottom:0 }}
          onMouseEnter={showProfile}
          onMouseLeave={hideProfile}
        >
          <button
            style={{
              background:"rgba(0,0,0,0.5)",
              border:`1px solid ${C.ashDim}`,
              color:C.ash,
              padding:"8px 16px",
              cursor: profiles.length > 1 ? "pointer" : "default",
              fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:2,
              textTransform:"uppercase", transition:"all 0.2s",
              backdropFilter:"blur(4px)",
              display:"flex", alignItems:"center", gap:6,
              maxWidth:180, overflow:"hidden", whiteSpace:"nowrap",
            }}
          >
            <span style={{ overflow:"hidden", textOverflow:"ellipsis" }}>{profileLabel}</span>
            {profiles.length > 1 && <span style={{ fontSize:8, opacity:0.6 }}>▾</span>}
          </button>

          {profileHover && profiles.length > 1 && (
            <div
              className="dropdown-enter"
              onMouseEnter={showProfile}
              onMouseLeave={hideProfile}
              style={{
                position:"absolute", top:"100%", right:0, zIndex:100,
                minWidth:200,
                background:"rgba(8,5,2,0.97)",
                border:`1px solid ${accent}`,
                borderTop:`2px solid ${accent}`,
                boxShadow:`0 12px 40px rgba(0,0,0,0.7), 0 0 20px rgba(${hexToRgb(accent)},0.1)`,
                backdropFilter:"blur(12px)",
                overflow:"hidden",
              }}
            >
              <div style={{ padding:"8px 14px 6px", fontSize:9, color:C.goldDim, letterSpacing:3,
                            fontFamily:"'Cinzel',serif", borderBottom:`1px solid ${C.ashDim}` }}>
                THE KEEPER
              </div>
              {profiles.map(p => (
                <button
                  key={p.id}
                  onClick={() => { onSwitchProfile(p.id); setProfileHover(false); }}
                  style={{
                    display:"flex", alignItems:"center", gap:10,
                    width:"100%", background:"none", border:"none",
                    padding:"11px 16px", cursor:"pointer", textAlign:"left",
                    fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:2,
                    color: p.id === activeProfileId ? accent : C.cream,
                    borderLeft: p.id === activeProfileId ? `2px solid ${accent}` : "2px solid transparent",
                    transition:"all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background=`rgba(${hexToRgb(accent)},0.08)`; e.currentTarget.style.color=accent; }}
                  onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.color=p.id===activeProfileId?accent:C.cream; }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export { Nav };
