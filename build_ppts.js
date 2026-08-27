/* study-room: 각 강의 index.html → PPTX 변환기 (덱과 같은 카드형 디자인)
   실행: node build_ppts.js [folder1 folder2 ...]   (인자 없으면 아래 LESSONS 전체)
   - 표지/파트 구분은 물론, 본문의 steps·qa·hl·big·chain·box·grid2·paths·io·표를
     텍스트 나열이 아니라 도형 카드로 렌더링한다. (크림/그린 팔레트, 라이트 테마) */
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const { parse } = require("node-html-parser");

const ROOT = __dirname;
const LESSONS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["local-llm","quantization","run-local","local-vs-api","data-axis","cost-axis","control-axis",
     "decision-doc","two-requests","ocr-pipeline","detect-segment","vlm","ai-tool-choice","ocr-lab",
     "yolo-lab","docimg-wrapup","model-origin","image-path","pixels-sentences",
     "prompt-engineering-intro","agent-structure","model-inputs","instruction-hierarchy","prompt-lab",
     "pe-history","technique-revalidation","self-evolution","agent-patterns",
     "instruction-anatomy","eleven-methods","why-instructions-work","source-and-precedence",
     "techniques-as-hypotheses","three-instructions-lab","output-contract","eval-metrics",
     "instruction-failures","minimal-change-workbook","instruction-principles",
     "context-window","five-competitors","context-rot","context-strategy-map","same-question-different-context",
     "prompt-injection","project-context-files","caching-economics","context-principles",
     "three-failures","tool-description","tool-definition-lab","minimal-harness","build-and-mcp-lab",
     "permission-trust-boundary","service-agent-project","tool-eval","antipatterns-wrapup",
     "why-server","network-basics","backend-request-response","ai-code-weakness","deploy",
     "free-hosting","home-server","fullstack-connect","backend-project",
     "why-database","db-history","sql-and-tables","auth-and-session",
     "db-security-backup","free-db-choice","todo-db-lab","db-wrapup",
     "agent-and-harness","mcp-usb-c","skills-and-rules","harness-choice",
     "beyond-skills","todo-agent-lab","workflow-and-submit",
     "mainquest-kickoff","scope-and-mvp","spec-to-deploy","five-steps-lab",
     "supabase-auth","my-domain-build","four-disciplines","mainquest-wrapup",
     "why-decompose","four-moves","domain-already","my-problem-workbook","ct-submit",
     "late-start-reframe","three-asymmetries","four-month-map",
     "learning-together","first-ai-audit","day1-wrapup"];

// ---- palette (deck light theme) ----
const INK="2A2723", SOFT="6B6357", GR="3F6B5F", GR2="2C4D44", GOLD="C8A15A",
      RED="A65A3F", BL="3A5A8C", BL2="2B4570", PP="6B4D8C", GY="8A8378",
      BG="FAF8F4", BG2="F2EDE4", LINE="E3DACB", CARD="FFFFFF", WHITE="FFFFFF";
const FONT="Malgun Gothic", MONO="Consolas";
const W=13.33, H=7.5;
const VAR={gr:GR,gr2:GR2,gold:GOLD,red:RED,bl:BL,bl2:BL2,pp:PP,gy:GY,ink:INK,soft:SOFT};

const DIAG = ["line2","flowf","paths","tl","venn","seg3","rflow","chain","io","maskrow",
  "scenebox","room","rcpt","bars","qk","three","ladder","iou","tlaxis","tlrow","passrow",
  "redcap","mtbl","btbl","fx","cir"];

// ---- text helpers ----
function decode(t){ return (t||"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")
  .replace(/&nbsp;/g," ").replace(/&middot;/g,"·").replace(/&hellip;/g,"…"); }
function clean(t){ return decode(t).replace(/\s+/g," ").trim(); }
function hasClass(el,c){ return el.classList && el.classList.contains(c); }
function anyClass(el,arr){ return arr.some(c=>hasClass(el,c)); }
function styleVar(style,prop){
  if(!style) return null;
  const m=style.match(new RegExp(prop.replace("-","\\-")+"\\s*:\\s*var\\(--([a-z0-9]+)\\)"));
  return m ? (VAR[m[1]]||null) : null;
}
function styleFrac(style,prop){
  if(!style) return null;
  const m=style.match(new RegExp(prop+"\\s*:\\s*([0-9.]+)%"));
  return m ? parseFloat(m[1])/100 : null;
}

