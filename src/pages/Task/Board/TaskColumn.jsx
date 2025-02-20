import { Plus, Calendar } from 'lucide-react';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const TaskColumn = ({ title, color, titleColor = "", tasks = [], containerId }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: containerId,
    data: {
      container: containerId
    }
  });

  return (
    <div className="flex flex-col h-full bg-base-100 rounded-xl overflow-hidden shadow-md">
      <div className="p-4 flex items-center">
        <div className={`w-3 h-3 rounded-full bg-${color} mr-2`}></div>
        <h3 className={`font-medium ${titleColor}`}>{title}</h3>
        <span className="ml-2 text-xs text-gray-500">({tasks.length})</span>
        <button className="ml-auto p-1 rounded-full hover:bg-gray-100 transition-colors">
          <Plus size={18} className="text-gray-500" />
        </button>
      </div>
      <div 
        ref={setNodeRef}
        className={`flex-1 p-3 overflow-y-auto bg-base-200/30 transition-colors duration-200 ${
          isOver ? 'bg-base-200/60' : ''
        }`}
      >
        <SortableContext 
          items={tasks.map(task => task.id.toString())} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TaskCard 
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                timestamp={task.timestamp}
                category={task.category}
                containerId={containerId}
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