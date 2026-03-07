import { FilterBtn } from "../atoms/Button.jsx";

export function FilterBar({ options, activeFilter, onFilterChange, accent, children, style }) {
  return (
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20,alignItems:"center",...style}}>
      {options.map(opt=>(
        <FilterBtn key={opt} active={activeFilter===opt} onClick={()=>onFilterChange(opt)} accent={accent}>{opt}</FilterBtn>
      ))}
      {children}
    </div>
  );
}
