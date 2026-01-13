import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Search, Notebook, MessageSquare, LogOut, Users } from 'lucide-react';
import { useContext } from 'react';
import { UserContext } from '../Context/UserContext'

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const { user, clearUser } = useContext(UserContext)

  const NavItem = ({ icon: Icon, text, path }) => (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center w-full px-8 py-3 text-sm font-medium transition-colors text-left
        ${isActive(path)
          ? 'bg-[#1a1a1a] text-white border-l-4 border-teal-400'
          : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
        }`}
    >
      {Icon && <Icon className="w-5 h-5 mr-3" />}
      {text}
    </button>
  );

  const clearedUser = () => {
    clearUser()
    navigate('/')
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#0d0d0d] text-white">
      <div className="flex items-center space-x-2 p-4 text-xl font-bold text-white">
        <span>skillSly</span>
      </div>

      <div className="flex flex-col items-center py-8 border-b border-gray-800">
        <div className="relative w-24 h-24 rounded-full border-2 border-gray-700 overflow-hidden bg-gray-700 mb-3">
          <button onClick={() => navigate('/dashboard')} className="w-full h-full flex items-center justify-center">
            {/* <User className="w-16 h-16 text-gray-300 opacity-70" /> */}
            <img src={user?.profileImageUrl} alt="" className='w-full h-full object-cover' />
          </button>
        </div>
        <p className="text-lg font-semibold mb-3">User Name</p>
        <button
          onClick={() => navigate('/dashboard')}
          className={`text-sm rounded-full px-4 py-1 transition-colors cursor-pointer
            ${isActive('/dashboard') ? 'bg-teal-600 text-white' : 'border border-gray-600 text-gray-300'}`}
        >
          Profile
        </button>
      </div>

      <nav className="flex-grow mt-6 space-y-1">
        <NavItem text="Search skills" icon={Search} path="/dashboard/search" />
        <NavItem text="Groups" icon={Users} path="/dashboard/groups" />
        <NavItem text="Saved Notes" icon={Notebook} path="/dashboard/notes" />
        <NavItem text="Messages" icon={MessageSquare} path="/dashboard/messages" />
      </nav>

      <div className="p-8">
        <button onClick={clearedUser} className="flex items-center cursor-pointer text-gray-400 hover:text-red-400">
          <LogOut className="w-5 h-5 mr-3" /> Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;