import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, LogOut, UserCircle } from 'lucide-react';

const AdmindashboardPages = () => {
  const navigate = useNavigate();

   
  // Clicking 'main' will take you to /AdmindashboardPages/main
  const navItems = [
    { name: 'Dashboard', path: 'main', icon: <LayoutDashboard size={18}/> },
    { name: 'User Info', path: 'users', icon: <Users size={18}/> },
    { name: 'Skills', path: 'skills', icon: <BookOpen size={18}/> },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <aside className="w-64 border-r border-gray-900 flex flex-col p-6 bg-black">
        <div className="mb-10 text-xl font-bold tracking-tighter">
          skillSly <span className="text-[10px] text-[#0D9488] border border-[#0D9488] px-1 rounded ml-1">ADMIN</span>
        </div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-gray-900 rounded-full mb-3 flex items-center justify-center border border-gray-800">
             <UserCircle size={45} className="text-gray-600"/>
          </div>
          <h2 className="text-sm font-medium">Admin Panel</h2>
          <button className="mt-2 px-4 py-1 bg-[#0D9488] rounded-full text-[11px] hover:bg-teal-700 font-bold transition uppercase">
            Profile
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isActive 
                  ? 'bg-gray-900 text-[#0D9488] border-l-2 border-[#0D9488]' 
                  : 'text-gray-500 hover:text-gray-300'
                }`
              }
            >
              {item.icon} <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 p-3 text-gray-600 hover:text-red-500 transition-colors mt-auto border-t border-gray-900 pt-4"
        >
          <LogOut size={18}/> <span className="text-sm">Log out</span>
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#050505] p-8">
        {/* IMPORTANT: This is where AdminDashboard.jsx will render */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdmindashboardPages;