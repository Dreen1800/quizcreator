"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  Trash2,
  Plus,
  X,
  BarChart2,
  Settings,
  FileLineChartIcon as FlowChart,
  Layers,
  AlertTriangle,
  FileText,
  Headphones,
  Square,
  Loader,
  ImageIcon,
  BarChart,
  AlignJustify,
  MessageSquare,
  Type,
  LayoutGrid,
  Sliders,
  Palette,
  Users,
  Wrench,
  GripVertical,
  CheckCircle,
  Moon,
  Sun,
  Eye
} from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import type { Quiz, Step, Component, ComponentType, OptionsComponent, ButtonComponent, ImageComponent, TextComponent, GenericComponent, ColorConfig, BorderConfig, AlignmentType } from "@/types/quiz"
import QuizFlowVisualization from "@/components/quiz-flow-visualization"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
  UniqueIdentifier,
  rectIntersection,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// --- Type Guards ---
function isButtonComponent(component: Component): component is ButtonComponent {
  return component.type === 'Button';
}

function isTextComponent(component: Component): component is TextComponent {
  return component.type === 'Text';
}

function isImageComponent(component: Component): component is ImageComponent {
  return component.type === 'Image';
}

function isOptionsComponent(component: Component): component is OptionsComponent {
  return component.type === 'Options';
}

function ButtonDisplay({ component, previewTheme }: { component: ButtonComponent, previewTheme: string }) {
  // Default values for padding and margin
  const defaultPadding = component.size === 'small'
    ? { top: 8, right: 16, bottom: 8, left: 16 }
    : component.size === 'large'
      ? { top: 12, right: 24, bottom: 12, left: 24 }
      : { top: 10, right: 20, bottom: 10, left: 20 };

  const padding = component.padding || defaultPadding;
  const margin = component.margin || { top: 0, right: 0, bottom: 0, left: 0 };
  const gradientDirection = component.color.gradientDirection || "to right";
  
  // Determine text color based on background for better contrast
  const getTextColor = () => {
    if (previewTheme === 'white') {
      return '#000000'; // Black text on white background
    } else if (previewTheme === 'dark' || previewTheme === 'blue' || previewTheme === 'green' || 
               previewTheme === 'purple' || previewTheme === 'pink') {
      return '#ffffff'; // White text on dark/colored backgrounds
    } else if (previewTheme === 'custom') {
      // For custom colors, we would need a luminance calculation
      // This is a simplified version
      return '#000000';
    } else {
      return '#000000'; // Default to black
    }
  };

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
          color: getTextColor(),
        }}
      >
        {component.text}
      </Button>
    </div>
  );
}

function TextDisplay({ component, previewTheme }: { component: TextComponent, previewTheme: string }) {
  const TagName = component.htmlTag;

  // More sophisticated color adjustment logic based on preview theme
  const getAdjustedTextColor = () => {
    // If text is white and background is light, convert to black
    if (component.color === '#FFFFFF' && 
        (previewTheme === 'white' || previewTheme === 'gray' || previewTheme === 'custom')) {
      return '#000000';
    }
    
    // If text is black and background is dark, convert to white
    if (component.color === '#000000' && 
        (previewTheme === 'dark' || previewTheme === 'blue' || 
         previewTheme === 'green' || previewTheme === 'purple' || 
         previewTheme === 'pink' || previewTheme === 'orange')) {
      return '#FFFFFF';
    }
    
    // Otherwise use the color as specified
    return component.color;
  };

  const textStyle = {
    color: getAdjustedTextColor(),
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

function ImageDisplay({ component }: { component: ImageComponent }) {
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
        <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
          <ImageIcon className="h-8 w-8 mr-2" /> Sem Imagem
        </div>
      )}
    </div>
  );
}

