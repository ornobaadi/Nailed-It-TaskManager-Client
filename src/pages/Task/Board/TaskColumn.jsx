import { useState } from 'react';
import { Plus, Calendar, Check } from 'lucide-react';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const TaskColumn = ({ title, color, titleColor = "", tasks = [], containerId, onAddTask, onEditTask, onDeleteTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: containerId,
    data: {
      container: containerId,
    },
  });

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleSaveTask = async () => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      title: newTaskTitle,
      description: '',
      category: title,
      timestamp: new Date().toISOString(),
    };

    await onAddTask(newTask);
    setIsAddingTask(false);
    setNewTaskTitle('');
  };

  return (
    <div className="flex flex-col h-full bg-base-100 rounded-xl overflow-hidden shadow-md">
      <div className="p-4 flex items-center">
        <div className={`w-3 h-3 rounded-full bg-${color} mr-2`}></div>
        <h3 className={`font-medium ${titleColor}`}>{title}</h3>
        <span className="ml-2 text-xs text-gray-500">({tasks.length})</span>
        <button
          onClick={() => setIsAddingTask(true)}
          className="ml-auto p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Plus size={18} className="text-gray-500" />
        </button>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 overflow-y-auto bg-base-200/30 transition-colors duration-200 ${isOver ? 'bg-base-200/60' : ''}`}
      >
        <SortableContext
          items={tasks?.filter(task => task?._id !== undefined).map(task => task._id.toString())}
          strategy={verticalListSortingStrategy}
        >
          {isAddingTask && (
            <div className="mb-3 p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTask();
                }}
                placeholder="Enter task title"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSaveTask}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Check size={18} className="text-green-500" />
                </button>
              </div>
            </div>
          )}

          {tasks?.length > 0 ? (
            tasks
              .filter(task => task?._id !== undefined)
              .map(task => (
                <TaskCard
                  key={task._id}
                  _id={task._id}
                  title={task.title || "Untitled Task"}
                  description={task.description || "No description"}
                  timestamp={task.timestamp || Date.now()}
                  category={task.category || "Uncategorized"}
                  containerId={containerId}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask} // Pass delete handler
                />
              ))
          ) : (
            <div className="mt-4 h-24 flex flex-col items-center justify-center text-gray-400 text-sm">
              <Calendar size={24} className="mb-2 opacity-30" />
              <span>No tasks yet</span>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default TaskColumn;