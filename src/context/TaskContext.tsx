"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Task {
  id: string;
  product: string;
  location: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  sla: string;
  revenue: string;
  urgency: 'high' | 'medium' | 'low';
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'on-hold';
  assignedWorker?: string;
  estimatedTime: number;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  weight?: string;
  dimensions?: string;
  zone: string;
  aisle: string;
  shelf: string;
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  skills: string[];
  currentZone?: string;
  status: 'available' | 'busy' | 'offline';
  activeTasks: string[];
  efficiency: number;
  tasksCompleted: number;
}

interface TaskContextType {
  tasks: Task[];
  workers: Worker[];
  assignTask: (taskId: string, workerId: string) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  unassignTask: (taskId: string) => void;
  getAvailableWorkers: () => Worker[];
  getTasksForWorker: (workerId: string) => Task[];
  refreshTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Mock data generation
const generateMockWorkers = (): Worker[] => {
  return [
    {
      id: 'W001',
      name: 'John Smith',
      email: 'john.smith@warehouse.com',
      skills: ['Electronics', 'Heavy Lifting'],
      currentZone: 'A',
      status: 'available',
      activeTasks: [],
      efficiency: 94.2,
      tasksCompleted: 847
    },
    {
      id: 'W002',
      name: 'Sarah Johnson',
      email: 'sarah.j@warehouse.com',
      skills: ['Appliances', 'Quality Control'],
      currentZone: 'B',
      status: 'busy',
      activeTasks: ['WO-002'],
      efficiency: 97.8,
      tasksCompleted: 923
    },
    {
      id: 'W003',
      name: 'Mike Chen',
      email: 'mike.chen@warehouse.com',
      skills: ['Sports Equipment', 'Fragile Items'],
      currentZone: 'C',
      status: 'available',
      activeTasks: [],
      efficiency: 91.5,
      tasksCompleted: 612
    },
    {
      id: 'W004',
      name: 'Emily Davis',
      email: 'emily.d@warehouse.com',
      skills: ['Books & Media', 'Small Items'],
      currentZone: 'D',
      status: 'available',
      activeTasks: [],
      efficiency: 89.3,
      tasksCompleted: 743
    },
    {
      id: 'W005',
      name: 'Alex Rodriguez',
      email: 'alex.r@warehouse.com',
      skills: ['Electronics', 'Appliances', 'Heavy Lifting'],
      currentZone: 'A',
      status: 'offline',
      activeTasks: [],
      efficiency: 96.1,
      tasksCompleted: 1056
    }
  ];
};

const generateMockTasks = (): Task[] => {
  return [
    {
      id: 'WO-001',
      product: 'Premium Electronics Bundle',
      location: 'Aisle 12B-04',
      priority: 'Critical',
      sla: '6 min',
      revenue: '$3,250',
      urgency: 'high',
      status: 'pending',
      estimatedTime: 8,
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
      updatedAt: new Date(),
      category: 'Electronics',
      weight: '15.2 kg',
      dimensions: '45x30x20 cm',
      zone: 'A',
      aisle: '12B',
      shelf: '04'
    },
    {
      id: 'WO-002',
      product: 'Kitchen Appliances Set',
      location: 'Aisle 08A-12',
      priority: 'High',
      sla: '12 min',
      revenue: '$1,890',
      urgency: 'medium',
      status: 'assigned',
      assignedWorker: 'Sarah Johnson',
      estimatedTime: 15,
      createdAt: new Date(Date.now() - 8 * 60 * 1000), // 8 mins ago
      updatedAt: new Date(),
      category: 'Appliances',
      weight: '22.5 kg',
      dimensions: '60x40x35 cm',
      zone: 'B',
      aisle: '08A',
      shelf: '12'
    },
    {
      id: 'WO-003',
      product: 'Sports Equipment Pack',
      location: 'Aisle 15C-08',
      priority: 'High',
      sla: '18 min',
      revenue: '$1,450',
      urgency: 'medium',
      status: 'pending',
      estimatedTime: 12,
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
      updatedAt: new Date(),
      category: 'Sports',
      weight: '18.7 kg',
      dimensions: '80x25x25 cm',
      zone: 'C',
      aisle: '15C',
      shelf: '08'
    },
    {
      id: 'WO-004',
      product: 'Books & Media Collection',
      location: 'Aisle 06D-15',
      priority: 'Medium',
      sla: '25 min',
      revenue: '$680',
      urgency: 'low',
      status: 'pending',
      estimatedTime: 10,
      createdAt: new Date(Date.now() - 3 * 60 * 1000), // 3 mins ago
      updatedAt: new Date(),
      category: 'Books & Media',
      weight: '12.3 kg',
      dimensions: '35x25x30 cm',
      zone: 'D',
      aisle: '06D',
      shelf: '15'
    },
    {
      id: 'WO-005',
      product: 'Home Office Setup',
      location: 'Aisle 14A-22',
      priority: 'Critical',
      sla: '8 min',
      revenue: '$2,850',
      urgency: 'high',
      status: 'in-progress',
      assignedWorker: 'John Smith',
      estimatedTime: 20,
      createdAt: new Date(Date.now() - 25 * 60 * 1000), // 25 mins ago
      updatedAt: new Date(),
      category: 'Office Equipment',
      weight: '28.9 kg',
      dimensions: '70x45x40 cm',
      zone: 'A',
      aisle: '14A',
      shelf: '22'
    }
  ];
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(generateMockTasks);
  const [workers, setWorkers] = useState<Worker[]>(generateMockWorkers);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('warehouse-tasks');
    const savedWorkers = localStorage.getItem('warehouse-workers');
    
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        setTasks(parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        })));
      } catch (error) {
        console.warn('Failed to parse saved tasks:', error);
      }
    }

    if (savedWorkers) {
      try {
        setWorkers(JSON.parse(savedWorkers));
      } catch (error) {
        console.warn('Failed to parse saved workers:', error);
      }
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('warehouse-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('warehouse-workers', JSON.stringify(workers));
  }, [workers]);

  const assignTask = (taskId: string, workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;

    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: 'assigned' as const, 
              assignedWorker: worker.name,
              updatedAt: new Date()
            }
          : task
      )
    );

    setWorkers(prevWorkers =>
      prevWorkers.map(w =>
        w.id === workerId
          ? {
              ...w,
              status: w.activeTasks.length > 0 ? 'busy' : 'busy' as const,
              activeTasks: [...w.activeTasks, taskId]
            }
          : w
      )
    );

    // Show success notification
    setTimeout(() => {
      alert(`Task ${taskId} has been assigned to ${worker.name}`);
    }, 100);
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status, updatedAt: new Date() }
          : task
      )
    );

    // If task is completed, remove from worker's active tasks
    if (status === 'completed') {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.assignedWorker) {
        setWorkers(prevWorkers =>
          prevWorkers.map(w =>
            w.name === task.assignedWorker
              ? {
                  ...w,
                  activeTasks: w.activeTasks.filter(id => id !== taskId),
                  tasksCompleted: w.tasksCompleted + 1,
                  status: w.activeTasks.filter(id => id !== taskId).length === 0 ? 'available' : 'busy'
                }
              : w
          )
        );
      }
    }
  };

  const unassignTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.assignedWorker) return;

    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === taskId
          ? { ...t, status: 'pending' as const, assignedWorker: undefined, updatedAt: new Date() }
          : t
      )
    );

    setWorkers(prevWorkers =>
      prevWorkers.map(w =>
        w.name === task.assignedWorker
          ? {
              ...w,
              activeTasks: w.activeTasks.filter(id => id !== taskId),
              status: w.activeTasks.filter(id => id !== taskId).length === 0 ? 'available' : 'busy'
            }
          : w
      )
    );
  };

  const getAvailableWorkers = () => {
    return workers.filter(w => w.status === 'available' || w.activeTasks.length < 3);
  };

  const getTasksForWorker = (workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return [];
    return tasks.filter(t => worker.activeTasks.includes(t.id));
  };

  const refreshTasks = () => {
    // Simulate real-time updates
    const now = new Date();
    setTasks(prevTasks =>
      prevTasks.map(task => ({
        ...task,
        updatedAt: now
      }))
    );
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      workers,
      assignTask,
      updateTaskStatus,
      unassignTask,
      getAvailableWorkers,
      getTasksForWorker,
      refreshTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}