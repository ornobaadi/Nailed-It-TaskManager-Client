import { Calendar, List, Star, Clock, Settings } from 'lucide-react';

const SidebarNav = () => {
  const navItems = [
    { icon: <Calendar size={16} />, label: "Tasks", count: 8, active: true },
    { icon: <Star size={16} />, label: "Important", count: 3 },
    { icon: <Clock size={16} />, label: "Upcoming", count: 5 },
    { icon: <List size={16} />, label: "All Tasks", count: 16 },
    { icon: <Settings size={16} />, label: "Settings" },
  ];

  return (
    <nav className="space-y-2">
      {navItems.map((item, index) => (
        <div 
          key={index} 
          className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer
            ${item.active 
              ? 'bg-white/15 shadow-md' 
              : 'hover:bg-white/10'
            } backdrop-blur-sm`}
        >
          <span className={`${item.active ? 'text-amber-200' : 'text-white'}`}>
            {item.icon}
          </span>
          <span className={`ml-3 font-medium ${item.active ? 'text-white' : 'text-indigo-100'}`}>
            {item.label}
          </span>
          {item.count && (
            <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium
              ${item.active 
                ? 'bg-amber-400/20 text-amber-200' 
                : 'bg-white text-black'}`}>
              {item.count}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default SidebarNav;