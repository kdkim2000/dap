export type QuestionType = 'concept' | 'result' | 'completion' | 'error'

export interface Question {
  id: string            // "p1c1_001" 형식 (p{과목}c{챕터}_{3자리})
  part: 1 | 2 | 3 | 4
  chapter: string       // "part1_ch1" 등
  content: string
  options: string[]     // 4지선다
  answer: number        // 0-3
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
  lastVisited: { type: 'theory' | 'quiz'; id: string } | null
  examHistory: ExamResult[]
}

export interface ExamResult {
  date: string
  score: number
  part1Score: number
  part2Score: number
  part3Score: number
  part4Score: number
  totalTime: number
  answers: Record<string, number>
}

export interface ChapterMeta {
  id: string            // "part1_ch1"
  part: 1 | 2 | 3 | 4
  chapter: number       // 1 | 2 | 3
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
