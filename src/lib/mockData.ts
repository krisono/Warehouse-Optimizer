import { Task, Zone, Metric, SystemService, DashboardState } from '@/types';

// Mock data generators
export const generateMockTasks = (): Task[] => {
  const products = [
    'Premium Electronics Bundle',
    'Kitchen Appliances Set', 
    'Sports Equipment Pack',
    'Books & Media Collection',
    'Home Office Setup',
    'Garden Tools Kit',
    'Fitness Equipment',
    'Art Supplies Collection'
  ];

  const locations = [
    'Aisle 12B-04', 'Aisle 08A-12', 'Aisle 15C-08', 'Aisle 06D-15',
    'Aisle 09F-22', 'Aisle 11A-07', 'Aisle 14G-11', 'Aisle 05B-19'
  ];

  const priorities = ['Critical', 'High', 'Medium', 'Low'] as const;
  const urgencies = ['high', 'medium', 'low'] as const;
  const statuses = ['pending', 'assigned', 'in-progress', 'completed'] as const;

  return Array.from({ length: 8 }, (_, i) => ({
    id: `WO-${String(i + 1).padStart(3, '0')}`,
    product: products[i],
    location: locations[i],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    sla: `${Math.floor(Math.random() * 30) + 5} min`,
    revenue: `$${Math.floor(Math.random() * 3000) + 500}`,
    urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
    assignedWorker: Math.random() > 0.5 ? `Worker ${Math.floor(Math.random() * 20) + 1}` : undefined,
    estimatedTime: Math.floor(Math.random() * 60) + 10,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: new Date(Date.now() - Math.random() * 86400000),
    updatedAt: new Date()
  }));
};

export const generateMockZones = (): Zone[] => {
  return [
    {
      id: 'zone-a',
      name: 'Zone A (Electronics)',
      category: 'Electronics',
      workers: 8,
      status: 'Optimal',
      capacity: 100,
      currentLoad: 75,
      efficiency: 96.8
    },
    {
      id: 'zone-b', 
      name: 'Zone B (Appliances)',
      category: 'Appliances',
      workers: 12,
      status: 'Busy',
      capacity: 150,
      currentLoad: 140,
      efficiency: 89.2
    },
    {
      id: 'zone-c',
      name: 'Zone C (Sports)',
      category: 'Sports',
      workers: 6,
      status: 'Normal',
      capacity: 80,
      currentLoad: 45,
      efficiency: 92.1
    },
    {
      id: 'zone-d',
      name: 'Zone D (Media)',
      category: 'Media',
      workers: 4,
      status: 'Idle',
      capacity: 60,
      currentLoad: 20,
      efficiency: 78.5
    }
  ];
};

export const generateMockMetrics = (): Metric[] => {
  return [
    {
      label: 'Active Tasks',
      value: 284,
      change: '+12% from yesterday',
      trend: 'up',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>',
      color: 'blue'
    },
    {
      label: 'Route Efficiency',
      value: '96.8%',
      change: '+3.2% optimized',
      trend: 'up',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
      color: 'emerald'
    },
    {
      label: 'Avg. Pick Time',
      value: '3.8m',
      change: '22% faster',
      trend: 'up',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/></svg>',
      color: 'amber'
    },
    {
      label: 'Energy Saved',
      value: '34%',
      change: 'vs. manual routing',
      trend: 'up',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/></svg>',
      color: 'purple'
    }
  ];
};

export const generateMockSystemServices = (): SystemService[] => {
  return [
    {
      name: 'Route Optimizer',
      status: 'online',
      uptime: '99.9%',
      lastChecked: new Date()
    },
    {
      name: 'Task Scheduler',
      status: 'online',
      uptime: '99.7%',
      lastChecked: new Date()
    },
    {
      name: 'Database',
      status: 'online', 
      uptime: '100%',
      lastChecked: new Date()
    },
    {
      name: 'API Gateway',
      status: 'warning',
      uptime: '97.8%',
      lastChecked: new Date()
    }
  ];
};

// Simulate API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const fetchDashboardData = async (): Promise<DashboardState> => {
  await delay(1000); // Simulate network delay
  
  return {
    tasks: generateMockTasks(),
    zones: generateMockZones(),
    metrics: generateMockMetrics(),
    systemServices: generateMockSystemServices(),
    routes: [],
    isLoading: false,
    lastUpdate: new Date()
  };
};

export const assignTask = async (taskId: string, workerId?: string): Promise<Task> => {
  await delay(500);
  
  const tasks = generateMockTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    throw new Error('Task not found');
  }

  return {
    ...task,
    status: 'assigned',
    assignedWorker: workerId || `Worker ${Math.floor(Math.random() * 20) + 1}`,
    updatedAt: new Date()
  };
};

export const updateTaskStatus = async (taskId: string, status: Task['status']): Promise<Task> => {
  await delay(300);
  
  const tasks = generateMockTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    throw new Error('Task not found');
  }

  return {
    ...task,
    status,
    updatedAt: new Date()
  };
};