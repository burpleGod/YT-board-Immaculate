import React from "react";
import { C, PARCHMENT } from "../constants.js";
import { defaultFormat, fontFamilyMap } from "../utils.js";

export function ParchmentView({ entry }) {
  const fmt = entry.format||defaultFormat();
  return (
    <div style={{background:`url("${PARCHMENT}")`,backgroundSize:"600px 600px",borderTop:`1px solid ${C.goldDim}`,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(8,4,1,0.52)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,boxShadow:"inset 0 0 60px rgba(0,0,0,0.7)",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:1,padding:"32px 44px 36px"}}>
        <div style={{textAlign:"center",fontSize:18,color:C.inkMid,marginBottom:20,opacity:0.5,letterSpacing:10}}>— ✦ —</div>
        <div style={{fontFamily:fontFamilyMap(fmt.font),fontSize:fmt.size||18,lineHeight:2.1,color:C.ink,whiteSpace:"pre-wrap",textAlign:fmt.align||"left",fontWeight:fmt.bold?"700":"400",fontStyle:fmt.italic?"italic":"normal"}}>{entry.body}</div>
        <div style={{textAlign:"right",marginTop:24,fontFamily:"'Kalam',cursive",fontSize:18,color:C.inkMid,fontStyle:"italic",opacity:0.7}}>— Harold Grayblood</div>
        <div style={{textAlign:"center",fontSize:16,color:C.inkMid,marginTop:12,opacity:0.45,letterSpacing:10}}>— ✦ —</div>
      </div>
    </div>
  );
}
