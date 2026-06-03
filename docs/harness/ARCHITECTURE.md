# ARCHITECTURE — DAP Master

---

## 시스템 개요

```mermaid
graph TD
    subgraph Browser["Browser (Client)"]
        Pages["React Pages\nNext.js SSG"]
        Context["React Context\nProgressCtx"]
        LS["localStorage\ndap_progress\ndap_exam_session\nq-theme\ndap_practical_*"]
        Static["Static Files\ndata/theory/*.md  ×21\ndata/questions/*.json  ×21+2\ndata/practical/*.json  ×5+"]
    end

    Pages <-->|useProgress| Context
    Context <-->|읽기·쓰기| LS
    Pages -->|getStaticProps / require| Static

    Build["npm run build\nSSG 정적 생성"] -->|산출물| Hosting["Static Hosting\nVercel / CDN"]
    Browser -.->|빌드 입력| Build
```

**핵심 제약**: 서버 없음, DB 없음, 외부 API 없음. 모든 동작은 클라이언트 사이드.

---

## 점진적 업그레이드 전략

```mermaid
graph TD
    Legacy["기존 DAsP 코드\n4과목 · 14챕터"]

    Legacy --> P1

    P1["**Phase 1**\n타입·lib 확장\npart 1~6 기반 확립"]

    P1 --> P2
    P1 --> P3
    P1 --> P4

    P2["**Phase 2**\n신규 데이터 파일\n5·6과목 MD + JSON\n실기 JSON"]

    P3["**Phase 3**\n기존 UI 수정\ntheory·exam·result\n6과목 대응"]

    P4["**Phase 4**\n실기 섹션 신규\npages/practical/*\ncomponents/practical/*"]

    P2 --> P5
    P3 --> P5
    P4 --> P5

    P5["**Phase 5**\n통합 검증\ntype-check · test · build"]

    style P1 fill:#6366f1,color:#fff
    style P2 fill:#818cf8,color:#fff
    style P3 fill:#818cf8,color:#fff
    style P4 fill:#818cf8,color:#fff
    style P5 fill:#4f46e5,color:#fff
```

> Phase 2·3은 Phase 1 완료 후 **병렬 진행** 가능. Phase 4는 Phase 2(실기 JSON) 완료 후 시작 권장.

---

## 정적 데이터 흐름

```mermaid
graph LR
    subgraph Theory["이론"]
        TH["data/theory/\npart{1-6}_ch{1-4}.md"]
        GSP["getStaticProps\nchapterId"]
        TP["TheoryPage"]
        TH --> GSP --> TP
    end

    subgraph Quiz["필기 문제"]
        QJ["data/questions/\npart{1-6}_ch{1-4}.json"]
        REQ["require()\ndynamic import"]
        QP["QuizPage"]
        QJ --> REQ --> QP
    end

    subgraph Exam["모의고사"]
        MJ["data/questions/mockexam/\nexam{1,2}.json\n75문항"]
        GMQ["getMockExamQuestions(n)"]
        EP["ExamPage"]
        MJ --> GMQ --> EP
    end

    subgraph Practical["실기"]
        PJ["data/practical/\nprac_{001-NNN}.json"]
        GPP["getPracticalProblems()"]
        PP["PracticalPage"]
        PJ --> GPP --> PP
    end
```

---

## localStorage 마이그레이션 흐름

```mermaid
flowchart TD
    Start(["loadProgress() 진입"])
    Check{"dasp_progress\n존재?"}
    Check2{"dap_progress\n이미 존재?"}
    Migrate["dasp_progress 값을\ndap_progress에 복사\n※ dasp_progress는 유지(롤백 보험)"]
    Load["dap_progress 로드\n(없으면 기본값 반환)"]
    Return(["ProgressStore 반환"])

    Start --> Check
    Check -->|Yes| Check2
    Check -->|No| Load
    Check2 -->|No| Migrate --> Load
    Check2 -->|Yes| Load
    Load --> Return
```

---

## 필기 모의고사 흐름

```mermaid
flowchart TD
    Start(["시험 시작"]) --> Mode{모드 선택}

    Mode -->|랜덤| Sample["sampleExamQuestions()\n과목별 무작위 추출\n1·2·3·5·6과목 각 10문항\n4과목 25문항"]
    Mode -->|exam1| E1["exam1.json 로드\n75문항 고정"]
    Mode -->|exam2| E2["exam2.json 로드\n75문항 고정"]

    Sample --> Session
    E1 --> Session
    E2 --> Session

    Session["ExamSession 생성\nexamEndTime = now + 14 400 000ms"]
    Session --> LS["localStorage\ndap_exam_session 저장"]
    Session --> Timer["ExamTimer\n14 400초 카운트다운"]

    Timer --> TimeCheck{"남은 시간 ≤ 0?"}
    TimeCheck -->|Yes| AutoSubmit["자동 제출"]
    TimeCheck -->|No| Answer["문항 응답·이동"]
    Answer --> ManualSubmit{"수동 제출?"}
    ManualSubmit -->|Yes| Calc
    ManualSubmit -->|No| Timer

    AutoSubmit --> Calc["점수 계산\n정답 수 × 0.8점"]

    Calc --> PassCheck{"전체 ≥ 36점\nAND 전 과목 ≥ 40%?"}
    PassCheck -->|합격| PassPage["합격 결과 화면"]
    PassCheck -->|불합격| FailPage["불합격 결과 화면\n실기 40점 안내 포함"]
```

