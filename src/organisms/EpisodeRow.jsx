import React from "react";
import { C, STATUS_COLORS } from "../constants.js";
import { iconBtnStyle } from "../utils.js";
import { StatusBadge } from "../molecules/StatusBadge.jsx";
import { FieldLabel } from "../atoms/Label.jsx";

export function EpisodeRow({ ep, isExp, accent, ts, onExpand, onEdit, onCycleStatus, onRemove }) {
  const sc = STATUS_COLORS[ep.status]||STATUS_COLORS.planned;
  return (
    <div onClick={onExpand} style={{cursor:"pointer",border:`1px solid ${isExp?sc.border:C.ashDim}`,borderLeft:`3px solid ${sc.border}`,background:isExp?sc.bg:(ts.boxBg||"rgba(0,0,0,0.6)"),transition:"all 0.2s",backdropFilter:"blur(6px)"}}>
      <div style={{padding:"12px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,flex:1}}>
          {ep.thumbnail && <img src={ep.thumbnail} alt="thumb" style={{width:56,height:36,objectFit:"cover",border:`1px solid ${C.ashDim}`,flexShrink:0}}/>}
          <StatusBadge status={ep.status} label={`EP${ep.episode||"?"}`} style={{padding:"3px 8px",fontSize:11,whiteSpace:"nowrap"}}/>
          <div>
            <div style={{fontSize:15,color:isExp?accent:(ts.fontColor||C.cream),fontFamily:"'Crimson Text',Georgia,serif"}}>{ep.title}</div>
            {ep.scheduledDate && <div style={{fontSize:10,color:C.ash,marginTop:2,fontFamily:"'Crimson Text',Georgia,serif"}}>📅 {ep.scheduledDate}</div>}
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}} onClick={e=>e.stopPropagation()}>
          <button onClick={onCycleStatus} style={{background:sc.bg,border:`1px solid ${sc.border}`,color:sc.text,padding:"3px 10px",cursor:"pointer",fontFamily:"'Crimson Text',Georgia,serif",fontSize:10,letterSpacing:1}}>{ep.status} ↻</button>
          {isExp && <button onClick={onEdit} style={iconBtnStyle(C.goldDim)}>EDIT</button>}
          <button onClick={onRemove} style={{background:"none",border:"none",color:C.ashDim,cursor:"pointer",fontSize:20}}>×</button>
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
}
