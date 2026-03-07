import { C } from "../constants.js";

export function PageHeader({ title, rune, accent, fontOverride }) {
  return (
    <div style={{ marginBottom:22, paddingBottom:12, borderBottom:`1px solid ${C.ashDim}` }}>
      <div style={{fontSize:10,color:C.goldDim,letterSpacing:4,marginBottom:5,textTransform:"uppercase",fontFamily:fontOverride||"'Cinzel',serif"}}>{rune} Harold Grayblood</div>
      <h2 style={{margin:0,fontFamily:fontOverride||"'Cinzel',serif",fontSize:"clamp(15px,2.5vw,24px)",color:accent||C.gold,fontWeight:400,letterSpacing:3}}>{title}</h2>
    </div>
  );
}
