# SKILLS — ai-dlc 스킬 활용 가이드

---

## Phase별 스킬 매핑

### Phase 1 — 코어 인프라

| 작업 | 스킬 | 명령 예시 |
|:---|:---|:---|
| TypeScript 타입 설계·확장 | `ai-dlc-class-design` | `/ai-dlc-class-design types/index.ts 6과목 기준으로 확장` |
| 구현 계획 수립 | `ai-dlc-nxt-impl-plan` | `/ai-dlc-nxt-impl-plan Phase 1 코어 인프라 업그레이드` |
| TypeScript 검사 | `ai-dlc-fe-ts-check` | `/ai-dlc-fe-ts-check` |

### Phase 2 — 콘텐츠 생성

| 작업 | 스킬 | 명령 예시 |
|:---|:---|:---|
| 이론 MD 구조 설계 | `ai-dlc-data-design` | `/ai-dlc-data-design 5과목 데이터베이스 설계와 이용 이론 콘텐츠` |
| 문제 JSON 생성 | `ai-dlc-data-design` | `/ai-dlc-data-design part5_ch1.json 문제 15문항 생성` |
| SQL 실기 문제 | `ai-dlc-sb-sql-gen` | `/ai-dlc-sb-sql-gen` (DB 설계 관련) |
| 데이터 모델 분석 | `ai-dlc-data-model-analysis` | `/ai-dlc-data-model-analysis` |

### Phase 3 — UI 페이지 수정

| 작업 | 스킬 | 명령 예시 |
|:---|:---|:---|
| Next.js 페이지 생성·수정 | `ai-dlc-nxt-page-gen` | `/ai-dlc-nxt-page-gen theory/index.tsx 6과목 그리드` |
| 구현 계획 | `ai-dlc-nxt-impl-plan` | `/ai-dlc-nxt-impl-plan Phase 3 UI 업그레이드` |
| 코드 검토 | `ai-dlc-nxt-code-review` | `/ai-dlc-nxt-code-review` |

### Phase 4 — 실기 섹션 신규 구현

| 작업 | 스킬 | 명령 예시 |
|:---|:---|:---|
| 실기 페이지 생성 | `ai-dlc-nxt-page-gen` | `/ai-dlc-nxt-page-gen practical/index.tsx` |
| 실기 컴포넌트 생성 | `ai-dlc-fe-component-gen` | `/ai-dlc-fe-component-gen ModelImageUpload` |
| 상태 관리 설계 | `ai-dlc-fe-state-guide` | `/ai-dlc-fe-state-guide 실기 답안 임시 저장` |
| Tailwind UI | `ai-dlc-fe-tailwind-guide` | `/ai-dlc-fe-tailwind-guide` |
| Zod 스키마 (실기 JSON 검증) | `ai-dlc-fe-zod-guide` | `/ai-dlc-fe-zod-guide PracticalProblem 스키마` |
| 구현 계획 | `ai-dlc-fe-impl-plan` | `/ai-dlc-fe-impl-plan 실기 연습 섹션` |

### Phase 5 — 검증

| 작업 | 스킬 | 명령 예시 |
|:---|:---|:---|
| TypeScript 검사 | `ai-dlc-fe-ts-check` | `/ai-dlc-fe-ts-check` |
| Lint 검사 | `ai-dlc-fe-lint-check` | `/ai-dlc-fe-lint-check` |
| 코드 품질 | `ai-dlc-code-complexity` | `/ai-dlc-code-complexity` |
| Next.js 코드 리뷰 | `ai-dlc-nxt-code-review` | `/ai-dlc-nxt-code-review` |
| 단위 테스트 생성 | `ai-dlc-sb-unit-test-gen` | `/ai-dlc-sb-unit-test-gen lib/practical.ts` |

---

## 스킬 사용 순서 원칙

1. **설계 먼저**: `ai-dlc-class-design` / `ai-dlc-data-design` → 구조 확정
2. **구현**: `ai-dlc-nxt-page-gen` / `ai-dlc-fe-component-gen`
3. **검토**: `ai-dlc-nxt-code-review` / `ai-dlc-fe-ts-check` / `ai-dlc-fe-lint-check`
4. **수정**: `ai-dlc-nxt-code-revise` / `ai-dlc-fe-code-revise`

---

## 스킬 선택 가이드 (헷갈릴 때)

| 상황 | 선택 스킬 |
|:---|:---|
| TypeScript 인터페이스·타입 변경 | `ai-dlc-class-design` |
| Next.js 페이지 신규 생성 | `ai-dlc-nxt-page-gen` |
| React 컴포넌트 신규 생성 | `ai-dlc-fe-component-gen` |
| JSON 데이터 구조 설계 | `ai-dlc-data-design` |
| localStorage 상태 관리 패턴 | `ai-dlc-fe-state-guide` |
| 빌드 에러·타입 오류 수정 | `ai-dlc-nxt-code-revise` |
| Tailwind CSS 스타일링 | `ai-dlc-fe-tailwind-guide` |
| 이론 콘텐츠 마크다운 작성 | `ai-dlc-data-design` (구조) + 직접 작성 |
| 구현 순서·의존성 정리 | `ai-dlc-nxt-impl-plan` |

---

## 스킬 입력 컨텍스트 전달 템플릿

스킬 호출 시 아래 컨텍스트를 함께 전달하면 품질이 높아진다.

```
@CLAUDE.md                    # 프로젝트 전체 구조
@docs/harness/ARCHITECTURE.md # 설계 결정사항
@docs/harness/RULES.md        # 규칙·컨벤션
@[대상 파일]                  # 수정할 파일
```