// rich text runs: [{text,bold,italic,color}]
function richRuns(node, base){
  const out=[];
  function walk(n, st){
    for(const ch of (n.childNodes||[])){
      if(ch.nodeType===3){
        let t=decode(ch.rawText!=null?ch.rawText:ch.text);
        if(t==="") continue;
        const collapsed=t.replace(/\s+/g," ");
        if(collapsed.trim()==="" ){ if(out.length) out.push({text:" ",bold:st.bold,italic:st.italic,color:st.color}); continue; }
        out.push({text:collapsed,bold:st.bold,italic:st.italic,color:st.color});
        continue;
      }
      if(ch.nodeType!==1) continue;
      const tag=ch.tagName;
      if(tag==="BR"){ out.push({text:"  ",bold:st.bold,italic:st.italic,color:st.color}); continue; }
      const s={bold:st.bold,italic:st.italic,color:st.color};
      if(tag==="B"){ s.bold=true; s.color=(base===WHITE?WHITE:INK); }
      if(tag==="I"){ s.italic=true; s.color=SOFT; }
      const cl=ch.classList;
      if(cl){
        if(cl.contains("g")){s.bold=true;s.color=GR;}
        if(cl.contains("r")){s.bold=true;s.color=RED;}
        if(cl.contains("b")){s.bold=true;s.color=BL;}
        if(cl.contains("p")){s.bold=true;s.color=PP;}
        if(cl.contains("y")){s.bold=true;s.color=GOLD;}
      }
      walk(ch,s);
    }
  }
  walk(node,{bold:false,italic:false,color:base});
  // merge adjacent identical-style runs
  const m=[];
  for(const r of out){
    if(!r.text) continue;
    const l=m[m.length-1];
    if(l && l.bold===r.bold && l.italic===r.italic && l.color===r.color){ l.text+=r.text; }
    else m.push({...r});
  }
  if(m.length){ m[0].text=m[0].text.replace(/^\s+/,""); m[m.length-1].text=m[m.length-1].text.replace(/\s+$/,""); }
  return m.filter(r=>r.text!=="");
}
function runText(runs){ return runs.map(r=>r.text).join(""); }
function toRuns(runs, baseColor, extra){
  return runs.map(r=>({text:r.text, options:Object.assign({color:r.color||baseColor, bold:!!r.bold, italic:!!r.italic}, extra||{})}));
}

// ---- height estimation ----
function estLines(text,widthIn,fontPt,factor){
  factor=factor||0.63;
  const cpl=Math.max(1,Math.floor(widthIn/(fontPt/72*factor)));
  return Math.max(1,Math.ceil((text||"").length/cpl));
}
function textH(text,widthIn,fontPt,factor){ return estLines(text,widthIn,fontPt,factor)*(fontPt/72*1.5); }

