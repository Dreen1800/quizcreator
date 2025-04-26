"use client"

import type { TextComponent } from "@/types/quiz"

interface TextDisplayProps {
  component: TextComponent
}

export default function TextDisplay({ component }: TextDisplayProps) {
  const TagName = component.htmlTag;

  const textStyle = {
    color: component.color,
    fontSize: component.size === 'small'
      ? '0.875rem'
      : component.size === 'large'
        ? '1.125rem'
        : '1rem',
    fontFamily: component.fontFamily || 'inherit',
    fontWeight: component.fontWeight || 'inherit',
  };

  const hStyles = {
    h1: {
      ...textStyle,
      fontSize: component.size === 'small' ? '1.5rem' : component.size === 'large' ? '2.25rem' : '1.875rem',
    },
    h2: {
      ...textStyle,
      fontSize: component.size === 'small' ? '1.25rem' : component.size === 'large' ? '1.875rem' : '1.5rem',
    },
    h3: {
      ...textStyle,
      fontSize: component.size === 'small' ? '1.125rem' : component.size === 'large' ? '1.5rem' : '1.25rem',
    },
    p: textStyle,
  };

  return (
    <div className="w-full pointer-events-none">
      {TagName === 'h1' && (
        <h1
          className={`${component.alignment === 'center' ? 'text-center' : component.alignment === 'right' ? 'text-right' : 'text-left'}`}
          style={hStyles.h1}
        >
          {component.content}
        </h1>
      )}
      {TagName === 'h2' && (
        <h2
          className={`${component.alignment === 'center' ? 'text-center' : component.alignment === 'right' ? 'text-right' : 'text-left'}`}
          style={hStyles.h2}
        >
          {component.content}
        </h2>
      )}
      {TagName === 'h3' && (
        <h3
          className={`${component.alignment === 'center' ? 'text-center' : component.alignment === 'right' ? 'text-right' : 'text-left'}`}
          style={hStyles.h3}
        >
          {component.content}
        </h3>
      )}
      {TagName === 'p' && (
        <p
          className={`${component.alignment === 'center' ? 'text-center' : component.alignment === 'right' ? 'text-right' : 'text-left'}`}
          style={hStyles.p}
        >
          {component.content}
        </p>
      )}
    </div>
  );
}