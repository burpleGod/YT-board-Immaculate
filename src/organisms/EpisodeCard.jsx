import { C, STATUS_COLORS } from "../constants.js";
import { iconBtnStyle } from "../utils.js";
import { StatusBadge } from "../molecules/StatusBadge.jsx";
import { FieldLabel } from "../atoms/Label.jsx";

export function EpisodeCard({ ep, accent, ts, onCycleStatus, onEdit, onRemove, onClose }) {
  const sc = STATUS_COLORS[ep.status]||STATUS_COLORS.planned;
  return (
    <div className="pop-in" style={{marginTop:16,background:ts.boxBg||"rgba(0,0,0,0.8)",border:`1px solid ${sc.border}`,borderTop:`3px solid ${sc.border}`,backdropFilter:"blur(8px)"}}>
      {/* Header */}
      <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.ashDim}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <StatusBadge status={ep.status} label={`EP${ep.episode||"?"}`} style={{padding:"4px 10px",fontSize:12}}/>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:16,color:accent,letterSpacing:1}}>{ep.title}</div>
            {ep.scheduledDate && <div style={{fontSize:11,color:C.ash,marginTop:2,fontFamily:"'Crimson Text',Georgia,serif"}}>📅 {ep.scheduledDate}</div>}
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button
            onClick={onCycleStatus}
            style={{background:sc.bg,border:`1px solid ${sc.border}`,color:sc.text,padding:"5px 12px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2}}
          >{ep.status} ↻</button>
          <button onClick={onEdit} style={iconBtnStyle(C.goldDim)}>EDIT</button>
          <button onClick={onRemove} style={{background:"none",border:"none",color:C.ashDim,cursor:"pointer",fontSize:20}}>×</button>
          <button onClick={onClose} style={{background:"none",border:`1px solid ${C.ashDim}`,color:C.ash,cursor:"pointer",padding:"4px 10px",fontFamily:"'Cinzel',serif",fontSize:10}}>✕</button>
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
}
