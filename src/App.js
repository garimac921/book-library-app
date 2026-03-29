import { useState, useEffect, useRef } from "react";

const GENRES = [
  "Fiction","Non-Fiction","Fantasy","High Fantasy","Dark Fantasy","Romantasy",
  "Sci-Fi","Mystery","Thriller","Horror","Gothic Horror","Dark Gothic Romance",
  "Romance","Historical Romance","Contemporary Romance","Biography","Memoir",
  "History","Self-Help","Philosophy","Poetry","Graphic Novel","Young Adult",
  "Middle Grade","True Crime","Spirituality","Action","Dystopian","Royalty","Favorite","Other"
];
const STATUSES = ["Want to Read","Currently Reading","Finished"];
const FONTS = [
  {label:"System UI",value:"'Segoe UI',sans-serif"},
  {label:"Serif",value:"Georgia,serif"},
  {label:"Mono",value:"'Courier New',monospace"},
  {label:"Arial",value:"'Arial',sans-serif"},
  {label:"Trebuchet",value:"'Trebuchet MS',sans-serif"},
];
const DEFAULTS = {
  bgColor:"#ffffff", surfaceColor:"#f7f7f5", borderColor:"#e5e5e3",
  accentColor:"#2383e2", textColor:"#1a1a1a", mutedColor:"#9b9a97",
  statFinishedColor:"#0f7b6c", statReadingColor:"#d9730d", statTotalColor:"#6940a5",
  fontFamily:"'Segoe UI',sans-serif"
};

