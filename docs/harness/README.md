# DAP Master — 프로젝트 하네스

DAP 업그레이드 작업 전 이 문서들을 읽고 시작하라.

## 문서 목록

| 문서 | 목적 | 먼저 읽어야 할 때 |
|:---|:---|:---|
| [PRD.md](PRD.md) | 페이즈별 구현 계획, 합격 기준 계산 로직 | 작업 범위 파악 |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 시스템 설계, 데이터 흐름, 컴포넌트 구조 | 코드 작성 전 |
| [RULES.md](RULES.md) | TypeScript 타입, ID 형식, localStorage, SSG 제약 | 모든 코딩 작업 |
| [AGENTS.md](AGENTS.md) | Phase별 에이전트 역할, 병렬 실행 가능 작업 | 작업 분배 시 |
| [SKILLS.md](SKILLS.md) | ai-dlc 스킬 매핑, 스킬 선택 가이드 | 스킬 호출 전 |
| [MCP.md](MCP.md) | MCP 서버 설정, 배포 연동 | 배포 단계 |

## 시작 순서

```
1. PRD.md → 현재 Phase 확인
2. ARCHITECTURE.md → 설계 결정사항 숙지
3. RULES.md → 컨벤션 확인
4. SKILLS.md → 사용할 스킬 결정
5. AGENTS.md → 작업 할당
```

## 원천 문서

- 요구사항: `요구사항정의서_DAP_Master_20260603.md` (프로젝트 루트)
- 코드 가이드: `CLAUDE.md` (프로젝트 루트)
- DAP 시험 기준: KDATA 공식 — 76문항(필기 75+실기 1), 100점, 240분
