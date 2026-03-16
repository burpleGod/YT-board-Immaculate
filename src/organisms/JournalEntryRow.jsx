import { C } from "../constants.js";
import { hexToRgb, iconBtnStyle } from "../utils.js";
import { ParchmentView } from "./ParchmentView.jsx";

export function JournalEntryRow({ entry, isExp, accent, ts, onExpand, onEdit, onFullscreen, onRemove }) {
  return (
    <div onClick={onExpand} style={{cursor:"pointer",border:`1px solid ${isExp?accent:C.ashDim}`,borderLeft:`3px solid ${isExp?C.ember:C.ashDim}`,transition:"all 0.25s",overflow:"hidden",backdropFilter:"blur(6px)"}}>
      <div style={{padding:"12px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",background:isExp?`rgba(${hexToRgb(accent)},0.06)`:(ts.boxBg||"rgba(0,0,0,0.6)")}}>
        <div>
          <div style={{fontSize:10,color:C.goldDim,letterSpacing:3,marginBottom:3}}>{entry.date||"Undated"}</div>
          <div style={{fontSize:15,color:isExp?accent:(ts.fontColor||C.cream),letterSpacing:1}}>{entry.title}</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}} onClick={e=>e.stopPropagation()}>
          {isExp && <>
            <button onClick={onFullscreen} style={iconBtnStyle("#8ab4d4")}>⛶ FULLSCREEN</button>
            <button onClick={onEdit} style={iconBtnStyle(C.goldDim)}>EDIT</button>
          </>}
          <button onClick={onRemove} style={{background:"none",border:"none",color:C.ashDim,cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>
        </div>
      </div>
      {isExp && <ParchmentView entry={entry} />}
    </div>
  );
}
