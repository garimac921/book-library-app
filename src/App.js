import { useState, useEffect, useRef } from "react";

const BUILT_IN_GENRES = [
  "Fiction","Non-Fiction","Fantasy","High Fantasy","Dark Fantasy","Romantasy",
  "Sci-Fi","Mystery","Thriller","Horror","Gothic Horror","Dark Gothic Romance",
  "Romance","Historical Romance","Historical Fiction","Contemporary Romance",
  "Biography","Memoir","History","Self-Help","Philosophy","Poetry",
  "Graphic Novel","Young Adult","Middle Grade","True Crime","Spirituality",
  "Action","Dystopian","Royalty","Favorite","Other"
];
const STATUSES = ["Want to Read","Currently Reading","Finished"];
const FONTS = [
  {label:"System UI",     value:"'Segoe UI',sans-serif"},
  {label:"Inter",         value:"'Inter',sans-serif"},
  {label:"Georgia Serif", value:"Georgia,serif"},
  {label:"Playfair",      value:"'Playfair Display',serif"},
  {label:"Mono",          value:"'Courier New',monospace"},
  {label:"Futura",        value:"'Trebuchet MS',sans-serif"},
  {label:"Garamond",      value:"Garamond,serif"},
  {label:"Helvetica",     value:"'Helvetica Neue',Arial,sans-serif"},
];
const DEFAULTS = {
  bgColor:"#f8f7f4", surfaceColor:"#ffffff", borderColor:"#e8e6e1",
  accentColor:"#5b6af0", textColor:"#1c1c1e", mutedColor:"#8e8e93",
  statFinishedColor:"#30b57a", statReadingColor:"#f0932b", statTotalColor:"#5b6af0",
  fontFamily:"'Segoe UI',sans-serif"
};

