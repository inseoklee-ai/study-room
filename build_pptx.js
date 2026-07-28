const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
const W = 13.33, H = 7.5;

// ---- Palette (tech / ocean-midnight) ----
const NAVY  = "0E1B2C";  // dark bg
const NAVY2 = "16273D";  // card on dark
const BLUE  = "1E5F8C";
const TEAL  = "0E8C99";
const MINT  = "27C4A8";  // accent
const ORANGE= "E8703A";  // "heavy / training" accent
const LIGHT = "F4F7FA";  // light bg
const WHITE = "FFFFFF";
const INK   = "1C2A38";  // body text
const MUTED = "6B7A88";
const FONT  = "Malgun Gothic";

// ---- helpers ----
function bg(slide, color){ slide.background = { color }; }

function sectionTag(slide, num, dark){
  slide.addShape(pres.ShapeType.roundRect, { x:0.6, y:0.55, w:1.75, h:0.5, rectRadius:0.25, fill:{color:MINT} });
  slide.addText(`단원 ${num}`, { x:0.6, y:0.55, w:1.75, h:0.5, align:"center", valign:"middle",
    fontFace:FONT, fontSize:16, bold:true, color:NAVY });
}

function title(slide, text, dark){
  slide.addText(text, { x:0.6, y:1.15, w:12.1, h:0.95, fontFace:FONT, fontSize:34, bold:true,
    color: dark?WHITE:INK, align:"left", valign:"middle", margin:0 });
}

function keyBox(slide, text){
  slide.addShape(pres.ShapeType.roundRect, { x:0.6, y:6.35, w:12.13, h:0.78, rectRadius:0.1,
    fill:{color:"E8F6F3"} });
  slide.addShape(pres.ShapeType.roundRect, { x:0.6, y:6.35, w:0.14, h:0.78, rectRadius:0.05, fill:{color:MINT} });
  slide.addText([
    { text:"핵심  ", options:{ bold:true, color:TEAL } },
    { text:text, options:{ color:INK } },
  ], { x:0.95, y:6.35, w:11.6, h:0.78, fontFace:FONT, fontSize:15, valign:"middle", margin:0 });
}

// ============ SLIDE 1 : TITLE ============
(() => {
  const s = pres.addSlide(); bg(s, NAVY);
  // decorative circles
  s.addShape(pres.ShapeType.ellipse, { x:10.4, y:-1.4, w:4.6, h:4.6, fill:{color:NAVY2} });
  s.addShape(pres.ShapeType.ellipse, { x:11.7, y:4.6, w:3.4, h:3.4, fill:{color:BLUE, transparency:55} });
  s.addShape(pres.ShapeType.ellipse, { x:0.7, y:2.55, w:1.15, h:1.15, fill:{color:MINT} });
  s.addText("LLM", { x:0.7, y:2.55, w:1.15, h:1.15, align:"center", valign:"middle",
    fontFace:FONT, fontSize:15, bold:true, color:NAVY });

  s.addText("내 노트북에서도 LLM이 돌아갈까?", { x:0.7, y:3.75, w:11.2, h:1.0,
    fontFace:FONT, fontSize:42, bold:true, color:WHITE, margin:0 });
  s.addText("학습과 추론의 차이 · 로컬 LLM의 메모리 벽 · 오늘의 로드맵", { x:0.7, y:4.85, w:11.2, h:0.6,
    fontFace:FONT, fontSize:19, color:"AEC6D8", margin:0 });

  s.addText("모두의연구소  ·  LLM 학습노트", { x:0.7, y:6.55, w:8, h:0.5,
    fontFace:FONT, fontSize:14, color:MINT, bold:true, margin:0 });
  s.addNotes("도입: 수백만 달러 모델과 60만 원 그래픽카드, 둘 다 사실인 이유를 오늘 푼다.");
})();

