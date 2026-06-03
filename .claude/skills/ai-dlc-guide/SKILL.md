---
name: ai-dlc-guide
description: Guide DAP Master development using the AI-DLC process. Use when asking "what's next", "which skill to use now", "show development progress", "ai-dlc process", "how to proceed", "다음 단계", "어떤 스킬", "개발 진행 상태", "ai-dlc 프로세스 가이드".
---

# ai-dlc-guide

요구사항정의서(`요구사항정의서_DAP_Master_20260603.md`)를 기반으로 DAP Master 개발 진행 상태를
자동 진단하고, 다음에 적용해야 할 **ai-dlc 스킬**을 추천하는 가이드.  
드라이버: `.claude/skills/ai-dlc-guide/progress.mjs` (Node.js, 외부 의존성 없음)

---

## 전제조건

```
node --version   # v22.x (이미 설치됨)
```

---

## 실행 — 전체 진행 상태 확인

```
node .claude/skills/ai-dlc-guide/progress.mjs
```

Phase 1~6 각각의 완료 항목(✓ / ✗)과 사용 가능한 스킬 목록을 출력한다.  
마지막에 **▶ 다음 스킬** 한 줄 추천과 컨텍스트 파일 목록이 나온다.

```
node .claude/skills/ai-dlc-guide/progress.mjs --phase 2
```

특정 Phase만 확인. Phase 6은 `npm run build`까지 실행하므로 느림(~60초).

```
node .claude/skills/ai-dlc-guide/progress.mjs --next
```

스킬 목록 없이 "다음 단계" 추천만 출력. 빠른 확인용.

---

## Phase 구조 및 매핑 스킬

| Phase | 내용 | 핵심 스킬 |
|:---:|:---|:---|
| 1 | 요구사항 & 설계 기반 | `/ai-dlc-requirements` · `/ai-dlc-system-overview` · `/ai-dlc-screen-list` · `/ai-dlc-sequence-design` |
| 2 | 타입 & 코어 인프라 | `/ai-dlc-class-design` · `/ai-dlc-fe-ts-check` · `/ai-dlc-nxt-impl-plan` |
| 3 | 5·6과목 콘텐츠 데이터 | `/ai-dlc-data-design` · `/ai-dlc-data-revise` · `/ai-dlc-data-validate` |
| 4 | UI 페이지 업그레이드 | `/ai-dlc-nxt-page-gen` · `/ai-dlc-fe-component-gen` · `/ai-dlc-screen-validate` |
| 5 | 실기 연습 섹션 (신규) | `/ai-dlc-fe-impl-plan` · `/ai-dlc-nxt-page-gen` · `/ai-dlc-fe-state-guide` · `/ai-dlc-fe-zod-guide` |
| 6 | 통합 검증 & 납품 | `/ai-dlc-fe-lint-check` · `/ai-dlc-nxt-code-review` · `/ai-dlc-code-traceability` · `/ai-dlc-delivery-checklist` |

---

## 스킬 호출 시 컨텍스트 전달 규칙

어떤 ai-dlc 스킬을 호출하든 아래 컨텍스트를 함께 전달하라.  
이 파일들이 없으면 스킬이 프로젝트 구조를 파악하지 못한다.

```
@CLAUDE.md
@docs/harness/ARCHITECTURE.md
@docs/harness/RULES.md
@요구사항정의서_DAP_Master_20260603.md
@[수정 대상 파일]
```

---

## 세부 Phase 흐름

### Phase 1 완료 기준 (이미 완료 ✅)
- 요구사항 정의서 존재
- CLAUDE.md에 6과목 구조 반영
- `docs/harness/` 5개 문서 완성

