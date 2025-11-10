import type { Task, Worker } from './routeOptimizer';

interface TaskPriorityFactors {
  slaUrgency: number;       // 0-1, based on time remaining
  revenueImpact: number;    // 0-1, normalized revenue value
  skillComplexity: number;  // 0-1, complexity of required skills
  customerPriority: number; // 0-1, customer tier priority
  zoneEfficiency: number;   // 0-1, current zone performance
  resourceAvailability: number; // 0-1, worker/equipment availability
}

interface PrioritizedTask extends Task {
  priorityScore: number;
  priorityFactors: TaskPriorityFactors;
  recommendedWorker?: Worker;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedDelay?: number; // minutes if delayed
}

interface PrioritizationConfig {
  weights: {
    slaUrgency: number;
    revenueImpact: number;
    skillComplexity: number;
    customerPriority: number;
    zoneEfficiency: number;
    resourceAvailability: number;
  };
  thresholds: {
    critical: number;   // Above this score = critical
    high: number;       // Above this score = high
    medium: number;     // Above this score = medium
    // Below medium = low
  };
}

class TaskPrioritizer {
  private config: PrioritizationConfig;
  private customerTiers: { [customerId: string]: number } = {};
  private zonePerformance: { [zone: string]: number } = {};

  constructor(config?: Partial<PrioritizationConfig>) {
    this.config = {
      weights: {
        slaUrgency: 0.35,           // SLA compliance is critical
        revenueImpact: 0.20,        // Revenue drives business
        skillComplexity: 0.15,      // Complex tasks need priority
        customerPriority: 0.15,     // VIP customers matter
        zoneEfficiency: 0.10,       // Zone performance affects flow
        resourceAvailability: 0.05, // Resource constraints
      },
      thresholds: {
        critical: 0.85,
        high: 0.70,
        medium: 0.50,
      },
      ...config
    };

    this.initializeData();
  }

  private initializeData() {
    // Initialize customer tiers (mock data)
    this.customerTiers = {
      'CUST-001': 0.95, // VIP
      'CUST-002': 0.80, // Premium  
      'CUST-003': 0.60, // Standard
      'CUST-004': 0.40, // Basic
      'CUST-005': 0.95, // VIP
    };

    // Initialize zone performance metrics
    this.zonePerformance = {
      'A': 0.92, // Electronics - high performance
      'B': 0.75, // Appliances - medium performance  
      'C': 0.88, // Sports - good performance
      'D': 0.65, // Media - needs improvement
    };
  }

  /**
   * Calculate SLA urgency factor
   */
  private calculateSlaUrgency(task: Task): number {
    if (task.slaTime <= 0) return 1.0; // Overdue = maximum urgency
    
    const maxSlaTime = 480; // 8 hours in minutes
    const urgencyRatio = Math.max(0, (maxSlaTime - task.slaTime) / maxSlaTime);
    
    // Apply exponential curve to emphasize urgency as deadline approaches
    return Math.pow(urgencyRatio, 2);
  }

  /**
   * Calculate revenue impact factor
   */
  private calculateRevenueImpact(task: Task, allTasks: Task[]): number {
    const maxRevenue = Math.max(...allTasks.map(t => t.revenue));
    const minRevenue = Math.min(...allTasks.map(t => t.revenue));
    
    if (maxRevenue === minRevenue) return 0.5;
    
    return (task.revenue - minRevenue) / (maxRevenue - minRevenue);
  }

  /**
   * Calculate skill complexity factor
   */
  private calculateSkillComplexity(task: Task): number {
    const skillComplexityMap: { [skill: string]: number } = {
      'picking': 0.2,
      'packing': 0.3,
      'heavy-lifting': 0.6,
      'fragile-handling': 0.8,
      'electronics': 0.7,
      'furniture': 0.5,
      'hazmat': 0.9,
      'quality-control': 0.8
    };

    const totalComplexity = task.skillsRequired.reduce((sum: number, skill: string) => 
      sum + (skillComplexityMap[skill] || 0.4), 0
    );
    
    return Math.min(1.0, totalComplexity / task.skillsRequired.length);
  }

