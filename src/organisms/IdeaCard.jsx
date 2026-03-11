import React from "react";
import { C } from "../constants.js";
import { hexToRgb } from "../utils.js";

export function IdeaCard({ idea, expandId, accent, ts, onExpand, onRemove }) {
  return (
    <div onClick={onExpand} style={{background:expandId===idea.id?`rgba(${hexToRgb(accent)},0.06)`:ts.boxBg||"rgba(0,0,0,0.6)",border:`1px solid ${expandId===idea.id?accent:C.ashDim}`,borderTop:`2px solid ${expandId===idea.id?accent:C.goldDim}`,padding:16,cursor:"pointer",transition:"all 0.2s",backdropFilter:"blur(6px)"}}>
      <div style={{fontSize:9,letterSpacing:3,color:C.goldDim,textTransform:"uppercase",marginBottom:6}}>{idea.category}</div>
      <div style={{fontSize:15,color:accent,marginBottom:8,letterSpacing:1}}>{idea.title}</div>
      {expandId===idea.id && <div style={{fontSize:13,color:ts.fontColor||C.cream,lineHeight:1.8,marginBottom:10,opacity:0.9}}>{idea.content}</div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{idea.tags.map(t=><span key={t} style={{fontSize:9,background:"rgba(138,101,32,0.2)",border:`1px solid ${C.ashDim}`,color:C.goldDim,padding:"1px 7px",letterSpacing:1}}>{t}</span>)}</div>
        <button onClick={onRemove} style={{background:"none",border:"none",color:C.ashDim,cursor:"pointer",fontSize:18}}>×</button>
      </div>
    </div>
  );
}
