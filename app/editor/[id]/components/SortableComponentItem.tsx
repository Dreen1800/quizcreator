"use client"

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from "lucide-react"
import type { Component } from "@/types/quiz"

interface SortableComponentItemProps {
  id: string
  component: Component
  isSelected: boolean
  renderComponent: (component: Component) => React.ReactNode
  onClick: () => void
  isDarkBackground?: boolean
}

export default function SortableComponentItem({
  id,
  component,
  isSelected,
  renderComponent,
  onClick,
  isDarkBackground = false
}: SortableComponentItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: isSelected 
      ? '1px solid #10B981' 
      : isDarkBackground 
        ? '1px solid rgba(255, 255, 255, 0.2)' 
        : '1px solid rgba(0, 0, 0, 0.1)',
    backgroundColor: isSelected 
      ? isDarkBackground 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.05)' 
      : 'transparent',
    borderRadius: '0.375rem',
    padding: '1rem',
    cursor: 'pointer',
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} onClick={onClick}>
      <button
        {...attributes}
        {...listeners}
        aria-label="Arrastar para reordenar"
        className={`absolute top-1 right-1 p-1 ${
          isDarkBackground 
            ? 'text-gray-300 hover:text-white' 
            : 'text-gray-500 hover:text-black'
        } cursor-grab active:cursor-grabbing`}
        style={{ touchAction: 'none' }}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      {renderComponent(component)}
    </div>
  );
}