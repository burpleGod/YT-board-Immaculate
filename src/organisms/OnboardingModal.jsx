import { useState } from "react";
import { C } from "../constants.js";
import { FieldLabel } from "../atoms/Label.jsx";

export function OnboardingModal({ onComplete }) {
  const [name, setName]       = useState("");
  const [dataDir, setDataDir] = useState("");
  const [error, setError]     = useState("");
  const [busy, setBusy]       = useState(false);

  const submit = async () => {
    if (!name.trim()) { setError("A name is required to open the ledger."); return; }
    setBusy(true);
    try {
      await window.hgStorage.createProfile({ name: name.trim(), dataDir: dataDir.trim() || null });
      onComplete();
    } catch {
      setError("The ledger could not be opened. Try again.");
      setBusy(false);
    }
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${C.ashDim}`,
    color: C.cream,
    padding: "10px 12px",
    fontFamily: "'Cinzel', serif",
    fontSize: "0.9rem",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, background:C.black,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
      {/* Gold vignette */}
      <div style={{ position:"fixed", inset:0,
                    boxShadow:"inset 0 0 120px rgba(212,168,67,0.06)",
                    pointerEvents:"none" }} />

      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:480,
                    padding:"2.5rem", border:`1px solid ${C.ashDim}`,
                    background:"rgba(0,0,0,0.88)", backdropFilter:"blur(8px)" }}>

        {/* Title */}
        <div style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"1.1rem",
                      color:C.gold, letterSpacing:"0.15em", textAlign:"center",
                      marginBottom:"0.4rem" }}>
          THE CHRONICLE BEGINS
        </div>
        <div style={{ fontSize:"0.75rem", color:C.ash, textAlign:"center",
                      letterSpacing:"0.08em", marginBottom:"2rem" }}>
          Name the keeper. The ledger awaits.
        </div>

        {/* Creator name */}
        <div style={{ marginBottom:"1.2rem" }}>
          <FieldLabel accent={C.gold}>Creator Name</FieldLabel>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="e.g. Harold Grayblood"
            style={inputStyle}
            autoFocus
          />
        </div>

        {/* Data directory — advanced, collapsed by default */}
        <details style={{ marginBottom:"1.5rem" }}>
          <summary style={{ fontSize:"0.72rem", color:C.ash, letterSpacing:"0.1em",
                            cursor:"pointer", userSelect:"none" }}>
            ADVANCED — Data Directory
          </summary>
          <div style={{ marginTop:"0.75rem" }}>
            <FieldLabel>Custom Path (optional)</FieldLabel>
            <input
              type="text"
              value={dataDir}
              onChange={e => setDataDir(e.target.value)}
              placeholder="Leave blank to use the default location"
              style={{ ...inputStyle, fontSize:"0.78rem" }}
            />
            <div style={{ fontSize:"0.68rem", color:C.ash, marginTop:"0.4rem" }}>
              Default: %ProgramData%\HaroldGrayblood\{"{slug}"}
            </div>
          </div>
        </details>

        {/* Error */}
        {error && (
          <div style={{ fontSize:"0.75rem", color:"#c0392b", marginBottom:"1rem",
                        letterSpacing:"0.05em" }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={submit}
          disabled={busy}
          style={{ width:"100%", padding:"12px",
                   background:busy ? C.ashDim : C.gold,
                   color:C.black, border:"none",
                   fontFamily:"'Cinzel',serif", fontSize:"0.85rem",
                   letterSpacing:"0.2em",
                   cursor:busy ? "not-allowed" : "pointer" }}>
          {busy ? "OPENING…" : "OPEN THE LEDGER"}
        </button>
      </div>
    </div>
  );
}
