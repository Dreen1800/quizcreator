"use client"

import { Button } from "@/components/ui/button"
import { X, Wrench, FileLineChartIcon as FlowChart, Palette, Users, Settings, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

// Componente ThemeToggle simplificado - alterna diretamente entre claro e escuro
function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="h-8 w-8 px-0"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}

interface EditorHeaderProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  saveQuiz: () => void
  publishQuiz: () => void
  router: any
}

export default function EditorHeader({ activeTab, setActiveTab, saveQuiz, publishQuiz, router }: EditorHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-2 bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.push("/")} 
          className="mr-2" 
          aria-label="Fechar Editor"
        >
          <X className="h-5 w-5" />
        </Button>
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
        <ThemeToggle />
        <Button
          variant="outline"
          className="border-gray-300 dark:border-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-gray-300 text-sm flex items-center gap-1.5"
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
  )
}