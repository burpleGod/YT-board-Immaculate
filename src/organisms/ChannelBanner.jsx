import React from "react";
import { C, YT_CHANNEL } from "../constants.js";
import { linkBtnStyle } from "../utils.js";

export function ChannelBanner() {
  return (
    <div style={{marginBottom:24,padding:"16px 22px",background:"rgba(255,0,0,0.07)",border:"1px solid rgba(255,50,50,0.3)",borderLeft:"3px solid #ff3333",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,backdropFilter:"blur(6px)"}}>
      <div>
        <div style={{fontSize:10,letterSpacing:3,color:"#cc4444",marginBottom:3,fontFamily:"'Crimson Text',Georgia,serif"}}>YOUR CHANNEL</div>
        <div style={{fontFamily:"'Crimson Text',Georgia,serif",fontSize:20,color:C.cream,letterSpacing:1}}>@AntlamTE</div>
        <div style={{fontSize:12,color:C.ash,marginTop:2,fontFamily:"'Crimson Text',Georgia,serif"}}>Harold Grayblood — Gate to Sovngarde Edition</div>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <a href={YT_CHANNEL} target="_blank" rel="noreferrer" style={{...linkBtnStyle("#ff3333","rgba(255,50,50,0.15)")}}>▶ OPEN CHANNEL</a>
        <a href={`${YT_CHANNEL}/videos`} target="_blank" rel="noreferrer" style={{...linkBtnStyle(C.ashDim,"transparent",C.ash)}}>ALL VIDEOS</a>
        <a href="https://studio.youtube.com" target="_blank" rel="noreferrer" style={{...linkBtnStyle(C.ashDim,"transparent",C.ash)}}>⚙ STUDIO</a>
      </div>
    </div>
  );
}
