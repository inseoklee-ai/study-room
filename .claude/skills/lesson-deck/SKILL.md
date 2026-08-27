---
name: lesson-deck
description: study-room 저장소에 AIFFEL 강의 학습 정리를 웹 슬라이드 덱(폴더/index.html)과 PPT(폴더/폴더명.pptx)로 만들고, 커리큘럼 지도(index.html)·README 에 반영해 GitHub Pages 로 배포한다. 사용자가 LMS 강의 본문을 붙여주며 "학습내용 정리해줘" "강의 정리해서 웹과 PPT로" "덱 만들어줘" "PPT정리" 라고 할 때, 또는 기존 덱을 고치거나 PPT 를 다시 뽑을 때 사용한다.
---

# 강의 학습 정리 — 웹 덱 + PPT

## 이 저장소가 무엇인가

모두의연구소 **AIFFEL 과정을 수강하며 정리한 개인 학습 아카이브**다.
강의 하나를 단순 필기가 아니라 **발표할 수 있는 형태**로 재가공해, 강의마다 두 가지를 함께 낸다.

- 🖥️ **웹 슬라이드** — GitHub Pages 로 배포되는 단일 HTML 인터랙티브 덱
- 📊 **PPT** — 다운로드용 `.pptx` (같은 HTML 에서 자동 변환)

홈(커리큘럼 지도)은 <https://inseoklee-ai.github.io/study-room/> 이다.
소프트웨어 제품이 아니라 **교육 콘텐츠 저장소**다. 코드 품질보다 **설명이 맞는지·발표가 되는지**가 기준이다.

| 무엇 | 어디 |
|---|---|
| 커리큘럼 지도 (홈) | `index.html` — 대단원 → 강의 → 소단원, 라이트/다크, 자체 CSS |
| 진행 체크리스트 | `README.md` — 같은 목차를 ✅ 로 + 하단에 라이브 주소 목록 |
| 강의별 산출물 | `<폴더명>/index.html` + `<폴더명>/<폴더명>.pptx` 한 쌍 (2026-08 기준 110개) |
| PPT 빌더 | `build_ppts.js` — Node.js + `pptxgenjs`, 카드형 덱 디자인 |
| 커밋 제외 | `node_modules/` `package.json` `package-lock.json` `*.pdf` |

기술 스택은 **순수 HTML/CSS/JS**(외부 프레임워크 없음) + GitHub Pages + Node.js·pptxgenjs 뿐이다.
새 의존성·프레임워크를 끌어오지 않는다.

## 시작하기 전에 — 본문이 없으면 만들지 않는다

**소단원 제목만 보고 내용을 지어내면 학습 정리가 아니라 창작이다.**
LMS 본문이 없으면 만들지 말고 요청한다. 본문에 있는 것은 이렇게 다룬다.

- 코드·명령어·실측 수치·사례 이름은 **원문 그대로** 살린다
- 강사가 "아직 안 된다 / 주의하라"고 못 박은 대목을 지우지 않는다 — 과장은 학습을 망친다
- 과제·루브릭 문구가 있으면 마지막 덱에 제출 슬라이드로 넣는다

## 작업 순서

### 1. 어디에 붙는지 확인한다

`index.html` 과 `README.md` 에서 이번 강의의 자리를 찾는다. 소단원 제목이 이미 박혀 있고 본문만 비어 있는
(`예정 (0/N)`) 자리가 대개 다음 차례다. **목차에 없는 강의면 목차 줄부터 추가한다.**

### 2. 덱 분할안을 먼저 한 줄로 제시한다

작성에 들어가기 전에 "소단원 몇~몇 → 어느 폴더" 를 사용자에게 보이고 시작한다.

- **최근 관행은 소단원 1개 = 덱 1개**, 덱 하나가 **17~20 슬라이드** (대단원 4·백엔드 강의가 이 방식)
- 옛 강의는 **소단원 2개를 한 덱**으로 묶고 12~18 슬라이드였다. 소단원이 짧거나 둘이 한 몸일 때만 묶는다
- 묶기로 했다면 소단원 9개 + 제출이면 덱 4~5개가 적당하다
- 폴더명은 **영어 kebab-case**, 내용을 말해주는 이름 — `why-frameworks` `mock-and-api` `terminal-anatomy`
- 한 덱에 여러 소단원을 묶으면, 지도에서는 **뒤 소단원을 `#N` 앵커로 링크**하고 `✓ 포함` 으로 표시한다