// ---- block parsing ----
function parseTable(el){
  const rows=[];
  el.querySelectorAll("tr").forEach(tr=>{
    const cells=tr.querySelectorAll("th,td").map(td=>({text:clean(td.text), head:td.tagName==="TH"}));
    if(cells.length) rows.push(cells);
  });
  return rows;
}
function parseBox(el){
  const h3=el.querySelector("h3");
  const paras=el.querySelectorAll("p").map(p=>richRuns(p,SOFT));
  return { h3: h3?richRuns(h3,INK):null, h3color: h3?(styleVar(null)||classColor(h3)):null, paras };
}
function classColor(el){
  if(!el||!el.classList) return null;
  for(const [k,v] of Object.entries({g:GR,r:RED,b:BL,p:PP})) if(el.classList.contains(k)) return v;
  return null;
}
function parseCells(el){
  return el.querySelectorAll(".cell").map(c=>({
    small: clean((c.querySelector("small")||{text:""}).text),
    runs: richRuns(c.querySelector("b")||c, INK),
    border: styleVar(c.getAttribute("style"),"border-color")
  }));
}
function parseIO(el){
  const encs=el.querySelectorAll(".enc").map(e=>({
    label: clean((e.querySelector(".elab")||{text:""}).text),
    toks: e.querySelectorAll(".tok").map(t=>({
      text: clean(t.text),
      kind: t.classList.contains("bl")?"bl":t.classList.contains("pp")?"pp":"mut"
    }))
  }));
  const sp=el.querySelector(".space");
  let space=null;
  if(sp){
    space={
      title: clean((sp.querySelector(".stitle")||{text:""}).text),
      dots: sp.querySelectorAll(".dot").map(d=>({
        label: clean(d.text),
        color: styleVar((d.querySelector(".pt")||{getAttribute:()=>null}).getAttribute?.("style"),"background")||GY,
        left: styleFrac(d.getAttribute("style"),"left")||0.5,
        top: styleFrac(d.getAttribute("style"),"top")||0.5
      }))
    };
  }
  return { encs, space };
}
function parsePipes(el){
  return el.querySelectorAll(".pipe").map(p=>({
    kind: p.classList.contains("no")?"no":p.classList.contains("yes")?"yes":"",
    header: clean((p.querySelector(".ph")||{text:""}).text),
    steps: p.querySelectorAll(".stp").map(s=>richRuns(s,INK))
  }));
}
function collectBlocks(node, blocks){
  for(const ch of node.childNodes){
    if(ch.nodeType!==1) continue;
    const tag=ch.tagName, cl=ch.classList||{contains:()=>false};
    if(tag==="H1"||tag==="H2"||tag==="H3"||tag==="ASIDE"||tag==="SCRIPT"||tag==="STYLE") continue;
    if(tag==="TABLE"){ blocks.push({type:"table",rows:parseTable(ch)}); continue; }
    if(tag==="UL"&&cl.contains("pts")){ blocks.push({type:"pts",items:ch.querySelectorAll("li").map(li=>richRuns(li,SOFT))}); continue; }
    if(cl.contains("steps")){ blocks.push({type:"steps",items:ch.querySelectorAll(".st").map(st=>({n:clean((st.querySelector(".n")||{text:""}).text), runs:richRuns(st.querySelector(".t")||st,INK)}))}); continue; }
    if(cl.contains("qa")){ blocks.push({type:"qa",items:ch.querySelectorAll(".q").map(q=>({a:q.classList.contains("a"),runs:richRuns(q,INK)}))}); continue; }
    if(cl.contains("hl")){ blocks.push({type:"hl",runs:richRuns(ch,SOFT)}); continue; }
    if(cl.contains("big")){ blocks.push({type:"big",runs:richRuns(ch,WHITE)}); continue; }
    if(cl.contains("chain")){ blocks.push({type:"chain",cells:parseCells(ch)}); continue; }
    if(cl.contains("io")){ blocks.push({type:"io",io:parseIO(ch)}); continue; }
    if(cl.contains("paths")){ blocks.push({type:"paths",pipes:parsePipes(ch)}); continue; }
    if(cl.contains("lgd")){ blocks.push({type:"legend",text:clean(ch.text)}); continue; }
    if(cl.contains("grid2")||cl.contains("grid3")){ blocks.push({type:"grid",boxes:ch.querySelectorAll(".box").map(parseBox)}); continue; }
    if(cl.contains("box")){ blocks.push({type:"box",box:parseBox(ch)}); continue; }
    if(tag==="PRE"){ blocks.push({type:"code",text:decode(ch.text).replace(/[ \t]+$/gm,"").replace(/\s+$/,"")}); continue; }
    if(tag==="P"){ blocks.push({type:"p",runs:richRuns(ch,SOFT)}); continue; }
    if(anyClass(ch,DIAG)){ blocks.push({type:"diagram",text:clean(ch.text).slice(0,170)}); continue; }
    if(tag==="DIV"||tag==="SECTION"){
      // 알 수 없는 래퍼: 블록 자식(표·리스트·박스·중첩 div 등)이 있을 때만 재귀.
      // 인라인 요소(b·span·sub·sup·code·br)만 섞인 div는 통째로 한 문단으로(텍스트 유실 방지).
      const BLOCK=["DIV","SECTION","TABLE","UL","OL","PRE","P"];
      const KNOWN=["steps","qa","hl","big","chain","io","paths","lgd","grid2","grid3","box","pts"];
      const hasBlockChild=ch.childNodes.some(n=>n.nodeType===1 &&
        (BLOCK.indexOf(n.tagName)>=0 || (n.classList && KNOWN.some(c=>n.classList.contains(c)))));
      if(hasBlockChild) collectBlocks(ch, blocks);
      else { const t=clean(ch.text); if(t) blocks.push({type:"p",runs:richRuns(ch,SOFT)}); }
    }
  }
}
function parseBlocks(sec){ const blocks=[]; collectBlocks(sec,blocks); return blocks; }

