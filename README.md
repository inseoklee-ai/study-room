# 📚 study-room

모두의연구소 AIFFEL 과정 학습 정리 저장소입니다.

> 🗺️ **커리큘럼 지도(홈)** → **https://inseoklee-ai.github.io/study-room/**

## 🗂️ 커리큘럼 (대단원 → 강의 → 소단원)

> 각 **강의(번호 항목)** 바로 아래에 그 **소단원**을 이어 붙입니다.

### 1. 아이펠 적용하기
1. 아이펠 적응하기 (아이펠 온보딩)
2. 아이펠이란?
3. 퀘스트란?
4. 코딩 0줄로 여는 첫날
5. [프로젝트] Computational Thinking — 컴퓨터처럼 사고하는 법

### 2. AIFFEL_LMS
**중단원 ①**
1. 바이브코딩을 위한 작업대 마련하기
2. [프로젝트] 웹페이지를 이루는 세 겹 & 게임만들기

**중단원 ②**
1. 오늘 써볼 프레임워크는?
2. [프로젝트] 백엔드 — 화면 뒤에서 일어나는 일들
3. 데이터베이스 — 고객의 데이터는 어떻게 관리될까
4. [프로젝트] AI 에이전트 도구 — 내 AI를 더 강하게
5. 메인 퀘스트 — 나만의 프로덕트 만들기

