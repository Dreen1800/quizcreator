"use client"

import { useRef } from "react"
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from "@/components/ui/button"
import { Plus, ImageIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Quiz, Step, Component, ComponentType } from "@/types/quiz"
import SortableComponentItem from "./SortableComponentItem"
import ButtonDisplay from "./display/ButtonDisplay"
import TextDisplay from "./display/TextDisplay"
import ImageDisplay from "./display/ImageDisplay"
import OptionsDisplay from "./display/OptionsDisplay"

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

interface ComponentCanvasProps {
  activeTab: string
  currentStepData: Step | null
  quiz: Quiz
  selectedStepId: string | null
  selectedComponentId: string | null
  setSelectedComponentId: (id: string | null) => void
  addComponent: (stepId: string, type: ComponentType) => void
}

export default function ComponentCanvas({
  activeTab,
  currentStepData,
  quiz,
  selectedStepId,
  selectedComponentId,
  setSelectedComponentId,
  addComponent
}: ComponentCanvasProps) {
  const { setNodeRef: setDroppableNodeRef, isOver: isOverCanvas } = useDroppable({
    id: 'canvas-drop-area',
    data: { isCanvas: true },
  })

  const componentsList = [
    { icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><path d="M13.5 3.5H1.5V11.5H13.5V3.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>, name: "Texto", type: "Text" as ComponentType },
    { icon: <ImageIcon className="h-5 w-5" />, name: "Imagem", type: "Image" as ComponentType },
    { icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><path d="M13.5 3.5H1.5V11.5H13.5V3.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>, name: "Botão", type: "Button" as ComponentType },
    { icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><path d="M0.5 3.5H3.5M0.5 7.5H3.5M0.5 11.5H3.5M6.5 3.5H14.5M6.5 7.5H14.5M6.5 11.5H14.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>, name: "Opções", type: "Options" as ComponentType },
  ]

  const renderComponentInCanvas = (component: Component) => {
    if (isButtonComponent(component)) return <ButtonDisplay component={component} />;
    if (isTextComponent(component)) return <TextDisplay component={component} />;
    if (isImageComponent(component)) return <ImageDisplay component={component} />;
    if (isOptionsComponent(component)) return <OptionsDisplay component={component} />;

    // Default case for unimplemented types
    return (
      <div className="text-xs text-center text-gray-500 py-2">
        (Visualização para "{component.type}" não implementada)
      </div>
    );
  };

  // Get canvas background color based on quiz settings
  const canvasBackgroundColor = quiz.settings?.backgroundColor || "#FFFFFF";
  const textColor = isLightColor(canvasBackgroundColor) ? "#000000" : "#FFFFFF";

  // Helper function to determine if a color is light or dark
  function isLightColor(color: string) {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate brightness (HSP formula)
    const brightness = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );
    
    // Return true if light, false if dark
    return brightness > 155;
  }

  return (
    <div 
      ref={setDroppableNodeRef}
      className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900"
    >
      {activeTab === "construtor" && currentStepData && (
        <div className="max-w-3xl mx-auto">
          {/* Canvas Preview with Custom Background */}
          <div 
            className="border rounded-lg shadow-sm overflow-hidden"
            style={{ 
              backgroundColor: canvasBackgroundColor,
              color: textColor,
              padding: "1.5rem",
              transition: "background-color 0.3s ease"
            }}
          >
            <div className="mb-6">
              {currentStepData.showLogo && (
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
              )}

              {currentStepData.showProgress && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${((quiz.steps.findIndex(s => s.id === selectedStepId) + 1) / quiz.steps.length) * 100}%` }}
                  ></div>
                </div>
              )}

              <div className="flex items-center justify-between">
                {currentStepData.allowReturn && quiz.steps.findIndex(s => s.id === selectedStepId) > 0 && (
                  <Button variant="ghost" size="sm" className="text-inherit hover:bg-black/10 dark:hover:bg-white/10"
                    onClick={() => { /* TODO: Navigate to previous step */ }}
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1">
                      <path d="M7.5 1.5L3.5 7.5L7.5 13.5M3.5 7.5H14.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Voltar
                  </Button>
                )}
                <div />
              </div>
            </div>

            <div className="space-y-4">
              {currentStepData.components.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Nada por aqui 😢</p>
                  <p className="text-gray-500 dark:text-gray-400">Clique em "Adicionar Componente" para começar.</p>
                </div>
              ) : (
                <SortableContext items={currentStepData.components.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4 min-h-[200px]">
                    {currentStepData.components.map(component => (
                      <SortableComponentItem
                        key={component.id}
                        id={component.id}
                        component={component}
                        isSelected={selectedComponentId === component.id}
                        renderComponent={renderComponentInCanvas}
                        onClick={() => setSelectedComponentId(component.id)}
                        isDarkBackground={!isLightColor(canvasBackgroundColor)}
                      />
                    ))}
                  </div>
                </SortableContext>
              )}
            </div>
          </div>

          {/* Add component button - positioned below and styled with theme */}
          {selectedStepId && (
            <div className="flex justify-center mt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Componente
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">Selecione um componente</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400">
                      Clique em um componente para adicioná-lo à etapa atual.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-3 p-4">
                      {componentsList.map((component) => (
                        <Button
                          key={component.type}
                          variant="outline"
                          className="flex flex-col h-28 p-4 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                          onClick={() => {
                            addComponent(selectedStepId, component.type);
                          }}
                        >
                          <div className="mb-3 text-emerald-500">
                            {component.icon}
                          </div>
                          <span className="text-sm font-medium">{component.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      )}

      {activeTab === "construtor" && !currentStepData && quiz.steps.length > 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-gray-500 dark:text-gray-400">Selecione uma etapa na barra lateral esquerda para começar a editar.</p>
        </div>
      )}

      {activeTab === "construtor" && quiz.steps.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Quiz Vazio 😢</p>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Adicione sua primeira etapa usando o botão '+' na barra lateral esquerda.</p>
        </div>
      )}

      {activeTab === "design" && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Personalização do Quiz</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium mb-3 text-gray-800 dark:text-gray-200">Cores do Quiz</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cor de Fundo
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={quiz.settings?.backgroundColor || "#FFFFFF"}
                        onChange={(e) => {
                          // This function should call updateQuizSettings
                          // We'll need to pass this function from the parent component
                        }}
                        className="w-10 h-10 rounded border border-gray-300 dark:border-gray-700 mr-3"
                      />
                      <div 
                        className="flex-1 h-10 rounded border border-gray-300 dark:border-gray-700"
                        style={{ backgroundColor: quiz.settings?.backgroundColor || "#FFFFFF" }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Esta cor será usada como fundo para o seu quiz. Recomendamos cores claras para melhor legibilidade.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-3 text-gray-800 dark:text-gray-200">Fontes e Texto</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fonte Principal
                    </label>
                    <select 
                      value={quiz.settings?.fontFamily || "Roboto"}
                      onChange={(e) => {
                        // This function should call updateQuizSettings
                      }}
                      className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Lato">Lato</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Poppins">Poppins</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-3 text-gray-800 dark:text-gray-200">Identidade Visual</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Exibir Branding</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={quiz.settings?.showBranding ?? true} 
                        onChange={() => {
                          // This function should call updateQuizSettings
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Quando ativado, exibe seu logotipo no topo de cada etapa do quiz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "fluxo" && (
        <div className="h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-700 dark:text-gray-300">Visualização do fluxo ainda não implementada.</p>
        </div>
      )}
      
      {activeTab === "leads" && (
        <div className="h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-700 dark:text-gray-300">Visualização de Leads (WIP)</p>
        </div>
      )}
      
      {activeTab === "configuracoes" && (
        <div className="h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-700 dark:text-gray-300">Configurações Gerais (WIP)</p>
        </div>
      )}
    </div>
  )
}