// ---- measure ----
const CW=12.13, CX=0.6, TOP=1.5, BOTTOM=7.12, GAP=0.16;
function measure(b){
  switch(b.type){
    case "p": return textH(runText(b.runs),CW,13.5)+0.06;
    case "pts": return b.items.reduce((a,it)=>a+Math.max(0.3,textH(runText(it),CW-0.45,14.5))+0.07,0.04);
    case "steps": return b.items.reduce((a,it)=>a+Math.max(0.54,textH(runText(it.runs),CW-0.85,13)+0.24)+0.1,0);
    case "qa": return b.items.reduce((a,it)=>a+Math.max(0.46,textH(runText(it.runs),CW-0.55,12.5)+0.2)+0.09,0);
    case "hl": return Math.max(0.6,textH(runText(b.runs),CW-0.6,13)+0.3);
    case "big": return Math.max(1.0,textH(runText(b.runs),CW-1.6,17)+0.55);
    case "chain": { const n=Math.max(1,b.cells.length); const long=b.cells.some(c=>runText(c.runs).length>34);
      return long?1.55:1.2; }
    case "io": return 2.2;
    case "paths": { const mx=Math.max(...b.pipes.map(p=>p.steps.length)); return 0.5+mx*0.52+0.2; }
    case "legend": return 0.34;
    case "box": { const bx=b.box; return (bx.h3?0.36:0)+bx.paras.reduce((a,p)=>a+textH(runText(p),CW-0.7,12.5),0)+0.34; }
    case "grid": { const hs=b.boxes.map(bx=>(bx.h3?0.36:0)+bx.paras.reduce((a,p)=>a+textH(runText(p),(CW-0.4)/2-0.5,12),0)+0.34); return Math.max(0.7,...hs); }
    case "table": return b.rows.reduce((a,r)=>{ const mc=Math.max(...r.map(c=>c.text.length)); const colW=(CW/r.length); return a+Math.max(0.42,textH("x".repeat(mc),colW-0.2,11)+0.16); },0);
    case "code": { const lines=(b.text.match(/\n/g)||[]).length+1; return Math.max(0.5,lines*0.245+0.24); }
    case "diagram": return 1.1;
    default: return 0.5;
  }
}

// ---- render primitives ----
function card(pres,s,x,y,w,h,fill,border,rad){
  s.addShape(pres.ShapeType.roundRect,{x,y,w,h,fill:{color:fill||CARD},line:border===false?{type:"none"}:{color:border||LINE,width:1},rectRadius:rad==null?0.09:rad});
}
function leftbar(pres,s,x,y,h,color,w){ s.addShape(pres.ShapeType.rect,{x,y,w:w||0.07,h,fill:{color}}); }

