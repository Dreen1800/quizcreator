"use client"

import { useEffect, useRef } from "react"
import type { Quiz } from "@/types/quiz"

interface QuizFlowVisualizationProps {
  quiz: Quiz
}

export default function QuizFlowVisualization({ quiz }: QuizFlowVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || quiz.questions.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 1000
    canvas.height = Math.max(600, quiz.questions.length * 150)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Define node dimensions
    const nodeWidth = 200
    const nodeHeight = 80
    const horizontalSpacing = 250
    const verticalSpacing = 150

    // Create a map of question IDs to their positions
    const questionPositions: Record<string, { x: number; y: number }> = {}

    // Draw questions
    quiz.questions.forEach((question, index) => {
      const x = 50
      const y = 50 + index * verticalSpacing

      // Store position
      questionPositions[question.id] = { x, y }

      // Draw question node
      ctx.fillStyle = "#1f2937" // Dark background
      ctx.strokeStyle = "#10b981" // Emerald border
      ctx.lineWidth = 2
      roundRect(ctx, x, y, nodeWidth, nodeHeight, 8, true, true)

      // Draw question text
      ctx.fillStyle = "#f9fafb" // Light text
      ctx.font = "14px Arial"
      wrapText(ctx, `P${index + 1}: ${question.text}`, x + 10, y + 25, nodeWidth - 20, 18)
    })

    // Draw connections
    quiz.questions.forEach((question) => {
      const startPos = questionPositions[question.id]

      // Group options by nextQuestionId
      const optionGroups: Record<string, { count: number; options: string[] }> = {}

      question.options.forEach((option) => {
        const targetId = option.nextQuestionId || "end"
        if (!optionGroups[targetId]) {
          optionGroups[targetId] = { count: 0, options: [] }
        }
        optionGroups[targetId].count++
        optionGroups[targetId].options.push(option.text)
      })

      // Draw connections for each group
      Object.entries(optionGroups).forEach(([targetId, group], groupIndex) => {
        if (targetId === "end") {
          // Draw end node
          const endX = startPos.x + horizontalSpacing
          const endY = startPos.y + groupIndex * 60 - (Object.keys(optionGroups).length - 1) * 30

          // Draw end node
          ctx.fillStyle = "#7f1d1d" // Dark red background
          ctx.strokeStyle = "#ef4444" // Red border
          roundRect(ctx, endX, endY, 120, 50, 8, true, true)

          // Draw end text
          ctx.fillStyle = "#fecaca" // Light red text
          ctx.font = "14px Arial"
          ctx.fillText("Fim do Quiz", endX + 20, endY + 30)

          // Draw connection line
          drawArrow(ctx, startPos.x + nodeWidth, startPos.y + nodeHeight / 2, endX, endY + 25, "#ef4444")

          // Draw option labels
          const labelX = (startPos.x + nodeWidth + endX) / 2
          const labelY = (startPos.y + nodeHeight / 2 + endY + 25) / 2 - 10

          ctx.fillStyle = "#ef4444" // Red text
          ctx.font = "12px Arial"
          wrapText(ctx, group.options.join(", "), labelX - 60, labelY, 120, 16)
        } else {
          // Draw connection to another question
          const endPos = questionPositions[targetId]

          if (endPos) {
            // Calculate curve control points
            const startX = startPos.x + nodeWidth
            const startY = startPos.y + nodeHeight / 2
            const endX = endPos.x
            const endY = endPos.y + nodeHeight / 2

            // Draw curved connection
            ctx.beginPath()
            ctx.strokeStyle = "#10b981" // Emerald line
            ctx.lineWidth = 2

            // If it's a connection to a question below
            if (endPos.y > startPos.y) {
              const controlX1 = startX + (endX - startX) / 3
              const controlY1 = startY
              const controlX2 = endX - (endX - startX) / 3
              const controlY2 = endY

              ctx.moveTo(startX, startY)
              ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY)
            } else {
              // If it's a connection to a question above or same level
              const midX = (startX + endX) / 2

              ctx.moveTo(startX, startY)
              ctx.bezierCurveTo(midX, startY, midX, endY, endX, endY)
            }

            ctx.stroke()

            // Draw arrow at the end
            const arrowSize = 8
            const angle = Math.atan2(endY - startY, endX - startX)

            ctx.beginPath()
            ctx.moveTo(endX, endY)
            ctx.lineTo(
              endX - arrowSize * Math.cos(angle - Math.PI / 6),
              endY - arrowSize * Math.sin(angle - Math.PI / 6),
            )
            ctx.lineTo(
              endX - arrowSize * Math.cos(angle + Math.PI / 6),
              endY - arrowSize * Math.sin(angle + Math.PI / 6),
            )
            ctx.closePath()
            ctx.fillStyle = "#10b981" // Emerald fill
            ctx.fill()

            // Draw option labels
            const labelX = (startX + endX) / 2
            const labelY = (startY + endY) / 2 - 10

            ctx.fillStyle = "#10b981" // Emerald text
            ctx.font = "12px Arial"
            wrapText(ctx, group.options.join(", "), labelX - 60, labelY, 120, 16)
          }
        }
      })
    })
  }, [quiz])

  // Helper function to draw rounded rectangles
  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fill: boolean,
    stroke: boolean,
  ) {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    if (fill) {
      ctx.fill()
    }
    if (stroke) {
      ctx.stroke()
    }
  }

  // Helper function to draw arrows
  function drawArrow(
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
  ) {
    const headLength = 10
    const angle = Math.atan2(toY - fromY, toX - fromX)

    ctx.beginPath()
    ctx.moveTo(fromX, fromY)
    ctx.lineTo(toX, toY)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()

    // Arrow head
    ctx.beginPath()
    ctx.moveTo(toX, toY)
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6))
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6))
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }

  // Helper function to wrap text
  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
  ) {
    const words = text.split(" ")
    let line = ""
    let testLine = ""
    let lineCount = 0

    for (let n = 0; n < words.length; n++) {
      testLine = line + words[n] + " "
      const metrics = ctx.measureText(testLine)
      const testWidth = metrics.width

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y + lineCount * lineHeight)
        line = words[n] + " "
        lineCount++
      } else {
        line = testLine
      }
    }

    ctx.fillText(line, x, y + lineCount * lineHeight)
  }

  return (
    <div className="overflow-auto bg-gray-900 rounded-lg p-4">
      <canvas ref={canvasRef} className="min-w-full" style={{ minHeight: "600px" }} />
    </div>
  )
}
