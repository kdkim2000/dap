# PRD — DAP Master

> 원천 요구사항: `요구사항정의서_DAP_Master_20260603.md`  
> 전환 방식: **점진적 업그레이드** (기존 DAsP 코드 기반 → DAP 확장)

---

## 제품 비전

DAP(데이터아키텍처 전문가) 자격증 시험을 완전히 준비할 수 있는 유일한 올인원 웹 학습 플랫폼.  
필기(6과목·75문항·0.8점/문항) + 실기(논리 데이터 모델·표준화 정의서, 40점) 모두 커버.

---

## 페이즈별 구현 계획

### Phase 1 — 코어 인프라 업그레이드 (선행 필수)

기존 4과목 기반 타입·라이브러리를 6과목으로 확장. 모든 이후 Phase의 전제조건.

| 파일 | 변경 내용 | FR/CR |
|:---|:---|:---|
| `types/index.ts` | `part: 1\|2\|3\|4\|5\|6`, `ExamResult`에 `part5Score·part6Score` 추가 | DR-005, CR-001 |
| `lib/chapters.ts` | `CHAPTERS` 21개, `PART_TITLES` 6개 | DR-001 |
| `lib/questions.ts` | `sampleExamQuestions` — 4과목 25문항·나머지 각 10문항 | FR-014, CR-005 |
| `progress.ts` | localStorage 키 `dasp_progress` → `dap_progress`, 기존 데이터 마이그레이션 로직 | DR-004 |
| `context/ProgressContext.tsx` | `byPart` 통계 6과목 지원 | FR-022 |
| `scripts/validate-questions.ts` | 정규식 `p[1-4]` → `p[1-6]` | DR-006 |

### Phase 2 — 신규 콘텐츠 데이터 (AI 초안 생성)

5과목(3챕터)·6과목(4챕터) 이론 MD + 문제 JSON 신규 생성. 모의고사 2회 75문항으로 재구성.

| 대상 | 파일 수 | 비고 |
|:---|:---:|:---|
| `data/theory/part5_ch{1-3}.md` | 3 | 데이터베이스 설계와 이용 |
| `data/theory/part6_ch{1-4}.md` | 4 | 데이터 품질 관리이해 |
| `data/questions/part5_ch{1-3}.json` | 3 | p5c{1-3}_{3자리} ID |
| `data/questions/part6_ch{1-4}.json` | 4 | p6c{1-4}_{3자리} ID |
| `data/questions/mockexam/exam1.json` | 1 | 75문항으로 재구성 |
| `data/questions/mockexam/exam2.json` | 1 | 75문항으로 재구성 |
| `data/practical/prac_001~005.json` | 5+ | 실기 연습 문제 초안 |

### Phase 3 — UI 페이지 업그레이드

기존 페이지의 4과목 → 6과목 확장 및 배점·타이머 수정.

| 페이지 | 변경 내용 | FR |
|:---|:---|:---|
| `theory/index.tsx` | 6과목 그리드로 확장 | FR-001 |
| `quiz/exam.tsx` | ExamTimer 14400초, 75문항 | FR-010, CR-005 |
| `quiz/result.tsx` | 6과목별 점수(배점 0.8점 기준) + 실기 40점 안내 | FR-011, FR-012 |

### Phase 4 — 실기 연습 섹션 (신규)

텍스트 서술 + 이미지 업로드 방식으로 논리 데이터 모델·표준화 정의서 연습 기능 구현.

| 구현 대상 | 비고 |
|:---|:---|
| `pages/practical/index.tsx` | 실기 문제 목록·유형 안내 허브 |
| `pages/practical/[practiceId].tsx` | 문제별 지문·요구사항·답안 입력 |
| `components/practical/PracticalLayout.tsx` | 좌(지문) / 우(답안) 분할 레이아웃 |
| `components/practical/AnswerTextEditor.tsx` | 엔터티·관계·속성 텍스트 서술 영역 |
| `components/practical/ModelImageUpload.tsx` | 손으로 그린 모델 이미지 업로드 (이미지 미리보기 포함) |
| `components/practical/ScoringGuide.tsx` | 채점 포인트 체크리스트 + 모범답안 |
| `lib/practical.ts` | `getPracticalProblems`, `getPracticalById` |

### Phase 5 — 통합 검증 및 마무리

| 작업 | 도구 |
|:---|:---|
| 타입 검사 | `npm run type-check` |
| 단위 테스트 갱신 | `lib/chapters.test.ts`, `lib/progress.test.ts` |
| 문제 ID 검증 | `npm run validate` (또는 `ts-node scripts/validate-questions.ts`) |
| 빌드 검증 | `npm run build` (SSG 전 경로 생성 확인) |

---

## 합격 기준 계산 로직

```
필기 점수 = 각 과목 정답 수 × 0.8점
과목 합격선 = 해당 과목 배점 × 40%
  - 1·2·3·5·6과목: 8점 × 40% = 3.2점 이상 (4문항 이상 정답)
  - 4과목: 20점 × 40% = 8점 이상 (10문항 이상 정답)
전체 합격선: 필기 총점 60점 만점 중 36점 이상
            + 각 과목 개별 합격선 모두 통과
            + 실기 40점 별도 (웹앱에서는 안내만 제공)
```

---

## 비고

- 이미지 업로드는 `<input type="file">` + `FileReader` API로 클라이언트 사이드만 처리. 서버 업로드 없음.
- 업로드된 이미지는 `localStorage`에 base64로 임시 저장 (세션 내 유지).
- 실기 답안 "제출" 기능은 없음. 자가 채점(체크리스트 확인) 방식.