### 3. 덱 HTML 을 쓴다

`references/deck-template.html` 을 새 폴더의 `index.html` 로 복사해 시작한다.
CSS·조작 스크립트가 이미 완성돼 있으니 **`<title>` 과 슬라이드 본문만** 채운다.

- 쓸 수 있는 마크업은 `references/block-vocabulary.md` 에 있는 것만 — **PPT 변환기가 아는 어휘여야 한다**
- 슬라이드 구성: 표지 → (지도) → PART 구분면 → 본문 → 이해도 확인 → 마무리
- 모든 슬라이드에 `data-part` 와 **`<aside>` 학습노트**를 단다. `<aside>` 는 `S` 키로 뜨는 **발표 대본**이다
- 한국어로 쓴다. 원어는 처음 등장할 때만 병기
- 원문 순서를 그대로 옮기지 않고 **강의 흐름으로 재배열**해도 된다. 그게 이 저장소의 값이다
- 조작키는 `←` `→` 이동 · `S` 노트 · `F` 전체화면 · `🌗` 테마 — 템플릿에 이미 들어 있다

### 4. PPT 를 뽑는다

`package.json` 이 gitignore 대상이라 새 클론에서는 의존성이 없다. 없으면 먼저 깐다.

```bash
npm i pptxgenjs node-html-parser
```

폴더 이름을 인자로 주면 그 폴더만 변환한다. **인자 없이 실행하면 옛 강의 전체를 다시 뽑으니 항상 인자를 준다.**

```bash
node build_ppts.js <폴더명> [<폴더명> ...]
```

`OK <폴더> → <폴더>.pptx (N slides)` 가 나오면 성공, `FAIL` 이면 마크업 문제다.
슬라이드 수가 HTML 의 `<section class="slide">` 개수와 같은지 확인한다.

새 폴더 이름은 `build_ppts.js` 상단 `LESSONS` 기본 목록 **끝에도 추가해 둔다** — 나중에 전체를 다시 뽑을 때 쓰는 목록이다.

### 5. 커리큘럼 지도(`index.html`)에 반영한다

강의 줄(`.row`)의 상태 배지를 바꾸고, 그 아래 `.lessons` 안 소단원 줄을 채운다.

```html
<div class="row"><span class="n">2</span><span class="t">강의 제목</span><span class="meta"><span class="done">✓ 완결 (9/9)</span></span></div>
<div class="lessons">
  <div class="lesson"><a class="open" href="폴더명/"><span class="ln">1</span><span class="t">소단원 제목</span></a><span class="meta"><a class="dl" href="폴더명/폴더명.pptx">📊 PPT</a><span class="done">✓ 완료</span></span></div>
  <div class="lesson"><a class="open" href="폴더명/#8"><span class="ln">2</span><span class="t">같은 덱에 묶인 소단원</span></a><span class="meta"><span class="done">✓ 포함</span></span></div>
</div>
```

- `class="soon">예정` → `class="done">✓ 완료`(덱 대표) / `✓ 포함`(같은 덱 뒷부분)
- 프로젝트 강의는 `<span class="pj">프로젝트</span>` 를 유지한다
- **상단 칩 숫자를 함께 맞춘다** — `대단원 N` · `완료한 강의 N` · `웹 슬라이드 N개` · `📊 PPT N개` · 마지막 칩은 방금 완결한 강의 이름

### 6. README 를 두 곳 고친다

**(1) 커리큘럼 체크리스트** — 지도와 같은 내용을 마크다운으로 한 번 더 쓴다.

```markdown
2. **강의 제목** ✅ 완결 (9/9)
   - ✅ ②-1. 소단원 제목 — 🖥️ [웹 슬라이드](https://inseoklee-ai.github.io/study-room/폴더명/) · 📊 [PPT](폴더명/폴더명.pptx)
   - ✅ ②-2. 같은 덱에 묶인 소단원 — 🖥️ [②-1 덱에 포함](https://inseoklee-ai.github.io/study-room/폴더명/#8)
```

