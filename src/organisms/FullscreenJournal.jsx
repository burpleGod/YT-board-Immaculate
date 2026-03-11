import { C, PARCHMENT } from "../constants.js";
import { defaultFormat, fontFamilyMap, accentBtnStyle } from "../utils.js";

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

export { FullscreenJournal };