// ============ SLIDE 2 : 단원 1 ============
(() => {
  const s = pres.addSlide(); bg(s, LIGHT);
  sectionTag(s, 1);
  title(s, "모순처럼 보이는 질문");

  const cardY = 2.35, cardW = 5.75, cardH = 3.35;
  // Left card - expensive
  s.addShape(pres.ShapeType.roundRect, { x:0.6, y:cardY, w:cardW, h:cardH, rectRadius:0.12, fill:{color:WHITE}, line:{color:"E1E8EE", width:1}, shadow:{type:"outer", color:"9AAAB8", blur:8, offset:3, angle:90, opacity:0.35} });
  s.addText("모델을 만드는 쪽", { x:0.95, y:2.6, w:cardW-0.7, h:0.5, fontFace:FONT, fontSize:16, bold:true, color:ORANGE, margin:0 });
  s.addText("수백만 달러", { x:0.95, y:3.1, w:cardW-0.7, h:0.9, fontFace:FONT, fontSize:40, bold:true, color:INK, margin:0 });
  s.addText([
    { text:"GPU 수천 대가 몇 달씩", options:{ breakLine:true } },
    { text:"= 사전학습(pre-training)의 세계", options:{ color:MUTED } },
  ], { x:0.95, y:4.15, w:cardW-0.7, h:1.3, fontFace:FONT, fontSize:15, color:INK, margin:0, lineSpacingMultiple:1.1 });

  // Right card - cheap
  const rx = 0.6 + cardW + 0.6;
  s.addShape(pres.ShapeType.roundRect, { x:rx, y:cardY, w:cardW, h:cardH, rectRadius:0.12, fill:{color:WHITE}, line:{color:"E1E8EE", width:1}, shadow:{type:"outer", color:"9AAAB8", blur:8, offset:3, angle:90, opacity:0.35} });
  s.addText("모델을 쓰는 쪽", { x:rx+0.35, y:2.6, w:cardW-0.7, h:0.5, fontFace:FONT, fontSize:16, bold:true, color:TEAL, margin:0 });
  s.addText("60만 원", { x:rx+0.35, y:3.1, w:cardW-0.7, h:0.9, fontFace:FONT, fontSize:40, bold:true, color:INK, margin:0 });
  s.addText([
    { text:"게임용 그래픽카드 한 장으로", options:{ breakLine:true } },
    { text:"30B 모델을 굴리는 사람도 있다", options:{ color:MUTED } },
  ], { x:rx+0.35, y:4.15, w:cardW-0.7, h:1.3, fontFace:FONT, fontSize:15, color:INK, margin:0, lineSpacingMultiple:1.1 });

  keyBox(s, "둘 다 사실이다. 이 모순을 푸는 열쇠 하나가 오늘 배울 모든 것을 이어 준다.");
  s.addNotes("수백만 달러짜리가 어떻게 60만 원 카드 안에 들어갔나? 둘 다 사실. 열쇠는 학습과 추론의 비용 구조 차이.");
})();