function OptionsDisplay({ component, previewTheme }: { component: OptionsComponent, previewTheme: string }) {
  // Get appropriate text color based on background for better contrast
  const getTextColor = () => {
    if (previewTheme === 'white' || previewTheme === 'gray') {
      return '#000000'; // Black text on light backgrounds
    } else if (previewTheme === 'dark' || previewTheme === 'blue' || 
               previewTheme === 'green' || previewTheme === 'purple' || 
               previewTheme === 'pink' || previewTheme === 'orange') {
      return '#FFFFFF'; // White text on dark/colored backgrounds
    } else if (previewTheme === 'custom') {
      // For custom colors, we'd need color analysis
      return '#000000'; // Default to black for custom
    } else {
      return '#000000'; // Default to black
    }
  };
  
  const textColor = getTextColor();
  
  return (
    <div className="w-full pointer-events-none">
      <p className="mb-3 font-medium text-center" style={{ color: textColor }}>{component.text}</p>
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
              color: textColor,
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}
          >
            {option.text || "Opção sem texto"}
          </Button>
        ))}
      </div>
    </div>
  );
}

function SortableComponentItem(
  {
    id,
    component,
    isSelected,
    renderComponent,
    onClick,
  }: {
    id: string;
    component: Component;
    isSelected: boolean;
    renderComponent: (component: Component) => React.ReactNode;
    onClick: () => void;
  }) {
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
    border: isSelected ? '1px solid #10B981' : '1px solid rgba(75, 85, 99, 0.5)',
    backgroundColor: isSelected ? 'rgba(31, 41, 55, 0.2)' : 'transparent',
    borderRadius: '0.375rem',
    padding: '1rem',
    cursor: 'pointer',
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} onClick={onClick} className="dark:bg-opacity-30 bg-opacity-5">
      <button
        {...attributes}
        {...listeners}
        aria-label="Arrastar para reordenar"
        className="absolute top-1 right-1 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-white cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      {renderComponent(component)}
    </div>
  );
}

// Toast component
function Toast({ message, visible, onClose }: { message: string; visible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 dark:bg-gray-900 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 z-50 border border-gray-700">
      <CheckCircle className="h-4 w-4 text-emerald-500" />
      <span className="text-sm">{message}</span>
    </div>
  );
}

