/* eslint-disable react/prop-types */
import { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ChevronDown, UserCircle, Settings } from 'lucide-react';
import { AuthContext } from '../../../providers/AuthProvider';

const ProfileSection = ({ user }) => {
  const { logOut } = useContext(AuthContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4 border-t border-indigo-700/30 relative" ref={profileRef}>
      <div
        className="flex items-center p-2 rounded-xl hover:bg-indigo-700/30 transition-all duration-200 cursor-pointer backdrop-blur-sm"
        onClick={() => setProfileOpen(!profileOpen)}
      >
        {user?.photoURL ? (
          <img
            className="w-10 h-10 rounded-full border-2 border-indigo-400/50 object-cover shadow-md"
            src={user.photoURL}
            alt={user?.displayName || "User"}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center shadow-md">
            <span className="text-white font-bold">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="ml-3 flex-1 truncate">
          <p className="text-sm font-medium truncate text-white">
            {user?.displayName || user?.email}
          </p>
          <p className="text-xs text-indigo-200 truncate">
            {user?.displayName ? user?.email : "User"}
          </p>
        </div>

        <ChevronDown
          size={16}
          className={`text-indigo-200 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Dropdown Menu */}
      {profileOpen && (
        <div className="absolute bottom-20 left-4 right-4 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl py-2 text-white z-10 border border-white/10">
          <Link to="/profile" className="px-4 py-3 hover:bg-white/10 flex items-center transition-colors">
            <UserCircle size={14} className="mr-2 text-indigo-200" />
            <span className="text-sm">Profile</span>
          </Link>
          <Link to="/settings" className="px-4 py-3 hover:bg-white/10 flex items-center transition-colors">
            <Settings size={14} className="mr-2 text-indigo-200" />
            <span className="text-sm">Settings</span>
          </Link>
          <div className="border-t border-white/10 my-1"></div>
          <button
            onClick={logOut}
            className="w-full px-4 py-3 hover:bg-red-500/20 flex items-center text-red-300 transition-colors"
          >
            <LogOut size={14} className="mr-2" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;