// ============ SLIDE 3 : 단원 2 ============
(() => {
  const s = pres.addSlide(); bg(s, LIGHT);
  sectionTag(s, 2);
  title(s, "학습과 추론은 애초에 다른 일");

  const colY = 2.35, colH = 3.75, colW = 5.75;
  // Training column
  s.addShape(pres.ShapeType.roundRect, { x:0.6, y:colY, w:colW, h:colH, rectRadius:0.12, fill:{color:"FDEEE6"} });
  s.addText("학습 = 모델을 만드는 일", { x:0.9, y:colY+0.2, w:colW-0.6, h:0.5, fontFace:FONT, fontSize:17, bold:true, color:ORANGE, margin:0 });
  s.addText([
    { text:"순전파 – 입력을 층층이 통과시켜 답을 냄", options:{ bullet:{indent:15}, breakLine:true } },
    { text:"활성값 – 순전파 중 각 층의 중간 결과를 전부 보관", options:{ bullet:{indent:15}, breakLine:true } },
    { text:"그래디언트(기울기) – 값을 바꾸면 오차가 얼마나 변하나", options:{ bullet:{indent:15}, breakLine:true } },
    { text:"옵티마이저(Adam) – 방향·들쭉날쭉함 2개 기록 보관", options:{ bullet:{indent:15}, breakLine:true } },
    { text:"혼합 정밀도 – FP16 계산 + FP32 사본 별도 보관", options:{ bullet:{indent:15} } },
  ], { x:0.95, y:colY+0.8, w:colW-0.6, h:colH-1.0, fontFace:FONT, fontSize:14, color:INK, margin:0, paraSpaceAfter:8, valign:"top" });

  // Inference column
  const rx = 0.6 + colW + 0.6;
  s.addShape(pres.ShapeType.roundRect, { x:rx, y:colY, w:colW, h:colH, rectRadius:0.12, fill:{color:"E5F4F1"} });
  s.addText("추론 = 만든 모델을 쓰는 일", { x:rx+0.3, y:colY+0.2, w:colW-0.6, h:0.5, fontFace:FONT, fontSize:17, bold:true, color:TEAL, margin:0 });
  s.addText([
    { text:"파라미터는 이미 정해졌고 조정하지 않음", options:{ bullet:{indent:15}, breakLine:true } },
    { text:"오차를 잴 일도, 거슬러 올라갈 일도 없음", options:{ bullet:{indent:15}, breakLine:true } },
    { text:"옵티마이저 상태를 들고 있을 필요 없음", options:{ bullet:{indent:15}, breakLine:true } },
    { text:"정해진 숫자로 행렬곱 한 번 → 다음 토큰 출력", options:{ bullet:{indent:15}, breakLine:true } },
    { text:"→ 학습 메모리 항목 중 '첫 줄'만 필요하다", options:{ bold:true, color:TEAL } },
  ], { x:rx+0.35, y:colY+0.8, w:colW-0.6, h:colH-1.0, fontFace:FONT, fontSize:14, color:INK, margin:0, paraSpaceAfter:8, valign:"top" });

  keyBox(s, "모델을 '만드는 일'과 '쓰는 일'은 비용 구조가 완전히 다르다 — 여기서 모든 것이 갈린다.");
  s.addNotes("학습은 파라미터+활성값+그래디언트+옵티마이저 상태까지 메모리에. 추론은 정해진 파라미터로 행렬곱 한 번.");
})();

// ============ SLIDE 4 : 메모리 해부 표 ============
(() => {
  const s = pres.addSlide(); bg(s, LIGHT);
  title(s, "파라미터 1개를 감당하는 데 드는 바이트");
  s.addText("허깅페이스가 정리한 학습 메모리 해부 기준", { x:0.6, y:2.0, w:12, h:0.4, fontFace:FONT, fontSize:14, color:MUTED, italic:true, margin:0 });

  const rows = [
    [{ text:"구분", options:{bold:true,color:WHITE,fill:{color:NAVY},align:"center"} },
     { text:"구성", options:{bold:true,color:WHITE,fill:{color:NAVY}} },
     { text:"파라미터당", options:{bold:true,color:WHITE,fill:{color:NAVY},align:"center"} },
     { text:"7B 모델 기준", options:{bold:true,color:WHITE,fill:{color:NAVY},align:"center"} }],
    [{ text:"학습", options:{bold:true,color:ORANGE,align:"center",valign:"middle",fill:{color:"FDEEE6"}} },
     { text:"FP16 2B + FP32 마스터 4B + Adam 8B + 그래디언트 4B  (+활성값 별도)", options:{color:INK,fill:{color:"FDEEE6"}} },
     { text:"18바이트+", options:{bold:true,color:ORANGE,align:"center",fill:{color:"FDEEE6"}} },
     { text:"126GB 이상", options:{bold:true,color:ORANGE,align:"center",fill:{color:"FDEEE6"}} }],
    [{ text:"추론", options:{bold:true,color:TEAL,align:"center",valign:"middle",fill:{color:"E5F4F1"}} },
     { text:"FP16 가중치 2B  (+ KV cache)", options:{color:INK,fill:{color:"E5F4F1"}} },
     { text:"2바이트대", options:{bold:true,color:TEAL,align:"center",fill:{color:"E5F4F1"}} },
     { text:"14GB 남짓", options:{bold:true,color:TEAL,align:"center",fill:{color:"E5F4F1"}} }],
  ];
  s.addTable(rows, { x:0.6, y:2.5, w:12.13, colW:[1.4,7.03,1.85,1.85], rowH:[0.5,1.0,0.85],
    fontFace:FONT, fontSize:13, valign:"middle", border:{type:"solid",color:"FFFFFF",pt:2}, align:"left" });

  // stat callout
  s.addShape(pres.ShapeType.roundRect, { x:0.6, y:5.15, w:12.13, h:1.05, rectRadius:0.1, fill:{color:NAVY} });
  s.addText([
    { text:"약 9배", options:{ fontSize:34, bold:true, color:MINT } },
    { text:"   같은 모델인데 학습과 추론의 메모리 요구가 아홉 배 가까이 차이 난다", options:{ fontSize:16, color:WHITE } },
  ], { x:1.0, y:5.15, w:11.4, h:1.05, fontFace:FONT, valign:"middle", margin:0 });

  keyBox(s, "학습은 데이터센터의 일, 추론은 노트북의 일 — 우리는 남이 정해 놓은 숫자를 '읽기만' 하면 된다.");
  s.addNotes("18바이트 vs 2바이트. 7B면 126GB vs 14GB. 추론은 첫 줄만 필요.");
})();

