# 데이터 설계서

| 항목 | 내용 |
|:---|:---|
| 사업명 | DAP Master — 데이터아키텍처 전문가 자격증 시험 준비 웹사이트 |
| 작성일 | 2026-06-03 |
| 버전 | v0.1 |
| 특이사항 | 서버·DB 없음. 정적 JSON 파일 + 브라우저 localStorage만 사용. |

---

## 1. 데이터 도메인 구조

```mermaid
graph LR
    subgraph Static["정적 파일 (빌드 포함)"]
        TH["data/theory/*.md\n21개 이론 파일"]
        QJ["data/questions/*.json\n21개 문제 파일"]
        MJ["data/questions/mockexam/\nexam{1,2}.json (75문항)"]
        PJ["data/practical/\nprac_NNN.json (5개+)"]
    end

    subgraph LS["localStorage (브라우저)"]
        DP["dap_progress\nProgressStore"]
        DS["dap_exam_session\nExamSession"]
        DD["dap_practical_{id}\nPracticalDraft"]
        QT["q-theme\n다크모드"]
    end

    TH -->|getStaticProps| Pages
    QJ -->|require()| Pages
    MJ -->|getMockExamQuestions| Pages
    PJ -->|getPracticalProblems| Pages
    Pages <-->|localStorage API| LS
```

---

## 2. 정적 파일 스키마

### 2-1. 이론 MD 파일 (`data/theory/`)

**명명 규칙**: `part{N}_ch{M}.md`  
**헤딩 구조** (RULES.md 준수):

```markdown
# {N}과목 {M}장: {챕터 제목}

## 1. {주요항목}          ← TheoryTOC가 추출하는 레벨
### {세부항목}
### {세부항목}

## 2. {주요항목}
...

## 출제 포인트            ← 마지막 섹션 필수
```

**파일 목록 (21개)**:

| 파일 | 과목 | 챕터 | 상태 |
|:---|:---:|:---:|:---:|
| `part1_ch1.md` ~ `part4_ch4.md` | 1~4과목 | 1~4장 | ✅ 기존 |
| `part5_ch1.md` | 5과목 | 데이터베이스 설계 | ✅ 신규 생성 |
| `part5_ch2.md` | 5과목 | 데이터베이스 이용 | ✅ 신규 생성 |
| `part5_ch3.md` | 5과목 | 데이터베이스 성능 개선 | ✅ 신규 생성 |
| `part6_ch1.md` | 6과목 | 데이터 이해 | ✅ 신규 생성 |
| `part6_ch2.md` | 6과목 | 데이터 구조 이해 | ✅ 신규 생성 |
| `part6_ch3.md` | 6과목 | 데이터 관리 프로세스 이해 | ✅ 신규 생성 |
| `part6_ch4.md` | 6과목 | 데이터 품질 관리 관점 | ✅ 신규 생성 |

---

### 2-2. 필기 문제 JSON (`data/questions/`)

**스키마**:

```typescript
interface Question {
  id: string            // p[1-6]c[1-4]_\d{3}  예: "p5c2_001"
  part: 1|2|3|4|5|6
  chapter: string       // "part5_ch2"
  content: string       // 문제 본문
  options: string[]     // 4개 고정
  answer: number        // 0-based index (0~3)
  explanation: string   // 최소 50자
  tags?: string[]
  difficulty?: "하"|"중"|"상"
  questionType?: "concept"|"result"|"completion"|"error"
}
```

**ID 채번 규칙**:
- `p{과목번호}c{챕터번호}_{3자리 순번}` — 001부터 순차
- 예: part5_ch1 → `p5c1_001`, `p5c1_002`, ...

**파일 목록 (21개)**:

| 파일 | 과목 | 문항 수 | 상태 |
|:---|:---:|:---:|:---:|
| `part1_ch1.json` ~ `part4_ch4.json` | 1~4과목 | 기존 | ✅ 기존 |
| `part5_ch1.json` | 5과목 | 15개 | ✅ 신규 생성 |
| `part5_ch2.json` | 5과목 | 15개 | ✅ 신규 생성 |
| `part5_ch3.json` | 5과목 | 15개 | ✅ 신규 생성 |
| `part6_ch1.json` | 6과목 | 15개 | ✅ 신규 생성 |
| `part6_ch2.json` | 6과목 | 15개 | ✅ 신규 생성 |
| `part6_ch3.json` | 6과목 | 15개 | ✅ 신규 생성 |
| `part6_ch4.json` | 6과목 | 15개 | ✅ 신규 생성 |