### 점수 계산 상수

```typescript
const PART_QUOTA: Record<number, number> = {
  1: 10, 2: 10, 3: 10, 4: 25, 5: 10, 6: 10   // 합계 75
}
const PART_MAX_SCORE: Record<number, number> = {
  1: 8, 2: 8, 3: 8, 4: 20, 5: 8, 6: 8        // 합계 60
}
const POINTS_PER_Q = 0.8
// 전체 합격선: 36점 이상 (60점 만점의 60%)
// 과목별 합격선: 해당 과목 배점 × 40%
```

---

## 실기 연습 — 이미지 업로드 흐름

```mermaid
sequenceDiagram
    actor User as 사용자
    participant Input as &lt;input type="file"&gt;
    participant FR as FileReader API
    participant Canvas as Canvas API
    participant Preview as 미리보기 &lt;img&gt;
    participant LS as localStorage

    User->>Input: 이미지 파일 선택
    Input->>FR: readAsDataURL(file)
    FR-->>Canvas: dataUrl 전달
    Canvas->>Canvas: 긴 변 > 1920px이면 리사이즈
    Canvas-->>Preview: 리사이즈된 dataUrl → 미리보기 표시
    Canvas->>LS: dap_practical_{id}.imageDataUrl 저장
    LS-->>User: 저장 완료 (자동)

    Note over Canvas,LS: 서버 업로드 없음. base64로 브라우저에만 저장.
    Note over LS: 2MB 초과 시 Canvas 품질 낮춰 재압축
```

### 실기 페이지 레이아웃

```mermaid
graph TD
    subgraph Page["pages/practical/[practiceId].tsx"]
        TopBar["TopBar"]

        subgraph Layout["PracticalLayout — 좌우 분할"]
            subgraph Left["지문 패널 (40%)"]
                Scenario["scenario\n지문 텍스트 (스크롤)"]
                Reqs["requirements\n요구사항 목록"]
            end

            subgraph Right["답안 패널 (60%)"]
                Tab1["탭 1: 텍스트 서술\nAnswerTextEditor\n(textarea)"]
                Tab2["탭 2: 모델 이미지\nModelImageUpload\n(file input + preview)"]
                SG["채점 포인트 확인 (토글)\nScoringGuide\n체크리스트 + 모범답안"]
            end
        end
    end
```

---

## 컴포넌트 의존 관계 (신규 — 실기 섹션)

```mermaid
graph TD
    PI["pages/practical/index.tsx\n실기 허브"] --> PC["PracticalCard\n문제 카드·유형 뱃지"]

    PD["pages/practical/[practiceId].tsx\n실기 상세"] --> PL["PracticalLayout\n좌우 분할 래퍼"]
    PD --> LIB["lib/practical.ts\ngetPracticalProblems\ngetPracticalById"]

    PL --> SP["ScenarioPanel\n지문 + 요구사항"]
    PL --> AP["AnswerPanel\n탭 컨테이너"]

    AP --> ATE["AnswerTextEditor\ntextarea 서술"]
    AP --> MIU["ModelImageUpload\nfile input + Canvas 리사이즈\n+ 미리보기"]
    AP --> SG["ScoringGuide\n채점 포인트 체크리스트\n모범답안 (토글)"]
```

---

## SSG 경로 생성

```mermaid
flowchart LR
    subgraph Sources["경로 소스"]
        CIDS["CHAPTERS 배열\n21개 chapterId"]
        PRACS["getPracticalProblems()\nN개 practiceId"]
    end

    subgraph Paths["getStaticPaths 생성"]
        TP["theory/[chapterId]\n×21"]
        QP["quiz/chapter/[chapterId]\n×21"]
        PP["practical/[practiceId]\n×N"]
    end

    CIDS --> TP
    CIDS --> QP
    PRACS --> PP

    TP --> Build
    QP --> Build
    PP --> Build

    Build["next build\nSSG 빌드\nfallback: false"] --> Out["정적 파일\nVercel 배포"]
```

> `CHAPTERS` 배열이 단일 소스(Single Source of Truth). `getStaticPaths`에 경로를 하드코딩하지 않는다.

---

## 다크모드

```css
/* globals.css */
:root                { --q-bg: #fff;     --q-text: #111; }
[data-theme="dark"]  { --q-bg: #1a1a2e; --q-text: #e0e0e0; }
```

`localStorage('q-theme')` 로 persist. `_document.tsx`에서 초기 theme 주입 (FOUC 방지).
