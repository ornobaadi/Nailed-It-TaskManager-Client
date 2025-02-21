import { useState, useRef, useEffect, useContext } from 'react';
import { Plus, LogOut, ChevronDown } from 'lucide-react';
import { AuthContext } from '../providers/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import AddTaskModal from '../pages/Task/Board/AddTaskModal';

const Navbar = ({ theme, onThemeChange, onAddTask }) => {
    const { user, logOut } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const navigate = useNavigate();

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

    const handleAddNewTask = (newTask) => {
        onAddTask(newTask);
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <>
            <div className="px-10 flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 shadow-sm backdrop-blur-sm border-b border-purple-100">
                <Link to="/" className="flex items-center gap-4">
                    <img className="w-10" src="/Nailed It.png" alt="Logo" />
                    <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Nailed It
                    </h1>
                </Link>

                <div className="flex items-center space-x-4">
                    {user && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300 md:w-auto px-4 py-2 flex items-center gap-2"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Add New Task</span>
                        </button>
                    )}

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        {user ? (
                            <>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 px-1 py-1 rounded-xl bg-white/70 hover:bg-white/90 transition-all duration-300 backdrop-blur-sm border border-purple-100 shadow-sm hover:shadow-md"
                                >
                                    <div className="relative">
                                        {user?.photoURL ? (
                                            <div className="w-9 h-9 rounded-lg overflow-hidden border-2 border-indigo-500/30 shadow-md shadow-indigo-500/20">
                                                <img
                                                    src={user.photoURL}
                                                    alt={user?.displayName || "User"}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                                                <span className="text-white font-medium">
                                                    {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                                    </div>
                                    <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                                        {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0]}
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-300 text-gray-500 ${profileOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-3 w-full md:w-80 origin-top-right transition-all duration-300 scale-100 opacity-100 z-50">
                                        <div className="overflow-hidden rounded-2xl shadow-xl bg-white border border-purple-100">
                                            {/* User Profile Header */}
                                            <div className="relative pt-14 pb-6 px-6">
                                                <div className="absolute inset-0 h-24 bg-gradient-to-r from-purple-500/90 to-indigo-600/90"></div>

                                                {/* Avatar */}
                                                <div className="relative flex justify-center">
                                                    {user?.photoURL ? (
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                                                            <img
                                                                src={user.photoURL}
                                                                alt={user?.displayName || "User"}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white border-4 border-white shadow-lg">
                                                            {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* User Info */}
                                                <div className="mt-3 text-center">
                                                    <h3 className="text-lg font-bold text-gray-800">{user?.displayName || "User"}</h3>
                                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                                </div>
                                            </div>

                                            {/* Logout Button */}
                                            <div className="p-2 border-t border-gray-100">
                                                <button
                                                    onClick={logOut}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                                >
                                                    <LogOut size={18} />
                                                    <span className="font-medium">Sign out</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <button
                                onClick={handleLoginRedirect}
                                className="btn bg-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 border-purple-500 text-purple-600 hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {user && (
                <AddTaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddTask={handleAddNewTask}
                />
            )}
        </>
    );
};

export default Navbar;
