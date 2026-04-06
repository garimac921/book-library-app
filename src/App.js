import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

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
  {label:"System UI",value:"'Segoe UI',sans-serif"},
  {label:"Inter",value:"'Inter',sans-serif"},
  {label:"Georgia Serif",value:"Georgia,serif"},
  {label:"Playfair",value:"'Playfair Display',serif"},
  {label:"Mono",value:"'Courier New',monospace"},
  {label:"Futura",value:"'Trebuchet MS',sans-serif"},
  {label:"Garamond",value:"Garamond,serif"},
  {label:"Helvetica",value:"'Helvetica Neue',Arial,sans-serif"},
];
const DEFAULTS = {
  bgFrom:"#3b4fd8",bgTo:"#a855f7",
  accentColor:"#c084fc",textColor:"#ffffff",mutedColor:"rgba(255,255,255,0.65)",
  statFinishedColor:"#34d399",statReadingColor:"#f97316",statTotalColor:"#a78bfa",
  fontFamily:"'Segoe UI',sans-serif"
};
const GENRE_ICON_OPTIONS = [
  {id:"book",path:"M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"},
  {id:"star",path:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"},
  {id:"sword",path:"M14.5 17.5L3 6V3h3l11.5 11.5M14.5 17.5l2 2.5-1 1-2.5-2M14.5 17.5L16 16M7 7L5.5 5.5"},
  {id:"moon",path:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"},
  {id:"heart",path:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"},
  {id:"brain",path:"M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.98-3 2.5 2.5 0 0 1-1.32-4.24 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.96-3.1A2.5 2.5 0 0 1 9.5 2"},
  {id:"fire",path:"M8.5 14.5s-1.5-2 0-4c.7-1 2.5-2 2.5-4C14 8 16 11 13 14c1 0 2.5-.5 2.5-2 .5 1 1.5 3 0 5-1 1.5-3 2-4.5 2s-3.5-1-3.5-3c0-1 .5-2 1-1.5z"},
  {id:"ghost",path:"M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"},
  {id:"crown",path:"M3 20h18M5 20V10l7-7 7 7v10"},
  {id:"compass",path:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm4.95-14.95l-9.9 9.9"},
  {id:"flask",path:"M6 2v6l-4 10a2 2 0 0 0 1.87 2.71h12.26A2 2 0 0 0 18 18L14 8V2M6 2h12M9 2v3"},
  {id:"music",path:"M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"},
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
  "Fiction":"#a78bfa","Non-Fiction":"#60a5fa","Fantasy":"#c084fc","High Fantasy":"#818cf8",
  "Dark Fantasy":"#6d28d9","Romantasy":"#f472b6","Sci-Fi":"#22d3ee","Mystery":"#94a3b8",
  "Thriller":"#f87171","Horror":"#991b1b","Gothic Horror":"#7c3aed","Dark Gothic Romance":"#db2777",
  "Romance":"#fb7185","Historical Romance":"#fbbf24","Historical Fiction":"#d97706",
  "Contemporary Romance":"#f97316","Biography":"#38bdf8","Memoir":"#06b6d4",
  "History":"#d97706","Self-Help":"#4ade80","Philosophy":"#818cf8","Poetry":"#c084fc",
  "Graphic Novel":"#fb923c","Young Adult":"#fbbf24","Middle Grade":"#4ade80",
  "True Crime":"#f87171","Spirituality":"#818cf8","Action":"#f87171","Dystopian":"#a16207",
  "Royalty":"#fbbf24","Favorite":"#f59e0b","Other":"#94a3b8"
};

const SPINES=["#e11d48","#7c3aed","#2563eb","#059669","#d97706","#0891b2","#9333ea","#b45309"];

const glass=(extra={})=>({
  background:"rgba(255,255,255,0.12)",backdropFilter:"blur(16px)",
  WebkitBackdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.2)",
  borderRadius:"20px",boxShadow:"0 8px 32px rgba(0,0,0,0.2)",...extra
});

const SvgIcon=({path,size=16,color="currentColor",sw=2})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d={path}/></svg>
);
const GenreIcon=({genre,iconMap,colorMap,size=12})=>{
  const id=iconMap[genre]||DEFAULT_GENRE_ICONS[genre]||"book";
  const color=colorMap[genre]||DEFAULT_GENRE_COLORS[genre]||"#94a3b8";
  const opt=GENRE_ICON_OPTIONS.find(o=>o.id===id)||GENRE_ICON_OPTIONS[0];
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d={opt.path}/></svg>;
};
const ICONS={
  book:"M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z",
  bookmark:"M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
  settings:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  chart:"M18 20V10M12 20V4M6 20v-6M2 20h20",
  shelves:"M2 3h20v4H2zM2 10h20v4H2zM2 17h20v4H2z",
  plus:"M12 5v14M5 12h14",
  back:"M19 12H5M12 19l-7-7 7-7",
  edit:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:"M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6",
  check:"M20 6L9 17l-5-5",
};

const StarRating=({value,onChange})=>(
  <div style={{display:"flex",gap:"4px"}}>
    {[1,2,3,4,5].map(s=>(
      <button key={s} onClick={()=>onChange(s)} style={{background:"none",border:"none",cursor:"pointer",fontSize:"1.8rem",color:s<=value?"#fbbf24":"rgba(255,255,255,0.3)",padding:0,lineHeight:1,filter:s<=value?"drop-shadow(0 0 6px #fbbf24aa)":"none"}}>★</button>
    ))}
  </div>
);

const BarChart=({data,color})=>{
  const max=Math.max(...data.map(d=>d.value),1);
  return(
    <div style={{width:"100%"}}>
      <div style={{display:"flex",alignItems:"flex-end",gap:"8px",height:"90px",marginBottom:"8px"}}>
        {data.map((d,i)=>(
          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:"100%",gap:"4px"}}>
            {d.value>0&&<span style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.7)",fontWeight:600}}>{d.value}</span>}
            <div style={{width:"100%",background:d.value>0?`linear-gradient(to top,${color},${color}88)`:"rgba(255,255,255,0.1)",borderRadius:"6px 6px 0 0",height:`${Math.max((d.value/max)*100,d.value>0?8:3)}%`,transition:"height 0.5s ease"}}/>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:"8px"}}>
        {data.map((d,i)=><div key={i} style={{flex:1,textAlign:"center",fontSize:"0.65rem",color:"rgba(255,255,255,0.5)"}}>{d.label}</div>)}
      </div>
    </div>
  );
};

const DonutChart=({data})=>{
  const total=data.reduce((a,b)=>a+b.value,0);
  if(total===0)return<div style={{textAlign:"center",color:"rgba(255,255,255,0.4)",fontSize:"0.9rem",padding:"1.5rem"}}>Not enough data collected</div>;
  let cum=0;const size=150,cx=75,cy=75,r=52,ir=32;
  const slices=data.filter(d=>d.value>0).map(d=>{
    const pct=d.value/total,start=cum*2*Math.PI-Math.PI/2;cum+=pct;const end=cum*2*Math.PI-Math.PI/2,large=pct>0.5?1:0;
    const x1=cx+r*Math.cos(start),y1=cy+r*Math.sin(start),x2=cx+r*Math.cos(end),y2=cy+r*Math.sin(end);
    const ix1=cx+ir*Math.cos(start),iy1=cy+ir*Math.sin(start),ix2=cx+ir*Math.cos(end),iy2=cy+ir*Math.sin(end);
    return{...d,path:`M${ix1},${iy1} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${ir},${ir} 0 ${large},0 ${ix1},${iy1} Z`};
  });
  return(
    <div style={{display:"flex",alignItems:"center",gap:"1.5rem",flexWrap:"wrap"}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
        {slices.map((s,i)=><path key={i} d={s.path} fill={s.color} opacity="0.9"/>)}
        <text x={cx} y={cy-6} textAnchor="middle" fontSize="18" fontWeight="700" fill="white">{total}</text>
        <text x={cx} y={cy+10} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.6)">books</text>
      </svg>
      <div style={{display:"flex",flexDirection:"column",gap:"6px",flex:1}}>
        {slices.slice(0,7).map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"0.8rem"}}>
            <div style={{width:"10px",height:"10px",borderRadius:"50%",background:s.color,flexShrink:0}}/>
            <span style={{color:"rgba(255,255,255,0.8)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.label}</span>
            <span style={{color:"rgba(255,255,255,0.5)",fontWeight:600}}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LineChart=({data,color})=>{
  const max=Math.max(...data.map(d=>d.value),1);
  const w=300,h=90,pad=10;
  if(data.every(d=>d.value===0))return<div style={{textAlign:"center",color:"rgba(255,255,255,0.4)",fontSize:"0.9rem",padding:"1.5rem"}}>Not enough data collected</div>;
  const pts=data.map((d,i)=>({x:pad+(i/(data.length-1||1))*(w-pad*2),y:h-pad-(d.value/max)*(h-pad*2)}));
  const pathD=pts.map((p,i)=>i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`).join(" ");
  const areaD=`${pathD} L${pts[pts.length-1].x},${h} L${pts[0].x},${h} Z`;
  return(
    <div style={{width:"100%"}}>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{overflow:"visible"}}>
        <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.4"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
        <path d={areaD} fill="url(#lg)"/>
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="4" fill={color}/>)}
      </svg>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:"6px"}}>
        {data.map((d,i)=><span key={i} style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.45)"}}>{d.label}</span>)}
      </div>
    </div>
  );
};

const emptyForm={title:"",author:"",genres:[],status:"Currently Reading",rating:0,notes:"",date_read:"",cover_url:"",pages:""};

// ── AUTH SCREEN ──
const AuthScreen=()=>{
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");
  const inp={width:"100%",padding:"0.75rem 1rem",borderRadius:"12px",border:"1.5px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.1)",color:"#fff",fontSize:"0.95rem",boxSizing:"border-box",outline:"none",marginBottom:"0.75rem"};
  const handle=async()=>{
    setError("");setSuccess("");setLoading(true);
    if(mode==="login"){
      const{error:e}=await supabase.auth.signInWithPassword({email,password});
      if(e)setError(e.message);
    } else if(mode==="signup"){
      const{error:e}=await supabase.auth.signUp({email,password});
      if(e)setError(e.message);
      else setSuccess("Check your email to confirm your account, then log in!");
    } else {
      const{error:e}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});
      if(e)setError(e.message);
      else setSuccess("Password reset email sent!");
    }
    setLoading(false);
  };
  return(
    <div style={{fontFamily:"'Segoe UI',sans-serif",minHeight:"100vh",background:"linear-gradient(135deg,#3b4fd8 0%,#a855f7 100%)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{...glass({borderRadius:"28px"}),maxWidth:"420px",width:"90%",padding:"3rem",textAlign:"center"}}>
        <SvgIcon path={ICONS.book} size={44} color="#c084fc"/>
        <h2 style={{margin:"1rem 0 0.3rem",fontWeight:800,fontSize:"1.8rem",color:"#fff"}}>My Book Library</h2>
        <p style={{color:"rgba(255,255,255,0.55)",marginBottom:"2rem",fontSize:"0.95rem"}}>
          {mode==="login"?"Sign in to your library":mode==="signup"?"Create your library":"Reset your password"}
        </p>
        {error&&<div style={{background:"rgba(239,68,68,0.2)",border:"1px solid rgba(239,68,68,0.4)",borderRadius:"10px",padding:"0.75rem",marginBottom:"1rem",color:"#fca5a5",fontSize:"0.88rem"}}>{error}</div>}
        {success&&<div style={{background:"rgba(16,185,129,0.2)",border:"1px solid rgba(16,185,129,0.4)",borderRadius:"10px",padding:"0.75rem",marginBottom:"1rem",color:"#6ee7b7",fontSize:"0.88rem"}}>{success}</div>}
        <input style={inp} placeholder="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        {mode!=="reset"&&<input style={inp} placeholder="Password (min 6 chars)" type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>}
        <button style={{width:"100%",padding:"0.85rem",borderRadius:"999px",border:"none",cursor:"pointer",fontWeight:700,fontSize:"1rem",background:"rgba(255,255,255,0.95)",color:"#7c3aed",boxShadow:"0 4px 16px rgba(0,0,0,0.25)",marginBottom:"1.25rem",marginTop:"0.25rem"}} onClick={handle} disabled={loading}>
          {loading?"...":{login:"Sign In",signup:"Create Account",reset:"Send Reset Email"}[mode]}
        </button>
        <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
          {mode==="login"&&<><button style={{background:"none",border:"none",color:"rgba(255,255,255,0.6)",cursor:"pointer",fontSize:"0.88rem"}} onClick={()=>{setMode("signup");setError("");setSuccess("");}}>Don't have an account? Sign up</button><button style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:"0.82rem"}} onClick={()=>{setMode("reset");setError("");setSuccess("");}}>Forgot password?</button></>}
          {mode==="signup"&&<button style={{background:"none",border:"none",color:"rgba(255,255,255,0.6)",cursor:"pointer",fontSize:"0.88rem"}} onClick={()=>{setMode("login");setError("");setSuccess("");}}>Already have an account? Sign in</button>}
          {mode==="reset"&&<button style={{background:"none",border:"none",color:"rgba(255,255,255,0.6)",cursor:"pointer",fontSize:"0.88rem"}} onClick={()=>{setMode("login");setError("");setSuccess("");}}>Back to sign in</button>}
        </div>
      </div>
    </div>
  );
};

// ── ADD/EDIT (top-level to prevent focus loss) ──
const AddEditView=({editMode,form,setForm,olResults,setOlResults,olSearching,searchOL,allGenres,colorMap,iconMap,manualCover,setManualCover,saveBook,onBack,STATUSES,debRef})=>{
  const inp=(x={})=>({width:"100%",padding:"0.75rem 1rem",borderRadius:"12px",border:"1.5px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.1)",color:"#fff",fontSize:"0.95rem",boxSizing:"border-box",outline:"none",...x});
  const sel={width:"100%",padding:"0.75rem 1rem",borderRadius:"12px",border:"1.5px solid rgba(255,255,255,0.2)",background:"rgba(30,20,60,0.5)",color:"#fff",fontSize:"0.95rem"};
  const lbl={fontSize:"0.75rem",color:"rgba(255,255,255,0.6)",marginBottom:"0.4rem",display:"block",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"};
  const btn=(bg,fg="#fff",x={})=>({display:"inline-flex",alignItems:"center",gap:"6px",padding:"0.6rem 1.3rem",borderRadius:"999px",border:"none",cursor:"pointer",fontWeight:700,fontSize:"0.88rem",background:bg,color:fg,boxShadow:"0 4px 14px rgba(0,0,0,0.25)",...x});
  const toggleGenre=g=>setForm(f=>({...f,genres:f.genres.includes(g)?f.genres.filter(x=>x!==g):[...f.genres,g]}));
  return(
    <div style={{...glass({borderRadius:"20px"}),padding:"1.75rem"}}>
      <div style={{marginBottom:"1.25rem"}}>
        <label style={lbl}>Book Title</label>
        <div style={{position:"relative"}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOlResults([]);}}>
          <input style={inp()} placeholder="Search or type a title manually..." value={form.title}
            onChange={e=>{const v=e.target.value;setForm(f=>({...f,title:v}));clearTimeout(debRef.current);debRef.current=setTimeout(()=>searchOL(v),250);}}/>
          {(olResults.length>0||olSearching)&&(
            <div style={{position:"absolute",top:"100%",left:0,right:0,...glass({borderRadius:"16px"}),zIndex:50,maxHeight:"280px",overflowY:"auto",marginTop:"8px"}}>
              {olSearching&&<div style={{padding:"0.85rem",color:"rgba(255,255,255,0.6)",fontSize:"0.9rem"}}>Searching...</div>}
              {olResults.map((b,i)=>(
                <div key={i} tabIndex={-1} onMouseDown={e=>{e.preventDefault();setForm(f=>({...f,title:b.title,author:b.author,cover_url:b.cover_url_large,pages:String(b.pages||"")}));setOlResults([]);}}
                  style={{display:"flex",gap:"0.75rem",padding:"0.65rem 0.9rem",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.1)",alignItems:"center"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  {b.cover_url?<img src={b.cover_url} style={{width:"34px",height:"48px",objectFit:"cover",borderRadius:"6px",flexShrink:0}} alt=""/>:<div style={{width:"34px",height:"48px",background:"rgba(255,255,255,0.1)",borderRadius:"6px",flexShrink:0}}/>}
                  <div><div style={{fontWeight:600,fontSize:"0.9rem"}}>{b.title}</div><div style={{color:"rgba(255,255,255,0.5)",fontSize:"0.78rem"}}>{b.author}{b.pages?` · ${b.pages}pp`:""}</div></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1.25rem"}}>
        <div><label style={lbl}>Author</label><input style={inp()} placeholder="Author name" value={form.author} onChange={e=>setForm(f=>({...f,author:e.target.value}))}/></div>
        <div><label style={lbl}>Pages</label><input style={inp()} type="number" placeholder="Page count" value={form.pages} onChange={e=>setForm(f=>({...f,pages:e.target.value}))}/></div>
        <div><label style={lbl}>Status</label><select style={sel} value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{STATUSES.map(st=><option key={st}>{st}</option>)}</select></div>
        <div><label style={lbl}>Date Read</label><input style={inp()} type="date" value={form.date_read} onChange={e=>setForm(f=>({...f,date_read:e.target.value}))}/></div>
        <div style={{gridColumn:"1/-1"}}><label style={lbl}>Rating</label><StarRating value={form.rating} onChange={v=>setForm(f=>({...f,rating:v}))}/></div>
      </div>
      <div style={{marginBottom:"1.25rem"}}>
        <label style={lbl}>Genres</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
          {allGenres.map(g=>{
            const sel2=form.genres.includes(g);const c=colorMap[g]||DEFAULT_GENRE_COLORS[g]||"#94a3b8";
            return<button key={g} onClick={()=>toggleGenre(g)} style={{display:"inline-flex",alignItems:"center",gap:"4px",padding:"0.3rem 0.8rem",borderRadius:"999px",border:`1.5px solid ${sel2?c:"rgba(255,255,255,0.2)"}`,background:sel2?c+"30":"rgba(255,255,255,0.05)",color:"#fff",cursor:"pointer",fontSize:"0.8rem",fontWeight:600,boxShadow:sel2?`0 0 10px ${c}50`:""}}>
              <GenreIcon genre={g} iconMap={iconMap} colorMap={colorMap} size={10}/>{g}
            </button>;
          })}
        </div>
      </div>
      <div style={{marginBottom:"1.25rem"}}>
        <label style={lbl}>Cover Image</label>
        {form.cover_url&&!manualCover
          ?<div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}><img src={form.cover_url} style={{height:"64px",borderRadius:"10px"}} alt="cover" onError={e=>e.target.style.display="none"}/><button style={btn("rgba(255,255,255,0.15)","#fff",{fontSize:"0.8rem",padding:"0.3rem 0.75rem"})} onClick={()=>setManualCover(true)}>Change</button></div>
          :<input style={inp()} placeholder="Paste image URL or leave blank" value={form.cover_url} onChange={e=>setForm(f=>({...f,cover_url:e.target.value}))}/>}
      </div>
      <div style={{marginBottom:"1.5rem"}}><label style={lbl}>Notes / Summary</label><textarea style={{...inp(),minHeight:"90px",resize:"vertical"}} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Your thoughts..."/></div>
      <div style={{display:"flex",gap:"0.75rem"}}>
        <button style={btn("rgba(255,255,255,0.95)","#7c3aed")} onClick={saveBook}>{editMode?"Save Changes":"Add Book"}</button>
        <button style={btn("rgba(255,255,255,0.1)","#fff")} onClick={onBack}>Cancel</button>
      </div>
    </div>
  );
};

// ── BOOK CARD (top-level) ──
const BookCard=({book,iconMap,colorMap,markFinished,setSelected,setAiResult,setView})=>{
  const isReading=book.status==="Currently Reading";
  return(
    <div style={{...glass({borderRadius:"20px"}),overflow:"hidden",cursor:"pointer",transition:"all 0.2s"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px) scale(1.02)";e.currentTarget.style.boxShadow="0 20px 50px rgba(0,0,0,0.4)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0) scale(1)";e.currentTarget.style.boxShadow=glass().boxShadow;}}>
      <div onClick={()=>{setSelected(book);setAiResult("");setView("detail");}}>
        <div style={{width:"100%",paddingTop:"148%",position:"relative",overflow:"hidden",background:book.spineColor||"#7c3aed",borderRadius:"20px 20px 0 0"}}>
          {book.cover_url&&<img src={book.cover_url} alt="cover" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",display:"block"}} onError={e=>e.target.style.display="none"}/>}
          {!book.cover_url&&<div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}><SvgIcon path={ICONS.book} size={40} color="rgba(255,255,255,0.4)"/></div>}
        </div>
        <div style={{padding:"14px 14px 10px"}}>
          <div style={{fontWeight:700,fontSize:"1rem",lineHeight:1.3,marginBottom:"4px",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{book.title}</div>
          {book.author&&<div style={{color:"rgba(255,255,255,0.6)",fontSize:"0.82rem",marginBottom:"8px"}}>{book.author}</div>}
          <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"8px"}}>
            {(book.genres||[]).map(g=>{const c=colorMap[g]||DEFAULT_GENRE_COLORS[g]||"#94a3b8";return<span key={g} style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"0.28rem 0.75rem",borderRadius:"999px",fontSize:"0.78rem",fontWeight:700,background:"rgba(0,0,0,0.35)",color:"#fff",border:`1.5px solid ${c}80`}}><GenreIcon genre={g} iconMap={iconMap} colorMap={colorMap} size={10}/>{g}</span>;})}
          </div>
          {book.rating>0&&<div style={{color:"#fbbf24",fontSize:"0.9rem",letterSpacing:"2px"}}>{"★".repeat(book.rating)}{"☆".repeat(5-book.rating)}</div>}
        </div>
      </div>
      {isReading&&(
        <div style={{padding:"0 14px 14px"}}>
          <button style={{display:"inline-flex",alignItems:"center",gap:"6px",padding:"0.45rem 1rem",borderRadius:"12px",border:"1px solid rgba(16,185,129,0.5)",cursor:"pointer",fontWeight:700,fontSize:"0.82rem",background:"rgba(16,185,129,0.3)",color:"#fff",width:"100%",justifyContent:"center"}} onClick={e=>{e.stopPropagation();markFinished(book);}}>
            <SvgIcon path={ICONS.check} size={13} color="#fff"/>Mark as Finished
          </button>
        </div>
      )}
    </div>
  );
};

// ── MAIN APP ──
export default function App(){
  // ── ALL HOOKS FIRST — no early returns before this block ──
  const [authUser,setAuthUser]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
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
  const [aiResult,setAiResult]=useState("");
  const [toast,setToast]=useState({msg:"",type:"success"});
  const [editMode,setEditMode]=useState(false);
  const [olResults,setOlResults]=useState([]);
  const [olSearching,setOlSearching]=useState(false);
  const [manualCover,setManualCover]=useState(false);
  const [addingTo,setAddingTo]=useState("bookshelf");
  const [showOnboard,setShowOnboard]=useState(false);
  const [onboardName,setOnboardName]=useState("");
  const [statPeriod,setStatPeriod]=useState("month");
  const [statsFilter,setStatsFilter]=useState("all");
  const [newGenreName,setNewGenreName]=useState("");
  const [newGenreColor,setNewGenreColor]=useState("#c084fc");
  const [showScrollTop,setShowScrollTop]=useState(false);
  const debRef=useRef(null);

  // Auth listener
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setAuthUser(session?.user??null);
      setAuthLoading(false);
    });
    const{data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      setAuthUser(session?.user??null);
      if(event==="SIGNED_OUT"){setBooks([]);setTheme(DEFAULTS);setUser({name:""});setShowOnboard(false);}
    });
    return()=>subscription.unsubscribe();
  },[]);

  // Scroll listener
  useEffect(()=>{
    const onScroll=()=>setShowScrollTop(window.scrollY>400);
    window.addEventListener("scroll",onScroll);
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);

  // Data loader — only runs once when authUser is set
  useEffect(()=>{
    if(!authUser) return;
    let cancelled=false;
    const init=async()=>{
      const{data:booksData}=await supabase.from("books").select("*").eq("user_id",authUser.id).order("created_at",{ascending:false});
      if(cancelled) return;
      if(booksData) setBooks(booksData.map(b=>({...b,genres:b.genres||[],spineColor:b.spine_color})));
      const{data:settingsData}=await supabase.from("settings").select("*").eq("user_id",authUser.id);
      if(cancelled) return;
      if(settingsData&&settingsData.length>0){
        const m=Object.fromEntries(settingsData.map(s=>[s.key,s.value]));
        if(m.theme) setTheme({...DEFAULTS,...m.theme});
        if(m.genreIcons) setGenreIcons(m.genreIcons);
        if(m.genreColors) setGenreColors(m.genreColors);
        if(m.customGenres) setCustomGenres(m.customGenres);
        if(m.user&&m.user.name) setUser(m.user);
        else{setUser(m.user||{name:""});setShowOnboard(true);}
      } else setShowOnboard(true);
    };
    init();
    return()=>{cancelled=true;};
  },[authUser?.id]);

  // ── NOW safe to do early returns ──
  if(authLoading) return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#3b4fd8 0%,#a855f7 100%)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"1.1rem",fontFamily:"'Segoe UI',sans-serif"}}>
      Loading...
    </div>
  );
  if(!authUser) return <AuthScreen/>;

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast({msg:"",type:"success"}),3000);};
  const signOut=()=>supabase.auth.signOut();
  const saveSetting=async(key,value)=>{await supabase.from("settings").upsert({key,value,user_id:authUser.id});};
  const updTheme=t=>{setTheme(t);saveSetting("theme",t);};
  const updUser=u=>{setUser(u);saveSetting("user",u);};
  const updGenreIcons=m=>{setGenreIcons(m);saveSetting("genreIcons",m);};
  const updGenreColors=m=>{setGenreColors(m);saveSetting("genreColors",m);};
  const updCustomGenres=g=>{setCustomGenres(g);saveSetting("customGenres",g);};

  const T=theme;
  const allGenres=[...BUILT_IN_GENRES,...customGenres];
  const iconMap={...DEFAULT_GENRE_ICONS,...genreIcons};
  const colorMap={...DEFAULT_GENRE_COLORS,...genreColors};

  const upsertBook=async book=>{
    await supabase.from("books").upsert({
      id:book.id,title:book.title,author:book.author,genres:book.genres,
      status:book.status,rating:book.rating||null,notes:book.notes,
      date_read:book.date_read||null,cover_url:book.cover_url,
      pages:book.pages?parseInt(book.pages):null,
      spine_color:book.spineColor,created_at:book.created_at,user_id:authUser.id
    });
  };

  const css={
    app:{fontFamily:T.fontFamily,minHeight:"100vh",background:`linear-gradient(135deg,${T.bgFrom} 0%,${T.bgTo} 100%)`,color:T.textColor,position:"relative"},
    hdr:{...glass({borderRadius:0,borderLeft:"none",borderRight:"none",borderTop:"none"}),padding:"0 2.5rem",height:"72px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100},
    logo:{fontSize:"1.5rem",fontWeight:800,color:"#fff",letterSpacing:"-0.5px",textShadow:"0 2px 12px rgba(0,0,0,0.3)"},
    pill:(a)=>({display:"inline-flex",alignItems:"center",gap:"6px",padding:"0.55rem 1.3rem",borderRadius:"999px",border:a?"none":"1.5px solid rgba(255,255,255,0.3)",cursor:"pointer",fontWeight:700,fontSize:"0.88rem",background:a?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.1)",color:a?"#7c3aed":"rgba(255,255,255,0.85)",transition:"all 0.18s",boxShadow:a?"0 4px 16px rgba(0,0,0,0.25)":"none",transform:a?"translateY(-1px)":"none"}),
    main:{padding:"2.5rem",maxWidth:"1200px",margin:"0 auto"},
    inp:(x={})=>({width:"100%",padding:"0.75rem 1rem",borderRadius:"12px",border:"1.5px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.1)",color:"#fff",fontSize:"0.95rem",boxSizing:"border-box",outline:"none",...x}),
    sel:{width:"100%",padding:"0.75rem 1rem",borderRadius:"12px",border:"1.5px solid rgba(255,255,255,0.2)",background:"rgba(30,20,60,0.5)",color:"#fff",fontSize:"0.95rem"},
    lbl:{fontSize:"0.75rem",color:"rgba(255,255,255,0.6)",marginBottom:"0.4rem",display:"block",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"},
    btn:(bg,fg="#fff",x={})=>({display:"inline-flex",alignItems:"center",gap:"6px",padding:"0.6rem 1.3rem",borderRadius:"999px",border:"none",cursor:"pointer",fontWeight:700,fontSize:"0.88rem",background:bg,color:fg,boxShadow:"0 4px 14px rgba(0,0,0,0.25)",transition:"all 0.15s",...x}),
    tag:(genre)=>{const c=colorMap[genre]||"#94a3b8";return{display:"inline-flex",alignItems:"center",gap:"5px",padding:"0.28rem 0.75rem",borderRadius:"999px",fontSize:"0.78rem",fontWeight:700,background:"rgba(0,0,0,0.35)",color:"#fff",border:`1.5px solid ${c}80`,textShadow:"0 1px 3px rgba(0,0,0,0.5)"};},
    toast:(tp)=>({position:"fixed",bottom:"1.5rem",right:"1.5rem",background:tp==="error"?"rgba(239,68,68,0.95)":"rgba(16,185,129,0.95)",backdropFilter:"blur(12px)",color:"#fff",padding:"0.8rem 1.4rem",borderRadius:"999px",fontWeight:700,zIndex:9999}),
    aiBox:{...glass({borderRadius:"16px"}),padding:"1.5rem",marginTop:"1.25rem",lineHeight:1.8,whiteSpace:"pre-wrap",fontSize:"0.95rem"},
  };

  const scrollBtn=showScrollTop&&(
    <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{position:"fixed",bottom:"2rem",right:"2rem",zIndex:200,width:"44px",height:"44px",borderRadius:"50%",background:"rgba(255,255,255,0.2)",backdropFilter:"blur(12px)",border:"1.5px solid rgba(255,255,255,0.3)",color:"#fff",fontSize:"1.2rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.3)"}}>↑</button>
  );

  const searchOL=async q=>{
    if(!q.trim()||q.length<2){setOlResults([]);return;}
    setOlSearching(true);
    try{
      const r=await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(q)}&limit=5&fields=title,author_name,cover_i,number_of_pages_median`);
      const d=await r.json();
      setOlResults((d.docs||[]).map(b=>({title:b.title,author:b.author_name?.[0]||"Unknown",pages:b.number_of_pages_median||"",cover_url:b.cover_i?`https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`:"",cover_url_large:b.cover_i?`https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg`:""})));
    }catch{setOlResults([]);}
    setOlSearching(false);
  };

  const saveBook=async()=>{
    if(!form.title.trim())return showToast("Title is required!","error");
    const isEdit=editMode&&selected;
    const book={...form,id:isEdit?selected.id:Date.now().toString(),created_at:isEdit?selected.created_at:new Date().toISOString(),spineColor:isEdit?selected.spineColor:SPINES[Math.floor(Math.random()*SPINES.length)]};
    if(isEdit){setBooks(books.map(b=>b.id===book.id?book:b));setSelected(book);showToast("Updated!");setView("detail");setEditMode(false);setForm(emptyForm);}
    else{setBooks([book,...books]);showToast("Book added!");setForm(emptyForm);setView(addingTo);}
    await upsertBook(book);
  };

  const markFinished=async book=>{
    const today=new Date().toISOString().split("T")[0];
    const updated={...book,status:"Finished",date_read:book.date_read||today};
    setBooks(books.map(b=>b.id===book.id?updated:b));
    showToast(`"${book.title}" marked as finished!`);
    await upsertBook(updated);
  };

  const deleteBook=async id=>{
    if(!window.confirm("Delete this book?"))return;
    setBooks(books.filter(b=>b.id!==id));
    showToast("Deleted.");setView("bookshelf");
    await supabase.from("books").delete().eq("id",id);
  };

  const addCustomGenre=()=>{
    const name=newGenreName.trim();
    if(!name)return showToast("Enter a name","error");
    if(allGenres.includes(name))return showToast("Already exists","error");
    updCustomGenres([...customGenres,name]);
    updGenreColors({...genreColors,[name]:newGenreColor});
    updGenreIcons({...genreIcons,[name]:"book"});
    setNewGenreName("");showToast(`Added "${name}"!`);
  };

  const finished=books.filter(b=>b.status==="Finished").sort((a,b)=>{
    const da=a.date_read?new Date(a.date_read):new Date(a.created_at);
    const db=b.date_read?new Date(b.date_read):new Date(b.created_at);
    return db-da;
  });
  const reading=books.filter(b=>b.status==="Currently Reading");
  const nextUp=books.filter(b=>b.status==="Want to Read");
  const now=new Date();
  const thisMonth=finished.filter(b=>b.date_read&&new Date(b.date_read).getMonth()===now.getMonth()&&new Date(b.date_read).getFullYear()===now.getFullYear()).length;
  const genreCounts={};books.forEach(b=>(b.genres||[]).forEach(g=>{genreCounts[g]=(genreCounts[g]||0)+1;}));
  const topGenres=Object.entries(genreCounts).sort((a,b)=>b[1]-a[1]).slice(0,8);

  const getMonthlyData=()=>Array.from({length:6},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-5+i,1);return{label:d.toLocaleString("default",{month:"short"}),value:finished.filter(b=>{if(!b.date_read)return false;const bd=new Date(b.date_read);return bd.getMonth()===d.getMonth()&&bd.getFullYear()===d.getFullYear();}).length};});
  const getYearlyData=()=>Array.from({length:5},(_,i)=>{const y=now.getFullYear()-4+i;return{label:String(y),value:finished.filter(b=>b.date_read&&new Date(b.date_read).getFullYear()===y).length};});

  const applyFilters=list=>list.filter(b=>{
    if(fGenre!=="All"&&!(b.genres||[]).includes(fGenre))return false;
    if(fSearch&&!b.title.toLowerCase().includes(fSearch.toLowerCase())&&!b.author?.toLowerCase().includes(fSearch.toLowerCase()))return false;
    return true;
  });

  const NAV_TABS=[["bookshelf","book","Bookshelf"],["nextup","bookmark","Next-Up"],["finished","shelves","Finished"],["stats","chart","Stats"],["settings","settings","Settings"]];

  const NavTabs=()=>(
    <div style={{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap"}}>
      {NAV_TABS.map(([v,ic,l])=>(
        <button key={v} style={css.pill(view===v)} onClick={()=>{setView(v);setAiResult("");}}>
          <SvgIcon path={ICONS[ic]} size={14} color={view===v?"#7c3aed":"rgba(255,255,255,0.85)"}/>
          {l}
        </button>
      ))}
      <button style={{...css.btn("rgba(255,255,255,0.95)","#7c3aed",{marginLeft:"4px"})}} onClick={()=>{setForm({...emptyForm,status:view==="nextup"?"Want to Read":"Currently Reading"});setAddingTo(view==="nextup"?"nextup":"bookshelf");setEditMode(false);setOlResults([]);setManualCover(false);setView("add");}}>
        <SvgIcon path={ICONS.plus} size={14} color="#7c3aed"/>Add Book
      </button>
    </div>
  );

  const Hdr=({backTo})=>(
    <div style={css.hdr}>
      <span style={css.logo}>{user.name?`${user.name}'s Library`:"My Library"}</span>
      {backTo
        ?<button style={css.pill(false)} onClick={()=>{setView(backTo);setAiResult("");}}><SvgIcon path={ICONS.back} size={14} color="rgba(255,255,255,0.85)"/>Back</button>
        :<div style={{display:"flex",alignItems:"center",gap:"8px"}}><NavTabs/><button style={{...css.pill(false),fontSize:"0.78rem",padding:"0.4rem 0.85rem",opacity:0.6}} onClick={signOut}>Sign Out</button></div>}
    </div>
  );

  // ── ONBOARD ──
  if(showOnboard)return(
    <div style={{...css.app,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <div style={{...glass({borderRadius:"28px"}),maxWidth:"440px",width:"90%",padding:"3.5rem",textAlign:"center"}}>
        <SvgIcon path={ICONS.book} size={44} color="#c084fc"/>
        <h2 style={{margin:"1rem 0 0.5rem",fontWeight:800,fontSize:"1.8rem"}}>Welcome to your Library</h2>
        <p style={{color:"rgba(255,255,255,0.65)",marginBottom:"2rem"}}>What should we call you?</p>
        <input style={{...css.inp(),textAlign:"center",fontSize:"1.1rem",marginBottom:"1rem"}} placeholder="Your name..." value={onboardName} onChange={e=>setOnboardName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&onboardName.trim()){updUser({name:onboardName.trim()});setShowOnboard(false);}}} autoFocus/>
        <button style={{...css.btn("rgba(255,255,255,0.95)","#7c3aed",{width:"100%",justifyContent:"center",padding:"0.85rem",fontSize:"1.05rem",borderRadius:"999px"})}} onClick={()=>{if(onboardName.trim()){updUser({name:onboardName.trim()});setShowOnboard(false);}}}>Enter my Library</button>
      </div>
    </div>
  );

  // ── ADD/EDIT ──
  if(view==="add"||(view==="detail"&&editMode))return(
    <div style={css.app}>
      {toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
      <Hdr backTo={editMode?"detail":addingTo}/>
      <div style={css.main}>
        <h2 style={{fontWeight:800,marginBottom:"1.5rem",fontSize:"1.4rem"}}>{editMode?"Edit Book":`Add to ${addingTo==="nextup"?"Next-Up":"Bookshelf"}`}</h2>
        <AddEditView editMode={editMode} form={form} setForm={setForm} olResults={olResults} setOlResults={setOlResults} olSearching={olSearching} searchOL={searchOL} allGenres={allGenres} colorMap={colorMap} iconMap={iconMap} manualCover={manualCover} setManualCover={setManualCover} saveBook={saveBook} STATUSES={STATUSES} debRef={debRef} onBack={()=>{setView(editMode?"detail":addingTo);setEditMode(false);setForm(emptyForm);}}/>
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
        <div style={{...css.main,maxWidth:"960px"}}>
          <div style={{...glass({borderRadius:"28px"}),padding:"3rem",display:"flex",gap:"3rem",flexWrap:"wrap",alignItems:"flex-start"}}>
            <div style={{flexShrink:0}}>
              {book.cover_url?<img src={book.cover_url} alt="cover" style={{width:"220px",borderRadius:"18px",display:"block",boxShadow:"0 20px 50px rgba(0,0,0,0.5)"}} onError={e=>e.target.style.display="none"}/>
                :<div style={{width:"220px",height:"310px",background:book.spineColor||"#7c3aed",borderRadius:"18px",display:"flex",alignItems:"center",justifyContent:"center"}}><SvgIcon path={ICONS.book} size={56} color="rgba(255,255,255,0.4)"/></div>}
            </div>
            <div style={{flex:1,minWidth:"240px"}}>
              <h1 style={{margin:"0 0 0.4rem",fontSize:"2.2rem",fontWeight:800,lineHeight:1.15,letterSpacing:"-0.5px"}}>{book.title}</h1>
              {book.author&&<p style={{color:"rgba(255,255,255,0.7)",margin:"0 0 1.25rem",fontSize:"1.15rem"}}>by {book.author}</p>}
              <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"1.25rem"}}>
                {(book.genres||[]).map(g=><span key={g} style={css.tag(g)}><GenreIcon genre={g} iconMap={iconMap} colorMap={colorMap} size={12}/>{g}</span>)}
              </div>
              {book.rating>0&&<div style={{color:"#fbbf24",fontSize:"1.6rem",marginBottom:"0.75rem",letterSpacing:"3px"}}>{"★".repeat(book.rating)}{"☆".repeat(5-book.rating)}</div>}
              <div style={{display:"flex",gap:"1.5rem",fontSize:"0.9rem",color:"rgba(255,255,255,0.55)",marginBottom:"1.5rem"}}>
                {book.pages&&<span>{book.pages} pages</span>}
                {book.date_read&&<span>Finished {book.date_read}</span>}
              </div>
              {book.notes&&<div style={{...glass({borderRadius:"16px"}),padding:"1.25rem",marginBottom:"1.5rem"}}><p style={{margin:0,lineHeight:1.75,fontSize:"1rem"}}>{book.notes}</p></div>}
              <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap"}}>
                <button style={css.btn("rgba(255,255,255,0.95)","#7c3aed")} onClick={()=>{setForm({title:book.title,author:book.author||"",genres:book.genres||[],status:book.status,rating:book.rating||0,notes:book.notes||"",date_read:book.date_read||"",cover_url:book.cover_url||"",pages:String(book.pages||"")});setEditMode(true);setManualCover(false);}}>
                  <SvgIcon path={ICONS.edit} size={14} color="#7c3aed"/>Edit
                </button>
                {book.status==="Currently Reading"&&(
                  <button style={css.btn("rgba(16,185,129,0.25)","#fff",{border:"1px solid rgba(16,185,129,0.5)"})} onClick={()=>markFinished(book)}>
                    <SvgIcon path={ICONS.check} size={14} color="#fff"/>Mark as Finished
                  </button>
                )}
                <button style={css.btn("rgba(239,68,68,0.25)","#fff",{border:"1px solid rgba(239,68,68,0.4)"})} onClick={()=>deleteBook(book.id)}>
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

  // ── FINISHED ──
  if(view==="finished"){
    const displayFinished=applyFilters(finished);
    return(
      <div style={css.app}>
        {toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
        {scrollBtn}
        <Hdr/>
        <div style={css.main}>
          <h2 style={{fontWeight:800,margin:"0 0 0.3rem",fontSize:"1.6rem"}}>Finished</h2>
          <p style={{color:"rgba(255,255,255,0.55)",margin:"0 0 1.5rem"}}>{finished.length} book{finished.length!==1?"s":""} completed</p>
          <div style={{display:"flex",gap:"0.75rem",marginBottom:"1.5rem",flexWrap:"wrap"}}>
            <input style={{...css.inp(),maxWidth:"260px"}} placeholder="Search..." value={fSearch} onChange={e=>setFSearch(e.target.value)}/>
            <select style={{...css.sel,width:"auto"}} value={fGenre} onChange={e=>setFGenre(e.target.value)}>
              <option>All</option>{allGenres.map(g=><option key={g}>{g}</option>)}
            </select>
          </div>
          {displayFinished.length===0
            ?<div style={{textAlign:"center",marginTop:"4rem",color:"rgba(255,255,255,0.4)"}}><SvgIcon path={ICONS.shelves} size={48} color="rgba(255,255,255,0.2)"/><p style={{marginTop:"1rem"}}>No finished books yet</p></div>
            :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:"16px"}}>
              {displayFinished.map(book=><BookCard key={book.id} book={book} iconMap={iconMap} colorMap={colorMap} markFinished={markFinished} setSelected={setSelected} setAiResult={setAiResult} setView={setView}/>)}
            </div>}
        </div>
      </div>
    );
  }

  // ── STATS ──
  if(view==="stats"){
    const chartData=statPeriod==="month"?getMonthlyData():getYearlyData();
    const filteredFinished=statsFilter==="all"?finished:finished.filter(b=>b.rating>=(parseInt(statsFilter)));
    const donutData=Object.entries(filteredFinished.reduce((acc,b)=>{(b.genres||[]).forEach(g=>{acc[g]=(acc[g]||0)+1;});return acc;},{})).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([g,c])=>({label:g,value:c,color:colorMap[g]||DEFAULT_GENRE_COLORS[g]||"#94a3b8"}));
    const mostRecent=finished[0];
    const avgRating=filteredFinished.filter(b=>b.rating>0).length?(filteredFinished.filter(b=>b.rating>0).reduce((a,b)=>a+b.rating,0)/filteredFinished.filter(b=>b.rating>0).length).toFixed(1):"—";
    return(
      <div style={css.app}>
        {toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
        {scrollBtn}
        <Hdr/>
        <div style={css.main}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem",flexWrap:"wrap",gap:"1rem"}}>
            <h2 style={{fontWeight:800,fontSize:"1.6rem",margin:0}}>Reading Stats</h2>
            <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
              <span style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.5)"}}>Filter:</span>
              <select style={{...css.sel,width:"auto",fontSize:"0.85rem",padding:"0.4rem 0.75rem"}} value={statsFilter} onChange={e=>setStatsFilter(e.target.value)}>
                <option value="all">All books</option>
                <option value="5">★★★★★ only</option>
                <option value="4">★★★★ & above</option>
                <option value="3">★★★ & above</option>
              </select>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:"14px",marginBottom:"1.5rem"}}>
            {[["Books Finished",filteredFinished.length,T.statFinishedColor],["Pages Read",filteredFinished.reduce((a,b)=>a+(parseInt(b.pages)||0),0).toLocaleString(),T.accentColor],["Avg Rating",avgRating,"#fbbf24"],["This Month",thisMonth,T.statReadingColor],["Reading Now",reading.length,T.statReadingColor]].map(([label,val,color])=>(
              <div key={label} style={{...glass({borderRadius:"20px"}),padding:"1.5rem",position:"relative",overflow:"hidden",textAlign:"center"}}>
                <div style={{position:"absolute",top:"-20px",right:"-20px",width:"80px",height:"80px",borderRadius:"50%",background:color,opacity:0.15}}/>
                <div style={{fontSize:"2.5rem",fontWeight:800,color,lineHeight:1,textShadow:`0 0 20px ${color}80`}}>{val}</div>
                <div style={{fontSize:"0.85rem",color:"rgba(255,255,255,0.6)",marginTop:"0.5rem",fontWeight:600}}>{label}</div>
              </div>
            ))}
          </div>
          {mostRecent&&(
            <div style={{...glass({borderRadius:"20px"}),padding:"1.5rem",marginBottom:"1.25rem",display:"flex",gap:"1.5rem",alignItems:"center",cursor:"pointer"}} onClick={()=>{setSelected(mostRecent);setView("detail");}}>
              {mostRecent.cover_url?<img src={mostRecent.cover_url} alt="cover" style={{width:"70px",height:"100px",objectFit:"cover",borderRadius:"10px",boxShadow:"0 4px 16px rgba(0,0,0,0.4)",flexShrink:0}} onError={e=>e.target.style.display="none"}/>:<div style={{width:"70px",height:"100px",background:mostRecent.spineColor||"#7c3aed",borderRadius:"10px",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><SvgIcon path={ICONS.book} size={28} color="rgba(255,255,255,0.5)"/></div>}
              <div>
                <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.45)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.3rem"}}>Most Recently Completed</div>
                <div style={{fontWeight:800,fontSize:"1.1rem",marginBottom:"0.2rem"}}>{mostRecent.title}</div>
                {mostRecent.author&&<div style={{color:"rgba(255,255,255,0.6)",fontSize:"0.85rem",marginBottom:"0.4rem"}}>by {mostRecent.author}</div>}
                {mostRecent.rating>0&&<div style={{color:"#fbbf24",fontSize:"1rem",letterSpacing:"2px"}}>{"★".repeat(mostRecent.rating)}{"☆".repeat(5-mostRecent.rating)}</div>}
                {mostRecent.date_read&&<div style={{color:"rgba(255,255,255,0.4)",fontSize:"0.78rem",marginTop:"0.3rem"}}>Finished {mostRecent.date_read}</div>}
              </div>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem",marginBottom:"1.25rem"}}>
            <div style={{...glass({borderRadius:"20px"}),padding:"1.5rem"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
                <h3 style={{margin:0,fontWeight:700,fontSize:"1rem"}}>Books Read</h3>
                <div style={{display:"flex",gap:"4px"}}>
                  {["month","year"].map(p=><button key={p} onClick={()=>setStatPeriod(p)} style={{padding:"0.25rem 0.7rem",borderRadius:"999px",border:"none",cursor:"pointer",fontSize:"0.75rem",fontWeight:600,background:statPeriod===p?"rgba(255,255,255,0.25)":"transparent",color:"#fff"}}>{p==="month"?"Monthly":"Yearly"}</button>)}
                </div>
              </div>
              {finished.length>0?<BarChart data={chartData} color="#a78bfa"/>:<div style={{textAlign:"center",color:"rgba(255,255,255,0.4)",fontSize:"0.9rem",padding:"1.5rem 0"}}>Not enough data collected</div>}
            </div>
            <div style={{...glass({borderRadius:"20px"}),padding:"1.5rem"}}>
              <h3 style={{margin:"0 0 1rem",fontWeight:700,fontSize:"1rem"}}>Reading Over Time</h3>
              {finished.length>0?<LineChart data={getMonthlyData()} color="#60a5fa"/>:<div style={{textAlign:"center",color:"rgba(255,255,255,0.4)",fontSize:"0.9rem",padding:"1.5rem 0"}}>Not enough data collected</div>}
            </div>
          </div>
          <div style={{...glass({borderRadius:"20px"}),padding:"1.5rem"}}>
            <h3 style={{margin:"0 0 1.25rem",fontWeight:700,fontSize:"1rem"}}>Genre Breakdown{statsFilter!=="all"&&<span style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.4)",fontWeight:400,marginLeft:"0.5rem"}}>({statsFilter}+ stars)</span>}</h3>
            {donutData.length>0?<DonutChart data={donutData}/>:<div style={{textAlign:"center",color:"rgba(255,255,255,0.4)",fontSize:"0.9rem",padding:"1rem 0"}}>Not enough data collected</div>}
          </div>
        </div>
      </div>
    );
  }

  // ── SETTINGS ──
  if(view==="settings"){
    const colorFields=[["bgFrom","Gradient Start"],["bgTo","Gradient End"],["accentColor","Accent"],["textColor","Text"],["mutedColor","Muted Text"],["statFinishedColor","Finished Stat"],["statReadingColor","Reading Stat"],["statTotalColor","Total Stat"]];
    return(
      <div style={css.app}>
        {toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
        <Hdr/>
        <div style={css.main}>
          <h2 style={{fontWeight:800,marginBottom:"1.5rem",fontSize:"1.6rem"}}>Settings</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem"}}>
            <div style={{...glass({borderRadius:"20px"}),padding:"1.5rem"}}>
              <h3 style={{margin:"0 0 1rem",fontWeight:700,fontSize:"0.85rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.07em"}}>Profile</h3>
              <label style={css.lbl}>Display Name</label>
              <div style={{display:"flex",gap:"0.6rem"}}>
                <input style={{...css.inp(),flex:1}} value={user.name} onChange={e=>setUser(u=>({...u,name:e.target.value}))}/>
                <button style={css.btn("rgba(255,255,255,0.95)","#7c3aed")} onClick={()=>{updUser(user);showToast("Saved!");}}>Save</button>
              </div>
            </div>
            <div style={{...glass({borderRadius:"20px"}),padding:"1.5rem"}}>
              <h3 style={{margin:"0 0 1rem",fontWeight:700,fontSize:"0.85rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.07em"}}>Font</h3>
              <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                {FONTS.map(f=><div key={f.value} onClick={()=>updTheme({...T,fontFamily:f.value})} style={{padding:"0.5rem 0.85rem",borderRadius:"12px",cursor:"pointer",fontFamily:f.value,border:`1.5px solid ${T.fontFamily===f.value?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.15)"}`,background:T.fontFamily===f.value?"rgba(255,255,255,0.15)":"transparent",fontSize:"0.9rem"}}>{f.label}</div>)}
              </div>
            </div>
            <div style={{...glass({borderRadius:"20px"}),padding:"1.5rem"}}>
              <h3 style={{margin:"0 0 1rem",fontWeight:700,fontSize:"0.85rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.07em"}}>Gradient & Colors</h3>
              {colorFields.map(([key,label])=>(
                <div key={key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.5rem 0",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                  <label style={{...css.lbl,margin:0,fontSize:"0.82rem"}}>{label}</label>
                  <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                    <input type="color" value={T[key]||"#ffffff"} onChange={e=>updTheme({...T,[key]:e.target.value})} style={{width:"36px",height:"30px",borderRadius:"8px",border:"1.5px solid rgba(255,255,255,0.2)",cursor:"pointer",padding:"1px",background:"none"}}/>
                    <span style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)",fontFamily:"monospace"}}>{T[key]}</span>
                  </div>
                </div>
              ))}
              <button style={{...css.btn("rgba(239,68,68,0.3)","#fff",{marginTop:"1rem",fontSize:"0.82rem"})}} onClick={()=>{updTheme(DEFAULTS);showToast("Reset!");}}>Reset to Default</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
              <div style={{...glass({borderRadius:"20px"}),padding:"1.5rem"}}>
                <h3 style={{margin:"0 0 1rem",fontWeight:700,fontSize:"0.85rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.07em"}}>Custom Genres</h3>
                <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.75rem"}}>
                  <input style={{...css.inp(),flex:1}} placeholder="Genre name..." value={newGenreName} onChange={e=>setNewGenreName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustomGenre()}/>
                  <input type="color" value={newGenreColor} onChange={e=>setNewGenreColor(e.target.value)} style={{width:"46px",height:"46px",borderRadius:"10px",border:"1.5px solid rgba(255,255,255,0.2)",cursor:"pointer",padding:"2px",background:"none"}}/>
                  <button style={css.btn("rgba(255,255,255,0.2)","#fff")} onClick={addCustomGenre}><SvgIcon path={ICONS.plus} size={14} color="#fff"/></button>
                </div>
                {customGenres.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{customGenres.map(g=><span key={g} style={{...css.tag(g),cursor:"pointer"}} onClick={()=>{if(window.confirm(`Delete "${g}"?`)){updCustomGenres(customGenres.filter(x=>x!==g));showToast(`Removed "${g}"`);}}}>
                  <GenreIcon genre={g} iconMap={iconMap} colorMap={colorMap} size={10}/>{g} ×
                </span>)}</div>}
              </div>
              <div style={{...glass({borderRadius:"20px"}),padding:"1.5rem",maxHeight:"340px",overflowY:"auto"}}>
                <h3 style={{margin:"0 0 1rem",fontWeight:700,fontSize:"0.85rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.07em"}}>Genre Icons & Colors</h3>
                {allGenres.map(g=>(
                  <div key={g} style={{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.4rem 0",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                    <GenreIcon genre={g} iconMap={iconMap} colorMap={colorMap} size={14}/>
                    <span style={{flex:1,fontSize:"0.85rem",fontWeight:500}}>{g}</span>
                    <input type="color" value={colorMap[g]||DEFAULT_GENRE_COLORS[g]||"#94a3b8"} onChange={e=>updGenreColors({...genreColors,[g]:e.target.value})} style={{width:"28px",height:"24px",borderRadius:"6px",border:"1px solid rgba(255,255,255,0.2)",cursor:"pointer",padding:"1px",background:"none"}}/>
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

  // ── BOOKSHELF / NEXT-UP ──
  const isNextUp=view==="nextup";
  const displayList=applyFilters(isNextUp?nextUp:reading);
  const displayFinished=applyFilters(finished);
  return(
    <div style={css.app}>
      {toast.msg&&<div style={css.toast(toast.type)}>{toast.msg}</div>}
      {scrollBtn}
      <Hdr/>
      <div style={css.main}>
        {!isNextUp&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"14px",marginBottom:"2rem"}}>
            {[["Total Books",books.length,T.statTotalColor,"bookshelf"],["Finished",finished.length,T.statFinishedColor,"finished"],["Reading Now",reading.length,T.statReadingColor,"bookshelf"]].map(([label,val,color,linkTo])=>(
              <div key={label} onClick={()=>setView(linkTo)} style={{...glass({borderRadius:"20px"}),padding:"1.75rem 2rem",cursor:"pointer",transition:"all 0.2s",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",minHeight:"120px"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 16px 40px rgba(0,0,0,0.3),0 0 0 1px ${color}40`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=glass().boxShadow;}}>
                <div style={{position:"absolute",top:"-30px",right:"-30px",width:"100px",height:"100px",borderRadius:"50%",background:color,opacity:0.12}}/>
                <div style={{fontSize:"3rem",fontWeight:800,color,lineHeight:1,textShadow:`0 0 24px ${color}80`}}>{val}</div>
                <div style={{fontSize:"1rem",color:"rgba(255,255,255,0.7)",marginTop:"0.5rem",fontWeight:600}}>{label}</div>
              </div>
            ))}
          </div>
        )}
        {isNextUp&&<div style={{...glass({borderRadius:"16px"}),padding:"0.9rem 1.4rem",marginBottom:"1.5rem",display:"flex",alignItems:"center",gap:"0.6rem"}}><SvgIcon path={ICONS.bookmark} size={16} color="rgba(255,255,255,0.6)"/><span style={{fontSize:"1rem",color:"rgba(255,255,255,0.7)"}}><strong style={{color:"#fff"}}>{nextUp.length}</strong> book{nextUp.length!==1?"s":""} queued</span></div>}
        <div style={{display:"flex",gap:"0.75rem",marginBottom:"1.5rem",flexWrap:"wrap"}}>
          <input style={{...css.inp(),maxWidth:"260px"}} placeholder="Search..." value={fSearch} onChange={e=>setFSearch(e.target.value)}/>
          <select style={{...css.sel,width:"auto"}} value={fGenre} onChange={e=>setFGenre(e.target.value)}>
            <option>All</option>{allGenres.map(g=><option key={g}>{g}</option>)}
          </select>
        </div>
        {displayList.length===0?(
          <div style={{textAlign:"center",marginTop:"3rem",color:"rgba(255,255,255,0.4)"}}>
            <SvgIcon path={ICONS.book} size={48} color="rgba(255,255,255,0.15)"/>
            <p style={{marginTop:"1rem",fontSize:"1.05rem"}}>{isNextUp?"Nothing queued yet":"Not currently reading anything"}</p>
            <button style={{...css.btn("rgba(255,255,255,0.95)","#7c3aed",{marginTop:"0.75rem"})}} onClick={()=>{setForm({...emptyForm,status:isNextUp?"Want to Read":"Currently Reading"});setAddingTo(view);setView("add");}}>Add a Book</button>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:"16px"}}>
            {displayList.map(book=><BookCard key={book.id} book={book} iconMap={iconMap} colorMap={colorMap} markFinished={markFinished} setSelected={setSelected} setAiResult={setAiResult} setView={setView}/>)}
          </div>
        )}
        {!isNextUp&&displayFinished.length>0&&(
          <div style={{marginTop:"3rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.5rem"}}>
              <div style={{flex:1,height:"1px",background:"rgba(255,255,255,0.15)"}}/>
              <span style={{color:"rgba(255,255,255,0.5)",fontSize:"0.85rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",whiteSpace:"nowrap"}}>Recently Completed</span>
              <div style={{flex:1,height:"1px",background:"rgba(255,255,255,0.15)"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:"16px"}}>
              {displayFinished.map(book=><BookCard key={book.id} book={book} iconMap={iconMap} colorMap={colorMap} markFinished={markFinished} setSelected={setSelected} setAiResult={setAiResult} setView={setView}/>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}