"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import TaskPrioritizer, { type PrioritizedTask } from "../lib/taskPrioritizer";
import PersistentDataManager from "../lib/persistentDataManager";
import { useNotifications } from "./NotificationContext";

export interface Task {
  id: string;
  product: string;
  location: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  sla: string;
  revenue: string;
  urgency: "high" | "medium" | "low";
  status: "pending" | "assigned" | "in-progress" | "completed" | "on-hold";
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
  status: "available" | "busy" | "offline";
  activeTasks: string[];
  efficiency: number;
  tasksCompleted: number;
}

interface TaskContextType {
  tasks: Task[];
  workers: Worker[];
  prioritizedTasks: PrioritizedTask[];
  prioritizationInsights: {
    criticalTasks: number;
    averagePriorityScore: number;
    topBottleneck: string;
    recommendedActions: string[];
  };
  isLoading: boolean;
  assignTask: (taskId: string, workerId: string) => void;
  updateTaskStatus: (taskId: string, status: Task["status"]) => void;
  unassignTask: (taskId: string) => void;
  getAvailableWorkers: () => Worker[];
  getTasksForWorker: (workerId: string) => Task[];
  refreshTasks: () => void;
  reprioritizeTasks: () => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  removeTask: (taskId: string) => void;
  addWorker: (
    worker: Omit<Worker, "id" | "activeTasks" | "tasksCompleted">
  ) => void;
  removeWorker: (workerId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Mock data generation
const generateMockWorkers = (): Worker[] => {
  return [
    {
      id: "W001",
      name: "John Smith",
      email: "john.smith@warehouse.com",
      skills: ["Electronics", "Heavy Lifting"],
      currentZone: "A",
      status: "available",
      activeTasks: [],
      efficiency: 94.2,
      tasksCompleted: 847,
    },
    {
      id: "W002",
      name: "Sarah Johnson",
      email: "sarah.j@warehouse.com",
      skills: ["Appliances", "Quality Control"],
      currentZone: "B",
      status: "busy",
      activeTasks: ["WO-002"],
      efficiency: 97.8,
      tasksCompleted: 923,
    },
    {
      id: "W003",
      name: "Mike Chen",
      email: "mike.chen@warehouse.com",
      skills: ["Sports Equipment", "Fragile Items"],
      currentZone: "C",
      status: "available",
      activeTasks: [],
      efficiency: 91.5,
      tasksCompleted: 612,
    },
    {
      id: "W004",
      name: "Emily Davis",
      email: "emily.d@warehouse.com",
      skills: ["Books & Media", "Small Items"],
      currentZone: "D",
      status: "available",
      activeTasks: [],
      efficiency: 89.3,
      tasksCompleted: 743,
    },
    {
      id: "W005",
      name: "Alex Rodriguez",
      email: "alex.r@warehouse.com",
      skills: ["Electronics", "Appliances", "Heavy Lifting"],
      currentZone: "A",
      status: "offline",
      activeTasks: [],
      efficiency: 96.1,
      tasksCompleted: 1056,
    },
  ];
};

const generateMockTasks = (): Task[] => {
  return [
    {
      id: "WO-001",
      product: "Premium Electronics Bundle",
      location: "Aisle 12B-04",
      priority: "Critical",
      sla: "6 min",
      revenue: "$3,250",
      urgency: "high",
      status: "pending",
      estimatedTime: 8,
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
      updatedAt: new Date(),
      category: "Electronics",
      weight: "15.2 kg",
      dimensions: "45x30x20 cm",
      zone: "A",
      aisle: "12B",
      shelf: "04",
    },
    {
      id: "WO-002",
      product: "Kitchen Appliances Set",
      location: "Aisle 08A-12",
      priority: "High",
      sla: "12 min",
      revenue: "$1,890",
      urgency: "medium",
      status: "assigned",
      assignedWorker: "Sarah Johnson",
      estimatedTime: 15,
      createdAt: new Date(Date.now() - 8 * 60 * 1000), // 8 mins ago
      updatedAt: new Date(),
      category: "Appliances",
      weight: "22.5 kg",
      dimensions: "60x40x35 cm",
      zone: "B",
      aisle: "08A",
      shelf: "12",
    },
    {
      id: "WO-003",
      product: "Sports Equipment Pack",
      location: "Aisle 15C-08",
      priority: "High",
      sla: "18 min",
      revenue: "$1,450",
      urgency: "medium",
      status: "pending",
      estimatedTime: 12,
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
      updatedAt: new Date(),
      category: "Sports",
      weight: "18.7 kg",
      dimensions: "80x25x25 cm",
      zone: "C",
      aisle: "15C",
      shelf: "08",
    },
    {
      id: "WO-004",
      product: "Books & Media Collection",
      location: "Aisle 06D-15",
      priority: "Medium",
      sla: "25 min",
      revenue: "$680",
      urgency: "low",
      status: "pending",
      estimatedTime: 10,
      createdAt: new Date(Date.now() - 3 * 60 * 1000), // 3 mins ago
      updatedAt: new Date(),
      category: "Books & Media",
      weight: "12.3 kg",
      dimensions: "35x25x30 cm",
      zone: "D",
      aisle: "06D",
      shelf: "15",
    },
    {
      id: "WO-005",
      product: "Home Office Setup",
      location: "Aisle 14A-22",
      priority: "Critical",
      sla: "8 min",
      revenue: "$2,850",
      urgency: "high",
      status: "in-progress",
      assignedWorker: "John Smith",
      estimatedTime: 20,
      createdAt: new Date(Date.now() - 25 * 60 * 1000), // 25 mins ago
      updatedAt: new Date(),
      category: "Office Equipment",
      weight: "28.9 kg",
      dimensions: "70x45x40 cm",
      zone: "A",
      aisle: "14A",
      shelf: "22",
    },
  ];
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const [dataManager] = useState(() => PersistentDataManager.getInstance());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [prioritizedTasks, setPrioritizedTasks] = useState<PrioritizedTask[]>(
    []
  );
  const [prioritizationInsights, setPrioritizationInsights] = useState<{
    criticalTasks: number;
    averagePriorityScore: number;
    topBottleneck: string;
    recommendedActions: string[];
  }>({
    criticalTasks: 0,
    averagePriorityScore: 0,
    topBottleneck: "None",
    recommendedActions: [],
  });
  const [taskPrioritizer] = useState(() => new TaskPrioritizer());
  const [isLoading, setIsLoading] = useState(true);

  // Always call hooks at the top level
  const notificationHooks = useNotifications();

  // Convert Task to prioritizer-compatible format
  const convertTasksForPrioritizer = (tasks: Task[]) => {
    return tasks.map((task) => ({
      id: task.id,
      location: {
        id: `${task.zone}-${task.aisle}-${task.shelf}`,
        x: Math.random() * 100, // Mock coordinates
        y: Math.random() * 100,
        zone: task.zone,
        priority:
          task.priority === "Critical" ? 3 : task.priority === "High" ? 2 : 1,
        timeEstimate: task.estimatedTime,
      },
      priority: task.priority.toLowerCase() as
        | "critical"
        | "high"
        | "medium"
        | "low",
      slaTime: parseInt(task.sla.replace(" min", "")) || 30,
      revenue: parseFloat(task.revenue.replace(/[$,]/g, "")) || 100,
      skillsRequired: [task.category.toLowerCase().replace(/ /g, "-")],
    }));
  };

  // Convert Worker to prioritizer-compatible format
  const convertWorkersForPrioritizer = (workers: Worker[]) => {
    return workers.map((worker) => ({
      id: worker.id,
      name: worker.name,
      skills: worker.skills.map((skill) =>
        skill.toLowerCase().replace(/ /g, "-")
      ),
      currentLocation: {
        id: `${worker.currentZone || "A"}-01-01`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        zone: worker.currentZone || "A",
        priority: 1,
        timeEstimate: 5,
      },
      maxCapacity: 5,
      efficiency: worker.efficiency / 100,
    }));
  };

  // Prioritize tasks using the AI system
  const reprioritizeTasks = useCallback(() => {
    const convertedTasks = convertTasksForPrioritizer(
      tasks.filter((t) => t.status !== "completed")
    );
    const convertedWorkers = convertWorkersForPrioritizer(workers);

    const prioritized = taskPrioritizer.prioritizeTasks(
      convertedTasks,
      convertedWorkers
    );
    const insights = taskPrioritizer.getPrioritizationInsights(prioritized);

    setPrioritizedTasks(prioritized);
    setPrioritizationInsights(insights);
  }, [tasks, workers, taskPrioritizer]);

  // Initialize prioritization on mount and when tasks/workers change
  useEffect(() => {
    if (tasks.length > 0 && workers.length > 0) {
      reprioritizeTasks();
    }
  }, [tasks, workers, reprioritizeTasks]);

  // Load data from persistent storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Validate and migrate data first
        dataManager.validateAndMigrateData();

        // Load saved data
        const savedTasks = dataManager.loadTasks();
        const savedWorkers = dataManager.loadWorkers();

        // Use saved data if available, otherwise use mock data
        if (savedTasks.length > 0) {
          setTasks(savedTasks);
        } else {
          const mockTasks = generateMockTasks();
          setTasks(mockTasks);
          dataManager.saveTasks(mockTasks);
        }

        if (savedWorkers.length > 0) {
          setWorkers(savedWorkers);
        } else {
          const mockWorkers = generateMockWorkers();
          setWorkers(mockWorkers);
          dataManager.saveWorkers(mockWorkers);
        }
      } catch (error) {
        console.error("Failed to load persistent data:", error);
        // Fallback to mock data
        setTasks(generateMockTasks());
        setWorkers(generateMockWorkers());
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dataManager]);