// ============ SLIDE 5 : 단원 3 ============
(() => {
  const s = pres.addSlide(); bg(s, LIGHT);
  sectionTag(s, 3);
  title(s, "그래도 벽은 하나 남는다");

  // left explanation
  s.addShape(pres.ShapeType.roundRect, { x:0.6, y:2.35, w:6.5, h:3.75, rectRadius:0.12, fill:{color:WHITE}, line:{color:"E1E8EE",width:1} });
  s.addText("추론이 공짜란 뜻은 아니다", { x:0.9, y:2.55, w:5.9, h:0.5, fontFace:FONT, fontSize:17, bold:true, color:INK, margin:0 });
  s.addText([
    { text:"파라미터를 전부 메모리에 올려놓아야 한다", options:{ bold:true, color:ORANGE, breakLine:true, bullet:{indent:15} } },
    { text:"토큰 하나를 만들려면 모든 층을 처음부터 끝까지 통과 → 각 층 가중치가 매번 필요", options:{ breakLine:true, bullet:{indent:15} } },
    { text:"일부만 올리고 디스크에서 읽어오면? 토큰마다 수 GB를 긁어와야 해 실용 속도가 안 나온다", options:{ bullet:{indent:15} } },
  ], { x:0.95, y:3.15, w:5.9, h:2.8, fontFace:FONT, fontSize:14.5, color:INK, margin:0, paraSpaceAfter:12, valign:"top", lineSpacingMultiple:1.05 });

  // right numbers
  const rx = 7.5;
  const nums = [
    ["7B (FP16)", "약 14GB", TEAL],
    ["Llama 3.1 8B", "14.96GB 측정", BLUE],
    ["70B (FP16)", "140GB — 다른 세계", ORANGE],
    ["노트북 GPU 메모리", "8 ~ 16GB 뿐", MUTED],
  ];
  let ny = 2.35;
  nums.forEach(([label, val, col]) => {
    s.addShape(pres.ShapeType.roundRect, { x:rx, y:ny, w:5.23, h:0.82, rectRadius:0.08, fill:{color:WHITE}, line:{color:"E1E8EE",width:1} });
    s.addShape(pres.ShapeType.roundRect, { x:rx, y:ny, w:0.13, h:0.82, rectRadius:0.04, fill:{color:col} });
    s.addText(label, { x:rx+0.35, y:ny, w:2.7, h:0.82, fontFace:FONT, fontSize:14, color:INK, valign:"middle", margin:0 });
    s.addText(val, { x:rx+2.9, y:ny, w:2.2, h:0.82, fontFace:FONT, fontSize:15, bold:true, color:col, valign:"middle", align:"right", margin:0 });
    ny += 0.95;
  });

  keyBox(s, "14.96GB 파일은 16GB 카드에도 겨우 들어간다 — 이 '메모리 벽'을 어떻게 넘었나가 다음 이야기.");
  s.addNotes("추론의 유일한 조건: 전체 파라미터를 메모리에. 70B=140GB는 노트북엔 불가능.");
})();

