// Task Management Types
export interface Task {
  id: string;
  product: string;
  location: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  sla: string;
  revenue: string;
  urgency: 'high' | 'medium' | 'low';
  assignedWorker?: string;
  estimatedTime: number; // in minutes
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'delayed';
  createdAt: Date;
  updatedAt: Date;
}

// Zone Management Types
export interface Zone {
  id: string;
  name: string;
  category: string;
  workers: number;
  status: 'Optimal' | 'Busy' | 'Normal' | 'Idle' | 'Maintenance';
  capacity: number;
  currentLoad: number;
  efficiency: number;
}

// Performance Metrics Types
export interface Metric {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
}

// System Health Types
export interface SystemService {
  name: string;
  status: 'online' | 'warning' | 'offline';
  uptime: string;
  lastChecked: Date;
}

// Route Optimization Types
export interface Route {
  id: string;
  tasks: string[];
  estimatedTime: number;
  distance: number;
  efficiency: number;
  worker?: string;
  status: 'planned' | 'active' | 'completed';
}

// Dashboard State Types
export interface DashboardState {
  tasks: Task[];
  zones: Zone[];
  metrics: Metric[];
  systemServices: SystemService[];
  routes: Route[];
  isLoading: boolean;
  lastUpdate: Date;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// User Management Types
export interface Worker {
  id: string;
  name: string;
  role: string;
  zone: string;
  shift: 'morning' | 'afternoon' | 'night';
  status: 'active' | 'break' | 'offline';
  tasksCompleted: number;
  efficiency: number;
}

// Settings Types
export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  language: string;
  timezone: string;
}

// Analytics Types
export interface AnalyticsData {
  period: 'hour' | 'day' | 'week' | 'month';
  taskCompletionRate: number[];
  efficiency: number[];
  revenue: number[];
  costs: number[];
  labels: string[];
}

// Component Props Types
export interface MetricCardProps {
  metric: Metric;
  className?: string;
}

export interface TaskItemProps {
  task: Task;
  onAssign?: (taskId: string) => void;
  onUpdate?: (task: Task) => void;
}

export interface ZoneStatusProps {
  zone: Zone;
  onClick?: (zone: Zone) => void;
}

export interface NotificationProps {
  notification: Notification;
  onDismiss?: (id: string) => void;
}