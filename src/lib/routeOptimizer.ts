interface Location {
  id: string;
  x: number;
  y: number;
  zone: string;
  priority: number;
  timeEstimate: number; // minutes
  sequence: number; // walk sequence for optimal single-pass route
}

interface Task {
  id: string;
  location: Location;
  priority: 'low' | 'medium' | 'high' | 'critical';
  slaTime: number; // minutes until deadline
  revenue: number;
  skillsRequired: string[];
}

interface Worker {
  id: string;
  name: string;
  skills: string[];
  currentLocation: Location;
  maxCapacity: number;
  efficiency: number; // 0-1 multiplier
}

interface Route {
  id: string;
  worker: Worker;
  tasks: Task[];
  totalDistance: number;
  estimatedTime: number;
  efficiency: number;
  optimizationScore: number;
  status?: 'pending' | 'in-progress' | 'completed';
  actualTime?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  zones?: string[];
  name?: string;
}

interface OptimizationResult {
  routes: Route[];
  metrics: {
    totalDistance: number;
    averageEfficiency: number;
    improvementPercentage: number;
    energySaved: number;
    timeReduction: number;
  };
}

class RouteOptimizer {
  private warehouseLayout: { [key: string]: Location } = {};
  
  constructor() {
    // Initialize warehouse layout with coordinates
    this.initializeWarehouseLayout();
  }

  private initializeWarehouseLayout() {
    // Define warehouse zones with their base coordinates
    // Layout: R (Receiving) -> A (Fast) -> B (Standard) -> C (High-bay) -> F (Cold) -> P (Packing) -> S (Shipping)
    const zones = {
      'R': { baseX: 5, baseY: 10, name: 'Receiving' },      // Start: Receiving
      'A': { baseX: 20, baseY: 10, name: 'Fast Movers' },   // Zone A: Fast moving items
      'B': { baseX: 50, baseY: 10, name: 'Standard' },       // Zone B: Standard shelving
      'C': { baseX: 80, baseY: 10, name: 'High-Bay' },       // Zone C: High-bay pallets
      'F': { baseX: 20, baseY: 50, name: 'Cold Storage' },   // Zone F: Refrigerated
      'P': { baseX: 80, baseY: 50, name: 'Packing' },        // Zone P: Packing station
      'S': { baseX: 110, baseY: 50, name: 'Shipping' },      // End: Shipping
    };

    // Define sequence order for single-pass warehouse walk
    const zoneSequenceOrder: Array<'R' | 'A' | 'B' | 'C' | 'F' | 'P' | 'S'> = ['R', 'A', 'B', 'C', 'F', 'P', 'S'];
    let globalSequence = 0;

    // Create locations within each zone with WMS-style IDs
    zoneSequenceOrder.forEach((zone, zoneIndex) => {
      const coords = zones[zone];
      const locationsPerZone = zone === 'R' || zone === 'S' ? 5 : 15; // Fewer in receiving/shipping
      
      for (let rack = 1; rack <= Math.ceil(locationsPerZone / 3); rack++) {
        const sections = ['AA', 'AB', 'AC'];
        sections.forEach((section, sectionIdx) => {
          if (globalSequence >= (zoneIndex * 20) + locationsPerZone) return;
          
          const shelf = 1 + Math.floor(Math.random() * 4); // Shelves 1-4
          const bin = `B${String(1 + Math.floor(Math.random() * 5)).padStart(2, '0')}`; // Bins B01-B05
          
          // WMS location format: ZONE-RACK-SECTION-SHELF-BIN
          const locationId = `${zone}-${String(rack).padStart(2, '0')}-${section}-${String(shelf).padStart(2, '0')}-${bin}`;
          
          const location: Location = {
            id: locationId,
            x: coords.baseX + (rack * 8) + (sectionIdx * 2) + (Math.random() * 2),
            y: coords.baseY + (Math.random() * 15),
            zone,
            priority: Math.random() > 0.7 ? 2 : 1,
            timeEstimate: 2 + Math.random() * 8, // 2-10 minutes
            sequence: globalSequence // Sequential number for optimal walk order
          };
          
          this.warehouseLayout[location.id] = location;
          globalSequence++;
        });
      }
    });
  }

