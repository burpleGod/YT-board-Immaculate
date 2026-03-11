import { useState } from "react";
import { C, EPISODE_STATUSES, STATUS_COLORS } from "../constants.js";
import { accentBtnStyle, ghostBtnStyle } from "../utils.js";
import { FilterBtn } from "../atoms/Button.jsx";
import { EmptyState } from "../atoms/EmptyState.jsx";
import { PageHeader } from "../molecules/PageHeader.jsx";
import { ChannelBanner } from "../organisms/ChannelBanner.jsx";
import { EpisodeRow } from "../organisms/EpisodeRow.jsx";
import { EpisodeCard } from "../organisms/EpisodeCard.jsx";
import { EpisodeForm } from "../organisms/EpisodeForm.jsx";
import { YouTubeCalendar } from "../organisms/YouTubeCalendar.jsx";
import { PageShell } from "../templates/PageShell.jsx";

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

export { YouTubePage };
