import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

const skillData = [
  { name: 'Python', known: 40, want: 24 },
  { name: 'React', known: 30, want: 45 },
  { name: 'Node.js', known: 20, want: 38 },
  { name: 'Java', known: 27, want: 15 },
];

const REGISTERED_VALUE = 75; 
const TOTAL_LIMIT = 100;
const userData = [
  { name: 'Registered', value: REGISTERED_VALUE },
  { name: 'Remaining', value: TOTAL_LIMIT - REGISTERED_VALUE },
];

const registrationTrend = [
  { week: 'W1', users: 5 }, { week: 'W2', users: 12 }, 
  { week: 'W3', users: 8 }, { week: 'W4', users: 15 }, { week: 'W5', users: 10 },
];

const totalUsers = 20;
const reportCount = 8;
const reportRate = (reportCount / totalUsers) * 100;

const gaugeData = [
  { value: reportRate },
  { value: 100 - reportRate },
];

const GAUGE_COLORS = ['#f43f5e', '#1f2937'];

const AdminDashboard = () => {
  return (
    <div className="bg-[#050505] min-h-screen text-gray-100 space-y-8">
      
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[ 
          {label: 'Total Users', val: totalUsers}, 
          {label: 'New (Weekly)', val: '10'}, 
          {label: 'Reports', val: reportCount}, 
          {label: 'Active Users', val: '95'} 
        ].map((stat, i) => (
          <div key={i} className="bg-black border border-gray-900 p-6 rounded-xl shadow-lg">
            <p className="text-gray-500 text-sm uppercase tracking-wider font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-2 text-[#0D9488]">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black p-6 rounded-xl border border-gray-900 h-80 shadow-lg">
          <h4 className="mb-4 font-semibold text-gray-400">Popular Skills</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={skillData}>
              <XAxis dataKey="name" stroke="#374151" fontSize={12} />
              <YAxis stroke="#374151" fontSize={12} />
              <Tooltip contentStyle={{backgroundColor: '#000', borderColor: '#1f2937', color: '#fff'}} />
              <Bar dataKey="known" fill="#0D9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="want" fill="#1f2937" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-black p-6 rounded-xl border border-gray-900 h-80 shadow-lg">
          <h4 className="mb-4 font-semibold text-gray-400">User Growth</h4>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={registrationTrend}>
              <XAxis dataKey="week" stroke="#374151" fontSize={12} />
              <Tooltip contentStyle={{backgroundColor: '#000', border: 'none'}} />
              <Line type="monotone" dataKey="users" stroke="#0D9488" strokeWidth={3} dot={{fill: '#0D9488', r: 5}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        <div className="bg-black p-6 rounded-xl border border-gray-900 h-80 shadow-lg relative">
          <h4 className="mb-2 font-semibold text-gray-400 text-center">Registration Progress</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={userData}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={80}
                dataKey="value"
                startAngle={90} endAngle={-270}
              >
                {userData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#0D9488' : '#111827'} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-6">
              <span className="text-2xl font-bold text-white">{REGISTERED_VALUE}</span>
              <span className="text-[10px] text-gray-600 uppercase">of {TOTAL_LIMIT} Limit</span>
          </div>
        </div>

        <div className="bg-black p-6 rounded-xl border border-gray-900 h-80 shadow-lg relative">
          <h4 className="mb-2 font-semibold text-gray-400 text-center">Report Rate Index</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                startAngle={180} endAngle={0}
                data={gaugeData}
                cx="50%" cy="80%"
                innerRadius={80} outerRadius={110}
                stroke="none"
              >
                {gaugeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={GAUGE_COLORS[index % GAUGE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute bottom-12 left-0 right-0 text-center">
            <p className="text-2xl font-bold text-rose-500">{reportRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-600 uppercase tracking-tighter">Issues vs Total Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;