# 비즈니스 규칙

| 항목 | 내용 |
|:---|:---|
| 사업명 | DAP Master — 데이터아키텍처 전문가 자격증 시험 준비 웹사이트 |
| 작성일 | 2026-06-03 |
| 버전 | v0.1 |
| 근거 문서 | 요구사항정의서_DAP_Master_20260603.md / CLAUDE.md / 화면목록_DAP_Master_20260603.md |
| 총 규칙 수 | 36개 (BR-001 ~ BR-036) |

---

## 요약 표 (도메인별 규칙 수)

| 도메인 | BR 범위 | 규칙 수 | 핵심 내용 |
|:---|:---:|:---:|:---|
| 필기 점수 계산 | BR-001~003 | 3 | 문항당 0.8점, 과목별·전체 점수 |
| 합격 판정 | BR-004~007 | 4 | 전체 36점 이상 + 과목별 40% 이상, 실기 안내 |
| 모의고사 문항 배분 | BR-008~010 | 3 | 75문항 배분, 240분 타이머, 자동 제출 |
| 시험 세션 관리 | BR-011~014 | 4 | 자동 저장, 복원, 만료, 초기화 |
| 문제 데이터 관리 | BR-015~017 | 3 | ID 형식, 정합성 검증, 챕터 연결 |
| 학습 진도 관리 | BR-018~021 | 4 | localStorage 키, 마이그레이션, 가드, 북마크 |
| 실기 답안 관리 | BR-022~026 | 5 | 자동 저장, 이미지 크기·용량, 키 형식, 제출 없음 |
| 콘텐츠 & 라우팅 | BR-027~030 | 4 | CHAPTERS 단일 소스, 404, MD 구조, 표기법 |
| UI / UX | BR-031~032 | 2 | 다크모드 유지, 반응형 |
| 보안 | BR-033~034 | 2 | 외부 전송 금지, XSS 방어 |
| 학습 관리 기타 | BR-035~036 | 2 | 오답 필터, 북마크 조회 |
| **합계** | | **36** | |

---

## 1. 필기 점수 계산

| BR-ID | 규칙명 | 조건 (When/If) | 행동 (Then) | 우선순위 | 상태 |
|:---|:---|:---|:---|:---:|:---:|
| BR-001 | 문항별_점수산정 | 객관식 문항 1개에 정답을 선택하면 | 해당 문항에 0.8점을 부여한다. 오답·미응답은 0점. | 높음 | 초안 |
| BR-002 | 과목별_점수합산 | 모의고사 채점 시 | 각 과목의 정답 수 × 0.8점을 과목 점수로 계산한다. (FR-011 참조) | 높음 | 초안 |
| BR-003 | 전체_점수합산 | 모의고사 채점 시 | 6개 과목 점수의 합계를 필기 총점으로 계산한다. 최대 60점. | 높음 | 초안 |

---

## 2. 합격 판정

| BR-ID | 규칙명 | 조건 (When/If) | 행동 (Then) | 우선순위 | 상태 |
|:---|:---|:---|:---|:---:|:---:|
| BR-004 | 전체합격선_판정 | 필기 총점이 산출되면 | 총점 ≥ 36점(60점 만점의 60%)이면 전체 합격선 통과로 판정한다. (FR-011, CR-005) | 높음 | 초안 |
| BR-005 | 과목별합격선_판정 | 각 과목 점수가 산출되면 | 과목별 최소 점수(1·2·3·5·6과목 ≥ 3.2점 / 4과목 ≥ 8점)를 충족하면 해당 과목 합격으로 판정한다. | 높음 | 초안 |
| BR-006 | 최종합격_판정 | 전체 합격선(BR-004)과 6개 과목 합격선(BR-005) 판정이 완료되면 | 전체 합격선 AND 전 과목 합격선 모두 충족 시 "합격", 하나라도 미충족 시 "불합격"으로 표시한다. | 높음 | 초안 |
| BR-007 | 실기안내_표시 | 모의고사 결과 화면(SCR-010, SCR-011)이 표시되면 | 필기 합격·불합격과 무관하게 "실기 1문항 40점 별도 준비 필요" 안내 배너를 항상 표시한다. (FR-012) | 중간 | 초안 |

> **과목별 합격선 상세**  
> 1·2·3·5·6과목: 8점 × 40% = 3.2점 이상 (정답 4문항 이상)  
> 4과목: 20점 × 40% = 8점 이상 (정답 10문항 이상)

---

