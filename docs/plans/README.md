# docs/plans — 플랜 아카이브

CLAUDE.md 규칙에 따라 Plan 모드에서 수립된 모든 계획이 여기에 기록된다.

## 파일 목록

| 파일 | 상태 | 내용 |
|:---|:---:|:---|
| [001_dap_phase2_type_upgrade.md](001_dap_phase2_type_upgrade.md) | DRAFT | types·chapters·questions·progress 6과목 확장 |

## 채번 규칙

- `001_` 부터 시작, 3자리 0패딩
- slug는 소문자 영문 + 언더스코어
- 새 플랜 생성 전 반드시 마지막 번호 확인:
  ```powershell
  Get-ChildItem docs\plans -Filter "*.md" | Sort-Object Name | Select-Object Name
  ```
