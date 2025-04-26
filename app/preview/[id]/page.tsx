"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Edit, ImageIcon } from "lucide-react"
import type { Quiz, Step, Component, ButtonComponent, InputComponent, ImageComponent, OptionsComponent } from "@/types/quiz"

// --- Action Type --- 
type StepNavigationAction =
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'goTo', stepId: string }
  | { type: 'finish' };

// --- Interactive Component Renderers ---

function InteractiveButton({ component, onAction }: { component: ButtonComponent, onAction: (action: StepNavigationAction) => void }) {
  const handleClick = () => {
    if (component.action === 'nextStep') {
      onAction({ type: 'next' });
    } else if (component.action === 'submit') {
      onAction({ type: 'finish' });
    } else if (typeof component.action === 'object' && component.action.goToStep) {
      onAction({ type: 'goTo', stepId: component.action.goToStep });
    }
  };
  return (
    <Button
      onClick={handleClick}
      className="bg-emerald-500 hover:bg-emerald-600 w-full sm:w-auto" // Make buttons wider on mobile
    >
      {component.text}
    </Button>
  );
}

function InteractiveInput({ component }: { component: InputComponent }) {
  // For preview, input might just display or collect data later
  // For now, just render it read-only as we don't have answer collection yet
  return (
    <div className="w-full">
      <Label className="text-sm mb-1 block">{component.label}</Label>
      <Input
        type={component.inputType}
        placeholder={component.placeholder}
        readOnly
        className="bg-gray-700"
      // TODO: Add state management for input value if needed for answer collection
      />
    </div>
  );
}

function InteractiveImage({ component }: { component: ImageComponent }) {
  // Same as display version for now
  return (
    <div className="w-full flex justify-center">
      {component.src ? (
        <img src={component.src} alt={component.alt || 'Quiz Image'} className="max-w-full h-auto rounded-md max-h-80 object-contain" />
      ) : (
        <div className="w-full h-32 bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
          <ImageIcon className="h-8 w-8 mr-2" /> Imagem não configurada
        </div>
      )}
    </div>
  );
}

function InteractiveOptions({ component, onAction }: { component: OptionsComponent, onAction: (action: StepNavigationAction) => void }) {
  const handleSelect = (nextStepId: string | null) => {
    if (nextStepId) {
      onAction({ type: 'goTo', stepId: nextStepId });
    } else {
      onAction({ type: 'finish' });
    }
  };
  return (
    <div className="w-full">
      <p className="mb-4 font-medium text-center text-lg">{component.text}</p>
      <div className="space-y-3">
        {component.options.map(option => (
          <Button
            key={option.id}
            variant="outline"
            className="w-full justify-center text-center h-auto py-3 px-5 border-gray-600 hover:bg-gray-700 hover:border-emerald-500"
            onClick={() => handleSelect(option.nextStepId)}
          >
            {option.text || "Opção sem texto"}
          </Button>
        ))}
      </div>
    </div>
  );
}