function renderBlock(pres,s,b,x,y,w,h){
  switch(b.type){
    case "p":
      s.addText(toRuns(b.runs,SOFT,{fontSize:13.5}),{x,y,w,h,valign:"top",fit:"shrink",lineSpacingMultiple:1.08,fontFace:FONT,paraSpaceAfter:2});
      break;
    case "pts": {
      const arr=[];
      b.items.forEach(it=>{
        arr.push({text:"›  ",options:{color:GR,bold:true,fontSize:14.5,fontFace:FONT}});
        toRuns(it,SOFT,{fontSize:14.5,fontFace:FONT}).forEach(o=>arr.push(o));
        const last=arr[arr.length-1]; last.options.breakLine=true; last.options.paraSpaceAfter=7;
      });
      s.addText(arr,{x,y,w,h,valign:"top",fit:"shrink",lineSpacingMultiple:1.05});
      break;
    }
    case "steps": {
      let cy=y; const n=b.items.length; const gap=0.1;
      const ih=Math.max(0.5,(h-gap*(n-1))/n);
      b.items.forEach(it=>{
        card(pres,s,x,cy,w,ih,CARD,LINE);
        const sq=Math.min(0.34,ih-0.16);
        s.addShape(pres.ShapeType.roundRect,{x:x+0.14,y:cy+(ih-sq)/2,w:sq,h:sq,fill:{color:GR},line:{type:"none"},rectRadius:0.06});
        s.addText(it.n||"",{x:x+0.14,y:cy+(ih-sq)/2,w:sq,h:sq,align:"center",valign:"middle",fontFace:FONT,fontSize:12,bold:true,color:WHITE});
        s.addText(toRuns(it.runs,INK,{fontSize:13,fontFace:FONT}),{x:x+0.62,y:cy,w:w-0.78,h:ih,valign:"middle",fit:"shrink",lineSpacingMultiple:1.02});
        cy+=ih+gap;
      });
      break;
    }
    case "qa": {
      let cy=y; const n=b.items.length; const gap=0.09;
      const ih=Math.max(0.44,(h-gap*(n-1))/n);
      b.items.forEach(it=>{
        const bar=it.a?GOLD:GR;
        card(pres,s,x+0.07,cy,w-0.07,ih,CARD,LINE);
        leftbar(pres,s,x,cy,ih,bar);
        s.addText(toRuns(it.runs,INK,{fontSize:12.5,fontFace:FONT}),{x:x+0.26,y:cy,w:w-0.42,h:ih,valign:"middle",fit:"shrink",lineSpacingMultiple:1.02});
        cy+=ih+gap;
      });
      break;
    }
    case "hl":
      s.addShape(pres.ShapeType.roundRect,{x,y,w,h,fill:{color:BG2},line:{type:"none"},rectRadius:0.06});
      leftbar(pres,s,x,y,h,GOLD,0.06);
      s.addText(toRuns(b.runs,SOFT,{fontSize:13,fontFace:FONT}),{x:x+0.26,y,w:w-0.42,h,valign:"middle",fit:"shrink",lineSpacingMultiple:1.04});
      break;
    case "big":
      s.addShape(pres.ShapeType.roundRect,{x,y,w,h,fill:{color:GR},line:{type:"none"},rectRadius:0.14});
      s.addText(toRuns(b.runs,WHITE,{fontSize:17,fontFace:FONT,bold:true}),{x:x+0.5,y,w:w-1.0,h,align:"center",valign:"middle",fit:"shrink",lineSpacingMultiple:1.1});
      break;
    case "chain": {
      const n=b.cells.length; const aw=0.4; const cw=(w-aw*(n-1))/n;
      let cx=x;
      b.cells.forEach((c,idx)=>{
        s.addShape(pres.ShapeType.roundRect,{x:cx,y,w:cw,h,fill:{color:CARD},line:{color:c.border||LINE,width:1.75},rectRadius:0.09});
        if(c.small) s.addText(c.small,{x:cx+0.06,y:y+0.12,w:cw-0.12,h:0.3,align:"center",valign:"middle",fontFace:FONT,fontSize:9.5,bold:true,color:SOFT});
        s.addText(toRuns(c.runs,INK,{fontSize:11.5,fontFace:FONT}),{x:cx+0.08,y:y+(c.small?0.44:0.1),w:cw-0.16,h:h-(c.small?0.54:0.2),align:"center",valign:"middle",fit:"shrink",lineSpacingMultiple:1.02});
        if(idx<n-1) s.addText("→",{x:cx+cw,y,w:aw,h,align:"center",valign:"middle",fontFace:FONT,fontSize:17,bold:true,color:GR});
        cx+=cw+aw;
      });
      break;
    }
    case "io": renderIO(pres,s,b.io,x,y,w,h); break;
    case "paths": {
      const n=b.pipes.length; const g=0.3; const pw=(w-g*(n-1))/n;
      let px=x;
      b.pipes.forEach(p=>{
        const bord=p.kind==="no"?RED:p.kind==="yes"?GR:LINE;
        card(pres,s,px,y,pw,h,CARD,bord);
        s.addText(p.header,{x:px+0.1,y:y+0.1,w:pw-0.2,h:0.35,align:"center",valign:"middle",fontFace:FONT,fontSize:11.5,bold:true,color:bord===LINE?INK:bord});
        const ns=p.steps.length; const sy=y+0.5; const availp=h-0.6;
        const sh=Math.max(0.3,(availp-0.18*(ns-1))/ns);
        let cy=sy;
        p.steps.forEach((st,i)=>{
          s.addShape(pres.ShapeType.roundRect,{x:px+0.16,y:cy,w:pw-0.32,h:sh,fill:{color:BG2},line:{color:LINE,width:1},rectRadius:0.05});
          s.addText(toRuns(st,INK,{fontSize:10.5,fontFace:FONT}),{x:px+0.2,y:cy,w:pw-0.4,h:sh,align:"center",valign:"middle",fit:"shrink"});
          if(i<ns-1) s.addText("↓",{x:px,y:cy+sh-0.02,w:pw,h:0.2,align:"center",valign:"middle",fontFace:FONT,fontSize:11,bold:true,color:bord===LINE?GR:bord});
          cy+=sh+0.18;
        });
        px+=pw+g;
      });
      break;
    }
    case "legend":
      s.addText(b.text,{x,y,w,h,align:"center",valign:"middle",fontFace:FONT,fontSize:11,color:SOFT});
      break;
    case "box": renderBox(pres,s,b.box,x,y,w,h); break;
    case "grid": {
      const n=b.boxes.length; const g=0.4; const bw=(w-g*(n-1))/n;
      let bx=x; b.boxes.forEach(box=>{ renderBox(pres,s,box,bx,y,bw,h); bx+=bw+g; });
      break;
    }
    case "table": renderTable(pres,s,b.rows,x,y,w,h); break;
    case "diagram":
      card(pres,s,x,y,w,h,BG2,LINE);
      s.addText("[그림] "+b.text,{x:x+0.3,y,w:w-0.6,h,align:"center",valign:"middle",fontFace:FONT,fontSize:12,italic:true,color:SOFT,fit:"shrink"});
      break;
    case "code":
      s.addShape(pres.ShapeType.roundRect,{x,y,w,h,fill:{color:BG2},line:{color:LINE,width:1},rectRadius:0.05});
      leftbar(pres,s,x,y,h,GR,0.06);
      s.addText(b.text,{x:x+0.24,y:y+0.1,w:w-0.42,h:h-0.2,align:"left",valign:"top",fontFace:MONO,fontSize:11,color:INK,fit:"shrink",lineSpacingMultiple:1.02});
      break;
  }
}

