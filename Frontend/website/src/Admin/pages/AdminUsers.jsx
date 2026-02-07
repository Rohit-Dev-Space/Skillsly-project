import React, { useEffect, useState } from 'react';
import {
  Search, Check, X, ShieldAlert,
  Trash2, User, UserRoundX,
  TriangleAlert,
  BanIcon
} from 'lucide-react';
import axiosinstance from '../../Utilities/axiosIntance';
import Modal from '../../Utilities/Modal';
import Profile from '../../Componet/DashboardPg/Profile';
import { toast, Toaster } from 'sonner';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUser, setSearchedUser] = useState([]);
  const [showAllResults, setShowAllResults] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [reportedUsers, setReportedUsers] = useState([]);

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

  const handleSendWarning = async (reportId, userId) => {
    const response = await axiosinstance.post("/Admin/warning-message", {
      reportId,
      userId
    });
    if (response.data) {
      setTimeout(() => {
        toast.success("Warning message Sent Successfully");
      }, 5000);
    }
  };

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
    <div className="space-y-8 p-4 bg-black min-h-screen text-gray-100">
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
                        <User size={16} />
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

      {/* BADGE APPROVAL SECTION */}
      <section className='flex justify-between gap-10'>
        <div className='flex flex-col w-1/2 h-screen'>
          <h3 className="text-xl font-semibold mb-4 text-teal-400">Badge Approvals</h3>
          <div className="flex flex-col gap-4 bg-gray-500/20 rounded-xl overflow-y-scroll">
            {[1, 2].map((u) => (
              <div key={u} className="bg-slate-800/80 p-6 m-3 rounded-xl flex justify-between items-center border border-gray-900">
                <div>
                  <p className="font-medium text-white">User {u}</p>
                  <p className="text-sm text-gray-400 italic">as a Python Learner</p>
                  <p className="text-xs text-gray-500 mt-1">Request Date: 27/08/25</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-teal-900/50 text-teal-500 rounded-lg transition"><Check size={20} /></button>
                  <button className="p-2 hover:bg-red-900/30 text-gray-500 rounded-lg transition"><X size={20} /></button>
                </div>
              </div>
            ))}
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
              {console.log(reportedUsers)}
              {reportedUsers.length > 0 ?
                reportedUsers.map((info, index) => {

                  const reportedCount = getReportedReasonCount(
                    info.reportedId._id,
                    info.reports
                  );

                  return (
                    <tbody key={index} className="divide-y divide-gray-800">
                      <tr className="hover:bg-gray-800/40">

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
                          <button onClick={() => handleSendWarning(info._id, info.reportedId._id)} className="bg-yellow-300 text-black p-2 rounded-lg cursor-pointer">
                            <TriangleAlert size={15} />
                          </button>
                          <button className="bg-yellow-500 text-black p-2 rounded-lg cursor-pointer">
                            <BanIcon size={15} />
                          </button>
                          <button className="bg-red-500 text-white p-2 rounded-lg cursor-pointer">
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
          <Profile userData={userData} />
        </Modal>
      }
    </div>
  );
};

export default AdminUsers;
