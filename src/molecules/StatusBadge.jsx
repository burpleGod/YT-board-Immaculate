import { STATUS_COLORS } from "../constants.js";

export function StatusBadge({ status, label, style, onClick }) {
  const sc = STATUS_COLORS[status] || STATUS_COLORS.planned;
  return (
    <div onClick={onClick} style={{background:sc.bg,border:`1px solid ${sc.border}`,color:sc.text,fontFamily:"'Crimson Text',Georgia,serif",...style}}>
      {label}
    </div>
  );
}