## 3. 모의고사 문항 배분

| BR-ID | 규칙명 | 조건 (When/If) | 행동 (Then) | 우선순위 | 상태 |
|:---|:---|:---|:---|:---:|:---:|
| BR-008 | 랜덤모의고사_배분 | 랜덤 모의고사 시작 시 (`sampleExamQuestions`) | 1·2·3·5·6과목은 각 10문항, 4과목은 25문항을 해당 과목 문제 풀에서 무작위 추출하여 총 75문항 세트를 구성한다. (FR-014, CR-005) | 높음 | 초안 |
| BR-009 | 고정모의고사_순서 | 고정 모의고사(exam1 또는 exam2) 시작 시 | exam1.json 또는 exam2.json의 75문항을 파일에 저장된 순서 그대로 출제한다. 무작위 섞기 없음. (FR-015) | 중간 | 초안 |
| BR-010 | 시험시간_초과_제출 | 모의고사 진행 중 남은 시간(examEndTime - 현재시각)이 0 이하가 되면 | 현재 답변 상태로 자동 제출하고 채점·결과 화면으로 전환한다. (FR-010, SCR-009) | 높음 | 초안 |

---

## 4. 시험 세션 관리

| BR-ID | 규칙명 | 조건 (When/If) | 행동 (Then) | 우선순위 | 상태 |
|:---|:---|:---|:---|:---:|:---:|
| BR-011 | 세션_자동저장 | 모의고사 진행 중 답변이 변경되거나 문항이 이동되면 | ExamSession(mode, questions, currentIndex, answers, examEndTime)을 localStorage(`dap_exam_session`)에 즉시 저장한다. (FR-013) | 높음 | 초안 |
| BR-012 | 세션_복원_제안 | 모의고사 인트로 화면 진입 시 localStorage에 `dap_exam_session`이 존재하면 | 남은 시간을 계산하여 "이어서 풀기" 배너를 표시하고 사용자가 선택할 수 있게 한다. (FR-013, SCR-008) | 높음 | 초안 |
| BR-013 | 세션_만료_처리 | 이어서 풀기 선택 시 또는 자동 복원 시도 시 examEndTime ≤ Date.now()이면 | 세션을 삭제하고 "세션이 만료되었습니다" 안내 후 새 시험 시작 유도. 만료된 세션으로는 복원하지 않는다. (FR-013) | 높음 | 초안 |
| BR-014 | 세션_초기화 | 새 시험 시작 버튼 클릭 시 | 기존 `dap_exam_session`을 삭제한 후 새 ExamSession을 생성한다. (FR-010, SCR-008) | 높음 | 초안 |

---

## 5. 문제 데이터 관리

| BR-ID | 규칙명 | 조건 (When/If) | 행동 (Then) | 우선순위 | 상태 |
|:---|:---|:---|:---|:---:|:---:|
| BR-015 | 문제ID_형식검증 | 문제 JSON 파일을 validate-questions.ts로 검증할 때 | 필기: `p[1-6]c[1-4]_\d{3}`, 모의고사: `exam[12]_\d{3}`, 실기: `prac_\d{3}` 형식에 맞지 않으면 오류를 출력하고 빌드를 중단한다. (DR-006) | 높음 | 초안 |
| BR-016 | 챕터_문제연결 | 단원별 문제 풀이(SCR-005) 로드 시 | 문제 JSON의 `chapter` 필드가 챕터 ID(`part{N}_ch{M}`)와 일치하는 문제만 해당 챕터에 표시한다. (FR-006) | 높음 | 초안 |
| BR-017 | 문제part_범위 | 문제 JSON 파일에 part 필드 값이 있으면 | 1·2·3·4·5·6 중 하나여야 한다. 범위 외 값이면 validate-questions.ts가 오류 처리. (DR-002) | 높음 | 초안 |

---

## 6. 학습 진도 관리