**난이도 권장 비율**: 하 20% / 중 55% / 상 25%

---

### 2-3. 모의고사 JSON (`data/questions/mockexam/`)

**배분 규칙** (PART_QUOTA):

| 과목 | 문항 수 | 배점 | ID 형식 |
|:---:|:---:|:---:|:---|
| 1과목 | 10 | 8점 | `exam1_001` ~ `exam1_010` |
| 2과목 | 10 | 8점 | `exam1_011` ~ `exam1_020` |
| 3과목 | 10 | 8점 | `exam1_021` ~ `exam1_030` |
| 4과목 | 25 | 20점 | `exam1_031` ~ `exam1_055` |
| 5과목 | 10 | 8점 | `exam1_056` ~ `exam1_065` |
| 6과목 | 10 | 8점 | `exam1_066` ~ `exam1_075` |
| **합계** | **75** | **60점** | |

**스키마**: 기존 Question 타입과 동일하되 id만 `exam{N}_{DDD}` 형식

---

### 2-4. 실기 문제 JSON (`data/practical/`)

**스키마**:

```typescript
interface PracticalProblem {
  id: string              // prac_\d{3}  예: "prac_001"
  type: "logical_model" | "standard_form"
  subtype: "type1" | "type2" | "entity" | "standard"
  title: string
  notation: "barker" | "ie"
  scenario: string        // 지문 (500자 이상, A4 2~3장 분량 권장)
  requirements: string[]  // 요구사항 체크리스트 (1개 이상)
  sampleAnswer: string    // 모범답안 설명
  checkPoints: string[]   // 채점 포인트 (최소 3개)
}
```

**유형별 파일**:

| ID | type | subtype | 설명 |
|:---|:---:|:---:|:---|
| `prac_001` | logical_model | type1 | 지문 분석 → 엔터티·관계·속성·서브타입 정의 |
| `prac_002` | logical_model | type2 | 현행 논리모델 제시 → 개선 목표 논리모델 작성 |
| `prac_003` | logical_model | type1 | 지문 분석 → 엔터티·관계 정의 (다른 도메인) |
| `prac_004` | standard_form | entity | 엔터티 정의서 작성 |
| `prac_005` | standard_form | standard | 데이터 표준(단어·용어·코드·도메인) 정의 |

---

## 3. localStorage 스키마

### 3-1. `dap_progress` (ProgressStore)

```typescript
{
  answers: Record<string, "correct"|"wrong"|"skipped">,
  bookmarks: string[],
  lastVisited: { type: "theory"|"quiz"|"practical", id: string } | null,
  examHistory: ExamResult[]
}
```

**마이그레이션**: `dasp_progress` → `dap_progress` (loadProgress() 진입 시 자동)

### 3-2. `dap_exam_session` (ExamSession)

```typescript
{
  mode: "random"|"exam1"|"exam2",
  questions: Question[],
  currentIndex: number,
  answers: Record<number, { selectedIndex: number, result: string }>,
  examEndTime: number  // Unix ms, 14400초(240분) 기준
}
```

### 3-3. `dap_practical_{practiceId}` (PracticalDraft)

```typescript
{
  textAnswer: string,
  imageDataUrl: string | null,  // base64, max 2MB
  savedAt: number
}
```

### 3-4. `q-theme`

값: `"light"` | `"dark"`

---

## 4. 검증 규칙 (validate-questions.ts)

### 현재 → 수정 후

```typescript
// ID 정규식
현재: /^(p[1-4]c[1-4]_\d{3}|exam[12]_\d{3})$/
수정: /^(p[1-6]c[1-4]_\d{3}|exam[12]_\d{3})$/  ← part 5·6 추가

// part 범위
현재: part >= 1 && part <= 5
수정: part >= 1 && part <= 6
```

### 실기 JSON 검증 (신규 추가 필요)

```typescript
// validate-practical.ts 신규 (또는 validate-questions.ts에 통합)
const PRACTICAL_ID_REGEX = /^prac_\d{3}$/
const VALID_TYPES = ['logical_model', 'standard_form']
const VALID_SUBTYPES = ['type1', 'type2', 'entity', 'standard']
const VALID_NOTATIONS = ['barker', 'ie']
// 검증: checkPoints.length >= 3, scenario.length >= 500
```

---

## 5. 문서 버전 이력

| 버전 | 일자 | 변경 내용 |
|:---|:---|:---|
| v0.1 | 2026-06-03 | 초안 생성 — 정적 JSON·localStorage 스키마 정의 |
