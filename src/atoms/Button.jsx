import { C } from "../constants.js";
import { hexToRgb } from "../utils.js";

export function FilterBtn({ active, onClick, accent, children }) {
  return (
    <button onClick={onClick} style={{background:active?`rgba(${hexToRgb(accent||C.gold)},0.12)`:"rgba(0,0,0,0.4)",border:`1px solid ${active?(accent||C.gold):C.ashDim}`,color:active?(accent||C.gold):C.ash,padding:"5px 14px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,textTransform:"uppercase",transition:"all 0.2s",backdropFilter:"blur(4px)"}}>
      {children}
    </button>
  );
}

export function ActionBtn({ onClick, accent, children }) {
  return <button onClick={onClick} style={{background:accent?`rgba(${hexToRgb(accent)},0.12)`:"rgba(255,255,255,0.05)",border:`1px solid ${accent||C.ashDim}`,color:accent||C.ash,padding:"7px 20px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:2,transition:"all 0.2s"}}>{children}</button>;
}

export function ToggleBtn({ active, onClick, label, extraStyle }) {
  return <button onClick={onClick} style={{background:active?"rgba(212,168,67,0.18)":"transparent",border:`1px solid ${active?C.gold:C.ashDim}`,color:active?C.gold:C.ash,padding:"3px 10px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:12,transition:"all 0.15s",...extraStyle}}>{label}</button>;
}