function renderBox(pres,s,box,x,y,w,h){
  card(pres,s,x,y,w,h,CARD,LINE);
  let cy=y+0.16;
  if(box.h3){ s.addText(toRuns(box.h3,INK,{fontSize:13.5,bold:true,fontFace:FONT}),{x:x+0.22,y:cy,w:w-0.44,h:0.3,valign:"middle"}); cy+=0.36; }
  box.paras.forEach(p=>{
    const ph=Math.max(0.3,textH(runText(p),w-0.5,12.5));
    s.addText(toRuns(p,SOFT,{fontSize:12.5,fontFace:FONT}),{x:x+0.22,y:cy,w:w-0.44,h:ph,valign:"top",fit:"shrink",lineSpacingMultiple:1.03});
    cy+=ph;
  });
}

function renderTable(pres,s,rows,x,y,w,h){
  const cols=Math.max(...rows.map(r=>r.length));
  const trows=rows.map((r,ri)=>{
    const cells=r.slice(); while(cells.length<cols) cells.push({text:"",head:false});
    return cells.map((c,ci)=>({ text:c.text, options:{
      fontFace:FONT, fontSize:10.5, color: c.head?INK:(ci===0?INK:SOFT),
      bold: c.head||ci===0, align:"left", valign:"top",
      fill:{color: c.head?BG2:CARD}, margin:[3,5,3,5] } }));
  });
  s.addTable(trows,{x,y,w,h,border:{type:"solid",color:LINE,pt:1},autoPage:false,valign:"top"});
}

