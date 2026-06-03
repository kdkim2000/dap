# docs/ai-dlc — AI-DLC 산출물 아카이브

ai-dlc* 스킬로 생성되는 **모든 분석·설계 산출물**이 이 디렉터리에 저장된다.  
CLAUDE.md의 "AI-DLC 산출물 저장 필수 규칙"에 의해 강제 관리된다.

---

## 문서 목록

| 문서 | 생성 스킬 | 버전 | 작성일 |
|:---|:---|:---:|:---|
| [요구사항정의서_DAP_Master_20260603.md](요구사항정의서_DAP_Master_20260603.md) | `ai-dlc-requirements` | v0.1 | 2026-06-03 |
| [화면목록_DAP_Master_20260603.md](화면목록_DAP_Master_20260603.md) | `ai-dlc-screen-list` | v0.1 | 2026-06-03 |
| [비즈니스규칙_DAP_Master_20260603.md](비즈니스규칙_DAP_Master_20260603.md) | `ai-dlc-biz-rules-create` | v0.1 | 2026-06-03 |
| [유즈케이스_DAP_Master_20260603.md](유즈케이스_DAP_Master_20260603.md) | `ai-dlc-usecase-create` | v0.1 | 2026-06-03 |
| [클래스설계서_DAP_Master_20260603.md](클래스설계서_DAP_Master_20260603.md) | `ai-dlc-class-design` | v0.1 | 2026-06-03 |

---

## 산출물 흐름 (AI-DLC 프로세스)

```
분석 단계
  요구사항정의서 → 화면목록 → 유즈케이스 → 비즈니스규칙

설계 단계
  클래스설계서 → 시퀀스설계서 → API설계서 → 데이터설계서 → 구현계획서

구현 단계
  (코드 파일 — docs/ai-dlc 외부)

검증 단계
  코드리뷰보고서 → 추적성보고서 → 납품체크리스트
```

---

## 파일명 규칙

```
{문서유형}_{사업명}_{YYYYMMDD}.md
```

같은 날 재작성 시: `{문서유형}_{사업명}_{YYYYMMDD}_v2.md`
