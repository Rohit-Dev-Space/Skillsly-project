import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, LogOut, UserCircle } from 'lucide-react';

const AdminLayout = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20}/> },
    { name: 'User Management', path: '/admin/users', icon: <Users size={20}/> },
    { name: 'Skill Categories', path: '/admin/skills', icon: <BookOpen size={20}/> },
  ];

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      {/* FIXED SIDEBAR */}
      <aside className="w-64 border-r border-gray-800 flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-10 text-white">skillSly <span className="text-xs text-teal-500">ADMIN</span></h1>
        
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-slate-800 rounded-full mb-4 border-2 border-gray-700 overflow-hidden">
             {/* BACKEND: Map admin profile image here */}
             <div className="w-full h-full flex items-center justify-center text-gray-500"><UserCircle size={60}/></div>
          </div>
          <h2 className="text-lg font-medium">Admin Name</h2>
          <button className="mt-2 px-6 py-1 bg-teal-600 rounded-full text-sm hover:bg-teal-700 transition">Profile</button>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive ? 'bg-teal-900/30 text-teal-400 border-l-4 border-teal-500' : 'text-gray-400 hover:bg-gray-900'
                }`
              }
            >
              {item.icon} {item.name}
            </NavLink>
          ))}
        </nav>

        <button className="flex items-center gap-3 p-3 text-gray-500 hover:text-red-400 mt-auto transition">
          <LogOut size={20}/> Log out
        </button>
      </aside>

      {/* SCROLLABLE CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;