/* study-room: 각 강의 index.html → PPTX 변환기
   실행: node build_ppts.js [folder1 folder2 ...]   (인자 없으면 아래 LESSONS 전체)  */
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const { parse } = require("node-html-parser");

const ROOT = __dirname;
const LESSONS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["quantization","run-local","local-vs-api","data-axis","cost-axis","control-axis",
     "decision-doc","two-requests","ocr-pipeline","detect-segment","vlm"];

// palette
const INK="2A2723", SOFT="6B6357", GR="3F6B5F", GR2="2C4D44", GOLD="C8A15A",
      RED="A65A3F", BG2="F2EDE4", LINE="E3DACB", CARD="FFFFFF", BGC="FBFAF7";
const FONT="Malgun Gothic", MONO="Consolas";
const W=13.33, H=7.5;

const DIAG = ["line2","flowf","paths","tl","venn","seg3","rflow","chain","io","maskrow",
  "scenebox","room","rcpt","bars","qk","three","ladder","iou","tlaxis","tlrow","passrow",
  "redcap","mtbl","btbl","fx","cir","room"];

function clean(t){
  if(!t) return "";
  return t.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&nbsp;/g," ")
          .replace(/\s+/g," ").trim();
}
function hasClass(el, c){ return el.classList && el.classList.contains(c); }
function anyClass(el, arr){ return arr.some(c=>hasClass(el,c)); }

// per-slide extraction → {kind, ...}
function extractSlide(sec){
  // cover
  const cover = sec.querySelector(".cover");
  if(cover && cover.querySelector("h1")){
    return { kind:"cover",
      kick: clean((cover.querySelector(".kick")||{}).text),
      title: clean(cover.querySelector("h1").text),
      sub: clean((cover.querySelector(".sub")||cover.querySelector("p")||{}).text) };
  }
  // part divider
  const part = sec.querySelector(".part");
  if(part){
    return { kind:"part",
      no: clean((part.querySelector(".pno")||{}).text),
      title: clean((part.querySelector("h2")||{}).text),
      sub: clean((part.querySelector("p")||{}).text),
      who: clean((part.querySelector(".who")||{}).text) };
  }
  // content
  const h = sec.querySelector("h2") || sec.querySelector("h1");
  const title = clean(h ? h.text : "");
  const bullets = [];
  let table = null;
  const seen = new Set();
  function pushB(txt, mark){ txt=clean(txt); if(txt && !seen.has(mark+txt)){ seen.add(mark+txt); bullets.push({t:txt, m:mark}); } }
  function walk(node){
    for(const ch of node.childNodes){
      if(ch.nodeType!==1) continue; // element only
      const tag = ch.tagName;
      if(tag==="H2"||tag==="H1") continue;
      if(tag==="TABLE"){
        if(!table){
          const rows=[];
          ch.querySelectorAll("tr").forEach(tr=>{
            const cells=tr.querySelectorAll("th,td").map(td=>clean(td.text));
            if(cells.length) rows.push(cells);
          });
          if(rows.length) table=rows;
        }
        continue;
      }
      if(tag==="UL" && hasClass(ch,"pts")){ ch.querySelectorAll("li").forEach(li=>pushB(li.text,"•")); continue; }
      if(hasClass(ch,"steps")){ ch.querySelectorAll(".st").forEach(st=>{
          const n=clean((st.querySelector(".n")||{}).text), t=clean((st.querySelector(".t")||{}).text);
          pushB((n?n+". ":"")+t,"•"); }); continue; }
      if(hasClass(ch,"qa")){ ch.querySelectorAll(".q").forEach(q=>pushB(q.text,"•")); continue; }
      if(hasClass(ch,"hl")){ pushB(ch.text,"★"); continue; }
      if(hasClass(ch,"big")){ pushB(ch.text,"❖"); continue; }
      if(hasClass(ch,"fx")){ pushB(ch.text,"∑"); continue; }
      if(hasClass(ch,"box")){
        const h3=ch.querySelector("h3"); if(h3) pushB(h3.text,"▸");
        ch.querySelectorAll("p").forEach(p=>pushB(p.text,"  "));
        // nested lists inside box
        ch.querySelectorAll("ul.pts li").forEach(li=>pushB(li.text,"  •"));
        continue;
      }
      if(anyClass(ch,["grid2","grid3","tw"])){ walk(ch); continue; }
      if(anyClass(ch,DIAG)){ const t=clean(ch.text); if(t) pushB("[그림] "+t.slice(0,180),"▪"); continue; }
      if(tag==="PRE"){ pushB(clean(ch.text),"code"); continue; }
      if(tag==="P"){ pushB(ch.text,"  "); continue; }
      if(tag==="DIV"){ walk(ch); continue; }
    }
  }
  walk(sec);
  return { kind:"content", title, bullets, table };
}

function buildDeck(folder){
  const file = path.join(ROOT, folder, "index.html");
  const html = fs.readFileSync(file, "utf8");
  const root = parse(html, { blockTextElements:{ script:false, style:false } });
  const docTitle = clean((root.querySelector("title")||{}).text).split("·")[0].trim();
  const secs = root.querySelectorAll(".slide");

  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.defineSlideMaster({ title:"M", background:{ color:BGC } });

  for(const sec of secs){
    const d = extractSlide(sec);
    const s = pres.addSlide({ masterName:"M" });

    if(d.kind==="cover"){
      s.background = { color: GR2 };
      s.addShape(pres.ShapeType.rect,{x:0,y:0,w:W,h:H,fill:{color:GR2}});
      if(d.kick) s.addText(d.kick.toUpperCase(),{x:0.8,y:2.4,w:11.7,h:0.4,fontFace:FONT,fontSize:14,color:"CFE0D8",charSpacing:3,align:"center"});
      s.addText(d.title,{x:0.8,y:2.9,w:11.7,h:1.6,fontFace:FONT,fontSize:40,bold:true,color:"FFFFFF",align:"center",valign:"middle"});
      if(d.sub) s.addText(d.sub,{x:0.8,y:4.7,w:11.7,h:0.7,fontFace:FONT,fontSize:18,color:"E4EDE8",align:"center"});
      s.addText("study-room · AIFFEL 학습 정리",{x:0.8,y:6.5,w:11.7,h:0.4,fontFace:FONT,fontSize:12,color:"9DBAAF",align:"center"});
      continue;
    }
    if(d.kind==="part"){
      s.background = { color: BGC };
      s.addShape(pres.ShapeType.roundRect,{x:5.66,y:2.0,w:2.0,h:2.0,rectRadius:0.3,fill:{color:GR}});
      s.addText(d.no||"",{x:5.66,y:2.0,w:2.0,h:2.0,align:"center",valign:"middle",fontFace:FONT,fontSize:52,bold:true,color:"FFFFFF"});
      s.addText(d.title,{x:1.0,y:4.3,w:11.3,h:0.9,align:"center",fontFace:FONT,fontSize:30,bold:true,color:INK});
      if(d.sub) s.addText(d.sub,{x:1.0,y:5.2,w:11.3,h:0.6,align:"center",fontFace:FONT,fontSize:16,color:SOFT});
      if(d.who) s.addText(d.who,{x:1.0,y:5.9,w:11.3,h:0.5,align:"center",fontFace:FONT,fontSize:13,italic:true,color:GOLD});
      continue;
    }
    // content
    s.addText(d.title,{x:0.6,y:0.4,w:12.13,h:0.9,fontFace:FONT,fontSize:26,bold:true,color:INK,valign:"middle",margin:0});
    const hasTable = d.table && d.table.length>1;
    const bulletsY = 1.45;
    const bulletsH = hasTable ? 2.5 : 5.55;

    // build text runs
    const runs = [];
    d.bullets.forEach((b,idx)=>{
      const isCallout = b.m==="★"||b.m==="❖"||b.m==="∑";
      const isCode = b.m==="code";
      const isSub = b.m==="  "||b.m==="  •";
      const opt = { fontFace: isCode?MONO:FONT, breakLine:true, paraSpaceAfter: 6,
        fontSize: isCode?11:14, color: isCode?INK: (isCallout?GR: (isSub?SOFT:INK)),
        bold: b.m==="▸", bullet: (b.m==="•"||b.m==="  •")?{code:"2022",indent:14}: (b.m==="▪"?{code:"25AA",indent:14}:false),
        indentLevel: isSub?1:0 };
      let text = b.t;
      if(b.m==="★") text = "★ "+text;
      else if(b.m==="❖") text = "❖ "+text;
      else if(b.m==="∑") text = text;
      else if(b.m==="▸") text = text;
      runs.push({ text, options: opt });
    });
    if(runs.length) s.addText(runs,{x:0.6,y:bulletsY,w:12.13,h:bulletsH,valign:"top",margin:0,fit:"shrink"});

    if(hasTable){
      const cols = Math.max(...d.table.map(r=>r.length));
      const rows = d.table.map(r=>{
        const cells = r.slice();
        while(cells.length<cols) cells.push("");
        return cells.map((c,ci)=>({ text:c, options:{
          fontFace:FONT, fontSize:11, color: SOFT, valign:"top",
          fill:{color: r===d.table[0]?BG2:CARD}, bold: r===d.table[0], align:"left" } }));
      });
      s.addTable(rows,{x:0.6,y:4.15,w:12.13,h:2.95,border:{type:"solid",color:LINE,pt:1},
        autoPage:false, fontFace:FONT});
    }
  }

  const out = path.join(ROOT, folder, folder+".pptx");
  return pres.writeFile({ fileName: out }).then(()=>({folder, out, slides:secs.length, title:docTitle}));
}

(async ()=>{
  for(const f of LESSONS){
    try{ const r = await buildDeck(f); console.log("OK", r.folder, "→", path.basename(r.out), "("+r.slides+" slides)"); }
    catch(e){ console.error("FAIL", f, e.message); }
  }
})();
