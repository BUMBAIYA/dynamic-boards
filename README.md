# Dynamic Boards

🚀 **Live Demo**: [Dynamic Board](https://dynamic-boards.pages.dev)

A React TypeScript repository demonstrating how to build dynamic, drag-and-drop boards using Pragmatic DnD. This project shows how to create interactive dashboards with customizable layouts where users can implement their own card components.

## Why This Project?

I had a requirement at work to build a dynamic analytics dashboard similar to Mixpanel Boards. After searching the internet, I found no existing resources for building dynamic dashboards. While I had previously built [kanban board](https://kannban-board.vercel.app) using `react-beautiful-dnd`, that library is now deprecated.

We decided to use Atlassian's `pragmatic-dnd` for its robust drag-and-drop capabilities, but found the documentation and resources insufficient for our needs. So we built this solution from scratch. I'm sharing this code to help others who might face similar challenges.

## Key Features

- **Drag and Drop**: Full drag-and-drop functionality for cards within and between rows
- **Resizable Cards**: Interactive card width resizing with visual handles
- **Resizable Rows**: Row height adjustment with drag handles
- **Custom Card Implementation**: Complete freedom to implement your own card components
- **Layout Management**: Automatic layout calculations and constraints
- **Type Safety**: Full TypeScript support with generic card content types
- **Separate UI and Logic**: Logic is separated from UI, making it easy to change styling systems

### Missing Features (Implementing soon)

- **Row Dragging**: Rows are not currently draggable/reorderable. I am not sure how will this work like where will be the drag handle placed for a row (Not present in Mixpanel as well so I might not implement it at all).
- **Card Drop Between Rows**: Dropping cards in the space between rows is not implemented
- **Card Dimension Tracking**: Currently part of card implementation, may be moved to user implementation in future iterations

_Note: These features weren't required for our initial use case but I will be implementing these soon._

## Learning Objectives

This project demonstrates:

1. **Pragmatic DnD Integration**: How to use Atlaskit's Pragmatic DnD for robust drag-and-drop functionality
2. **Custom Card Implementation**: How to create flexible card components using render props pattern
3. **State Management**: How to manage complex board state with React Context and hooks
4. **Layout Management**: How to handle dynamic layouts with automatic constraints and corrections
5. **TypeScript Best Practices**: How to use generics and type safety for flexible card content
6. **Performance Optimization**: How to optimize re-renders and state updates for smooth interactions
7. **Separation of Concerns**: How to separate UI logic from business logic for maintainability

## Table of Contents

- [Overview](#overview)
- [Why This Project?](#why-this-project)
- [Key Features](#key-features)
- [Learning Objectives](#learning-objectives)
- [DnD Core Architecture](#dnd-core-architecture)
- [Core Components](#core-components)
- [Context & State Management](#context--state-management)
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Advanced Features](#advanced-features)
  - [Layout Auto-Correction](#layout-auto-correction)
    - [Width Percentage Tolerance](#width-percentage-tolerance)
    - [Card Width Ratio Maintenance](#card-width-ratio-maintenance)
    - [Card Swapping Behavior](#card-swapping-behavior)
    - [Layout Correction Features](#layout-correction-features)
  - [Card Dimensions & ResizeObserver](#card-dimensions--resizeobserver)
  - [Drag and Drop Enhancements](#drag-and-drop-enhancements)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Getting Started](#getting-started)
- [Contributing](#contributing)

## Overview

This repository demonstrates how to build a flexible, type-safe React dynamic board using Pragmatic DnD that provides:

- **Drag and Drop**: Full drag-and-drop functionality for cards within and between rows
- **Resizable Cards**: Interactive card width resizing with visual handles
- **Resizable Rows**: Row height adjustment with drag handles
- **Custom Card Implementation**: Complete freedom to implement your own card components
- **Layout Management**: Automatic layout calculations and constraints
- **Type Safety**: Full TypeScript support with generic card content types
- **Separation of Concerns**: Logic is separated from UI, making it easy to change styling systems

## DnD Core Architecture

The project follows a modular architecture with clear separation of concerns:

```txt
src/core/
├── components/          # Reusable UI components
├── context/             # React context and state management
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
```

### Key Design Principles

1. **Composition over Inheritance**: Uses render props and children functions for maximum flexibility
2. **Type Safety**: Full TypeScript support with generic types for card content
3. **Separation of Concerns**: Clear separation between layout logic and UI components
4. **Performance**: Optimized re-renders and efficient state updates
5. **Extensibility**: Easy to extend and customize for specific use cases
6. **Pragmatic DnD Integration**: Leverages Atlaskit's Pragmatic DnD for robust drag-and-drop functionality
7. **Maintainability**: Clean architecture that's easy to understand and modify

## Core Components

### DynamicBoardProvider

The main provider component that manages the entire board state and interactions.

```tsx
<DynamicBoardProvider
  onLayoutChange={(changes) => {
    // Handle layout changes
  }}
  initialCards={cards}
  boardConfig={{
    maxCardsPerRow: 3,
    minHeight: 250,
    maxHeight: 600,
    disableDrag: false,
    disableResizeCardWidth: false,
    disableResizeRowHeight: false,
    disableAddCard: false,
    disableCardDropInBetweenRows: true,
    enableLayoutCorrection: true,
  }}
>
  <DynamicBoard />
</DynamicBoardProvider>
```

**Props:**

- `children`: React children to be rendered within the provider
- `onLayoutChange?`: Callback function triggered when layout changes
- `initialCards?`: Initial cards to populate the dashboard
- `boardConfig?`: Configuration options for the dashboard layout

### DynamicBoardCard

A draggable card component that supports drag and drop functionality.

```tsx
<DynamicBoardCard
  card={card}
  rowId={rowId}
  paddingX={8}
  paddingY={8}
>
  {({ card, dimensions, dragHandleRef }) => (
    // Your custom card implementation
  )}
</DynamicBoardCard>
```

**Props:**

- `card`: The card data object
- `rowId`: The ID of the row this card belongs to
- `children`: Render function that receives card props and returns React node
- `paddingX?`: Horizontal padding for the card (default: 0)
- `paddingY?`: Vertical padding for the card (default: 0)

### DynamicBoardRow

A draggable and droppable row component for the dynamic board.

```tsx
<DynamicBoardRow key={row.id} row={row}>
  {({ rowId, row, rowHeight, isDraggingOver, rowRef }) => (
    // Your custom row implementation
  )}
</DynamicBoardRow>
```

**Props:**

- `row`: The row data containing cards and metadata
- `children`: Render prop function that receives row data and returns React nodes

### DynamicBoardCardResizeHandle

A draggable resize handle component for adjusting card widths.

```tsx
<DynamicBoardCardResizeHandle
  rowId={row.id}
  cardIndex={cardIdx}
  height={rowHeight}
/>
```

**Props:**

- `rowId`: The unique identifier of the row containing the card
- `cardIndex`: The index of the card in the row
- `height`: The height of the resize handle in pixels

### DynamicBoardRowHeightResizeHandle

A draggable handle component for resizing row heights.

```tsx
<DynamicBoardRowHeightResizeHandle rowId={row.id} />
```

**Props:**

- `rowId`: The unique identifier of the row being resized

### DynamicBoardWindowAutoScroll

A wrapper component that enables automatic window scrolling during drag operations.

```tsx
<DynamicBoardWindowAutoScroll maxScrollSpeed="fast">
  <YourDraggableContent />
</DynamicBoardWindowAutoScroll>
```

**Props:**

- `children`: Child components to be wrapped
- `maxScrollSpeed?`: Optional scroll speed configuration ("standard" | "fast")

## Context & State Management

### DynamicBoardContext

The main context that provides access to all board functionality:

```tsx
interface DynamicBoardContextType<CardContent> {
  boardConfig: DynamicBoardConfig;
  rows: DynamicBoardRow<CardContent>[];
  cardResizing: CardResizingState | null;
  rowResizing: RowResizingState | null;
  rowDropIndicator: RowDropIndicator | null;

  // Methods
  loadBoardCards: (cards: DynamicBoardCard<CardContent>[]) => void;
  handleResizeStart: (rowId: string, cardIdx: number, pointer: Pointer) => void;
  handleResizeMove: (pointer: Pointer) => void;
  handleResizeEnd: () => void;
  handleRowResizeStart: (rowId: string, pointer: Pointer) => void;
  handleRowResizeMove: (pointer: Pointer) => void;
  handleRowResizeEnd: () => void;
  moveCard: (
    cardId: string,
    sourceRowId: string,
    targetRowId: string,
    position?: number,
  ) => void;
  findCard: (cardId: string) => DynamicBoardCard<CardContent> | null;
  findRow: (rowId: string) => DynamicBoardRow<CardContent> | null;
  deleteCard: (cardId: string, rowId: string) => void;
  addCard: (
    rowId: string | null,
    newCard: DynamicBoardCard<CardContent>,
  ) => void;
  updateCard: (
    cardId: string,
    updatedCard: DynamicBoardCard<CardContent>,
  ) => void;
  onLayoutChange?: (data: DynamicBoardLayoutChangeData<CardContent>) => void;
}
```

### Key State Properties

- **rows**: Array of rows containing cards and metadata
- **cardResizing**: Current card resize operation state
- **rowResizing**: Current row resize operation state
- **rowDropIndicator**: Visual indicator for row drop zones
- **boardConfig**: Configuration options for the board

## Hooks

### useDynamicBoard

A custom hook to access the DynamicBoardContext:

```tsx
const {
  rows,
  boardConfig,
  moveCard,
  addCard,
  deleteCard,
  updateCard,
  // ... other methods
} = useDynamicBoard<YourCardContentType>();
```

**Returns:** The complete context value with all board functionality
**Throws:** Error if used outside of DynamicBoardProvider

### useDynamicBoardCardResize

A custom hook to handle card width resizing. You can use this hook to create your own custom resize handles for card width adjustment:

```tsx
const { state, dividerRef } = useDynamicBoardCardResize({
  rowId: "row-1",
  cardIndex: 0,
});
```

**Props:**

- `rowId`: The unique identifier of the row containing the card
- `cardIndex`: The index of the card in the row

**Returns:**

- `state`: Current resize state (`"idle" | "dragging"`)
- `dividerRef`: Reference to attach to your custom resize handle element

**Example Usage:**

```tsx
function CustomCardResizeHandle({ rowId, cardIndex }) {
  const { state, dividerRef } = useDynamicBoardCardResize({
    rowId,
    cardIndex,
  });

  return (
    <div
      ref={dividerRef}
      className={`resize-handle ${state.type === "dragging" ? "dragging" : ""}`}
    >
      ⋮⋮
    </div>
  );
}
```

### useDynamicBoardRowHeightResize

A custom hook to handle row height resizing. You can use this hook to create your own custom resize handles for row height adjustment:

```tsx
const { state, handleRef } = useDynamicBoardRowHeightResize({
  rowId: "row-1",
});
```

**Props:**

- `rowId`: The unique identifier of the row being resized

**Returns:**

- `state`: Current resize state (`"idle" | "dragging"`)
- `handleRef`: Reference to attach to your custom resize handle element

**Example Usage:**

```tsx
function CustomRowHeightResizeHandle({ rowId }) {
  const { state, handleRef } = useDynamicBoardRowHeightResize({
    rowId,
  });

  return (
    <div
      ref={handleRef}
      className={`row-resize-handle ${state.type === "dragging" ? "dragging" : ""}`}
    >
      ⋯
    </div>
  );
}
```

## Utilities

### buildDynamicBoardRowsFromCards

Builds an array of rows from a flat array of cards:

```tsx
const rows = buildDynamicBoardRowsFromCards(cards, {
  minHeight: 250,
  maxHeight: 600,
});
```

### createDynamicBoardCardsMap

Creates a Map of cards from an array of rows for quick lookup:

```tsx
const cardsMap = createDynamicBoardCardsMap(rows);
```

### dynamicBoardDiffGrids

Compares two grid layouts and identifies changes:

```tsx
const changes = dynamicBoardDiffGrids(oldRows, newRows, oldCardsMap);
```

### generateRandomId

Generates a random ID for cards and rows:

```tsx
const id = generateRandomId(30); // 30 character random ID
```

## Configuration

### DynamicBoardConfig

```tsx
interface DynamicBoardConfig {
  maxCardsPerRow: number; // Maximum cards per row (default: 3)
  minHeight?: number; // Minimum height in pixels (default: 250)
  maxHeight?: number; // Maximum height in pixels (default: 600)
  disableDrag?: boolean; // Disable card dragging (default: false)
  disableResizeCardWidth?: boolean; // Disable card width resizing (default: false)
  disableResizeRowHeight?: boolean; // Disable row height resizing (default: false)
  disableAddCard?: boolean; // Disable adding new cards (default: false)
  disableCardDropInBetweenRows?: boolean; // Disable dropping cards between rows (default: true)
  enableLayoutCorrection?: boolean; // Enable automatic layout correction (default: true)
}
```

### Default Configuration

```tsx
const DEFAULT_BOARD_CONFIG = {
  maxCardsPerRow: 3,
  minHeight: 250,
  maxHeight: 600,
  disableDrag: false,
  disableResizeCardWidth: false,
  disableResizeRowHeight: false,
  disableAddCard: false,
  disableCardDropInBetweenRows: true,
  enableLayoutCorrection: true,
};
```

## Usage Examples

### Basic Implementation

```tsx
import { DynamicBoardProvider, DynamicBoard } from "@/core";

function App() {
  const [cards, setCards] = useState(initialCards);

  const handleLayoutChange = (changes) => {
    // Handle layout changes
    console.log("Layout changed:", changes);
  };

  return (
    <DynamicBoardProvider
      onLayoutChange={handleLayoutChange}
      initialCards={cards}
      boardConfig={{
        maxCardsPerRow: 3,
        minHeight: 250,
        maxHeight: 600,
      }}
    >
      <DynamicBoard />
    </DynamicBoardProvider>
  );
}
```

### Custom Card Implementation

```tsx
function CustomCard({ card, dimensions, dragHandleRef }) {
  return (
    <div className="custom-card">
      <div ref={dragHandleRef} className="drag-handle">
        <h3>{card.title}</h3>
      </div>
      <div className="card-content">
        <p>{card.description}</p>
        <div className="card-actions">
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </div>
    </div>
  );
}

// Usage in DynamicBoardCard
<DynamicBoardCard card={card} rowId={rowId}>
  {(props) => <CustomCard {...props} />}
</DynamicBoardCard>;
```

### Custom Row Implementation

```tsx
function CustomRow({ rowId, row, rowHeight, isDraggingOver, rowRef }) {
  return (
    <div
      ref={rowRef}
      className={`custom-row ${isDraggingOver ? "dragging-over" : ""}`}
    >
      <div className="row-header">
        <h2>Row {rowId}</h2>
        <button>Add Card</button>
      </div>
      <div className="row-content">
        {row.cards.map((card) => (
          <DynamicBoardCard key={card.id} card={card} rowId={rowId}>
            {(props) => <CustomCard {...props} />}
          </DynamicBoardCard>
        ))}
      </div>
    </div>
  );
}

// Usage in DynamicBoardRow
<DynamicBoardRow key={row.id} row={row}>
  {(props) => <CustomRow {...props} />}
</DynamicBoardRow>;
```

### Programmatic Card Management

```tsx
function BoardController() {
  const { addCard, deleteCard, updateCard, moveCard } = useDynamicBoard();

  const handleAddCard = () => {
    const newCard = {
      id: generateRandomId(),
      layoutJson: {
        row: 0,
        col: 0,
        widthPercentage: 50,
        height: 300,
      },
      title: "New Card",
      description: "New card description",
    };
    addCard("row-1", newCard);
  };

  const handleDeleteCard = (cardId) => {
    deleteCard(cardId, "row-1");
  };

  const handleMoveCard = (cardId) => {
    moveCard(cardId, "row-1", "row-2", 0);
  };

  return (
    <div>
      <button onClick={handleAddCard}>Add Card</button>
      <button onClick={() => handleDeleteCard("card-1")}>Delete Card</button>
      <button onClick={() => handleMoveCard("card-1")}>Move Card</button>
    </div>
  );
}
```

## API Reference

### Types

#### DynamicBoardCard Type

```tsx
type DynamicBoardCard<CardContent = unknown> = {
  id: DynamicBoardCardId;
  layoutJson: DynamicBoardCardLayout;
} & CardContent;
```

#### DynamicBoardCardLayout Type

```tsx
interface DynamicBoardCardLayout {
  row: number; // Row index (0-based)
  col: number; // Column index (0-based)
  widthPercentage: number; // Width as percentage of row (0-100)
  height: number; // Height in pixels
}
```

#### DynamicBoardRow Type

```tsx
interface DynamicBoardRow<CardContent = unknown> {
  id: DynamicBoardRowId;
  cards: DynamicBoardCard<CardContent>[];
  elementRef?: React.RefObject<HTMLDivElement | null>;
}
```

#### DynamicBoardLayoutChangeData Type

```tsx
interface DynamicBoardLayoutChangeData<CardContent = unknown> {
  updatedRows: DynamicBoardRow<CardContent>[];
  updatedCards: DynamicBoardCard<CardContent>[];
}
```

### Methods

#### Card Management

- `addCard(rowId: string | null, newCard: DynamicBoardCard<CardContent>)`: Add a new card to a row
- `deleteCard(cardId: string, rowId: string)`: Delete a card from a row
- `updateCard(cardId: string, updatedCard: DynamicBoardCard<CardContent>)`: Update an existing card
- `moveCard(cardId: string, sourceRowId: string, targetRowId: string, position?: number)`: Move a card between rows

#### Layout Management

- `loadBoardCards(cards: DynamicBoardCard<CardContent>[])`: Load a new set of cards
- `findCard(cardId: string)`: Find a card by ID
- `findRow(rowId: string)`: Find a row by ID

#### Resize Operations

- `handleResizeStart(rowId: string, cardIdx: number, pointer: Pointer)`: Start card resize
- `handleResizeMove(pointer: Pointer)`: Handle card resize movement
- `handleResizeEnd()`: End card resize
- `handleRowResizeStart(rowId: string, pointer: Pointer)`: Start row resize
- `handleRowResizeMove(pointer: Pointer)`: Handle row resize movement
- `handleRowResizeEnd()`: End row resize

## Advanced Features

### Layout Auto-Correction

The project includes intelligent automatic layout correction that ensures proper card distribution and maintains layout integrity:

#### Width Percentage Tolerance

- **±1% Tolerance**: The system allows a tolerance of ±1% from the total 100% width
- **Auto-Normalization**: If total width exceeds tolerance, cards are automatically normalized to equal widths
- **Example**: If you have 3 cards with widths [33%, 34%, 34%] (total 101%), they'll be normalized to [33.33%, 33.33%, 33.33%]

#### Card Width Ratio Maintenance

When removing cards from a row:

- **Ratio Preservation**: The remaining cards maintain their relative width ratios
- **Automatic Recalculation**: Width percentages are recalculated to ensure they sum to 100%
- **Example**: If you remove a 30% card from a row with [40%, 30%, 30%], the remaining cards become [57.14%, 42.86%]

#### Card Swapping Behavior

When adding cards to a full row (reached `maxCardsPerRow`):

- **Smart Swapping**: The new card swaps position with an existing card
- **Width Preservation**: The swapped card retains its width percentage
- **Height Synchronization**: All cards in the row maintain the same height
- **Example**: Adding a card to a full row (3 cards) will swap it with the card at the target position

#### Layout Correction Features

- **Sequential Indices**: Row and column indices are automatically corrected to be sequential (0-based)
- **Height Consistency**: All cards in a row maintain the same height
- **Width Validation**: Ensures width percentages always sum to 100% within tolerance
- **Console Warnings**: Displays warnings when layout correction is applied, indicating improper initial layouts

### Card Dimensions & ResizeObserver

The DynamicBoardCard component uses ResizeObserver to automatically track card dimensions and provide them to your custom card implementations:

Not sure why we decided to keep this as a part of card implementation not every one will need card dimensions. Maybe in future iteration we will move this to user's implementation

#### Automatic Dimension Tracking

- **Real-time Updates**: Card dimensions are automatically updated when the container size changes
- **Responsive Design**: Dimensions are recalculated on window resize and container changes
- **Accurate Measurements**: Provides precise width and height values for your card content

#### Usage in Custom Cards

```tsx
<DynamicBoardCard card={card} rowId={rowId}>
  {({ card, dimensions, dragHandleRef }) => (
    <div style={{ width: dimensions.width, height: dimensions.height }}>
      {/* Your card content using the provided dimensions */}
      <div ref={dragHandleRef}>Drag Handle</div>
      <div>
        Content Area: {dimensions.width}px × {dimensions.height}px
      </div>
    </div>
  )}
</DynamicBoardCard>
```

#### Dimension Properties

- **dimensions.width**: Available width for card content (excluding padding)
- **dimensions.height**: Available height for card content (excluding padding)
- **dragHandleRef**: Reference to attach to your drag handle element

#### Benefits

- **Responsive Layouts**: Cards automatically adapt to container size changes
- **Precise Sizing**: Get exact dimensions for complex card layouts
- **Performance**: Efficient updates using ResizeObserver API
- **Flexibility**: Use dimensions for custom styling and layout calculations

### Drag and Drop Enhancements

- **Visual Feedback**: Drop indicators and drag previews
- **Edge Detection**: Precise drop zone detection
- **Auto-scroll**: Automatic window scrolling during drag operations
- **Sticky Drop Zones**: Persistent drop targets during drag

## Best Practices

### Card Implementation

1. **Use the drag handle**: Always provide a dedicated drag handle for better UX
2. **Responsive design**: Make cards responsive to the provided dimensions
3. **Consistent styling**: Maintain consistent visual hierarchy
4. **Error handling**: Handle edge cases gracefully

### Architecture

1. **Separate UI and Logic**: Keep business logic separate from UI components for easier maintenance
2. **Type Safety**: Use TypeScript generics for flexible card content types
3. **Performance**: Optimize re-renders and avoid unnecessary state updates
4. **Drag Handle Design**: Use dedicated drag handles for better user experience

### State Management

1. **Persist layout changes**: Save layout changes to backend when needed
2. **Optimistic updates**: Update UI immediately, sync with backend
3. **Error recovery**: Handle failed operations gracefully
4. **Layout validation**: Ensure width percentages add up to 100% in each row

## Troubleshooting

### Common Issues

1. **Cards not dragging**: Ensure drag handle is properly connected to the `dragHandleRef`
2. **Layout breaking**: Check width percentages add up to 100% in each row
3. **Drop indicator not visible**: Drop indicators need to be implemented in your custom components
4. **Type errors**: Ensure proper TypeScript types are used for card content

### Debug Tips

1. **Enable layout correction**: Use `enableLayoutCorrection: true` in board config
2. **Check console warnings**: Look for layout correction warnings. If log is present that means your provide card layout was not proper which was auto corrected
3. **Verify card structure**: Ensure cards have proper `layoutJson` structure
4. **Test with minimal data**: Start with simple card layouts
5. **Inspect drag handles**: Ensure drag handles are properly connected to Pragmatic DnD

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/BUMBAIYA/dynamic-boards.git
cd dynamic-boards

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Running the Project

```bash
# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`

### Key Dependencies

- **React**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and development server
- **@atlaskit/pragmatic-drag-and-drop**: Drag and drop functionality
- **Tailwind CSS**: Styling
- **nanoid**: For generating unique IDs

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript conventions and use strict typing
- Update documentation to reflect changes
- Leverage Pragmatic DnD best practices

---

Built with ❤️ By Amit Chauhan
