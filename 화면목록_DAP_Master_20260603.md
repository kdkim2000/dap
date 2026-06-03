# 화면 목록

| 항목 | 내용 |
|:---|:---|
| 사업명 | DAP Master — 데이터아키텍처 전문가 자격증 시험 준비 웹사이트 |
| 작성일 | 2026-06-03 |
| 버전 | v0.1 |
| 근거 문서 | 요구사항정의서_DAP_Master_20260603.md (FR-001~024) |
| 총 화면 수 | 13개 (SCR-001 ~ SCR-013) |

---

## 1. 메뉴 구조 (계층 트리)

> 인증 없는 단일 사용자(학습자) SPA. GNB는 TopBar 컴포넌트, LNB는 없음(전체 메뉴 TopBar 직접 접근).

```
DAP Master
├── GNB-01  홈 (대시보드)          /
├── GNB-02  이론 학습              /theory
│   └── [동적] 챕터 이론 본문      /theory/[chapterId]  ×21
├── GNB-03  문제 풀기              /quiz
│   ├── [동적] 단원별 문제 풀이    /quiz/chapter/[chapterId]  ×21
│   ├── 오답 노트                  /quiz/wrong
│   └── 북마크                    /quiz/bookmarks
├── GNB-04  모의고사               /quiz/exam
│   ├── [단계1] 인트로·모드 선택   phase=intro
│   ├── [단계2] 시험 진행          phase=exam
│   └── [단계3] 시험 결과          phase=result
│   └── (독립 결과 화면)          /quiz/result
└── GNB-05  실기 연습 ★신규        /practical
    └── [동적] 실기 문제 풀이      /practical/[practiceId]  ×N
```

> `★신규` : Phase 4 구현 대상. 기존 코드에 없음.  
> `/quiz/exam`의 세 단계는 동일 URL 내 React state(`phase`)로 전환되는 뷰 상태이며, 별도 SCR로 구분한다.

---

## 2. 화면 목록

| SCR-ID | 화면명 | 유형 | URL / 경로 | 관련 FR | 구현 상태 | 우선순위 |
|:---|:---|:---:|:---|:---|:---:|:---:|
| SCR-001 | 대시보드 홈 | DASH | `/` | FR-022 | 기존 (수정 필요) | 상 |
| SCR-002 | 이론 목차 | LIST | `/theory` | FR-001 | 기존 (수정 필요) | 상 |
| SCR-003 | 이론 본문 | DETAIL | `/theory/[chapterId]` ×21 | FR-002, FR-003, FR-004 | 기존 (유지) | 상 |
| SCR-004 | 문제 풀기 허브 | LIST | `/quiz` | FR-005 | 기존 (수정 필요) | 상 |
| SCR-005 | 단원별 문제 풀이 | FORM | `/quiz/chapter/[chapterId]` ×21 | FR-006, FR-007, FR-008, FR-009 | 기존 (유지) | 상 |
| SCR-006 | 오답 노트 | LIST | `/quiz/wrong` | FR-023 | 기존 (유지) | 상 |
| SCR-007 | 북마크 | LIST | `/quiz/bookmarks` | FR-024 | 기존 (유지) | 중 |
| SCR-008 | 모의고사 인트로 | FORM | `/quiz/exam` (phase=intro) | FR-010, FR-013, FR-014, FR-015 | 기존 (수정 필요) | 상 |
| SCR-009 | 모의고사 진행 | FORM | `/quiz/exam` (phase=exam) | FR-010, FR-013 | 기존 (수정 필요) | 상 |
| SCR-010 | 모의고사 결과 (인라인) | DETAIL | `/quiz/exam` (phase=result) | FR-011, FR-012 | 기존 (수정 필요) | 상 |
| SCR-011 | 시험 결과 (독립) | DETAIL | `/quiz/result` | FR-011, FR-012 | 기존 (수정 필요) | 중 |
| SCR-012 | 실기 연습 허브 ★ | LIST | `/practical` | FR-016, FR-021 | **신규** | 상 |
| SCR-013 | 실기 문제 풀이 ★ | FORM | `/practical/[practiceId]` ×N | FR-017, FR-018, FR-019, FR-020 | **신규** | 상 |

### 화면 유형 범례

| 유형 | 설명 |
|:---:|:---|
| DASH | 대시보드·통계·진도 시각화 |
| LIST | 목록·허브·선택 화면 |
| DETAIL | 상세 조회·결과 확인 |
| FORM | 입력·풀이·답안 작성 화면 |

### 구현 상태 주석

| 상태 | 의미 |
|:---|:---|
| 기존 (유지) | 기존 코드 그대로 사용 가능 |
| 기존 (수정 필요) | 4과목→6과목, DAsP→DAP 브랜딩 등 수정 필요 |
| **신규** | Phase 4에서 신규 구현 |

