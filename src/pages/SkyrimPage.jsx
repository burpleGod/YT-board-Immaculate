import { C, RUNES, SKYRIM_SUBTABS } from "../constants.js";
import { hexToRgb } from "../utils.js";

function SkyrimPage({ mounted, ts, setTab }) {
  const hasCustomBg = ts.bgImages?.length > 0 && ts.bgMode !== "none";
  const accent = ts.accentColor || C.gold;
  return (
    <div style={{ flex:1, position:"relative", overflow:"hidden", minHeight:"calc(100vh - 56px)" }}>
      {/* Mountains only if no custom bg */}
      {!hasCustomBg && <>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,#000 0%,#050810 25%,#0a1020 50%,#0d0a06 75%,#000 100%)" }} />
        {Array.from({length:70}).map((_,i) => (
          <div key={i} style={{ position:"absolute", left:`${(i*37+i*i*13)%100}%`, top:`${(i*29+i*7)%55}%`, width:i%5===0?2:1, height:i%5===0?2:1, borderRadius:"50%", background:i%7===0?C.frost:"#fff", animation:`starTwinkle ${2+(i%4)}s ease-in-out ${(i*0.3)%3}s infinite`, opacity:0.4+(i%3)*0.15 }} />
        ))}
        <svg viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice" style={{ position:"absolute", bottom:0, left:0, width:"100%", height:"75%" }}>
          <path d="M0,520 L0,280 L80,200 L160,240 L260,140 L360,210 L440,160 L520,220 L600,120 L680,190 L760,100 L840,180 L920,130 L1000,200 L1100,110 L1200,190 L1300,150 L1380,220 L1440,180 L1440,520 Z" fill="#060408"/>
          <path d="M0,520 L0,360 L100,270 L200,310 L320,200 L420,270 L500,220 L600,290 L700,180 L800,260 L900,200 L1000,280 L1100,210 L1200,290 L1300,230 L1380,300 L1440,260 L1440,520 Z" fill="#0a080c"/>
          <path d="M600,120 L620,140 L640,125 L660,145 L680,120 Z" fill="rgba(180,200,220,0.12)"/>
          <path d="M760,100 L780,125 L800,108 L820,130 L840,110 Z" fill="rgba(180,200,220,0.10)"/>
          <path d="M0,520 L0,420 L120,300 L240,370 L360,280 L460,350 L560,260 L660,340 L760,240 L860,330 L960,270 L1060,360 L1160,290 L1280,380 L1380,310 L1440,370 L1440,520 Z" fill="#07050a"/>
          <path d="M560,260 L580,285 L600,265 L620,288 L640,268 Z" fill="rgba(200,220,240,0.15)"/>
          <path d="M760,240 L782,268 L804,248 L826,272 L848,252 Z" fill="rgba(200,220,240,0.18)"/>
        </svg>
        <div style={{position:"absolute",bottom:0,left:"-10%",width:"120%",height:"38%",background:"radial-gradient(ellipse 80% 100% at 50% 100%,rgba(180,170,160,0.22) 0%,rgba(140,130,120,0.08) 60%,transparent 100%)",animation:"fogDrift1 22s ease-in-out infinite",filter:"blur(18px)",transformOrigin:"bottom center"}}/>
        <div style={{position:"absolute",bottom:"10%",left:"-15%",width:"130%",height:"30%",background:"radial-gradient(ellipse 90% 100% at 40% 100%,rgba(160,155,150,0.16) 0%,rgba(120,115,110,0.06) 55%,transparent 100%)",animation:"fogDrift2 30s ease-in-out infinite",filter:"blur(28px)",transformOrigin:"bottom center"}}/>
        <div style={{position:"absolute",bottom:"20%",left:"-5%",width:"110%",height:"25%",background:"radial-gradient(ellipse 70% 100% at 60% 100%,rgba(140,135,130,0.10) 0%,transparent 70%)",animation:"fogDrift3 38s ease-in-out infinite",filter:"blur(35px)",transformOrigin:"bottom center"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"18%",background:"linear-gradient(0deg,rgba(150,145,140,0.18) 0%,transparent 100%)",filter:"blur(8px)"}}/>
      </>}

      {/* Central content */}
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", paddingBottom:"8%" }}>
        <div style={{fontSize:12,letterSpacing:10,color:accent||C.goldDim,marginBottom:28,opacity:mounted?1:0,animation:mounted?"fadeUp 1s ease both":"none",userSelect:"none"}} className="rune-glow">{RUNES.slice(0,10).join(" ")}</div>

        <div style={{width:"min(500px,85%)",height:1,background:`linear-gradient(90deg,transparent,${accent||C.ember},transparent)`,marginBottom:28,opacity:mounted?1:0,animation:mounted?"fadeUp 1s ease 0.2s both":"none"}}/>

        <h1 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:"clamp(26px,5.5vw,68px)",margin:"0 0 8px",background:`linear-gradient(180deg,#fff 0%,${accent||C.gold} 45%,${C.ember} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:6,textAlign:"center",opacity:mounted?1:0,animation:mounted?"fadeUp 1s ease 0.4s both":"none"}}>HAROLD GRAYBLOOD</h1>

        <p style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(10px,1.8vw,15px)",letterSpacing:6,color:ts.fontColor||C.frost,margin:"0 0 28px",textTransform:"uppercase",opacity:mounted?1:0,animation:mounted?"fadeUp 1s ease 0.6s both":"none"}}>Gate to Sovngarde Edition</p>

        <div style={{width:"min(500px,85%)",height:1,background:`linear-gradient(90deg,transparent,${accent||C.ember},transparent)`,marginBottom:36,opacity:mounted?1:0,animation:mounted?"fadeUp 1s ease 0.7s both":"none"}}/>

        {/* Quick nav cards */}
        <div style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center",opacity:mounted?1:0,animation:mounted?"fadeUp 1s ease 0.9s both":"none"}}>
          {SKYRIM_SUBTABS.map(sub=>(
            <button
              key={sub.id}
              onClick={()=>setTab(sub.id)}
              style={{
                background:"rgba(0,0,0,0.55)",
                border:`1px solid ${C.goldDim}`,
                borderTop:`2px solid ${accent||C.gold}`,
                color:C.cream,
                padding:"18px 32px",
                cursor:"pointer",
                fontFamily:"'Cinzel',serif",
                fontSize:12,
                letterSpacing:3,
                textTransform:"uppercase",
                backdropFilter:"blur(8px)",
                transition:"all 0.22s",
                display:"flex", flexDirection:"column", alignItems:"center", gap:8,
                minWidth:140,
              }}
              onMouseEnter={e=>{
                e.currentTarget.style.background=`rgba(${hexToRgb(accent||C.gold)},0.12)`;
                e.currentTarget.style.borderColor=accent||C.gold;
                e.currentTarget.style.color=accent||C.gold;
                e.currentTarget.style.transform="translateY(-3px)";
                e.currentTarget.style.boxShadow=`0 8px 30px rgba(${hexToRgb(accent||C.gold)},0.2)`;
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.background="rgba(0,0,0,0.55)";
                e.currentTarget.style.borderColor=C.goldDim;
                e.currentTarget.style.color=C.cream;
                e.currentTarget.style.transform="translateY(0)";
                e.currentTarget.style.boxShadow="none";
              }}
            >
              <span style={{fontSize:24}}>{sub.icon}</span>
              {sub.label}
            </button>
          ))}
        </div>

        <p style={{fontFamily:"'Cinzel',serif",fontSize:11,color:C.ash,letterSpacing:3,marginTop:32,maxWidth:420,lineHeight:2.2,textAlign:"center",opacity:mounted?1:0,animation:mounted?"fadeUp 1s ease 1.1s both":"none"}}>"Not all who walk toward Sovngarde seek death.<br/>Some seek the road itself."</p>
      </div>
    </div>
  );
}

export { SkyrimPage };
