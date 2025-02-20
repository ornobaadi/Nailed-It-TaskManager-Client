/* eslint-disable react/prop-types */
import { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';
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
        <div className="p-4 border-t border-green-600/30 relative" ref={profileRef}>
            <div
                className="flex items-center p-2 rounded-xl hover:bg-green-700 hover:bg-opacity-10 transition-all duration-200 cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
            >
                {user?.photoURL ? (
                    <img
                        className="w-10 h-10 rounded-full border-2 border-green-400 object-cover"
                        src={user.photoURL}
                        alt={user?.displayName || "User"}
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center">
                        <span className="text-green-900 font-bold">
                            {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}

                <div className="ml-3 flex-1 truncate">
                    <p className="text-sm font-medium truncate">
                        {user?.displayName || user?.email}
                    </p>
                    <p className="text-xs text-green-200 truncate">
                        {user?.displayName ? user?.email : "User"}
                    </p>
                </div>

                <ChevronDown
                    size={16}
                    className={`text-green-200 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {/* Dropdown Menu */}
            {profileOpen && (
                <div className="absolute bottom-20 left-4 right-4 rounded-xl shadow-lg py-2 text-gray-800 z-10">
                    <Link to="/profile" className="px-4 py-2 flex items-center">
                        <span className="text-sm">Profile</span>
                    </Link>
                    <button
                        onClick={logOut}
                        className="w-full px-4 py-2 flex items-center text-red-500"
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