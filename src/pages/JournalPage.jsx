import { useState } from "react";
import { C } from "../constants.js";
import { accentBtnStyle, defaultFormat } from "../utils.js";
import { ActionBtn } from "../atoms/Button.jsx";
import { EmptyState } from "../atoms/EmptyState.jsx";
import { PageHeader } from "../molecules/PageHeader.jsx";
import { JournalEntryRow } from "../organisms/JournalEntryRow.jsx";
import { JournalEntryForm } from "../organisms/JournalEntryForm.jsx";
import { FullscreenJournal } from "../organisms/FullscreenJournal.jsx";
import { PageShell } from "../templates/PageShell.jsx";

function JournalPage({ journal, setJournal, ts }) {
  const [newEntry, setNewEntry]   = useState(null);
  const [expandId, setExpandId]   = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [fullscreen, setFullscreen] = useState(null);
  const accent = ts.accentColor || C.gold;
  const fsEntry = journal.find(e=>e.id===fullscreen);

  const saveNew = () => { if(!newEntry?.title?.trim()) return; setJournal(p=>[{...newEntry,id:Date.now(),format:newEntry.format||defaultFormat()},...p]); setNewEntry(null); };
  const saveEdit = () => { setJournal(p=>p.map(e=>e.id===editEntry.id?editEntry:e)); setExpandId(editEntry.id); setEditEntry(null); };
  const removeEntry = (id,e) => { e.stopPropagation(); setJournal(p=>p.filter(e=>e.id!==id)); if(expandId===id) setExpandId(null); };

  if (fsEntry) return <FullscreenJournal entry={fsEntry} onClose={()=>setFullscreen(null)} accent={accent} />;

  return (
    <PageShell ts={ts}>
      <PageHeader title="The Journal of Harold Grayblood" rune="✒" accent={accent} />
      <div style={{marginBottom:20,display:"flex",justifyContent:"flex-end"}}>
        <button onClick={()=>setNewEntry({date:"",title:"",body:"",format:defaultFormat()})} style={accentBtnStyle(C.ember)}>+ NEW ENTRY</button>
      </div>
      {newEntry && <JournalEntryForm entry={newEntry} setEntry={setNewEntry} onSave={saveNew} onCancel={()=>setNewEntry(null)} label="New Entry" ts={ts} accent={accent} />}
      {editEntry && <JournalEntryForm entry={editEntry} setEntry={setEditEntry} onSave={saveEdit} onCancel={()=>setEditEntry(null)} label="Editing Entry" ts={ts} accent={accent} />}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {journal.map(entry=>{
          const isExp=expandId===entry.id, isEdit=editEntry?.id===entry.id;
          if(isEdit) return null;
          return (
            <JournalEntryRow key={entry.id} entry={entry} isExp={isExp} accent={accent} ts={ts} onExpand={()=>setExpandId(isExp?null:entry.id)} onEdit={()=>{setEditEntry(entry);setExpandId(null);}} onFullscreen={()=>setFullscreen(entry.id)} onRemove={e=>removeEntry(entry.id,e)} />
          );
        })}
      </div>
      {journal.length===0&&!newEntry&&<EmptyState text="The pages are bare. The road behind you is long — it deserves to be remembered." />}
    </PageShell>
  );
}

export { JournalPage };
