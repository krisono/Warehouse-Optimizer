import { Task, Worker } from '../context/TaskContext';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    smsEnabled: boolean;
    slaWarnings: boolean;
    taskAssignments: boolean;
    systemAlerts: boolean;
  };
  dashboard: {
    defaultView: 'tasks' | 'analytics' | 'routes' | 'settings';
    refreshInterval: number;
    autoRefresh: boolean;
    compactMode: boolean;
  };
  filters: {
    defaultPriority: string[];
    defaultStatus: string[];
    defaultZones: string[];
  };
}

export interface AppSettings {
  warehouse: {
    name: string;
    location: string;
    zones: string[];
    workingHours: {
      start: string;
      end: string;
      timezone: string;
    };
  };
  performance: {
    targetSLA: number;
    maxTasksPerWorker: number;
    prioritizationEnabled: boolean;
    routeOptimizationEnabled: boolean;
  };
  integrations: {
    wmsConnected: boolean;
    erpConnected: boolean;
    apiEndpoint?: string;
    syncInterval: number;
  };
}

export interface CachedData {
  tasks: Task[];
  workers: Worker[];
  analytics: Record<string, unknown>;
  lastSyncTime: number;
  version: string;
}

class PersistentDataManager {
  private static instance: PersistentDataManager;
  private readonly STORAGE_KEYS = {
    TASKS: 'warehouse-tasks',
    WORKERS: 'warehouse-workers',
    USER_PREFERENCES: 'warehouse-user-preferences',
    APP_SETTINGS: 'warehouse-app-settings',
    ANALYTICS_CACHE: 'warehouse-analytics-cache',
    SESSION_DATA: 'warehouse-session-data',
  };

