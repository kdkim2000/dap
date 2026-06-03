# 코드-요구사항 추적성 매트릭스

| 항목 | 내용 |
|:---|:---|
| 시스템명 | DAP Master |
| 작성일 | 2026-06-04 |
| FR 총 수 | 24개 (FR-001 ~ FR-024) |
| 매핑 완료 | 24개 (100%) |
| 미매핑 | 0개 |
| 커버리지 | **100%** |

---

## 1. FR → 코드 매핑 매트릭스

### 이론 학습 영역 (FR-001~004)

| FR-ID | 요구사항명 | 구현 파일 | 구현 함수·컴포넌트 | 신뢰도 |
|:---|:---|:---|:---|:---:|
| FR-001 | 이론 목차 | `pages/theory/index.tsx` | `TheoryIndexPage` | High |
| | | `lib/chapters.ts` | `CHAPTERS_BY_PART`, `PART_TITLES` | High |
| FR-002 | 이론 본문 렌더링 | `pages/theory/[chapterId].tsx` | `TheoryChapterPage`, `getStaticProps`, `getStaticPaths` | High |
| | | `components/theory/TheoryContent.tsx` | `ReactMarkdown` + rehype-highlight | High |
| | | `lib/theory.ts` | `getChapterContent()` | High |
| | | `data/theory/*.md` | 21개 마크다운 파일 | High |
| FR-003 | 이론 TOC 사이드바 | `components/theory/TheoryTOC.tsx` | `parseHeadings()`, IntersectionObserver | High |
| FR-004 | 연관 문제 링크 | `components/theory/RelatedQuestions.tsx` | 챕터 연관 문제 카드 | High |
| | | `lib/questions.ts` | `getQuestionsByChapter()` | High |

### 필기 문제 풀이 영역 (FR-005~009)

| FR-ID | 요구사항명 | 구현 파일 | 구현 함수·컴포넌트 | 신뢰도 |
|:---|:---|:---|:---|:---:|
| FR-005 | 문제 풀기 허브 | `pages/quiz/index.tsx` | `QuizIndexPage` | High |
| FR-006 | 단원별 문제 풀이 | `pages/quiz/chapter/[chapterId].tsx` | `ChapterQuizPage` | High |
| | | `components/quiz/QuestionCard.tsx` | 4지선다 렌더링 | High |
| | | `lib/questions.ts` | `getQuestionsByChapter()` | High |
| FR-007 | 정답·해설 피드백 | `components/quiz/AnswerFeedback.tsx` | 정답/오답/해설 표시 | High |
| | | `pages/quiz/chapter/[chapterId].tsx` | `handleAnswer()`, `showFeedback` state | High |
| FR-008 | 문제 네비게이터 | `components/quiz/QuizNavigator.tsx` | 번호 그리드·이전/다음 | High |
| FR-009 | 난이도·태그 표시 | `components/quiz/QuestionCard.tsx` | difficulty 뱃지, tags 칩 | High |
| | | `data/questions/*.json` | `difficulty`, `tags` 필드 | High |

### 필기 모의고사 영역 (FR-010~015)

| FR-ID | 요구사항명 | 구현 파일 | 구현 함수·컴포넌트 | 신뢰도 |
|:---|:---|:---|:---|:---:|
| FR-010 | 필기 모의고사 실행 | `pages/quiz/exam.tsx` | `ExamPage` (intro→exam→result phase) | High |
| | | `components/quiz/ExamTimer.tsx` | 14400초 카운트다운 | High |
| | | `lib/exam.ts` | `EXAM_SECONDS=14400`, `PART_QUOTA` | High |
| FR-011 | 모의고사 결과 표시 | `pages/quiz/exam.tsx` | result phase (VI-001 수정 후 6과목) | High |
| | | `components/quiz/PartScoresDisplay.tsx` | 6과목 점수 바 | High |
| | | `lib/exam.ts` | `isExamPassed()`, `calcPartScore()` | High |
| FR-012 | 실기 40점 안내 | `components/quiz/PracticalExamNotice.tsx` | compact/extended variant | High |
| | | `pages/quiz/exam.tsx` · `pages/quiz/result.tsx` | 두 페이지에 삽입 | High |
| FR-013 | 시험 세션 저장·복원 | `lib/progress.ts` | `saveExamSession()`, `loadExamSession()`, `clearExamSession()` | High |
| | | `pages/quiz/exam.tsx` | `resumeExam()`, auto-save useEffect | High |
| FR-014 | 랜덤 모의고사 | `lib/questions.ts` | `sampleExamQuestions()` — PART_QUOTA 기반 | High |
| FR-015 | 고정 모의고사 | `lib/questions.ts` | `getMockExamQuestions()` | High |
| | | `data/questions/mockexam/exam{1,2}.json` | 75문항 고정 세트 | High |

### 실기 연습 영역 (FR-016~021)