웹 슬라이드는 **절대 URL**, PPT 는 **상대 경로**다 (README 에서 눌러 내려받게).

**(2) 하단 라이브 주소 목록** — "웹 슬라이드는 반드시 라이브 사이트에서 열어야 합니다" 아래의 인용 블록에
같은 순서로 한 줄씩 덧붙인다. 이 목록을 빼먹으면 저장소 화면에서 링크를 누른 사람이 소스 폴더로 간다.

```markdown
> - 대2-백엔드-②1 https://inseoklee-ai.github.io/study-room/why-server/
```

### 7. 확인하고 배포한다

```bash
python -m http.server 8000    # 또는 npx serve
```

브라우저로 새 덱을 실제로 열어 확인한다.

- 슬라이드 수·`←`/`→` 이동·진행바·`S` 노트 표시·`F` 전체화면
- 콘솔 오류 0
- 홈 지도에서 새 링크와 PPT 링크가 실제로 눌리는지
- **글자 넘침 검사는 하지 않는다 — 사용자가 직접 본다.** 요청받으면 그때만

그 다음 커밋·푸시한다. 커밋 메시지는 한국어, 지금까지의 형식을 따른다.

```bash
git add <폴더들> index.html README.md
git commit -m "대단원2 중단원② 강2 완결: 백엔드 — 화면 뒤에서 일어나는 일들 ①~⑨ 5개 덱"
git push origin master
```

⚠️ 이 저장소의 기본 브랜치는 **`master`** 다 (`study-room-2` 는 `main`). `git push origin main` 은 실패한다.

푸시 후 GitHub Pages 재빌드를 기다려 **배포된 URL 로 다시 확인**한다 (새 덱 + 홈 지도, 200).
반영이 늦으면 몇 번 폴링한다.

## 하지 말 것

| 하지 말 것 | 이유 |
|---|---|
| 본문 없이 제목만 보고 내용 생성 | 학습 정리가 아니라 창작 |
| `references/block-vocabulary.md` 에 없는 마크업 | PPT 에서 조용히 뭉개진다 |
| `node build_ppts.js` 를 인자 없이 실행 | 옛 강의 전체를 다시 뽑아 diff 가 오염된다 |
| 덱마다 CSS·팔레트를 새로 만들기 | 30개 덱의 디자인이 갈라진다. 템플릿을 쓴다 |
| 외부 프레임워크·CDN·새 의존성 추가 | 단일 HTML 원칙이 깨진다 |
| `.pptx` 만 고치기 | 원본은 HTML 이다. HTML 을 고치고 다시 뽑는다 |
| 지도·README 갱신 없이 덱만 커밋 | 링크 없는 덱은 아무도 찾지 못한다 |
| `git push --force` · `reset --hard` | 되돌릴 수 없다 |

## 커밋 전 체크리스트

- [ ] 새 폴더에 `index.html` 과 `<폴더명>.pptx` 가 **둘 다** 있다
- [ ] 모든 슬라이드에 `<aside>` 학습노트가 있다
- [ ] `data-part` 가 채워져 좌상단 파트 표시가 나온다
- [ ] `node build_ppts.js <폴더>` 가 `OK`, 슬라이드 수가 HTML 과 일치
- [ ] `index.html` 지도에 웹 링크·PPT 링크·상태 배지 반영 + **상단 칩 숫자** 갱신
- [ ] `README.md` **두 곳** 반영 — 커리큘럼 체크리스트(웹=절대 URL, PPT=상대 경로) + 하단 라이브 주소 목록
- [ ] `build_ppts.js` 의 `LESSONS` 기본 목록에 새 폴더 이름 추가
- [ ] 로컬 서버로 실제로 열어 확인, 콘솔 오류 없음
- [ ] 커밋 메시지가 한국어이고 어느 대단원·중단원·강인지 드러난다
- [ ] 푸시 후 배포 URL 에서 재확인
