import { C } from "../constants.js";

export function EmptyState({ text }) {
  return <div style={{textAlign:"center",padding:"50px 20px",color:C.ashDim,fontSize:12,letterSpacing:4,textTransform:"uppercase"}}>{text}</div>;
}