// ============ SLIDE 6 : 단원 4 로드맵 ============
(() => {
  const s = pres.addSlide(); bg(s, LIGHT);
  sectionTag(s, 4);
  title(s, "오늘 우리가 갈 길");

  const steps = [
    ["1", "양자화", "14GB를 4GB대로 줄이는 기술. 왜 줄여도 멀쩡한지, 얼마나 줄일 수 있는지, 무엇을 잃는지를 숫자로 확인", MINT],
    ["2", "직접 실행", "도구를 설치하고 모델을 받아, 내 기계에서 토큰이 나오는 것을 눈으로 확인", TEAL],
    ["3", "한계 체험", "속도는 어떤지, 품질이 어디서 무너지는지, 컨텍스트를 늘리면 무슨 일이 벌어지는지 몸으로 파악", BLUE],
    ["4", "판단 기준", "로컬 vs API를 3축으로 결정: ① 데이터가 어디까지 나가도 되나 ② 비용 역전점 ③ 인프라 의존도", "5E5AA8"],
  ];
  let y = 2.35;
  steps.forEach(([n, h, d, col]) => {
    s.addShape(pres.ShapeType.roundRect, { x:0.6, y:y, w:12.13, h:0.95, rectRadius:0.1, fill:{color:WHITE}, line:{color:"E1E8EE",width:1} });
    s.addShape(pres.ShapeType.ellipse, { x:0.85, y:y+0.185, w:0.58, h:0.58, fill:{color:col} });
    s.addText(n, { x:0.85, y:y+0.185, w:0.58, h:0.58, align:"center", valign:"middle", fontFace:FONT, fontSize:20, bold:true, color:WHITE });
    s.addText(h, { x:1.7, y:y, w:2.4, h:0.95, fontFace:FONT, fontSize:18, bold:true, color:INK, valign:"middle", margin:0 });
    s.addText(d, { x:4.15, y:y, w:8.4, h:0.95, fontFace:FONT, fontSize:13.5, color:"41525F", valign:"middle", margin:0, lineSpacingMultiple:1.02 });
    y += 1.12;
  });
  s.addNotes("양자화 → 실행 → 한계 → 판단(데이터/비용/의존성 3축).");
})();

// ============ SLIDE 7 : 핵심 한 장 요약 ============
(() => {
  const s = pres.addSlide(); bg(s, NAVY);
  s.addShape(pres.ShapeType.ellipse, { x:11.2, y:-1.2, w:3.8, h:3.8, fill:{color:NAVY2} });
  s.addText("오늘의 핵심 한 장 요약", { x:0.7, y:0.7, w:12, h:0.9, fontFace:FONT, fontSize:34, bold:true, color:WHITE, margin:0 });

  const pts = [
    "학습과 추론은 비용 구조가 완전히 다르다 — 모델을 만드는 일과 쓰는 일은 별개다.",
    "학습은 파라미터당 18바이트+ (가중치·그래디언트·옵티마이저·활성값), 추론은 2바이트대.",
    "7B 모델 기준 학습 126GB+ vs 추론 14GB — 약 9배 차이. 그래서 추론은 노트북의 일이 될 수 있다.",
    "단, 추론에도 벽 하나: 전체 파라미터를 메모리에 올려야 한다 (7B≈14GB, 70B≈140GB).",
    "노트북 GPU는 8~16GB뿐 → 이 벽을 넘는 기술이 '양자화'이며, 그것이 오늘의 출발점이다.",
  ];
  let y = 2.0;
  pts.forEach((t, i) => {
    s.addShape(pres.ShapeType.ellipse, { x:0.75, y:y+0.02, w:0.42, h:0.42, fill:{color:MINT} });
    s.addText(String(i+1), { x:0.75, y:y+0.02, w:0.42, h:0.42, align:"center", valign:"middle", fontFace:FONT, fontSize:15, bold:true, color:NAVY });
    s.addText(t, { x:1.4, y:y-0.1, w:11.2, h:0.7, fontFace:FONT, fontSize:16, color:"E4EDF3", valign:"middle", margin:0, lineSpacingMultiple:1.05 });
    y += 0.95;
  });
  s.addNotes("한 장 요약 슬라이드.");
})();

