import fs from 'fs'
import path from 'path'

const QUESTIONS_DIR = path.join(process.cwd(), 'data', 'questions')
const ID_PATTERN = /^(p[1-6]c[1-4]_\d{3}|exam[12]_\d{3})$/

interface QuestionRaw {
  id: string
  part: number
  chapter: string
  content: string
  options: unknown[]
  answer: number
  explanation: string
  tags?: string[]
  difficulty?: string
}

function loadJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(dir, f))
}

function validateQuestion(q: QuestionRaw, filePath: string): string[] {
  const errors: string[] = []
  const file = path.relative(process.cwd(), filePath)

  if (!q.id || typeof q.id !== 'string') {
    errors.push(`[${file}] id 필드가 없거나 문자열이 아님`)
  } else if (!ID_PATTERN.test(q.id)) {
    errors.push(`[${file}] id 패턴 불일치: "${q.id}" (기대: p[1-6]c[1-4]_NNN 또는 exam[12]_NNN)`)
  }

  if (q.part === undefined || q.part < 1 || q.part > 6) {
    errors.push(`[${file}][${q.id}] part 범위 오류: ${q.part} (1~6 필요)`)
  }

  if (!Array.isArray(q.options) || q.options.length !== 4) {
    errors.push(`[${file}][${q.id}] options는 4개여야 함 (현재: ${Array.isArray(q.options) ? q.options.length : typeof q.options})`)
  }

  if (q.answer === undefined || q.answer < 0 || q.answer > 3) {
    errors.push(`[${file}][${q.id}] answer 범위 오류: ${q.answer} (0~3 필요)`)
  }

  if (!q.explanation || typeof q.explanation !== 'string') {
    errors.push(`[${file}][${q.id}] explanation 필드가 없음`)
  } else if (q.explanation.length < 50) {
    errors.push(`[${file}][${q.id}] explanation이 너무 짧음: ${q.explanation.length}자 (최소 50자)`)
  }

  return errors
}

function main() {
  const allErrors: string[] = []
  const allIds: string[] = []
  let totalFiles = 0
  let totalQuestions = 0

  // Main questions dir
  const mainFiles = loadJsonFiles(QUESTIONS_DIR)
  // Mockexam subdir
  const mockDir = path.join(QUESTIONS_DIR, 'mockexam')
  const mockFiles = loadJsonFiles(mockDir)

  const allFiles = [...mainFiles, ...mockFiles]

  if (allFiles.length === 0) {
    console.log('검증할 JSON 파일이 없습니다. (data/questions/ 디렉토리 확인)')
    process.exit(0)
  }

  for (const filePath of allFiles) {
    totalFiles++
    let data: QuestionRaw[]

    try {
      const raw = fs.readFileSync(filePath, 'utf-8')
      data = JSON.parse(raw)
    } catch (e) {
      allErrors.push(`[${path.relative(process.cwd(), filePath)}] JSON 파싱 오류: ${e}`)
      continue
    }

    if (!Array.isArray(data)) {
      allErrors.push(`[${path.relative(process.cwd(), filePath)}] 파일이 배열이 아님`)
      continue
    }

    for (const q of data) {
      totalQuestions++
      const errs = validateQuestion(q, filePath)
      allErrors.push(...errs)
      if (q.id) allIds.push(q.id)
    }
  }

  // Duplicate ID check
  const idSet = new Set<string>()
  const duplicates = new Set<string>()
  for (const id of allIds) {
    if (idSet.has(id)) duplicates.add(id)
    idSet.add(id)
  }

  if (duplicates.size > 0) {
    duplicates.forEach(dup => {
      allErrors.push(`중복 ID 발견: "${dup}"`)
    })
  }

  // Report
  console.log(`\n=== DAP Master 문제 데이터 검증 ===`)
  console.log(`파일: ${totalFiles}개, 문제: ${totalQuestions}개, 고유 ID: ${idSet.size}개`)

  if (allErrors.length === 0) {
    console.log(`\n✓ 모든 검증 통과!\n`)
    process.exit(0)
  } else {
    console.log(`\n오류 ${allErrors.length}건:`)
    for (const err of allErrors) {
      console.error(`  - ${err}`)
    }
    console.log()
    process.exit(1)
  }
}

main()