  /**
   * Calculate Euclidean distance between two locations
   */
  private calculateDistance(loc1: Location, loc2: Location): number {
    return Math.sqrt(Math.pow(loc2.x - loc1.x, 2) + Math.pow(loc2.y - loc1.y, 2));
  }

  /**
   * Calculate priority weight based on SLA time and revenue
   */
  private calculatePriorityWeight(task: Task): number {
    const slaUrgency = Math.max(0, (300 - task.slaTime) / 300); // Normalize SLA urgency
    const revenueWeight = Math.min(1, task.revenue / 1000); // Normalize revenue impact
    
    const priorityMultipliers = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1
    };

    return (slaUrgency * 0.4 + revenueWeight * 0.3 + priorityMultipliers[task.priority] * 0.3);
  }

  /**
   * Optimize task order using location sequence and priority
   * Strategy: Follow the warehouse walk sequence (one pass through facility)
   * while considering task priority and minimizing backtracking
   */
  private optimizeTaskOrder(tasks: Task[], startLocation: Location): Task[] {
    if (tasks.length <= 1) return tasks;

    const unvisited = [...tasks];
    const route: Task[] = [];
    let currentLocation = startLocation;

    while (unvisited.length > 0) {
      let bestTask: Task | null = null;
      let bestScore = Infinity;

      // Find the best next task considering distance, sequence, and priority
      for (const task of unvisited) {
        const distance = this.calculateDistance(currentLocation, task.location);
        const priorityWeight = this.calculatePriorityWeight(task);
        
        // Calculate sequence delta (prefer moving forward in sequence)
        const sequenceDelta = task.location.sequence - currentLocation.sequence;
        
        // Penalize backtracking heavily, reward forward movement
        let sequencePenalty = 0;
        if (sequenceDelta < 0) {
          // Going backwards - apply exponential penalty
          sequencePenalty = Math.abs(sequenceDelta) * 3.0;
        } else {
          // Going forward - small bonus
          sequencePenalty = -Math.min(sequenceDelta * 0.1, 5);
        }
        
        // Combined score: lower is better
        // Balance between following sequence, minimizing distance, and respecting priority
        const distanceScore = distance * 0.4;
        const sequenceScore = sequencePenalty * 0.4;
        const priorityScore = -(priorityWeight * 10); // Negative because lower score is better
        
        const score = distanceScore + sequenceScore + priorityScore;
        
        if (score < bestScore) {
          bestScore = score;
          bestTask = task;
        }
      }

      if (bestTask) {
        route.push(bestTask);
        currentLocation = bestTask.location;
        const taskIndex = unvisited.findIndex(t => t.id === bestTask.id);
        if (taskIndex > -1) {
          unvisited.splice(taskIndex, 1);
        }
      } else {
        break; // No more tasks found
      }
    }

    return route;
  }

  /**
   * Assign tasks to workers based on skills and capacity
   */
  private assignTasksToWorkers(tasks: Task[], workers: Worker[]): { [workerId: string]: Task[] } {
    const assignments: { [workerId: string]: Task[] } = {};
    const unassignedTasks = [...tasks];

    // Initialize assignments
    workers.forEach(worker => {
      assignments[worker.id] = [];
    });

    // Sort tasks by priority weight (descending)
    unassignedTasks.sort((a, b) => this.calculatePriorityWeight(b) - this.calculatePriorityWeight(a));

        // Assign tasks to workers
    for (const task of unassignedTasks) {
      let bestWorker: Worker | null = null;
      let bestScore = -1;

      for (const worker of workers) {
        // Check if worker has required skills
        const hasRequiredSkills = task.skillsRequired.every((skill: string) => 
          worker.skills.includes(skill)
        );

        if (!hasRequiredSkills) continue;

        // Check capacity
        const currentTaskCount = assignments[worker.id].length;
        if (currentTaskCount >= worker.maxCapacity) continue;

        // Calculate worker suitability score
        const efficiencyScore = worker.efficiency;
        const capacityScore = (worker.maxCapacity - currentTaskCount) / worker.maxCapacity;
        const skillMatchScore = worker.skills.filter((skill: string) =>
          task.skillsRequired.includes(skill)
        ).length / Math.max(task.skillsRequired.length, 1);

        const score = efficiencyScore * 0.4 + capacityScore * 0.3 + skillMatchScore * 0.3;

        if (score > bestScore) {
          bestScore = score;
          bestWorker = worker;
        }
      }

      if (bestWorker) {
        assignments[bestWorker.id].push(task);
      }
    }

    return assignments;
  }

  /**
   * Calculate route metrics including sequence adherence
   */
  private calculateRouteMetrics(worker: Worker, tasks: Task[]): {
    totalDistance: number;
    estimatedTime: number;
    efficiency: number;
    optimizationScore: number;
  } {
    if (tasks.length === 0) {
      return { totalDistance: 0, estimatedTime: 0, efficiency: 100, optimizationScore: 100 };
    }

    let totalDistance = 0;
    let totalTime = 0;
    let currentLocation = worker.currentLocation;
    let backtrackingCount = 0;

    // Calculate total distance, time, and backtracking
    tasks.forEach(task => {
      const distance = this.calculateDistance(currentLocation, task.location);
      totalDistance += distance;
      totalTime += distance * 0.1 + task.location.timeEstimate; // 0.1 min per distance unit + task time
      
      // Count backtracking (moving backwards in sequence)
      if (task.location.sequence < currentLocation.sequence) {
        backtrackingCount++;
      }
      
      currentLocation = task.location;
    });

    // Apply worker efficiency
    const adjustedTime = totalTime / worker.efficiency;

    // Calculate efficiency based on distance optimization and sequence adherence
    const theoreticalMinDistance = tasks.length * 20; // Theoretical minimum
    const distanceEfficiency = Math.max(0, Math.min(100, (theoreticalMinDistance / totalDistance) * 100));
    
    // Calculate sequence adherence bonus (fewer backtracks = higher efficiency)
    const sequenceEfficiency = Math.max(0, 100 - (backtrackingCount * 15)); // Penalize backtracks
    
    // Combined efficiency: weight distance and sequence adherence
    const efficiency = (distanceEfficiency * 0.6) + (sequenceEfficiency * 0.4);

    // Calculate optimization score considering priority fulfillment
    const priorityScore = tasks.reduce((sum, task) => sum + this.calculatePriorityWeight(task), 0) / tasks.length;
    const optimizationScore = (efficiency * 0.6 + priorityScore * 40);

    return {
      totalDistance: Math.round(totalDistance),
      estimatedTime: Math.round(adjustedTime),
      efficiency: Math.round(efficiency * 10) / 10,
      optimizationScore: Math.round(optimizationScore * 10) / 10
    };
  }

  /**
   * Main optimization function
   */
  public optimizeRoutes(tasks: Task[], workers: Worker[]): OptimizationResult {
    // 1. Assign tasks to workers based on skills and capacity
    const assignments = this.assignTasksToWorkers(tasks, workers);

    // 2. Optimize task order for each worker's route
    const routes: Route[] = workers.map(worker => {
      const workerTasks = assignments[worker.id] || [];
      const optimizedTasks = this.optimizeTaskOrder(workerTasks, worker.currentLocation);
      const metrics = this.calculateRouteMetrics(worker, optimizedTasks);
      
      // Generate additional route properties
      const zones = [...new Set(optimizedTasks.map(task => task.location.zone))];
      const routeName = `${zones.join(' & ')} Zone Route`;
      const hasHighPriorityTasks = optimizedTasks.some(task => task.priority === 'critical' || task.priority === 'high');
      
      // Simulate route status based on task priorities and timing
      let status: Route['status'] = 'pending';
      let actualTime: number | null = null;
      let startTime: string | null = null;
      let endTime: string | null = null;
      
      if (Math.random() > 0.5) { // 50% chance route is in progress or completed
        status = 'in-progress';
        startTime = `${8 + Math.floor(Math.random() * 4)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} AM`;
        
        if (Math.random() > 0.3 && !hasHighPriorityTasks) { // 70% chance completed if no high priority tasks
          status = 'completed';
          actualTime = Math.round(metrics.estimatedTime * (0.85 + Math.random() * 0.3)); // 85-115% of estimated
          const endHour = 9 + Math.floor(actualTime / 60);
          const endMinute = actualTime % 60;
          endTime = `${endHour}:${String(Math.floor(endMinute)).padStart(2, '0')} ${endHour >= 12 ? 'PM' : 'AM'}`;
        }
      }

      return {
        id: `RT-${worker.id}`,
        name: routeName,
        worker,
        tasks: optimizedTasks,
        status,
        actualTime,
        startTime,
        endTime,
        zones,
        ...metrics
      };
    }).filter(route => route.tasks.length > 0);

    // 3. Calculate overall metrics
    const totalDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0);
    const averageEfficiency = routes.length > 0 
      ? routes.reduce((sum, route) => sum + route.efficiency, 0) / routes.length 
      : 0;

    // Calculate improvement (mock baseline comparison)
    const baselineDistance = totalDistance * 1.25; // Assume 25% improvement over unoptimized
    const improvementPercentage = ((baselineDistance - totalDistance) / baselineDistance) * 100;

    return {
      routes,
      metrics: {
        totalDistance,
        averageEfficiency: Math.round(averageEfficiency * 10) / 10,
        improvementPercentage: Math.round(improvementPercentage * 10) / 10,
        energySaved: Math.round(improvementPercentage * 0.8), // Approximate energy savings
        timeReduction: Math.round(improvementPercentage * 0.6), // Approximate time savings
      }
    };
  }

  /**
   * Generate mock data for testing
   */
  public generateMockData(): { tasks: Task[], workers: Worker[] } {
    const locations = Object.values(this.warehouseLayout);
    const skills = ['picking', 'packing', 'heavy-lifting', 'fragile-handling', 'electronics', 'furniture'];

    // Generate mock tasks
    const tasks: Task[] = Array.from({ length: 15 }, (_, i) => ({
      id: `WO-${(i + 1).toString().padStart(3, '0')}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      priority: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)] as Task['priority'],
      slaTime: 30 + Math.random() * 240, // 30-270 minutes
      revenue: 100 + Math.random() * 900, // $100-$1000
      skillsRequired: skills.slice(0, 1 + Math.floor(Math.random() * 2)) // 1-2 skills
    }));

    // Generate mock workers
    const workers: Worker[] = [
      {
        id: '001',
        name: 'John Smith',
        skills: ['picking', 'electronics', 'fragile-handling'],
        currentLocation: locations[0],
        maxCapacity: 5,
        efficiency: 0.95
      },
      {
        id: '002', 
        name: 'Maria Garcia',
        skills: ['picking', 'packing', 'heavy-lifting'],
        currentLocation: locations[10],
        maxCapacity: 4,
        efficiency: 0.92
      },
      {
        id: '003',
        name: 'David Lee',
        skills: ['picking', 'furniture', 'heavy-lifting'],
        currentLocation: locations[20],
        maxCapacity: 3,
        efficiency: 0.88
      },
      {
        id: '004',
        name: 'Sarah Johnson',
        skills: ['picking', 'packing', 'electronics', 'fragile-handling'],
        currentLocation: locations[30],
        maxCapacity: 6,
        efficiency: 0.97
      }
    ];

    return { tasks, workers };
  }
}

export default RouteOptimizer;
export type { Task, Worker, Route, OptimizationResult };