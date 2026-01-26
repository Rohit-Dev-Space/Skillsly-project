import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// DUMMY DATA - BACKEND: Your friend should replace these with API call data
const skillData = [
  { name: 'Python', known: 40, want: 24 },
  { name: 'React', known: 30, want: 45 },
  { name: 'Node.js', known: 20, want: 38 },
  { name: 'Java', known: 27, want: 15 },
];

const userData = [
  { name: 'Active', value: 20 },
  { name: 'Inactive', value: 20 },
];

const registrationTrend = [
  { week: 'W1', users: 5 }, { week: 'W2', users: 12 }, { week: 'W3', users: 8 }, { week: 'W4', users: 15 }, { week: 'W5', users: 10 },
];

const COLORS = ['#14b8a6', '#1f2937'];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6">
        {[ {label: 'Total Users', val: '40'}, {label: 'New (Weekly)', val: '10'}, {label: 'Reports', val: '1'}, {label: 'Active Users', val: '20'} ].map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <p className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-2 text-teal-500">{stat.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* BAR CHART: SKILLS */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-80">
          <h4 className="mb-4 font-semibold text-gray-300">Popular Skills (Known vs. Wanted)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillData}>
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{backgroundColor: '#111827', borderColor: '#374151'}} />
              <Bar dataKey="known" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="want" fill="#374151" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART: REGISTRATIONS */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-80">
          <h4 className="mb-4 font-semibold text-gray-300">New Registration (Last 5 Weeks)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={registrationTrend}>
              <XAxis dataKey="week" stroke="#6b7280" />
              <Tooltip contentStyle={{backgroundColor: '#111827', border: 'none'}} />
              <Line type="monotone" dataKey="users" stroke="#14b8a6" strokeWidth={3} dot={{fill: '#14b8a6'}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;