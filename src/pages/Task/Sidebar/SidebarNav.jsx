import { Calendar } from 'lucide-react';

const SidebarNav = () => {
  return (
    <div className="flex items-center px-4 py-3 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-200 cursor-pointer backdrop-blur-sm">
      <Calendar size={18} className="text-white" />
      <span className="ml-3 font-medium">Tasks</span>
      <span className="ml-auto bg-green-500 px-2 py-0.5 rounded-full text-xs font-medium text-white">8</span>
    </div>
  );
};

export default SidebarNav;