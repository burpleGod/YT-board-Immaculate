import { useState, useRef } from "react";
import { C } from "../constants.js";
import { accentBtnStyle, ghostBtnStyle } from "../utils.js";
import { EmptyState } from "../atoms/EmptyState.jsx";
import { PageHeader } from "../molecules/PageHeader.jsx";
import { FilterBar } from "../molecules/FilterBar.jsx";
import { CategoryManager } from "../molecules/CategoryManager.jsx";
import { GalleryCard } from "../organisms/GalleryCard.jsx";
import { PageShell } from "../templates/PageShell.jsx";

function GalleryPage({ gallery, setGallery, ts, galleryCategories, setGalleryCategories }) {
  const fileRef  = useRef();
  const [lightbox, setLightbox] = useState(null);
  const [filterCat, setFilterCat] = useState("All");
  const [showCatMgr, setShowCatMgr] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const accent = ts.accentColor || C.gold;

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (window.hgStorage?.saveImage) {
        const id = Date.now() + Math.random();
        const reader = new FileReader();
        reader.onload = async (ev) => {
          await window.hgStorage.saveImage(id, ev.target.result, file.type, file.name);
          setGallery(p => [...p, { id, src: `hgdata://images/${id}`, name: file.name, caption: "", tag: "", category: "Uncategorized" }]);
        };
        reader.readAsArrayBuffer(file);
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => setGallery(p => [...p, { id: Date.now() + Math.random(), src: ev.target.result, name: file.name, caption: "", tag: "", category: "Uncategorized" }]);
        reader.readAsDataURL(file);
      }
    });
    e.target.value = "";
  };

  const updateGalleryItem = (id,key,val) => setGallery(p=>p.map(g=>g.id===id?{...g,[key]:val}:g));
  const removeGalleryItem = (id) => {
    const img = gallery.find(g => g.id === id);
    if (img?.src?.startsWith("hgdata://")) window.hgStorage?.deleteImage?.(id);
    setGallery(p=>p.filter(g=>g.id!==id));
    if(lightbox?.id===id) setLightbox(null);
  };
  const addCategory = () => { const n=newCatName.trim(); if(!n||galleryCategories.includes(n)) return; setGalleryCategories(p=>[...p,n]); setNewCatName(""); };
  const removeCategory = (cat) => { setGalleryCategories(p=>p.filter(c=>c!==cat)); setGallery(p=>p.map(g=>g.category===cat?{...g,category:"Uncategorized"}:g)); if(filterCat===cat) setFilterCat("All"); };

  const filtered = filterCat==="All" ? gallery : gallery.filter(g=>(g.category||"Uncategorized")===filterCat);

  return (
    <PageShell ts={ts}>
      <PageHeader title="Gallery" rune="🖼" accent={accent} />
      <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handleUpload}/>
        <button onClick={()=>fileRef.current.click()} style={accentBtnStyle(accent)}>+ ADD TO THE GALLERY</button>
        <span style={{fontSize:12,color:C.ash,fontFamily:"'Crimson Text',Georgia,serif"}}>{gallery.length} relic{gallery.length!==1?"s":""} preserved</span>
      </div>

      <FilterBar options={["All","Uncategorized",...galleryCategories]} activeFilter={filterCat} onFilterChange={setFilterCat} accent={accent} style={{marginBottom:16}}>
        <button onClick={()=>setShowCatMgr(p=>!p)} style={{...ghostBtnStyle,fontSize:10,padding:"5px 12px"}}>⚙ MANAGE COLLECTIONS</button>
      </FilterBar>

      {showCatMgr && (
        <CategoryManager categories={galleryCategories} onRemove={removeCategory} inputValue={newCatName} onInputChange={setNewCatName} onAdd={addCategory} label="Manage Collections" placeholder="New collection name..." ts={ts} accent={accent} style={{marginBottom:20}}/>
      )}

      {filtered.length===0 && <EmptyState text="The gallery stands bare as a looted barrow. The world of Skyrim is worth remembering in image."/>}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
        {filtered.map(img=>(
          <GalleryCard key={img.id} img={img} ts={ts} galleryCategories={galleryCategories} onOpenLightbox={setLightbox} onUpdate={updateGalleryItem} onRemove={removeGalleryItem} />
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}} onClick={()=>setLightbox(null)}>
          <img src={lightbox.src} alt={lightbox.name} style={{maxWidth:"90vw",maxHeight:"80vh",objectFit:"contain",border:`1px solid ${C.goldDim}`}}/>
          {lightbox.caption && <div style={{marginTop:16,color:C.cream,fontFamily:"'Crimson Text',Georgia,serif",fontSize:16,letterSpacing:1}}>{lightbox.caption}</div>}
          <div style={{marginTop:10,color:C.ash,fontSize:11,letterSpacing:2}}>CLICK TO CLOSE</div>
        </div>
      )}
    </PageShell>
  );
}

export { GalleryPage };
