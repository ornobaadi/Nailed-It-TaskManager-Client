import { Sun, Moon } from 'lucide-react';

const Theme = ({ theme, onThemeChange }) => {
  return (
    <button
      onClick={onThemeChange}
      className="p-2 rounded-full hover:bg-gray-300 transition-colors duration-200 border border-indigo-600/30"
    >
      {theme === "light" ? (
        <Moon size={18} className="text-amber-200" />
      ) : (
        <Sun size={18} className="text-amber-200" />
      )}
    </button>
  );
};

export default Theme;