| BR-ID | 규칙명 | 조건 (When/If) | 행동 (Then) | 우선순위 | 상태 |
|:---|:---|:---|:---|:---:|:---:|
| BR-018 | localStorage_키_목록 | localStorage에 데이터를 저장할 때 | `dap_progress`, `dap_exam_session`, `q-theme`, `dap_practical_{practiceId}` 키만 사용한다. 그 외 키 사용 금지. (IR-001) | 높음 | 초안 |
| BR-019 | 진도키_마이그레이션 | `loadProgress()` 호출 시 `dasp_progress`가 존재하고 `dap_progress`가 없으면 | `dasp_progress` 값을 `dap_progress`에 복사한다. `dasp_progress`는 삭제하지 않는다(롤백 보험). (DR-004) | 높음 | 초안 |
| BR-020 | localStorage_서버가드 | localStorage에 접근하는 모든 코드에서 | `typeof window === 'undefined'`이면 접근하지 않고 기본값을 반환한다. SSG 빌드 중 오류 방지. (IR-001) | 높음 | 초안 |
| BR-021 | 북마크_토글 | 문제 카드의 북마크 버튼 클릭 시 | 해당 문제 ID가 `dap_progress.bookmarks` 배열에 없으면 추가, 있으면 제거한다. (FR-024) | 중간 | 초안 |

---

## 7. 실기 답안 관리

| BR-ID | 규칙명 | 조건 (When/If) | 행동 (Then) | 우선순위 | 상태 |
|:---|:---|:---|:---|:---:|:---:|
| BR-022 | 실기답안_자동저장 | 실기 문제 풀이(SCR-013)에서 텍스트 답안 또는 이미지를 입력·변경하면 | `dap_practical_{practiceId}` 키에 `{ textAnswer, imageDataUrl, savedAt }` 형태로 localStorage에 자동 저장한다. (FR-017~019) | 높음 | 초안 |
| BR-023 | 이미지_리사이즈 | 실기 이미지 업로드 시 이미지의 긴 변이 1920px을 초과하면 | Canvas API로 긴 변이 1920px이 되도록 비율을 유지하며 리사이즈한 후 저장한다. | 중간 | 초안 |
| BR-024 | 이미지_용량제한 | 실기 이미지 base64 변환 결과가 2MB를 초과하면 | JPEG 품질을 낮춰 재압축하여 2MB 이내가 될 때까지 반복한다. 2MB 이내가 되면 저장. | 중간 | 초안 |
| BR-025 | 실기답안_키형식 | 실기 답안을 localStorage에 저장할 때 | 키 이름은 반드시 `dap_practical_{practiceId}` 형식을 사용한다. `practiceId`는 `prac_\d{3}` 형식. | 중간 | 초안 |
| BR-026 | 실기_서버제출_없음 | 실기 연습 답안 작성 완료 후 | 서버로 제출하지 않는다. ScoringGuide의 채점 포인트 체크리스트를 통해 자가 채점하도록 안내한다. (FR-020) | 높음 | 초안 |

---

## 8. 콘텐츠 & 라우팅

| BR-ID | 규칙명 | 조건 (When/If) | 행동 (Then) | 우선순위 | 상태 |
|:---|:---|:---|:---|:---:|:---:|
| BR-027 | SSG경로_단일소스 | `getStaticPaths`를 구현할 때 | 이론·문제 챕터 경로는 반드시 `CHAPTERS` 배열을 참조하여 생성한다. 경로를 하드코딩하지 않는다. (CR-001) | 높음 | 초안 |
| BR-028 | 미존재경로_404 | 존재하지 않는 chapterId 또는 practiceId로 접근 시 | `fallback: false`를 적용하여 404 페이지를 반환한다. 빌드 시 정의된 경로 외에는 자동 생성하지 않는다. (CR-002) | 높음 | 초안 |
| BR-029 | 이론MD_헤딩구조 | 이론 MD 파일(`data/theory/part{N}_ch{M}.md`)을 작성할 때 | 헤딩 레벨을 `#` 챕터 제목, `##` 주요항목, `###` 세부항목으로 통일한다. TheoryTOC는 `##` 헤딩만 추출한다. (FR-002, FR-003) | 중간 | 초안 |
| BR-030 | 실기표기법_안내 | 실기 연습 허브(SCR-012)와 실기 문제 풀이(SCR-013)에서 | 바커(Barker) 또는 IE 표기법 중 하나를 선택하도록 안내하고, 혼용 시 감점됨을 강조한다. 강제 검증은 없음. (FR-021) | 중간 | 초안 |

---

## 9. UI / UX

| BR-ID | 규칙명 | 조건 (When/If) | 행동 (Then) | 우선순위 | 상태 |
|:---|:---|:---|:---|:---:|:---:|
| BR-031 | 다크모드_유지 | 테마를 라이트 또는 다크로 전환하면 | `localStorage('q-theme')`에 선택값을 저장한다. 이후 방문 시 저장된 테마를 `_document.tsx`에서 즉시 적용하여 FOUC(깜빡임)를 방지한다. (QR-003) | 중간 | 초안 |
| BR-032 | 반응형_최소해상도 | 화면을 렌더링할 때 | 360px(모바일 최소) ~ 1440px(데스크톱 최대) 해상도에서 레이아웃이 깨지지 않아야 한다. (QR-002) | 중간 | 초안 |

