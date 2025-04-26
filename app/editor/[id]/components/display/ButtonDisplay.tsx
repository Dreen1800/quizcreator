"use client"

import { Button } from "@/components/ui/button"
import type { ButtonComponent } from "@/types/quiz"

interface ButtonDisplayProps {
  component: ButtonComponent
}

export default function ButtonDisplay({ component }: ButtonDisplayProps) {
  // Default values for padding and margin
  const defaultPadding = component.size === 'small'
    ? { top: 8, right: 16, bottom: 8, left: 16 }
    : component.size === 'large'
      ? { top: 12, right: 24, bottom: 12, left: 24 }
      : { top: 10, right: 20, bottom: 10, left: 20 };

  const padding = component.padding || defaultPadding;
  const margin = component.margin || { top: 0, right: 0, bottom: 0, left: 0 };
  const gradientDirection = component.color.gradientDirection || "to right";

  return (
    <div className={`w-full flex ${component.alignment === 'center'
      ? 'justify-center'
      : component.alignment === 'right'
        ? 'justify-end'
        : 'justify-start'
      }`}>
      <Button
        variant="default"
        className="pointer-events-none"
        style={{
          backgroundColor: component.color.isGradient
            ? 'transparent'
            : component.color.solid,
          background: component.color.isGradient
            ? `linear-gradient(${gradientDirection}, ${component.color.gradientFrom || '#10b981'}, ${component.color.gradientTo || '#3b82f6'})`
            : undefined,
          borderWidth: `${component.border.size}px`,
          borderColor: component.border.color,
          borderRadius: `${component.border.radius}px`,
          fontSize: component.size === 'small' ? '0.875rem' : component.size === 'large' ? '1.25rem' : '1rem',
          padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
          margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
          width: 'auto',
          display: 'inline-block',
        }}
      >
        {component.text}
      </Button>
    </div>
  );
}