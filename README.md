# Warehouse Optimizer

A warehouse management dashboard that optimizes task routing and worker assignments using algorithmic optimization.

## What It Does

This application helps warehouse managers optimize operations by:

- **Route Optimization**: Uses A\* pathfinding algorithm to calculate efficient picking routes
- **Task Management**: Prioritizes tasks based on deadlines, revenue, and worker availability
- **Zone Monitoring**: Tracks warehouse zone status and capacity in real-time
- **Performance Analytics**: Displays operational metrics and identifies bottlenecks

## How It Works

The system uses several optimization algorithms:

- **A\* Algorithm**: Finds shortest paths between warehouse locations
- **Dijkstra's Algorithm**: Calculates optimal routes considering distance and priority
- **K-means Clustering**: Groups tasks by location for efficient batching
- **Nearest Neighbor TSP**: Sequences multiple picks to minimize travel distance

## Tech Stack

- **Next.js 16** with React 19 and TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
