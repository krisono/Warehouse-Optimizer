"use client";

import { useState } from "react";
import {
  Package,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Clock,
  MapPin,
} from "lucide-react";
import { AppShell, PageHeader, Card } from "@/components/ui";

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  type TaskType = {
    id: string;
    product: string;
    location: string;
    priority: string;
    sla: string;
    revenue: string;
    urgency: string;
    status: string;
    assignedWorker: string | null;
    estimatedTime: number;
    category: string;
    weight: string;
    dimensions: string;
  };

  const [selectedTaskForAssignment, setSelectedTaskForAssignment] =
    useState<TaskType | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Extended mock data with more tasks
  const allTasks = [
    {
      id: "WO-001",
      product: "Premium Electronics Bundle",
      location: "Aisle 12B-04",
      priority: "Critical",
      sla: "6 min",
      revenue: "$3,250",
      urgency: "high",
      status: "pending",
      assignedWorker: null,
      estimatedTime: 8,
      category: "Electronics",
      weight: "15.2 kg",
      dimensions: "45x30x20 cm",
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
      assignedWorker: "John Smith",
      estimatedTime: 15,
      category: "Appliances",
      weight: "22.8 kg",
      dimensions: "60x40x35 cm",
    },
    {
      id: "WO-003",
      product: "Sports Equipment Pack",
      location: "Aisle 15C-08",
      priority: "High",
      sla: "18 min",
      revenue: "$1,450",
      urgency: "medium",
      status: "in-progress",
      assignedWorker: "Maria Garcia",
      estimatedTime: 12,
      category: "Sports",
      weight: "8.5 kg",
      dimensions: "80x25x25 cm",
    },
    {
      id: "WO-004",
      product: "Books & Media Collection",
      location: "Aisle 06D-15",
      priority: "Medium",
      sla: "25 min",
      revenue: "$680",
      urgency: "low",
      status: "completed",
      assignedWorker: "David Lee",
      estimatedTime: 20,
      category: "Media",
      weight: "12.3 kg",
      dimensions: "40x30x30 cm",
    },
    {
      id: "WO-005",
      product: "Home Office Furniture",
      location: "Aisle 03F-22",
      priority: "High",
      sla: "30 min",
      revenue: "$2,100",
      urgency: "high",
      status: "pending",
      assignedWorker: null,
      estimatedTime: 25,
      category: "Furniture",
      weight: "35.7 kg",
      dimensions: "120x60x40 cm",
    },
    {
      id: "WO-006",
      product: "Garden Tools & Equipment",
      location: "Aisle 20A-05",
      priority: "Medium",
      sla: "15 min",
      revenue: "$890",
      urgency: "medium",
      status: "assigned",
      assignedWorker: "Sarah Johnson",
      estimatedTime: 18,
      category: "Garden",
      weight: "18.9 kg",
      dimensions: "100x30x15 cm",
    },
    {
      id: "WO-007",
      product: "Baby Care Essentials",
      location: "Aisle 11E-18",
      priority: "Critical",
      sla: "8 min",
      revenue: "$1,250",
      urgency: "high",
      status: "pending",
      assignedWorker: null,
      estimatedTime: 10,
      category: "Baby",
      weight: "6.2 kg",
      dimensions: "50x40x30 cm",
    },
    {
      id: "WO-008",
      product: "Automotive Parts Kit",
      location: "Aisle 18G-11",
      priority: "Low",
      sla: "45 min",
      revenue: "$1,680",
      urgency: "low",
      status: "in-progress",
      assignedWorker: "Mike Wilson",
      estimatedTime: 35,
      category: "Automotive",
      weight: "28.4 kg",
      dimensions: "70x50x25 cm",
    },
    {
      id: "WO-009",
      product: "Fashion Accessories Bundle",
      location: "Aisle 07C-09",
      priority: "Medium",
      sla: "20 min",
      revenue: "$720",
      urgency: "medium",
      status: "completed",
      assignedWorker: "Lisa Brown",
      estimatedTime: 14,
      category: "Fashion",
      weight: "3.8 kg",
      dimensions: "60x40x10 cm",
    },
    {
      id: "WO-010",
      product: "Craft & Hobby Supplies",
      location: "Aisle 14B-16",
      priority: "Low",
      sla: "35 min",
      revenue: "$450",
      urgency: "low",
      status: "pending",
      assignedWorker: null,
      estimatedTime: 28,
      category: "Crafts",
      weight: "9.7 kg",
      dimensions: "55x35x25 cm",
    },
  ];

  // Filter tasks based on search and filters
  const filteredTasks = allTasks.filter((task) => {
    const matchesSearch =
      task.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAssignTask = (task: TaskType) => {
    setSelectedTaskForAssignment(task);
    setIsAssignModalOpen(true);
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleEditTask = (taskId: string) => {
    showToast(`Edit mode for ${taskId} (demo)`);
  };

  const handleDeleteTask = (taskId: string) => {
    showToast(`${taskId} removed (demo)`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "assigned":
        return "bg-blue-100 text-blue-700";
      case "in-progress":
        return "bg-purple-100 text-purple-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-700";
      case "High":
        return "bg-amber-100 text-amber-700";
      case "Medium":
        return "bg-blue-100 text-blue-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <AppShell>
        <PageHeader
          badge="Simulation"
          title="Task Board"
          description="Filter and review simulated picks and assignments."
          actions={
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </button>
          }
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Filters and Search */}
          <Card>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search tasks, IDs, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Priority</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Task Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Tasks
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {allTasks.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {allTasks.filter((t) => t.status === "pending").length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    In Progress
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {allTasks.filter((t) => t.status === "in-progress").length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Completed
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {allTasks.filter((t) => t.status === "completed").length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Package className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Tasks Table */}
          <Card
            header={{
              title: `Tasks (${filteredTasks.length})`,
              description: "All warehouse pick orders with status and priority",
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {task.id}
                          </div>
                          <div className="text-sm text-slate-800 dark:text-slate-200 font-semibold">
                            {task.product}
                          </div>
                          <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {task.location} · SLA: {task.sla}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            task.status,
                          )}`}
                        >
                          {task.status.charAt(0).toUpperCase() +
                            task.status.slice(1).replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                            task.priority,
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-slate-100">
                        {task.assignedWorker || (
                          <span className="text-slate-500 dark:text-slate-400 font-semibold">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {task.revenue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAssignTask(task)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditTask(task.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Edit Task"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Task"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Note about SLA */}
          <div className="text-sm text-slate-800 dark:text-slate-200 text-center font-bold bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <strong className="text-blue-700 dark:text-blue-300">SLA</strong> =
            Latest time this order should leave the dock. Tasks with shorter SLA
            times are typically prioritized higher.
          </div>
        </div>

        {/* Assign Task Modal */}
        {selectedTaskForAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Task Details</h3>
              <p className="mb-4">
                {selectedTaskForAssignment.id} -{" "}
                {selectedTaskForAssignment.product}
              </p>
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedTaskForAssignment(null);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* New Task Modal */}
        {isNewTaskModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Create New Task
                </h3>
                <button
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <span className="text-2xl text-slate-500">&times;</span>
                </button>
              </div>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsNewTaskModalOpen(false);
                  showToast("Task created successfully (demo)");
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Electronics Bundle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Aisle 12B-04"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Priority
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      SLA (minutes)
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 15"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Revenue
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., $1,250"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Electronics"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsNewTaskModalOpen(false)}
                    className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AppShell>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[60] px-4 py-3 bg-slate-800 text-white text-sm font-medium rounded-lg shadow-lg animate-fade-in">
          {toastMessage}
        </div>
      )}
    </>
  );
}