const GENRE_ICON_OPTIONS = [
  {id:"book",    label:"Book",    path:"M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"},
  {id:"star",    label:"Star",    path:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"},
  {id:"sword",   label:"Sword",   path:"M14.5 17.5L3 6V3h3l11.5 11.5M14.5 17.5l2 2.5-1 1-2.5-2M14.5 17.5L16 16M7 7L5.5 5.5M18 13l1.5 1.5"},
  {id:"moon",    label:"Moon",    path:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"},
  {id:"heart",   label:"Heart",   path:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"},
  {id:"brain",   label:"Brain",   path:"M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.98-3 2.5 2.5 0 0 1-1.32-4.24 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.96-3.1A2.5 2.5 0 0 1 9.5 2M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0 1.32-4.24 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.96-3.1A2.5 2.5 0 0 0 14.5 2z"},
  {id:"fire",    label:"Fire",    path:"M8.5 14.5s-1.5-2 0-4c.7-1 2.5-2 2.5-4C14 8 16 11 13 14c1 0 2.5-.5 2.5-2 .5 1 1.5 3 0 5-1 1.5-3 2-4.5 2s-3.5-1-3.5-3c0-1 .5-2 1-1.5z"},
  {id:"ghost",   label:"Ghost",   path:"M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"},
  {id:"crown",   label:"Crown",   path:"M3 20h18M5 20V10l7-7 7 7v10"},
  {id:"compass", label:"Compass", path:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm4.95-14.95l-9.9 9.9M16.95 7.05l-4.95 4.95"},
  {id:"flask",   label:"Flask",   path:"M6 2v6l-4 10a2 2 0 0 0 1.87 2.71h12.26A2 2 0 0 0 18 18L14 8V2M6 2h12M9 2v3"},
  {id:"music",   label:"Music",   path:"M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"},
];
const DEFAULT_GENRE_ICONS = {
  "Fiction":"book","Non-Fiction":"brain","Fantasy":"moon","High Fantasy":"crown",
  "Dark Fantasy":"ghost","Romantasy":"heart","Sci-Fi":"flask","Mystery":"compass",
  "Thriller":"fire","Horror":"ghost","Gothic Horror":"moon","Dark Gothic Romance":"heart",
  "Romance":"heart","Historical Romance":"crown","Historical Fiction":"crown",
  "Contemporary Romance":"heart","Biography":"book","Memoir":"book","History":"crown",
  "Self-Help":"brain","Philosophy":"brain","Poetry":"music","Graphic Novel":"star",
  "Young Adult":"star","Middle Grade":"star","True Crime":"fire","Spirituality":"moon",
  "Action":"sword","Dystopian":"fire","Royalty":"crown","Favorite":"star","Other":"book"
};
const DEFAULT_GENRE_COLORS = {
  "Fiction":"#6366f1","Non-Fiction":"#0ea5e9","Fantasy":"#8b5cf6","High Fantasy":"#7c3aed",
  "Dark Fantasy":"#4c1d95","Romantasy":"#ec4899","Sci-Fi":"#06b6d4","Mystery":"#64748b",
  "Thriller":"#dc2626","Horror":"#7f1d1d","Gothic Horror":"#3b0764","Dark Gothic Romance":"#be185d",
  "Romance":"#f43f5e","Historical Romance":"#b45309","Historical Fiction":"#92400e",
  "Contemporary Romance":"#f97316","Biography":"#0369a1","Memoir":"#0891b2",
  "History":"#92400e","Self-Help":"#15803d","Philosophy":"#1d4ed8","Poetry":"#9333ea",
  "Graphic Novel":"#ea580c","Young Adult":"#d97706","Middle Grade":"#16a34a",
  "True Crime":"#b91c1c","Spirituality":"#7c3aed","Action":"#dc2626","Dystopian":"#78350f",
  "Royalty":"#d97706","Favorite":"#f59e0b","Other":"#6b7280"
};

const BKEY="blib_books_v5",TKEY="blib_theme_v4",UKEY="blib_user_v3",GKEY="blib_genres_v2",CGKEY="blib_custom_genres_v1";
const loadArr=k=>{try{return JSON.parse(localStorage.getItem(k)||"[]")}catch{return[];}};
const loadObj=(k,def)=>{try{return{...def,...JSON.parse(localStorage.getItem(k)||"{}")}}catch{return def;}};
const sv=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

const SvgIcon=({path,size=16,color="currentColor",sw=2})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d={path}/></svg>
);
const GenreIcon=({genre,iconMap,colorMap,size=12})=>{
  const id=iconMap[genre]||DEFAULT_GENRE_ICONS[genre]||"book";
  const color=colorMap[genre]||DEFAULT_GENRE_COLORS[genre]||"#6b7280";
  const opt=GENRE_ICON_OPTIONS.find(o=>o.id===id)||GENRE_ICON_OPTIONS[0];
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d={opt.path}/></svg>;
};
const ICONS={
  book:"M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z",
  bookmark:"M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
  sparkle:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  settings:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  chart:"M18 20V10M12 20V4M6 20v-6M2 20h20",
  shelves:"M2 3h20v4H2zM2 10h20v4H2zM2 17h20v4H2z",
  plus:"M12 5v14M5 12h14",
  back:"M19 12H5M12 19l-7-7 7-7",
  edit:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:"M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6",
  check:"M20 6L9 17l-5-5",
  user:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

async function callClaude(prompt,system){
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":process.env.REACT_APP_ANTHROPIC_KEY,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system,messages:[{role:"user",content:prompt}]})});
  const d=await r.json();return d.content?.[0]?.text||"";
}
async function searchOLFull(title){
  try{
    const r=await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1&fields=title,author_name,cover_i,number_of_pages_median`);
    const d=await r.json();const b=d.docs?.[0];if(!b)return null;
    return{author:b.author_name?.[0]||"",cover_url:b.cover_i?`https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg`:"",pages:b.number_of_pages_median||""};
  }catch{return null;}
}

const StarRating=({value,onChange,accent="#f59e0b"})=>(
  <div style={{display:"flex",gap:"3px"}}>
    {[1,2,3,4,5].map(s=>(
      <button key={s} onClick={()=>onChange(s)} style={{background:"none",border:"none",cursor:"pointer",fontSize:"1.5rem",color:s<=value?accent:"#d1d5db",padding:0,lineHeight:1}}>★</button>
    ))}
  </div>
);

// Mini bar chart
const BarChart=({data,color,label})=>{
  const max=Math.max(...data.map(d=>d.value),1);
  return(
    <div style={{width:"100%"}}>
      <div style={{display:"flex",alignItems:"flex-end",gap:"6px",height:"80px",marginBottom:"6px"}}>
        {data.map((d,i)=>(
          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:"100%"}}>
            <div style={{width:"100%",background:d.value>0?color:"#e5e7eb",borderRadius:"4px 4px 0 0",height:`${Math.max((d.value/max)*100,d.value>0?8:2)}%`,transition:"height 0.4s ease",minHeight:d.value>0?"8px":"2px"}}/>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:"6px"}}>
        {data.map((d,i)=>(
          <div key={i} style={{flex:1,textAlign:"center",fontSize:"0.6rem",color:"#9ca3af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.label}</div>
        ))}
      </div>
    </div>
  );
};

// Donut chart
const DonutChart=({data,size=140})=>{
  const total=data.reduce((a,b)=>a+b.value,0);
  if(total===0)return<div style={{textAlign:"center",color:"#9ca3af",fontSize:"0.8rem",padding:"1rem"}}>No data yet</div>;
  let cumulative=0;
  const cx=size/2,cy=size/2,r=size*0.35,ir=size*0.22;
  const slices=data.filter(d=>d.value>0).map(d=>{
    const pct=d.value/total;
    const start=cumulative*2*Math.PI-Math.PI/2;
    cumulative+=pct;
    const end=cumulative*2*Math.PI-Math.PI/2;
    const x1=cx+r*Math.cos(start),y1=cy+r*Math.sin(start);
    const x2=cx+r*Math.cos(end),y2=cy+r*Math.sin(end);
    const ix1=cx+ir*Math.cos(start),iy1=cy+ir*Math.sin(start);
    const ix2=cx+ir*Math.cos(end),iy2=cy+ir*Math.sin(end);
    const large=pct>0.5?1:0;
    return{...d,path:`M${ix1},${iy1} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${ir},${ir} 0 ${large},0 ${ix1},${iy1} Z`};
  });
  return(
    <div style={{display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
        {slices.map((s,i)=><path key={i} d={s.path} fill={s.color} opacity="0.85"/>)}
        <text x={cx} y={cy-6} textAnchor="middle" fontSize="14" fontWeight="600" fill="#1c1c1e">{total}</text>
        <text x={cx} y={cy+10} textAnchor="middle" fontSize="9" fill="#8e8e93">books</text>
      </svg>
      <div style={{display:"flex",flexDirection:"column",gap:"5px",flex:1,minWidth:"100px"}}>
        {slices.slice(0,6).map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"0.72rem"}}>
            <div style={{width:"8px",height:"8px",borderRadius:"50%",background:s.color,flexShrink:0}}/>
            <span style={{color:"#4b5563",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.label}</span>
            <span style={{color:"#9ca3af",fontWeight:500}}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Line chart
const LineChart=({data,color})=>{
  const max=Math.max(...data.map(d=>d.value),1);
  const w=300,h=80,pad=8;
  if(data.every(d=>d.value===0)) return<div style={{textAlign:"center",color:"#9ca3af",fontSize:"0.8rem",padding:"1rem"}}>Not enough data collected</div>;
  const pts=data.map((d,i)=>({x:pad+(i/(data.length-1||1))*(w-pad*2),y:h-pad-(d.value/max)*(h-pad*2)}));
  const pathD=pts.map((p,i)=>i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`).join(" ");
  const areaD=`${pathD} L${pts[pts.length-1].x},${h} L${pts[0].x},${h} Z`;
  return(
    <div style={{width:"100%"}}>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{overflow:"visible"}}>
        <path d={areaD} fill={color} opacity="0.08"/>
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="3" fill={color}/>)}
      </svg>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:"4px"}}>
        {data.map((d,i)=><span key={i} style={{fontSize:"0.6rem",color:"#9ca3af"}}>{d.label}</span>)}
      </div>
    </div>
  );
};

const emptyForm={title:"",author:"",genres:[],status:"Currently Reading",rating:0,notes:"",date_read:"",cover_url:"",pages:""};
const SPINES=["#e11d48","#7c3aed","#2563eb","#059669","#d97706","#0891b2","#9333ea","#b45309"];

