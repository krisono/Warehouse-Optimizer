"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { DashboardState, Task } from "@/types";
import {
  fetchDashboardData,
  assignTask,
  updateTaskStatus,
} from "@/lib/mockData";

interface DashboardContextType extends DashboardState {
  assignTask: (taskId: string, workerId?: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task["status"]) => Promise<void>;
  refreshData: () => Promise<void>;
  error: string | null;
}

type DashboardAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_DATA"; payload: DashboardState }
  | { type: "SET_ERROR"; payload: string }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "SET_LAST_UPDATE"; payload: Date };

const initialState: DashboardState = {
  tasks: [],
  zones: [],
  metrics: [],
  systemServices: [],
  routes: [],
  isLoading: true,
  lastUpdate: new Date(),
};

function dashboardReducer(
  state: DashboardState,
  action: DashboardAction
): DashboardState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_DATA":
      return { ...action.payload, isLoading: false };
    case "SET_ERROR":
      return { ...state, isLoading: false };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
        lastUpdate: new Date(),
      };
    case "SET_LAST_UPDATE":
      return { ...state, lastUpdate: action.payload };
    default:
      return state;
  }
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      setError(null);
      const data = await fetchDashboardData();
      dispatch({ type: "SET_DATA", payload: data });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load data";
      setError(errorMessage);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  };

  const handleAssignTask = async (taskId: string, workerId?: string) => {
    try {
      const updatedTask = await assignTask(taskId, workerId);
      dispatch({ type: "UPDATE_TASK", payload: updatedTask });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to assign task";
      setError(errorMessage);
    }
  };

  const handleUpdateTaskStatus = async (
    taskId: string,
    status: Task["status"]
  ) => {
    try {
      const updatedTask = await updateTaskStatus(taskId, status);
      dispatch({ type: "UPDATE_TASK", payload: updatedTask });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update task";
      setError(errorMessage);
    }
  };

  useEffect(() => {
    const loadInitialData = () => {
      refreshData();
    };

    loadInitialData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      dispatch({ type: "SET_LAST_UPDATE", payload: new Date() });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const value: DashboardContextType = {
    ...state,
    assignTask: handleAssignTask,
    updateTaskStatus: handleUpdateTaskStatus,
    refreshData,
    error,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
