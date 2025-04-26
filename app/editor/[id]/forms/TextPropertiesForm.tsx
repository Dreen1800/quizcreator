"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { TextComponent } from "@/types/quiz"

interface TextPropertiesFormProps {
  component: TextComponent
  onUpdate: (updates: Partial<TextComponent>) => void
}

export default function TextPropertiesForm({ component, onUpdate }: TextPropertiesFormProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="comp-text-content" className="text-xs text-gray-400">Conteúdo</Label>
        <Textarea
          id="comp-text-content"
          value={component.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Digite o conteúdo do texto..."
          className="bg-gray-800 border-gray-700 mt-1 min-h-[80px]"
        />
      </div>
      
      <div>
        <Label htmlFor="comp-text-tag" className="text-xs text-gray-400">Tipo de texto</Label>
        <select
          id="comp-text-tag"
          value={component.htmlTag}
          onChange={(e) => onUpdate({ htmlTag: e.target.value as any })}
          className="w-full flex h-9 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm mt-1"
        >
          <option value="p">Parágrafo</option>
          <option value="h1">Título H1</option>
          <option value="h2">Título H2</option>
          <option value="h3">Título H3</option>
        </select>
      </div>
      
      <div>
        <Label htmlFor="comp-text-color" className="text-xs text-gray-400">Cor</Label>
        <div className="flex mt-1">
          <input
            id="comp-text-color"
            type="color"
            value={component.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="w-10 h-9 p-1 border border-gray-700 rounded-l-md"
          />
          <Input
            value={component.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="bg-gray-800 border-gray-700 rounded-l-none"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="comp-text-font-family" className="text-xs text-gray-400">Fonte</Label>
        <select
          id="comp-text-font-family"
          value={component.fontFamily || "Roboto"}
          onChange={(e) => onUpdate({ fontFamily: e.target.value })}
          className="w-full flex h-9 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm mt-1"
        >
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Playfair Display">Playfair Display</option>
          <option value="Raleway">Raleway</option>
          <option value="Ubuntu">Ubuntu</option>
          <option value="Poppins">Poppins</option>
          <option value="Nunito">Nunito</option>
          <option value="Oswald">Oswald</option>
          <option value="Merriweather">Merriweather</option>
          <option value="Source Sans Pro">Source Sans Pro</option>
          <option value="Rubik">Rubik</option>
          <option value="Inter">Inter</option>
        </select>
      </div>
      
      <div>
        <Label htmlFor="comp-text-font-weight" className="text-xs text-gray-400">Peso da Fonte</Label>
        <select
          id="comp-text-font-weight"
          value={component.fontWeight || "400"}
          onChange={(e) => onUpdate({ fontWeight: e.target.value as any })}
          className="w-full flex h-9 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm mt-1"
        >
          <option value="300">Light (300)</option>
          <option value="400">Regular (400)</option>
          <option value="500">Medium (500)</option>
          <option value="600">Semi-Bold (600)</option>
          <option value="700">Bold (700)</option>
          <option value="800">Extra-Bold (800)</option>
          <option value="900">Black (900)</option>
        </select>
      </div>
      
      <div>
        <Label htmlFor="comp-text-size" className="text-xs text-gray-400">Tamanho</Label>
        <select
          id="comp-text-size"
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
        <Label htmlFor="comp-text-alignment" className="text-xs text-gray-400">Alinhamento</Label>
        <select
          id="comp-text-alignment"
          value={component.alignment}
          onChange={(e) => onUpdate({ alignment: e.target.value as any })}
          className="w-full flex h-9 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm mt-1"
        >
          <option value="left">Esquerda</option>
          <option value="center">Centro</option>
          <option value="right">Direita</option>
        </select>
      </div>
    </div>
  )
}