export default function App(){
  const [books,setBooks]=useState([]);
  const [theme,setTheme]=useState(DEFAULTS);
  const [user,setUser]=useState({name:""});
  const [genreIcons,setGenreIcons]=useState({});
  const [genreColors,setGenreColors]=useState({});
  const [customGenres,setCustomGenres]=useState([]);
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
  const [statPeriod,setStatPeriod]=useState("month");
  const [newGenreName,setNewGenreName]=useState("");
  const [newGenreColor,setNewGenreColor]=useState("#6366f1");
  const debRef=useRef(null);

  useEffect(()=>{
    setBooks(loadArr(BKEY));
    setTheme(loadObj(TKEY,DEFAULTS));
    const u=loadObj(UKEY,{name:""});setUser(u);if(!u.name)setShowOnboard(true);
    setGenreIcons(loadObj(GKEY+"_icons",{}));
    setGenreColors(loadObj(GKEY+"_colors",{}));
    setCustomGenres(loadArr(CGKEY));
  },[]);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast({msg:"",type:"success"}),3000);};
  const updBooks=b=>{setBooks(b);sv(BKEY,b);};
  const updTheme=t=>{setTheme(t);sv(TKEY,t);};
  const updUser=u=>{setUser(u);sv(UKEY,u);};
  const updGenreIcons=m=>{setGenreIcons(m);sv(GKEY+"_icons",m);};
  const updGenreColors=m=>{setGenreColors(m);sv(GKEY+"_colors",m);};
  const updCustomGenres=g=>{setCustomGenres(g);sv(CGKEY,g);};
  const T=theme;
  const allGenres=[...BUILT_IN_GENRES,...customGenres];
  const iconMap={...DEFAULT_GENRE_ICONS,...genreIcons};
  const colorMap={...DEFAULT_GENRE_COLORS,...genreColors};

  // Bubble gradient overlay — always rendered, accent-tinted
  const BubbleBg=()=>(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      <div style={{position:"absolute",width:"600px",height:"600px",borderRadius:"50%",background:`radial-gradient(circle, ${T.accentColor}0a 0%, transparent 70%)`,top:"-200px",right:"-150px"}}/>
      <div style={{position:"absolute",width:"400px",height:"400px",borderRadius:"50%",background:`radial-gradient(circle, ${T.statFinishedColor}08 0%, transparent 70%)`,bottom:"0px",left:"-100px"}}/>
      <div style={{position:"absolute",width:"300px",height:"300px",borderRadius:"50%",background:`radial-gradient(circle, ${T.statReadingColor}07 0%, transparent 70%)`,top:"40%",left:"30%"}}/>
    </div>
  );

  const css={
    app:{fontFamily:T.fontFamily,minHeight:"100vh",background:T.bgColor,color:T.textColor,position:"relative"},
    hdr:{background:`${T.surfaceColor}ee`,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",padding:"0 2rem",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.borderColor}`,position:"sticky",top:0,zIndex:100},
    logo:{fontSize:"1.2rem",fontWeight:800,color:T.textColor,letterSpacing:"-0.5px"},
    tab:(a)=>({display:"flex",alignItems:"center",gap:"6px",padding:"0.5rem 1rem",borderRadius:"10px",border:"none",cursor:"pointer",fontWeight:600,fontSize:"0.88rem",background:a?T.accentColor+"18":"transparent",color:a?T.accentColor:T.mutedColor,transition:"all 0.15s",letterSpacing:"0.01em"}),
    main:{padding:"2rem",maxWidth:"1200px",margin:"0 auto",position:"relative",zIndex:1},
    card:{background:T.surfaceColor,borderRadius:"16px",border:`1px solid ${T.borderColor}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"},
    grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:"16px"},
    inp:(x={})=>({width:"100%",padding:"0.65rem 0.9rem",borderRadius:"10px",border:`1.5px solid ${T.borderColor}`,background:T.bgColor,color:T.textColor,fontSize:"0.95rem",boxSizing:"border-box",outline:"none",transition:"border-color 0.15s",...x}),
    sel:{width:"100%",padding:"0.65rem 0.9rem",borderRadius:"10px",border:`1.5px solid ${T.borderColor}`,background:T.bgColor,color:T.textColor,fontSize:"0.95rem"},
    lbl:{fontSize:"0.75rem",color:T.mutedColor,marginBottom:"0.35rem",display:"block",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"},
    btn:(bg,fg="#fff",x={})=>({display:"inline-flex",alignItems:"center",gap:"6px",padding:"0.55rem 1.1rem",borderRadius:"10px",border:"none",cursor:"pointer",fontWeight:600,fontSize:"0.88rem",background:bg||T.accentColor,color:fg,transition:"opacity 0.15s",letterSpacing:"0.01em",...x}),
    tag:(genre)=>{const c=colorMap[genre]||"#6b7280";return{display:"inline-flex",alignItems:"center",gap:"4px",padding:"0.22rem 0.65rem",borderRadius:"6px",fontSize:"0.75rem",fontWeight:600,background:c+"18",color:c,border:`1px solid ${c}28`};},
    toast:(tp)=>({position:"fixed",bottom:"1.5rem",right:"1.5rem",background:tp==="error"?"#ef4444":"#10b981",color:"#fff",padding:"0.7rem 1.2rem",borderRadius:"12px",fontWeight:600,zIndex:9999,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}),
    aiBox:{background:T.bgColor,borderRadius:"12px",padding:"1.25rem",marginTop:"1rem",border:`1.5px solid ${T.borderColor}`,lineHeight:1.8,whiteSpace:"pre-wrap",fontSize:"0.95rem"},
    section:(x={})=>({...css.card,padding:"1.5rem",...x}),
  };

  const searchOL=async q=>{
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
    if(!form.title.trim())return showToast("Enter a title first!","error");
    setAiLoading(true);setFillStep("Searching...");
    try{
      const[olData,aiRes]=await Promise.all([
        searchOLFull(form.title),
        callClaude(`Book: "${form.title}"${form.author?`, by "${form.author}"`:""}`,`Return ONLY raw JSON: genre (one of: ${allGenres.join(",")}), notes (2-sentence summary), pages (integer). No markdown.`)
      ]);
      if(olData){setForm(f=>({...f,...olData,title:form.title}));setFillStep("Cover found!");}
      const aiData=JSON.parse(aiRes.replace(/```json|```/g,"").trim());
      setForm(f=>({...f,...(olData||{}),...aiData,genres:aiData.genre?[aiData.genre]:f.genres,title:form.title}));
      showToast("Details filled in!");
    }catch{showToast("Couldn't auto-fill.","error");}
    setAiLoading(false);setFillStep("");
  };

  const saveBook=()=>{
    if(!form.title.trim())return showToast("Title is required!","error");
    if(editMode&&selected){
      updBooks(books.map(b=>b.id===selected.id?{...b,...form}:b));
      setSelected({...selected,...form});
      showToast("Updated!");setView("detail");setEditMode(false);setForm(emptyForm);
    }else{
      updBooks([{...form,id:Date.now().toString(),created_at:new Date().toISOString(),spineColor:SPINES[Math.floor(Math.random()*SPINES.length)]},...books]);
      showToast("Book added!");setForm(emptyForm);setView(addingTo);
    }
  };

  const markFinished=book=>{
    const today=new Date().toISOString().split("T")[0];
    updBooks(books.map(b=>b.id===book.id?{...b,status:"Finished",date_read:b.date_read||today}:b));
    showToast(`"${book.title}" marked as finished!`);
  };

  const deleteBook=id=>{
    if(!window.confirm("Delete this book?"))return;
    updBooks(books.filter(b=>b.id!==id));
    showToast("Deleted.");setView("bookshelf");
  };

  const toggleGenre=g=>setForm(f=>({...f,genres:f.genres.includes(g)?f.genres.filter(x=>x!==g):[...f.genres,g]}));

  const addCustomGenre=()=>{
    const name=newGenreName.trim();
    if(!name)return showToast("Enter a genre name","error");
    if(allGenres.includes(name))return showToast("Genre already exists","error");
    updCustomGenres([...customGenres,name]);
    updGenreColors({...genreColors,[name]:newGenreColor});
    updGenreIcons({...genreIcons,[name]:"book"});
    setNewGenreName("");showToast(`Added "${name}"!`);
  };

  const finished=books.filter(b=>b.status==="Finished");
  const reading=books.filter(b=>b.status==="Currently Reading");
  const nextUp=books.filter(b=>b.status==="Want to Read");
  const totalPages=finished.reduce((a,b)=>a+(parseInt(b.pages)||0),0);
  const avgRating=finished.filter(b=>b.rating>0).length?(finished.filter(b=>b.rating>0).reduce((a,b)=>a+b.rating,0)/finished.filter(b=>b.rating>0).length).toFixed(1):"—";
  const genreCounts={};
  books.forEach(b=>(b.genres||[]).forEach(g=>{genreCounts[g]=(genreCounts[g]||0)+1;}));
  const topGenres=Object.entries(genreCounts).sort((a,b)=>b[1]-a[1]).slice(0,8);

  // Stats helpers
  const getMonthlyData=()=>{
    const now=new Date();
    return Array.from({length:6},(_,i)=>{
      const d=new Date(now.getFullYear(),now.getMonth()-5+i,1);
      const label=d.toLocaleString("default",{month:"short"});
      const value=finished.filter(b=>{if(!b.date_read)return false;const bd=new Date(b.date_read);return bd.getMonth()===d.getMonth()&&bd.getFullYear()===d.getFullYear();}).length;
      return{label,value};
    });
  };
  const getYearlyData=()=>{
    const now=new Date();
    return Array.from({length:5},(_,i)=>{
      const y=now.getFullYear()-4+i;
      const value=finished.filter(b=>{if(!b.date_read)return false;return new Date(b.date_read).getFullYear()===y;}).length;
      return{label:String(y),value};
    });
  };

  const applyFilters=list=>list.filter(b=>{
    if(fGenre!=="All"&&!(b.genres||[]).includes(fGenre))return false;
    if(fSearch&&!b.title.toLowerCase().includes(fSearch.toLowerCase())&&!b.author?.toLowerCase().includes(fSearch.toLowerCase()))return false;
    return true;
  });

  const NavTabs=()=>(
    <div style={{display:"flex",gap:"4px",alignItems:"center"}}>
      {[["bookshelf","book","Bookshelf"],["nextup","bookmark","Next-Up"],["finished","shelves","Finished"],["stats","chart","Stats"],["ai","sparkle","AI"],["settings","settings","Settings"]].map(([v,ic,l])=>(
        <button key={v} style={css.tab(view===v)} onClick={()=>{setView(v);setAiResult("");}}>
          <SvgIcon path={ICONS[ic]} size={14} color={view===v?T.accentColor:T.mutedColor}/>
          {l}
        </button>
      ))}
      <button style={{...css.btn(T.accentColor,"#fff",{marginLeft:"8px",padding:"0.5rem 1rem",fontSize:"0.88rem",borderRadius:"10px",boxShadow:`0 2px 8px ${T.accentColor}40`})}} onClick={()=>{setForm({...emptyForm,status:view==="nextup"?"Want to Read":"Currently Reading"});setAddingTo(view==="nextup"?"nextup":"bookshelf");setEditMode(false);setOlResults([]);setManualCover(false);setView("add");}}>
        <SvgIcon path={ICONS.plus} size={14} color="#fff"/>Add Book
      </button>
    </div>
  );

  const Hdr=({backTo,backLabel})=>(
    <div style={css.hdr}>
      <span style={css.logo}>{user.name?`${user.name}'s Library`:"My Library"}</span>
      {backTo?<button style={css.btn(T.borderColor,T.textColor)} onClick={()=>{setView(backTo);setAiResult("");}}><SvgIcon path={ICONS.back} size={14} color={T.textColor}/>{backLabel||"Back"}</button>:<NavTabs/>}
    </div>
  );

  const BookCard=({book})=>{
    const isReading=book.status==="Currently Reading";
    return(
      <div style={{...css.card,cursor:"pointer",transition:"transform 0.15s, box-shadow 0.15s"}}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.1)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.04)";}}>
        <div onClick={()=>{setSelected(book);setAiResult("");setView("detail");}}>
          <div style={{width:"100%",paddingTop:"148%",position:"relative",overflow:"hidden",background:book.spineColor||T.borderColor,borderRadius:"16px 16px 0 0"}}>
            {book.cover_url&&<img src={book.cover_url} alt="cover" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",display:"block"}} onError={e=>e.target.style.display="none"}/>}
            {!book.cover_url&&<div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}><SvgIcon path={ICONS.book} size={36} color="rgba(255,255,255,0.5)"/></div>}
          </div>
          <div style={{padding:"12px 12px 8px"}}>
            <div style={{fontWeight:700,fontSize:"0.95rem",lineHeight:1.3,marginBottom:"4px",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{book.title}</div>
            {book.author&&<div style={{color:T.mutedColor,fontSize:"0.8rem",marginBottom:"8px"}}>{book.author}</div>}
            <div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"6px"}}>
              {(book.genres||[]).map(g=><span key={g} style={css.tag(g)}><GenreIcon genre={g} iconMap={iconMap} colorMap={colorMap} size={10}/>{g}</span>)}
            </div>
            {book.rating>0&&<div style={{color:"#f59e0b",fontSize:"0.85rem",letterSpacing:"1px"}}>{"★".repeat(book.rating)}{"☆".repeat(5-book.rating)}</div>}
          </div>
        </div>
        {isReading&&(
          <div style={{padding:"0 12px 12px"}}>
            <button style={{...css.btn("#ecfdf5","#065f46",{width:"100%",justifyContent:"center",fontSize:"0.8rem",padding:"0.4rem 0",borderRadius:"8px",border:"1px solid #a7f3d0"})}} onClick={e=>{e.stopPropagation();markFinished(book);}}>
              <SvgIcon path={ICONS.check} size={13} color="#065f46"/>Mark as Finished
            </button>
          </div>
        )}
      </div>
    );
  };

  // ── ONBOARD ──
  if(showOnboard)return(
    <div style={{...css.app,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <BubbleBg/>
      <div style={{...css.card,maxWidth:"420px",width:"90%",padding:"3rem",textAlign:"center",position:"relative",zIndex:1}}>
        <SvgIcon path={ICONS.book} size={44} color={T.accentColor}/>
        <h2 style={{margin:"1rem 0 0.4rem",fontWeight:800,fontSize:"1.6rem"}}>Welcome to your Library</h2>
        <p style={{color:T.mutedColor,marginBottom:"1.75rem",fontSize:"1rem"}}>What should we call you?</p>
        <input style={{...css.inp(),textAlign:"center",fontSize:"1.1rem",marginBottom:"1rem"}} placeholder="Your name..." value={onboardName} onChange={e=>setOnboardName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&onboardName.trim()){updUser({name:onboardName.trim()});setShowOnboard(false);}}} autoFocus/>
        <button style={{...css.btn(T.accentColor,"#fff",{width:"100%",justifyContent:"center",padding:"0.75rem",fontSize:"1rem",borderRadius:"12px",boxShadow:`0 4px 16px ${T.accentColor}40`})}} onClick={()=>{if(onboardName.trim()){updUser({name:onboardName.trim()});setShowOnboard(false);}}}>Enter my Library</button>
      </div>
    </div>
  );

  // ── ADD/EDIT ──
  if(view==="add"||(view==="detail"&&editMode))return(
    <div style={css.app}>
      <BubbleBg/>{toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
      <Hdr backTo={editMode?"detail":addingTo} backLabel="Back"/>
      <div style={css.main}>
        <h2 style={{fontWeight:800,marginBottom:"1.5rem",fontSize:"1.3rem"}}>{editMode?"Edit Book":`Add to ${addingTo==="nextup"?"Next-Up":"Bookshelf"}`}</h2>
        <div style={{...css.section()}}>
          <div style={{marginBottom:"1.25rem"}}>
            <label style={css.lbl}>Book Title</label>
            <div style={{display:"flex",gap:"0.6rem",position:"relative"}}>
              <div style={{flex:1,position:"relative"}}>
                <input style={css.inp()} placeholder="Search for a book..." value={form.title}
                  onChange={e=>{setForm(f=>({...f,title:e.target.value}));clearTimeout(debRef.current);debRef.current=setTimeout(()=>searchOL(e.target.value),300);}}/>
                {(olResults.length>0||olSearching)&&(
                  <div style={{position:"absolute",top:"100%",left:0,right:0,background:T.surfaceColor,border:`1.5px solid ${T.borderColor}`,borderRadius:"12px",zIndex:50,maxHeight:"280px",overflowY:"auto",marginTop:"6px",boxShadow:"0 8px 30px rgba(0,0,0,0.12)"}}>
                    {olSearching&&<div style={{padding:"0.75rem",color:T.mutedColor,fontSize:"0.9rem"}}>Searching...</div>}
                    {olResults.map((b,i)=>(
                      <div key={i} onClick={()=>{setForm(f=>({...f,title:b.title,author:b.author,cover_url:b.cover_url_large,pages:String(b.pages||"")}));setOlResults([]);}}
                        style={{display:"flex",gap:"0.75rem",padding:"0.65rem 0.9rem",cursor:"pointer",borderBottom:`1px solid ${T.borderColor}`,alignItems:"center"}}
                        onMouseEnter={e=>e.currentTarget.style.background=T.bgColor}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        {b.cover_url?<img src={b.cover_url} style={{width:"34px",height:"48px",objectFit:"cover",borderRadius:"4px",flexShrink:0}} alt=""/>:<div style={{width:"34px",height:"48px",background:T.borderColor,borderRadius:"4px",flexShrink:0}}/>}
                        <div><div style={{fontWeight:600,fontSize:"0.9rem"}}>{b.title}</div><div style={{color:T.mutedColor,fontSize:"0.78rem"}}>{b.author}{b.pages?` · ${b.pages}pp`:""}</div></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button style={{...css.btn(),boxShadow:`0 2px 8px ${T.accentColor}30`}} onClick={autoFill} disabled={aiLoading}>
                <SvgIcon path={ICONS.sparkle} size={14} color="#fff"/>
                {aiLoading?(fillStep||"Filling..."):"Auto-fill"}
              </button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1.25rem"}}>
            <div><label style={css.lbl}>Author</label><input style={css.inp()} placeholder="Author name" value={form.author} onChange={e=>setForm(f=>({...f,author:e.target.value}))}/></div>
            <div><label style={css.lbl}>Pages</label><input style={css.inp()} type="number" placeholder="Page count" value={form.pages} onChange={e=>setForm(f=>({...f,pages:e.target.value}))}/></div>
            <div><label style={css.lbl}>Status</label>
              <select style={css.sel} value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                {STATUSES.map(st=><option key={st}>{st}</option>)}
              </select>
            </div>
            <div><label style={css.lbl}>Date Read</label><input style={css.inp()} type="date" value={form.date_read} onChange={e=>setForm(f=>({...f,date_read:e.target.value}))}/></div>
            <div style={{gridColumn:"1/-1"}}><label style={css.lbl}>Rating</label><StarRating value={form.rating} onChange={v=>setForm(f=>({...f,rating:v}))} accent={T.accentColor}/></div>
          </div>
          <div style={{marginBottom:"1.25rem"}}>
            <label style={css.lbl}>Genres</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
              {allGenres.map(g=>{
                const sel=form.genres.includes(g);
                const c=colorMap[g]||DEFAULT_GENRE_COLORS[g]||"#6b7280";
                return(
                  <button key={g} onClick={()=>toggleGenre(g)} style={{display:"inline-flex",alignItems:"center",gap:"4px",padding:"0.28rem 0.7rem",borderRadius:"8px",border:`1.5px solid ${sel?c:T.borderColor}`,background:sel?c+"20":"transparent",color:sel?c:T.mutedColor,cursor:"pointer",fontSize:"0.8rem",fontWeight:600,transition:"all 0.12s"}}>
                    <GenreIcon genre={g} iconMap={iconMap} colorMap={colorMap} size={10}/>{g}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{marginBottom:"1.25rem"}}>
            <label style={css.lbl}>Cover Image</label>
            {form.cover_url&&!manualCover
              ?<div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}><img src={form.cover_url} style={{height:"60px",borderRadius:"8px"}} alt="cover" onError={e=>e.target.style.display="none"}/><button style={{...css.btn(T.borderColor,T.textColor,{fontSize:"0.8rem",padding:"0.3rem 0.65rem"})}} onClick={()=>setManualCover(true)}>Change</button></div>
              :<input style={css.inp()} placeholder="Paste image URL or leave blank" value={form.cover_url} onChange={e=>setForm(f=>({...f,cover_url:e.target.value}))}/>}
          </div>
          <div style={{marginBottom:"1.5rem"}}>
            <label style={css.lbl}>Notes / Summary</label>
            <textarea style={{...css.inp(),minHeight:"90px",resize:"vertical"}} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Your thoughts..."/>
          </div>
          <div style={{display:"flex",gap:"0.6rem"}}>
            <button style={{...css.btn(),boxShadow:`0 2px 10px ${T.accentColor}30`}} onClick={saveBook}>{editMode?"Save Changes":"Add Book"}</button>
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
        <BubbleBg/>{toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
        <Hdr backTo={backTo}/>
        <div style={{...css.main,maxWidth:"900px"}}>
          <div style={{...css.section(),display:"flex",gap:"2.5rem",flexWrap:"wrap",padding:"2.5rem"}}>
            <div style={{flexShrink:0}}>
              {book.cover_url
                ?<img src={book.cover_url} alt="cover" style={{width:"200px",borderRadius:"14px",display:"block",boxShadow:"0 8px 32px rgba(0,0,0,0.18)"}} onError={e=>e.target.style.display="none"}/>
                :<div style={{width:"200px",height:"280px",background:book.spineColor||T.borderColor,borderRadius:"14px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 32px rgba(0,0,0,0.12)"}}><SvgIcon path={ICONS.book} size={48} color="rgba(255,255,255,0.5)"/></div>}
            </div>
            <div style={{flex:1,minWidth:"220px"}}>
              <h1 style={{margin:"0 0 0.3rem",fontSize:"1.9rem",fontWeight:800,lineHeight:1.2,letterSpacing:"-0.5px"}}>{book.title}</h1>
              {book.author&&<p style={{color:T.mutedColor,margin:"0 0 1rem",fontSize:"1.05rem"}}>by {book.author}</p>}
              <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"1rem"}}>
                {(book.genres||[]).map(g=><span key={g} style={css.tag(g)}><GenreIcon genre={g} iconMap={iconMap} colorMap={colorMap} size={11}/>{g}</span>)}
              </div>
              {book.rating>0&&<div style={{color:"#f59e0b",fontSize:"1.4rem",marginBottom:"0.5rem",letterSpacing:"2px"}}>{"★".repeat(book.rating)}{"☆".repeat(5-book.rating)}</div>}
              <div style={{display:"flex",gap:"1.5rem",fontSize:"0.9rem",color:T.mutedColor,marginBottom:"1.25rem"}}>
                {book.pages&&<span>{book.pages} pages</span>}
                {book.date_read&&<span>Finished {book.date_read}</span>}
              </div>
              {book.notes&&<p style={{margin:"0 0 1.25rem",lineHeight:1.75,fontSize:"1rem",color:T.textColor}}>{book.notes}</p>}
              <div style={{display:"flex",gap:"0.6rem",flexWrap:"wrap"}}>
                <button style={{...css.btn(),boxShadow:`0 2px 8px ${T.accentColor}30`}} onClick={()=>{setForm({title:book.title,author:book.author||"",genres:book.genres||[],status:book.status,rating:book.rating||0,notes:book.notes||"",date_read:book.date_read||"",cover_url:book.cover_url||"",pages:String(book.pages||"")});setEditMode(true);setManualCover(false);}}>
                  <SvgIcon path={ICONS.edit} size={14} color="#fff"/>Edit
                </button>
                {book.status==="Currently Reading"&&(
                  <button style={css.btn("#ecfdf5","#065f46",{border:"1px solid #a7f3d0"})} onClick={()=>markFinished(book)}>
                    <SvgIcon path={ICONS.check} size={14} color="#065f46"/>Mark as Finished
                  </button>
                )}
                <button style={css.btn("#8b5cf6")} onClick={async()=>{setAiLoading(true);setAiResult("");try{setAiResult(await callClaude(`Book: "${book.title}" by ${book.author}. Rating: ${book.rating}★.`,"Generate 3 warm, reflective insights or questions about this book."));}catch{setAiResult("Couldn't generate notes.");}setAiLoading(false);}}>
                  <SvgIcon path={ICONS.sparkle} size={14} color="#fff"/>{aiLoading?"Thinking...":"Smart Notes"}
                </button>
                <button style={css.btn("#ef4444")} onClick={()=>deleteBook(book.id)}>
                  <SvgIcon path={ICONS.trash} size={14} color="#fff"/>Delete
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
    const rows=[];for(let i=0;i<finished.length;i+=8)rows.push(finished.slice(i,i+8));
    return(
      <div style={css.app}>
        <BubbleBg/>{toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
        <Hdr/>
        <div style={css.main}>
          <div style={{marginBottom:"2rem"}}>
            <h2 style={{fontWeight:800,margin:"0 0 0.25rem",fontSize:"1.4rem"}}>Finished</h2>
            <p style={{color:T.mutedColor,margin:0,fontSize:"0.95rem"}}>{finished.length} book{finished.length!==1?"s":""} completed</p>
          </div>
          {finished.length===0?(
            <div style={{textAlign:"center",marginTop:"4rem",color:T.mutedColor}}>
              <SvgIcon path={ICONS.shelves} size={44} color={T.borderColor}/>
              <p style={{marginTop:"1rem",fontSize:"1rem"}}>No finished books yet</p>
            </div>
          ):rows.map((row,ri)=>(
            <div key={ri} style={{marginBottom:"3rem"}}>
              <div style={{display:"flex",alignItems:"flex-end",gap:"4px",padding:"0 4px"}}>
                {row.map((book,bi)=>{
                  const h=115+((bi*37)%55);const sc=book.spineColor||SPINES[bi%SPINES.length];
                  return(
                    <div key={book.id} title={`${book.title} — ${book.author}`} onClick={()=>{setSelected(book);setView("detail");}}
                      style={{flex:"1",minWidth:"50px",maxWidth:"90px",cursor:"pointer",transition:"transform 0.15s"}}
                      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-12px)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                      {book.cover_url?<img src={book.cover_url} alt={book.title} style={{width:"100%",height:`${h}px`,objectFit:"cover",borderRadius:"2px 6px 6px 2px",boxShadow:"4px 4px 14px rgba(0,0,0,0.18)",display:"block"}} onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}/>:null}
                      <div style={{display:book.cover_url?"none":"flex",width:"100%",height:`${h}px`,background:sc,borderRadius:"2px 6px 6px 2px",boxShadow:"4px 4px 14px rgba(0,0,0,0.18)",alignItems:"center",justifyContent:"center",writingMode:"vertical-rl",fontSize:"0.62rem",fontWeight:700,color:"rgba(255,255,255,0.85)",padding:"4px",boxSizing:"border-box",overflow:"hidden",userSelect:"none"}}>{book.title}</div>
                    </div>
                  );
                })}
                {row.length<8&&[...Array(8-row.length)].map((_,i)=><div key={i} style={{flex:"1",minWidth:"50px",maxWidth:"90px"}}/>)}
              </div>
              <div style={{height:"14px",background:`linear-gradient(to bottom, ${T.borderColor}, ${T.bgColor})`,borderRadius:"2px",margin:"2px 0 0",boxShadow:"0 4px 10px rgba(0,0,0,0.08)"}}/>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── STATS ──
  if(view==="stats"){
    const monthlyData=getMonthlyData();
    const yearlyData=getYearlyData();
    const chartData=statPeriod==="month"?monthlyData:yearlyData;
    const hasData=finished.length>0;
    const donutData=topGenres.map(([g,c])=>({label:g,value:c,color:colorMap[g]||DEFAULT_GENRE_COLORS[g]||"#6b7280"}));
    return(
      <div style={css.app}>
        <BubbleBg/>{toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
        <Hdr/>
        <div style={css.main}>
          <h2 style={{fontWeight:800,marginBottom:"1.5rem",fontSize:"1.4rem"}}>Reading Stats</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"12px",marginBottom:"1.5rem"}}>
            {[["Books Finished",finished.length,T.statFinishedColor],["Pages Read",totalPages.toLocaleString(),T.accentColor],["Avg Rating",avgRating,"#f59e0b"],["Currently Reading",reading.length,T.statReadingColor],["In Queue",nextUp.length,T.mutedColor]].map(([label,val,color])=>(
              <div key={label} style={{background:T.surfaceColor,borderRadius:"14px",padding:"1.25rem",border:`1px solid ${T.borderColor}`,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                <div style={{fontSize:"1.8rem",fontWeight:800,color,lineHeight:1}}>{val}</div>
                <div style={{fontSize:"0.78rem",color:T.mutedColor,marginTop:"0.4rem",fontWeight:500}}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem",marginBottom:"1.25rem"}}>
            <div style={css.section()}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
                <h3 style={{margin:0,fontWeight:700,fontSize:"1rem"}}>Books Read</h3>
                <div style={{display:"flex",gap:"4px"}}>
                  {["month","year"].map(p=>(
                    <button key={p} onClick={()=>setStatPeriod(p)} style={{padding:"0.25rem 0.65rem",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"0.75rem",fontWeight:600,background:statPeriod===p?T.accentColor:"transparent",color:statPeriod===p?"#fff":T.mutedColor}}>{p==="month"?"Monthly":"Yearly"}</button>
                  ))}
                </div>
              </div>
              {hasData?<BarChart data={chartData} color={T.accentColor}/>:<div style={{textAlign:"center",color:T.mutedColor,fontSize:"0.85rem",padding:"1.5rem 0"}}>Not enough data collected</div>}
            </div>
            <div style={css.section()}>
              <h3 style={{margin:"0 0 1rem",fontWeight:700,fontSize:"1rem"}}>Reading Over Time</h3>
              {hasData?<LineChart data={monthlyData} color={T.statFinishedColor}/>:<div style={{textAlign:"center",color:T.mutedColor,fontSize:"0.85rem",padding:"1.5rem 0"}}>Not enough data collected</div>}
            </div>
          </div>
          <div style={css.section()}>
            <h3 style={{margin:"0 0 1.25rem",fontWeight:700,fontSize:"1rem"}}>Genre Breakdown</h3>
            {donutData.length>0?<DonutChart data={donutData}/>:<div style={{textAlign:"center",color:T.mutedColor,fontSize:"0.85rem",padding:"1rem 0"}}>Not enough data collected</div>}
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
        <BubbleBg/>{toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
        <Hdr/>
        <div style={css.main}>
          <h2 style={{fontWeight:800,marginBottom:"1.5rem",fontSize:"1.4rem"}}>Settings</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem"}}>
            <div style={css.section()}>
              <h3 style={{margin:"0 0 1rem",fontWeight:700,fontSize:"0.85rem",color:T.mutedColor,textTransform:"uppercase",letterSpacing:"0.07em"}}>Profile</h3>
              <label style={css.lbl}>Display Name</label>
              <div style={{display:"flex",gap:"0.6rem"}}>
                <input style={{...css.inp(),flex:1}} value={user.name} onChange={e=>setUser(u=>({...u,name:e.target.value}))}/>
                <button style={css.btn()} onClick={()=>{updUser(user);showToast("Saved!");}}>Save</button>
              </div>
            </div>
            <div style={css.section()}>
              <h3 style={{margin:"0 0 1rem",fontWeight:700,fontSize:"0.85rem",color:T.mutedColor,textTransform:"uppercase",letterSpacing:"0.07em"}}>Font</h3>
              <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                {FONTS.map(f=>(
                  <div key={f.value} onClick={()=>updTheme({...T,fontFamily:f.value})} style={{padding:"0.5rem 0.85rem",borderRadius:"10px",cursor:"pointer",fontFamily:f.value,border:`1.5px solid ${T.fontFamily===f.value?T.accentColor:T.borderColor}`,background:T.fontFamily===f.value?T.accentColor+"12":"transparent",fontSize:"0.9rem",transition:"all 0.12s"}}>
                    {f.label} — The quick brown fox
                  </div>
                ))}
              </div>
            </div>
            <div style={css.section()}>
              <h3 style={{margin:"0 0 1rem",fontWeight:700,fontSize:"0.85rem",color:T.mutedColor,textTransform:"uppercase",letterSpacing:"0.07em"}}>Theme Colors</h3>
              {colorFields.map(([key,label])=>(
                <div key={key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.5rem 0",borderBottom:`1px solid ${T.borderColor}`}}>
                  <label style={{...css.lbl,margin:0,fontSize:"0.82rem"}}>{label}</label>
                  <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                    <input type="color" value={T[key]} onChange={e=>updTheme({...T,[key]:e.target.value})} style={{width:"34px",height:"28px",borderRadius:"6px",border:`1px solid ${T.borderColor}`,cursor:"pointer",padding:"1px"}}/>
                    <span style={{fontSize:"0.72rem",color:T.mutedColor,fontFamily:"monospace"}}>{T[key]}</span>
                  </div>
                </div>
              ))}
              <button style={{...css.btn("#ef4444","#fff",{marginTop:"1rem",fontSize:"0.82rem"})}} onClick={()=>{updTheme(DEFAULTS);showToast("Reset!");}}>Reset to Default</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
              <div style={css.section()}>
                <h3 style={{margin:"0 0 1rem",fontWeight:700,fontSize:"0.85rem",color:T.mutedColor,textTransform:"uppercase",letterSpacing:"0.07em"}}>Custom Genres</h3>
                <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.75rem"}}>
                  <input style={{...css.inp(),flex:1}} placeholder="Genre name..." value={newGenreName} onChange={e=>setNewGenreName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustomGenre()}/>
                  <input type="color" value={newGenreColor} onChange={e=>setNewGenreColor(e.target.value)} style={{width:"44px",height:"44px",borderRadius:"10px",border:`1.5px solid ${T.borderColor}`,cursor:"pointer",padding:"2px"}}/>
                  <button style={css.btn()} onClick={addCustomGenre}><SvgIcon path={ICONS.plus} size={14} color="#fff"/></button>
                </div>
                {customGenres.length>0&&(
                  <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
                    {customGenres.map(g=>(
                      <span key={g} style={{...css.tag(g),cursor:"pointer"}} onClick={()=>{if(window.confirm(`Delete "${g}"?`)){updCustomGenres(customGenres.filter(x=>x!==g));showToast(`Removed "${g}"`);}}}> 
                        <GenreIcon genre={g} iconMap={iconMap} colorMap={colorMap} size={10}/>{g} ×
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{...css.section(),maxHeight:"380px",overflowY:"auto"}}>
                <h3 style={{margin:"0 0 1rem",fontWeight:700,fontSize:"0.85rem",color:T.mutedColor,textTransform:"uppercase",letterSpacing:"0.07em"}}>Genre Icons & Colors</h3>
                {allGenres.map(g=>(
                  <div key={g} style={{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.4rem 0",borderBottom:`1px solid ${T.borderColor}`}}>
                    <GenreIcon genre={g} iconMap={iconMap} colorMap={colorMap} size={14}/>
                    <span style={{flex:1,fontSize:"0.85rem",fontWeight:500}}>{g}</span>
                    <input type="color" value={colorMap[g]||DEFAULT_GENRE_COLORS[g]||"#6b7280"} onChange={e=>updGenreColors({...genreColors,[g]:e.target.value})} style={{width:"28px",height:"24px",borderRadius:"5px",border:`1px solid ${T.borderColor}`,cursor:"pointer",padding:"1px"}}/>
                    <select style={{...css.sel,width:"auto",fontSize:"0.76rem",padding:"0.22rem 0.5rem"}} value={iconMap[g]||DEFAULT_GENRE_ICONS[g]||"book"} onChange={e=>updGenreIcons({...genreIcons,[g]:e.target.value})}>
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
  if(view==="ai")return(
    <div style={css.app}>
      <BubbleBg/>{toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
      <Hdr/>
      <div style={css.main}>
        <h2 style={{fontWeight:800,marginBottom:"1.5rem",fontSize:"1.4rem"}}>AI Features</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem",marginBottom:"1.25rem"}}>
          <div style={css.section()}>
            <h3 style={{margin:"0 0 0.4rem",fontWeight:700,fontSize:"1rem"}}>Recommendations</h3>
            <p style={{color:T.mutedColor,fontSize:"0.9rem",margin:"0 0 1rem",lineHeight:1.6}}>Picks based on your reading history.</p>
            <button style={{...css.btn(),boxShadow:`0 2px 8px ${T.accentColor}30`}} onClick={async()=>{setAiLoading(true);setAiResult("");try{const f=finished.map(b=>`${b.title} by ${b.author}`).join(", ");setAiResult(await callClaude(`Finished: ${f||"none"}.`,"Suggest 5 books. Format: **Title** by Author — one sentence why."));}catch{setAiResult("Couldn't get recommendations.");}setAiLoading(false);}} disabled={aiLoading}>
              <SvgIcon path={ICONS.sparkle} size={14} color="#fff"/>{aiLoading?"Thinking...":"Get Recommendations"}
            </button>
          </div>
          <div style={css.section()}>
            <h3 style={{margin:"0 0 0.4rem",fontWeight:700,fontSize:"1rem"}}>Mood Picker</h3>
            <p style={{color:T.mutedColor,fontSize:"0.9rem",margin:"0 0 0.6rem",lineHeight:1.6}}>Tell me how you're feeling.</p>
            <input style={{...css.inp(),marginBottom:"0.75rem"}} placeholder="e.g. cozy, adventurous..." value={mood} onChange={e=>setMood(e.target.value)}/>
            <button style={css.btn("#d97706")} onClick={async()=>{if(!mood.trim())return showToast("Describe your mood!","error");setAiLoading(true);setAiResult("");try{const w=nextUp.map(b=>`${b.title} by ${b.author}`).join(", ");setAiResult(await callClaude(`Mood: "${mood}". Next-Up: ${w||"none"}.`,"Suggest 3 books from list, or general picks. Be warm and brief."));}catch{setAiResult("Couldn't get suggestions.");}setAiLoading(false);}} disabled={aiLoading}>{aiLoading?"Thinking...":"Suggest"}</button>
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
      <BubbleBg/>{toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
      <Hdr/>
      <div style={css.main}>
        {!isNextUp&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"2rem"}}>
            {[["Total Books",books.length,T.statTotalColor,"bookshelf"],["Finished",finished.length,T.statFinishedColor,"finished"],["Reading",reading.length,T.statReadingColor,"bookshelf"]].map(([label,val,color,linkTo])=>(
              <div key={label} onClick={()=>setView(linkTo)} style={{background:T.surfaceColor,borderRadius:"14px",padding:"1.25rem 1.5rem",border:`1px solid ${T.borderColor}`,cursor:"pointer",transition:"all 0.15s",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",display:"flex",alignItems:"center",gap:"1rem"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=color;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 6px 20px ${color}20`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.borderColor;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.04)";}}>
                <div style={{width:"10px",height:"10px",borderRadius:"50%",background:color,flexShrink:0,boxShadow:`0 0 8px ${color}60`}}/>
                <div>
                  <div style={{fontSize:"1.6rem",fontWeight:800,color,lineHeight:1}}>{val}</div>
                  <div style={{fontSize:"0.8rem",color:T.mutedColor,marginTop:"3px",fontWeight:500}}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {isNextUp&&<div style={{...css.card,padding:"0.85rem 1.25rem",marginBottom:"1.5rem",display:"flex",alignItems:"center",gap:"0.6rem"}}><SvgIcon path={ICONS.bookmark} size={15} color={T.mutedColor}/><span style={{fontSize:"0.95rem",color:T.mutedColor}}><strong style={{color:T.textColor}}>{nextUp.length}</strong> book{nextUp.length!==1?"s":""} queued</span></div>}
        <div style={{display:"flex",gap:"0.75rem",marginBottom:"1.5rem",flexWrap:"wrap"}}>
          <input style={{...css.inp(),maxWidth:"240px"}} placeholder="Search..." value={fSearch} onChange={e=>setFSearch(e.target.value)}/>
          <select style={{...css.sel,width:"auto"}} value={fGenre} onChange={e=>setFGenre(e.target.value)}>
            <option>All</option>{allGenres.map(g=><option key={g}>{g}</option>)}
          </select>
        </div>
        {displayList.length===0?(
          <div style={{textAlign:"center",marginTop:"5rem",color:T.mutedColor}}>
            <SvgIcon path={ICONS.book} size={44} color={T.borderColor}/>
            <p style={{marginTop:"1rem",fontSize:"1rem"}}>{isNextUp?"Nothing queued yet":"Not currently reading anything"}</p>
            <button style={{...css.btn(T.accentColor,"#fff",{marginTop:"0.75rem",boxShadow:`0 2px 10px ${T.accentColor}30`})}} onClick={()=>{setForm({...emptyForm,status:isNextUp?"Want to Read":"Currently Reading"});setAddingTo(view);setView("add");}}>Add a Book</button>
          </div>
        ):(
          <div style={css.grid}>{displayList.map(book=><BookCard key={book.id} book={book}/>)}</div>
        )}
      </div>
    </div>
  );
}