### 3. AI의 이해와 사용
1. AI는 어떻게 배우나
2. 트랜스포머 — AI는 어떻게 언어를 배웠나
3. **LLM과 로컬 실행 — 클라우드 API vs 로컬** ✅ 완결 (8/8)
   - ✅ 3-①. 내 노트북에서도 LLM이 돌아갈까 — 🖥️ [웹 슬라이드 열기](https://inseoklee-ai.github.io/study-room/local-llm/) · 📊 [PPT](LLM_로컬실행_학습정리.pptx) · 📝 [요약](#-내-노트북에서도-llm이-돌아갈까)
   - ✅ 3-②. 거대한 모델을 노트북에 밀어 넣기 (양자화) — 🖥️ [웹 슬라이드](https://inseoklee-ai.github.io/study-room/quantization/) · 📊 [PPT](quantization/quantization.pptx)
   - ✅ 3-③. 이제 직접 내 컴퓨터에서 모델을 돌려봅니다 (Ollama 실습) — 🖥️ [웹 슬라이드](https://inseoklee-ai.github.io/study-room/run-local/) · 📊 [PPT](run-local/run-local.pptx)
   - ✅ 3-④. 로컬과 API를 나란히 놓고 봅니다 — 🖥️ [웹 슬라이드](https://inseoklee-ai.github.io/study-room/local-vs-api/) · 📊 [PPT](local-vs-api/local-vs-api.pptx)
   - ✅ 3-⑤. 데이터는 어디에 남는가 (판단 축 ①·데이터) — 🖥️ [웹 슬라이드](https://inseoklee-ai.github.io/study-room/data-axis/) · 📊 [PPT](data-axis/data-axis.pptx)
   - ✅ 3-⑥. 비용은 어디서 발생하는가 (판단 축 ②·비용) — 🖥️ [웹 슬라이드](https://inseoklee-ai.github.io/study-room/cost-axis/) · 📊 [PPT](cost-axis/cost-axis.pptx)
   - ✅ 3-⑦. 통제권은 누구에게 남는가 (판단 축 ③·주권) — 🖥️ [웹 슬라이드](https://inseoklee-ai.github.io/study-room/control-axis/) · 📊 [PPT](control-axis/control-axis.pptx)
   - ✅ 3-⑧. 내 도메인의 실행 위치 결정문 (단원 종합) — 🖥️ [웹 슬라이드](https://inseoklee-ai.github.io/study-room/decision-doc/) · 📊 [PPT](decision-doc/decision-doc.pptx)
4. **AI는 문서와 사진에서 무엇을 꺼낼까** ⬅️ 진행 중
   - ✅ 4-①. 금요일 오후에 도착한 두 개의 요청 — 🖥️ [웹 슬라이드](https://inseoklee-ai.github.io/study-room/two-requests/) · 📊 [PPT](two-requests/two-requests.pptx)
   - ✅ 4-②. 글자를 꺼내는 길, OCR 조립 라인 — 🖥️ [웹 슬라이드](https://inseoklee-ai.github.io/study-room/ocr-pipeline/) · 📊 [PPT](ocr-pipeline/ocr-pipeline.pptx)
   - ✅ 4-③. 찾아내기와 경계 긋기 (객체 탐지·이미지 분할) — 🖥️ [웹 슬라이드](https://inseoklee-ai.github.io/study-room/detect-segment/) · 📊 [PPT](detect-segment/detect-segment.pptx)
   - ✅ 4-④. 이미지와 언어를 함께 보는 모델 (VLM) — 🖥️ [웹 슬라이드](https://inseoklee-ai.github.io/study-room/vlm/) · 📊 [PPT](vlm/vlm.pptx)

> 🖥️ **웹 슬라이드** 조작법: `←` `→` 또는 화면 좌/우 클릭으로 이동 · `S` 학습노트 · `F` 전체화면 · 🌗 라이트/다크 테마(시스템 설정 자동 감지).
>
> ⚠️ **웹 슬라이드는 반드시 라이브 사이트에서 열어야 합니다.** GitHub 저장소 화면(github.com)에서 위 링크를 누르면 슬라이드가 아니라 소스 폴더로 갑니다. 아래 라이브 주소로 접속하세요:
> - 🗺️ 커리큘럼 지도(홈): **https://inseoklee-ai.github.io/study-room/**
> - 3-① https://inseoklee-ai.github.io/study-room/local-llm/
> - 3-② https://inseoklee-ai.github.io/study-room/quantization/
> - 3-③ https://inseoklee-ai.github.io/study-room/run-local/
> - 3-④ https://inseoklee-ai.github.io/study-room/local-vs-api/
> - 3-⑤ https://inseoklee-ai.github.io/study-room/data-axis/
> - 3-⑥ https://inseoklee-ai.github.io/study-room/cost-axis/
> - 3-⑦ https://inseoklee-ai.github.io/study-room/control-axis/
> - 3-⑧ https://inseoklee-ai.github.io/study-room/decision-doc/
> - 4-① https://inseoklee-ai.github.io/study-room/two-requests/
> - 4-② https://inseoklee-ai.github.io/study-room/ocr-pipeline/
> - 4-③ https://inseoklee-ai.github.io/study-room/detect-segment/
> - 4-④ https://inseoklee-ai.github.io/study-room/vlm/
>
> 📊 **PPT**: 각 강의 폴더의 `<폴더명>.pptx` (예: `vlm/vlm.pptx`). GitHub 저장소나 라이브 사이트에서 내려받아 PowerPoint로 열 수 있습니다.
>
> ℹ️ AIFFEL_LMS의 중단원 ①·②는 강의 번호가 다시 1부터 시작하는 점을 반영해 나눈 것입니다. 실제 중단원 이름을 알려주시면 채워 넣겠습니다.

---

## 💻 내 노트북에서도 LLM이 돌아갈까?

> 학습과 추론의 차이 · 로컬 LLM의 메모리 벽 · 오늘의 로드맵

### 단원 1 — 모순처럼 보이는 질문

- **모델을 만드는 쪽**: GPU 수천 대가 몇 달씩 → **수백만 달러** (사전학습)
- **모델을 쓰는 쪽**: 게임용 그래픽카드 한 장(**60만 원**)으로 30B 모델을 굴리기도 한다
- 둘 다 사실이다. 이 모순을 푸는 열쇠 하나가 오늘 배울 모든 것을 이어 준다.

> **핵심**: 수백만 달러짜리 물건이 어떻게 저렴한 그래픽카드 안에 들어갔는가 — 그 답이 오늘의 출발점.

### 단원 2 — 학습과 추론은 애초에 다른 일

| 학습 = 모델을 **만드는** 일 | 추론 = 만든 모델을 **쓰는** 일 |
|---|---|
| 순전파: 입력을 층층이 통과시켜 답을 냄 | 파라미터는 이미 정해졌고 조정하지 않음 |
| 활성값: 순전파 중 각 층의 중간 결과를 전부 보관 | 오차를 잴 일도, 거슬러 올라갈 일도 없음 |
| 그래디언트(기울기): 값을 바꾸면 오차가 얼마나 변하나 | 옵티마이저 상태를 들고 있을 필요 없음 |
| 옵티마이저(Adam): 방향·변동폭 2개 기록 보관 | 정해진 숫자로 행렬곱 한 번 → 다음 토큰 |
| 혼합 정밀도: FP16 계산 + FP32 사본 별도 보관 | → 학습 메모리 항목 중 '첫 줄'만 필요 |

> **핵심**: 모델을 '만드는 일'과 '쓰는 일'은 비용 구조가 완전히 다르다 — 여기서 모든 것이 갈린다.

### 단원 2-1 — 파라미터 1개를 감당하는 데 드는 바이트

| 구분 | 구성 | 파라미터당 | 7B 모델 기준 |
|------|------|-----------|-------------|
| **학습** | FP16 2B + FP32 마스터 4B + Adam 8B + 그래디언트 4B (+활성값 별도) | **18바이트+** | **126GB 이상** |
| **추론** | FP16 가중치 2B (+ KV cache) | **2바이트대** | **14GB 남짓** |

> 같은 모델인데 필요 메모리가 **약 9배** 차이 → 학습은 데이터센터의 일, 추론은 노트북의 일.
> 우리는 남이 정해 놓은 숫자를 '읽기만' 하면 된다.

### 단원 3 — 그래도 벽은 하나 남는다

- 추론이 공짜란 뜻은 아니다 → **전체 파라미터를 메모리에 올려야 한다.**
- 토큰 하나를 만들려면 모든 층을 처음부터 끝까지 통과 → 각 층 가중치가 매번 필요.
- 일부만 올리고 디스크에서 읽어오면? 토큰마다 수 GB를 긁어와야 해 실용 속도가 안 나온다.

| 모델 | 필요 메모리 |
|------|-------------|
| 7B (FP16) | 약 14GB |
| Llama 3.1 8B | 14.96GB (측정값) |
| 70B (FP16) | 140GB — 다른 세계 |
| **노트북 GPU** | **8~16GB 뿐** |

> **핵심**: 14.96GB 파일은 16GB 카드에도 겨우 들어간다 — 이 '메모리 벽'을 넘는 법이 다음 이야기.

### 단원 4 — 오늘 우리가 갈 길

1. **양자화** — 14GB를 4GB대로 줄이는 기술. 왜 줄여도 멀쩡한지, 얼마나 줄일 수 있는지, 무엇을 잃는지를 숫자로 확인
2. **직접 실행** — 도구를 설치하고 모델을 받아, 내 기계에서 토큰이 나오는 것을 눈으로 확인
3. **한계 체험** — 속도·품질·컨텍스트를 늘렸을 때 벌어지는 일을 몸으로 파악
4. **판단 기준** — 로컬 vs API를 3축으로 결정: ① 데이터가 어디까지 나가도 되나 ② 비용 역전점 ③ 인프라 의존도

---

## ✅ 이해도 확인 질문

1. 같은 모델인데 학습은 데이터센터에서, 추론은 노트북에서 가능한 이유는?
2. 혼합 정밀도 학습에서 파라미터 1개당 필요한 메모리는 총 몇 바이트이며, 어떤 항목으로 구성되는가?
3. 추론 시 파라미터 1개당 필요한 바이트는? 7B 모델이면 대략 몇 GB인가?
4. 추론에서도 넘어야 하는 '벽' 하나는 무엇이며, 왜 디스크에서 조금씩 읽어오는 방식은 안 되는가?
5. 로컬 실행 vs API 사용을 결정하는 3가지 축은?

<details>
<summary>👉 정답 & 해설 보기</summary>

1. **학습과 추론의 비용 구조가 다르기 때문.** 학습은 파라미터를 조정하려고 활성값·그래디언트·옵티마이저 상태까지 메모리에 얹지만, 추론은 정해진 파라미터로 행렬곱만 한다.
2. **총 18바이트+** = FP16 사본 2B + FP32 마스터 4B(가중치 6B) + Adam 옵티마이저 8B + 그래디언트 4B. 여기에 활성값이 별도로 얹힌다.
3. **2바이트대(FP16 가중치).** 7B × 2B ≈ 14GB (Llama 3.1 8B는 14.96GB로 측정).
4. **전체 파라미터를 메모리에 올려야 한다는 것.** 토큰마다 모든 층의 가중치가 필요한데, 디스크에서 매번 수 GB를 읽어오면 실용적인 속도가 안 나오기 때문.
5. **① 데이터가 어디까지 나가도 되는가 ② 비용이 어느 지점에서 역전되는가 ③ 남의 인프라에 얼마나 의존해도 되는가.**

</details>

---

*출처: 모두의연구소 LLM 과정 강의 내용을 학습용으로 정리한 자료입니다.*
