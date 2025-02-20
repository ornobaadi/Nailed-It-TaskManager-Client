import { Sun, Moon } from 'lucide-react';

const Theme = ({ theme, onThemeChange }) => {
    return (
        <div className="flex justify-between items-center mb-8 px-2">
            <span className="text-sm font-medium text-green-100">Theme</span>
            <button
                onClick={onThemeChange}
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
            >
                {theme === "light" ? (
                    <Moon size={18} className="text-green-100" />
                ) : (
                    <Sun size={18} className="text-green-100" />
                )}
            </button>
        </div>
    );
};

export default Theme;