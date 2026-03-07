import { C } from "../constants.js";
import { themedInput } from "../utils.js";
import { FieldLabel } from "../atoms/Label.jsx";
import { ActionBtn } from "../atoms/Button.jsx";

export function CategoryManager({ categories, onRemove, inputValue, onInputChange, onAdd, label, placeholder, ts, accent, style }) {
  return (
    <div style={{background:ts?.boxBg||"rgba(0,0,0,0.7)",border:`1px solid ${C.ashDim}`,padding:18,backdropFilter:"blur(6px)",...style}}>
      <FieldLabel accent={accent}>{label}</FieldLabel>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
        {categories.map(cat=>(
          <div key={cat} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.03)",border:`1px solid ${C.ashDim}`,padding:"4px 10px"}}>
            <span style={{fontSize:12,color:ts?.fontColor||C.cream}}>{cat}</span>
            <button onClick={()=>onRemove(cat)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:14,padding:0}}>×</button>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8}}>
        <input value={inputValue} onChange={e=>onInputChange(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onAdd()} placeholder={placeholder} style={themedInput(ts)} />
        <ActionBtn onClick={onAdd} accent={accent}>Add</ActionBtn>
      </div>
    </div>
  );
}