### Phase 2 — 타입 & 코어 인프라 (현재 진행 중 🔄)
```
/ai-dlc-class-design @CLAUDE.md @docs/harness/ARCHITECTURE.md @types/index.ts
→ types/index.ts: part 1|2|3|4|5|6, ExamResult에 part5Score·part6Score 추가

/ai-dlc-nxt-impl-plan @CLAUDE.md @docs/harness/PRD.md
→ lib/chapters.ts 21개, lib/questions.ts 6과목 배분, progress.ts 키 마이그레이션

/ai-dlc-fe-ts-check
→ npm run type-check 오류 0건 확인
```

### Phase 3 — 콘텐츠 데이터
```
/ai-dlc-data-design @CLAUDE.md @data/theory/part1_ch1.md
→ part5·6 이론 MD 7개 초안 생성 (DAP 공식 출제기준 기반)

/ai-dlc-data-design @CLAUDE.md @data/questions/part1_ch1.json
→ part5·6 문제 JSON 7개 초안 (각 15문항 이상, p[5-6]c[1-4]_{3자리} ID)

/ai-dlc-data-validate
→ scripts/validate-questions.ts 통과 확인
```

### Phase 4 — UI 업그레이드
```
/ai-dlc-nxt-page-gen @CLAUDE.md @docs/harness/ARCHITECTURE.md @pages/theory/index.tsx
→ 6과목 그리드 렌더링

/ai-dlc-nxt-page-gen @CLAUDE.md @docs/harness/ARCHITECTURE.md @pages/quiz/exam.tsx
→ ExamTimer 14400초, 75문항 배분

/ai-dlc-nxt-page-gen @CLAUDE.md @docs/harness/ARCHITECTURE.md @pages/quiz/result.tsx
→ 6과목별 점수 + 실기 40점 안내
```

### Phase 5 — 실기 섹션
```
/ai-dlc-fe-impl-plan @CLAUDE.md @docs/harness/ARCHITECTURE.md
→ lib/practical.ts, pages/practical/*, components/practical/* 구현 계획

/ai-dlc-nxt-page-gen @CLAUDE.md @docs/harness/ARCHITECTURE.md
→ pages/practical/index.tsx, pages/practical/[practiceId].tsx 생성

/ai-dlc-fe-component-gen @CLAUDE.md @docs/harness/ARCHITECTURE.md
→ AnswerTextEditor, ModelImageUpload, ScoringGuide 생성
```

### Phase 6 — 최종 검증
```
/ai-dlc-fe-ts-check          # tsc --noEmit 0 errors
/ai-dlc-fe-lint-check        # ESLint 0 errors
/ai-dlc-nxt-code-review      # Next.js 코드 품질 리뷰
/ai-dlc-code-traceability    # FR-001~024 요구사항 추적
/ai-dlc-delivery-checklist   # 납품 전 최종 체크리스트
```

---

## 진행 상태 체크 자동화

개발 작업 후 매번 실행해 다음 단계를 파악한다:

```
node .claude/skills/ai-dlc-guide/progress.mjs --next
```

출력 예:
```
  ▶ 다음 작업: types/index.ts — part: 1|2|3|4|5|6
  ▶ 다음 스킬: /ai-dlc-class-design
               types/index.ts 타입 확장 설계 시
```

---

## Gotchas

**Phase 6은 느리다.**  
`npm run build`까지 실행하므로 약 60초 소요. `--phase 1`~`--phase 5`로 먼저 확인하고 Phase 6은 최종 단계에서만 실행.

**type-check가 느린 이유.**  
Phase 2 check에서 `npx tsc --noEmit`을 실행하므로 약 10~15초 소요. 전체 스캔 시 이를 감안할 것.

**콘텐츠 체크는 파일 존재 여부만 확인.**  
`data/theory/part5_ch1.md`가 존재해도 내용이 비어 있으면 Phase 3 체크는 통과하지만 품질은 별도로 `/ai-dlc-data-validate`로 검증해야 함.

**progress.ts 경로 탐색.**  
`lib/progress.ts`와 `progress.ts` 두 경로를 모두 확인함. 실제 파일이 어디에 있든 동작.
