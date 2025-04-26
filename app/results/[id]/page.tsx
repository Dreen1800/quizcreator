"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Share2 } from "lucide-react"
import type { Quiz } from "@/types/quiz"

type StatsType = Record<string, Record<string, number>>

export default function QuizResults({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [stats, setStats] = useState<StatsType | null>(null)
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const savedQuizzes = localStorage.getItem("quizzes")
    if (savedQuizzes) {
      const quizzes = JSON.parse(savedQuizzes)
      const existingQuiz = quizzes.find((q: Quiz) => q.id === params.id)
      if (existingQuiz) {
        setQuiz(existingQuiz)

        // Get stats
        const responseStats = localStorage.getItem(`quiz_stats_${params.id}`)
        if (responseStats) {
          setStats(JSON.parse(responseStats))
        }

        // Set share URL
        setShareUrl(`${window.location.origin}/share/${params.id}`)
      } else {
        router.push("/")
      }
    } else {
      router.push("/")
    }
  }, [params.id, router])

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getTotalResponses = (questionId: string) => {
    if (!stats || !stats[questionId]) return 0

    return Object.values(stats[questionId]).reduce((sum, count) => sum + count, 0)
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Resultados: {quiz.title || "Quiz sem título"}</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/editor/${quiz.id}`}>
              <Button variant="outline" className="border-gray-700">
                Editar Quiz
              </Button>
            </Link>
          </div>
        </div>

        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">Compartilhar Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input value={shareUrl} readOnly className="bg-gray-900 border-gray-700" />
              <Button onClick={copyShareLink} className="bg-emerald-500 hover:bg-emerald-600">
                <Share2 className="mr-2 h-4 w-4" />
                {copied ? "Copiado!" : "Copiar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Estatísticas de Respostas</h2>

          {quiz.questions.map((question) => {
            const totalResponses = getTotalResponses(question.id)

            return (
              <Card key={question.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">{question.text}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">Total de respostas: {totalResponses}</p>

                  {question.options.map((option) => {
                    const optionCount = stats && stats[question.id] ? stats[question.id][option.id] || 0 : 0
                    const percentage = totalResponses > 0 ? Math.round((optionCount / totalResponses) * 100) : 0

                    return (
                      <div key={option.id} className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{option.text}</span>
                          <span className="text-sm text-gray-400">
                            {optionCount} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