  /**
   * Calculate customer priority factor
   */
  private calculateCustomerPriority(task: Task): number {
    // Extract customer ID from task ID or use a default
    const customerId = this.extractCustomerId(task.id);
    return this.customerTiers[customerId] || 0.5;
  }

  private extractCustomerId(taskId: string): string {
    // Simple extraction logic - could be more sophisticated
    const customerMap: { [taskPrefix: string]: string } = {
      'WO-001': 'CUST-001',
      'WO-002': 'CUST-002', 
      'WO-003': 'CUST-003',
      'WO-004': 'CUST-004',
      'WO-005': 'CUST-005',
    };
    
    return customerMap[taskId] || 'CUST-003'; // Default to standard
  }

  /**
   * Calculate zone efficiency factor
   */
  private calculateZoneEfficiency(task: Task): number {
    return this.zonePerformance[task.location.zone] || 0.5;
  }

  /**
   * Calculate resource availability factor
   */
  private calculateResourceAvailability(task: Task, workers: Worker[]): number {
    const availableWorkers = workers.filter(worker =>
      task.skillsRequired.every((skill: string) => worker.skills.includes(skill))
    );
    
    if (availableWorkers.length === 0) return 0.0;
    
    const totalWorkers = workers.length;
    const availabilityRatio = availableWorkers.length / totalWorkers;
    
    // Higher availability = lower priority boost (tasks with fewer available workers get priority)
    return 1 - availabilityRatio;
  }

  /**
   * Calculate overall priority score
   */
  private calculatePriorityScore(factors: TaskPriorityFactors): number {
    const { weights } = this.config;
    
    return (
      factors.slaUrgency * weights.slaUrgency +
      factors.revenueImpact * weights.revenueImpact +
      factors.skillComplexity * weights.skillComplexity +
      factors.customerPriority * weights.customerPriority +
      factors.zoneEfficiency * weights.zoneEfficiency +
      factors.resourceAvailability * weights.resourceAvailability
    );
  }

  /**
   * Determine urgency level based on score
   */
  private getUrgencyLevel(score: number): PrioritizedTask['urgencyLevel'] {
    if (score >= this.config.thresholds.critical) return 'critical';
    if (score >= this.config.thresholds.high) return 'high';
    if (score >= this.config.thresholds.medium) return 'medium';
    return 'low';
  }

  /**
   * Find best worker for a task
   */
  private findBestWorker(task: Task, workers: Worker[]): Worker | undefined {
    const eligibleWorkers = workers.filter(worker =>
      task.skillsRequired.every((skill: string) => worker.skills.includes(skill))
    );

    if (eligibleWorkers.length === 0) return undefined;

    // Score workers based on efficiency and skill match
    const workerScores = eligibleWorkers.map(worker => {
      const skillMatchScore = worker.skills.filter((skill: string) =>
        task.skillsRequired.includes(skill)
      ).length / task.skillsRequired.length;

      const totalScore = worker.efficiency * 0.6 + skillMatchScore * 0.4;
      
      return { worker, score: totalScore };
    });

    workerScores.sort((a, b) => b.score - a.score);
    return workerScores[0].worker;
  }

  /**
   * Estimate delay if task is not prioritized
   */
  private estimateDelay(task: PrioritizedTask, allTasks: PrioritizedTask[]): number {
    // Simple estimation based on higher priority tasks ahead
    const higherPriorityTasks = allTasks.filter(t => 
      t.priorityScore > task.priorityScore && 
      t.location.zone === task.location.zone
    );

    const estimatedWaitTime = higherPriorityTasks.reduce((sum, t) => 
      sum + t.location.timeEstimate, 0
    );

    return Math.round(estimatedWaitTime * 0.8); // Account for parallel processing
  }

