# Editor de Quiz - Arquitetura de Código

Este documento descreve a arquitetura de código refatorada para o editor de quiz interativo.

## Estrutura de Arquivos

```
app/editor/[id]/
├── page.tsx                   # Componente principal container
├── components/                # Componentes da interface
│   ├── EditorHeader.tsx       # Cabeçalho com navegação e botões de ação
│   ├── StepsList.tsx          # Lista de etapas no sidebar esquerdo
│   ├── ComponentCanvas.tsx    # Área principal de edição
│   ├── PropertiesPanel.tsx    # Painel de propriedades no sidebar direito
│   ├── SortableComponentItem.tsx # Item de componente arrastável
│   ├── Toast.tsx              # Componente de notificação toast
│   └── display/               # Componentes de visualização
│       ├── ButtonDisplay.tsx  # Visualização de botões
│       ├── TextDisplay.tsx    # Visualização de texto
│       ├── ImageDisplay.tsx   # Visualização de imagens
│       └── OptionsDisplay.tsx # Visualização de opções
├── forms/                     # Formulários de propriedades
│   ├── ButtonPropertiesForm.tsx   # Formulário para botões
│   ├── TextPropertiesForm.tsx     # Formulário para textos
│   ├── ImagePropertiesForm.tsx    # Formulário para imagens
│   └── OptionsPropertiesForm.tsx  # Formulário para opções
└── hooks/
    └── useQuiz.tsx            # Hook para gerenciamento de estado do quiz
```

## Componentes Principais

### page.tsx
- Age como o componente container principal
- Configura o DndContext para drag and drop
- Integra todos os componentes principais

### useQuiz.tsx
- Hook personalizado que gerencia todo o estado do quiz
- Encapsula a lógica de CRUD para etapas e componentes
- Gerencia drag and drop e seleção de componentes

### EditorHeader.tsx
- Exibe o cabeçalho superior com navegação entre abas
- Contém botões para salvar e publicar o quiz

### StepsList.tsx
- Lista todas as etapas do quiz no sidebar esquerdo
- Permite adicionar/selecionar etapas

### ComponentCanvas.tsx
- Área central de edição onde os componentes são visualizados
- Exibe a prévia da etapa com todos os componentes
- Contém o botão para adicionar novos componentes

### PropertiesPanel.tsx
- Painel de propriedades no sidebar direito
- Mostra formulários diferentes baseados no item selecionado

### Display Components
- Cada componente de visualização (ButtonDisplay, TextDisplay, etc.)
- Renderiza a prévia de cada tipo de componente

### Property Forms
- Formulários para editar as propriedades de cada tipo de componente
- Gerencia sua própria lógica de atualização via callbacks

## Tipos e Interfaces

Todas as interfaces TypeScript estão definidas em `types/quiz.ts`:

- `Quiz`: Estrutura principal que contém todo o quiz
- `Step`: Uma etapa/tela do quiz
- `Component`: Interface base para todos os componentes
- Interfaces específicas para cada tipo de componente: `ButtonComponent`, `TextComponent`, etc.

## Fluxo de Dados

1. O estado é gerenciado no hook `useQuiz`
2. As atualizações são feitas através de funções passadas como props
3. Componentes usam callbacks para comunicar mudanças para cima na hierarquia
4. O drag and drop usa o contexto DndKit para gerenciar reordenações

## Vantagens da Refatoração

- **Manutenção simplificada**: Componentes menores e focados são mais fáceis de manter
- **Melhor organização**: Separação clara de responsabilidades
- **Reusabilidade**: Componentes podem ser reutilizados em outras partes do aplicativo
- **Melhor performance**: Menos re-renderizações desnecessárias
- **Melhor legibilidade**: Código mais claro e organizado