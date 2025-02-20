import { Sun, Moon } from 'lucide-react';

const Theme = ({ theme, onThemeChange }) => {
  return (
    <div className="flex justify-between items-center mb-8 px-2">
      <span className="text-sm font-medium text-indigo-100">Theme</span>
      <button
        onClick={onThemeChange}
        className="p-2 rounded-full  hover:bg-gray-300 transition-colors duration-200 border border-indigo-600/30"
      >
        {theme === "light" ? (
          <Moon size={16} className="text-amber-200" />
        ) : (
          <Sun size={16} className="text-amber-200" />
        )}
      </button>
    </div>
  );
};

export default Theme;