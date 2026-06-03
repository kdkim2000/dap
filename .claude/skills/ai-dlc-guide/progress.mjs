#!/usr/bin/env node
// progress.mjs — AI-DLC 개발 진행 상태 진단 드라이버
// Usage: node .claude/skills/ai-dlc-guide/progress.mjs [--phase N] [--next]

import { readFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../../..')   // E:\apps\dap

const args = process.argv.slice(2)
const phaseFilter = args.includes('--phase') ? parseInt(args[args.indexOf('--phase') + 1]) : null
const nextOnly = args.includes('--next')

// ── helpers ────────────────────────────────────────────────────────────────────
function exists(rel) { return existsSync(join(ROOT, rel)) }
function readText(rel) {
  try { return readFileSync(join(ROOT, rel), 'utf8') } catch { return '' }
}
function glob(dir, ext) {
  const full = join(ROOT, dir)
  if (!existsSync(full)) return []
  return readdirSync(full).filter(f => f.endsWith(ext))
}
function tryExec(cmd) {
  try { execSync(cmd, { cwd: ROOT, stdio: 'pipe' }); return true }
  catch { return false }
}
function section(title) { console.log(`\n${'─'.repeat(60)}\n  ${title}\n${'─'.repeat(60)}`) }
function pass(msg)  { console.log(`  ✓  ${msg}`) }
function fail(msg)  { console.log(`  ✗  ${msg}`) }
function warn(msg)  { console.log(`  ⚠  ${msg}`) }
function info(msg)  { console.log(`     ${msg}`) }
function next(skill, hint) { console.log(`\n  ▶ 다음 스킬: /${skill}`) ; if (hint) console.log(`     ${hint}`) }

// ── Phase 정의 ────────────────────────────────────────────────────────────────
const PHASES = [
  {
    num: 1, title: 'Phase 1 — 요구사항 & 설계 기반',
    checks: [
      { label: '요구사항 정의서 존재', ok: () => exists('요구사항정의서_DAP_Master_20260603.md') },
      { label: 'CLAUDE.md DAP 기준 (6과목)', ok: () => readText('CLAUDE.md').includes('6과목') },
      { label: 'docs/harness/PRD.md', ok: () => exists('docs/harness/PRD.md') },
      { label: 'docs/harness/ARCHITECTURE.md', ok: () => exists('docs/harness/ARCHITECTURE.md') },
      { label: 'docs/harness/RULES.md', ok: () => exists('docs/harness/RULES.md') },
    ],
    skills: [
      { skill: 'ai-dlc-requirements', when: '요구사항 정의서 작성/갱신 시' },
      { skill: 'ai-dlc-system-overview', when: '시스템 개요 문서 필요 시' },
      { skill: 'ai-dlc-screen-list', when: '화면 목록 정의 시' },
      { skill: 'ai-dlc-sequence-design', when: '핵심 사용자 흐름 시퀀스 설계 시' },
    ]
  },
  {
    num: 2, title: 'Phase 2 — 타입 & 코어 인프라',
    checks: [
      { label: 'types/index.ts — part: 1|2|3|4|5|6', ok: () => readText('types/index.ts').includes('5 | 6') || readText('types/index.ts').includes('5|6') },
      { label: 'types/index.ts — part5Score/part6Score', ok: () => readText('types/index.ts').includes('part5Score') },
      { label: 'lib/chapters.ts — 21개 챕터', ok: () => (readText('lib/chapters.ts').match(/part\d_ch\d/g) || []).length >= 21 },
      { label: 'lib/chapters.ts — PART_TITLES 6과목', ok: () => readText('lib/chapters.ts').includes("5:") && readText('lib/chapters.ts').includes("6:") },
      { label: 'lib/questions.ts — 6과목 배분 (PART_QUOTA)', ok: () => readText('lib/questions.ts').includes('5') && readText('lib/questions.ts').includes('6') && readText('lib/questions.ts').includes('25') },
      { label: 'progress.ts — dap_progress 키', ok: () => readText('lib/progress.ts').includes('dap_progress') || readText('progress.ts').includes('dap_progress') },
      { label: 'npm run type-check 통과', ok: () => tryExec('npx tsc --noEmit') },
    ],
    skills: [
      { skill: 'ai-dlc-class-design', when: 'types/index.ts 타입 확장 설계 시' },
      { skill: 'ai-dlc-class-revise', when: '타입 오류 수정 시' },
      { skill: 'ai-dlc-fe-ts-check', when: 'TypeScript 일괄 검사 시' },
      { skill: 'ai-dlc-nxt-impl-plan', when: 'Phase 2 구현 계획 수립 시' },
    ]
  },
  {
    num: 3, title: 'Phase 3 — 5·6과목 콘텐츠 데이터',
    checks: [
      { label: 'data/theory/part5_ch1.md', ok: () => exists('data/theory/part5_ch1.md') },
      { label: 'data/theory/part5_ch2.md', ok: () => exists('data/theory/part5_ch2.md') },
      { label: 'data/theory/part5_ch3.md', ok: () => exists('data/theory/part5_ch3.md') },
      { label: 'data/theory/part6_ch1.md', ok: () => exists('data/theory/part6_ch1.md') },
      { label: 'data/theory/part6_ch2.md', ok: () => exists('data/theory/part6_ch2.md') },
      { label: 'data/theory/part6_ch3.md', ok: () => exists('data/theory/part6_ch3.md') },
      { label: 'data/theory/part6_ch4.md', ok: () => exists('data/theory/part6_ch4.md') },
      { label: 'data/questions/part5_ch1.json', ok: () => exists('data/questions/part5_ch1.json') },
      { label: 'data/questions/part5_ch2.json', ok: () => exists('data/questions/part5_ch2.json') },
      { label: 'data/questions/part5_ch3.json', ok: () => exists('data/questions/part5_ch3.json') },
      { label: 'data/questions/part6_ch1.json', ok: () => exists('data/questions/part6_ch1.json') },
      { label: 'data/questions/part6_ch2.json', ok: () => exists('data/questions/part6_ch2.json') },
      { label: 'data/questions/part6_ch3.json', ok: () => exists('data/questions/part6_ch3.json') },
      { label: 'data/questions/part6_ch4.json', ok: () => exists('data/questions/part6_ch4.json') },
      { label: 'mockexam/exam1.json 75문항', ok: () => { try { const q = JSON.parse(readText('data/questions/mockexam/exam1.json')); return q.length === 75 } catch { return false } } },
      { label: 'mockexam/exam2.json 75문항', ok: () => { try { const q = JSON.parse(readText('data/questions/mockexam/exam2.json')); return q.length === 75 } catch { return false } } },
    ],
    skills: [
      { skill: 'ai-dlc-data-design', when: '이론 MD·문제 JSON 구조 설계 및 초안 생성 시' },
      { skill: 'ai-dlc-data-revise', when: '콘텐츠 수정·보완 시' },
      { skill: 'ai-dlc-data-validate', when: '문제 ID 형식·필드 검증 시' },
    ]
  },
  {
    num: 4, title: 'Phase 4 — UI 페이지 업그레이드 (6과목)',
    checks: [
      { label: 'pages/theory/index.tsx — 6과목 렌더', ok: () => { const t = readText('pages/theory/index.tsx'); return t.includes('5') && t.includes('6') && (t.includes('part5') || t.includes('PART_TITLES')) } },
      { label: 'pages/quiz/exam.tsx — 14400초 타이머', ok: () => readText('pages/quiz/exam.tsx').includes('14400') },
      { label: 'pages/quiz/result.tsx — 6과목 점수', ok: () => { const t = readText('pages/quiz/result.tsx'); return t.includes('part5') || t.includes('part6') || t.includes('5Score') } },
      { label: 'ExamTimer 240분 반영', ok: () => { const t = readText('components/quiz/ExamTimer.tsx'); return !t || t.includes('14400') || t.includes('240') } },
    ],
    skills: [
      { skill: 'ai-dlc-nxt-page-gen', when: '6과목 기준 페이지 수정·생성 시' },
      { skill: 'ai-dlc-fe-component-gen', when: 'UI 컴포넌트 생성 시' },
      { skill: 'ai-dlc-fe-tailwind-guide', when: 'Tailwind 스타일 작업 시' },
      { skill: 'ai-dlc-screen-spec', when: '화면 상세 명세 필요 시' },
      { skill: 'ai-dlc-screen-validate', when: '화면 구현 완료 검증 시' },
    ]
  },
  {
    num: 5, title: 'Phase 5 — 실기 연습 섹션 (신규)',
    checks: [
      { label: 'lib/practical.ts', ok: () => exists('lib/practical.ts') },
      { label: 'pages/practical/index.tsx', ok: () => exists('pages/practical/index.tsx') },
      { label: 'pages/practical/[practiceId].tsx', ok: () => exists('pages/practical/[practiceId].tsx') },
      { label: 'components/practical/ 디렉터리', ok: () => exists('components/practical') },
      { label: 'data/practical/ 최소 1개 JSON', ok: () => glob('data/practical', '.json').length > 0 },
      { label: 'data/practical/ 최소 5개 JSON', ok: () => glob('data/practical', '.json').length >= 5 },
    ],
    skills: [
      { skill: 'ai-dlc-fe-impl-plan', when: '실기 섹션 구현 계획 수립 시' },
      { skill: 'ai-dlc-nxt-page-gen', when: 'practical 페이지 생성 시' },
      { skill: 'ai-dlc-fe-component-gen', when: 'ModelImageUpload·ScoringGuide 등 컴포넌트 생성 시' },
      { skill: 'ai-dlc-fe-state-guide', when: 'localStorage 실기 답안 임시 저장 설계 시' },
      { skill: 'ai-dlc-fe-zod-guide', when: 'PracticalProblem JSON 스키마 검증 시' },
    ]
  },
  {
    num: 6, title: 'Phase 6 — 통합 검증 & 납품',
    checks: [
      { label: 'npm run type-check 통과', ok: () => tryExec('npx tsc --noEmit') },
      { label: 'npm run test 통과', ok: () => tryExec('npx vitest run') },
      { label: 'npm run lint 통과', ok: () => tryExec('npx next lint') },
      { label: 'npm run build 성공', ok: () => tryExec('npx next build') },
    ],
    skills: [
      { skill: 'ai-dlc-fe-ts-check', when: 'TypeScript 전체 검사 시' },
      { skill: 'ai-dlc-fe-lint-check', when: 'ESLint 검사 시' },
      { skill: 'ai-dlc-nxt-code-review', when: 'Next.js 코드 리뷰 시' },
      { skill: 'ai-dlc-code-complexity', when: '복잡도·품질 점검 시' },
      { skill: 'ai-dlc-code-traceability', when: '요구사항 추적성 확인 시' },
      { skill: 'ai-dlc-delivery-checklist', when: '납품 전 체크리스트 확인 시' },
      { skill: 'ai-dlc-consistency-check', when: '문서·코드 일관성 최종 검증 시' },
    ]
  }
]

// ── 실행 ────────────────────────────────────────────────────────────────────────
console.log('\n╔══════════════════════════════════════════════════════════════╗')
console.log('║         AI-DLC 개발 진행 상태 — DAP Master                  ║')
console.log('╚══════════════════════════════════════════════════════════════╝')

const phases = phaseFilter ? PHASES.filter(p => p.num === phaseFilter) : PHASES

let firstIncomplete = null

for (const phase of phases) {
  section(`${phase.title}`)

  const results = phase.checks.map(c => ({ ...c, result: c.ok() }))
  const passed  = results.filter(r => r.result).length
  const total   = results.length
  const done    = passed === total

  results.forEach(r => r.result ? pass(r.label) : fail(r.label))
  console.log(`\n  진행률: ${passed}/${total} ${done ? '✅ 완료' : '🔄 진행 중'}`)

  if (!done && !firstIncomplete) firstIncomplete = phase

  if (!nextOnly) {
    console.log('\n  [사용 가능한 스킬]')
    phase.skills.forEach(s => info(`/${s.skill}  ←  ${s.when}`))
  }
}

// ── 전체 요약 & 다음 단계 ────────────────────────────────────────────────────
section('전체 요약')

const totalChecks  = PHASES.flatMap(p => p.checks).length
const passedChecks = PHASES.flatMap(p => p.checks).filter(c => c.ok()).length
console.log(`  전체 진행률: ${passedChecks}/${totalChecks} 항목 완료`)
console.log(`  현재 Phase: ${firstIncomplete ? firstIncomplete.num : PHASES.length} / ${PHASES.length}`)

if (firstIncomplete) {
  const firstFail = firstIncomplete.checks.find(c => !c.ok())
  const suggestSkill = firstIncomplete.skills[0]
  console.log(`\n  ▶ 다음 작업: ${firstFail?.label}`)
  if (suggestSkill) {
    next(suggestSkill.skill, suggestSkill.when)
    console.log(`\n  참고 컨텍스트:`)
    info('@CLAUDE.md @docs/harness/ARCHITECTURE.md @docs/harness/RULES.md')
    info(`@요구사항정의서_DAP_Master_20260603.md`)
  }
} else {
  console.log('\n  🎉 모든 Phase 완료! 납품 준비 상태입니다.')
  next('ai-dlc-delivery-checklist', '최종 납품 체크리스트 확인')
}

console.log('')