  // Auto-save tasks when they change
  useEffect(() => {
    if (!isLoading && tasks.length > 0) {
      dataManager.saveTasks(tasks);
    }
  }, [tasks, isLoading, dataManager]);

  // Auto-save workers when they change
  useEffect(() => {
    if (!isLoading && workers.length > 0) {
      dataManager.saveWorkers(workers);
    }
  }, [workers, isLoading, dataManager]);

  // SLA monitoring and notifications
  useEffect(() => {
    const monitorSLA = () => {
      if (!notificationHooks) return;

      const now = new Date();
      tasks.forEach((task) => {
        if (task.status === "pending" || task.status === "assigned") {
          const slaMinutes = parseInt(task.sla.replace(" min", "")) || 30;
          const taskAge = now.getTime() - task.createdAt.getTime();
          const ageInMinutes = Math.floor(taskAge / (1000 * 60));
          const timeRemaining = slaMinutes - ageInMinutes;

          // Warning at 5 minutes remaining
          if (timeRemaining === 5 || timeRemaining === 2) {
            notificationHooks.showSLAWarning(
              task.id,
              task.product,
              timeRemaining
            );
          }

          // Critical alert at SLA breach
          if (timeRemaining <= 0 && ageInMinutes === slaMinutes) {
            notificationHooks.addNotification({
              type: "error",
              title: "SLA Breached",
              message: `Task "${task.product}" has exceeded its SLA target of ${slaMinutes} minutes`,
              priority: "critical",
              persistent: true,
            });
          }
        }
      });
    };

    const interval = setInterval(monitorSLA, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks, notificationHooks]);

  const assignTask = (taskId: string, workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "assigned" as const,
              assignedWorker: worker.name,
              updatedAt: new Date(),
            }
          : task
      )
    );

    setWorkers((prevWorkers) =>
      prevWorkers.map((w) =>
        w.id === workerId
          ? {
              ...w,
              status: w.activeTasks.length > 0 ? "busy" : ("busy" as const),
              activeTasks: [...w.activeTasks, taskId],
            }
          : w
      )
    );

    // Find the task for notification
    const task = tasks.find((t) => t.id === taskId);

    // Show notification
    if (notificationHooks && task) {
      notificationHooks.showTaskAssignment(taskId, task.product, worker.name);
    }

    // Show success notification
    setTimeout(() => {
      alert(`Task ${taskId} has been assigned to ${worker.name}`);
    }, 100);
  };

  const updateTaskStatus = (taskId: string, status: Task["status"]) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status, updatedAt: new Date() } : task
      )
    );

    // If task is completed, remove from worker's active tasks
    if (status === "completed") {
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.assignedWorker) {
        setWorkers((prevWorkers) =>
          prevWorkers.map((w) =>
            w.name === task.assignedWorker
              ? {
                  ...w,
                  activeTasks: w.activeTasks.filter((id) => id !== taskId),
                  tasksCompleted: w.tasksCompleted + 1,
                  status:
                    w.activeTasks.filter((id) => id !== taskId).length === 0
                      ? "available"
                      : "busy",
                }
              : w
          )
        );

        // Show completion notification
        if (notificationHooks && task) {
          notificationHooks.addNotification({
            type: "success",
            title: "Task Completed",
            message: `Task "${task.product}" has been completed by ${task.assignedWorker}`,
            priority: "normal",
          });
        }
      }
    }
  };

  const unassignTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.assignedWorker) return;

    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "pending" as const,
              assignedWorker: undefined,
              updatedAt: new Date(),
            }
          : t
      )
    );

    setWorkers((prevWorkers) =>
      prevWorkers.map((w) =>
        w.name === task.assignedWorker
          ? {
              ...w,
              activeTasks: w.activeTasks.filter((id) => id !== taskId),
              status:
                w.activeTasks.filter((id) => id !== taskId).length === 0
                  ? "available"
                  : "busy",
            }
          : w
      )
    );
  };

  const getAvailableWorkers = () => {
    return workers.filter(
      (w) => w.status === "available" || w.activeTasks.length < 3
    );
  };

  const getTasksForWorker = (workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return [];
    return tasks.filter((t) => worker.activeTasks.includes(t.id));
  };

  const refreshTasks = () => {
    // Simulate real-time updates
    const now = new Date();
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({
        ...task,
        updatedAt: now,
      }))
    );
  };

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: `WO-${Date.now().toString().slice(-6)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);

    // Show notification for new task
    if (notificationHooks) {
      notificationHooks.addNotification({
        type: "info",
        title: "New Task Created",
        message: `Task "${newTask.product}" has been added to the queue`,
        priority: newTask.priority === "Critical" ? "high" : "normal",
      });
    }
  };

  const removeTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    // Remove task from workers' active tasks
    setWorkers((prevWorkers) =>
      prevWorkers.map((worker) => ({
        ...worker,
        activeTasks: worker.activeTasks.filter((id) => id !== taskId),
        status:
          worker.activeTasks.filter((id) => id !== taskId).length === 0
            ? "available"
            : worker.status,
      }))
    );
  };

  const addWorker = (
    workerData: Omit<Worker, "id" | "activeTasks" | "tasksCompleted">
  ) => {
    const newWorker: Worker = {
      ...workerData,
      id: `W${Date.now().toString().slice(-3)}`,
      activeTasks: [],
      tasksCompleted: 0,
    };

    setWorkers((prevWorkers) => [...prevWorkers, newWorker]);
  };

  const removeWorker = (workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (worker && worker.activeTasks.length > 0) {
      // Unassign all tasks from this worker
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          worker.activeTasks.includes(task.id)
            ? {
                ...task,
                status: "pending" as const,
                assignedWorker: undefined,
                updatedAt: new Date(),
              }
            : task
        )
      );
    }

    setWorkers((prevWorkers) =>
      prevWorkers.filter((worker) => worker.id !== workerId)
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        workers,
        prioritizedTasks,
        prioritizationInsights,
        isLoading,
        assignTask,
        updateTaskStatus,
        unassignTask,
        getAvailableWorkers,
        getTasksForWorker,
        refreshTasks,
        reprioritizeTasks,
        addTask,
        removeTask,
        addWorker,
        removeWorker,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
}
