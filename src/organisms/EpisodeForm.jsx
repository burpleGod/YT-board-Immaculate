import React, { useRef } from "react";
import { C, EPISODE_STATUSES } from "../constants.js";
import { ghostBtnStyle, ytInput } from "../utils.js";
import { ActionBtn } from "../atoms/Button.jsx";

export function EpisodeForm({ ep, setEp, onSave, onCancel, label, accent, ts }) {
  const fileRef = useRef();
  const handleThumb = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEp(n=>({...n,thumbnail:ev.target.result,thumbnailName:file.name}));
    reader.readAsDataURL(file);
  };
  return (
    <div style={{background:ts.boxBg||"rgba(0,0,0,0.8)",border:`1px solid ${C.goldDim}`,padding:18,marginBottom:18,backdropFilter:"blur(6px)"}}>
      <div style={{fontSize:10,letterSpacing:3,color:C.goldDim,marginBottom:12,fontFamily:"'Crimson Text',Georgia,serif"}}>{label.toUpperCase()}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 80px 1fr",gap:10,marginBottom:10}}>
        <input value={ep.title} onChange={e=>setEp(n=>({...n,title:e.target.value}))} placeholder="Name this chapter..." style={ytInput} />
        <input value={ep.episode} onChange={e=>setEp(n=>({...n,episode:e.target.value}))} placeholder="Ep #" style={ytInput} />
        <select value={ep.status} onChange={e=>setEp(n=>({...n,status:e.target.value}))} style={{...ytInput,cursor:"pointer"}}>
          {EPISODE_STATUSES.map(s=><option key={s} value={s} style={{background:"#111"}}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <input value={ep.scheduledDate||""} onChange={e=>setEp(n=>({...n,scheduledDate:e.target.value}))} type="date" placeholder="Scheduled date" style={ytInput}/>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleThumb}/>
          <button onClick={()=>fileRef.current.click()} style={{...ghostBtnStyle,flex:1,fontSize:11}}>
            {ep.thumbnail ? "✓ Thumbnail Uploaded" : "📷 Upload Thumbnail"}
          </button>
          {ep.thumbnail && <button onClick={()=>setEp(n=>({...n,thumbnail:null,thumbnailName:""}))} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:18}}>×</button>}
        </div>
      </div>
      {ep.thumbnail && <img src={ep.thumbnail} alt="thumb preview" style={{height:80,marginBottom:10,border:`1px solid ${C.ashDim}`,objectFit:"cover"}}/>}
      <textarea value={ep.description} onChange={e=>setEp(n=>({...n,description:e.target.value}))} placeholder="What unfolds in this chronicle..." style={{...ytInput,width:"100%",minHeight:60,resize:"vertical",boxSizing:"border-box",marginBottom:10}}/>
      <input value={ep.thumbnailName||""} onChange={e=>setEp(n=>({...n,thumbnailName:e.target.value}))} placeholder="Vision for the face of this chapter..." style={{...ytInput,width:"100%",boxSizing:"border-box",marginBottom:10}}/>
      <input value={(ep.tags||[]).join(", ")} onChange={e=>setEp(n=>({...n,tags:e.target.value.split(",").map(t=>t.trim()).filter(Boolean)}))} placeholder="Tags: comma separated..." style={{...ytInput,width:"100%",boxSizing:"border-box",marginBottom:10}}/>
      <textarea value={ep.notes} onChange={e=>setEp(n=>({...n,notes:e.target.value}))} placeholder="Notes from the forge..." style={{...ytInput,width:"100%",minHeight:50,resize:"vertical",boxSizing:"border-box",marginBottom:14}}/>
      <div style={{display:"flex",gap:8}}><ActionBtn onClick={onSave} accent={accent}>Save</ActionBtn><ActionBtn onClick={onCancel}>Cancel</ActionBtn></div>
    </div>
  );
}
