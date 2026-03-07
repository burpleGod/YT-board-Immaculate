import { C } from "../constants.js";

export function FieldLabel({ children, accent, style }) {
  return <div style={{fontSize:9,letterSpacing:3,color:accent||C.goldDim,textTransform:"uppercase",marginBottom:6,...style}}>{children}</div>;
}
