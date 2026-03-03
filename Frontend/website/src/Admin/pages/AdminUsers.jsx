import React, { useContext, useEffect, useState } from 'react';
import {
  Search, Check, X, ShieldAlert,
  Trash2, User, UserRoundX,
  TriangleAlert,
  BanIcon,
  History
} from 'lucide-react';
import axiosinstance from '../../Utilities/axiosIntance';
import Modal from '../../Utilities/Modal';
import Profile from '../../Componet/DashboardPg/Profile';
import { toast, Toaster } from 'sonner';
import ReportProfile from '../../Utilities/ReportProfile';
import { UserContext } from '../../Componet/Context/UserContext';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUser, setSearchedUser] = useState([]);
  const [showAllResults, setShowAllResults] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [reportedUsers, setReportedUsers] = useState([]);
  const [adminActions, setAdminActions] = useState([]);
  const { user } = useContext(UserContext);

  const handleViewProfile = async (info) => {
    setIsOpen(true);
    setUserData(info);
  }

  const handleSetClose = () => {
    setIsOpen(false);
    setUserData(null);
  }

  const handleGetReportedUsers = async () => {
    const response = await axiosinstance.get('/Admin/reported-user');
    if (Array.isArray(response.data)) {
      setReportedUsers(response.data)
    }
  }

  const handleRegisterAction = async (reportId, action, reportedReason) => {
    const response = await axiosinstance.post("/Admin/create-action", { reportedUser: reportId, action: action, reportedReason: reportedReason });
    if (response) {
      handleGetAdminActions();
    }
  }

  const handleSendWarning = async (reportId, userId, reportedReason) => {
    const response = await axiosinstance.post("/Admin/warning-message", {
      reportId,
      userId
    });
    if (response.data) {
      handleRegisterAction(userId, 'Warned User', reportedReason);
      setReportedUsers(prev => prev.filter(report => report._id !== reportId))
      toast.success("Warning message Sent Successfully");
    }
  };

  const handleBlockUser = async (reportId, id, reportedReason) => {
    const response = await axiosinstance.post('/Admin/block-user', { reportId: reportId, userId: id });
    if (response.data.blockedUntil) {
      handleRegisterAction(id, 'Blocked User', reportedReason);
      setReportedUsers(prev => prev.filter(report => report._id !== reportId))
      toast.info(`User Blocked Until ${response.data.blockedUntil}`);
    }
  }

  const handleTerminateUser = async (reportId, id, reportedReason) => {
    const response = await axiosinstance.post('/Admin/terminate-user', { userId: id })
    if (response) {
      handleRegisterAction(id, 'Terminated User', reportedReason);
      setReportedUsers(prev => prev.filter(report => report._id !== reportId))
      toast.info('User terminated succesFully')
    }
  }

  const handleGetAdminActions = async () => {
    const response = await axiosinstance.get('/Admin/get-action');
    if (response.data) {
      setAdminActions(response.data)
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm.trim()) {
        setSearchedUser([]);
        setShowAllResults(false);
        return;
      }

      try {
        const response = await axiosinstance.get(
          `/Admin/user-search?q=${searchTerm}`
        );

        if (Array.isArray(response.data)) {
          setSearchedUser(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  useEffect(() => {
    handleGetReportedUsers();
    handleGetAdminActions();
  }, [])

  const visibleUsers = showAllResults
    ? searchedUser
    : searchedUser.slice(0, 3);

  const getReportedReasonCount = (userId, reason) => {
    return reportedUsers.filter(
      (r) =>
        r.reportedId._id === userId &&
        r.reports === reason
    ).length;
  };

  return (
    <div className="space-y-4 p-2 min-h-screen text-gray-100 flex flex-col">
      <Toaster position='top-center' />
      {/* SEARCH SECTION */}
      <div className="relative max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Platform users..."
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

        {/* SEARCH RESULT BOX */}
        {searchTerm.trim().length > 0 && (
          <div className="absolute z-20 w-full mt-2 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">

            <div className="p-2 border-b border-gray-800 bg-gray-800/20">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold px-2">
                Results for "{searchTerm}"
              </p>
            </div>

            {/* RESULTS */}
            <div className="max-h-60 overflow-y-auto">
              {searchedUser.length === 0 ? (
                <p className="flex gap-2 text-gray-600 items-center justify-center p-4">
                  <UserRoundX size={17} /> No Such User Found
                </p>
              ) : (
                visibleUsers.map((result) => (
                  <div
                    key={result._id}
                    onClick={() => { handleViewProfile(result) }}
                    className="flex items-center justify-between p-3 hover:bg-teal-900/10 cursor-pointer border-b border-gray-800/50 last:border-none group/item"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-teal-900/30 flex items-center justify-center text-teal-400">
                        <img src={result.profileImageUrl} alt="" className='w-8 h-8 rounded-full object-cover' />
                      </div>
                      <div>
                        <p className="text-sm font-medium group-hover/item:text-teal-400 transition-colors">
                          {result.userName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {result.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {result.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* SEE ALL / LESS */}
            {searchedUser.length > 3 && (
              <div className="p-2 bg-gray-800/30 text-center">
                <button
                  onClick={() => setShowAllResults(!showAllResults)}
                  className="text-xs text-teal-500 hover:underline font-medium"
                >
                  {showAllResults ? 'See Less' : 'See all users'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <section className='flex flex-col h-screen space-y-10'>
        <div className='flex flex-col w-full h-fit'>
          <h3 className="text-xl font-semibold mb-4 text-red-400 flex gap-2 items-center"><History /> Recent Activity</h3>
          <div className="flex flex-col border border-white/30 min-h-40 gap-4 bg-gray-500/20 rounded-xl overflow-y-scroll">
            {adminActions.length > 0 ? (
              adminActions.map((item) => (
                <div
                  key={item._id}
                  className="flex items-start gap-4 p-3 rounded-lg  m-5 bg-gray-800/40 hover:bg-gray-800/60 transition"
                >
                  <img
                    src={item.reportedUser?.profileImageUrl || '/avatar.png'}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover border border-gray-700"
                  />

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-teal-400">
                        {item.reportedUser?.userName}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300">
                      {item.reportedUser?.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {item.reportedUser?.email}
                    </p>

                    <div className="flex gap-2 mt-2 text-xs">
                      <span className="px-2 py-1 rounded bg-red-950 text-red-400">
                        {item.action}
                      </span>
                      <span className="px-2 py-1 rounded bg-gray-700 text-gray-300">
                        {item.reportedReason}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm">
                No recent admin activity
              </p>
            )}
          </div>
        </div>
        {/* REPORTED USERS TABLE */}

        <div className='flex flex-col w-full'>
          <h3 className="text-xl font-semibold mb-4 text-red-400 flex items-center gap-2">
            <ShieldAlert size={20} /> Reported Users
          </h3>
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-left bg-gray-900/50">
              <thead className="bg-gray-800 text-gray-400 text-sm">
                <tr>
                  <th className="p-2 text-center">User</th>
                  <th className="p-2 text-center">Reason</th>
                  <th className="p-2 text-center">Times Reported</th>
                  <th className="p-2 text-center">Blocked count</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              {reportedUsers.length > 0 ?
                reportedUsers.map((info, index) => {

                  const reportedCount = getReportedReasonCount(
                    info.reportedId._id,
                    info.reports
                  );

                  return (
                    <tbody key={index} className="divide-y divide-gray-800">
                      <tr className="hover:bg-gray-800/40">
                        {console.log(info)}
                        <td className="p-4 font-medium">
                          {info.reportedId.userName}
                        </td>

                        <td className="p-4 text-center text-sm">
                          <span className="text-red-400 bg-red-950 px-2 py-1 rounded">
                            {info.reports}
                          </span>
                        </td>

                        <td className="p-4 text-center font-semibold">
                          {reportedCount}
                        </td>

                        <td className="p-4 text-center">
                          {info.reportedId.BlockCount}
                        </td>

                        <td className="p-4 flex gap-3 items-center justify-center">
                          <button onClick={() => handleSendWarning(info._id, info.reportedId._id, info.reports)} className="bg-yellow-300 text-black p-2 rounded-lg cursor-pointer">
                            <TriangleAlert size={15} />
                          </button>
                          <button onClick={() => handleBlockUser(info._id, info.reportedId._id, info.reports)} className="bg-yellow-500 text-black p-2 rounded-lg cursor-pointer">
                            <BanIcon size={15} />
                          </button>
                          <button onClick={() => handleTerminateUser(info._id, info.reportedId._id, info.reports)} className="bg-red-500 text-white p-2 rounded-lg cursor-pointer">
                            <Trash2 size={15} />
                          </button>
                        </td>

                      </tr>
                    </tbody>
                  );
                }) : (
                  <tbody>
                    <tr>
                      <td
                        colSpan={5}
                        className="p-4 text-center bg-black-800 font-semibold"
                      >
                        No Reported User 🥳
                      </td>
                    </tr>
                  </tbody>)}
            </table>
          </div>
        </div>
      </section>
      {
        isOpen && userData &&
        <Modal
          title={`${userData.userName}'s Profile`}
          isClose={handleSetClose}
          className={'absolute w-full h-full'}
          type='profile'
        >
          {/* <Profile userData={userData} /> */}
          <div className='m-10 px-20 w-full'>
            <ReportProfile user={userData} />
          </div>
        </Modal>
      }
    </div>
  );
};

export default AdminUsers;
