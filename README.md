# WorldForge

WorldForge is a web application for writers, game masters, and worldbuilders to create, organize, and visualize their fictional universes. Built with Next.js 14 and TypeScript, it offers an interface for managing worlds and their interconnected elements.

Demo: https://worldforge.vercel.app/

## Features

### 📝 Entity Management
- Create and manage characters, locations, factions, items, events, and time periods
- Rich text editing for detailed descriptions
- Tag-based organization
- Quick-create functionality for rapid world development

### 🗺️ Interactive World Map
- Upload custom world maps
- Place and manage location markers
- Context-menu interactions for easy editing
- Search and filter locations

### 🕸️ Relationship Visualization
- Interactive network graph showing connections between entities
- 2D and 3D visualization options
- Filter relationships by type
- Intuitive relationship management

### ⏳ Timeline Management
- Chronological organization of events
- Support for both CE and BCE dates
- Visual timeline navigation
- Event filtering and search

### 💾 Data Management
- Import/Export functionality
- Demo data available (Middle-earth dataset)
- Persistent storage
- Dark/Light theme support

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Shadcn/ui (UI Components)
- React Force Graph
- React Zoom Pan Pinch

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js app router pages and components
- `/components` - Reusable UI components
- `/store` - Zustand state management
- `/types` - TypeScript type definitions
- `/lib` - Utility functions and helpers

