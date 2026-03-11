import { C } from "../constants.js";

function Box({ ts, children, style }) {
  return (
    <div style={{ background:ts?.boxBg||"rgba(0,0,0,0.7)", border:`1px solid ${C.ashDim}`, padding:18, backdropFilter:"blur(6px)", ...style }}>
      {children}
    </div>
  );
}

export { Box };
