import { Link } from 'react-router-dom';
import SidebarNav from './SidebarNav';
import ProfileSection from './ProfileSection';
import Theme from './Theme';

const Sidebar = ({ user, theme, onThemeChange }) => {
    return (
        <div className="w-64 flex flex-col bg-gradient-to-b from-green-600 to-green-800 text-white shadow-lg">
            {/* Logo */}
            <div className="px-6 py-6 flex items-center">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-bold backdrop-blur-sm">
                    ●
                </div>
                <span className="font-semibold text-lg ml-3">Nailed It</span>
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
                <div className="p-4 border-t border-green-600/30">
                    <Link to='/login'>
                        <button className="btn w-full rounded-full">
                            Login
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Sidebar;