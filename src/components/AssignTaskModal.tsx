"use client";

import { useState } from "react";
import { X, User, Clock, MapPin, Award, CheckCircle } from "lucide-react";
import { useTask, Task, Worker } from "@/context/TaskContext";

interface AssignTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export function AssignTaskModal({
  task,
  isOpen,
  onClose,
}: AssignTaskModalProps) {
  const { assignTask, getAvailableWorkers } = useTask();
  const [selectedWorker, setSelectedWorker] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  const availableWorkers = getAvailableWorkers();

  const handleAssign = async () => {
    if (!selectedWorker) return;

    setIsAssigning(true);

    // Simulate assignment process
    await new Promise((resolve) => setTimeout(resolve, 1000));

    assignTask(task.id, selectedWorker);
    setIsAssigning(false);
    onClose();
    setSelectedWorker("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "busy":
        return "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/20";
      case "offline":
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700/50";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700/50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
      case "High":
        return "text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/20";
      case "Medium":
        return "text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20";
      default:
        return "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
    }
  };

  const getSkillMatch = (worker: Worker) => {
    const taskCategory = task.category;
    const hasMatchingSkill = worker.skills.some(
      (skill) =>
        skill.toLowerCase().includes(taskCategory.toLowerCase()) ||
        taskCategory.toLowerCase().includes(skill.toLowerCase())
    );
    return hasMatchingSkill ? "✓ Skill Match" : "General Skills";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-25"
          onClick={onClose}
        ></div>

        <div className="relative bg-card rounded-xl shadow-xl max-w-2xl w-full border border-custom">
          <div className="flex items-center justify-between p-6 border-b border-custom">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Assign Task to Worker
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Select the best available worker for this task
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Task Details */}
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-custom">
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                Task Details
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Product:
                  </span>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {task.product}
                  </p>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Priority:
                  </span>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Location:
                  </span>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {task.location}
                  </p>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Revenue:
                  </span>
                  <p className="font-medium text-emerald-600">{task.revenue}</p>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Estimated Time:
                  </span>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {task.estimatedTime} min
                  </p>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">
                    SLA:
                  </span>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {task.sla}
                  </p>
                </div>
              </div>
            </div>

            {/* Available Workers */}
            <div className="mb-6">
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Available Workers ({availableWorkers.length})
              </h4>

              {availableWorkers.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No workers are currently available</p>
                  <p className="text-sm mt-1">
                    All workers are busy with other tasks
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {availableWorkers.map((worker) => (
                    <div
                      key={worker.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedWorker === worker.id
                          ? "border-primary bg-primary-light"
                          : "border-custom hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                      onClick={() => setSelectedWorker(worker.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div>
                              <h5 className="font-medium text-slate-900 dark:text-slate-100">
                                {worker.name}
                              </h5>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {worker.email}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                worker.status
                              )}`}
                            >
                              {worker.status}
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-600 dark:text-slate-400">
                                Zone {worker.currentZone}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Award className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-600 dark:text-slate-400">
                                {worker.efficiency}% efficiency
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-600 dark:text-slate-400">
                                {worker.activeTasks.length}/3 active tasks
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-600 dark:text-slate-400">
                                {worker.tasksCompleted} completed
                              </span>
                            </div>
                          </div>

                          <div className="mt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-600 dark:text-slate-400">
                                Skills:
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  getSkillMatch(worker).includes("✓")
                                    ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                    : "bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {getSkillMatch(worker)}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {worker.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {selectedWorker === worker.id && (
                          <CheckCircle className="h-5 w-5 text-primary mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-custom rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={
                  !selectedWorker ||
                  isAssigning ||
                  availableWorkers.length === 0
                }
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isAssigning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Assigning...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Assign Task</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
