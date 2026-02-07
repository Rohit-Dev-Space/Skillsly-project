import axiosinstance from '../../Utilities/axiosIntance';
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import CountUp from '../../components/CountUp';
import { ArrowUp } from 'lucide-react';

const skillData = [
  { name: 'Python', known: 40, want: 24 },
  { name: 'React', known: 30, want: 45 },
  { name: 'Node.js', known: 20, want: 38 },
  { name: 'Java', known: 27, want: 15 },
];

const REGISTERED_VALUE = 75;
const TOTAL_LIMIT = 100;



const GAUGE_COLORS = ['#f43f5e', '#1f2937'];

const AdminDashboard = () => {

  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUser, setActiveUser] = useState(0)
  const [activeUserNumber, setActiveUserNumber] = useState(0)
  const [reportedUserNumber, setReportedUserNumber] = useState(0)
  const [PopularSkills, setPopularSkills] = useState([])
  const [registrationTrend, setRegistrationTrend] = useState([]);
  const reportCount = 8;

  const reportRate =
    totalUsers > 0 ? (reportCount / totalUsers) * 100 : 0;

  const gaugeData = [
    { value: reportRate },
    { value: 100 - reportRate },
  ];

  const userData = [
    { name: 'Inactive users', value: totalUsers - activeUser },
    { name: 'Total users', value: totalUsers },
  ];

  const getSeverity = (rate) => {
    if (rate < 5) return { label: "Low Risk", color: "text-emerald-400" };
    if (rate < 12) return { label: "Moderate", color: "text-yellow-400" };
    return { label: "Critical", color: "text-rose-500" };
  };

  const severity = getSeverity(reportRate);

  const gaugeMin = 0;
  const gaugeMax = 100;

  const angle =
    200 - (reportRate / gaugeMax) * 220;


  const handleTotalUser = async () => {
    try {
      const response = await axiosinstance.get('/Admin/total-users');
      if (response?.data !== undefined) {
        setTotalUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch total users', error);
    }
  };

  const handleActiveUser = async () => {
    try {
      const response = await axiosinstance.get('/Admin/active-users');
      if (response?.data !== undefined) {
        setActiveUser(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch total users', error);
    }
  };

  const handleActiveUserNumber = async () => {
    try {
      const response = await axiosinstance.get('/Admin/active-user-number');
      if (response?.data !== undefined) {
        setActiveUserNumber(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch total users', error);
    }
  };

  const handleGetReportedNumber = async () => {
    try {
      const response = await axiosinstance.get('/Admin/reported-user-number');
      if (response?.data !== undefined) {
        setReportedUserNumber(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch total users', error);
    }
  };

  const handlePopularSkills = async () => {
    const response = await axiosinstance.get('/Admin/popular-skills')
    if (Array.isArray(response.data)) {
      const formatted = response.data.map(item => ({
        name: item.skill,
        known: item.know,
        want: item.want
      }));
      setPopularSkills(formatted);
    }
  }

  const handleWeeklyRegistrations = async () => {
    try {
      const response = await axiosinstance.get('/Admin/weekly-registrations');

      if (Array.isArray(response.data)) {
        const reversed = [...response.data].reverse();
        setRegistrationTrend(reversed);
      }
    } catch (error) {
      console.error('Failed to fetch weekly registrations', error);
    }
  };


  useEffect(() => {
    handleTotalUser();
    handleActiveUser();
    handleActiveUserNumber();
    handleGetReportedNumber();
    handlePopularSkills();
    handleWeeklyRegistrations();
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-gray-100 space-y-8">

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', val: totalUsers },
          { label: 'New Users Registered', val: activeUserNumber },
          { label: 'Reports These Week', val: reportedUserNumber },
          { label: 'Active Users', val: activeUser }
        ].map((stat, i) => (
          <div key={i} className="bg-black border border-gray-900 p-6 rounded-xl shadow-lg">
            <p className="text-gray-500 text-sm uppercase tracking-wider font-medium">{stat.label} {stat.label === 'New Users Registered' && <span className='text-[10px] text-gray-400'>(Last Week)</span>}</p>
            <h3 className="text-3xl font-bold mt-2 text-[#0D9488]"><CountUp
              from={0}
              to={stat.val}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text" />
            </h3>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black p-6 rounded-xl border border-gray-900 h-80 shadow-lg">
          <h4 className="mb-7 font-light text-2xl text-gray-400 ">Popular Skills</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={PopularSkills}>
              <XAxis dataKey="name" stroke="#374151" fontSize={12} />
              <YAxis stroke="#374151" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#1f2937', color: '#fff' }} />
              <Bar dataKey="known" fill="#0D9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="want" fill="#1f2937" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {console.log(registrationTrend)}
        <div className="bg-black p-6 rounded-xl border border-gray-900 h-80 shadow-lg">
          <h4 className="mb-7 font-light text-2xl text-gray-400 ">User Growth Every Week</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={registrationTrend}>
              <XAxis dataKey="week" stroke="#374151" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#000', border: 'none' }} />
              <Line type="monotone" dataKey="users" stroke="#0D9488" strokeWidth={3} dot={{ fill: '#0D9488', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        <div className="bg-black p-6 rounded-xl border border-gray-900 h-80 shadow-lg relative">
          <h4 className="font-light text-2xl text-gray-400 ">Inactive Users portion</h4>
          <div className='flex justify-between h-full'>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userData}
                  cx="52%" cy="50%"
                  innerRadius={80} outerRadius={100}
                  dataKey="value"
                  startAngle={90} endAngle={-270}
                >
                  {userData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#111827' : '#0D9488'} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className='flex flex-col gap-10 w-40 mt-20'>
              <div className='flex'>
                <div className='bg-[#0D9488] w-5 h-5 rounded-sm mr-3' />
                <p>Active Users</p>
              </div>
              <div className='flex'>
                <div className='bg-[#111827] border border-white/30 w-5 h-5 rounded-sm mr-3' />
                <p>Inactive Users</p>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -left-25 flex flex-col items-center scale-80 justify-center pointer-events-none pt-6">
            <span className="text-2xl font-bold text-white flex flex-col justify-center items-center">{activeUser} <span> Active Users</span></span>
            <span className="text-[12px] text-gray-400 uppercase">of {totalUsers} Total Users</span>
          </div>
        </div>

        <div className="bg-black p-6 rounded-xl border border-gray-900 h-80 shadow-lg relative">
          <h4 className="font-light text-2xl text-gray-400 ">Inactive Users portion</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                dataKey="value"
                startAngle={200}
                endAngle={-20}
                cx="50%"
                cy="60%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={2}
              >
                <Cell fill="#f43f5e" />   {/* Reported */}
                <Cell fill="#1f2937" />   {/* Remaining */}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={`absolute flex flex-col items-center justify-center bottom-5 left-0 right-0 text-center`}>
            <svg
              viewBox="0 0 200 120"
              className="absolute bottom-12 left-1/2 -translate-x-1/2 w-52 h-26 mb-3"
            >
              <g transform={`rotate(${angle}, 100, 100)`}>
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="20"
                  stroke="#f43f5e"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="6" fill="#f43f5e" />
              </g>
            </svg>
            <p className={`text-sm font-semibold ${severity.color}`}>
              {severity.label}
            </p>
            <p className={`text-2xl font-bold ${severity.color}`}>{reportRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-600 uppercase tracking-tighter">Issues vs Total Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
