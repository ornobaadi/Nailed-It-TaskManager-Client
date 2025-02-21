import { useState, useRef, useEffect, useContext } from 'react';
import { Plus, LogOut, ChevronDown, Settings, User, Bell } from 'lucide-react';
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
            <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-base-300">
                <Link to="/" className='flex justify-center items-center gap-4'>
                    <img className='w-10' src="/Nailed It.png" alt="Logo" />
                    <h1 className="text-2xl font-bold">Nailed It</h1>
                </Link>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    {user && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn btn-success w-full md:w-auto"
                        >
                            <Plus size={18} className="mr-1" />
                            Add New Task
                        </button>
                    )}

                    {/* Modern Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        {user ? (
                            <>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-base-200/50 hover:bg-base-300 transition-all duration-300 backdrop-blur-sm border border-base-300"
                                >
                                    <div className="relative">
                                        {user?.photoURL ? (
                                            <div className="w-9 h-9 rounded-lg overflow-hidden border-2 border-primary/30 shadow-md shadow-primary/20">
                                                <img
                                                    src={user.photoURL}
                                                    alt={user?.displayName || "User"}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                                                <span className="text-white font-medium">
                                                    {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-base-100"></span>
                                    </div>
                                    <span className="hidden md:block text-sm font-medium max-w-[100px] truncate">
                                        {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0]}
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-3 w-80 origin-top-right transition-all duration-300 scale-100 opacity-100 z-50">
                                        <div className="overflow-hidden rounded-2xl shadow-xl bg-base-100 border border-base-300">
                                            {/* User Profile Header */}
                                            <div className="relative pt-14 pb-6 px-6">
                                                <div className="absolute inset-0 h-24 bg-gradient-to-r from-primary/80 to-secondary/80"></div>

                                                {/* Avatar */}
                                                <div className="relative flex justify-center">
                                                    {user?.photoURL ? (
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden border-4 border-base-100 shadow-lg">
                                                            <img
                                                                src={user.photoURL}
                                                                alt={user?.displayName || "User"}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white border-4 border-base-100 shadow-lg">
                                                            {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* User Info */}
                                                <div className="mt-3 text-center">
                                                    <h3 className="text-lg font-bold">{user?.displayName || "User"}</h3>
                                                    <p className="text-xs opacity-70">{user?.email}</p>
                                                </div>
                                            </div>

                                            {/* Logout Button */}
                                            <div className="p-2 border-t border-base-300">
                                                <button
                                                    onClick={logOut}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-error/10 text-error transition-colors"
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
                                className="btn border-purple-600 btn-outline hover:bg-purple-600 hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md"
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