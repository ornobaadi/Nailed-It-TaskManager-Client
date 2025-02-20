import { useState } from 'react';
import { Plus } from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import ProfileSection from './ProfileSection';
import Theme from './Theme';

const BoardHeader = ({ user, theme, onThemeChange, onAddTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddNewTask = (newTask) => {
    onAddTask(newTask);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-base-300">
        <h1 className="text-xl font-bold mb-4 md:mb-0">Task Board</h1>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <Theme theme={theme} onThemeChange={onThemeChange} />
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-success w-full md:w-auto"
          >
            <Plus size={18} className="mr-1" />
            Add New Task
          </button>
          <ProfileSection user={user} />
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