"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import type { Quiz, Step, Component } from "@/types/quiz"
import ButtonPropertiesForm from "../forms/ButtonPropertiesForm"
import TextPropertiesForm from "../forms/TextPropertiesForm"
import ImagePropertiesForm from "../forms/ImagePropertiesForm"
import OptionsPropertiesForm from "../forms/OptionsPropertiesForm"

// Type Guards
function isButtonComponent(component: Component): component is import("@/types/quiz").ButtonComponent {
  return component.type === 'Button';
}

function isTextComponent(component: Component): component is import("@/types/quiz").TextComponent {
  return component.type === 'Text';
}

function isImageComponent(component: Component): component is import("@/types/quiz").ImageComponent {
  return component.type === 'Image';
}

function isOptionsComponent(component: Component): component is import("@/types/quiz").OptionsComponent {
  return component.type === 'Options';
}

interface PropertiesPanelProps {
  activeTab: string
  currentStepData: Step | null
  selectedComponentId: string | null
  getSelectedComponent: () => Component | null
  updateStep: (stepId: string, updates: Partial<Step>) => void
  updateComponent: (stepId: string, componentId: string, updates: Partial<Component>) => void
  removeComponent: (stepId: string, componentId: string) => void
  removeStep: (stepId: string) => void
  selectedStepId: string | null
  quiz: Quiz
  updateQuizSettings?: (updates: Partial<Quiz['settings']>) => void
}

export default function PropertiesPanel({
  activeTab,
  currentStepData,
  selectedComponentId,
  getSelectedComponent,
  updateStep,
  updateComponent,
  removeComponent,
  removeStep,
  selectedStepId,
  quiz,
  updateQuizSettings
}: PropertiesPanelProps) {
  const renderComponentPropertiesForm = (component: Component) => {
    if (isButtonComponent(component)) {
      return (
        <ButtonPropertiesForm
          component={component}
          onUpdate={(updates) => {
            if (selectedStepId) updateComponent(selectedStepId, component.id, updates)
          }}
          allSteps={quiz.steps}
        />
      )
    }
    
    if (isTextComponent(component)) {
      return (
        <TextPropertiesForm
          component={component}
          onUpdate={(updates) => {
            if (selectedStepId) updateComponent(selectedStepId, component.id, updates)
          }}
        />
      )
    }
    
    if (isImageComponent(component)) {
      return (
        <ImagePropertiesForm
          component={component}
          onUpdate={(updates) => {
            if (selectedStepId) updateComponent(selectedStepId, component.id, updates)
          }}
        />
      )
    }
    
    if (isOptionsComponent(component)) {
      return (
        <OptionsPropertiesForm
          component={component}
          onUpdate={(updates) => {
            if (selectedStepId) updateComponent(selectedStepId, component.id, updates)
          }}
          allSteps={quiz.steps}
        />
      )
    }
    
    // Default case for unimplemented types
    return <p className="text-xs text-gray-500 dark:text-gray-400">Propriedades para "{component.type}" não definidas.</p>
  }

  return (
    <div className="w-80 border-l border-gray-200 dark:border-gray-800 overflow-y-auto p-4 space-y-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {activeTab === "construtor" && currentStepData && !selectedComponentId && (
        <>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título da Etapa</h3>
            <Input
              value={currentStepData.title}
              onChange={(e) => updateStep(selectedStepId!, { title: e.target.value })}
              placeholder="Título exibido na etapa"
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome da Etapa (interno)</h3>
            <Input
              value={currentStepData.name}
              onChange={(e) => updateStep(selectedStepId!, { name: e.target.value })}
              placeholder="Nome interno da etapa"
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Usado para navegação e identificação.</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Configurações do Header</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-logo" className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrar Logo
                </Label>
                <Switch
                  id="show-logo"
                  checked={currentStepData.showLogo ?? true}
                  onCheckedChange={(checked) => updateStep(selectedStepId!, { showLogo: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-progress" className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrar Progresso
                </Label>
                <Switch
                  id="show-progress"
                  checked={currentStepData.showProgress ?? true}
                  onCheckedChange={(checked) => updateStep(selectedStepId!, { showProgress: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-return" className="text-sm text-gray-700 dark:text-gray-300">
                  Permitir Voltar
                </Label>
                <Switch
                  id="allow-return"
                  checked={currentStepData.allowReturn ?? true}
                  onCheckedChange={(checked) => updateStep(selectedStepId!, { allowReturn: checked })}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
            <Button
              variant="outline"
              className="w-full border-red-300 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={() => removeStep(selectedStepId!)}
              disabled={quiz.steps.length <= 1}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remover Etapa
            </Button>
          </div>
        </>
      )}

      {activeTab === "construtor" && currentStepData && selectedComponentId && getSelectedComponent() && (
        <>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Propriedades: {getSelectedComponent()?.type}</h3>
            {renderComponentPropertiesForm(getSelectedComponent()!)}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
            <Button
              variant="outline"
              className="w-full border-red-300 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={() => {
                if (selectedStepId)
                  removeComponent(selectedStepId, selectedComponentId)
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remover Componente
            </Button>
          </div>
        </>
      )}

      {activeTab === "design" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Personalização</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="background-color" className="text-xs text-gray-700 dark:text-gray-300">Cor de Fundo</Label>
                <div className="flex mt-2">
                  <input
                    id="background-color"
                    type="color"
                    value={quiz.settings?.backgroundColor || "#FFFFFF"}
                    onChange={(e) => updateQuizSettings?.({ backgroundColor: e.target.value })}
                    className="w-10 h-10 p-1 border border-gray-300 dark:border-gray-700 rounded-l-md"
                  />
                  <Input
                    value={quiz.settings?.backgroundColor || "#FFFFFF"}
                    onChange={(e) => updateQuizSettings?.({ backgroundColor: e.target.value })}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-l-none"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Esta cor será usada como fundo do seu quiz.</p>
              </div>
              
              <div>
                <Label htmlFor="font-family" className="text-xs text-gray-700 dark:text-gray-300">Fonte Principal</Label>
                <select
                  id="font-family"
                  value={quiz.settings?.fontFamily || "Roboto"}
                  onChange={(e) => updateQuizSettings?.({ fontFamily: e.target.value })}
                  className="w-full mt-2 h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1 text-sm"
                >
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-branding" className="text-sm text-gray-700 dark:text-gray-300">
                    Mostrar Branding
                  </Label>
                  <Switch
                    id="show-branding"
                    checked={quiz.settings?.showBranding ?? true}
                    onCheckedChange={(checked) => updateQuizSettings?.({ showBranding: checked })}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Exibe o logotipo no topo do quiz.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "construtor" && !currentStepData && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-10">Selecione ou adicione uma etapa para ver as propriedades.</p>
      )}

      {activeTab === "fluxo" && <p className="text-sm text-gray-500 dark:text-gray-400">Configurações do Fluxo (WIP)</p>}
      {activeTab === "leads" && <p className="text-sm text-gray-500 dark:text-gray-400">Opções de Leads (WIP)</p>}
      {activeTab === "configuracoes" && <p className="text-sm text-gray-500 dark:text-gray-400">Configurações Gerais do Quiz (WIP)</p>}
    </div>
  )
}