// Default icon sets per genre (SVG path data)
const GENRE_ICON_OPTIONS = [
  {id:"book",    label:"Book",    path:"M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"},
  {id:"star",    label:"Star",    path:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"},
  {id:"sword",   label:"Sword",   path:"M14.5 17.5L3 6V3h3l11.5 11.5M14.5 17.5l2 2.5-1 1-2.5-2M14.5 17.5L16 16M7 7L5.5 5.5M18 13l1.5 1.5"},
  {id:"moon",    label:"Moon",    path:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"},
  {id:"heart",   label:"Heart",   path:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"},
  {id:"brain",   label:"Brain",   path:"M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.98-3 2.5 2.5 0 0 1-1.32-4.24 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.96-3.1A2.5 2.5 0 0 1 9.5 2M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0 1.32-4.24 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.96-3.1A2.5 2.5 0 0 0 14.5 2z"},
  {id:"fire",    label:"Fire",    path:"M8.5 14.5s-1.5-2 0-4c.7-1 2.5-2 2.5-4C14 8 16 11 13 14c1 0 2.5-.5 2.5-2 .5 1 1.5 3 0 5-1 1.5-3 2-4.5 2s-3.5-1-3.5-3c0-1 .5-2 1-1.5z"},
  {id:"ghost",   label:"Ghost",   path:"M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"},
  {id:"crown",   label:"Crown",   path:"M3 20h18M5 20V10l7-7 7 7v10"},
  {id:"compass", label:"Compass", path:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0 0l4.95-4.95M12 22l-4.95-4.95M12 2l4.95 4.95M12 2L7.05 6.95M16.95 7.05l-9.9 9.9"},
  {id:"flask",   label:"Flask",   path:"M6 2v6l-4 10a2 2 0 0 0 1.87 2.71h12.26A2 2 0 0 0 18 18L14 8V2M6 2h12M9 2v3"},
  {id:"music",   label:"Music",   path:"M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"},
];

const DEFAULT_GENRE_ICONS = {
  "Fiction":"book","Non-Fiction":"brain","Fantasy":"moon","High Fantasy":"crown",
  "Dark Fantasy":"ghost","Romantasy":"heart","Sci-Fi":"flask","Mystery":"compass",
  "Thriller":"fire","Horror":"ghost","Gothic Horror":"moon","Dark Gothic Romance":"heart",
  "Romance":"heart","Historical Romance":"crown","Contemporary Romance":"heart",
  "Biography":"book","Memoir":"book","History":"crown","Self-Help":"brain",
  "Philosophy":"brain","Poetry":"music","Graphic Novel":"star","Young Adult":"star",
  "Middle Grade":"star","True Crime":"fire","Spirituality":"moon","Action":"sword",
  "Dystopian":"fire","Royalty":"crown","Favorite":"star","Other":"book"
};
const DEFAULT_GENRE_COLORS = {
  "Fiction":"#6366f1","Non-Fiction":"#0ea5e9","Fantasy":"#8b5cf6","High Fantasy":"#7c3aed",
  "Dark Fantasy":"#4c1d95","Romantasy":"#ec4899","Sci-Fi":"#06b6d4","Mystery":"#64748b",
  "Thriller":"#dc2626","Horror":"#7f1d1d","Gothic Horror":"#3b0764","Dark Gothic Romance":"#be185d",
  "Romance":"#f43f5e","Historical Romance":"#b45309","Contemporary Romance":"#f97316",
  "Biography":"#0369a1","Memoir":"#0891b2","History":"#92400e","Self-Help":"#15803d",
  "Philosophy":"#1d4ed8","Poetry":"#9333ea","Graphic Novel":"#ea580c","Young Adult":"#d97706",
  "Middle Grade":"#16a34a","True Crime":"#b91c1c","Spirituality":"#7c3aed","Action":"#dc2626",
  "Dystopian":"#78350f","Royalty":"#d97706","Favorite":"#f59e0b","Other":"#6b7280"
};

const GenreIcon = ({genre, iconMap, colorMap, size=12}) => {
  const iconId = iconMap[genre] || DEFAULT_GENRE_ICONS[genre] || "book";
  const color  = colorMap[genre] || DEFAULT_GENRE_COLORS[genre] || "#6b7280";
  const opt = GENRE_ICON_OPTIONS.find(o=>o.id===iconId) || GENRE_ICON_OPTIONS[0];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
      <path d={opt.path}/>
    </svg>
  );
};

const SvgIcon = ({path, size=16, color="currentColor", strokeWidth=2}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <path d={path}/>
  </svg>
);

const ICONS = {
  book:     "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z",
  bookmark: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
  sparkle:  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  chart:    "M18 20V10M12 20V4M6 20v-6M2 20h20",
  shelves:  "M2 3h20v4H2zM2 10h20v4H2zM2 17h20v4H2z",
  plus:     "M12 5v14M5 12h14",
  back:     "M19 12H5M12 19l-7-7 7-7",
  edit:     "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:    "M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6",
  check:    "M20 6L9 17l-5-5",
  user:     "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

async function callClaude(prompt, system) {
  const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system,messages:[{role:"user",content:prompt}]})});
  const d = await r.json();
  return d.content?.[0]?.text||"";
}
async function searchOLFull(title) {
  try {
    const r = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1&fields=title,author_name,cover_i,number_of_pages_median`);
    const d = await r.json(); const b=d.docs?.[0];
    if(!b) return null;
    return {author:b.author_name?.[0]||"",cover_url:b.cover_i?`https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg`:"",pages:b.number_of_pages_median||""};
  } catch{return null;}
}

const BKEY="blib_books_v4", TKEY="blib_theme_v3", UKEY="blib_user_v2", GKEY="blib_genres_v1";
const loadArr=(k)=>{try{return JSON.parse(localStorage.getItem(k)||"[]")}catch{return[];}};
const loadObj=(k,def)=>{try{return{...def,...JSON.parse(localStorage.getItem(k)||"{}")}}catch{return def;}};
const sv=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

const StarRating=({value,onChange,accent="#f59e0b"})=>(
  <div style={{display:"flex",gap:"2px"}}>
    {[1,2,3,4,5].map(s=>(
      <button key={s} onClick={()=>onChange(s)} style={{background:"none",border:"none",cursor:"pointer",fontSize:"1.3rem",color:s<=value?accent:"#d1d5db",padding:0,lineHeight:1}}>★</button>
    ))}
  </div>
);

const emptyForm={title:"",author:"",genres:[],status:"Currently Reading",rating:0,notes:"",date_read:"",cover_url:"",pages:""};
const SPINES=["#e11d48","#7c3aed","#2563eb","#059669","#d97706","#0891b2","#9333ea","#b45309"];

export default function App() {
  const [books,setBooks]=useState([]);
  const [theme,setTheme]=useState(DEFAULTS);
  const [user,setUser]=useState({name:""});
  const [genreIcons,setGenreIcons]=useState({});
  const [genreColors,setGenreColors]=useState({});
  const [view,setView]=useState("bookshelf");
  const [form,setForm]=useState(emptyForm);
  const [selected,setSelected]=useState(null);
  const [fSearch,setFSearch]=useState("");
  const [fGenre,setFGenre]=useState("All");
  const [aiLoading,setAiLoading]=useState(false);
  const [fillStep,setFillStep]=useState("");
  const [aiResult,setAiResult]=useState("");
  const [mood,setMood]=useState("");
  const [toast,setToast]=useState({msg:"",type:"success"});
  const [editMode,setEditMode]=useState(false);
  const [olResults,setOlResults]=useState([]);
  const [olSearching,setOlSearching]=useState(false);
  const [manualCover,setManualCover]=useState(false);
  const [addingTo,setAddingTo]=useState("bookshelf");
  const [showOnboard,setShowOnboard]=useState(false);
  const [onboardName,setOnboardName]=useState("");
  const debRef=useRef(null);

  useEffect(()=>{
    setBooks(loadArr(BKEY));
    setTheme(loadObj(TKEY,DEFAULTS));
    const u=loadObj(UKEY,{name:""});
    setUser(u); if(!u.name) setShowOnboard(true);
    setGenreIcons(loadObj(GKEY+"_icons",{}));
    setGenreColors(loadObj(GKEY+"_colors",{}));
  },[]);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast({msg:"",type:"success"}),3000);};
  const updBooks=b=>{setBooks(b);sv(BKEY,b);};
  const updTheme=t=>{setTheme(t);sv(TKEY,t);};
  const updUser=u=>{setUser(u);sv(UKEY,u);};
  const updGenreIcons=m=>{setGenreIcons(m);sv(GKEY+"_icons",m);};
  const updGenreColors=m=>{setGenreColors(m);sv(GKEY+"_colors",m);};
  const T=theme;
  const iconMap={...DEFAULT_GENRE_ICONS,...genreIcons};
  const colorMap={...DEFAULT_GENRE_COLORS,...genreColors};

  const css={
    app:{fontFamily:T.fontFamily,minHeight:"100vh",background:T.bgColor,color:T.textColor},
    hdr:{background:T.bgColor,padding:"0 1.5rem",height:"52px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.borderColor}`,position:"sticky",top:0,zIndex:10},
    logo:{fontSize:"1rem",fontWeight:700,color:T.textColor,letterSpacing:"-0.3px"},
    tab:(a)=>({display:"flex",alignItems:"center",gap:"5px",padding:"0.35rem 0.75rem",borderRadius:"6px",border:"none",cursor:"pointer",fontWeight:500,fontSize:"0.8rem",background:a?T.borderColor:"transparent",color:a?T.textColor:T.mutedColor,transition:"all 0.12s"}),
    main:{padding:"1.5rem",maxWidth:"1080px",margin:"0 auto"},
    card:{background:T.surfaceColor,borderRadius:"8px",border:`1px solid ${T.borderColor}`,overflow:"hidden"},
    grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:"12px"},
    inp:(extra={})=>({width:"100%",padding:"0.5rem 0.75rem",borderRadius:"6px",border:`1px solid ${T.borderColor}`,background:T.bgColor,color:T.textColor,fontSize:"0.875rem",boxSizing:"border-box",outline:"none",...extra}),
    sel:{width:"100%",padding:"0.5rem 0.75rem",borderRadius:"6px",border:`1px solid ${T.borderColor}`,background:T.bgColor,color:T.textColor,fontSize:"0.875rem"},
    lbl:{fontSize:"0.72rem",color:T.mutedColor,marginBottom:"0.3rem",display:"block",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"},
    btn:(bg,fg="#fff",extra={})=>({display:"inline-flex",alignItems:"center",gap:"5px",padding:"0.45rem 0.9rem",borderRadius:"6px",border:"none",cursor:"pointer",fontWeight:500,fontSize:"0.82rem",background:bg||T.accentColor,color:fg,...extra}),
    tag:(genre)=>{const c=colorMap[genre]||"#6b7280";return{display:"inline-flex",alignItems:"center",gap:"4px",padding:"0.2rem 0.6rem",borderRadius:"4px",fontSize:"0.72rem",fontWeight:500,background:c+"18",color:c,border:`1px solid ${c}28`};},
    toast:(tp)=>({position:"fixed",bottom:"1.5rem",right:"1.5rem",background:tp==="error"?"#ef4444":"#10b981",color:"#fff",padding:"0.6rem 1.1rem",borderRadius:"8px",fontWeight:600,zIndex:999}),
    aiBox:{background:T.bgColor,borderRadius:"8px",padding:"1.1rem",marginTop:"1rem",border:`1px solid ${T.borderColor}`,lineHeight:1.75,whiteSpace:"pre-wrap",fontSize:"0.875rem"},
    divider:{height:"1px",background:T.borderColor,margin:"1.25rem 0"},
  };

  const searchOL=async(q)=>{
    if(!q.trim()||q.length<2){setOlResults([]);return;}
    setOlSearching(true);
    try{
      const r=await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(q)}&limit=6&fields=title,author_name,cover_i,number_of_pages_median`);
      const d=await r.json();
      const mapped=(d.docs||[]).map(b=>({title:b.title,author:b.author_name?.[0]||"Unknown",pages:b.number_of_pages_median||"",cover_url:b.cover_i?`https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`:"",cover_url_large:b.cover_i?`https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg`:""}));
      setOlResults(mapped);
    }catch{setOlResults([]);}
    setOlSearching(false);
  };

  const autoFill=async()=>{
    if(!form.title.trim()) return showToast("Enter a title first!","error");
    setAiLoading(true);setFillStep("Searching...");
    try{
      const [olData,aiRes]=await Promise.all([
        searchOLFull(form.title),
        callClaude(`Book: "${form.title}"${form.author?`, by "${form.author}"`:""}`,
          `Return ONLY raw JSON: genre (one of: ${GENRES.join(",")}), notes (2-sentence summary), pages (integer). No markdown.`)
      ]);
      if(olData){setForm(f=>({...f,...olData,title:form.title}));setFillStep("Cover found! Getting details...");}
      const aiData=JSON.parse(aiRes.replace(/```json|```/g,"").trim());
      setForm(f=>({...f,...(olData||{}),...aiData,genres:aiData.genre?[aiData.genre]:f.genres,title:form.title}));
      showToast("Details filled in!");
    }catch{showToast("Couldn't auto-fill everything.","error");}
    setAiLoading(false);setFillStep("");
  };

  const saveBook=()=>{
    if(!form.title.trim()) return showToast("Title is required!","error");
    if(editMode&&selected){
      updBooks(books.map(b=>b.id===selected.id?{...b,...form}:b));
      setSelected({...selected,...form});
      showToast("Updated!"); setView("detail"); setEditMode(false); setForm(emptyForm);
    } else {
      updBooks([{...form,id:Date.now().toString(),created_at:new Date().toISOString(),spineColor:SPINES[Math.floor(Math.random()*SPINES.length)]},...books]);
      showToast("Book added!"); setForm(emptyForm); setView(addingTo);
    }
  };

  const markFinished=async(book)=>{
    const today=new Date().toISOString().split("T")[0];
    updBooks(books.map(b=>b.id===book.id?{...b,status:"Finished",date_read:b.date_read||today}:b));
    showToast(`"${book.title}" marked as finished!`);
  };

  const deleteBook=id=>{
    if(!window.confirm("Delete this book?")) return;
    updBooks(books.filter(b=>b.id!==id));
    showToast("Deleted."); setView("bookshelf");
  };

  const toggleGenre=g=>setForm(f=>({...f,genres:f.genres.includes(g)?f.genres.filter(x=>x!==g):[...f.genres,g]}));

  const finished=books.filter(b=>b.status==="Finished");
  const reading=books.filter(b=>b.status==="Currently Reading");
  const nextUp=books.filter(b=>b.status==="Want to Read");
  const totalPages=finished.reduce((a,b)=>a+(parseInt(b.pages)||0),0);
  const avgRating=finished.filter(b=>b.rating>0).length?(finished.filter(b=>b.rating>0).reduce((a,b)=>a+b.rating,0)/finished.filter(b=>b.rating>0).length).toFixed(1):"—";
  const genreCounts={};
  books.forEach(b=>(b.genres||[]).forEach(g=>{genreCounts[g]=(genreCounts[g]||0)+1;}));
  const topGenres=Object.entries(genreCounts).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const now=new Date();
  const thisMonth=finished.filter(b=>b.date_read&&new Date(b.date_read).getMonth()===now.getMonth()&&new Date(b.date_read).getFullYear()===now.getFullYear()).length;

  const applyFilters=list=>list.filter(b=>{
    if(fGenre!=="All"&&!(b.genres||[]).includes(fGenre)) return false;
    if(fSearch&&!b.title.toLowerCase().includes(fSearch.toLowerCase())&&!b.author?.toLowerCase().includes(fSearch.toLowerCase())) return false;
    return true;
  });

  const NavTabs=()=>(
    <div style={{display:"flex",gap:"2px",alignItems:"center"}}>
      {[["bookshelf","book","Bookshelf"],["nextup","bookmark","Next-Up"],["finished","shelves","Finished"],["stats","chart","Stats"],["ai","sparkle","AI"],["settings","settings","Settings"]].map(([v,ic,l])=>(
        <button key={v} style={css.tab(view===v)} onClick={()=>{setView(v);setAiResult("");}}>
          <SvgIcon path={ICONS[ic]} size={13} color={view===v?T.textColor:T.mutedColor}/>
          {l}
        </button>
      ))}
      <button style={{...css.btn(T.accentColor,"#fff",{marginLeft:"6px",padding:"0.38rem 0.8rem",fontSize:"0.8rem"})}} onClick={()=>{setForm({...emptyForm,status:["nextup"].includes(view)?"Want to Read":"Currently Reading"});setAddingTo(view==="nextup"?"nextup":"bookshelf");setEditMode(false);setOlResults([]);setManualCover(false);setView("add");}}>
        <SvgIcon path={ICONS.plus} size={13} color="#fff"/>Add
      </button>
    </div>
  );

  const Hdr=({backTo,backLabel})=>(
    <div style={css.hdr}>
      <span style={css.logo}>{user.name?`${user.name}'s Library`:"My Library"}</span>
      {backTo?<button style={css.btn(T.borderColor,T.textColor)} onClick={()=>{setView(backTo);setAiResult("");}}><SvgIcon path={ICONS.back} size={13} color={T.textColor}/>{backLabel||"Back"}</button>:<NavTabs/>}
    </div>
  );

  // Notion-style book card
  const BookCard=({book})=>{
    const isReading=book.status==="Currently Reading";
    return (
      <div style={{...css.card,cursor:"pointer",transition:"box-shadow 0.15s"}}
        onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 2px 12px ${T.borderColor}`;}}
        onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";}}>
        <div onClick={()=>{setSelected(book);setAiResult("");setView("detail");}}>
          <div style={{width:"100%",paddingTop:"148%",position:"relative",overflow:"hidden",background:book.spineColor||T.borderColor}}>
            {book.cover_url&&<img src={book.cover_url} alt="cover" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",display:"block"}} onError={e=>e.target.style.display="none"}/>}
            {!book.cover_url&&<div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}><SvgIcon path={ICONS.book} size={36} color="rgba(255,255,255,0.5)"/></div>}
          </div>
          <div style={{padding:"10px 10px 6px"}}>
            <div style={{fontWeight:600,fontSize:"0.875rem",lineHeight:1.3,marginBottom:"3px",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{book.title}</div>
            {book.author&&<div style={{color:T.mutedColor,fontSize:"0.75rem",marginBottom:"6px"}}>{book.author}</div>}
            <div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"6px"}}>
              {(book.genres||[]).map(g=>(
                <span key={g} style={css.tag(g)}><GenreIcon genre={g} iconMap={iconMap} colorMap={colorMap} size={10}/>{g}</span>
              ))}
            </div>
            {book.rating>0&&<div style={{color:"#f59e0b",fontSize:"0.8rem",letterSpacing:"1px"}}>{"★".repeat(book.rating)}{"☆".repeat(5-book.rating)}</div>}
          </div>
        </div>
        {isReading&&(
          <div style={{padding:"0 10px 10px"}}>
            <button style={{...css.btn("#ecfdf5","#065f46",{width:"100%",justifyContent:"center",fontSize:"0.75rem",padding:"0.35rem 0",borderRadius:"5px",border:"1px solid #a7f3d0"})}} onClick={e=>{e.stopPropagation();markFinished(book);}}>
              <SvgIcon path={ICONS.check} size={12} color="#065f46"/>Mark as Finished
            </button>
          </div>
        )}
      </div>
    );
  };

  // ── ONBOARD ──
  if(showOnboard) return(
    <div style={{...css.app,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <div style={{...css.card,maxWidth:"400px",width:"90%",padding:"2.5rem",textAlign:"center"}}>
        <SvgIcon path={ICONS.book} size={40} color={T.accentColor}/>
        <h2 style={{margin:"1rem 0 0.4rem",fontWeight:700,fontSize:"1.4rem"}}>Welcome to your Library</h2>
        <p style={{color:T.mutedColor,marginBottom:"1.5rem",fontSize:"0.9rem"}}>What should we call you?</p>
        <input style={{...css.inp(),textAlign:"center",fontSize:"1rem",marginBottom:"1rem"}} placeholder="Your name..." value={onboardName} onChange={e=>setOnboardName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&onboardName.trim()){updUser({name:onboardName.trim()});setShowOnboard(false);}}} autoFocus/>
        <button style={{...css.btn(T.accentColor,"#fff",{width:"100%",justifyContent:"center",padding:"0.65rem"})}} onClick={()=>{if(onboardName.trim()){updUser({name:onboardName.trim()});setShowOnboard(false);}}}>Enter my Library</button>
      </div>
    </div>
  );

  // ── ADD/EDIT ──
  if(view==="add"||(view==="detail"&&editMode)) return(
    <div style={css.app}>
      {toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
      <Hdr backTo={editMode?"detail":addingTo} backLabel="Back"/>
      <div style={css.main}>
        <h2 style={{fontWeight:700,marginBottom:"1.25rem",fontSize:"1.1rem"}}>{editMode?"Edit Book":`Add to ${addingTo==="nextup"?"Next-Up":"Bookshelf"}`}</h2>
        <div style={{...css.card,padding:"1.5rem"}}>
          <div style={{marginBottom:"1rem"}}>
            <label style={css.lbl}>Book Title</label>
            <div style={{display:"flex",gap:"0.5rem",position:"relative"}}>
              <div style={{flex:1,position:"relative"}}>
                <input style={css.inp()} placeholder="Search for a book..." value={form.title}
                  onChange={e=>{setForm(f=>({...f,title:e.target.value}));clearTimeout(debRef.current);debRef.current=setTimeout(()=>searchOL(e.target.value),300);}}/>
                {(olResults.length>0||olSearching)&&(
                  <div style={{position:"absolute",top:"100%",left:0,right:0,background:T.bgColor,border:`1px solid ${T.borderColor}`,borderRadius:"8px",zIndex:50,maxHeight:"260px",overflowY:"auto",marginTop:"4px",boxShadow:"0 8px 24px rgba(0,0,0,0.12)"}}>
                    {olSearching&&<div style={{padding:"0.75rem",color:T.mutedColor,fontSize:"0.82rem"}}>Searching...</div>}
                    {olResults.map((b,i)=>(
                      <div key={i} onClick={()=>{setForm(f=>({...f,title:b.title,author:b.author,cover_url:b.cover_url_large,pages:String(b.pages||"")}));setOlResults([]);}}
                        style={{display:"flex",gap:"0.75rem",padding:"0.55rem 0.75rem",cursor:"pointer",borderBottom:`1px solid ${T.borderColor}`,alignItems:"center"}}
                        onMouseEnter={e=>e.currentTarget.style.background=T.surfaceColor}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        {b.cover_url?<img src={b.cover_url} style={{width:"30px",height:"42px",objectFit:"cover",borderRadius:"3px",flexShrink:0}} alt=""/>:<div style={{width:"30px",height:"42px",background:T.borderColor,borderRadius:"3px",flexShrink:0}}/>}
                        <div><div style={{fontWeight:600,fontSize:"0.83rem"}}>{b.title}</div><div style={{color:T.mutedColor,fontSize:"0.74rem"}}>{b.author}{b.pages?` · ${b.pages}pp`:""}</div></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button style={css.btn()} onClick={autoFill} disabled={aiLoading}>
                <SvgIcon path={ICONS.sparkle} size={13} color="#fff"/>
                {aiLoading?(fillStep||"Filling..."):"Auto-fill"}
              </button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1rem"}}>
            <div><label style={css.lbl}>Author</label><input style={css.inp()} placeholder="Author name" value={form.author} onChange={e=>setForm(f=>({...f,author:e.target.value}))}/></div>
            <div><label style={css.lbl}>Pages</label><input style={css.inp()} type="number" placeholder="Page count" value={form.pages} onChange={e=>setForm(f=>({...f,pages:e.target.value}))}/></div>
            <div><label style={css.lbl}>Status</label>
              <select style={css.sel} value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                {STATUSES.map(st=><option key={st}>{st}</option>)}
              </select>
            </div>
            <div><label style={css.lbl}>Date Read</label><input style={css.inp()} type="date" value={form.date_read} onChange={e=>setForm(f=>({...f,date_read:e.target.value}))}/></div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={css.lbl}>Rating</label>
              <StarRating value={form.rating} onChange={v=>setForm(f=>({...f,rating:v}))} accent={T.accentColor}/>
            </div>
          </div>
          <div style={{marginBottom:"1rem"}}>
            <label style={css.lbl}>Genres</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
              {GENRES.map(g=>{
                const sel=form.genres.includes(g);
                const c=colorMap[g]||DEFAULT_GENRE_COLORS[g]||"#6b7280";
                return(
                  <button key={g} onClick={()=>toggleGenre(g)} style={{display:"inline-flex",alignItems:"center",gap:"4px",padding:"0.22rem 0.65rem",borderRadius:"4px",border:`1px solid ${sel?c:T.borderColor}`,background:sel?c+"20":"transparent",color:sel?c:T.mutedColor,cursor:"pointer",fontSize:"0.75rem",fontWeight:500}}>
                    <GenreIcon genre={g} iconMap={iconMap} colorMap={colorMap} size={10}/>
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{marginBottom:"1rem"}}>
            <label style={css.lbl}>Cover Image</label>
            {form.cover_url&&!manualCover
              ?<div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}><img src={form.cover_url} style={{height:"52px",borderRadius:"4px"}} alt="cover" onError={e=>e.target.style.display="none"}/><button style={{...css.btn(T.borderColor,T.textColor,{fontSize:"0.75rem",padding:"0.28rem 0.55rem"})}} onClick={()=>setManualCover(true)}>Change</button></div>
              :<input style={css.inp()} placeholder="Paste image URL or leave blank" value={form.cover_url} onChange={e=>setForm(f=>({...f,cover_url:e.target.value}))}/>}
          </div>
          <div style={{marginBottom:"1.25rem"}}>
            <label style={css.lbl}>Notes / Summary</label>
            <textarea style={{...css.inp(),minHeight:"80px",resize:"vertical"}} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Your thoughts..."/>
          </div>
          <div style={{display:"flex",gap:"0.5rem"}}>
            <button style={css.btn()} onClick={saveBook}>{editMode?"Save Changes":"Add Book"}</button>
            <button style={css.btn(T.borderColor,T.textColor)} onClick={()=>{setView(editMode?"detail":addingTo);setEditMode(false);setForm(emptyForm);}}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── DETAIL ──
  if(view==="detail"&&selected){
    const book=books.find(b=>b.id===selected.id)||selected;
    const backTo=book.status==="Want to Read"?"nextup":book.status==="Finished"?"finished":"bookshelf";
    return(
      <div style={css.app}>
        {toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
        <Hdr backTo={backTo}/>
        <div style={{...css.main,maxWidth:"760px"}}>
          <div style={{display:"flex",gap:"1.75rem",flexWrap:"wrap",marginBottom:"1.5rem"}}>
            <div style={{flexShrink:0}}>
              {book.cover_url?<img src={book.cover_url} alt="cover" style={{width:"140px",borderRadius:"8px",display:"block",boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}} onError={e=>e.target.style.display="none"}/>:<div style={{width:"140px",height:"200px",background:book.spineColor||T.borderColor,borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center"}}><SvgIcon path={ICONS.book} size={36} color="rgba(255,255,255,0.5)"/></div>}
            </div>
            <div style={{flex:1,minWidth:"180px"}}>
              <h1 style={{margin:"0 0 0.2rem",fontSize:"1.4rem",fontWeight:700,lineHeight:1.2}}>{book.title}</h1>
              {book.author&&<p style={{color:T.mutedColor,margin:"0 0 0.75rem",fontSize:"0.9rem"}}>by {book.author}</p>}
              <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"0.75rem"}}>
                {(book.genres||[]).map(g=><span key={g} style={css.tag(g)}><GenreIcon genre={g} iconMap={iconMap} colorMap={colorMap} size={10}/>{g}</span>)}
              </div>
              {book.rating>0&&<div style={{color:"#f59e0b",fontSize:"1.1rem",marginBottom:"0.4rem"}}>{"★".repeat(book.rating)}{"☆".repeat(5-book.rating)}</div>}
              <div style={{display:"flex",gap:"1rem",fontSize:"0.8rem",color:T.mutedColor,marginBottom:"1rem"}}>
                {book.pages&&<span>{book.pages} pages</span>}
                {book.date_read&&<span>Finished {book.date_read}</span>}
              </div>
              {book.notes&&<p style={{margin:"0",lineHeight:1.65,fontSize:"0.9rem",color:T.textColor}}>{book.notes}</p>}
              <div style={{display:"flex",gap:"0.5rem",marginTop:"1.1rem",flexWrap:"wrap"}}>
                <button style={css.btn()} onClick={()=>{setForm({title:book.title,author:book.author||"",genres:book.genres||[],status:book.status,rating:book.rating||0,notes:book.notes||"",date_read:book.date_read||"",cover_url:book.cover_url||"",pages:String(book.pages||"")});setEditMode(true);setManualCover(false);}}>
                  <SvgIcon path={ICONS.edit} size={13} color="#fff"/>Edit
                </button>
                {book.status==="Currently Reading"&&(
                  <button style={css.btn("#ecfdf5","#065f46",{border:"1px solid #a7f3d0"})} onClick={()=>markFinished(book)}>
                    <SvgIcon path={ICONS.check} size={13} color="#065f46"/>Mark as Finished
                  </button>
                )}
                <button style={css.btn("#8b5cf6")} onClick={async()=>{setAiLoading(true);setAiResult("");try{setAiResult(await callClaude(`Book: "${book.title}" by ${book.author}. Rating: ${book.rating}★.`,"Generate 3 warm, reflective questions or insights about this book."));}catch{setAiResult("Couldn't generate notes.");}setAiLoading(false);}}>
                  <SvgIcon path={ICONS.sparkle} size={13} color="#fff"/>{aiLoading?"Thinking...":"Smart Notes"}
                </button>
                <button style={css.btn("#ef4444")} onClick={()=>deleteBook(book.id)}>
                  <SvgIcon path={ICONS.trash} size={13} color="#fff"/>Delete
                </button>
              </div>
            </div>
          </div>
          {aiResult&&<div style={css.aiBox}>{aiResult}</div>}
        </div>
      </div>
    );
  }

  // ── FINISHED BOOKSHELF ──
  if(view==="finished"){
    const rows=[];
    for(let i=0;i<finished.length;i+=8) rows.push(finished.slice(i,i+8));
    return(
      <div style={css.app}>
        {toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
        <Hdr/>
        <div style={css.main}>
          <div style={{marginBottom:"1.5rem"}}>
            <h2 style={{fontWeight:700,margin:"0 0 0.25rem",fontSize:"1.1rem"}}>Finished</h2>
            <p style={{color:T.mutedColor,margin:0,fontSize:"0.85rem"}}>{finished.length} book{finished.length!==1?"s":""} completed</p>
          </div>
          {finished.length===0?(
            <div style={{textAlign:"center",marginTop:"4rem",color:T.mutedColor}}>
              <SvgIcon path={ICONS.shelves} size={40} color={T.borderColor}/>
              <p style={{marginTop:"1rem",fontSize:"0.9rem"}}>No finished books yet</p>
            </div>
          ):rows.map((row,ri)=>(
            <div key={ri} style={{marginBottom:"2.5rem"}}>
              <div style={{display:"flex",alignItems:"flex-end",gap:"3px",padding:"0 4px"}}>
                {row.map((book,bi)=>{
                  const h=115+((bi*37)%55);
                  const sc=book.spineColor||SPINES[bi%SPINES.length];
                  return(
                    <div key={book.id} title={`${book.title} — ${book.author}`} onClick={()=>{setSelected(book);setView("detail");}}
                      style={{flex:"1",minWidth:"45px",maxWidth:"85px",cursor:"pointer",transition:"transform 0.15s"}}
                      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-10px)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                      {book.cover_url
                        ?<img src={book.cover_url} alt={book.title} style={{width:"100%",height:`${h}px`,objectFit:"cover",borderRadius:"2px 5px 5px 2px",boxShadow:"3px 4px 12px rgba(0,0,0,0.2)",display:"block"}} onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}/>
                        :null}
                      <div style={{display:book.cover_url?"none":"flex",width:"100%",height:`${h}px`,background:sc,borderRadius:"2px 5px 5px 2px",boxShadow:"3px 4px 12px rgba(0,0,0,0.2)",alignItems:"center",justifyContent:"center",writingMode:"vertical-rl",fontSize:"0.6rem",fontWeight:600,color:"rgba(255,255,255,0.8)",padding:"4px",boxSizing:"border-box",overflow:"hidden",userSelect:"none"}}>{book.title}</div>
                    </div>
                  );
                })}
                {row.length<8&&[...Array(8-row.length)].map((_,i)=><div key={i} style={{flex:"1",minWidth:"45px",maxWidth:"85px"}}/>)}
              </div>
              <div style={{height:"12px",background:T.borderColor,borderRadius:"2px",margin:"2px 0 0"}}/>
              <div style={{height:"6px",background:T.surfaceColor,borderRadius:"0 0 3px 3px",boxShadow:`0 3px 8px rgba(0,0,0,0.08)`}}/>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── STATS ──
  if(view==="stats"){
    const maxG=topGenres[0]?.[1]||1;
    return(
      <div style={css.app}>
        {toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
        <Hdr/>
        <div style={css.main}>
          <h2 style={{fontWeight:700,marginBottom:"1.25rem",fontSize:"1.1rem"}}>Reading Stats</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"10px",marginBottom:"1.5rem"}}>
            {[["Books Finished",finished.length,T.statFinishedColor],["Pages Read",totalPages.toLocaleString(),T.accentColor],["Avg Rating",avgRating,"#f59e0b"],["This Month",thisMonth,T.statReadingColor],["Currently Reading",reading.length,T.statReadingColor],["In Queue",nextUp.length,T.mutedColor]].map(([label,val,color])=>(
              <div key={label} style={{background:T.surfaceColor,borderRadius:"8px",padding:"1rem",border:`1px solid ${T.borderColor}`,textAlign:"center"}}>
                <div style={{fontSize:"1.6rem",fontWeight:700,color}}>{val}</div>
                <div style={{fontSize:"0.73rem",color:T.mutedColor,marginTop:"0.2rem"}}>{label}</div>
              </div>
            ))}
          </div>
          {topGenres.length>0&&(
            <div style={{...css.card,padding:"1.25rem",marginBottom:"1.25rem"}}>
              <h3 style={{margin:"0 0 1rem",fontWeight:600,fontSize:"0.9rem"}}>Top Genres</h3>
              {topGenres.map(([genre,count])=>(
                <div key={genre} style={{marginBottom:"0.65rem"}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",marginBottom:"3px",alignItems:"center"}}>
                    <span style={{display:"flex",alignItems:"center",gap:"5px"}}><GenreIcon genre={genre} iconMap={iconMap} colorMap={colorMap} size={12}/>{genre}</span>
                    <span style={{color:T.mutedColor}}>{count}</span>
                  </div>
                  <div style={{height:"6px",background:T.borderColor,borderRadius:"99px",overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(count/maxG)*100}%`,background:colorMap[genre]||DEFAULT_GENRE_COLORS[genre]||T.accentColor,borderRadius:"99px"}}/>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{...css.card,padding:"1.25rem"}}>
            <h3 style={{margin:"0 0 0.6rem",fontWeight:600,fontSize:"0.9rem"}}>Reading Pace</h3>
            <p style={{color:T.mutedColor,fontSize:"0.875rem",margin:0,lineHeight:1.6}}>
              {finished.length} book{finished.length!==1?"s":""} finished total · {thisMonth} this month{totalPages>0?` · ${totalPages.toLocaleString()} pages read`:""}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── SETTINGS ──
  if(view==="settings"){
    const colorFields=[["bgColor","Background"],["surfaceColor","Cards"],["borderColor","Borders"],["accentColor","Accent"],["textColor","Text"],["mutedColor","Muted"],["statFinishedColor","Finished Stat"],["statReadingColor","Reading Stat"],["statTotalColor","Total Stat"]];
    return(
      <div style={css.app}>
        {toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
        <Hdr/>
        <div style={css.main}>
          <h2 style={{fontWeight:700,marginBottom:"1.25rem",fontSize:"1.1rem"}}>Settings</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem"}}>
            <div style={{...css.card,padding:"1.25rem"}}>
              <h3 style={{margin:"0 0 1rem",fontWeight:600,fontSize:"0.88rem",color:T.mutedColor,textTransform:"uppercase",letterSpacing:"0.05em"}}>Profile</h3>
              <label style={css.lbl}>Display Name</label>
              <div style={{display:"flex",gap:"0.5rem"}}>
                <input style={{...css.inp(),flex:1}} value={user.name} onChange={e=>setUser(u=>({...u,name:e.target.value}))}/>
                <button style={css.btn()} onClick={()=>{updUser(user);showToast("Saved!");}}>Save</button>
              </div>
            </div>
            <div style={{...css.card,padding:"1.25rem"}}>
              <h3 style={{margin:"0 0 1rem",fontWeight:600,fontSize:"0.88rem",color:T.mutedColor,textTransform:"uppercase",letterSpacing:"0.05em"}}>Font</h3>
              {FONTS.map(f=>(
                <div key={f.value} onClick={()=>updTheme({...T,fontFamily:f.value})} style={{padding:"0.45rem 0.75rem",borderRadius:"6px",marginBottom:"0.35rem",cursor:"pointer",fontFamily:f.value,border:`1.5px solid ${T.fontFamily===f.value?T.accentColor:T.borderColor}`,background:T.fontFamily===f.value?T.accentColor+"12":"transparent",fontSize:"0.85rem"}}>
                  {f.label}
                </div>
              ))}
            </div>
            <div style={{...css.card,padding:"1.25rem"}}>
              <h3 style={{margin:"0 0 1rem",fontWeight:600,fontSize:"0.88rem",color:T.mutedColor,textTransform:"uppercase",letterSpacing:"0.05em"}}>Theme Colors</h3>
              {colorFields.map(([key,label])=>(
                <div key={key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.4rem 0",borderBottom:`1px solid ${T.borderColor}`}}>
                  <label style={{...css.lbl,margin:0,fontSize:"0.8rem"}}>{label}</label>
                  <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                    <input type="color" value={T[key]} onChange={e=>updTheme({...T,[key]:e.target.value})} style={{width:"32px",height:"26px",borderRadius:"5px",border:`1px solid ${T.borderColor}`,cursor:"pointer",padding:"1px"}}/>
                    <span style={{fontSize:"0.7rem",color:T.mutedColor,fontFamily:"monospace"}}>{T[key]}</span>
                  </div>
                </div>
              ))}
              <button style={{...css.btn("#ef4444","#fff",{marginTop:"1rem",fontSize:"0.78rem"})}} onClick={()=>{updTheme(DEFAULTS);showToast("Reset!");}}>Reset to Default</button>
            </div>
            <div style={{...css.card,padding:"1.25rem"}}>
              <h3 style={{margin:"0 0 1rem",fontWeight:600,fontSize:"0.88rem",color:T.mutedColor,textTransform:"uppercase",letterSpacing:"0.05em"}}>Genre Icons & Colors</h3>
              <div style={{maxHeight:"400px",overflowY:"auto"}}>
                {GENRES.map(g=>(
                  <div key={g} style={{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.4rem 0",borderBottom:`1px solid ${T.borderColor}`}}>
                    <GenreIcon genre={g} iconMap={iconMap} colorMap={colorMap} size={14}/>
                    <span style={{flex:1,fontSize:"0.8rem",fontWeight:500}}>{g}</span>
                    <input type="color" value={colorMap[g]||DEFAULT_GENRE_COLORS[g]||"#6b7280"} onChange={e=>updGenreColors({...genreColors,[g]:e.target.value})} style={{width:"26px",height:"22px",borderRadius:"4px",border:`1px solid ${T.borderColor}`,cursor:"pointer",padding:"1px"}}/>
                    <select style={{...css.sel,width:"auto",fontSize:"0.74rem",padding:"0.2rem 0.4rem"}} value={iconMap[g]||DEFAULT_GENRE_ICONS[g]||"book"} onChange={e=>updGenreIcons({...genreIcons,[g]:e.target.value})}>
                      {GENRE_ICON_OPTIONS.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── AI ──
  if(view==="ai") return(
    <div style={css.app}>
      {toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
      <Hdr/>
      <div style={css.main}>
        <h2 style={{fontWeight:700,marginBottom:"1.25rem",fontSize:"1.1rem"}}>AI Features</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1rem"}}>
          <div style={{...css.card,padding:"1.25rem"}}>
            <h3 style={{margin:"0 0 0.35rem",fontWeight:600,fontSize:"0.9rem"}}>Recommendations</h3>
            <p style={{color:T.mutedColor,fontSize:"0.82rem",margin:"0 0 0.75rem",lineHeight:1.5}}>Picks based on your reading history.</p>
            <button style={css.btn()} onClick={async()=>{setAiLoading(true);setAiResult("");try{const f=finished.map(b=>`${b.title} by ${b.author}`).join(", ");setAiResult(await callClaude(`Finished: ${f||"none"}.`,"Suggest 5 books. Format: **Title** by Author — one sentence why."));}catch{setAiResult("Couldn't get recommendations.");}setAiLoading(false);}} disabled={aiLoading}>
              <SvgIcon path={ICONS.sparkle} size={13} color="#fff"/>{aiLoading?"Thinking...":"Get Recommendations"}
            </button>
          </div>
          <div style={{...css.card,padding:"1.25rem"}}>
            <h3 style={{margin:"0 0 0.35rem",fontWeight:600,fontSize:"0.9rem"}}>Mood Picker</h3>
            <p style={{color:T.mutedColor,fontSize:"0.82rem",margin:"0 0 0.5rem",lineHeight:1.5}}>Tell me how you're feeling.</p>
            <input style={{...css.inp(),marginBottom:"0.6rem"}} placeholder="e.g. cozy, adventurous..." value={mood} onChange={e=>setMood(e.target.value)}/>
            <button style={css.btn("#d97706")} onClick={async()=>{if(!mood.trim()) return showToast("Describe your mood!","error");setAiLoading(true);setAiResult("");try{const w=nextUp.map(b=>`${b.title} by ${b.author}`).join(", ");setAiResult(await callClaude(`Mood: "${mood}". Next-Up: ${w||"none"}.`,"Suggest 3 books from list, or general picks. Be warm and brief."));}catch{setAiResult("Couldn't get suggestions.");}setAiLoading(false);}} disabled={aiLoading}>{aiLoading?"Thinking...":"Suggest"}</button>
          </div>
        </div>
        {aiResult&&<div style={css.aiBox}>{aiResult}</div>}
      </div>
    </div>
  );

  // ── BOOKSHELF / NEXT-UP ──
  const isNextUp=view==="nextup";
  const displayList=applyFilters(isNextUp?nextUp:reading);
  return(
    <div style={css.app}>
      {toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
      <Hdr/>
      <div style={css.main}>
        {!isNextUp&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"1.5rem"}}>
            {[["Total",books.length,T.statTotalColor,"bookshelf"],["Finished",finished.length,T.statFinishedColor,"finished"],["Reading",reading.length,T.statReadingColor,"bookshelf"]].map(([label,val,color,linkTo])=>(
              <div key={label} onClick={()=>setView(linkTo)} style={{background:T.surfaceColor,borderRadius:"8px",padding:"0.9rem 1rem",border:`1px solid ${T.borderColor}`,cursor:"pointer",transition:"border-color 0.15s",display:"flex",alignItems:"center",gap:"0.75rem"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=color}
                onMouseLeave={e=>e.currentTarget.style.borderColor=T.borderColor}>
                <div style={{width:"8px",height:"8px",borderRadius:"50%",background:color,flexShrink:0}}/>
                <div>
                  <div style={{fontSize:"1.4rem",fontWeight:700,color,lineHeight:1}}>{val}</div>
                  <div style={{fontSize:"0.73rem",color:T.mutedColor,marginTop:"2px"}}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {isNextUp&&<div style={{...css.card,padding:"0.75rem 1rem",marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:"0.5rem"}}><SvgIcon path={ICONS.bookmark} size={14} color={T.mutedColor}/><span style={{fontSize:"0.85rem",color:T.mutedColor}}><strong style={{color:T.textColor}}>{nextUp.length}</strong> book{nextUp.length!==1?"s":""} queued</span></div>}
        <div style={{display:"flex",gap:"0.6rem",marginBottom:"1.25rem",flexWrap:"wrap"}}>
          <input style={{...css.inp(),maxWidth:"220px"}} placeholder="Search..." value={fSearch} onChange={e=>setFSearch(e.target.value)}/>
          <select style={{...css.sel,width:"auto"}} value={fGenre} onChange={e=>setFGenre(e.target.value)}>
            <option>All</option>{GENRES.map(g=><option key={g}>{g}</option>)}
          </select>
        </div>
        {displayList.length===0?(
          <div style={{textAlign:"center",marginTop:"4rem",color:T.mutedColor}}>
            <SvgIcon path={ICONS.book} size={36} color={T.borderColor}/>
            <p style={{marginTop:"1rem",fontSize:"0.9rem"}}>{isNextUp?"Nothing queued yet":"Not currently reading anything"}</p>
            <button style={{...css.btn(T.accentColor,"#fff",{marginTop:"0.75rem"})}} onClick={()=>{setForm({...emptyForm,status:isNextUp?"Want to Read":"Currently Reading"});setAddingTo(view);setView("add");}}>Add a Book</button>
          </div>
        ):(
          <div style={css.grid}>{displayList.map(book=><BookCard key={book.id} book={book}/>)}</div>
        )}
      </div>
    </div>
  );
}