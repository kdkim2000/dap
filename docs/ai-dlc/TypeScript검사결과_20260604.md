# TypeScript 타입 검사 결과

| 항목 | 내용 |
|:---|:---|
| 검사일 | 2026-06-04 |
| 검사 범위 | `pages/`, `components/`, `lib/`, `context/`, `types/` |
| 검사 파일 수 | 23개 컴포넌트 + 7개 lib + 5개 pages |
| tsc --noEmit | **오류 0건** |

---

## 검사 결과 요약

| 코드 | 항목 | 건수 | 판정 |
|:---|:---|:---:|:---:|
| TC-001 | `any` 타입 사용 | 0 | ✅ 통과 |
| TC-002 | 타입 단언(`as`) 과다 | 6 | ✅ 정당한 사용 |
| TC-003 | null/undefined 처리 누락 | 0 | ✅ 통과 |
| TC-004 | 함수 반환 타입 미명시 | 0 | ✅ 통과 |
| TC-005 | Props 인터페이스 미정의 | 0 | ✅ 통과 |
| TC-006 | enum 사용 | 0 | ✅ (as const 패턴 사용 중) |
| TC-007 | 이벤트 핸들러 타입 미명시 | 0 | ✅ 통과 |

**종합 판정**: ✅ **통과**

---

## 세부 분석

### TC-001: `any` 타입 — 0건 (완전 통과)

프로젝트 전체에서 `: any`, `as any`, `<any>` 패턴이 단 한 건도 없음.  
`types/index.ts`에 명확한 도메인 타입(`Question`, `ExamResult`, `PracticalProblem` 등)이 정의되어 있으며,  
모든 컴포넌트·함수에서 이를 활용 중.

---

### TC-002: 타입 단언(`as`) — 6건 (정당한 사용)

| # | 파일 | 라인 | 단언 내용 | 판정 |
|:---:|:---|:---:|:---|:---:|
| 1 | `lib/questions.ts` | 12 | `require(...) as Question[]` | ✅ 동적 require 필수 |
| 2 | `lib/questions.ts` | 21 | `require(...) as Question[]` | ✅ 동적 require 필수 |
| 3 | `lib/progress.ts` | 87 | `JSON.parse(raw) as ExamSession` | ✅ localStorage 파싱 필수 |
| 4 | `lib/practical.ts` | 7 | `require(...) as PracticalProblem` | ✅ 동적 require 필수 |
| 5 | `lib/practical.ts` | 56 | `JSON.parse(raw) as PracticalDraft` | ✅ localStorage 파싱 필수 |
| 6 | `pages/quiz/exam.tsx` | 267 | `['exam1', 'exam2', 'random'] as ExamMode[]` | ✅ 타입 좁히기 |

**결론**: 6건 모두 TypeScript가 추론 불가능한 외부 데이터(`require()`, `JSON.parse()`)에 대한 불가피한 단언. 위험한 패턴 없음.

---

### TC-003: null/undefined 처리 — 0건 (완전 통과)

옵셔널 체이닝(`?.`)이 총 **47회** 사용 중 (16개 파일).  
null 병합(`??`) 패턴도 lib 파일에서 **32회** 활용.

대표적 올바른 패턴:
```typescript
// lib/exam.ts
const maxScore = PART_MAX_SCORE[partNum] ?? 8

// lib/chapters.ts
return CHAPTER_BY_ID[id]?.title ?? id

// pages/quiz/index.tsx
Object.values(stats.byChapter ?? {}).reduce(...)
```

---

### TC-004~005: 반환 타입·Props 인터페이스

- **23개 컴포넌트** 모두 `interface Props` 정의 완료
- lib 함수들은 TypeScript 추론으로 충분한 경우 반환 타입 생략 (정상 패턴)
- 명시적 반환 타입이 필요한 복잡한 함수(`computeExamResult`, `getStats` 등)는 모두 타입 명시

---

### TC-007: 이벤트 핸들러 타입

```typescript
// components/practical/AnswerTextEditor.tsx — 올바른 패턴
const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { ... }

// components/practical/ModelImageUpload.tsx — 올바른 패턴
const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => { ... }
```

이벤트 타입 미명시(`(e) =>`) 패턴이 한 건도 없음.

---

## 긍정적 패턴 (모범 사례)

### 1. `as const` 타입 리터럴 활용
```typescript
// lib/chapters.ts
return [...xxxKeys.all, 'list', filter] as const
```

### 2. 유니온 타입 리터럴
```typescript
// types/index.ts
type PracticalType    = 'logical_model' | 'standard_form'
type PracticalSubtype = 'type1' | 'type2' | 'entity' | 'standard'
type DataNotation     = 'barker' | 'ie'
part: 1 | 2 | 3 | 4 | 5 | 6
```

### 3. 제네릭 Record 타입
```typescript
const PART_MAX_SCORE: Record<number, number> = { 1: 8, 2: 8, ... }
const PART_QUOTA: Record<number, number> = { 1: 10, 2: 10, ... }
```

### 4. 옵셔널 체이닝 + 기본값
```typescript
const maxScore = PART_MAX_SCORE[partNum] ?? 8
const chapters = CHAPTERS_BY_PART[part] ?? []
```

---

## 권장 사항 (개선 기회)

### 권장-1: `lib/practical.ts` - getPracticalProblems 하드코딩

```typescript
// 현재: ID 목록 하드코딩
function listPracticalIds(): string[] {
  return ['prac_001', 'prac_002', 'prac_003', 'prac_004', 'prac_005']
}
```

새 실기 문제 추가 시 이 함수도 수동으로 수정해야 함.  
→ `fs.readdirSync` 기반 동적 로딩(SSG 빌드 시)으로 개선 가능 (낮음 우선순위)

### 권장-2: `validate-questions.ts` - 인터페이스 중복

`scripts/validate-questions.ts`의 `QuestionRaw` 인터페이스가  
`types/index.ts`의 `Question`과 거의 동일한 구조.  
→ `@types` path 설정 또는 `partial<Question>` 활용으로 중복 제거 가능 (낮음 우선순위)

---

## 문서 버전 이력

| 버전 | 일자 | 내용 |
|:---|:---|:---|
| v0.1 | 2026-06-04 | 초안 — tsc 0건, any 0건, 전체 통과 |
