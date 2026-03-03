import axiosinstance from '../../Utilities/axiosIntance';
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import CountUp from '../../components/CountUp';
import { ArrowUp } from 'lucide-react';

const AdminDashboard = () => {

  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUser, setActiveUser] = useState(0)
  const [activeUserNumber, setActiveUserNumber] = useState(0)
  const [reportedUserNumber, setReportedUserNumber] = useState(0)
  const [PopularSkills, setPopularSkills] = useState([])
  const [registrationTrend, setRegistrationTrend] = useState([]);
  const [prevSafety, setPrevSafety] = useState(100);

  const riskRate =
    activeUserNumber > 0
      ? (reportedUserNumber / activeUserNumber) * 100
      : 0;

  const rawSafety = Math.max(0, Math.min(100, 100 - riskRate * 8));

  const safetyScore = Math.round(
    rawSafety * 0.4 + prevSafety * 0.6
  );

  useEffect(() => {
    setPrevSafety(safetyScore);
  }, [safetyScore]);

  const gaugeData = [
    { value: safetyScore },
    { value: 100 - safetyScore },
  ];

  const START_ANGLE = 200;
  const END_ANGLE = -20;
  const TOTAL_SWEEP = START_ANGLE - END_ANGLE;

  const angle =
    START_ANGLE - (safetyScore / 100) * TOTAL_SWEEP;

  const getSeverity = (score) => {
    if (score > 85) return { label: "Safe", color: "text-emerald-400" };
    if (score > 65) return { label: "Watchlist", color: "text-yellow-400" };
    if (score > 40) return { label: "At Risk", color: "text-orange-400" };
    return { label: "Critical", color: "text-rose-500" };
  };

  const severity = getSeverity(safetyScore);

  const severityHex = {
    "text-emerald-400": "#34d399",
    "text-yellow-400": "#facc15",
    "text-orange-400": "#fb923c",
    "text-rose-500": "#f43f5e",
  };

  const userData = [
    { name: 'Inactive users', value: totalUsers - activeUser },
    { name: 'Total users', value: totalUsers },
  ];

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

  const retentionRate =
    totalUsers > 0
      ? Math.round((activeUser / totalUsers) * 100)
      : 0;

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

        <div className="bg-black p-6 rounded-xl border border-gray-900 h-80 shadow-lg">
          <h4 className="font-light text-2xl text-gray-400">
            User Retention (Last 7 Days)
          </h4>

          <div className="mt-10 flex flex-col gap-6">
            <div className="flex items-end gap-4">
              <p className="text-5xl font-bold text-[#0D9488]">
                {retentionRate}%
              </p>
              <span className="text-sm text-gray-500 mb-1">
                active users
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0D9488] rounded-full transition-all duration-700"
                style={{ width: `${retentionRate}%` }}
              />
            </div>

            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {activeUser} of {totalUsers} users active this week
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
