"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { ButtonComponent, Step } from "@/types/quiz"

interface ButtonPropertiesFormProps {
  component: ButtonComponent
  onUpdate: (updates: Partial<ButtonComponent>) => void
  allSteps: Step[]
}

export default function ButtonPropertiesForm({ component, onUpdate, allSteps }: ButtonPropertiesFormProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="comp-btn-text" className="text-xs text-gray-400">Texto</Label>
        <Input 
          id="comp-btn-text" 
          value={component.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="bg-gray-800 border-gray-700 mt-1" 
        />
      </div>

      <div>
        <Label htmlFor="comp-btn-action" className="text-xs text-gray-400">Ação</Label>
        <select 
          id="comp-btn-action" 
          value={typeof component.action === 'string' ? component.action : 'goToStep'}
          onChange={(e) => {
            const actionValue = e.target.value
            // @ts-ignore - We're handling the types here
            const newAction = actionValue === 'nextStep' || actionValue === 'externalLink' ? actionValue : { goToStep: '' }
            onUpdate({ action: newAction })
          }}
          className="w-full flex h-9 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm mt-1"
        >
          <option value="nextStep">Ir para próxima etapa</option>
          <option value="externalLink">Link externo</option>
          <option value="goToStep">Ir para etapa específica</option>
        </select>
      </div>

      {component.action && typeof component.action === 'object' && 'goToStep' in component.action ? (
        <div>
          <Label htmlFor="comp-btn-step-id" className="text-xs text-gray-400">Etapa de destino</Label>
          <select 
            id="comp-btn-step-id" 
            value={component.action.goToStep}
            onChange={(e) => {
              // Update the current action to include the specific step
              const goToStepAction = { goToStep: e.target.value }
              onUpdate({ action: goToStepAction })
            }}
            className="w-full flex h-9 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm mt-1"
          >
            <option value="">Selecione uma etapa</option>
            {allSteps.map((s, index) => (
              <option key={s.id} value={s.id}>{s.name || `Etapa ${index + 1}`}</option>
            ))}
          </select>
        </div>
      ) : component.action === 'externalLink' && (
        <div>
          <Label htmlFor="comp-btn-url" className="text-xs text-gray-400">URL</Label>
          <input
            id="comp-btn-url"
            value={component.externalUrl || ''}
            onChange={(e) => onUpdate({ externalUrl: e.target.value })}
            placeholder="https://exemplo.com"
            className="w-full flex h-9 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm mt-1"
          />
        </div>
      )}

      <div>
        <Label htmlFor="comp-btn-size" className="text-xs text-gray-400">Tamanho</Label>
        <select
          id="comp-btn-size"
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
        <Label htmlFor="comp-btn-alignment" className="text-xs text-gray-400">Alinhamento</Label>
        <select
          id="comp-btn-alignment"
          value={component.alignment}
          onChange={(e) => onUpdate({ alignment: e.target.value as any })}
          className="w-full flex h-9 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm mt-1"
        >
          <option value="left">Esquerda</option>
          <option value="center">Centro</option>
          <option value="right">Direita</option>
        </select>
      </div>

      <div>
        <Label className="text-xs text-gray-400 mb-2 block">Cor</Label>
        <div className="flex items-center space-x-2">
          <Switch
            id="comp-btn-gradient"
            checked={component.color.isGradient}
            onCheckedChange={(checked) => {
              const newColor = { ...component.color, isGradient: checked };
              if (checked && !newColor.gradientFrom) {
                newColor.gradientFrom = '#10b981';
                newColor.gradientTo = '#3b82f6';
              }
              onUpdate({ color: newColor });
            }}
          />
          <Label htmlFor="comp-btn-gradient" className="text-xs text-gray-400">Usar gradiente</Label>
        </div>

        {component.color.isGradient ? (
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="comp-btn-gradient-from" className="text-xs text-gray-400">De</Label>
                <div className="flex mt-1">
                  <input
                    id="comp-btn-gradient-from"
                    type="color"
                    value={component.color.gradientFrom || '#10b981'}
                    onChange={(e) => {
                      const newColor = { ...component.color, gradientFrom: e.target.value };
                      onUpdate({ color: newColor });
                    }}
                    className="w-10 h-9 p-1 border border-gray-700 rounded-l-md"
                  />
                  <Input
                    value={component.color.gradientFrom || '#10b981'}
                    onChange={(e) => {
                      const newColor = { ...component.color, gradientFrom: e.target.value };
                      onUpdate({ color: newColor });
                    }}
                    className="bg-gray-800 border-gray-700 rounded-l-none"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="comp-btn-gradient-to" className="text-xs text-gray-400">Para</Label>
                <div className="flex mt-1">
                  <input
                    id="comp-btn-gradient-to"
                    type="color"
                    value={component.color.gradientTo || '#3b82f6'}
                    onChange={(e) => {
                      const newColor = { ...component.color, gradientTo: e.target.value };
                      onUpdate({ color: newColor });
                    }}
                    className="w-10 h-9 p-1 border border-gray-700 rounded-l-md"
                  />
                  <Input
                    value={component.color.gradientTo || '#3b82f6'}
                    onChange={(e) => {
                      const newColor = { ...component.color, gradientTo: e.target.value };
                      onUpdate({ color: newColor });
                    }}
                    className="bg-gray-800 border-gray-700 rounded-l-none"
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="comp-btn-gradient-direction" className="text-xs text-gray-400">Direção do gradiente</Label>
              <select
                id="comp-btn-gradient-direction"
                value={component.color.gradientDirection || "to right"}
                onChange={(e) => {
                  const newColor = { ...component.color, gradientDirection: e.target.value as any };
                  onUpdate({ color: newColor });
                }}
                className="w-full flex h-9 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm mt-1"
              >
                <option value="to right">Da esquerda para direita</option>
                <option value="to left">Da direita para esquerda</option>
                <option value="to bottom">De cima para baixo</option>
                <option value="to top">De baixo para cima</option>
                <option value="to bottom right">Diagonal (superior esquerdo → inferior direito)</option>
                <option value="to bottom left">Diagonal (superior direito → inferior esquerdo)</option>
                <option value="to top right">Diagonal (inferior esquerdo → superior direito)</option>
                <option value="to top left">Diagonal (inferior direito → superior esquerdo)</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="flex mt-2">
            <input
              id="comp-btn-color"
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
            <Label htmlFor="comp-btn-border-size" className="text-xs text-gray-400">Espessura</Label>
            <Input
              id="comp-btn-border-size"
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
            <Label htmlFor="comp-btn-border-radius" className="text-xs text-gray-400">Arredondamento</Label>
            <Input
              id="comp-btn-border-radius"
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
          <Label htmlFor="comp-btn-border-color" className="text-xs text-gray-400">Cor da borda</Label>
          <div className="flex mt-1">
            <input
              id="comp-btn-border-color"
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

      <div>
        <Label className="text-xs text-gray-400 mb-2 block">Espaçamento interno (padding)</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="comp-btn-padding-top" className="text-xs text-gray-400">Superior</Label>
            <Input
              id="comp-btn-padding-top"
              type="number"
              min="0"
              max="50"
              value={component.padding?.top || 10}
              onChange={(e) => {
                const newPadding = {
                  ...(component.padding || { top: 10, right: 20, bottom: 10, left: 20 }),
                  top: parseInt(e.target.value)
                };
                onUpdate({ padding: newPadding });
              }}
              className="bg-gray-800 border-gray-700 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="comp-btn-padding-right" className="text-xs text-gray-400">Direita</Label>
            <Input
              id="comp-btn-padding-right"
              type="number"
              min="0"
              max="50"
              value={component.padding?.right || 20}
              onChange={(e) => {
                const newPadding = {
                  ...(component.padding || { top: 10, right: 20, bottom: 10, left: 20 }),
                  right: parseInt(e.target.value)
                };
                onUpdate({ padding: newPadding });
              }}
              className="bg-gray-800 border-gray-700 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="comp-btn-padding-bottom" className="text-xs text-gray-400">Inferior</Label>
            <Input
              id="comp-btn-padding-bottom"
              type="number"
              min="0"
              max="50"
              value={component.padding?.bottom || 10}
              onChange={(e) => {
                const newPadding = {
                  ...(component.padding || { top: 10, right: 20, bottom: 10, left: 20 }),
                  bottom: parseInt(e.target.value)
                };
                onUpdate({ padding: newPadding });
              }}
              className="bg-gray-800 border-gray-700 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="comp-btn-padding-left" className="text-xs text-gray-400">Esquerda</Label>
            <Input
              id="comp-btn-padding-left"
              type="number"
              min="0"
              max="50"
              value={component.padding?.left || 20}
              onChange={(e) => {
                const newPadding = {
                  ...(component.padding || { top: 10, right: 20, bottom: 10, left: 20 }),
                  left: parseInt(e.target.value)
                };
                onUpdate({ padding: newPadding });
              }}
              className="bg-gray-800 border-gray-700 mt-1"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-400 mb-2 block">Espaçamento externo (margin)</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="comp-btn-margin-top" className="text-xs text-gray-400">Superior</Label>
            <Input
              id="comp-btn-margin-top"
              type="number"
              min="0"
              max="50"
              value={component.margin?.top || 0}
              onChange={(e) => {
                const newMargin = {
                  ...(component.margin || { top: 0, right: 0, bottom: 0, left: 0 }),
                  top: parseInt(e.target.value)
                };
                onUpdate({ margin: newMargin });
              }}
              className="bg-gray-800 border-gray-700 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="comp-btn-margin-right" className="text-xs text-gray-400">Direita</Label>
            <Input
              id="comp-btn-margin-right"
              type="number"
              min="0"
              max="50"
              value={component.margin?.right || 0}
              onChange={(e) => {
                const newMargin = {
                  ...(component.margin || { top: 0, right: 0, bottom: 0, left: 0 }),
                  right: parseInt(e.target.value)
                };
                onUpdate({ margin: newMargin });
              }}
              className="bg-gray-800 border-gray-700 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="comp-btn-margin-bottom" className="text-xs text-gray-400">Inferior</Label>
            <Input
              id="comp-btn-margin-bottom"
              type="number"
              min="0"
              max="50"
              value={component.margin?.bottom || 0}
              onChange={(e) => {
                const newMargin = {
                  ...(component.margin || { top: 0, right: 0, bottom: 0, left: 0 }),
                  bottom: parseInt(e.target.value)
                };
                onUpdate({ margin: newMargin });
              }}
              className="bg-gray-800 border-gray-700 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="comp-btn-margin-left" className="text-xs text-gray-400">Esquerda</Label>
            <Input
              id="comp-btn-margin-left"
              type="number"
              min="0"
              max="50"
              value={component.margin?.left || 0}
              onChange={(e) => {
                const newMargin = {
                  ...(component.margin || { top: 0, right: 0, bottom: 0, left: 0 }),
                  left: parseInt(e.target.value)
                };
                onUpdate({ margin: newMargin });
              }}
              className="bg-gray-800 border-gray-700 mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  )
}