// ============ SLIDE 8 : 이해도 확인 질문 ============
(() => {
  const s = pres.addSlide(); bg(s, LIGHT);
  title(s, "이해도 확인 질문");
  s.addText("아래 5문항으로 오늘 핵심을 스스로 점검해 보세요. (정답은 다음 장)", { x:0.6, y:1.95, w:12, h:0.4, fontFace:FONT, fontSize:14, color:MUTED, italic:true, margin:0 });

  const qs = [
    "Q1. 같은 모델인데 학습은 데이터센터에서, 추론은 노트북에서 가능한 이유는 무엇인가?",
    "Q2. 혼합 정밀도 학습에서 파라미터 1개당 필요한 메모리는 총 몇 바이트이며, 어떤 항목으로 구성되는가?",
    "Q3. 추론 시 파라미터 1개당 필요한 바이트는? 7B 모델이면 대략 몇 GB인가?",
    "Q4. 추론에서도 넘어야 하는 '벽' 하나는 무엇인가? 왜 디스크에서 조금씩 읽어오는 방식은 안 되는가?",
    "Q5. 로컬 실행 vs API 사용을 결정하는 3가지 축은 무엇인가?",
  ];
  let y = 2.5;
  qs.forEach((q) => {
    s.addShape(pres.ShapeType.roundRect, { x:0.6, y:y, w:12.13, h:0.76, rectRadius:0.08, fill:{color:WHITE}, line:{color:"E1E8EE",width:1} });
    s.addText(q, { x:0.95, y:y, w:11.5, h:0.76, fontFace:FONT, fontSize:14.5, color:INK, valign:"middle", margin:0, lineSpacingMultiple:1.0 });
    y += 0.9;
  });
  s.addNotes("퀴즈 5문항. 핵심 개념 위주.");
})();

// ============ SLIDE 9 : 정답 & 해설 ============
(() => {
  const s = pres.addSlide(); bg(s, LIGHT);
  title(s, "정답 & 해설");

  const ans = [
    ["A1.", "학습과 추론의 비용 구조가 다르기 때문. 학습은 파라미터를 조정하려고 활성값·그래디언트·옵티마이저 상태까지 메모리에 얹지만, 추론은 정해진 파라미터로 행렬곱만 한다."],
    ["A2.", "총 18바이트+ = FP16 사본 2B + FP32 마스터 4B(가중치 6B) + Adam 옵티마이저 8B + 그래디언트 4B. 여기에 활성값이 별도로 얹힌다."],
    ["A3.", "2바이트대(FP16 가중치). 7B × 2B ≈ 14GB (Llama 3.1 8B는 14.96GB로 측정)."],
    ["A4.", "전체 파라미터를 메모리에 올려야 한다는 것. 토큰마다 모든 층의 가중치가 필요한데, 디스크에서 매번 수 GB를 읽어오면 실용적인 속도가 안 나오기 때문."],
    ["A5.", "① 데이터가 어디까지 나가도 되는가 ② 비용이 어느 지점에서 역전되는가 ③ 남의 인프라에 얼마나 의존해도 되는가."],
  ];
  let y = 1.85;
  ans.forEach(([n, t]) => {
    s.addText(n, { x:0.6, y:y, w:0.9, h:0.9, fontFace:FONT, fontSize:16, bold:true, color:TEAL, valign:"top", margin:0 });
    s.addText(t, { x:1.5, y:y, w:11.2, h:0.9, fontFace:FONT, fontSize:13.5, color:INK, valign:"top", margin:0, lineSpacingMultiple:1.03 });
    y += 1.02;
  });
  s.addNotes("정답 및 해설.");
})();

pres.writeFile({ fileName: "LLM_로컬실행_학습정리.pptx" }).then(f => console.log("saved:", f));
