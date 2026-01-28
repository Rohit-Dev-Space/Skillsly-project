import React, { useState } from 'react';
import { Search, Check, X, ShieldAlert, Trash2, User, ExternalLink } from 'lucide-react';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 p-6 bg-black min-h-screen text-gray-100">
      
      {/* SEARCH SECTION */}
      <div className="relative max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search registered users..." 
            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 pl-10 pr-10 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* SEARCH RESULT BOX - Conditional Rendering */}
        {searchTerm.length > 0 && (
          <div className="absolute z-20 w-full mt-2 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="p-2 border-b border-gray-800 bg-gray-800/20">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold px-2">
                Results for "{searchTerm}"
              </p>
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {/* This is where you would map your filtered backend data */}
              {[1, 2, 3].map((result) => (
                <div key={result} className="flex items-center justify-between p-3 hover:bg-teal-900/10 cursor-pointer border-b border-gray-800/50 last:border-none group/item">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-teal-900/30 flex items-center justify-center text-teal-400">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover/item:text-teal-400 transition-colors">User_Result_{result}</p>
                      <p className="text-xs text-gray-500">user{result}@example.com</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-gray-600 group-hover/item:text-teal-500" />
                </div>
              ))}
            </div>

            <div className="p-2 bg-gray-800/30 text-center">
              <button className="text-xs text-teal-500 hover:underline font-medium">See all users</button>
            </div>
          </div>
        )}
      </div>

      {/* BADGE APPROVAL SECTION */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-teal-400">Badge Approvals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((u) => (
            <div key={u} className="bg-slate-800/50 p-4 rounded-xl flex justify-between items-center border border-gray-700">
              <div>
                <p className="font-medium text-white">User {u}</p>
                <p className="text-sm text-gray-400 italic">as a Python Learner</p>
                <p className="text-xs text-gray-500 mt-1">Request Date: 27/08/25</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-teal-900/50 text-teal-500 rounded-lg transition"><Check size={20}/></button>
                <button className="p-2 hover:bg-red-900/30 text-gray-500 rounded-lg transition"><X size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REPORTED USERS TABLE */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-red-400 flex items-center gap-2">
          <ShieldAlert size={20}/> Reported Users
        </h3>
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-left bg-gray-900/50">
            <thead className="bg-gray-800 text-gray-400 text-sm">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Strikes</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr className="hover:bg-gray-800/40">
                <td className="p-4 font-medium">BadActor_01</td>
                <td className="p-4 text-sm">
                  <span className="text-red-400 bg-red-950 px-2 py-1 rounded">Sexual Harassment</span>
                </td>
                <td className="p-4">3</td>
                <td className="p-4 flex gap-3">
                  <button className="text-yellow-500 hover:underline text-sm">Block</button>
                  <button className="text-red-500 hover:underline text-sm flex items-center gap-1">
                    <Trash2 size={14}/> Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminUsers;