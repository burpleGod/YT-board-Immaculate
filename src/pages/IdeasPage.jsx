import { useState } from "react";
import { C } from "../constants.js";
import { accentBtnStyle, ghostBtnStyle, themedInput } from "../utils.js";
import { FilterBtn, ActionBtn } from "../atoms/Button.jsx";
import { EmptyState } from "../atoms/EmptyState.jsx";
import { PageHeader } from "../molecules/PageHeader.jsx";
import { FilterBar } from "../molecules/FilterBar.jsx";
import { CategoryManager } from "../molecules/CategoryManager.jsx";
import { IdeaCard } from "../organisms/IdeaCard.jsx";
import { PageShell } from "../templates/PageShell.jsx";
import { Box } from "../templates/Box.jsx";

function IdeasPage({ ideas, setIdeas, categories, setCategories, ts }) {
  const [filterCat, setFilterCat] = useState("All");
  const [newIdea, setNewIdea]     = useState(null);
  const [expandId, setExpandId]   = useState(null);
  const [newCatName, setNewCatName] = useState("");
  const [showCatMgr, setShowCatMgr] = useState(false);
  const accent = ts.accentColor || C.gold;
  const filtered = filterCat==="All" ? ideas : ideas.filter(i=>i.category===filterCat);

  const addIdea = () => { if(!newIdea?.title?.trim()) return; setIdeas(p=>[...p,{...newIdea,id:Date.now(),tags:newIdea.tags||[]}]); setNewIdea(null); };
  const removeIdea = (id,e) => { e.stopPropagation(); setIdeas(p=>p.filter(i=>i.id!==id)); };
  const addCategory = () => { const n=newCatName.trim(); if(!n||categories.includes(n)) return; setCategories(p=>[...p,n]); setNewCatName(""); };
  const removeCategory = (cat) => { setCategories(p=>p.filter(c=>c!==cat)); setIdeas(p=>p.map(i=>i.category===cat?{...i,category:"Uncategorised"}:i)); if(filterCat===cat) setFilterCat("All"); };

  return (
    <PageShell ts={ts}>
      <PageHeader title="Idea Board" rune="📜" accent={accent} />
      <FilterBar options={["All",...categories]} activeFilter={filterCat} onFilterChange={setFilterCat} accent={accent}>
        <button onClick={()=>setShowCatMgr(p=>!p)} style={{...ghostBtnStyle,fontSize:10,padding:"5px 12px"}}>⚙ ORDER BY</button>
        <button onClick={()=>setNewIdea({title:"",category:categories[0]||"",content:"",tags:[]})} style={{marginLeft:"auto",...accentBtnStyle(C.ember)}}>+ MARK THE LEDGER</button>
      </FilterBar>
      {showCatMgr && (
        <CategoryManager categories={categories} onRemove={removeCategory} inputValue={newCatName} onInputChange={setNewCatName} onAdd={addCategory} label="ORDER THE CODEX" placeholder="Name a new order..." ts={ts} accent={accent} style={{marginBottom:20}}/>
      )}
      {newIdea && (
        <Box ts={ts} style={{marginBottom:20}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <input value={newIdea.title} onChange={e=>setNewIdea(n=>({...n,title:e.target.value}))} placeholder="Title..." style={themedInput(ts)} />
            <select value={newIdea.category} onChange={e=>setNewIdea(n=>({...n,category:e.target.value}))} style={{...themedInput(ts),cursor:"pointer"}}>
              {categories.map(c=><option key={c} value={c} style={{background:"#111"}}>{c}</option>)}
            </select>
          </div>
          <textarea value={newIdea.content} onChange={e=>setNewIdea(n=>({...n,content:e.target.value}))} placeholder="Describe the idea..." style={{...themedInput(ts),width:"100%",minHeight:80,resize:"vertical",boxSizing:"border-box",marginBottom:12}} />
          <input value={(newIdea.tags||[]).join(", ")} onChange={e=>setNewIdea(n=>({...n,tags:e.target.value.split(",").map(t=>t.trim()).filter(Boolean)}))} placeholder="Tags: comma separated..." style={{...themedInput(ts),width:"100%",boxSizing:"border-box",marginBottom:12}} />
          <div style={{display:"flex",gap:8}}><ActionBtn onClick={addIdea} accent={accent}>Save</ActionBtn><ActionBtn onClick={()=>setNewIdea(null)}>Cancel</ActionBtn></div>
        </Box>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {filtered.map(idea=>(
          <IdeaCard key={idea.id} idea={idea} expandId={expandId} accent={accent} ts={ts} onExpand={()=>setExpandId(expandId===idea.id?null:idea.id)} onRemove={e=>{e.stopPropagation();removeIdea(idea.id,e);}} />
        ))}
      </div>
      {filtered.length===0 && <EmptyState text="The ledger sits empty. Every great chronicle begins with a single thought scratched into parchment." />}
    </PageShell>
  );
}

export { IdeasPage };
