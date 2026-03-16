import { C } from "../constants.js";
import { themedInput } from "../utils.js";

export function GalleryCard({ img, ts, galleryCategories, onOpenLightbox, onUpdate, onRemove }) {
  return (
    <div style={{background:ts.boxBg||"rgba(0,0,0,0.6)",border:`1px solid ${C.ashDim}`,overflow:"hidden",backdropFilter:"blur(4px)"}}>
      <div style={{position:"relative",cursor:"pointer"}} onClick={()=>onOpenLightbox(img)}>
        <img src={img.src} alt={img.name} style={{width:"100%",height:150,objectFit:"cover",display:"block"}}/>
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0)",transition:"background 0.2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.3)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0)"}/>
      </div>
      <div style={{padding:"10px 12px"}}>
        <input value={img.caption||""} onChange={e=>onUpdate(img.id,"caption",e.target.value)} placeholder="Add caption..." style={{...themedInput(ts),fontSize:12,marginBottom:8,width:"100%",boxSizing:"border-box"}}/>
        <select value={img.category||"Uncategorized"} onChange={e=>onUpdate(img.id,"category",e.target.value)} style={{...themedInput(ts),fontSize:11,marginBottom:6,cursor:"pointer",width:"100%",boxSizing:"border-box"}}>
          <option value="Uncategorized" style={{background:"#111"}}>Uncategorized</option>
          {galleryCategories.map(c=><option key={c} value={c} style={{background:"#111"}}>{c}</option>)}
        </select>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <input value={img.tag||""} onChange={e=>onUpdate(img.id,"tag",e.target.value)} placeholder="Tag..." style={{...themedInput(ts),fontSize:11,width:"60%"}}/>
          <button onClick={()=>onRemove(img.id)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:18}}>×</button>
        </div>
      </div>
    </div>
  );
}
