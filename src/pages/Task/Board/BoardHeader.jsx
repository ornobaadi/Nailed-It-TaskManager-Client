import { useState } from 'react';
import { Plus, Filter, SortDesc, Trash2 } from 'lucide-react';
import AddTaskModal from './AddTaskModal';

const BoardHeader = ({ onAddTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleAddNewTask = (newTask) => {
    onAddTask(newTask);
  };
  
  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        <h1 className="text-xl font-bold">Task Board</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-3 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} className="mr-1" />
            Add New Task
          </button>
          <div className="flex items-center space-x-1">
            <button className="p-2 rounded-lg hover:bg-base-200 transition-colors" title="Filter Tasks">
              <Filter size={18} className="text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-base-200 transition-colors" title="Sort Tasks">
              <SortDesc size={18} className="text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-base-200 transition-colors" title="Clear Completed">
              <Trash2 size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      <AddTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} 
        onAddTask={handleAddNewTask}
      />
    </>
  );
};

export default BoardHeader;