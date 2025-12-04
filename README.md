# Warehouse Optimizer

A portfolio demo simulating route planning, task prioritization, and performance analytics for warehouse operations.

## What It Does

This application helps warehouse managers plan and optimize operations by:

- **Route Planning**: Calculates efficient picking routes through aisles and docks to reduce walking time
- **Task Management**: Prioritizes tasks based on deadlines, order value, and worker availability
- **Zone Monitoring**: Tracks warehouse zone status, capacity, and worker distribution in real-time
- **Performance Analytics**: Displays operational metrics, identifies bottlenecks, and simulates improvements

## How It Works

The system simulates warehouse operations using:

- **Shortest-path routing** to minimize walking distance between pick locations
- **Route sequencing** to determine the optimal order for visiting multiple stops
- **Zone-based batching** to group nearby picks and reduce backtracking
- **Multi-factor task scoring** to rank tasks by deadline urgency, order value, and complexity

All calculations run client-side using simulated data. No real warehouse information is stored.

## Tech Stack

- **Next.js 16** with React 19 and TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons

## Under the Hood (for engineers)

The implementation demonstrates practical use of pathfinding algorithms (shortest-path graph traversal), clustering techniques (grouping by location proximity), and heuristic optimization (sequencing stops to minimize total distance). View the source code in `/src/lib/` to see how these concepts translate into working TypeScript.
