"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import type { OptionsComponent, Step } from "@/types/quiz"

interface OptionsPropertiesFormProps {
  component: OptionsComponent
  onUpdate: (updates: Partial<OptionsComponent>) => void
  allSteps: Step[]
}

export default function OptionsPropertiesForm({ component, onUpdate, allSteps }: OptionsPropertiesFormProps) {
  const handleOptionChange = (optionId: string, field: 'text' | 'nextStepId', value: string | null) => {
    const updatedOptions = component.options.map(opt =>
      opt.id === optionId ? { ...opt, [field]: value } : opt
    )
    onUpdate({ options: updatedOptions })
  }

  const addOptionHandler = () => {
    const newOption = { id: uuidv4(), text: "Nova Opção", nextStepId: null }
    onUpdate({ options: [...component.options, newOption] })
  }

  const removeOptionHandler = (optionId: string) => {
    const updatedOptions = component.options.filter(opt => opt.id !== optionId)
    onUpdate({ options: updatedOptions })
  }

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="comp-options-text" className="text-xs text-gray-400">Texto da Pergunta/Prompt</Label>
        <Textarea
          id="comp-options-text"
          value={component.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Digite a pergunta ou instrução..."
          className="bg-gray-800 border-gray-700 mt-1 min-h-[80px]"
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs text-gray-400">Opções de Resposta</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={addOptionHandler} 
            className="h-6 px-2 text-emerald-500 hover:text-emerald-400"
          >
            <Plus className="h-3 w-3 mr-1" /> Adicionar
          </Button>
        </div>
        <div className="space-y-3">
          {component.options.map((option, index) => (
            <div key={option.id} className="p-3 bg-gray-800 border border-gray-700 rounded-md space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`opt-text-${option.id}`} className="text-xs text-gray-400">Texto Opção {index + 1}</Label>
                {component.options.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeOptionHandler(option.id)} 
                    className="h-5 w-5 text-red-500 hover:text-red-400 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Input
                id={`opt-text-${option.id}`}
                value={option.text}
                onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
                placeholder="Texto da opção"
                className="bg-gray-900 border-gray-600 h-8 text-sm"
              />
              <div>
                <Label htmlFor={`opt-next-${option.id}`} className="text-xs text-gray-400 block mb-1">Próxima Etapa</Label>
                <select
                  id={`opt-next-${option.id}`}
                  value={option.nextStepId || ""}
                  onChange={(e) => handleOptionChange(option.id, 'nextStepId', e.target.value || null)}
                  className="w-full flex h-8 rounded-md border border-gray-600 bg-gray-900 px-2 py-1 text-xs"
                >
                  <option value="">-- Finalizar Quiz --</option>
                  {allSteps
                    .filter(step => step.id !== component.id) // Avoid circular references
                    .map(step => (
                      <option key={step.id} value={step.id}>
                        {step.name}: {step.title.substring(0, 25)}{step.title.length > 25 ? '...' : ''}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label htmlFor="comp-options-size" className="text-xs text-gray-400">Tamanho</Label>
        <select
          id="comp-options-size"
          value={component.size}
          onChange={(e) => onUpdate({ size: e.target.value as any })}
          className="w-full flex h-9 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm mt-1"
        >
          <option value="small">Pequeno</option>
          <option value="medium">Médio</option>
          <option value="large">Grande</option>
        </select>
      </div>

      <div>
        <Label className="text-xs text-gray-400 mb-2 block">Cor</Label>
        <div className="flex items-center space-x-2">
          <Switch
            id="comp-options-gradient"
            checked={component.color.isGradient}
            onCheckedChange={(checked) => {
              const newColor = { ...component.color, isGradient: checked };
              if (checked && !newColor.gradientFrom) {
                newColor.gradientFrom = '#1e293b';
                newColor.gradientTo = '#334155';
              }
              onUpdate({ color: newColor });
            }}
          />
          <Label htmlFor="comp-options-gradient" className="text-xs text-gray-400">Usar gradiente</Label>
        </div>

        {component.color.isGradient ? (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <Label htmlFor="comp-options-gradient-from" className="text-xs text-gray-400">De</Label>
              <div className="flex mt-1">
                <input
                  id="comp-options-gradient-from"
                  type="color"
                  value={component.color.gradientFrom || '#1e293b'}
                  onChange={(e) => {
                    const newColor = { ...component.color, gradientFrom: e.target.value };
                    onUpdate({ color: newColor });
                  }}
                  className="w-10 h-9 p-1 border border-gray-700 rounded-l-md"
                />
                <Input
                  value={component.color.gradientFrom || '#1e293b'}
                  onChange={(e) => {
                    const newColor = { ...component.color, gradientFrom: e.target.value };
                    onUpdate({ color: newColor });
                  }}
                  className="bg-gray-800 border-gray-700 rounded-l-none"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="comp-options-gradient-to" className="text-xs text-gray-400">Para</Label>
              <div className="flex mt-1">
                <input
                  id="comp-options-gradient-to"
                  type="color"
                  value={component.color.gradientTo || '#334155'}
                  onChange={(e) => {
                    const newColor = { ...component.color, gradientTo: e.target.value };
                    onUpdate({ color: newColor });
                  }}
                  className="w-10 h-9 p-1 border border-gray-700 rounded-l-md"
                />
                <Input
                  value={component.color.gradientTo || '#334155'}
                  onChange={(e) => {
                    const newColor = { ...component.color, gradientTo: e.target.value };
                    onUpdate({ color: newColor });
                  }}
                  className="bg-gray-800 border-gray-700 rounded-l-none"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex mt-2">
            <input
              id="comp-options-color"
              type="color"
              value={component.color.solid}
              onChange={(e) => {
                const newColor = { ...component.color, solid: e.target.value };
                onUpdate({ color: newColor });
              }}
              className="w-10 h-9 p-1 border border-gray-700 rounded-l-md"
            />
            <Input
              value={component.color.solid}
              onChange={(e) => {
                const newColor = { ...component.color, solid: e.target.value };
                onUpdate({ color: newColor });
              }}
              className="bg-gray-800 border-gray-700 rounded-l-none"
            />
          </div>
        )}
      </div>

      <div>
        <Label className="text-xs text-gray-400 mb-2 block">Borda</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="comp-options-border-size" className="text-xs text-gray-400">Espessura</Label>
            <Input
              id="comp-options-border-size"
              type="number"
              min="0"
              max="10"
              value={component.border.size}
              onChange={(e) => {
                const newBorder = { ...component.border, size: parseInt(e.target.value) };
                onUpdate({ border: newBorder });
              }}
              className="bg-gray-800 border-gray-700 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="comp-options-border-radius" className="text-xs text-gray-400">Arredondamento</Label>
            <Input
              id="comp-options-border-radius"
              type="number"
              min="0"
              max="50"
              value={component.border.radius}
              onChange={(e) => {
                const newBorder = { ...component.border, radius: parseInt(e.target.value) };
                onUpdate({ border: newBorder });
              }}
              className="bg-gray-800 border-gray-700 mt-1"
            />
          </div>
        </div>
        <div className="mt-2">
          <Label htmlFor="comp-options-border-color" className="text-xs text-gray-400">Cor da borda</Label>
          <div className="flex mt-1">
            <input
              id="comp-options-border-color"
              type="color"
              value={component.border.color}
              onChange={(e) => {
                const newBorder = { ...component.border, color: e.target.value };
                onUpdate({ border: newBorder });
              }}
              className="w-10 h-9 p-1 border border-gray-700 rounded-l-md"
            />
            <Input
              value={component.border.color}
              onChange={(e) => {
                const newBorder = { ...component.border, color: e.target.value };
                onUpdate({ border: newBorder });
              }}
              className="bg-gray-800 border-gray-700 rounded-l-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}