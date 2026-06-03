# RULES — DAP Master 개발 규칙

---

## TypeScript 타입 규칙

### 필수 타입 (types/index.ts)

```typescript
// part는 반드시 6과목 리터럴 유니온
part: 1 | 2 | 3 | 4 | 5 | 6

// ExamResult는 6과목 점수 필드 모두 포함
interface ExamResult {
  part1Score: number; part2Score: number; part3Score: number
  part4Score: number; part5Score: number; part6Score: number
  // ... 기타 필드
}

// 실기 문제 타입
type PracticalType = 'logical_model' | 'standard_form'
type PracticalSubtype = 'type1' | 'type2' | 'entity' | 'standard'
type DataNotation = 'barker' | 'ie'
```

### 타입 변경 순서

1. `types/index.ts` 먼저 수정
2. TypeScript 오류를 따라 연쇄 수정
3. `npm run type-check` 통과 후 다음 파일 진행

---

## ID 형식 규칙

| 종류 | 정규식 | 예 |
|:---|:---|:---|
| 챕터 ID | `part[1-6]_ch[1-4]` | `part5_ch2` |
| 필기 문제 ID | `p[1-6]c[1-4]_\d{3}` | `p5c2_001` |
| 모의고사 문제 ID | `exam[12]_\d{3}` | `exam1_042` |
| 실기 문제 ID | `prac_\d{3}` | `prac_003` |

- 새 챕터(5·6과목) 문제 ID는 001부터 순차 채번
- `validate-questions.ts` 검증 통과 필수

---

## localStorage 규칙

1. **typeof window 가드 필수**: 모든 localStorage 접근 전 반드시 체크
   ```typescript
   if (typeof window === 'undefined') return defaultValue
   ```

2. **키 목록** (모든 키는 이 목록에서만 사용):
   - `dap_progress` — 학습 진도 (구: `dasp_progress`)
   - `dap_exam_session` — 모의고사 세션 (구: `dasp_exam_session`)
   - `q-theme` — 다크모드 테마
   - `dap_practical_{practiceId}` — 실기 답안 임시 저장

3. **마이그레이션 코드**: `progress.ts`의 `loadProgress()` 최상단에 위치

---

## 데이터 파일 규칙

### 이론 MD 파일 (`data/theory/part{N}_ch{M}.md`)

```markdown
# {N}과목 {M}장: {챕터 제목}

## 1. {주요항목1}

### {세부항목1}

...
```

- 헤딩 레벨: `#` 챕터 제목, `##` 주요항목, `###` 세부항목
- 표(GFM table), 인용(`>`), 코드 블록 자유 사용
- TheoryTOC는 `##` 헤딩만 추출

### 문제 JSON 파일 (`data/questions/part{N}_ch{M}.json`)

```json
[
  {
    "id": "p{N}c{M}_{DDD}",
    "part": N,
    "chapter": "part{N}_ch{M}",
    "content": "문제 내용",
    "options": ["①", "②", "③", "④"],
    "answer": 0,
    "explanation": "해설",
    "tags": ["태그"],
    "difficulty": "하|중|상",
    "questionType": "concept|result|completion|error"
  }
]
```

- `options` 배열: 4개 고정
- `answer`: 0-based index
- `difficulty`: `하`20%, `중`55%, `상`25% 권장 비율

### 실기 문제 JSON (`data/practical/prac_{DDD}.json`)

```json
{
  "id": "prac_{DDD}",
  "type": "logical_model|standard_form",
  "subtype": "type1|type2|entity|standard",
  "title": "문제 제목",
  "notation": "barker|ie",
  "scenario": "지문 내용 (A4 2~3장 분량)",
  "requirements": ["요구사항1", "요구사항2"],
  "sampleAnswer": "모범답안 설명",
  "checkPoints": ["채점 포인트1", "채점 포인트2"]
}
```

---

## SSG 제약 규칙

1. **`getStaticPaths`는 `CHAPTERS` 배열을 단일 소스로 사용** — 배열을 하드코딩하지 않는다
2. **동적 `require()`는 `getStaticProps` 또는 lib 함수 내에서만** — 컴포넌트 렌더 중 사용 금지
3. **`fallback: false`** — 존재하지 않는 경로는 404

---

## 합격 판정 규칙

```typescript
const PART_MAX_SCORE: Record<number, number> = {
  1: 8, 2: 8, 3: 8, 4: 20, 5: 8, 6: 8  // 합계 60
}
const POINTS_PER_QUESTION = 0.8

function calcPartScore(correct: number): number {
  return Math.round(correct * POINTS_PER_QUESTION * 10) / 10
}

function isPartPassed(part: number, score: number): boolean {
  return score >= PART_MAX_SCORE[part] * 0.4
}

function isExamPassed(scores: Record<number, number>): boolean {
  const total = Object.values(scores).reduce((a, b) => a + b, 0)
  return total >= 36 && [1,2,3,4,5,6].every(p => isPartPassed(p, scores[p]))
}
```

---

## 컴포넌트 규칙

- **새 컴포넌트**: `components/` 하위 도메인 폴더에 위치 (예: `components/practical/`)
- **props 타입**: 인라인 `interface Props` 또는 `types/index.ts` export — 둘 다 허용, 외부 공유 시 후자
- **다크모드**: CSS 변수(`var(--q-bg)`) 사용. Tailwind `dark:` 클래스와 병행 가능
- **한국어 텍스트**: 하드코딩 허용 (i18n 불필요)

---

## 실기 이미지 업로드 규칙

- `accept="image/*"` — JPEG, PNG, WebP 모두 허용
- 업로드 전 Canvas로 리사이즈: 긴 변 최대 1920px
- `localStorage` 저장 전 base64 문자열 크기 확인 (> 2MB면 압축 재시도)
- 세션 클리어 시 `dap_practical_*` 키도 함께 삭제