---

## 10. 보안

| BR-ID | 규칙명 | 조건 (When/If) | 행동 (Then) | 우선순위 | 상태 |
|:---|:---|:---|:---|:---:|:---:|
| BR-033 | 사용자데이터_로컬보관 | 학습 진도·모의고사 결과·실기 답안 등 사용자 데이터를 처리할 때 | 서버로 전송하지 않고 오직 브라우저 localStorage에만 저장한다. 외부 API 호출 없음. (SR-001, CR-003, CR-004) | 높음 | 초안 |
| BR-034 | XSS_방어 | react-markdown에서 `rehype-raw` 플러그인을 사용하여 이론 MD를 렌더링할 때 | HTML 삽입 공격(XSS)을 방어하는 sanitize 처리를 적용한다. 미처리 시 이론 MD 파일 내 `<script>` 태그가 실행될 수 있음. (SR-002) | 높음 | 초안 |

---

## 11. 학습 관리 기타

| BR-ID | 규칙명 | 조건 (When/If) | 행동 (Then) | 우선순위 | 상태 |
|:---|:---|:---|:---|:---:|:---:|
| BR-035 | 오답노트_필터링 | 오답 노트(SCR-006) 진입 시 | `dap_progress.answers` Record에서 `result === 'wrong'`인 항목의 문제 ID를 추출하여 해당 문제 목록을 표시한다. (FR-023) | 높음 | 초안 |
| BR-036 | 북마크목록_조회 | 북마크(SCR-007) 진입 시 | `dap_progress.bookmarks` 배열의 문제 ID로 `getAllQuestions()`에서 해당 문제를 조회하여 목록을 표시한다. ID에 해당하는 문제가 없으면 해당 항목을 건너뜀. (FR-024) | 중간 | 초안 |

---

## 부록: 비즈니스 규칙 코드 구현 가이드

### 합격 판정 로직 (BR-004~006)

```typescript
// lib/exam.ts 또는 pages/quiz/exam.tsx
const PART_MAX_SCORE: Record<number, number> = {
  1: 8, 2: 8, 3: 8, 4: 20, 5: 8, 6: 8
}
const POINTS_PER_Q = 0.8

function calcPartScore(correctCount: number): number {
  return Math.round(correctCount * POINTS_PER_Q * 10) / 10
}

function isPartPassed(part: number, score: number): boolean {
  return score >= PART_MAX_SCORE[part] * 0.4  // BR-005
}

function isExamPassed(scores: Record<number, number>): boolean {
  const total = Object.values(scores).reduce((a, b) => a + b, 0)
  return total >= 36                                          // BR-004
    && [1,2,3,4,5,6].every(p => isPartPassed(p, scores[p])) // BR-006
}
```

### localStorage 마이그레이션 (BR-019)

```typescript
// lib/progress.ts loadProgress() 진입부
function migrateIfNeeded() {
  if (typeof window === 'undefined') return  // BR-020
  const old = localStorage.getItem('dasp_progress')
  const cur = localStorage.getItem('dap_progress')
  if (old && !cur) {
    localStorage.setItem('dap_progress', old)
    // dasp_progress 삭제 안 함 (BR-019: 롤백 보험)
  }
}
```

### 이미지 리사이즈 (BR-023~024)

```typescript
// components/practical/ModelImageUpload.tsx
function resizeImage(file: File, maxPx = 1920, maxBytes = 2 * 1024 * 1024): Promise<string> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height))  // BR-023
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      let quality = 0.9
      let dataUrl = canvas.toDataURL('image/jpeg', quality)
      while (dataUrl.length > maxBytes * 1.37 && quality > 0.3) {  // BR-024
        quality -= 0.1
        dataUrl = canvas.toDataURL('image/jpeg', quality)
      }
      resolve(dataUrl)
    }
    img.src = URL.createObjectURL(file)
  })
}
```

---

## 문서 버전 이력

| 버전 | 일자 | 변경 내용 |
|:---|:---|:---|
| v0.1 | 2026-06-03 | 초안 생성 — 요구사항정의서·CLAUDE.md·화면목록 기반 36개 규칙 도출 |
