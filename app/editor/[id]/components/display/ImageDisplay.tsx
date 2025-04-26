"use client"

import { ImageIcon } from "lucide-react"
import type { ImageComponent } from "@/types/quiz"

interface ImageDisplayProps {
  component: ImageComponent
}

export default function ImageDisplay({ component }: ImageDisplayProps) {
  return (
    <div className="w-full flex justify-center pointer-events-none">
      {component.src ? (
        <img
          src={component.src}
          alt={component.alt || 'Preview'}
          className="max-w-full h-auto object-contain"
          style={{
            borderWidth: `${component.border.size}px`,
            borderColor: component.border.color,
            borderRadius: `${component.border.radius}px`,
            maxWidth: component.size === 'small' ? '150px' : component.size === 'medium' ? '300px' : component.size === 'large' ? '500px' : `${component.customWidth}px`,
            maxHeight: component.size === 'small' ? '150px' : component.size === 'medium' ? '300px' : component.size === 'large' ? '500px' : `${component.customHeight}px`,
          }}
        />
      ) : (
        <div className="w-full h-32 bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
          <ImageIcon className="h-8 w-8 mr-2" /> Sem Imagem
        </div>
      )}
    </div>
  );
}