---

## 3. 화면별 상세 명세 요약

### SCR-001 — 대시보드 홈

| 항목 | 내용 |
|:---|:---|
| URL | `/` |
| 컴포넌트 | `pages/index.tsx` |
| 주요 영역 | HeroBanner, LearningPath, ChapterProgress(6과목), WeakChapters, WeeklyXP, ProgressChart |
| 입력 | ProgressStore (localStorage) |
| 출력 | 과목별 진도율, 취약 챕터 목록, XP·스트릭 배지, 학습 경로 |
| 수정 사항 | `[1,2,3,4]` → `[1,2,3,4,5,6]` 과목 루프, "DAsP" → "DAP" 텍스트 |

### SCR-002 — 이론 목차

| 항목 | 내용 |
|:---|:---|
| URL | `/theory` |
| 컴포넌트 | `pages/theory/index.tsx` |
| 주요 영역 | 과목별 섹션 헤더(6개), 챕터 카드 그리드 |
| 입력 | CHAPTERS 배열, Stats.byPart/byChapter |
| 출력 | 6과목 × 챕터 카드 (정답률 프로그레스 바 포함) |
| 수정 사항 | `[1,2,3,4].map` → `[1,2,3,4,5,6].map`, PART_COLORS 5·6과목 색상 추가 |

### SCR-003 — 이론 본문

