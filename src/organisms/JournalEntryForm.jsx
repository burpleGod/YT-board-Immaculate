import React from "react";
import { C, PARCHMENT, FONT_OPTIONS, SIZE_OPTIONS } from "../constants.js";
import { defaultFormat, fontFamilyMap, kalamInput, toolInput } from "../utils.js";
import { ActionBtn, ToggleBtn } from "../atoms/Button.jsx";

export function JournalEntryForm({ entry, setEntry, onSave, onCancel, label, ts, accent }) {
  const fmt = entry.format||defaultFormat();
  const setFmt = (k,v) => setEntry(e=>({...e,format:{...(e.format||defaultFormat()),[k]:v}}));
  return (
    <div style={{background:`url("${PARCHMENT}")`,backgroundSize:"600px 600px",border:`1px solid ${C.goldDim}`,marginBottom:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(6,3,1,0.55)",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:1,padding:22}}>
        <div style={{fontSize:10,letterSpacing:3,color:C.goldDim,marginBottom:12}}>{label.toUpperCase()}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <input value={entry.date} onChange={e=>setEntry(n=>({...n,date:e.target.value}))} placeholder="The date, if you recall..." style={{...kalamInput}} />
          <input value={entry.title} onChange={e=>setEntry(n=>({...n,title:e.target.value}))} placeholder="Name this passage..." style={kalamInput} />
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10,padding:"8px 10px",background:"rgba(0,0,0,0.4)",border:`1px solid rgba(138,101,32,0.25)`,alignItems:"center"}}>
          <select value={fmt.font} onChange={e=>setFmt("font",e.target.value)} style={{...toolInput,minWidth:150}}>{FONT_OPTIONS.map(f=><option key={f.value} value={f.value} style={{background:"#111"}}>{f.label}</option>)}</select>
          <select value={fmt.size} onChange={e=>setFmt("size",Number(e.target.value))} style={{...toolInput,minWidth:60}}>{SIZE_OPTIONS.map(s=><option key={s} value={s} style={{background:"#111"}}>{s}px</option>)}</select>
          <div style={{width:1,height:20,background:C.ashDim}}/>
          <ToggleBtn active={fmt.bold} onClick={()=>setFmt("bold",!fmt.bold)} label="B" extraStyle={{fontWeight:"700"}}/>
          <ToggleBtn active={fmt.italic} onClick={()=>setFmt("italic",!fmt.italic)} label="I" extraStyle={{fontStyle:"italic"}}/>
          <div style={{width:1,height:20,background:C.ashDim}}/>
          {["left","center","right"].map(a=><ToggleBtn key={a} active={fmt.align===a} onClick={()=>setFmt("align",a)} label={a==="left"?"⬅":a==="center"?"☰":"➡"}/>)}
        </div>
        <div style={{padding:"8px 12px",marginBottom:10,background:"rgba(196,160,90,0.08)",border:`1px solid rgba(138,101,32,0.2)`,fontFamily:fontFamilyMap(fmt.font),fontSize:Math.min(fmt.size,15),color:C.paper,fontWeight:fmt.bold?"700":"400",fontStyle:fmt.italic?"italic":"normal",textAlign:fmt.align}}>— a sample of the hand —</div>
        <textarea value={entry.body} onChange={e=>setEntry(n=>({...n,body:e.target.value}))} placeholder="Set quill to parchment. What did the road demand of you today?" style={{...kalamInput,width:"100%",minHeight:200,resize:"vertical",boxSizing:"border-box",marginBottom:14,lineHeight:2,fontFamily:fontFamilyMap(fmt.font),fontSize:fmt.size,fontWeight:fmt.bold?"700":"400",fontStyle:fmt.italic?"italic":"normal",textAlign:fmt.align}}/>
        <div style={{display:"flex",gap:8}}><ActionBtn onClick={onSave} accent={accent}>Save Entry</ActionBtn><ActionBtn onClick={onCancel}>Cancel</ActionBtn></div>
      </div>
    </div>
  );
}
