# Phase 2 — 타입 & 코어 인프라 업그레이드

> 상태: DRAFT  
> 작성: 2026-06-03 | 완료: —

## 목표

`types/index.ts`, `lib/chapters.ts`, `lib/questions.ts`, `lib/progress.ts`,
`context/ProgressContext.tsx`, `scripts/validate-questions.ts` 를 6과목 기준으로 확장하여
DAP 전환을 위한 코드 기반을 확립한다.

## 배경 & 인사이트

- 요구사항: DR-005(ExamResult 6과목), DR-006(ID 체계), CR-001(타입 안전성)
- 현재 `part: 1 | 2 | 3 | 4` — 5·6과목 추가 필요
- localStorage 키 `dasp_progress` → `dap_progress` 마이그레이션 필요
  (기존 키는 삭제하지 않고 유지 — 롤백 보험)
- Phase 1(요구사항·하네스)은 완료 상태이므로 이 플랜이 현재 최우선 작업
- `sampleExamQuestions`는 현재 4과목 기준 — 75문항(4과목 25, 나머지 10) 로직으로 교체 필요
- TypeScript 변경 → 연쇄 오류 → 타입 오류를 따라 파일 순서대로 수정

## 실행 단계

- [ ] 1. `types/index.ts` — `part: 1|2|3|4|5|6`, `ExamResult`에 `part5Score·part6Score` 추가
- [ ] 2. `lib/chapters.ts` — CHAPTERS 21개(5·6과목 7챕터 추가), PART_TITLES 6개
- [ ] 3. `lib/questions.ts` — `PART_QUOTA` 상수 추가, `sampleExamQuestions` 6과목 75문항 로직
- [ ] 4. `lib/progress.ts` — `loadProgress()` 최상단에 `dasp_progress → dap_progress` 마이그레이션
- [ ] 5. `context/ProgressContext.tsx` — `byPart` 통계를 6과목 지원으로 확장
- [ ] 6. `scripts/validate-questions.ts` — ID 정규식 `p[1-4]` → `p[1-6]` 수정
- [ ] 7. 검증: `npm run type-check` (오류 0건)
- [ ] 8. 검증: `npm run test` (13개 기존 테스트 통과)
- [ ] 9. `lib/chapters.test.ts` — 21개 챕터 테스트 케이스 추가

## 완료 기준

- `npm run type-check` 오류 0건
- `npm run test` 전체 통과
- `CHAPTERS.length === 21` 확인
- `sampleExamQuestions()` 반환 배열 길이 === 75
- `loadProgress()` 에서 `dasp_progress` → `dap_progress` 자동 마이그레이션 동작

## 메모

- Phase 2 완료 후 즉시 `node .claude/skills/ai-dlc-guide/progress.mjs` 실행하여 Phase 3 진입 확인
- 타입 변경 시 `quiz/result.tsx`의 `part1Score·part2Score·part3Score·part4Score` 참조가
  연쇄 오류를 일으킬 수 있음 — result.tsx는 Phase 4에서 수정하므로 임시 타입 캐스팅 허용