| FR-ID | 요구사항명 | 구현 파일 | 구현 함수·컴포넌트 | 신뢰도 |
|:---|:---|:---|:---|:---:|
| FR-016 | 실기 연습 허브 | `pages/practical/index.tsx` | `PracticalIndexPage` | High |
| | | `lib/practical.ts` | `getPracticalProblems()` | High |
| FR-017 | 논리 데이터 모델 연습 (유형1) | `pages/practical/index.tsx` | `logicalProblems.filter(type1)` | High |
| | | `pages/practical/[practiceId].tsx` | `PracticalProblemPage` | High |
| | | `data/practical/prac_001.json`, `prac_003.json` | type1 유형 문제 | High |
| FR-018 | 논리 데이터 모델 연습 (유형2) | `data/practical/prac_002.json` | type2 유형 문제 | High |
| FR-019 | 표준화 정의서 연습 | `data/practical/prac_004.json`, `prac_005.json` | standard_form 유형 | High |
| FR-020 | 실기 채점 포인트 확인 | `components/practical/ScoringGuide.tsx` | `checkPoints` 체크리스트, `sampleAnswer` 토글 | High |
| FR-021 | 표기법 안내 | `pages/practical/index.tsx` | 표기법 안내 배너 (lines 50-60) | High |
| | | `components/practical/ScenarioPanel.tsx` | `NOTATION_LABELS`, 표기법 경고 | High |

### 학습 관리 영역 (FR-022~024)

| FR-ID | 요구사항명 | 구현 파일 | 구현 함수·컴포넌트 | 신뢰도 |
|:---|:---|:---|:---|:---:|
| FR-022 | 대시보드 | `pages/index.tsx` | `HomePage` | High |
| | | `components/dashboard/HeroBanner.tsx` | 환영·진도·이어서 풀기 | High |
| | | `components/dashboard/LearningPath.tsx` | 6과목 학습 경로 버블 | High |
| | | `components/dashboard/ChapterProgress.tsx` | 챕터별 진도율 | High |
| | | `components/dashboard/WeakChapters.tsx` | 취약 챕터 | High |
| | | `components/dashboard/WeeklyXP.tsx` | XP·스트릭 | High |
| | | `components/dashboard/ProgressChart.tsx` | 과목별 정답률 차트 | High |
| FR-023 | 오답 노트 | `pages/quiz/wrong.tsx` | `WrongPage` — answers 'wrong' 필터 | High |
| FR-024 | 북마크 | `pages/quiz/bookmarks.tsx` | `BookmarksPage` | High |
| | | `context/ProgressContext.tsx` | `toggleBookmark()`, `progress.bookmarks` | High |

---

## 2. 미구현 요구사항

**없음** — FR-001~024 전체 구현 완료.

---

## 3. 고아 코드 후보 분석

| 파일 | 주요 내용 | FR 연관 여부 |
|:---|:---|:---:|
| `lib/exam.ts` | `PART_MAX_SCORE`, `PART_QUOTA`, `calcPartScore`, `isExamPassed`, `computeExamResult` | ✅ FR-010·011 지원 lib |
| `lib/chapters.ts` | `CHAPTERS`, `PART_TITLES`, `getChapterById`, `getChapterIdByQuestionId` | ✅ 전 FR 기초 데이터 |
| `lib/theory.ts` | `getChapterContent`, `getChapterMeta` | ✅ FR-002 지원 lib |
| `lib/practical.ts` | `getPracticalProblems`, `savePracticalDraft`, `loadPracticalDraft` | ✅ FR-016~020 지원 lib |
| `context/ProgressContext.tsx` | `useProgress` hook, `markAnswer`, `setLastVisited` | ✅ FR-006·013·022·023·024 지원 |
| `lib/questions.ts` | `getAllQuestionsIdMap`, `getQuestionsByIds` | ✅ FR-006·014 지원 (통계 계산용) |
| `scripts/validate-questions.ts` | 문제 JSON 검증 스크립트 | ✅ 개발 도구 (비FR) |

**고아 코드 없음** — 모든 파일이 FR 구현을 직접 지원하거나 개발 도구.

---

## 4. 데이터 레이어 추적성

| 데이터 파일 | 연관 FR | 구현 상태 |
|:---|:---|:---:|
| `data/theory/part{1-6}_ch{1-4}.md` (21개) | FR-002 | ✅ 완료 |
| `data/questions/part{1-6}_ch{1-4}.json` (21개) | FR-006·009·014 | ✅ 완료 |
| `data/questions/mockexam/exam{1,2}.json` | FR-015 | ✅ 완료 (75문항) |
| `data/practical/prac_{001-005}.json` | FR-016~020 | ✅ 완료 (5개) |

---

## 5. localStorage 추적성

| localStorage 키 | 연관 FR | 구현 파일 |
|:---|:---:|:---|
| `dap_progress` | FR-013·022·023·024 | `lib/progress.ts::loadProgress/saveProgress` |
| `dap_exam_session` | FR-013 | `lib/progress.ts::saveExamSession/loadExamSession` |
| `dap_practical_{id}` | FR-017~020 | `lib/practical.ts::savePracticalDraft/loadPracticalDraft` |
| `q-theme` | 비FR (UX) | `components/layout/TopBar.tsx` |

---

## 6. 커버리지 요약

| 구분 | 건수 | 비율 |
|:---|:---:|:---:|
| 전체 FR | 24 | 100% |
| High 신뢰도 매핑 | 24 | **100%** |
| Medium 신뢰도 매핑 | 0 | 0% |
| 미매핑 | 0 | 0% |
| 고아 코드 | 0 | — |

**전체 FR 커버리지: 100% (24/24)**

---

## 7. 문서 버전 이력

| 버전 | 일자 | 내용 |
|:---|:---|:---|
| v0.1 | 2026-06-04 | 초안 생성 — sub-agent 2개 병렬 분석, FR-001~024 전체 매핑 완료 |
