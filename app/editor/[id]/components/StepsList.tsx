"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Quiz } from "@/types/quiz"

interface StepsListProps {
  quiz: Quiz
  selectedStepId: string | null
  setSelectedStepId: (id: string) => void
  setSelectedComponentId: (id: string | null) => void
  addStep: () => void
}

export default function StepsList({ 
  quiz, 
  selectedStepId, 
  setSelectedStepId, 
  setSelectedComponentId, 
  addStep 
}: StepsListProps) {
  return (
    <div className="w-64 flex flex-col border-r border-gray-800">
      <div className="flex-shrink-0 border-b border-gray-800 p-2">
        <div className="flex items-center justify-between mb-2 px-2">
          <h3 className="text-sm font-medium text-gray-400">Etapas</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={addStep} 
            className="h-7 px-2 text-emerald-500 hover:text-emerald-400"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {quiz.steps.map((step, index) => (
            <Button
              key={step.id}
              variant={selectedStepId === step.id ? "secondary" : "ghost"}
              className="w-full justify-start text-sm"
              onClick={() => {
                setSelectedStepId(step.id)
                setSelectedComponentId(null)
              }}
            >
              {step.name || `Etapa ${index + 1}`}
            </Button>
          ))}
          {quiz.steps.length === 0 && (
            <p className="text-xs text-gray-500 px-2 py-4 text-center">
              Clique em 'Adicionar' para criar sua primeira etapa.
            </p>
          )}
        </div>
      </div>

      {/* Sidebar info section */}
      <div className="flex-grow p-4 text-sm text-gray-400">
        <h3 className="font-medium mb-2">Instruções</h3>
        <p className="text-gray-500 mb-4">
          Selecione uma etapa para editar seu conteúdo. Use o botão "Adicionar Componente" para incluir elementos na sua etapa.
        </p>

        <h4 className="font-medium mt-4 mb-1">Componentes disponíveis:</h4>
        <ul className="list-disc pl-5 text-xs space-y-1 text-gray-500">
          <li>Botões de ação</li>
          <li>Campos de entrada</li>
          <li>Imagens</li>
          <li>Seleção de opções</li>
          <li>E muito mais!</li>
        </ul>
      </div>
    </div>
  )
}