  private readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notifications: {
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: false,
      slaWarnings: true,
      taskAssignments: true,
      systemAlerts: true,
    },
    dashboard: {
      defaultView: 'tasks',
      refreshInterval: 30000, // 30 seconds
      autoRefresh: true,
      compactMode: false,
    },
    filters: {
      defaultPriority: ['Critical', 'High'],
      defaultStatus: ['pending', 'assigned', 'in-progress'],
      defaultZones: ['A', 'B', 'C', 'D'],
    },
  };

  private readonly DEFAULT_SETTINGS: AppSettings = {
    warehouse: {
      name: 'Main Warehouse',
      location: 'New York, NY',
      zones: ['A', 'B', 'C', 'D'],
      workingHours: {
        start: '06:00',
        end: '22:00',
        timezone: 'America/New_York',
      },
    },
    performance: {
      targetSLA: 15, // minutes
      maxTasksPerWorker: 5,
      prioritizationEnabled: true,
      routeOptimizationEnabled: true,
    },
    integrations: {
      wmsConnected: false,
      erpConnected: false,
      syncInterval: 300000, // 5 minutes
    },
  };

  static getInstance(): PersistentDataManager {
    if (!PersistentDataManager.instance) {
      PersistentDataManager.instance = new PersistentDataManager();
    }
    return PersistentDataManager.instance;
  }

  // Generic storage methods
  private setItem<T>(key: string, data: T): void {
    try {
      const serialized = JSON.stringify({
        data,
        timestamp: Date.now(),
        version: '1.0.0',
      });
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  }

  private getItem<T>(key: string, defaultValue: T | null): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      const parsed = JSON.parse(item);
      
      // Handle old format data (migrate if needed)
      if (parsed.data !== undefined) {
        return parsed.data as T;
      }
      
      // Handle direct data (legacy format)
      return parsed as T;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return defaultValue;
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  }

  // Task management
  saveTasks(tasks: Task[]): void {
    this.setItem(this.STORAGE_KEYS.TASKS, tasks);
  }

  loadTasks(): Task[] {
    const tasks = this.getItem<Task[] | null>(this.STORAGE_KEYS.TASKS, null);
    
    if (!tasks) return [];
    
    // Ensure dates are properly parsed
    return tasks.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));
  }

  // Worker management
  saveWorkers(workers: Worker[]): void {
    this.setItem(this.STORAGE_KEYS.WORKERS, workers);
  }

  loadWorkers(): Worker[] {
    return this.getItem<Worker[] | null>(this.STORAGE_KEYS.WORKERS, null) || [];
  }

  // User preferences
  saveUserPreferences(preferences: UserPreferences): void {
    this.setItem(this.STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  loadUserPreferences(): UserPreferences {
    return this.getItem<UserPreferences | null>(
      this.STORAGE_KEYS.USER_PREFERENCES,
      null
    ) || this.DEFAULT_PREFERENCES;
  }

  // App settings
  saveAppSettings(settings: AppSettings): void {
    this.setItem(this.STORAGE_KEYS.APP_SETTINGS, settings);
  }

  loadAppSettings(): AppSettings {
    return this.getItem<AppSettings | null>(
      this.STORAGE_KEYS.APP_SETTINGS,
      null
    ) || this.DEFAULT_SETTINGS;
  }

  // Analytics cache
  saveAnalyticsCache(data: Record<string, unknown>): void {
    this.setItem(this.STORAGE_KEYS.ANALYTICS_CACHE, {
      ...data,
      cachedAt: Date.now(),
    });
  }

  loadAnalyticsCache(): Record<string, unknown> | null {
    const cached = this.getItem<Record<string, unknown> | null>(this.STORAGE_KEYS.ANALYTICS_CACHE, null);
    
    if (!cached) return null;
    
    // Check if cache is still valid (24 hours)
    const cachedAt = typeof cached.cachedAt === 'number' ? cached.cachedAt : 0;
    const cacheAge = Date.now() - cachedAt;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (cacheAge > maxAge) {
      this.removeItem(this.STORAGE_KEYS.ANALYTICS_CACHE);
      return null;
    }
    
    return cached;
  }

  // Session data (temporary data that expires when browser closes)
  saveSessionData(key: string, data: unknown): void {
    try {
      sessionStorage.setItem(`warehouse-session-${key}`, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save session data ${key}:`, error);
    }
  }

  loadSessionData<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = sessionStorage.getItem(`warehouse-session-${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Failed to load session data ${key}:`, error);
      return defaultValue;
    }
  }

  clearSessionData(key?: string): void {
    try {
      if (key) {
        sessionStorage.removeItem(`warehouse-session-${key}`);
      } else {
        // Clear all session data
        Object.keys(sessionStorage).forEach(k => {
          if (k.startsWith('warehouse-session-')) {
            sessionStorage.removeItem(k);
          }
        });
      }
    } catch (error) {
      console.error('Failed to clear session data:', error);
    }
  }

  // Data management utilities
  exportData(): string {
    const data = {
      tasks: this.loadTasks(),
      workers: this.loadWorkers(),
      preferences: this.loadUserPreferences(),
      settings: this.loadAppSettings(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.version) {
        return { success: false, message: 'Invalid data format' };
      }
      
      if (data.tasks) this.saveTasks(data.tasks);
      if (data.workers) this.saveWorkers(data.workers);
      if (data.preferences) this.saveUserPreferences(data.preferences);
      if (data.settings) this.saveAppSettings(data.settings);
      
      return { success: true, message: 'Data imported successfully' };
    } catch (_error) {
      return { success: false, message: 'Failed to import data: Invalid JSON' };
    }
  }

  clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
    this.clearSessionData();
  }

  // Storage usage information
  getStorageInfo(): {
    used: number;
    available: number;
    percentage: number;
  } {
    try {
      let used = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith('warehouse-')) {
          used += localStorage[key].length;
        }
      }
      
      // Estimate available space (most browsers allow 5-10MB)
      const estimated = 5 * 1024 * 1024; // 5MB estimate
      
      return {
        used,
        available: estimated,
        percentage: (used / estimated) * 100,
      };
    } catch (_error) {
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  // Data validation and migration
  validateAndMigrateData(): void {
    try {
      // Validate tasks data
      const tasks = this.loadTasks();
      const validTasks = tasks.filter(task => 
        task.id && task.product && task.status
      );
      
      if (validTasks.length !== tasks.length) {
        console.warn(`Removed ${tasks.length - validTasks.length} invalid tasks`);
        this.saveTasks(validTasks);
      }
      
      // Validate workers data
      const workers = this.loadWorkers();
      const validWorkers = workers.filter(worker =>
        worker.id && worker.name && worker.email
      );
      
      if (validWorkers.length !== workers.length) {
        console.warn(`Removed ${workers.length - validWorkers.length} invalid workers`);
        this.saveWorkers(validWorkers);
      }
      
      // Migrate old preferences if needed
      const preferences = this.loadUserPreferences();
      if (!preferences.dashboard) {
        this.saveUserPreferences({ ...this.DEFAULT_PREFERENCES, ...preferences });
      }
      
    } catch (error) {
      console.error('Data validation/migration failed:', error);
    }
  }
}

export default PersistentDataManager;