// --- Main Preview Component ---
export default function QuizPreview({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentStepId, setCurrentStepId] = useState<string | null>(null)
  const [visitedStepIds, setVisitedStepIds] = useState<string[]>([]) // History for back button
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    const savedQuizzes = localStorage.getItem("quizzes")
    if (savedQuizzes) {
      const quizzes: Quiz[] = JSON.parse(savedQuizzes)
      const existingQuiz = quizzes.find((q) => q.id === params.id)
      if (existingQuiz && existingQuiz.steps && existingQuiz.steps.length > 0) {
        setQuiz(existingQuiz)
        const firstStepId = existingQuiz.steps[0].id
        setCurrentStepId(firstStepId)
        setVisitedStepIds([firstStepId]) // Start history
        setIsFinished(false)
      } else {
        console.error("Preview: Quiz not found or has no steps.")
        router.push("/")
      }
    } else {
      console.error("Preview: No quizzes found.")
      router.push("/")
    }
  }, [params.id, router])

  const handleNavigation = useCallback((action: StepNavigationAction) => {
    if (!quiz || !currentStepId) return

    let nextStepId: string | null = null

    switch (action.type) {
      case 'next':
        const currentStepIndex = quiz.steps.findIndex(step => step.id === currentStepId)
        if (currentStepIndex !== -1 && currentStepIndex < quiz.steps.length - 1) {
          nextStepId = quiz.steps[currentStepIndex + 1].id
        }
        break
      case 'goTo':
        if (quiz.steps.some(step => step.id === action.stepId)) {
          nextStepId = action.stepId
        } else {
          console.warn(`Navigation Error: Step ID "${action.stepId}" not found.`)
          setIsFinished(true)
          return
        }
        break
      case 'back':
        if (visitedStepIds.length > 1) {
          const newHistory = visitedStepIds.slice(0, -1) // Remove current step
          nextStepId = newHistory[newHistory.length - 1]
          setVisitedStepIds(newHistory) // Update history state
        } else {
          console.log("Already at the beginning.") // Cannot go back further
          return // Stay on the current step
        }
        break
      case 'finish':
        setIsFinished(true)
        return // Don't change step ID
    }

    if (nextStepId) {
      setCurrentStepId(nextStepId)
      if (action.type !== 'back' && !visitedStepIds.includes(nextStepId)) {
        setVisitedStepIds(prev => [...prev, nextStepId!])
      }
    } else if (action.type !== 'back' && action.type !== 'finish') {
      setIsFinished(true)
    }
  }, [quiz, currentStepId, visitedStepIds])

  const currentStepData = quiz?.steps.find(step => step.id === currentStepId) || null
  const progress = quiz && currentStepId ? ((visitedStepIds.length) / quiz.steps.length) * 100 : 0 // Progress based on visited steps

  const renderInteractiveComponent = (component: Component) => {
    switch (component.type) {
      case "Button": return <InteractiveButton component={component as ButtonComponent} onAction={handleNavigation} />
      case "Input": return <InteractiveInput component={component as InputComponent} />
      case "Image": return <InteractiveImage component={component as ImageComponent} />
      case "Options": return <InteractiveOptions component={component as OptionsComponent} onAction={handleNavigation} />
      default:
        return (
          <div className="text-sm text-center text-gray-500 py-3 my-2 bg-gray-800/50 rounded-md">
            (Componente: {component.type} - sem interação)
          </div>
        )
    }
  }

  if (!quiz || !currentStepData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-white">
        <p>Carregando Quiz...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="border-b border-gray-800 py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" aria-label="Voltar para Lista">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold truncate" title={quiz.title}>{quiz.title || "Quiz sem título"}</h1>
          </div>
          <Link href={`/editor/${quiz.id}`}>
            <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800">
              <Edit className="mr-1.5 h-4 w-4" /> Editar
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex justify-center items-start">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            {currentStepData.showLogo && (
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center"><ImageIcon className="h-6 w-6 text-gray-400" /></div>
              </div>
            )}
            {currentStepData.showProgress && (
              <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
                <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            )}
            <div className="h-8">
              {currentStepData.allowReturn && visitedStepIds.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => handleNavigation({ type: 'back' })} className="text-gray-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
                </Button>
              )}
            </div>
          </div>

          {!isFinished && currentStepData ? (
            <Card className="bg-transparent border-none shadow-none">
              <CardContent className="pt-0 px-0 sm:px-6">
                <h2 className="text-2xl font-semibold mb-8 text-center">{currentStepData.title || "Etapa sem Título"}</h2>
                <div className="space-y-5 flex flex-col items-center">
                  {currentStepData.components.map(component => (
                    <div key={component.id} className="w-full max-w-md">
                      {renderInteractiveComponent(component)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800 border-gray-700 shadow-lg text-center">
              <CardHeader>
                <CardTitle className="text-2xl">Quiz Concluído!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-6">Você completou o quiz.</p>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button onClick={() => {
                  setQuiz(null)
                  useEffect(() => {
                    router.refresh()
                  }, [router])
                }} className="w-full bg-emerald-500 hover:bg-emerald-600">
                  Reiniciar Quiz
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-700">
                    Voltar para Início
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
