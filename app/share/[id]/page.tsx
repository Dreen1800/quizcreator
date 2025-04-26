"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import type { Quiz, Question } from "@/types/quiz"

export default function QuizShare({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [isFinished, setIsFinished] = useState(false)
  const [answers, setAnswers] = useState<Array<{ questionId: string; optionId: string; optionText: string }>>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const savedQuizzes = localStorage.getItem("quizzes")
    if (savedQuizzes) {
      const quizzes = JSON.parse(savedQuizzes)
      const existingQuiz = quizzes.find((q: Quiz) => q.id === params.id)
      if (existingQuiz && existingQuiz.questions.length > 0) {
        setQuiz(existingQuiz)
        setCurrentQuestion(existingQuiz.questions[0])
        setProgress((1 / existingQuiz.questions.length) * 100)

        // Initialize or update response stats
        const responseStats = localStorage.getItem(`quiz_stats_${params.id}`)
        if (!responseStats) {
          const initialStats = existingQuiz.questions.reduce((acc: any, question) => {
            acc[question.id] = question.options.reduce((optAcc: any, opt) => {
              optAcc[opt.id] = 0
              return optAcc
            }, {})
            return acc
          }, {})
          localStorage.setItem(`quiz_stats_${params.id}`, JSON.stringify(initialStats))
        }
      } else {
        router.push("/")
      }
    } else {
      router.push("/")
    }
  }, [params.id, router])

  const handleOptionSelect = (optionId: string) => {
    if (!currentQuestion || !quiz) return

    // Save the answer
    const selectedOption = currentQuestion.options.find((opt) => opt.id === optionId)
    if (selectedOption) {
      // Update answers
      setAnswers((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          optionId: selectedOption.id,
          optionText: selectedOption.text,
        },
      ])

      // Update stats
      const responseStats = localStorage.getItem(`quiz_stats_${params.id}`)
      if (responseStats) {
        const stats = JSON.parse(responseStats)
        if (stats[currentQuestion.id] && stats[currentQuestion.id][optionId] !== undefined) {
          stats[currentQuestion.id][optionId]++
          localStorage.setItem(`quiz_stats_${params.id}`, JSON.stringify(stats))
        }
      }

      // Navigate to next question or finish
      if (selectedOption.nextQuestionId) {
        const nextQuestion = quiz.questions.find((q) => q.id === selectedOption.nextQuestionId)
        if (nextQuestion) {
          setCurrentQuestion(nextQuestion)
          // Update progress
          setProgress(((answers.length + 2) / quiz.questions.length) * 100)
        } else {
          setIsFinished(true)
        }
      } else {
        setIsFinished(true)
      }
    }
  }

  const handleBack = () => {
    if (answers.length > 0) {
      // Remove the last answer
      const newAnswers = [...answers]
      newAnswers.pop()
      setAnswers(newAnswers)

      // Go back to the previous question
      if (newAnswers.length > 0) {
        const lastAnswer = newAnswers[newAnswers.length - 1]
        const previousQuestion = quiz?.questions.find((q) => q.id === lastAnswer.questionId)
        if (previousQuestion) {
          setCurrentQuestion(previousQuestion)
          setProgress(((newAnswers.length + 1) / (quiz?.questions.length || 1)) * 100)
        }
      } else if (quiz?.questions.length) {
        // Go back to the first question
        setCurrentQuestion(quiz.questions[0])
        setProgress((1 / quiz.questions.length) * 100)
      }
    }
  }

  const restartQuiz = () => {
    if (quiz) {
      setCurrentQuestion(quiz.questions[0])
      setIsFinished(false)
      setAnswers([])
      setProgress((1 / quiz.questions.length) * 100)
    }
  }

  if (!quiz) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-white">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">{quiz.title || "Quiz sem título"}</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Header with progress */}
          <div className="mb-6">
            <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {answers.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleBack} className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}
          </div>

          {!isFinished && currentQuestion ? (
            <Card className="bg-gray-800 border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQuestion.options.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-4 px-6 border-gray-700 hover:bg-gray-700"
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    {option.text}
                  </Button>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800 border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Obrigado por participar!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center mb-4">Suas respostas foram registradas.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={restartQuiz} className="w-full bg-emerald-500 hover:bg-emerald-600">
                  Responder Novamente
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
