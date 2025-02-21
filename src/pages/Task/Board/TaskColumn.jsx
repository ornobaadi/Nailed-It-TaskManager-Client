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
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleSaveTask = async () => {
    if (!newTaskTitle.trim()) return;
  
    const newTask = {
      title: newTaskTitle,
      description: '',
      category: title,
      timestamp: new Date().toISOString(),
    };
  
    console.log("Adding Task:", newTask);
    await onAddTask(newTask);
    setIsAddingTask(false);
    setNewTaskTitle('');
  };
  

  const handleCancelTask = () => {
    setIsAddingTask(false);
    setNewTaskTitle('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
      <div className="p-4 flex items-center bg-gradient-to-r from-indigo-50 to-purple-50">
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
      
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 overflow-y-auto transition-colors duration-200 
          ${isOver ? 'bg-gray-50/80' : 'bg-gray-50/30'}`}
      >
        <SortableContext
          items={tasks?.filter(task => task?._id !== undefined).map(task => task._id.toString())}
          strategy={verticalListSortingStrategy}
        >
          {isAddingTask && (
            <div className="mb-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTask();
                  if (e.key === 'Escape') handleCancelTask();
                }}
                placeholder="Enter task title"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                autoFocus
              />
              <div className="flex justify-end mt-2 gap-2">
                <button
                  onClick={handleCancelTask}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
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
                  description={task.description || ""}
                  timestamp={task.timestamp || Date.now()}
                  category={task.category || "Uncategorized"}
                  containerId={containerId}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                />
              ))
          ) : (
            <div className="mt-4 h-24 flex flex-col items-center justify-center text-gray-400 text-sm">
              <span>No tasks yet</span>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default TaskColumn;