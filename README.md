# DAsP Master 🎓

**DAsP(데이터아키텍처 준전문가)** 자격증 시험 준비를 위한 **웹 기반 학습 플랫폼**입니다.  
이론 학습 + 단원별 문제 풀이 + 모의고사를 한 곳에서 제공합니다.

---

## 📖 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **용도** | DAsP(데이터아키텍처 준전문가) 시험 준비 |
| **학습 과목** | 4과목 (전사아키텍처·데이터 요건분석·데이터 표준화·데이터 모델링) |
| **총 챕터** | 14개 챕터 |
| **챕터 문제** | 216문항 (챕터별 15~23문항) |
| **모의고사** | 50문항 × 2회 (exam1·exam2) |
| **주요 기능** | 이론 학습, 단원별 풀이, 모의고사(3가지 모드), 오답 노트, 북마크, 이어서 풀기 |
| **진도 추적** | localStorage 기반 (로그인 불필요) |
| **배포 환경** | Vercel / Next.js SSG |

---

## 🎯 DAsP 시험 구조

| 과목 | 제목 | 문항 | 배점 |
|------|------|------|------|
| 1과목 | 전사아키텍처 이해 | 10문항 | 20점 (문항당 2점) |
| 2과목 | 데이터 요건 분석 | 10문항 | 20점 (문항당 2점) |
| 3과목 | 데이터 표준화 | 10문항 | 20점 (문항당 2점) |
| 4과목 | 데이터 모델링 | 20문항 | 40점 (문항당 2점) |
| **합계** | | **50문항** | **100점 / 90분** |

**합격 기준**: 전체 60점 이상 + 각 과목 40% 이상 (과락 없이)

---

## 🚀 빠른 시작

```bash
# 저장소 클론
git clone https://github.com/kdkim2000/dasp.git
cd dasp

# 의존성 설치
npm install

# 개발 서버 실행 (localhost:3000)
npm run dev
```

### 주요 명령어

```bash
npm run dev          # 개발 서버 (hot reload)
npm run build        # SSG 빌드
npm run lint         # ESLint 검사
npm run type-check   # TypeScript 타입 검사
npm run test         # Vitest 단위 테스트 (1회)
npm run test:watch   # Vitest (watch 모드)
```

---

## 🎓 주요 기능

### 📚 이론 학습 (`/theory`)
- **14개 챕터** — 공식 출제 범위 주요항목 기준 구성
- **마크다운 기반** — 표·코드블록·예시·출제 포인트 포함
- **TOC(목차)** — 섹션별 빠른 이동
- **관련 문제 미리보기** — 이론 → 문제 풀기 자연스러운 연계

### 🎯 문제 풀이 (`/quiz`)
- **단원별 풀기** — 14개 챕터별 순차 풀이, 정답 즉시 확인
- **오답 노트** — 틀린 문제만 모아서 반복 학습
- **북마크** — 중요 문제 따로 정리
- **키보드 단축키** — 선택지 1~4키 빠른 선택

### 📝 모의고사 (`/quiz/exam`)
- **3가지 출제 모드** 선택 가능:
  - 모의고사 1회 — 고정 50문항 세트 (EA·정보요구 집중)
  - 모의고사 2회 — 고정 50문항 세트 (거버넌스·물리모델링 집중)
  - 랜덤 출제 — 매회 챕터 풀에서 새로운 문제 조합
- **90분 타이머** — 실전 동일 조건
- **이어서 풀기** — 이탈 후 재진입해도 진행 상황 자동 복원 (localStorage 세션)
- **과목별 점수** — 1~4과목 개별 점수 및 합격/불합격 판정
- **문제 네비게이터** — 그리드로 풀이 상태 시각화

### 📊 대시보드 (`/`)
- **히어로 배너** — 전체 정답률, 현재 진도 요약
- **학습 경로** — 14개 챕터 버블 진행 상황 (완료·진행중·잠금)
- **챕터별 진도** — 4과목 컬러 구분 진도 바
- **취약 챕터** — 정답률 낮은 상위 챕터 파악
- **과목별 정답률** — 원형 차트로 시각화

---

## 📁 콘텐츠 구성

### 이론 파일 (14개)

| 챕터 ID | 과목 | 주요항목 |
|---------|------|---------|
| `part1_ch1` | 1과목 | 전사아키텍처 개요 (EA 정의·프레임워크·참조모델·프로세스) |
| `part1_ch2` | 1과목 | 전사아키텍처 구축 (방향수립·아키텍처매트릭스·현행분석) |
| `part1_ch3` | 1과목 | 전사아키텍처 관리 및 활용 (거버넌스·데이터 거버넌스) |
| `part2_ch1` | 2과목 | 정보 요구 사항 개요 |
| `part2_ch2` | 2과목 | 정보 요구 사항 조사 (수집기법·면담절차·우선순위) |
| `part2_ch3` | 2과목 | 정보 요구 사항 분석 (분석대상·상세화·재검토) |
| `part2_ch4` | 2과목 | 정보 요구 검증 (상관분석·CRUD·명세서·생명주기) |
| `part3_ch1` | 3과목 | 데이터 표준화 개요 (필요성·개념·관리도구) |
| `part3_ch2` | 3과목 | 데이터 표준 수립 (단어·용어·도메인·코드 표준) |
| `part3_ch3` | 3과목 | 데이터 표준 관리 (품질관리·변경관리·거버넌스) |
| `part4_ch1` | 4과목 | 데이터 모델링 이해 (개요·기법·표기법·관계형모델) |
| `part4_ch2` | 4과목 | 개념 데이터 모델링 (주제영역·엔터티·관계 정의) |
| `part4_ch3` | 4과목 | 논리 데이터 모델링 (속성·정규화·이력관리·참조무결성) |
| `part4_ch4` | 4과목 | 물리 데이터 모델링 (변환·반정규화·인덱스·파티셔닝) |

