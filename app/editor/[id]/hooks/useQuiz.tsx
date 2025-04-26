"use client"

import { useState, useCallback, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { Quiz, Step, Component, ComponentType, ButtonComponent, TextComponent, ImageComponent, OptionsComponent } from "@/types/quiz"

export default function useQuiz(id: string, isNew: boolean, router: any) {
  // Quiz state
  const [quiz, setQuiz] = useState<Quiz>({
    id: isNew ? uuidv4() : id,
    title: "Quiz sem Título",
    steps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      backgroundColor: "#FFFFFF", // Default white background
      showBranding: true,
      fontFamily: "Roboto"
    }
  })
  
  // UI state
  const [activeTab, setActiveTab] = useState("construtor")
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null)
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<Component | null>(null)
  const [toast, setToast] = useState({ visible: false, message: "" })

  // Initialize quiz from localStorage if not new
  useEffect(() => {
    if (!isNew) {
      const savedQuizzes = localStorage.getItem("quizzes")
      if (savedQuizzes) {
        const quizzes: Quiz[] = JSON.parse(savedQuizzes)
        const existingQuiz = quizzes.find((q) => q.id === id)
        if (existingQuiz) {
          // Ensure the quiz has the new settings field with defaults
          const migratedQuiz = {
            ...existingQuiz,
            steps: existingQuiz.steps || [],
            title: existingQuiz.title || "Quiz Carregado Sem Título",
            settings: existingQuiz.settings || {
              backgroundColor: "#FFFFFF",
              showBranding: true,
              fontFamily: "Roboto"
            }
          }
          setQuiz(migratedQuiz)
          if (migratedQuiz.steps.length > 0) {
            setSelectedStepId(migratedQuiz.steps[0].id)
          }
        }
      }
    } else {
      // Create initial step for new quiz
      if (quiz.steps.length === 0) {
        addStep()
      }
    }
  }, [isNew, id])

  // Get selected step
  const getSelectedStep = useCallback((): Step | null => {
    if (!selectedStepId) return null
    return quiz.steps.find((step) => step.id === selectedStepId) || null
  }, [quiz.steps, selectedStepId])

  // Get selected component
  const getSelectedComponent = useCallback((): Component | null => {
    const step = getSelectedStep()
    if (!step || !selectedComponentId) return null
    return step.components.find(comp => comp.id === selectedComponentId) || null
  }, [getSelectedStep, selectedComponentId])

  // Update quiz settings
  const updateQuizSettings = useCallback((updates: Partial<Quiz['settings']>) => {
    setQuiz(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updates
      }
    }))
  }, [])

  // Add step
  const addStep = useCallback(() => {
    const newStepId = uuidv4()
    const newStep: Step = {
      id: newStepId,
      name: `Etapa ${quiz.steps.length + 1}`,
      title: `Título da Etapa ${quiz.steps.length + 1}`,
      components: [],
      showLogo: true,
      showProgress: true,
      allowReturn: true,
    }
    
    setQuiz((prev) => {
      const updatedSteps = [...prev.steps, newStep]
      return {
        ...prev,
        steps: updatedSteps,
      }
    })
    
    // Set selected step after state update if needed
    if (quiz.steps.length === 0 || !selectedStepId) {
      setSelectedStepId(newStepId)
    }
  }, [quiz.steps, selectedStepId])

  // Remove step
  const removeStep = useCallback((stepIdToRemove: string) => {
    setQuiz((prev) => {
      const updatedSteps = prev.steps.filter((step) => step.id !== stepIdToRemove)

      const renumberedSteps = updatedSteps.map((step, index) => ({
        ...step,
        name: `Etapa ${index + 1}`,
      }))

      const finalSteps = renumberedSteps.map(step => ({
        ...step,
        components: step.components.map(comp => {
          if (comp.type === 'Options') {
            return {
              ...comp,
              options: comp.options.map(opt => ({
                ...opt,
                nextStepId: opt.nextStepId === stepIdToRemove ? null : opt.nextStepId
              }))
            }
          }
          return comp
        })
      }))

      let newSelectedStepId = selectedStepId
      if (selectedStepId === stepIdToRemove) {
        const currentIndex = prev.steps.findIndex(s => s.id === stepIdToRemove)
        if (finalSteps.length > 0) {
          const newIndex = Math.max(0, currentIndex - 1)
          newSelectedStepId = finalSteps[newIndex].id
        } else {
          newSelectedStepId = null
        }
      }
      setSelectedStepId(newSelectedStepId)

      return {
        ...prev,
        steps: finalSteps,
      }
    })
    setSelectedComponentId(null)
  }, [quiz.steps, selectedStepId])

  // Update step
  const updateStep = useCallback((stepId: string, updates: Partial<Step>) => {
    setQuiz((prev) => ({
      ...prev,
      steps: prev.steps.map((step) =>
        step.id === stepId ? { ...step, ...updates } : step
      ),
    }))
  }, [])

  // Add component
  const addComponent = useCallback((stepId: string, componentType: ComponentType) => {
    if (!stepId) {
      console.error("Cannot add component: No step selected")
      return
    }

    let newComponent: Component
    const newId = uuidv4()

    switch (componentType) {
      case "Button":
        newComponent = {
          id: newId,
          type: "Button",
          text: "Botão",
          action: "nextStep",
          size: "medium",
          alignment: "center",
          color: {
            solid: "#10b981", // emerald-500
            isGradient: false,
            gradientFrom: "#10b981",
            gradientTo: "#3b82f6",
            gradientDirection: "to right"
          },
          border: {
            size: 0,
            color: "#FFFFFF",
            radius: 8
          },
          padding: {
            top: 10,
            right: 20,
            bottom: 10,
            left: 20
          },
          margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        } as ButtonComponent;
        break;
      case "Text":
        newComponent = {
          id: newId,
          type: "Text",
          content: "Seu texto aqui",
          size: "medium",
          color: "#000000", // Default black text for light theme
          alignment: "left",
          htmlTag: "p",
          fontFamily: "Roboto",
          fontWeight: "400"
        } as TextComponent;
        break;
      case "Image":
        newComponent = {
          id: newId,
          type: "Image",
          src: "",
          alt: "Imagem",
          size: "medium",
          border: {
            size: 0,
            color: "transparent",
            radius: 8
          }
        } as ImageComponent;
        break;
      case "Options":
        newComponent = {
          id: newId,
          type: "Options",
          text: "Qual sua escolha?",
          options: [
            { id: uuidv4(), text: "Opção 1", nextStepId: null },
            { id: uuidv4(), text: "Opção 2", nextStepId: null },
          ],
          size: "medium",
          color: {
            solid: "#f3f4f6", // gray-100 for light theme
            isGradient: false
          },
          border: {
            size: 1,
            color: "#e5e7eb", // gray-200
            radius: 8
          }
        } as OptionsComponent;
        break;
      default:
        console.warn(`Component type "${componentType}" not fully handled yet.`)
        newComponent = { id: newId, type: componentType } as any;
    }

    // @ts-ignore TypeScript has difficulty with the types here
    setQuiz(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId
          ? { ...step, components: [...step.components, newComponent] }
          : step
      )
    }));
    setSelectedComponentId(newId);
  }, [])

  // Update component
  const updateComponent = useCallback((stepId: string, componentId: string, updates: Partial<Component>) => {
    // @ts-ignore TypeScript has difficulty with the types in this function
    setQuiz(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId
          ? {
            ...step,
            components: step.components.map(comp =>
              comp.id === componentId ? { ...comp, ...updates } : comp
            )
          }
          : step
      )
    }))
  }, [])

  // Remove component
  const removeComponent = useCallback((stepId: string, componentId: string) => {
    // @ts-ignore TypeScript has difficulty with the types in this function
    setQuiz(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId
          ? { ...step, components: step.components.filter(comp => comp.id !== componentId) }
          : step
      )
    }))
    if (selectedComponentId === componentId) {
      setSelectedComponentId(null)
    }
  }, [selectedComponentId])

  // Handle drag start
  const handleDragStart = useCallback((event: DragEndEvent) => {
    const { active } = event;
    console.log('Drag started:', active.id, active.data.current);

    // We're only doing canvas drag and drop now, not from palette
    const step = getSelectedStep();
    if (step) {
      const component = step.components.find(c => c.id === active.id);
      setDraggedItem(component || null);
    }
  }, [getSelectedStep]);

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedItem(null);

    console.log('Drag End Fired:', event);
    console.log('Active ID:', active.id, 'Data:', active.data.current);
    console.log('Over ID:', over?.id, 'Data:', over?.data.current);

    // We only handle reordering components in the canvas now
    if (over?.id !== undefined) {
      const step = getSelectedStep();
      if (!step || !selectedStepId) return;

      // Check if the active ID is a component in the canvas
      const activeIndex = step.components.findIndex(c => c.id === active.id);
      if (activeIndex === -1) return;

      // If dropped on another component or on the canvas area
      if (over.id === 'canvas-drop-area' || step.components.some(c => c.id === over.id)) {
        console.log('Reordering components in canvas');

        // Determine the new index
        let newIndex: number;
        if (over.id === 'canvas-drop-area') {
          // If dropped on the canvas in general, move to the end
          newIndex = step.components.length - 1;
        } else {
          // If dropped on another component, replace its position
          newIndex = step.components.findIndex(c => c.id === over.id);
          if (newIndex === -1) newIndex = step.components.length - 1;
        }

        // Use arrayMove to reorganize and update the state
        const reorderedComponents = arrayMove(step.components, activeIndex, newIndex);

        // Update the state with the correct typing
        setQuiz(prevQuiz => ({
          ...prevQuiz,
          steps: prevQuiz.steps.map(s =>
            s.id === step.id ? { ...s, components: reorderedComponents } : s
          )
        }));
      }
    }
  }, [selectedStepId, getSelectedStep, setQuiz]);

  // Save quiz
  const saveQuiz = useCallback(() => {
    const savedQuizzes = localStorage.getItem("quizzes")
    const quizzes: Quiz[] = savedQuizzes ? JSON.parse(savedQuizzes) : []

    const updatedQuiz: Quiz = {
      ...quiz,
      updatedAt: new Date().toISOString(),
    }

    const existingIndex = quizzes.findIndex((q) => q.id === updatedQuiz.id)

    if (existingIndex >= 0) {
      quizzes[existingIndex] = updatedQuiz
    } else {
      quizzes.push(updatedQuiz)
    }

    localStorage.setItem("quizzes", JSON.stringify(quizzes))

    // Show toast message
    setToast({ visible: true, message: "Quiz salvo com sucesso!" });

    if (isNew) {
      if (router && typeof router.push === 'function' && id !== updatedQuiz.id) {
        router.push(`/editor/${updatedQuiz.id}`, { scroll: false })
      }
    }
  }, [quiz, isNew, id, router])

  // Publish quiz
  const publishQuiz = useCallback(() => {
    // First save the quiz
    saveQuiz();

    // Then show the publication message
    setTimeout(() => {
      setToast({ visible: true, message: "Quiz publicado e disponível para uso!" });
    }, 300);  // Small delay to avoid overlapping with save message
  }, [saveQuiz]);

  return {
    quiz,
    activeTab,
    selectedStepId,
    selectedComponentId,
    draggedItem,
    toast,
    setActiveTab,
    setSelectedStepId,
    setSelectedComponentId,
    setDraggedItem,
    setToast,
    getSelectedStep,
    getSelectedComponent,
    addStep,
    removeStep,
    updateStep,
    addComponent,
    updateComponent,
    removeComponent,
    handleDragStart,
    handleDragEnd,
    saveQuiz,
    publishQuiz,
    updateQuizSettings,
  }
}