  /**
   * Main prioritization function
   */
  public prioritizeTasks(tasks: Task[], workers: Worker[]): PrioritizedTask[] {
    const prioritizedTasks: PrioritizedTask[] = tasks.map(task => {
      // Calculate all priority factors
      const factors: TaskPriorityFactors = {
        slaUrgency: this.calculateSlaUrgency(task),
        revenueImpact: this.calculateRevenueImpact(task, tasks),
        skillComplexity: this.calculateSkillComplexity(task),
        customerPriority: this.calculateCustomerPriority(task),
        zoneEfficiency: this.calculateZoneEfficiency(task),
        resourceAvailability: this.calculateResourceAvailability(task, workers)
      };

      const priorityScore = this.calculatePriorityScore(factors);
      const urgencyLevel = this.getUrgencyLevel(priorityScore);
      const recommendedWorker = this.findBestWorker(task, workers);

      return {
        ...task,
        priorityScore,
        priorityFactors: factors,
        recommendedWorker,
        urgencyLevel
      };
    });

    // Sort by priority score (descending)
    prioritizedTasks.sort((a, b) => b.priorityScore - a.priorityScore);

    // Calculate estimated delays
    prioritizedTasks.forEach(task => {
      task.estimatedDelay = this.estimateDelay(task, prioritizedTasks);
    });

    return prioritizedTasks;
  }

  /**
   * Get prioritization insights
   */
  public getPrioritizationInsights(prioritizedTasks: PrioritizedTask[]): {
    criticalTasks: number;
    averagePriorityScore: number;
    topBottleneck: string;
    recommendedActions: string[];
  } {
    const criticalTasks = prioritizedTasks.filter(t => t.urgencyLevel === 'critical').length;
    const averagePriorityScore = prioritizedTasks.reduce((sum, t) => sum + t.priorityScore, 0) / prioritizedTasks.length;

    // Find zone with most high-priority tasks
    const zoneTaskCounts = prioritizedTasks
      .filter(t => t.urgencyLevel === 'critical' || t.urgencyLevel === 'high')
      .reduce((acc, task) => {
        acc[task.location.zone] = (acc[task.location.zone] || 0) + 1;
        return acc;
      }, {} as { [zone: string]: number });

    const topBottleneck = Object.entries(zoneTaskCounts).length > 0 
      ? Object.entries(zoneTaskCounts).sort(([,a], [,b]) => b - a)[0][0]
      : 'None';

    const recommendedActions: string[] = [];
    
    if (criticalTasks > 3) {
      recommendedActions.push('Consider adding more workers to critical zones');
    }
    
    if (averagePriorityScore > 0.8) {
      recommendedActions.push('High overall urgency - activate emergency protocols');
    }
    
    if (topBottleneck !== 'None') {
      recommendedActions.push(`Focus resources on Zone ${topBottleneck} bottleneck`);
    }

    const overdueTasks = prioritizedTasks.filter(t => t.slaTime <= 0).length;
    if (overdueTasks > 0) {
      recommendedActions.push(`${overdueTasks} tasks are overdue - immediate attention required`);
    }

    return {
      criticalTasks,
      averagePriorityScore: Math.round(averagePriorityScore * 100) / 100,
      topBottleneck,
      recommendedActions
    };
  }

  /**
   * Update configuration weights
   */
  public updateWeights(newWeights: Partial<PrioritizationConfig['weights']>) {
    this.config.weights = { ...this.config.weights, ...newWeights };
  }

  /**
   * Update customer priorities
   */
  public updateCustomerTier(customerId: string, priority: number) {
    this.customerTiers[customerId] = Math.max(0, Math.min(1, priority));
  }

  /**
   * Update zone performance
   */
  public updateZonePerformance(zone: string, performance: number) {
    this.zonePerformance[zone] = Math.max(0, Math.min(1, performance));
  }
}

export default TaskPrioritizer;
export type { PrioritizedTask, TaskPriorityFactors, PrioritizationConfig };