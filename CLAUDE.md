# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**DAP Master** — DAP(데이터아키텍처 전문가) 자격증 시험 준비용 웹 사이트.  
이론 학습 + 필기 예상문제 풀이 + 필기 모의고사 + 실기 연습.

## DAP 시험 구조

총 76문항, 100점 만점, 240분(4시간)

| 과목 | 제목 | 필기 문항 | 필기 배점 | 실기 문항 | 실기 배점 |
|------|------|:---------:|:--------:|:---------:|:--------:|
| 1과목 | 전사아키텍처 이해 | 10 | 8점 (문항당 0.8점) | 1 | 40점 |
| 2과목 | 데이터 요건 분석 | 10 | 8점 (문항당 0.8점) | — | — |
| 3과목 | 데이터 표준화 | 10 | 8점 (문항당 0.8점) | — | — |
| 4과목 | 데이터 모델링 | 25 | 20점 (문항당 0.8점) | — | — |
| 5과목 | 데이터베이스 설계와 이용 | 10 | 8점 (문항당 0.8점) | — | — |
| 6과목 | 데이터 품질 관리이해 | 10 | 8점 (문항당 0.8점) | — | — |
| **합계** | | **75** | **60점** | **1** | **40점** |

합격 기준: 전체 60점 이상 + 각 과목 40% 이상

> **실기 비중 주의**: 실기 1문항이 전체 배점의 40%를 차지. 필기 만점(60점)이어도 실기(40점) 미달 시 불합격 가능.

### 실기 (필기 시험지 내 포함, 주관식)

두 영역으로 구성:

1. **논리 데이터 모델 작성** — 두 가지 유형 중 하나 출제
   - 유형1: 지문 분석 → 엔터티·관계·속성·서브타입 정의
   - 유형2: 현행 논리모델 제시 → 개선 목표 논리모델 작성
2. **표준화 정의서 작성**
   - 영역1: 엔터티 정의 (데이터 집합 개요·성격·구성 특징 기술)
   - 영역2: 데이터 표준 정의 (단어·용어·코드·도메인 표준 정의)

실기 주의사항: 바커 또는 IE 표기법 중 하나만 일관 사용, 관계명 필수 표기, 최소 3차 정규화 적용.

## 기술 스택

