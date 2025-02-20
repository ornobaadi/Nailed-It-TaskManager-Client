import { Link } from 'react-router-dom';
import SidebarNav from './SidebarNav';
import ProfileSection from './ProfileSection';
import Theme from './Theme';

const Sidebar = ({ user, theme, onThemeChange }) => {
  return (
    <div className="w-64 flex flex-col bg-green-900 text-white shadow-lg">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500"></div>
        </div>
        <span className="font-semibold text-lg ml-3 tracking-wide">Nailed It</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <div className="mb-6">
          {/* Theme Toggle */}
          <Theme theme={theme} onThemeChange={onThemeChange} />

          {/* Navigation Items */}
          <SidebarNav />
        </div>
      </div>

      {/* Profile Section */}
      {user ? (
        <ProfileSection user={user} />
      ) : (
        <div className="p-4 border-t border-gray-400">
          <Link to='/login'>
            <button className="w-full py-2.5 bg-white/10 hover:bg-white/15 rounded-xl transition-all duration-200 text-white font-medium backdrop-blur-sm border border-white/5 shadow-sm hover:shadow-md">
              Login
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;