### 문제 현황

| 구분 | 파일 | 문항 수 |
|------|------|--------|
| 1과목 | part1_ch1~ch3 | 23 + 18 + 18 = **59문항** |
| 2과목 | part2_ch1~ch4 | 15 + 18 + 17 + 18 = **68문항** |
| 3과목 | part3_ch1~ch3 | 15 + 15 + 15 = **45문항** |
| 4과목 | part4_ch1~ch4 | 15 + 15 + 19 + 18 = **67문항** |
| **챕터 합계** | | **239문항** |
| 모의고사 1회 | exam1.json | **50문항** |
| 모의고사 2회 | exam2.json | **50문항** |
| **총 문항** | | **339문항** |

---

## 🛠 기술 스택

| 영역 | 기술 | 설명 |
|------|------|------|
| 프레임워크 | **Next.js 14** | Pages Router, SSG |
| 언어 | **TypeScript** | strict 모드 |
| 스타일링 | **Tailwind CSS** | 인디고/블루 팔레트 (#6366F1) |
| 상태 관리 | **React Context** | useProgress 훅 |
| 저장소 | **localStorage** | dasp_progress, dasp_exam_session |
| 마크다운 | **react-markdown** | rehype-highlight 코드 하이라이팅 |
| 테스트 | **Vitest + jsdom** | 단위 테스트 |
| 배포 | **Vercel** | Next.js 최적화 호스팅 |

---

## 📁 프로젝트 구조

```
dasp/
├── pages/
│   ├── _app.tsx                    ← ProgressProvider + Layout
│   ├── index.tsx                   ← 대시보드 홈
│   ├── theory/
│   │   ├── index.tsx               ← 이론 목차 (4과목 그리드)
│   │   └── [chapterId].tsx         ← 이론 본문 (SSG, 14개 경로)
│   └── quiz/
│       ├── index.tsx               ← 문제풀기 허브
│       ├── chapter/[chapterId].tsx ← 단원별 풀이 (SSG, 14개 경로)
│       ├── exam.tsx                ← 모의고사 (3가지 모드, 세션 영속화)
│       ├── result.tsx              ← 결과 (4과목별 점수)
│       ├── wrong.tsx               ← 오답 노트
│       └── bookmarks.tsx           ← 북마크
│
├── components/
│   ├── layout/Layout.tsx, TopBar.tsx
│   ├── ui/Mascot.tsx, Badge.tsx    ← 마스코트(Archi), 게이미피케이션 배지
│   ├── quiz/
│   │   ├── QuestionCard.tsx        ← 문제 카드 + 키보드 단축키
│   │   ├── AnswerFeedback.tsx      ← 정답/오답 + 해설
│   │   ├── QuizNavigator.tsx       ← 문제 번호 그리드
│   │   └── ExamTimer.tsx           ← 카운트다운 타이머
│   ├── theory/
│   │   ├── TheoryContent.tsx       ← 마크다운 렌더링
│   │   ├── TheoryTOC.tsx           ← 목차 (IntersectionObserver)
│   │   └── RelatedQuestions.tsx    ← 관련 문제 미리보기
│   └── dashboard/
│       ├── HeroBanner.tsx, LearningPath.tsx
│       ├── ChapterProgress.tsx, WeakChapters.tsx
│       ├── WeeklyXP.tsx, ProgressChart.tsx
│       └── MascotCard.tsx
│
├── lib/
│   ├── chapters.ts     ← CHAPTERS 배열 (14개, 유일한 챕터 소스)
│   ├── questions.ts    ← 문제 로드·필터링·모의고사 샘플링
│   ├── theory.ts       ← 이론 마크다운 로드
│   └── progress.ts     ← localStorage CRUD + 시험 세션 영속화
│
├── context/
│   └── ProgressContext.tsx   ← useProgress 훅 (답변·북마크·XP·스트릭)
│
├── types/
│   └── index.ts              ← Question, ExamResult, ExamSession 등
│
├── data/
│   ├── theory/               ← 14개 이론 마크다운 (part{1-4}_ch{1-4}.md)
│   └── questions/
│       ├── part{1-4}_ch{1-4}.json  ← 14개 챕터 문제
│       └── mockexam/
│           ├── exam1.json    ← 모의고사 1회 (50문항)
│           └── exam2.json    ← 모의고사 2회 (50문항)
│
├── scripts/
│   └── validate-questions.ts ← JSON 스키마 검증
│
├── docs/plans/               ← 개발 이력 계획 문서 (01~07)
├── CLAUDE.md                 ← 개발자 가이드 (Claude Code용)
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🔄 핵심 데이터 흐름

### 진도 추적
```
사용자 선택지 선택
    ↓
QuestionCard → handleAnswer()
    ↓
ProgressContext.markAnswer()
    ↓
lib/progress.ts → localStorage('dasp_progress') 저장
    ↓
getStats() 계산 → Dashboard 반영
```

### 모의고사 세션 영속화
```
시험 시작 → 문제 로드 + 세션 저장 (dasp_exam_session)
    ↓
답변/이동 시마다 자동 저장
    ↓
이탈 후 재진입
    ↓
인트로 화면에 "이어서 풀기" 배너 표시
    ↓
클릭 → examEndTime 기반 남은 시간 계산 + 상태 복원
    ↓
제출 → 세션 삭제 + 결과 저장 (dasp_progress.examHistory)
```

### ID 형식 규칙
| 용도 | 형식 | 예시 |
|------|------|------|
| 파일명·라우팅 | `part{N}_ch{M}` | `part4_ch3` |
| 챕터 문제 ID | `p{N}c{M}_{3자리}` | `p4c3_015` |
| 모의고사 ID | `exam{N}_{3자리}` | `exam1_042` |

---

## 🗂 데이터 모델

```typescript
// 핵심 타입 (types/index.ts)
interface Question {
  id: string              // "p2c3_001"
  part: 1 | 2 | 3 | 4
  chapter: string         // "part2_ch3"
  content: string
  options: string[]       // 4지선다
  answer: number          // 0-3
  explanation: string
  tags?: string[]
  difficulty?: '하' | '중' | '상'
  questionType?: 'concept' | 'application' | 'comparison' | 'ordering'
}

interface ExamSession {   // 모의고사 이탈 복원용
  mode: 'random' | 'exam1' | 'exam2'
  questions: Question[]
  currentIndex: number
  answers: Record<number, { selectedIndex: number; result: AnswerResult }>
  examEndTime: number     // 절대 만료 시각 (ms)
}
```

---

## 📊 콘텐츠 통계

| 항목 | 수량 |
|------|------|
| 이론 챕터 | 14개 |
| 챕터 문제 | 239문항 |
| 모의고사 문제 | 100문항 (2회 × 50) |
| 총 문제 | 339문항 |
| SSG 정적 경로 | 28개 (이론 14 + 문제 14) |

---

## 🔐 데이터 저장 구조 (localStorage)

| 키 | 내용 |
|----|------|
| `dasp_progress` | 답변 기록, 북마크, 모의고사 이력 (최근 10개) |
| `dasp_exam_session` | 진행 중 모의고사 세션 (이탈 복원용) |
| `q-theme` | 다크모드 설정 (`'dark'` \| `'light'`) |

---

## 🎨 UI/UX 특징

- **다크모드** — CSS 변수(`--q-bg` 등) + `[data-theme="dark"]` 전환
- **반응형** — 모바일·태블릿·데스크톱 최적화
- **게이미피케이션** — 스트릭(🔥), 보석(💎), XP(⚡) 배지
- **Archi 마스코트** — 인디고 컬러 SVG 캐릭터 (표정 3가지)
- **키보드 단축키** — 문제 풀이 중 1~4키로 선택지 선택

---

## 🧪 개발 및 검증

```bash
# 타입 검사
npm run type-check

# ESLint
npm run lint

# 단위 테스트
npm run test

# 전체 빌드 + SSG 생성
npm run build

# 단일 테스트 파일
npx vitest run lib/chapters.test.ts
```

---

## 📝 개발 이력 (docs/plans/)

| 계획 | 내용 |
|------|------|
| 01 | SQL 실전 문제 업그레이드 (초기 SQLD 버전) |
| 02 | 혼합 랜덤 출제 구조 (초기) |
| 03 | 공식 출제 범위 기준 챕터 재구성 (14챕터) |
| 04 | 모의고사 문제 품질 1차 개선 |
| 05 | 이론 기반 누락 문제 추가 (24문항) |
| 06 | 모의고사 세션 영속화 (이어서 풀기) |
| 07 | 모의고사 전면 재작성 (실전 수준 품질) |

---

## ⚠️ 알려진 제한사항

1. **기기별 독립 저장** — 다른 기기에서 진도 불러오기 불가
2. **브라우저 캐시 삭제 시** — 진도 초기화
3. **오프라인 미지원** — 네트워크 필요 (SSG이므로 초기 로드 후 일부 기능 가능)

---

## 📞 지원

- **이슈**: [GitHub Issues](https://github.com/kdkim2000/dasp/issues)
- **자격증 공식**: [KDATA 데이터자격검정](https://www.kdata.or.kr/)

---

## 📄 라이선스

MIT License

---

**마지막 업데이트**: 2026-06-02  
**버전**: 2.0.0  
**상태**: ✅ 운영 중