- **Next.js 14** (Pages Router, TypeScript)
- **Tailwind CSS** — 인디고/블루 팔레트 (primary: #6366F1)
- **React Context + localStorage** — 진도 관리 (`dap_progress` 키)
- **react-markdown + rehype-highlight** — 이론 렌더링
- **Vitest + jsdom** — 단위 테스트

## 핵심 명령어

```bash
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # SSG 빌드
npm run lint         # ESLint
npm run type-check   # TypeScript 검사 (tsc --noEmit)
npm run test         # Vitest (1회)
npm run test:watch   # Vitest (watch)
```

단일 테스트 실행: `npx vitest run lib/chapters.test.ts`

## 챕터 레지스트리 (lib/chapters.ts) — 21개

`CHAPTERS` 배열이 유일한 소스. SSG `getStaticPaths`, 네비게이션, 문제 필터 모두 이 배열 참조.

| 챕터 ID | 과목 | 공식 주요항목 제목 |
|---------|------|-----------------|
| `part1_ch1` | 1과목 | 전사아키텍처 개요 |
| `part1_ch2` | 1과목 | 전사아키텍처 구축 |
| `part1_ch3` | 1과목 | 전사아키텍처 관리 및 활용 |
| `part2_ch1` | 2과목 | 정보 요구 사항 개요 |
| `part2_ch2` | 2과목 | 정보 요구 사항 조사 |
| `part2_ch3` | 2과목 | 정보 요구 사항 분석 |
| `part2_ch4` | 2과목 | 정보 요구 검증 |
| `part3_ch1` | 3과목 | 데이터 표준화 개요 |
| `part3_ch2` | 3과목 | 데이터 표준 수립 |
| `part3_ch3` | 3과목 | 데이터 표준 관리 |
| `part4_ch1` | 4과목 | 데이터 모델링 이해 |
| `part4_ch2` | 4과목 | 개념 데이터 모델링 |
| `part4_ch3` | 4과목 | 논리 데이터 모델링 |
| `part4_ch4` | 4과목 | 물리 데이터 모델링 |
| `part5_ch1` | 5과목 | 데이터베이스 설계 |
| `part5_ch2` | 5과목 | 데이터베이스 이용 |
| `part5_ch3` | 5과목 | 데이터베이스 성능 개선 |
| `part6_ch1` | 6과목 | 데이터 이해 |
| `part6_ch2` | 6과목 | 데이터 구조 이해 |
| `part6_ch3` | 6과목 | 데이터 관리 프로세스 이해 |
| `part6_ch4` | 6과목 | 데이터 품질 관리 관점 |

## 핵심 구조

```
pages/
  index.tsx                      → 대시보드 홈
  theory/index.tsx               → 이론 목차 (6과목 그리드)
  theory/[chapterId].tsx         → 이론 본문 (SSG, 21개 경로)
  quiz/index.tsx                 → 문제풀기 허브
  quiz/chapter/[chapterId].tsx   → 단원별 풀이 (SSG, 21개 경로)
  quiz/exam.tsx                  → 모의고사 (필기)
  quiz/result.tsx                → 결과 (6과목별 점수)
  quiz/wrong.tsx                 → 오답 노트
  quiz/bookmarks.tsx             → 북마크
  practical/index.tsx            → 실기 연습 허브 (신규)
  practical/[practiceId].tsx     → 실기 문제 풀이 (신규)
components/
  layout/Layout.tsx, TopBar.tsx
  ui/Mascot.tsx, Badge.tsx
  quiz/QuestionCard, AnswerFeedback, QuizNavigator, ExamTimer
  theory/TheoryContent, TheoryTOC, RelatedQuestions
  dashboard/HeroBanner, LearningPath, ChapterProgress, WeakChapters, WeeklyXP, ProgressChart
  practical/ModelCanvas, StandardForm  (신규 — 실기 답안 입력)
lib/
  chapters.ts   → CHAPTERS(21개), CHAPTER_IDS, PART_TITLES
  questions.ts  → getAllQuestions, sampleExamQuestions
  theory.ts     → getChapterContent
  progress.ts   → loadProgress/saveProgress (dap_progress)
  practical.ts  → getPracticalProblems (신규)
context/ProgressContext.tsx      → useProgress hook
types/index.ts                   → Question(part: 1|2|3|4|5|6), ProgressStore, ExamResult, Stats
data/
  theory/part{1-6}_ch{1-4}.md        → 21개 이론 파일
  questions/part{1-6}_ch{1-4}.json   → 21개 문제 파일
  questions/mockexam/exam1.json      → 모의고사 1회
  questions/mockexam/exam2.json      → 모의고사 2회
  practical/                         → 실기 문제 JSON (신규)
scripts/validate-questions.ts        → JSON 스키마 검증 (p[1-6]c[1-4]_\d{3})
docs/plans/                          → 개선 계획 문서
```

## 핵심 데이터 패턴

- 이론·문제 페이지: `getStaticPaths` + `getStaticProps`로 SSG
- `localStorage` 접근 전 반드시 `typeof window !== 'undefined'` 가드
- **두 가지 ID 형식**:
  - 파일명/라우팅: `part5_ch2` (언더스코어)
  - 문제 JSON id: `p5c2_001` (`p{과목}c{챕터}_{3자리}`)
  - 모의고사 id: `exam1_001`, `exam2_001`
- `part: 1 | 2 | 3 | 4 | 5 | 6` (6과목)
- `chapter: number` (과목별 1~4)
- localStorage 키: `dap_progress` (DAsP의 `dasp_progress`에서 변경)
- 모의고사(필기): 75문항 (1·2·3·5·6과목 각 10문항, 4과목 25문항), ExamTimer 14400초(240분), 문항당 0.8점
- 모의고사 결과: 과목별 배점 점수 표시 + 실기 40점 별도 안내
- 다크모드: CSS 변수(`--q-bg` 등) + `[data-theme="dark"]`, `localStorage('q-theme')`

## ⚠️ AI-DLC 산출물 저장 필수 규칙 — 반드시 준수

> **이 규칙은 선택이 아니다. ai-dlc* 스킬로 생성되는 모든 문서는 반드시 `docs/ai-dlc/` 에 저장한다.**

### 저장 위치

```
docs/ai-dlc/{문서유형}_{사업명}_{YYYYMMDD}.md
```

### 대상 스킬 및 파일명 패턴

| 스킬 | 생성 문서 | 파일명 예시 |
|:---|:---|:---|
| `ai-dlc-requirements` | 요구사항 정의서 | `요구사항정의서_DAP_Master_20260603.md` |
| `ai-dlc-screen-list` | 화면 목록 | `화면목록_DAP_Master_20260603.md` |
| `ai-dlc-usecase-create` | 유즈케이스 | `유즈케이스_DAP_Master_20260603.md` |
| `ai-dlc-biz-rules-create` | 비즈니스 규칙 | `비즈니스규칙_DAP_Master_20260603.md` |
| `ai-dlc-class-design` | 클래스 설계서 | `클래스설계서_DAP_Master_20260603.md` |
| `ai-dlc-sequence-design` | 시퀀스 설계서 | `시퀀스설계서_DAP_Master_20260603.md` |
| `ai-dlc-api-design` | API 설계서 | `API설계서_DAP_Master_20260603.md` |
| `ai-dlc-data-design` | 데이터 설계서 | `데이터설계서_DAP_Master_20260603.md` |
| `ai-dlc-screen-spec` | 화면 명세서 | `화면명세서_DAP_Master_20260603.md` |
| `ai-dlc-nxt-impl-plan` | 구현 계획서 | `구현계획서_DAP_Master_20260603.md` |
| `ai-dlc-*` (기타 모든 스킬) | 스킬명 기반 | `{산출물유형}_{사업명}_{YYYYMMDD}.md` |

### 강제 규칙

1. **ai-dlc* 스킬 호출 전 반드시 확인**: 저장 경로를 `docs/ai-dlc/`로 명시하거나, 스킬 완료 후 즉시 이동한다.
2. **프로젝트 루트 저장 금지**: 루트에 생성된 ai-dlc 산출물은 발견 즉시 `docs/ai-dlc/`로 이동한다.
3. **`docs/ai-dlc/README.md` 갱신**: 새 산출물 추가 시 README의 문서 목록에 한 줄 추가한다.
4. **파일명 덮어쓰기 규칙**: 같은 날짜·같은 유형 문서는 버전 suffix(`_v2`, `_v3`) 추가.

### 현재 산출물 목록 확인

```powershell
Get-ChildItem docs\ai-dlc -Filter "*.md" | Sort-Object Name | Select-Object Name
```

---

## ⚠️ 플랜 모드 필수 규칙 — 반드시 준수

> **이 규칙은 선택이 아니다. Plan 모드 진입 시 아래 절차를 항상 실행한다.**

### Plan 파일 저장 위치

```
docs/plans/{NNN}_{slug}.md
```

- `NNN`: 3자리 0패딩 순번 (기존 마지막 파일 +1)
- `slug`: 소문자 영문 + 언더스코어, 내용을 함축하는 단어 (예: `type_upgrade`, `practical_section`)
- **파일 없이 plan을 실행하는 것은 금지.**

### Plan 파일 필수 구조

```markdown
# {제목}

> 상태: DRAFT | IN_PROGRESS | DONE | CANCELLED  
> 작성: YYYY-MM-DD | 완료: YYYY-MM-DD (완료 시 기재)

## 목표
한 문장으로 이 플랜이 달성하려는 것.

## 배경 & 인사이트
- 왜 이 작업이 필요한가 (요구사항 ID 참조 가능, 예: FR-010)
- 관련 의사결정 및 선택 이유
- 주의해야 할 제약사항

## 실행 단계
- [ ] 1. 구체적 작업 (대상 파일, 변경 내용)
- [ ] 2. ...
- [ ] N. 검증 명령어 (`npm run type-check` 등)

## 완료 기준
- 충족해야 할 조건 목록 (체크 가능하게)

## 메모 (작업 중 발견한 인사이트)
- 작업 중 발견한 예상치 못한 사항
- 다음 플랜에 반영할 사항
```

### Plan 모드 진입 → 종료 절차

```
1. [진입 시]  docs/plans/ 에서 마지막 NNN 확인
2. [진입 시]  새 파일 docs/plans/{NNN+1}_{slug}.md 생성 (상태: DRAFT)
3. [계획 수립] 목표·배경·단계를 파일에 기록
4. [실행 승인] 사용자 승인 후 상태를 IN_PROGRESS로 변경
5. [실행 중]  완료된 단계는 - [x] 로 체크, 인사이트는 메모 섹션에 즉시 기록
6. [완료 시]  상태를 DONE으로 변경, 완료일 기재
7. [취소 시]  상태를 CANCELLED로 변경, 취소 이유 메모에 기록
```

### 현재 플랜 목록 확인 명령어

```powershell
Get-ChildItem docs\plans -Filter "*.md" | Sort-Object Name | Select-Object Name
```

## DAP 업그레이드 시 반드시 변경할 파일

| 파일 | 변경 내용 |
|------|---------|
| `lib/chapters.ts` | CHAPTERS 21개로 확장, PART_TITLES 6개로 확장 |
| `types/index.ts` | `part: 1\|2\|3\|4\|5\|6`, ExamResult에 part5/6Score 추가 |
| `progress.ts` | localStorage 키 `dasp_progress` → `dap_progress` |
| `lib/questions.ts` | `sampleExamQuestions` 6과목 배분 로직 수정 |
| `scripts/validate-questions.ts` | ID 정규식 `p[1-6]c[1-4]_\d{3}` 으로 수정 |
| `quiz/result.tsx` | 6과목별 점수 표시 |
| `theory/index.tsx` | 6과목 그리드로 확장 |
| `context/ProgressContext.tsx` | byPart 통계 6과목 지원 |

## 실기 연습 기능 (신규 추가)

실기 문제는 `data/practical/` 디렉터리에 JSON으로 저장:

```json
{
  "id": "prac_001",
  "type": "logical_model",       // "logical_model" | "standard_form"
  "subtype": "type1",            // type1 | type2 (논리모델) / "entity" | "standard" (표준화)
  "title": "...",
  "scenario": "지문 내용 (A4 2~3장 분량)",
  "requirements": ["요구사항1", "요구사항2"],
  "notation": "barker",          // "barker" | "ie"
  "sampleAnswer": "모범답안 설명",
  "checkPoints": ["채점 포인트1", "채점 포인트2"]
}
```
