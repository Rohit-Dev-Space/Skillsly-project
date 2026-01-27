import React, { useContext, useEffect, useState } from 'react';
import { UserPlus, MessageSquare, Trophy, UserCheck2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axiosinstance from '../../Utilities/axiosIntance';
import { UserRound } from 'lucide-react';
import Modal from '../../Utilities/Modal';
import Profile from './Profile';
import { UserContext } from '../Context/UserContext';


const Ranking = () => {
  const renderRankBadge = (rank) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400 fill-gray-400/20" />;
    if (rank === 3) return <Trophy className="w-5 h-5 text-orange-400 fill-orange-400/20" />;
    return <span className="text-gray-500 font-medium w-5 text-center">{rank}</span>;
  };

  const [rankingData, setRankingData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [profileUserName, setProfileUserName] = useState('');
  const [userData, setUserData] = useState(null);
  const [alreadyRequested, setAlreadyRequested] = useState(false)
  const [RequestedId, setRequestedId] = useState([])
  const { user } = useContext(UserContext);

  let { category } = useParams();
  category = category.replace(/[-/]/g, ' ').replace(/\b\w/g, char => char.toUpperCase())

  const handleSendNotification = async (id) => {
    const response = await axiosinstance.post('/skills/send-Notifications', { reciverId: id, title: `sent Request To Learn ${category}`, type: "Friend_Request" })
    if (response.data.isSent) {
      setAlreadyRequested(true)
    } else {
      setRequestedId(prev => [...prev, id])
    }
  }

  useEffect(() => {
    const handleGetRankings = async (e) => {
      // e.preventDefault;

      const response = await axiosinstance(`http://localhost:5000/skills/get-rankings?category=${category}`);
      if (!response) {
        console.error("Error fetching user data:", error);
      } else {
        setRankingData(response.data);
      }
    }
    handleGetRankings();
  }, [])

  const handleOpenProfile = (user) => {
    setIsOpen(true);
    setProfileUserName(user.userName);
    setUserData(user)
  }

  const handleSetClose = () => {
    setIsOpen(false);
    setUserData(null);
  }

  return (
    <div className="w-full mx-auto px-10 p-10 bg-[#0a0a0a] min-h-screen text-white">
      {/* Header Section */}
      <div className="flex w-2/3 h-auto gap-3 items-center mb-8">
        <h1 className="text-4xl font-Bold text-gray-100">{category}
        </h1>
        <h2 className="text-3xl font-light text-white mt-1">Category</h2>
      </div>

      {/* Ranking List */}
      <div className="flex flex-col gap-3 cursor-pointer">
        {rankingData.map((info, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-[#111111] hover:bg-[#161616] border border-white/5 p-3 rounded-xl transition-all duration-200 group"
            onClick={() => handleOpenProfile(info)}
          >
            {/* Left side: Avatar and Name */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-400 flex-shrink-0">
                {info.profileImageUrl ? (
                  <img src={info.profileImageUrl} alt={info.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-zinc-700 border border-white/10" ><UserRound /></div>
                )}
              </div>
              <span className="text-gray-200 font-medium group-hover:text-white transition-colors">
                {info.userName}
              </span>
            </div>

            {/* Right side: Rank and Actions */}
            <div className="flex items-center gap-8 md:gap-16 pr-4">
              {/* Rank Icon */}
              <div className="flex items-center justify-center min-w-[30px]">
                {renderRankBadge(index + 1)}
              </div>

              {/* Action Buttons */}
              {user?._id === info._id ?
                <div>
                  <p className='w-fit text-gray-400'>This is You!</p>
                </div>
                :
                < div className="flex items-center gap-6">
                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleSendNotification(info._id);
                  }}
                    disabled={RequestedId.includes(info._id) ? true : false}
                    className="text-gray-400 cursor-pointer hover:text-teal-400 transition-colors">
                    {RequestedId.includes(info._id) ? <UserCheck2 className='w-6 h-6' /> : <UserPlus className="w-6 h-6" />}
                  </button>
                  <button className="text-gray-400 cursor-pointer hover:text-teal-400 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              }
            </div>
          </div>
        ))}
      </div>
      {
        isOpen && userData &&
        <Modal
          title={`${profileUserName}'s Profile`}
          isClose={handleSetClose}
          className={'absolute w-full h-full'}
          type='profile'
        >
          <Profile userData={userData} />
        </Modal>
      }
    </div >
  );
};

export default Ranking;



