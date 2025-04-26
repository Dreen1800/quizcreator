"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { ImageComponent } from "@/types/quiz"

interface ImagePropertiesFormProps {
  component: ImageComponent
  onUpdate: (updates: Partial<ImageComponent>) => void
}

export default function ImagePropertiesForm({ component, onUpdate }: ImagePropertiesFormProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="comp-img-upload" className="text-xs text-gray-400">Imagem</Label>
        <div className="mt-2 flex flex-col items-center">
          {component.src ? (
            <div className="relative w-full mb-3">
              <img
                src={component.src}
                alt={component.alt || "Preview"}
                className="max-w-full h-auto rounded-md mx-auto"
                style={{
                  maxHeight: "150px",
                  borderWidth: `${component.border.size}px`,
                  borderColor: component.border.color,
                  borderRadius: `${component.border.radius}px`,
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-gray-800/80 border-gray-700 text-gray-300"
                onClick={() => onUpdate({ src: "" })}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : null}

          <Input
            id="comp-img-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                  onUpdate({ src: event.target?.result as string })
                }
                reader.readAsDataURL(file)
              }
            }}
            className="bg-gray-800 border-gray-700"
          />
          <p className="text-xs text-gray-500 mt-1">Upload da imagem para o banco de dados</p>
        </div>
      </div>
      
      <div>
        <Label htmlFor="comp-img-alt" className="text-xs text-gray-400">Texto Alternativo</Label>
        <Input 
          id="comp-img-alt" 
          value={component.alt || ''}
          onChange={(e) => onUpdate({ alt: e.target.value })}
          className="bg-gray-800 border-gray-700 mt-1" 
        />
      </div>
      
      <div>
        <Label htmlFor="comp-img-size" className="text-xs text-gray-400">Tamanho</Label>
        <select
          id="comp-img-size"
          value={component.size}
          onChange={(e) => onUpdate({ size: e.target.value as any })}
          className="w-full flex h-9 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm mt-1"
        >
          <option value="small">Pequeno</option>
          <option value="medium">Médio</option>
          <option value="large">Grande</option>
          <option value="custom">Personalizado</option>
        </select>
      </div>

      {component.size === 'custom' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="comp-img-width" className="text-xs text-gray-400">Largura (px)</Label>
            <Input
              id="comp-img-width"
              type="number"
              min="50"
              max="1000"
              value={component.customWidth || 300}
              onChange={(e) => onUpdate({ customWidth: parseInt(e.target.value) })}
              className="bg-gray-800 border-gray-700 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="comp-img-height" className="text-xs text-gray-400">Altura (px)</Label>
            <Input
              id="comp-img-height"
              type="number"
              min="50"
              max="1000"
              value={component.customHeight || 300}
              onChange={(e) => onUpdate({ customHeight: parseInt(e.target.value) })}
              className="bg-gray-800 border-gray-700 mt-1"
            />
          </div>
        </div>
      )}

      <div>
        <Label className="text-xs text-gray-400 mb-2 block">Borda</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="comp-img-border-size" className="text-xs text-gray-400">Espessura</Label>
            <Input
              id="comp-img-border-size"
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
            <Label htmlFor="comp-img-border-radius" className="text-xs text-gray-400">Arredondamento</Label>
            <Input
              id="comp-img-border-radius"
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
          <Label htmlFor="comp-img-border-color" className="text-xs text-gray-400">Cor da borda</Label>
          <div className="flex mt-1">
            <input
              id="comp-img-border-color"
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