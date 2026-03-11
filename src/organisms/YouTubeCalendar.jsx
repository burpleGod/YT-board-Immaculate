import React, { useState, useEffect } from "react";
import {
  C, CAL_BG, CAL_BORDER, CAL_TEXT, CAL_SUBTEXT, CAL_EMPTY,
  CAL_HDR_BG, CAL_HDR_TXT, STATUS_COLORS, EPISODE_STATUSES,
} from "../constants.js";

export function YouTubeCalendar({ episodes, setEpisodes, accent, ts, calSelectedEp, setCalSelectedEp, onCreateEpisode }) {
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
