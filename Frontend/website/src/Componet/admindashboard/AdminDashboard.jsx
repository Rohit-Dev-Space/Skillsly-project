import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

// DUMMY DATA
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
  { name: 'Remaining', value: TOTAL_LIMIT - REGISTERED_VALUE }, // Logic to fill the rest of the 100
];

const registrationTrend = [
  { week: 'W1', users: 5 }, { week: 'W2', users: 12 }, { week: 'W3', users: 8 }, { week: 'W4', users: 15 }, { week: 'W5', users: 10 },
];

// Gauge Calculation: (Reports / Total) * 100
const totalUsers = 20;
const reportCount = 8;
const reportRate = (reportCount / totalUsers) * 100;
// Gauge data needs two segments: the "filled" part and the "remaining" part
const gaugeData = [
  { value: reportRate },
  { value: 100 - reportRate },
];

const COLORS = ['#14b8a6', '#1f2937']; // Teal and Dark Gray
const GAUGE_COLORS = ['#f43f5e', '#1f2937']; // Rose for reports, Dark Gray for empty

const AdminDashboard = () => {
  return (
    <div className="bg-black min-h-screen p-8 text-gray-100 space-y-8">
      
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[ 
          {label: 'Total Users', val: totalUsers}, 
          {label: 'New (Weekly)', val: '10'}, 
          {label: 'Reports', val: reportCount}, 
          {label: 'Active Users', val: '95'} 
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
            <p className="text-gray-400 text-sm uppercase tracking-wider font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-2 text-teal-500">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* TOP ROW: Main Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-80 shadow-lg">
          <h4 className="mb-4 font-semibold text-gray-300">Popular Skills (Known vs. Wanted)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillData}>
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px'}} />
              <Bar dataKey="known" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="want" fill="#374151" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-80 shadow-lg">
          <h4 className="mb-4 font-semibold text-gray-300">New Registration (Last 5 Weeks)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={registrationTrend}>
              <XAxis dataKey="week" stroke="#6b7280" />
              <Tooltip contentStyle={{backgroundColor: '#111827', border: 'none', borderRadius: '8px'}} />
              <Line type="monotone" dataKey="users" stroke="#14b8a6" strokeWidth={3} dot={{fill: '#14b8a6', r: 5}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BOTTOM ROW: Pie Chart & Gauge Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PIE CHART: REGISTERED USERS */}
        {/* PIE CHART: REGISTERED USERS */}
<div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-80 shadow-lg relative">
  <h4 className="mb-2 font-semibold text-gray-300 text-center">Registration Progress</h4>
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={userData}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={0} // Set to 0 for a continuous progress bar look
        dataKey="value"
        startAngle={90}  // Starts from the top
        endAngle={-270} // Loops around full circle
      >
        {userData.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={index === 0 ? '#14b8a6' : '#1f2937'} // Teal for Registered, Dark for empty
            stroke="none" 
          />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-6">
      <span className="text-2xl font-bold text-white">{REGISTERED_VALUE}</span>
      <span className="text-[10px] text-gray-500 uppercase tracking-tighter">of {TOTAL_LIMIT} Limit</span>
  </div>
</div>

        {/* GAUGE METER: REPORT RATE */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-80 shadow-lg relative">
          <h4 className="mb-2 font-semibold text-gray-300 text-center">Report Rate Index</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={gaugeData}
                cx="50%"
                cy="80%"
                innerRadius={80}
                outerRadius={110}
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
            <p className="text-xs text-gray-500 uppercase">Issues vs Total Users</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;