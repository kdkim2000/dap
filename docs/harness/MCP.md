# MCP — DAP Master MCP 설정

---

## 현재 MCP 구성

DAP Master는 **서버리스 정적 사이트**로, 외부 MCP 서버 연동이 불필요하다.

현재 Claude Code 세션에서 활성화된 MCP 서버:

| 서버 | 용도 | 사용 여부 |
|:---|:---|:---|
| `mcp__ide__*` | IDE 진단·코드 실행 | 개발 중 TypeScript 오류 확인 시 활용 |
| `mcp__claude_ai_Vercel__*` | Vercel 배포 | Phase 5 완료 후 배포 시 활용 |
| `mcp__mcp-server-cloud__*` | 클라우드 통계 | 해당 없음 |

---

## 개발 중 유용한 MCP 활용

### IDE 진단 (mcp__ide__getDiagnostics)

Phase 1 타입 확장 후 TypeScript 오류를 즉시 확인:

```
mcp__ide__getDiagnostics → TypeScript 오류 목록 반환
→ types/index.ts 수정 후 연쇄 오류 추적에 사용
```

### Vercel 배포 (Phase 5)

```
mcp__claude_ai_Vercel__authenticate → OAuth 인증
→ next build 산출물을 Vercel에 배포
→ 도메인 설정 후 최종 URL 확인
```

---

## MCP 없이 동작하는 작업 (대부분)

아래 작업은 MCP 없이 Claude Code 기본 도구(Read/Edit/Write/Bash)만으로 충분:

- 파일 읽기·수정·생성
- TypeScript 컴파일 (`npm run type-check`)
- 테스트 실행 (`npm run test`)
- 빌드 (`npm run build`)
- 문제 JSON 검증 (`ts-node scripts/validate-questions.ts`)

---

## 향후 MCP 추가 검토 (선택사항)

| MCP | 용도 | 조건 |
|:---|:---|:---|
| GitHub MCP | PR·이슈 관리 | Git 저장소 연결 시 |
| Vercel MCP | 자동 배포 파이프라인 | 운영 배포 단계 |
