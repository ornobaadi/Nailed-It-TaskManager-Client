/* eslint-disable react/prop-types */
import { useContext, useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown, UserCircle, Settings } from 'lucide-react';
import { AuthContext } from '../../../providers/AuthProvider';

const ProfileSection = ({ user }) => {
  const { logOut } = useContext(AuthContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

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
    <div className="relative" ref={profileRef}>
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

        <ChevronDown
          size={16}
          className={`text-indigo-200 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Dropdown Menu */}
      {profileOpen && (
        <div className="absolute right-0 mt-2 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl text-white z-10 border border-white/10">
          <div className="border-t border-white/10 my-1"></div>
          <button
            onClick={logOut}
            className="btn flex items-center text-black transition-colors"
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