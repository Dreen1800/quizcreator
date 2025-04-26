"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  PlusCircle, 
  Search, 
  Calendar, 
  BarChart2, 
  Clock, 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  Share2, 
  Tag, 
  Star, 
  StarOff,
  Filter,
  X,
  Layers,
  FileText,
  MessageCircle,
  CheckCircle,
  SlidersHorizontal,
  ChevronDown,
  Moon,
  Sun
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Quiz } from "@/types/quiz"

type Category = "all" | "favorites" | "published" | "drafts" | "archived";
type SortOption = "recent" | "name" | "popular" | "steps";

export default function HomePage() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<Category>("all")
  const [sortOption, setSortOption] = useState<SortOption>("recent")
  const [favorites, setFavorites] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(true) // Default to dark theme

  // Load quizzes from localStorage
  useEffect(() => {
    const savedQuizzes = localStorage.getItem("quizzes")
    if (savedQuizzes) {
      const parsedQuizzes = JSON.parse(savedQuizzes);
      setQuizzes(parsedQuizzes)
      setFilteredQuizzes(parsedQuizzes)
    }
    
    // Load favorites
    const savedFavorites = localStorage.getItem("quiz_favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
    
    // Load theme preference
    const savedTheme = localStorage.getItem("quiz_theme")
    if (savedTheme) {
      setIsDarkTheme(savedTheme === "dark")
    }
  }, [])

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    let result = [...quizzes]
    
    // Apply category filter
    if (activeCategory === "favorites") {
      result = result.filter(quiz => favorites.includes(quiz.id))
    } else if (activeCategory === "published") {
      result = result.filter(quiz => quiz.isPublished)
    } else if (activeCategory === "drafts") {
      result = result.filter(quiz => !quiz.isPublished)
    } else if (activeCategory === "archived") {
      result = result.filter(quiz => quiz.isArchived)
    }
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(quiz => 
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortOption === "recent") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      } else if (sortOption === "name") {
        return a.title.localeCompare(b.title)
      } else if (sortOption === "steps") {
        return (b.steps?.length || 0) - (a.steps?.length || 0)
      } else if (sortOption === "popular") {
        return (b.responseCount || 0) - (a.responseCount || 0)
      }
      return 0
    })
    
    setFilteredQuizzes(result)
  }, [quizzes, searchTerm, activeCategory, sortOption, favorites])

  const createNewQuiz = () => {
    router.push("/editor/new")
  }

  const editQuiz = (id: string) => {
    router.push(`/editor/${id}`)
  }

  const previewQuiz = (id: string) => {
    router.push(`/preview/${id}`)
  }

  const deleteQuiz = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este quiz?")) {
      const updatedQuizzes = quizzes.filter((quiz) => quiz.id !== id)
      setQuizzes(updatedQuizzes)
      localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes))
    }
  }

  const duplicateQuiz = (quiz: Quiz) => {
    const newQuiz = {
      ...quiz,
      id: Math.random().toString(36).substring(2, 9),
      title: `${quiz.title} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responseCount: 0,
      isPublished: false,
    }
    
    const updatedQuizzes = [...quizzes, newQuiz]
    setQuizzes(updatedQuizzes)
    localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes))
  }

  const toggleFavorite = (id: string) => {
    let newFavorites: string[]
    
    if (favorites.includes(id)) {
      newFavorites = favorites.filter(fav => fav !== id)
    } else {
      newFavorites = [...favorites, id]
    }
    
    setFavorites(newFavorites)
    localStorage.setItem("quiz_favorites", JSON.stringify(newFavorites))
  }

  const shareQuiz = (id: string) => {
    // Generate shareable link
    const shareUrl = `${window.location.origin}/share/${id}`
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert("Link copiado para a área de transferência")
      })
      .catch(err => {
        console.error('Erro ao copiar link: ', err)
      })
  }
  
  const toggleTheme = () => {
    const newThemeValue = !isDarkTheme
    setIsDarkTheme(newThemeValue)
    localStorage.setItem("quiz_theme", newThemeValue ? "dark" : "light")
  }

  // Get quiz status badge
  const getStatusBadge = (quiz: Quiz) => {
    if (isDarkTheme) {
      if (quiz.isArchived) {
        return <Badge variant="outline" className="bg-slate-700 text-slate-200 border-none px-3 py-1 rounded-full">Arquivado</Badge>
      } else if (quiz.isPublished) {
        return <Badge variant="outline" className="bg-emerald-600 text-emerald-100 border-none px-3 py-1 rounded-full">Publicado</Badge>
      } else {
        return <Badge variant="outline" className="bg-amber-600 text-amber-100 border-none px-3 py-1 rounded-full">Rascunho</Badge>
      }
    } else {
      if (quiz.isArchived) {
        return <Badge variant="outline" className="bg-gray-200 text-gray-700 border-gray-300 px-3 py-1 rounded-full">Arquivado</Badge>
      } else if (quiz.isPublished) {
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 rounded-full">Publicado</Badge>
      } else {
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 px-3 py-1 rounded-full">Rascunho</Badge>
      }
    }
  }
  
  const getCompletionStatus = (quiz: Quiz) => {
    // Simple logic to determine completion status
    const hasComponents = quiz.steps?.some(step => step.components?.length > 0)
    const hasMultipleSteps = (quiz.steps?.length || 0) > 1
    
    if (hasComponents && hasMultipleSteps) {
      return "complete"
    } else if (hasComponents || hasMultipleSteps) {
      return "partial"
    } else {
      return "empty"
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkTheme ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
    }`}>
      <header className={`border-b p-4 shadow-sm transition-colors duration-300 ${
        isDarkTheme ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
      }`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold"> <span className="text-white">Seven</span><span className="text-emerald-400">Quiz</span> </h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className={`rounded-full h-10 w-10 ${
              isDarkTheme 
                ? "text-yellow-400 hover:text-yellow-300 hover:bg-gray-800" 
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            {isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Meus Quizzes</h2>
            <p className="text-sm text-gray-500">
              {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 && "zes"} disponíveis
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <Input
                placeholder="Buscar quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-9 w-full rounded-full shadow-sm transition-colors duration-300 ${
                  isDarkTheme 
                    ? "bg-gray-900 border-gray-700" 
                    : "bg-white border-gray-200"
                }`}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              {searchTerm && (
                <button 
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${
                    isDarkTheme ? "hover:text-gray-300" : "hover:text-gray-600"
                  }`}
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <Button 
              variant="outline" 
              className={`flex items-center gap-2 rounded-full transition-all duration-300 ${
                isDarkTheme 
                  ? `border-gray-700 text-gray-300 ${showFilters ? 'bg-gray-800' : 'bg-gray-900'}` 
                  : `border-gray-200 text-gray-700 ${showFilters ? 'bg-gray-100' : 'bg-white'}`
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
            
            <Button 
              onClick={createNewQuiz} 
              className={`text-white rounded-full shadow-sm transition-colors duration-300 ${
                isDarkTheme ? "bg-emerald-500 hover:bg-emerald-600" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Quiz
            </Button>
          </div>
        </div>
        
        {/* Updated modern filter section */}
        {showFilters && (
          <div className={`mb-6 overflow-hidden rounded-xl shadow-sm transition-all duration-300 ease-in-out ${
            isDarkTheme 
              ? "bg-gray-900 border border-gray-800" 
              : "bg-white border border-gray-200"
          }`}>
            <div className="p-4 flex flex-col sm:flex-row gap-8">
              {/* Sort Options */}
              <div className="flex-1">
                <h3 className={`text-sm font-semibold mb-3 uppercase tracking-wide ${
                  isDarkTheme ? "text-gray-400" : "text-gray-700"
                }`}>Ordenar por</h3>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`rounded-full px-4 ${
                      isDarkTheme
                        ? (sortOption === "recent" 
                            ? "bg-emerald-900/40 text-emerald-400 border-emerald-700 shadow-sm" 
                            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700")
                        : (sortOption === "recent" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm" 
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
                    }`}
                    onClick={() => setSortOption("recent")}
                  >
                    <Clock className="h-3.5 w-3.5 mr-2" />
                    Mais recentes
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`rounded-full px-4 ${
                      isDarkTheme
                        ? (sortOption === "name" 
                            ? "bg-emerald-900/40 text-emerald-400 border-emerald-700 shadow-sm" 
                            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700")
                        : (sortOption === "name" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm" 
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
                    }`}
                    onClick={() => setSortOption("name")}
                  >
                    <FileText className="h-3.5 w-3.5 mr-2" />
                    Nome
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`rounded-full px-4 ${
                      isDarkTheme
                        ? (sortOption === "steps" 
                            ? "bg-emerald-900/40 text-emerald-400 border-emerald-700 shadow-sm" 
                            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700")
                        : (sortOption === "steps" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm" 
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
                    }`}
                    onClick={() => setSortOption("steps")}
                  >
                    <Layers className="h-3.5 w-3.5 mr-2" />
                    Etapas
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`rounded-full px-4 ${
                      isDarkTheme
                        ? (sortOption === "popular" 
                            ? "bg-emerald-900/40 text-emerald-400 border-emerald-700 shadow-sm" 
                            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700")
                        : (sortOption === "popular" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm" 
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
                    }`}
                    onClick={() => setSortOption("popular")}
                  >
                    <MessageCircle className="h-3.5 w-3.5 mr-2" />
                    Respostas
                  </Button>
                </div>
              </div>
              
              <div className={`hidden sm:block w-px self-stretch ${isDarkTheme ? "bg-gray-800" : "bg-gray-200"}`}></div>
              
              {/* Categories */}
              <div className="flex-1">
                <h3 className={`text-sm font-semibold mb-3 uppercase tracking-wide ${
                  isDarkTheme ? "text-gray-400" : "text-gray-700"
                }`}>Status</h3>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`rounded-full px-4 ${
                      isDarkTheme
                        ? (activeCategory === "all" 
                            ? "bg-emerald-900/40 text-emerald-400 border-emerald-700 shadow-sm" 
                            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700")
                        : (activeCategory === "all" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm" 
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
                    }`}
                    onClick={() => setActiveCategory("all")}
                  >
                    Todos
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`rounded-full px-4 ${
                      isDarkTheme
                        ? (activeCategory === "favorites" 
                            ? "bg-emerald-900/40 text-emerald-400 border-emerald-700 shadow-sm" 
                            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700")
                        : (activeCategory === "favorites" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm" 
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
                    }`}
                    onClick={() => setActiveCategory("favorites")}
                  >
                    <Star className={`h-3.5 w-3.5 mr-2 ${
                      activeCategory === "favorites" 
                        ? (isDarkTheme ? "fill-emerald-400" : "fill-emerald-500") 
                        : ""
                    }`} />
                    Favoritos
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`rounded-full px-4 ${
                      isDarkTheme
                        ? (activeCategory === "published" 
                            ? "bg-emerald-900/40 text-emerald-400 border-emerald-700 shadow-sm" 
                            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700")
                        : (activeCategory === "published" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm" 
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
                    }`}
                    onClick={() => setActiveCategory("published")}
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-2" />
                    Publicados
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`rounded-full px-4 ${
                      isDarkTheme
                        ? (activeCategory === "drafts" 
                            ? "bg-emerald-900/40 text-emerald-400 border-emerald-700 shadow-sm" 
                            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700")
                        : (activeCategory === "drafts" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm" 
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
                    }`}
                    onClick={() => setActiveCategory("drafts")}
                  >
                    <FileText className="h-3.5 w-3.5 mr-2" />
                    Rascunhos
                  </Button>
                </div>
              </div>
            </div>
            
            {(searchTerm || activeCategory !== "all" || sortOption !== "recent") && (
              <div className={`px-4 py-3 border-t flex justify-between items-center ${
                isDarkTheme 
                  ? "bg-gray-800/50 border-gray-800" 
                  : "bg-gray-50 border-gray-200"
              }`}>
                <div className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-500"}`}>
                  Filtros aplicados: {activeCategory !== "all" && (
                    <Badge variant="outline" className={`mr-1 ${isDarkTheme ? "bg-gray-700 text-gray-300" : "bg-white"}`}>
                      {activeCategory === "favorites" ? "Favoritos" : 
                       activeCategory === "published" ? "Publicados" : 
                       activeCategory === "drafts" ? "Rascunhos" : "Arquivados"}
                    </Badge>
                  )}
                  {sortOption !== "recent" && (
                    <Badge variant="outline" className={`mr-1 ${isDarkTheme ? "bg-gray-700 text-gray-300" : "bg-white"}`}>
                      {sortOption === "name" ? "Nome" : 
                       sortOption === "steps" ? "Etapas" : "Popularidade"}
                    </Badge>
                  )}
                  {searchTerm && (
                    <Badge variant="outline" className={`mr-1 ${isDarkTheme ? "bg-gray-700 text-gray-300" : "bg-white"}`}>
                      Busca: {searchTerm}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={isDarkTheme ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}
                  onClick={() => {
                    setSearchTerm("")
                    setActiveCategory("all")
                    setSortOption("recent")
                  }}
                >
                  <X className="h-3.5 w-3.5 mr-2" />
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        )}

        <Tabs defaultValue="grid" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <TabsList className={`border shadow-sm ${
              isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}>
              <TabsTrigger 
                value="grid" 
                className={isDarkTheme 
                  ? "data-[state=active]:bg-gray-700 data-[state=active]:text-emerald-400" 
                  : "data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                }
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  Grade
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="list" 
                className={isDarkTheme 
                  ? "data-[state=active]:bg-gray-700 data-[state=active]:text-emerald-400" 
                  : "data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                }
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                  Lista
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid" className="mt-0">
            {filteredQuizzes.length === 0 ? (
              <div className={`rounded-lg border border-dashed p-12 text-center ${
                isDarkTheme 
                  ? "border-gray-700 bg-gray-900" 
                  : "border-gray-300 bg-white"
              }`}>
                {searchTerm || activeCategory !== "all" ? (
                  <div>
                    <p className={`mb-4 ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>
                      Nenhum quiz encontrado com os filtros atuais
                    </p>
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setActiveCategory("all")
                      }}
                      variant="outline"
                      className={isDarkTheme 
                        ? "border-emerald-600 text-emerald-400 hover:bg-emerald-900/30" 
                        : "border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                      }
                    >
                      Limpar filtros
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className={`mb-4 ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>
                      Você ainda não criou nenhum quiz
                    </p>
                    <Button
                      onClick={createNewQuiz}
                      variant="outline"
                      className={isDarkTheme 
                        ? "border-emerald-600 text-emerald-400 hover:bg-emerald-900/30" 
                        : "border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                      }
                    >
                      Criar seu primeiro quiz
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz) => {
                  const completionStatus = getCompletionStatus(quiz);
                  
                  return (
                    <Card key={quiz.id} className={`overflow-hidden group transition-all duration-200 p-4 ${
                      isDarkTheme 
                        ? "bg-gray-900 border-gray-800 hover:border-gray-700" 
                        : "bg-white border-gray-200 hover:shadow-md"
                    }`}>
                      <div className="relative">
                        {/* Title and action icons row */}
                        <div className="flex justify-between items-start mb-2">
                          {/* Quiz title */}
                          <h3 className={`text-xl font-semibold ${isDarkTheme ? "text-white" : "text-gray-800"}`}>
                            {quiz.title || "Quiz sem Título"}
                          </h3>
                          
                          {/* Action icons */}
                          <div className="flex gap-2">
                            {/* More options button */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className={`h-8 w-8 rounded-full p-0 ${
                                    isDarkTheme
                                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="1"></circle>
                                    <circle cx="19" cy="12" r="1"></circle>
                                    <circle cx="5" cy="12" r="1"></circle>
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className={`shadow-lg rounded-lg ${
                                isDarkTheme
                                  ? "bg-gray-800 border-gray-700 text-white"
                                  : "bg-white border-gray-200 text-gray-800"
                              }`}>
                                <DropdownMenuItem 
                                  className={isDarkTheme
                                    ? "hover:bg-gray-700 cursor-pointer"
                                    : "hover:bg-gray-50 cursor-pointer"
                                  } 
                                  onClick={() => duplicateQuiz(quiz)}
                                >
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className={isDarkTheme
                                    ? "hover:bg-gray-700 cursor-pointer"
                                    : "hover:bg-gray-50 cursor-pointer"
                                  } 
                                  onClick={() => shareQuiz(quiz.id)}
                                >
                                  <Share2 className="mr-2 h-4 w-4" />
                                  Compartilhar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            
                            {/* Favorite button */}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={`h-8 w-8 p-0 rounded-full ${
                                favorites.includes(quiz.id) 
                                  ? 'text-yellow-500' 
                                  : (isDarkTheme 
                                      ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-800' 
                                      : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100')
                              }`}
                              onClick={() => toggleFavorite(quiz.id)}
                            >
                              {favorites.includes(quiz.id) ? 
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" /> : 
                                <StarOff className="h-5 w-5" />
                              }
                            </Button>
                            
                            {/* Delete button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 rounded-full p-0 ${
                                isDarkTheme 
                                  ? "text-red-500 hover:text-red-400 hover:bg-gray-800" 
                                  : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                              }`}
                              onClick={() => deleteQuiz(quiz.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Badge and info section */}
                        <div className="flex items-center gap-2 mb-2">
                          {/* Status badge */}
                          {getStatusBadge(quiz)}
                          
                          {/* Etapas count */}
                          <div className={`text-sm flex items-center gap-1 ${
                            isDarkTheme ? "text-gray-400" : "text-gray-500"
                          }`}>
                            <Layers className="h-4 w-4" />
                            {quiz.steps?.length || 0} etapa{(quiz.steps?.length || 0) !== 1 && "s"}
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className={`w-full h-1.5 rounded-full overflow-hidden mb-1 ${
                          isDarkTheme ? "bg-gray-800" : "bg-gray-100"
                        }`}>
                          <div 
                            className={`h-full rounded-full ${
                              completionStatus === "complete" ? "bg-emerald-500 w-full" : 
                              completionStatus === "partial" ? "bg-amber-500 w-1/2" : 
                              "bg-red-500 w-1/4"
                            }`}
                          />
                        </div>
                        
                        {/* Status and update info */}
                        <div className={`flex justify-between text-sm mb-4 ${
                          isDarkTheme ? "text-gray-400" : "text-gray-500"
                        }`}>
                          <span>
                            {completionStatus === "complete" ? "Quiz completo" : 
                             completionStatus === "partial" ? "Parcialmente configurado" : 
                             "Configuração inicial"}
                          </span>
                          <span>
                            Atualizado: {new Date(quiz.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            className={`rounded-full ${
                              isDarkTheme
                                ? "bg-gray-800/80 hover:bg-gray-700 border-gray-700 text-gray-300"
                                : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                            }`}
                            onClick={() => editQuiz(quiz.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            className={`rounded-full ${
                              isDarkTheme
                                ? "bg-gray-800/80 hover:bg-gray-700 border-gray-700 text-gray-300"
                                : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                            }`}
                            onClick={() => previewQuiz(quiz.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            {filteredQuizzes.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center bg-white">
                {searchTerm || activeCategory !== "all" ? (
                  <div>
                    <p className="mb-4 text-gray-600">Nenhum quiz encontrado com os filtros atuais</p>
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setActiveCategory("all")
                      }}
                      variant="outline"
                      className="border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                    >
                      Limpar filtros
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="mb-4 text-gray-600">Você ainda não criou nenhum quiz</p>
                    <Button
                      onClick={createNewQuiz}
                      variant="outline"
                      className="border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                    >
                      Criar seu primeiro quiz
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className={`border rounded-md overflow-hidden ${
                isDarkTheme
                  ? "border-gray-800 bg-gray-900"
                  : "border-gray-200 bg-white"
              }`}>
                <div className={`grid grid-cols-12 gap-2 p-3 text-xs uppercase font-medium border-b ${
                  isDarkTheme
                    ? "bg-gray-800 text-gray-400 border-gray-800"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}>
                  <div className="col-span-4 sm:col-span-5">Nome</div>
                  <div className="col-span-2 text-center hidden sm:block">Status</div>
                  <div className="col-span-2 text-center hidden md:block">Etapas</div>
                  <div className="col-span-2 text-center hidden lg:block">Respostas</div>
                  <div className="col-span-4 sm:col-span-3 md:col-span-3 lg:col-span-1 text-center">Ações</div>
                </div>
                
                {filteredQuizzes.map((quiz, index) => (
                  <div 
                    key={quiz.id}
                    className={`grid grid-cols-12 gap-2 p-3 items-center hover:bg-gray-50 ${
                      index !== filteredQuizzes.length - 1 ? "border-b border-gray-200" : ""
                    }`}
                  >
                    <div className="col-span-4 sm:col-span-5 flex items-center gap-2">
                      <button 
                        onClick={() => toggleFavorite(quiz.id)}
                        className={favorites.includes(quiz.id) ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}
                      >
                        {favorites.includes(quiz.id) ? 
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" /> : 
                          <Star className="h-4 w-4" />
                        }
                      </button>
                      <div>
                        <div className="font-medium truncate text-gray-800" title={quiz.title || "Quiz sem título"}>
                          {quiz.title || "Quiz sem título"}
                        </div>
                        <div className="text-xs text-gray-500">
                          Atualizado: {new Date(quiz.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center hidden sm:block">
                      {getStatusBadge(quiz)}
                    </div>
                    
                    <div className="col-span-2 text-center hidden md:block">
                      <div className="text-sm text-gray-700">{quiz.steps?.length || 0}</div>
                    </div>
                    
                    <div className="col-span-2 text-center hidden lg:block">
                      <div className="text-sm text-gray-700">{quiz.responseCount || 0}</div>
                    </div>
                    
                    <div className="col-span-4 sm:col-span-3 md:col-span-3 lg:col-span-1 flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                        onClick={() => editQuiz(quiz.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                        onClick={() => previewQuiz(quiz.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="19" cy="12" r="1"></circle>
                              <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white border-gray-200 text-gray-800 shadow-lg rounded-lg">
                          <DropdownMenuItem className="hover:bg-gray-50 cursor-pointer" onClick={() => duplicateQuiz(quiz)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-gray-50 cursor-pointer" onClick={() => shareQuiz(quiz.id)}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Compartilhar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-200" />
                          <DropdownMenuItem 
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer" 
                            onClick={() => deleteQuiz(quiz.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}