| 항목 | 내용 |
|:---|:---|
| URL | `/theory/[chapterId]` (21개 SSG 경로) |
| 컴포넌트 | `pages/theory/[chapterId].tsx` |
| 주요 영역 | TheoryContent(마크다운), TheoryTOC(사이드바), RelatedQuestions(하단) |
| 입력 | chapterId → data/theory/*.md |
| 출력 | 이론 본문 HTML, TOC 섹션 목록, 연관 문제 링크 |
| 수정 사항 | getStaticPaths가 CHAPTERS(21개) 참조하면 자동 확장 |

### SCR-004 — 문제 풀기 허브

| 항목 | 내용 |
|:---|:---|
| URL | `/quiz` |
| 컴포넌트 | `pages/quiz/index.tsx` |
| 주요 영역 | 과목별 챕터 선택 그리드, 문항 수·진도 표시 |
| 입력 | CHAPTERS 배열, Stats |
| 출력 | 21개 챕터 진입 링크 |
| 수정 사항 | 6과목 21챕터로 확장 |

### SCR-005 — 단원별 문제 풀이

| 항목 | 내용 |
|:---|:---|
| URL | `/quiz/chapter/[chapterId]` (21개 SSG 경로) |
| 컴포넌트 | `pages/quiz/chapter/[chapterId].tsx` |
| 주요 영역 | QuestionCard, AnswerFeedback, QuizNavigator |
| 입력 | chapterId → data/questions/*.json |
| 출력 | 문제 카드(4지선다), 즉시 피드백, 난이도·태그 |
| 수정 사항 | getStaticPaths가 CHAPTERS(21개) 참조하면 자동 확장 |

### SCR-008 — 모의고사 인트로

| 항목 | 내용 |
|:---|:---|
| URL | `/quiz/exam` (phase=intro) |
| 주요 영역 | 모드 선택 버튼(랜덤/exam1/exam2), 시험 정보(75문항·240분·6과목), 이어서 풀기 배너 |
| 수정 사항 | "50문항→75문항", "90분→240분", "4과목→6과목", 합격 기준 문구 |

### SCR-009 — 모의고사 진행

| 항목 | 내용 |
|:---|:---|
| URL | `/quiz/exam` (phase=exam) |
| 주요 영역 | QuestionCard, ExamTimer(14400초), QuizNavigator, 제출 버튼 |
| 수정 사항 | `EXAM_SECONDS = 5400` → `14400`, PART_TITLES 6과목 추가 |

### SCR-010 — 모의고사 결과 (인라인)

| 항목 | 내용 |
|:---|:---|
| URL | `/quiz/exam` (phase=result) |
| 주요 영역 | 점수(별점), 6과목별 점수 바, 합격 판정, **실기 40점 안내 배너** |
| 수정 사항 | `partScores = [p1,p2,p3,p4]` → 6과목 배열, 합격 판정 로직(36점↑ + 과목별 40%↑), 실기 안내 추가 |

### SCR-011 — 시험 결과 (독립 페이지)

| 항목 | 내용 |
|:---|:---|
| URL | `/quiz/result` |
| 입력 | URL 쿼리 파라미터: score, p1~p6, time, total, correct |
| 수정 사항 | p5, p6 파라미터 추가, PART_TITLES 6과목, 실기 40점 안내 추가 |

### SCR-012 — 실기 연습 허브 ★신규

| 항목 | 내용 |
|:---|:---|
| URL | `/practical` |
| 컴포넌트 | `pages/practical/index.tsx` (신규) |
| 주요 영역 | 유형 설명 카드(논리모델/표준화정의서), 실기 문제 카드 목록, 표기법 안내 |
| 입력 | `lib/practical.ts::getPracticalProblems()` → data/practical/*.json |
| 출력 | 실기 문제 카드(유형 뱃지, 제목, 난이도), 표기법 안내 섹션 |
| 특이사항 | 서버 없음, 정적 데이터만 사용 |

### SCR-013 — 실기 문제 풀이 ★신규

| 항목 | 내용 |
|:---|:---|
| URL | `/practical/[practiceId]` |
| 컴포넌트 | `pages/practical/[practiceId].tsx` (신규) |
| 레이아웃 | 좌(40%) 지문 패널 + 우(60%) 답안 패널 |
| 주요 컴포넌트 | PracticalLayout, ScenarioPanel, AnswerTextEditor, ModelImageUpload, ScoringGuide |
| 입력 | practiceId → data/practical/prac_NNN.json |
| 출력 | 지문 텍스트, 요구사항 체크리스트, 텍스트 답안 영역, 이미지 업로드·미리보기, 채점 포인트 토글 |
| 저장 | localStorage `dap_practical_{practiceId}` (textAnswer, imageDataUrl) |
| 제출 기능 없음 | 자가 채점(체크리스트 확인) 방식 |

---

## 4. 역할별 접근 화면 매핑

> 이 앱은 **단일 역할(학습자)** 앱이며 인증이 없다. 모든 화면은 비로그인 상태에서 접근 가능하다.

| 역할 | 접근 가능 화면 |
|:---|:---|
| 학습자 (비인증) | SCR-001 ~ SCR-013 전체 |

---

## 5. 화면–FR 커버리지

| FR-ID | FR 요구사항명 | 커버하는 SCR |
|:---|:---|:---|
| FR-001 | 이론 목차 | SCR-002 |
| FR-002 | 이론 본문 렌더링 | SCR-003 |
| FR-003 | 이론 TOC 사이드바 | SCR-003 |
| FR-004 | 연관 문제 링크 | SCR-003 |
| FR-005 | 문제 풀기 허브 | SCR-004 |
| FR-006 | 단원별 문제 풀이 | SCR-005 |
| FR-007 | 정답·해설 피드백 | SCR-005 |
| FR-008 | 문제 네비게이터 | SCR-005 |
| FR-009 | 난이도·태그 표시 | SCR-005 |
| FR-010 | 필기 모의고사 실행 | SCR-008, SCR-009 |
| FR-011 | 모의고사 결과 표시 | SCR-010, SCR-011 |
| FR-012 | 실기 40점 안내 | SCR-010, SCR-011 |
| FR-013 | 시험 세션 저장·복원 | SCR-008, SCR-009 |
| FR-014 | 랜덤 모의고사 | SCR-008 |
| FR-015 | 고정 모의고사 | SCR-008 |
| FR-016 | 실기 연습 허브 | SCR-012 |
| FR-017 | 논리 데이터 모델 연습 (유형1) | SCR-013 |
| FR-018 | 논리 데이터 모델 연습 (유형2) | SCR-013 |
| FR-019 | 표준화 정의서 연습 | SCR-013 |
| FR-020 | 실기 채점 포인트 확인 | SCR-013 |
| FR-021 | 표기법 안내 | SCR-012 |
| FR-022 | 대시보드 | SCR-001 |
| FR-023 | 오답 노트 | SCR-006 |
| FR-024 | 북마크 | SCR-007 |

**FR 커버리지**: FR-001~024 전체 24건 **100% 커버**

---

## 6. 구현 우선순위 및 Phase 매핑

| Phase | 대상 SCR | 작업 유형 |
|:---|:---|:---|
| Phase 2 (코어 인프라) | — | 화면 코드 없음, lib/types만 수정 |
| Phase 3 (UI 업그레이드) | SCR-001, SCR-002, SCR-004, SCR-008, SCR-009, SCR-010, SCR-011 | 기존 화면 수정 |
| Phase 4 (실기 신규) | SCR-012, SCR-013 | 신규 화면 구현 |
| Phase 3 (자동 확장) | SCR-003, SCR-005 | CHAPTERS 21개 반영 시 자동 대응 |

---

## 7. 문서 버전 이력

| 버전 | 일자 | 변경 내용 |
|:---|:---|:---|
| v0.1 | 2026-06-03 | 초안 생성 — FR-001~024 기반 13개 화면 도출 |