function renderIO(pres,s,io,x,y,w,h){
  const leftW=2.5, rightW=2.9, arrow=0.5;
  const centerW=Math.max(2.4, w-leftW-rightW-arrow*2);
  const lx=x, cxx=x+leftW+arrow, rx=x+leftW+arrow+centerW+arrow;
  // left encoder
  drawEnc(pres,s,io.encs[0],lx,y,leftW,h);
  s.addText("→",{x:x+leftW,y,w:arrow,h,align:"center",valign:"middle",fontFace:FONT,fontSize:18,color:SOFT});
  // center space
  const sp=io.space||{title:"",dots:[]};
  card(pres,s,cxx,y+0.06,centerW,h-0.12,BG2,LINE);
  if(sp.title) s.addText(sp.title,{x:cxx,y:y+0.14,w:centerW,h:0.3,align:"center",valign:"middle",fontFace:FONT,fontSize:11,bold:true,color:GR});
  const planeX=cxx+0.2, planeY=y+0.5, planeW=centerW-0.4, planeH=h-0.9;
  // connector lines between dot0-dot1 (green), dot0-dot2 (dashed gray)
  const P=(d)=>({px:planeX+d.left*planeW, py:planeY+d.top*planeH});
  if(sp.dots.length>=2){ line(pres,s,P(sp.dots[0]),P(sp.dots[1]),GR,1.75,null); }
  if(sp.dots.length>=3){ line(pres,s,P(sp.dots[0]),P(sp.dots[2]),GY,1.25,"dash"); }
  sp.dots.forEach(d=>{
    const p=P(d);
    s.addShape(pres.ShapeType.ellipse,{x:p.px-0.09,y:p.py-0.09,w:0.18,h:0.18,fill:{color:d.color},line:{color:BG2,width:1.5}});
    s.addText(d.label,{x:p.px-0.7,y:p.py+0.08,w:1.4,h:0.24,align:"center",valign:"middle",fontFace:FONT,fontSize:9,bold:true,color:INK});
  });
  s.addText("←",{x:x+leftW+arrow+centerW,y,w:arrow,h,align:"center",valign:"middle",fontFace:FONT,fontSize:18,color:SOFT});
  // right encoder
  drawEnc(pres,s,io.encs[1],rx,y,rightW,h);
}
function drawEnc(pres,s,enc,x,y,w,h){
  if(!enc) return;
  const nt=enc.toks.length; const th=0.5; const gap=0.12;
  const blockH=0.34+nt*th+(nt-1)*gap;
  let cy=y+(h-blockH)/2;
  s.addText(enc.label,{x,y:cy,w,h:0.3,align:"center",valign:"middle",fontFace:FONT,fontSize:10,bold:true,color:SOFT});
  cy+=0.36;
  enc.toks.forEach(t=>{
    const fill=t.kind==="bl"?BL:t.kind==="pp"?PP:BG2;
    const col=t.kind==="mut"?SOFT:WHITE;
    s.addShape(pres.ShapeType.roundRect,{x:x+0.15,y:cy,w:w-0.3,h:th,fill:{color:fill},line:t.kind==="mut"?{color:LINE,width:1}:{type:"none"},rectRadius:0.08});
    s.addText(t.text,{x:x+0.15,y:cy,w:w-0.3,h:th,align:"center",valign:"middle",fontFace:FONT,fontSize:11,bold:t.kind!=="mut",color:col,fit:"shrink"});
    cy+=th+gap;
  });
}
function line(pres,s,a,b,color,width,dash){
  const x=Math.min(a.px,b.px), y=Math.min(a.py,b.py);
  const w=Math.abs(a.px-b.px)||0.01, hh=Math.abs(a.py-b.py)||0.01;
  const flipV=((a.px<b.px)!==(a.py<b.py));
  const opt={x,y,w,h:hh,line:{color,width:width||1.5,beginArrowType:"none",endArrowType:"none"}};
  if(dash) opt.line.dashType=dash;
  if(flipV) opt.flipV=true;
  s.addShape(pres.ShapeType.line,opt);
}

