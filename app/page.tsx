"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import type { Quiz } from "@/types/quiz"

export default function HomePage() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])

  useEffect(() => {
    const savedQuizzes = localStorage.getItem("quizzes")
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes))
    }
  }, [])

  const createNewQuiz = () => {
    router.push("/editor/new")
  }

  const editQuiz = (id: string) => {
    router.push(`/editor/${id}`)
  }

  const deleteQuiz = (id: string) => {
    const updatedQuizzes = quizzes.filter((quiz) => quiz.id !== id)
    setQuizzes(updatedQuizzes)
    localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes))
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Construtor de Quiz Interativo</h1>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Meus Quizzes</h2>
          <Button onClick={createNewQuiz} className="bg-emerald-500 hover:bg-emerald-600">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Quiz
          </Button>
        </div>

        {quizzes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-700 p-12 text-center">
            <p className="mb-4 text-gray-400">Você ainda não criou nenhum quiz</p>
            <Button
              onClick={createNewQuiz}
              variant="outline"
              className="border-emerald-500 text-emerald-500 hover:bg-emerald-950"
            >
              Criar seu primeiro quiz
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle>{quiz.title || "Quiz sem título"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">
                    {quiz.steps.length} etapa{quiz.steps.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    Última atualização: {new Date(quiz.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-700 hover:bg-gray-800"
                      onClick={() => editQuiz(quiz.id)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-700 hover:bg-gray-800"
                      onClick={() => router.push(`/preview/${quiz.id}`)}
                    >
                      Visualizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-900 text-red-500 hover:bg-red-950"
                      onClick={() => deleteQuiz(quiz.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
