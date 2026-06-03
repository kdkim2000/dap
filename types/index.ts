export type QuestionType = 'concept' | 'result' | 'completion' | 'error'

export interface Question {
  id: string            // "p5c2_001" 형식 (p{과목}c{챕터}_{3자리})
  part: 1 | 2 | 3 | 4 | 5 | 6
  chapter: string       // "part5_ch2" 등
  content: string
  options: string[]     // 4지선다, 고정 4개
  answer: number        // 0-based index (0~3)
  explanation: string
  tags?: string[]
  difficulty?: '하' | '중' | '상'
  questionType?: QuestionType
}

export type AnswerResult = 'correct' | 'wrong' | 'skipped'

export type QuizMode = 'chapter' | 'exam' | 'wrong' | 'bookmarks'

export interface ProgressStore {
  answers: Record<string, AnswerResult>
  bookmarks: string[]
  lastVisited: { type: 'theory' | 'quiz' | 'practical'; id: string } | null
  examHistory: ExamResult[]
}

export interface ExamResult {
  date: string
  score: number
  part1Score: number
  part2Score: number
  part3Score: number
  part4Score: number
  part5Score: number
  part6Score: number
  totalTime: number
  answers: Record<string, number>
}

export interface ChapterMeta {
  id: string            // "part5_ch2"
  part: 1 | 2 | 3 | 4 | 5 | 6
  chapter: number
  title: string
  questionCount: number
}

export interface ExamSession {
  mode: 'random' | 'exam1' | 'exam2'
  questions: Question[]
  currentIndex: number
  answers: Record<number, { selectedIndex: number; result: AnswerResult }>
  examEndTime: number  // Unix ms when exam expires
}

export interface Stats {
  total: number
  attempted: number
  correct: number
  byChapter: Record<string, { total: number; correct: number; attempted: number }>
  byPart: Record<number, { total: number; correct: number; attempted: number }>
}

// ── 실기 관련 신규 타입 (CLS-007, CLS-008) ──────────────────────────────────
export type PracticalType    = 'logical_model' | 'standard_form'
export type PracticalSubtype = 'type1' | 'type2' | 'entity' | 'standard'
export type DataNotation     = 'barker' | 'ie'

export interface PracticalProblem {
  id: string              // "prac_001" (prac_\d{3} 형식)
  type: PracticalType
  subtype: PracticalSubtype
  title: string
  notation: DataNotation
  scenario: string        // 지문 (A4 2~3장 분량)
  requirements: string[]  // 요구사항 체크리스트
  sampleAnswer: string    // 모범답안 설명
  checkPoints: string[]   // 채점 포인트 (최소 3개)
}

export interface PracticalDraft {
  textAnswer: string        // 텍스트 서술 답안
  imageDataUrl: string | null  // base64 이미지 (리사이즈 후), max 2MB
  savedAt: number           // 저장 시각 Unix ms
}