// ---- slide builders ----
function buildCover(pres,sec){
  const cover=sec.querySelector(".cover");
  const s=pres.addSlide({masterName:"M"});
  s.background={color:GR2};
  const kick=clean((cover.querySelector(".kick")||{text:""}).text);
  const title=clean(cover.querySelector("h1").text);
  const sub=clean((cover.querySelector(".sub")||cover.querySelector("p")||{text:""}).text);
  if(kick) s.addText(kick.toUpperCase(),{x:0.8,y:2.4,w:11.7,h:0.4,fontFace:FONT,fontSize:14,color:"CFE0D8",charSpacing:3,align:"center"});
  s.addText(title,{x:0.8,y:2.9,w:11.7,h:1.7,fontFace:FONT,fontSize:40,bold:true,color:WHITE,align:"center",valign:"middle"});
  if(sub) s.addText(sub,{x:0.8,y:4.8,w:11.7,h:0.8,fontFace:FONT,fontSize:18,color:"E4EDE8",align:"center",valign:"top"});
  s.addText("study-room · AIFFEL 학습 정리",{x:0.8,y:6.6,w:11.7,h:0.4,fontFace:FONT,fontSize:12,color:"9DBAAF",align:"center"});
}
function buildPart(pres,sec){
  const part=sec.querySelector(".part");
  const s=pres.addSlide({masterName:"M"});
  s.background={color:BG};
  const no=clean((part.querySelector(".pno")||{text:""}).text);
  const title=clean((part.querySelector("h2")||{text:""}).text);
  const sub=clean((part.querySelector("p")||{text:""}).text);
  const who=clean((part.querySelector(".who")||{text:""}).text);
  s.addShape(pres.ShapeType.roundRect,{x:5.66,y:2.0,w:2.0,h:2.0,rectRadius:0.3,fill:{color:GR},line:{type:"none"}});
  s.addText(no,{x:5.66,y:2.0,w:2.0,h:2.0,align:"center",valign:"middle",fontFace:FONT,fontSize:52,bold:true,color:WHITE});
  s.addText(title,{x:1.0,y:4.3,w:11.3,h:0.95,align:"center",fontFace:FONT,fontSize:30,bold:true,color:INK,valign:"middle"});
  if(sub) s.addText(sub,{x:1.0,y:5.3,w:11.3,h:0.6,align:"center",fontFace:FONT,fontSize:16,color:SOFT});
  if(who){ const bw=Math.min(6.5,1.6+who.length*0.14);
    s.addShape(pres.ShapeType.roundRect,{x:(W-bw)/2,y:6.0,w:bw,h:0.5,fill:{color:BG2},line:{color:LINE,width:1},rectRadius:0.25});
    s.addText(who,{x:(W-bw)/2,y:6.0,w:bw,h:0.5,align:"center",valign:"middle",fontFace:FONT,fontSize:13,color:SOFT}); }
}
function buildContent(pres,sec){
  const s=pres.addSlide({masterName:"M"});
  s.background={color:BG};
  const h=sec.querySelector("h2")||sec.querySelector("h1");
  const titleRuns=h?richRuns(h,INK):[{text:"",color:INK}];
  s.addText(toRuns(titleRuns,INK,{fontSize:24,bold:true,fontFace:FONT}),{x:CX,y:0.42,w:CW,h:0.8,valign:"middle",fit:"shrink"});
  s.addShape(pres.ShapeType.rect,{x:CX+0.02,y:1.24,w:0.85,h:0.045,fill:{color:GR},line:{type:"none"}});

  const blocks=parseBlocks(sec);
  if(!blocks.length) return;
  const nat=blocks.map(measure);
  const total=nat.reduce((a,v)=>a+v,0)+GAP*(blocks.length-1);
  const avail=BOTTOM-TOP;
  const scale=Math.min(1, avail/total);
  let cy=TOP;
  blocks.forEach((b,idx)=>{
    const bh=nat[idx]*scale;
    renderBlock(pres,s,b,CX,cy,CW,bh);
    cy+=bh+GAP*scale;
  });
}

function buildDeck(folder){
  const file=path.join(ROOT,folder,"index.html");
  const html=fs.readFileSync(file,"utf8");
  const root=parse(html,{blockTextElements:{script:false,style:false}});
  const docTitle=clean((root.querySelector("title")||{text:""}).text).split("·")[0].trim();
  const secs=root.querySelectorAll(".slide");
  const pres=new pptxgen();
  pres.layout="LAYOUT_WIDE";
  pres.defineSlideMaster({title:"M",background:{color:BG}});
  for(const sec of secs){
    if(sec.querySelector(".cover")&&sec.querySelector(".cover h1")) buildCover(pres,sec);
    else if(sec.querySelector(".part")) buildPart(pres,sec);
    else buildContent(pres,sec);
  }
  const out=path.join(ROOT,folder,folder+".pptx");
  return pres.writeFile({fileName:out}).then(()=>({folder,out,slides:secs.length,title:docTitle}));
}

(async ()=>{
  for(const f of LESSONS){
    try{ const r=await buildDeck(f); console.log("OK",r.folder,"→",path.basename(r.out),"("+r.slides+" slides)"); }
    catch(e){ console.error("FAIL",f,e.message); }
  }
})();
