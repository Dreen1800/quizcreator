"use client"

import { Button } from "@/components/ui/button"
import type { OptionsComponent } from "@/types/quiz"

interface OptionsDisplayProps {
  component: OptionsComponent
}

export default function OptionsDisplay({ component }: OptionsDisplayProps) {
  return (
    <div className="w-full pointer-events-none">
      <p className="mb-3 font-medium text-center">{component.text}</p>
      <div className="space-y-2">
        {component.options.map(option => (
          <Button
            key={option.id}
            variant="outline"
            className="w-full justify-start text-left h-auto py-3 px-4"
            style={{
              backgroundColor: component.color.isGradient
                ? `linear-gradient(to right, ${component.color.gradientFrom || '#1e293b'}, ${component.color.gradientTo || '#334155'})`
                : component.color.solid,
              borderWidth: `${component.border.size}px`,
              borderColor: component.border.color,
              borderRadius: `${component.border.radius}px`,
              fontSize: component.size === 'small' ? '0.875rem' : component.size === 'large' ? '1.125rem' : '1rem',
            }}
          >
            {option.text || "Opção sem texto"}
          </Button>
        ))}
      </div>
    </div>
  );
}