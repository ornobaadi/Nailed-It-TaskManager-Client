import { useState } from 'react';
import { Plus, Calendar, Check, X } from 'lucide-react';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const TaskColumn = ({
  title,
  color = "gray-400",
  titleColor = "",
  tasks = [],
  containerId,
  onAddTask,
  onEditTask,
  onDeleteTask
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: containerId,
    data: {
      container: containerId,
    },
  });

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!newTaskData.title.trim()) newErrors.title = "Title is required";
    if (newTaskData.title.length > 50) newErrors.title = "Title must be under 50 characters";
    if (newTaskData.description.length > 200) newErrors.description = "Description must be under 200 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveTask = async () => {
    if (!validateForm()) return;

    const newTask = {
      title: newTaskData.title.trim(),
      description: newTaskData.description.trim(),
      category: title,
      timestamp: new Date().toISOString(),
    };

    await onAddTask(newTask);
    handleCancelTask();
  };

  const handleCancelTask = () => {
    setIsAddingTask(false);
    setNewTaskData({ title: '', description: '' });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTaskData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  return (
    <div className="flex flex-col w-full lg:w-1/3 bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Completely non-sticky header */}
      <div className="p-4 flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl border-b border-gray-100">
        <div className={`w-3 h-3 rounded-full bg-${color} mr-2`}></div>
        <h3 className={`font-semibold ${titleColor} text-sm sm:text-base`}>{title}</h3>
        <span className="ml-2 text-xs text-gray-500">({tasks.length})</span>
        <button
          onClick={() => setIsAddingTask(true)}
          className="ml-auto p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Plus size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Simple content container with no special positioning */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 overflow-y-auto max-h-[70vh] lg:max-h-[calc(100vh-200px)]
          ${isOver ? 'bg-gray-50/80' : 'bg-gray-50/30'}
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
          hover:scrollbar-thumb-gray-400`}
      >
        <SortableContext
          items={tasks?.filter(task => task?._id !== undefined).map(task => task._id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 min-h-full">
            {isAddingTask && (
              <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="mb-3">
                  <input
                    type="text"
                    name="title"
                    value={newTaskData.title}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTask();
                      if (e.key === 'Escape') handleCancelTask();
                    }}
                    placeholder="Enter task title"
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base
                      ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                    autoFocus
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                  )}
                </div>

                <div className="mb-3">
                  <textarea
                    name="description"
                    value={newTaskData.description}
                    onChange={handleChange}
                    placeholder="Enter task description (optional)"
                    rows="3"
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base resize-none
                      ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCancelTask}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                  <button
                    onClick={handleSaveTask}
                    className="p-1.5 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <Check size={18} className="text-green-500" />
                  </button>
                </div>
              </div>
            )}

            {tasks?.length > 0 ? (
              <div className="space-y-3">
                {tasks
                  .filter(task => task?._id !== undefined)
                  .map(task => (
                    <TaskCard
                      key={task._id}
                      _id={task._id}
                      title={task.title || "Untitled Task"}
                      description={task.description || ""}
                      timestamp={task.timestamp || Date.now()}
                      category={task.category || "Uncategorized"}
                      containerId={containerId}
                      onEditTask={onEditTask}
                      onDeleteTask={onDeleteTask}
                    />
                  ))}
              </div>
            ) : (
              <div className="mt-4 h-24 flex flex-col items-center justify-center text-gray-400 text-sm">
                <span>No tasks yet</span>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default TaskColumn;