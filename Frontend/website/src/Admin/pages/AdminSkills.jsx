import React, { useState } from 'react';

const AdminSkills = () => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* LEFT: REQUESTS */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-teal-400">User Requested Skills</h3>
        <div className="space-y-2">
          {['Next.js', 'Rust', 'Tailwind CSS'].map((skill, i) => (
            <div key={i} className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex justify-between">
              <span>{skill}</span>
              <span className="text-xs text-gray-500 italic">Requested 5 times</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: ADD FORM */}
      <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
        <h3 className="text-xl font-semibold mb-6">Add New Skill Category</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Skill Name</label>
            <input type="text" className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-teal-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Upload Icon (URL or File)</label>
            <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-teal-900/30 file:text-teal-400" />
          </div>
          <button type="submit" className="w-full py-3 bg-teal-600 rounded-lg font-bold mt-4 hover:bg-teal-700 transition">Add Category</button>
        </form>
      </div>
    </div>
  );
};

export default AdminSkills;