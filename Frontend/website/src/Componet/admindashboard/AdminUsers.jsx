import React from 'react';
import { Search, Check, X, ShieldAlert, Trash2 } from 'lucide-react';

const AdminUsers = () => {
  return (
    <div className="space-y-8">
      {/* SEARCH BAR */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
        <input type="text" placeholder="Search registered users..." className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 pl-10 pr-4 focus:ring-1 focus:ring-teal-500 outline-none"/>
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
        <h3 className="text-xl font-semibold mb-4 text-red-400 flex items-center gap-2"><ShieldAlert size={20}/> Reported Users</h3>
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
               {/* BACKEND: Map reported users list here */}
              <tr className="hover:bg-gray-800/40">
                <td className="p-4 font-medium">BadActor_01</td>
                <td className="p-4 text-sm"><span className="text-red-400 bg-red-950 px-2 py-1 rounded">Sexual Harassment</span></td>
                <td className="p-4">3</td>
                <td className="p-4 flex gap-3">
                  <button className="text-yellow-500 hover:underline text-sm">Block</button>
                  <button className="text-red-500 hover:underline text-sm flex items-center gap-1"><Trash2 size={14}/> Delete</button>
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