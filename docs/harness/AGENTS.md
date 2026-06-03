# AGENTS — DAP Master 에이전트 역할 정의

---

## 에이전트 개요

DAP Master 업그레이드 작업은 **5개 Phase**로 분리되어 있으며, Phase별로 전문화된 에이전트(또는 ai-dlc 스킬)를 활용한다.

---

## Phase별 에이전트 역할

### Phase 1 — 코어 인프라 에이전트 (TypeScript 전문)

**역할**: 타입·lib 파일을 6과목 기준으로 안전하게 확장  
**입력**: `types/index.ts`, `lib/chapters.ts`, `lib/questions.ts`, `progress.ts`, `context/ProgressContext.tsx`, `scripts/validate-questions.ts`  
**출력**: 수정된 파일들 (TypeScript 오류 0건)  
**사용 스킬**: `ai-dlc-class-design`, `ai-dlc-nxt-impl-plan`  
**검증 명령어**: `npm run type-check && npm run test`

```
[에이전트 지시 예시]
"types/index.ts의 part 타입을 1|2|3|4|5|6으로 확장하고,
ExamResult에 part5Score, part6Score 필드를 추가하라.
변경 후 TypeScript 연쇄 오류를 모두 추적해 수정하라."
```

---

### Phase 2A — 이론 콘텐츠 에이전트 (콘텐츠 생성)

**역할**: 5·6과목 이론 마크다운 파일(7개) AI 초안 생성  
**입력**: DAP 공식 출제기준(CLAUDE.md 참조), 기존 이론 파일 참고 양식  
**출력**: `data/theory/part5_ch{1-3}.md`, `data/theory/part6_ch{1-4}.md`  
**사용 스킬**: `ai-dlc-data-design`  
**체크포인트**: 챕터별 주요항목·세부항목이 모두 포함되었는지 검토 필요

```
5과목 챕터별 출제항목:
  ch1(데이터베이스 설계): 저장공간·무결성·인덱스·분산·보안 설계
  ch2(데이터베이스 이용): DBMS·데이터 액세스·트랜잭션·백업/복구
  ch3(성능 개선): 성능 개선 방법론·조인·애플리케이션·서버 성능

6과목 챕터별 출제항목:
  ch1(데이터 이해): 품질 관리 프레임워크·표준/모델/관리/업무 데이터
  ch2(데이터 구조 이해): 개념/논리/물리 데이터 모델·데이터베이스·사용자 뷰
  ch3(관리 프로세스 이해): 관리 정책·표준/요구/모델/흐름/DB/활용 관리
  ch4(품질 관리 관점): 표준/모델/값/활용 관점 품질관리 프로세스
```

---

### Phase 2B — 문제 생성 에이전트 (콘텐츠 생성)

**역할**: 5·6과목 필기 문제 JSON(7개) + 모의고사 JSON(2개) 재구성  
**입력**: 각 챕터 이론 MD(Phase 2A 산출물), ID 채번 규칙  
**출력**: `data/questions/part5_ch{1-3}.json`, `data/questions/part6_ch{1-4}.json`, `data/questions/mockexam/exam{1,2}.json`  
**사용 스킬**: `ai-dlc-data-design`  
**검증 명령어**: `ts-node scripts/validate-questions.ts`

```
문항 수 기준:
  챕터별: 최소 15문항 이상 (부족 시 단원 풀이에서 부족 표시됨)
  모의고사: 75문항 (1·2·3·5·6과목 각 10문항, 4과목 25문항)
  난이도 비율: 하 20% / 중 55% / 상 25%
```

---

### Phase 2C — 실기 문제 에이전트 (콘텐츠 생성)

**역할**: 실기 연습 JSON 파일(최소 5건) 초안 생성  
**입력**: DAP 실기 출제 방향(CLAUDE.md 실기 섹션), `data/practical/` 스키마  
**출력**: `data/practical/prac_001~005.json`  
**분배**: 논리모델 유형1 × 2, 유형2 × 1, 표준화 엔터티 × 1, 데이터표준 × 1

---

### Phase 3 — UI 업그레이드 에이전트 (프론트엔드)

**역할**: 기존 4과목 UI 페이지를 6과목 기준으로 수정  
**입력**: `pages/theory/index.tsx`, `pages/quiz/exam.tsx`, `pages/quiz/result.tsx`  
**사용 스킬**: `ai-dlc-nxt-page-gen`, `ai-dlc-fe-component-gen`  
**검증**: `npm run dev` 실행 후 브라우저에서 6과목 그리드·타이머·결과 화면 확인

---

### Phase 4 — 실기 섹션 에이전트 (프론트엔드, 신규)

**역할**: `/practical` 페이지 및 컴포넌트 전체 신규 구현  
**입력**: `docs/harness/ARCHITECTURE.md` (실기 레이아웃 섹션), `data/practical/*.json`  
**출력**: `pages/practical/`, `components/practical/`, `lib/practical.ts`  
**사용 스킬**: `ai-dlc-nxt-page-gen`, `ai-dlc-fe-component-gen`

```
구현 순서:
1. lib/practical.ts (데이터 로딩 함수)
2. pages/practical/index.tsx (목록)
3. components/practical/* (레이아웃·에디터·이미지업로드·채점가이드)
4. pages/practical/[practiceId].tsx (상세)
```

---

### Phase 5 — 검증 에이전트 (QA)

**역할**: 전체 빌드·타입·테스트 검증  
**사용 스킬**: `ai-dlc-nxt-code-review`, `ai-dlc-fe-lint-check`, `ai-dlc-fe-ts-check`

```bash
# 검증 체크리스트 (순서대로)
npm run type-check          # 타입 오류 0건
npm run test                # Vitest 전체 통과
ts-node scripts/validate-questions.ts  # ID 정합성
npm run lint                # ESLint 오류 0건
npm run build               # SSG 빌드 성공 (21+practical 경로 생성 확인)
```

---

## 병렬 실행 가능 작업

```
Phase 1 완료 후:
  ┌── Phase 2A (이론 MD 생성)  ── 독립
  ├── Phase 2B (문제 JSON 생성) ── Phase 2A 완료 후 시작 권장
  └── Phase 2C (실기 JSON 생성) ── 독립
  
Phase 2A 완료 후:
  ┌── Phase 3 (기존 UI 수정)    ── 독립
  └── Phase 4 (실기 UI 신규)    ── Phase 2C 완료 후 시작 권장
```

---

## 에이전트 간 인터페이스

| 산출물 | 소비 에이전트 | 인터페이스 포맷 |
|:---|:---|:---|
| `types/index.ts` | Phase 3·4 에이전트 | TypeScript `export interface` |
| `lib/chapters.ts` | Phase 3·4·5 에이전트 | `CHAPTERS`, `PART_TITLES` export |
| `data/theory/*.md` | Phase 3 에이전트 | `getStaticProps` 경유 |
| `data/questions/*.json` | Phase 3·5 에이전트 | `require()` dynamic import |
| `data/practical/*.json` | Phase 4 에이전트 | `lib/practical.ts` 경유 |