export default function QuizEditor({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isNew = params.id === "new"
  const [quiz, setQuiz] = useState<Quiz>({
    id: isNew ? uuidv4() : params.id,
    title: "Quiz sem Título",
    steps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  const [activeTab, setActiveTab] = useState("construtor")
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null)
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<Component | null>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark') // Default theme
  const [previewBackground, setPreviewBackground] = useState<string>('white') // Default preview background
  const [toast, setToast] = useState({ visible: false, message: "" });

  // Detect system preference on first load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('quizEditorTheme');
      if (savedTheme) {
        setTheme(savedTheme as 'dark' | 'light');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    }
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('quizEditorTheme', theme);
  }, [theme]);

  // We'll keep DnD for reordering components within the canvas
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const { setNodeRef: setDroppableNodeRef, isOver: isOverCanvas } = useDroppable({
    id: 'canvas-drop-area',
    data: { isCanvas: true },
  })

  const getSelectedStep = useCallback((): Step | null => {
    if (!selectedStepId) return null
    return quiz.steps.find((step) => step.id === selectedStepId) || null
  }, [quiz.steps, selectedStepId])

  const getSelectedComponent = useCallback((): Component | null => {
    const step = getSelectedStep()
    if (!step || !selectedComponentId) return null
    return step.components.find(comp => comp.id === selectedComponentId) || null
  }, [getSelectedStep, selectedComponentId])

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
    // Set selected step *after* state update, if needed
    if (quiz.steps.length === 0 || !selectedStepId) {
      setSelectedStepId(newStepId)
    }
  }, [quiz.steps, selectedStepId])

  useEffect(() => {
    if (!isNew) {
      const savedQuizzes = localStorage.getItem("quizzes")
      if (savedQuizzes) {
        const quizzes: Quiz[] = JSON.parse(savedQuizzes)
        const existingQuiz = quizzes.find((q) => q.id === params.id)
        if (existingQuiz) {
          const migratedQuiz = {
            ...existingQuiz,
            steps: existingQuiz.steps || [],
            title: existingQuiz.title || "Quiz Carregado Sem Título"
          }
          setQuiz(migratedQuiz)
          if (migratedQuiz.steps.length > 0) {
            setSelectedStepId(migratedQuiz.steps[0].id)
          }
        } else {
          console.error("Quiz not found, redirecting.")
          router.push("/")
        }
      } else {
        console.error("No quizzes found in storage, redirecting.")
        router.push("/")
      }
    } else {
      // Ensure addStep is defined when this runs
      if (quiz.steps.length === 0) { // Avoid calling addStep on re-renders if steps exist
        addStep()
      }
    }
  }, [isNew, params.id, router, quiz.steps.length, addStep])

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

    // Mostrar mensagem de toast
    setToast({ visible: true, message: "Quiz salvo com sucesso!" });

    if (isNew) {
      if (router && typeof router.push === 'function' && params.id !== updatedQuiz.id) {
        router.push(`/editor/${updatedQuiz.id}`, { scroll: false })
      }
    }
  }, [quiz, isNew, params.id, router])

  // Função específica para publicar o quiz
  const publishQuiz = useCallback(() => {
    // Primeiro salva o quiz
    saveQuiz();

    // Depois mostra a mensagem de publicação
    setTimeout(() => {
      setToast({ visible: true, message: "Quiz publicado e disponível para uso!" });
    }, 300);  // Pequeno delay para não sobrepor a mensagem de salvar
  }, [saveQuiz]);

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

  const updateStep = useCallback((stepId: string, updates: Partial<Step>) => {
    setQuiz((prev) => ({
      ...prev,
      steps: prev.steps.map((step) =>
        step.id === stepId ? { ...step, ...updates } : step
      ),
    }))
  }, [])

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
          color: "#000000", // Default black text for better visibility on white background
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
            solid: "#1e293b", // slate-800
            isGradient: false
          },
          border: {
            size: 1,
            color: "#334155", // slate-700
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

  const componentsList = [
    { icon: <Type className="h-5 w-5" />, name: "Texto", type: "Text" as ComponentType },
    { icon: <ImageIcon className="h-5 w-5" />, name: "Imagem", type: "Image" as ComponentType },
    { icon: <Square className="h-5 w-5" />, name: "Botão", type: "Button" as ComponentType },
    { icon: <BarChart2 className="h-5 w-5" />, name: "Opções", type: "Options" as ComponentType },
  ]

  const currentStepData = getSelectedStep()

  const renderComponentInCanvas = (component: Component) => {
    if (isButtonComponent(component)) return <ButtonDisplay component={component} previewTheme={previewBackground} />;
    if (isTextComponent(component)) return <TextDisplay component={component} previewTheme={previewBackground} />;
    if (isImageComponent(component)) return <ImageDisplay component={component} />;
    if (isOptionsComponent(component)) return <OptionsDisplay component={component} previewTheme={previewBackground} />;

    // Default case for unimplemented types
    return (
      <div className="text-xs text-center text-gray-500 dark:text-gray-400 py-2">
        (Visualização para "{component.type}" não implementada)
      </div>
    );
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={rectIntersection}
    >
      <div className={`flex h-screen flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-white transition-colors duration-200`}>
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-2">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Fechar Editor">
              <X className="h-5 w-5" />
            </Button>
            <Input 
              value={quiz.title}
              onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
              className="text-lg font-medium bg-transparent border-none focus-visible:ring-1 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-700 w-48 sm:w-64 md:w-80"
              placeholder="Quiz sem Título"
            />
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant={activeTab === "construtor" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("construtor")}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
              size="sm"
            >
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Construtor</span>
            </Button>
            <Button
              variant={activeTab === "fluxo" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("fluxo")}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
              size="sm"
            >
              <FlowChart className="h-4 w-4" />
              <span className="hidden sm:inline">Fluxo</span>
            </Button>
            <Button
              variant={activeTab === "design" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("design")}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
              size="sm"
            >
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Design</span>
            </Button>
            <Button
              variant={activeTab === "leads" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("leads")}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
              size="sm"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Leads</span>
            </Button>
            <Button
              variant={activeTab === "configuracoes" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("configuracoes")}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
              size="sm"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configurações</span>
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Theme toggle button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleTheme}
                    className="border-gray-200 dark:border-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button
              variant="outline"
              className="border-gray-200 dark:border-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm flex items-center gap-1.5"
              onClick={saveQuiz}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M1.5 1.5H11.5L13.5 3.5V13.5H1.5V1.5ZM3.5 3.5V7.5H11.5V3.5H3.5ZM11.5 9.5H3.5V11.5H11.5V9.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Salvar
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm flex items-center gap-1.5"
              onClick={publishQuiz}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M7.5 1.5L9.5 3.5L12.5 0.5L14.5 2.5L11.5 5.5L13.5 7.5L7.5 13.5L1.5 7.5L3.5 5.5L0.5 2.5L2.5 0.5L5.5 3.5L7.5 1.5Z" fill="currentColor" />
              </svg>
              Publicar
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 p-2">
              <div className="flex items-center justify-between mb-2 px-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Etapas</h3>
                <Button variant="ghost" size="sm" onClick={addStep} className="h-7 px-2 text-emerald-500 hover:text-emerald-400">
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>

              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {quiz.steps.map((step, index) => (
                  <Button
                    key={step.id}
                    variant={selectedStepId === step.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      setSelectedStepId(step.id)
                      setSelectedComponentId(null)
                    }}
                  >
                    {step.name || `Etapa ${index + 1}`}
                  </Button>
                ))}
                {quiz.steps.length === 0 && (
                  <p className="text-xs text-gray-500 px-2 py-4 text-center">Clique em 'Adicionar' para criar sua primeira etapa.</p>
                )}
              </div>
            </div>

            {/* Sidebar info section */}
            <div className="flex-grow p-4 text-sm text-gray-600 dark:text-gray-400">
              <h3 className="font-medium mb-2">Instruções</h3>
              <p className="text-gray-500 mb-4">Selecione uma etapa para editar seu conteúdo. Use o botão "Adicionar Componente" para incluir elementos na sua etapa.</p>

              <h4 className="font-medium mt-4 mb-1">Componentes disponíveis:</h4>
              <ul className="list-disc pl-5 text-xs space-y-1 text-gray-500">
                <li>Botões de ação</li>
                <li>Campos de entrada</li>
                <li>Imagens</li>
                <li>Seleção de opções</li>
                <li>E muito mais!</li>
              </ul>
            </div>
          </div>

          <div className="w-80 border-l border-gray-200 dark:border-gray-800 overflow-y-auto p-4 space-y-6 bg-white dark:bg-gray-900">
            {activeTab === "construtor" && currentStepData && !selectedComponentId && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Título da Etapa</h3>
                  <Input
                    value={currentStepData.title}
                    onChange={(e) => updateStep(selectedStepId!, { title: e.target.value })}
                    placeholder="Título exibido na etapa"
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Nome da Etapa (interno)</h3>
                  <Input
                    value={currentStepData.name}
                    onChange={(e) => updateStep(selectedStepId!, { name: e.target.value })}
                    placeholder="Nome interno da etapa"
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">Usado para navegação e identificação.</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Configurações do Header</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-logo" className="text-sm text-gray-700 dark:text-gray-300">
                        Mostrar Logo
                      </Label>
                      <Switch
                        id="show-logo"
                        checked={currentStepData.showLogo ?? true}
                        onCheckedChange={(checked) => updateStep(selectedStepId!, { showLogo: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-progress" className="text-sm text-gray-700 dark:text-gray-300">
                        Mostrar Progresso
                      </Label>
                      <Switch
                        id="show-progress"
                        checked={currentStepData.showProgress ?? true}
                        onCheckedChange={(checked) => updateStep(selectedStepId!, { showProgress: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="allow-return" className="text-sm text-gray-700 dark:text-gray-300">
                        Permitir Voltar
                      </Label>
                      <Switch
                        id="allow-return"
                        checked={currentStepData.allowReturn ?? true}
                        onCheckedChange={(checked) => updateStep(selectedStepId!, { allowReturn: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                  <Button
                    variant="outline"
                    className="w-full border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => removeStep(selectedStepId!)}
                    disabled={quiz.steps.length <= 1}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remover Etapa
                  </Button>
                </div>
              </>
            )}

            {activeTab === "construtor" && currentStepData && selectedComponentId && getSelectedComponent() && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Propriedades: {getSelectedComponent()?.type}
                  </h3>
                  {renderComponentPropertiesForm(
                    selectedStepId!,
                    getSelectedComponent()!,
                    updateComponent,
                    quiz.steps,
                    theme
                  )}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                  <Button
                    variant="outline"
                    className="w-full border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => removeComponent(selectedStepId!, selectedComponentId!)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remover Componente
                  </Button>
                </div>
              </>
            )}

            {activeTab === "construtor" && !currentStepData && (
              <p className="text-sm text-gray-500 text-center mt-10">Selecione ou adicione uma etapa para ver as propriedades.</p>
            )}

            {activeTab === "fluxo" && <p className="text-sm text-gray-500">Configurações do Fluxo (WIP)</p>}
            {activeTab === "design" && <p className="text-sm text-gray-500">Opções de Design (WIP)</p>}
            {activeTab === "leads" && <p className="text-sm text-gray-500">Opções de Leads (WIP)</p>}
            {activeTab === "configuracoes" && <p className="text-sm text-gray-500">Configurações Gerais do Quiz (WIP)</p>}
          </div>

          <div
            ref={setDroppableNodeRef}
            className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900"
          >
            {activeTab === "construtor" && currentStepData && (
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  {/* Preview background color selector */}
                  <div className="mb-4 flex flex-wrap items-center gap-3 justify-end">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Background:
                      </Label>
                      <div className="flex items-center gap-1">
                        <select
                          value={previewBackground}
                          onChange={e => setPreviewBackground(e.target.value)}
                          className="h-8 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm text-gray-900 dark:text-gray-100"
                        >
                          <option value="white">Branco</option>
                          <option value="dark">Escuro</option>
                          <option value="blue">Azul</option>
                          <option value="green">Verde</option>
                          <option value="purple">Roxo</option>
                          <option value="pink">Rosa</option>
                          <option value="orange">Laranja</option>
                          <option value="gray">Cinza</option>
                          <option value="custom">Personalizado</option>
                        </select>
                        
                        {previewBackground === 'custom' ? (
                          <div className="flex items-center ml-2">
                            <input
                              type="color"
                              value="#ffffff"
                              onChange={e => setPreviewBackground(e.target.value)}
                              className="w-8 h-8 p-1 border border-gray-300 dark:border-gray-700 rounded-md cursor-pointer"
                            />
                          </div>
                        ) : (
                          <div 
                            className="h-6 w-6 rounded-full border border-gray-300 dark:border-gray-700 ml-2"
                            style={{
                              backgroundColor: 
                                previewBackground === 'white' ? '#ffffff' :
                                previewBackground === 'dark' ? '#1f2937' :
                                previewBackground === 'blue' ? '#2563eb' :
                                previewBackground === 'green' ? '#059669' :
                                previewBackground === 'purple' ? '#7c3aed' :
                                previewBackground === 'pink' ? '#db2777' :
                                previewBackground === 'orange' ? '#ea580c' :
                                previewBackground === 'gray' ? '#6b7280' :
                                previewBackground
                            }}
                          />
                        )}
                      </div>
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={() => setPreviewBackground('white')} 
                            variant="outline" 
                            size="sm"
                            className="h-8 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1">
                              <path d="M7.5 2C4.46243 2 2 4.46243 2 7.5C2 10.5376 4.46243 13 7.5 13C10.5376 13 13 10.5376 13 7.5C13 4.46243 10.5376 2 7.5 2ZM1 7.5C1 3.91015 3.91015 1 7.5 1C11.0899 1 14 3.91015 14 7.5C14 11.0899 11.0899 14 7.5 14C3.91015 14 1 11.0899 1 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              <path d="M7.5 10.625C9.22589 10.625 10.625 9.22589 10.625 7.5C10.625 5.77411 9.22589 4.375 7.5 4.375C5.77411 4.375 4.375 5.77411 4.375 7.5C4.375 9.22589 5.77411 10.625 7.5 10.625Z" fill="currentColor"></path>
                            </svg>
                            Resetar
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Voltar para o background padrão (branco)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={() => window.open('', '_blank')} 
                            variant="outline" 
                            size="sm"
                            className="h-8 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Abrir visualização em tela cheia</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Quiz preview area with the selected background color */}
                  <div className="rounded-lg overflow-hidden shadow-lg transition-all duration-200"
                    style={{
                      backgroundColor: 
                        previewBackground === 'white' ? '#ffffff' :
                        previewBackground === 'dark' ? '#1f2937' :
                        previewBackground === 'blue' ? '#2563eb' :
                        previewBackground === 'green' ? '#059669' :
                        previewBackground === 'purple' ? '#7c3aed' :
                        previewBackground === 'pink' ? '#db2777' :
                        previewBackground === 'orange' ? '#ea580c' :
                        previewBackground === 'gray' ? '#6b7280' :
                        previewBackground
                    }}
                  >
                    <div className="p-6">
                      {currentStepData.showLogo && (
                        <div className="flex justify-center mb-4">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                          </div>
                        </div>
                      )}

                      {currentStepData.showProgress && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${((quiz.steps.findIndex(s => s.id === selectedStepId) + 1) / quiz.steps.length) * 100}%` }}
                          ></div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        {currentStepData.allowReturn && quiz.steps.findIndex(s => s.id === selectedStepId) > 0 && (
                          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            onClick={() => { /* TODO: Navigate to previous step */ }}
                          >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Voltar
                          </Button>
                        )}
                        <div />
                      </div>

                      {/* Components area */}
                      <div className="space-y-4 mt-4">
                        {currentStepData.components.length === 0 ? (
                          <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">Nada por aqui 😢</p>
                            <p className="text-gray-500">Clique em "Adicionar Componente" para começar.</p>
                          </div>
                        ) : (
                          <SortableContext items={currentStepData.components.map(c => c.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-4 min-h-[200px]">
                              {currentStepData.components.map(component => (
                                <SortableComponentItem
                                  key={component.id}
                                  id={component.id}
                                  component={component}
                                  isSelected={selectedComponentId === component.id}
                                  renderComponent={renderComponentInCanvas}
                                  onClick={() => setSelectedComponentId(component.id)}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add component button - Now positioned below and styled with theme support */}
                {selectedStepId && (
                  <div className="flex justify-center mt-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow-sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Componente
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-black dark:text-white">
                        <DialogHeader>
                          <DialogTitle className="text-gray-900 dark:text-white">Selecione um componente</DialogTitle>
                          <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Clique em um componente para adicioná-lo à etapa atual.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                          <div className="grid grid-cols-2 gap-3 p-4">
                            {componentsList.map((component) => (
                              <Button
                                key={component.type}
                                variant="outline"
                                className="flex flex-col h-28 p-4 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                                onClick={() => {
                                  addComponent(selectedStepId, component.type);
                                }}
                              >
                                <div className="mb-3 text-emerald-500">
                                  {component.icon}
                                </div>
                                <span className="text-sm font-medium">{component.name}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            )}

            {activeTab === "construtor" && !currentStepData && quiz.steps.length > 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-gray-600 dark:text-gray-400">Selecione uma etapa na barra lateral esquerda para começar a editar.</p>
              </div>
            )}

            {activeTab === "construtor" && quiz.steps.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Quiz Vazio 😢</p>
                <p className="text-gray-500 mb-6">Adicione sua primeira etapa usando o botão '+' na barra lateral esquerda.</p>
              </div>
            )}

            {activeTab === "fluxo" && (
              <div className="h-full">
                <p className="text-gray-600 dark:text-gray-400">Visualização do fluxo ainda não implementada.</p>
              </div>
            )}
            {activeTab === "design" && <p className="text-gray-600 dark:text-gray-400">Opções de Design (WIP)</p>}
            {activeTab === "leads" && <p className="text-gray-600 dark:text-gray-400">Visualização de Leads (WIP)</p>}
            {activeTab === "configuracoes" && <p className="text-gray-600 dark:text-gray-400">Configurações Gerais (WIP)</p>}
          </div>
        </div>
      </div>
      <DragOverlay>
        {draggedItem ? (
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow-lg opacity-90 min-w-[200px]">
            {renderComponentInCanvas(draggedItem)}
          </div>
        ) : null}
      </DragOverlay>

      {/* Toast with theme support */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </DndContext>
  )
}