import React, { useContext, useEffect, useState } from 'react';
import {
  UserPlus,
  MessageSquare,
  Trophy,
  UserCheck2,
  Star,
  UserRound
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosinstance from '../../Utilities/axiosIntance';
import Modal from '../../Utilities/Modal';
import Profile from './Profile';
import { UserContext } from '../Context/UserContext';
import { Toaster } from '../../components/ui/sonner';
import { toast } from "sonner";

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
  const [alreadyRequested, setAlreadyRequested] = useState(false);
  const [RequestedId, setRequestedId] = useState([]);
  const [selectOfferingSkill, setSelectOfferingSkill] = useState('');
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [selectedReceiverId, setSelectedReceiverId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  let { category, categoryId } = useParams();
  category = category.replace(/[-/]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

  const handleSendNotification = async (id) => {
    if (!selectOfferingSkill) {
      setError('Need To Select The Skill ');
    } else {
      setError('');
      const response = await axiosinstance.post(
        '/skills/send-Notifications',
        {
          reciverId: id,
          category: category,
          type: "Friend_Request",
          skillOffering: selectOfferingSkill
        }
      );

      if (response.data.isSent) {
        setOpenRequestModal(false);
      } else {
        setRequestedId(prev =>
          prev.includes(id) ? prev : [...prev, id]
        );
        setSelectOfferingSkill('');
        setOpenRequestModal(false);
        toast.success('Request Sent Successfully!', { duration: 4000 });
      }
    }
  };

  useEffect(() => {
    const handleGetRankings = async () => {
      try {
        const response = await axiosinstance(
          `/skills/get-rankings?categoryId=${categoryId}`
        );

        setRankingData(response.data.rankingData || []);
      } catch (err) {
        console.error(err);
        setRankingData([]);
      }
    };

    handleGetRankings();
  }, []);

  const handleOpenProfile = (user) => {
    setIsOpen(true);
    setProfileUserName(user.userName);
    setUserData(user);
  };

  const handleSetClose = () => {
    setIsOpen(false);
    setUserData(null);
  };

  return (
    <div className="w-full mx-auto px-10 p-10 bg-[#0a0a0a] min-h-screen text-white">
      <Toaster position="top-right" richColors />

      <div className="flex w-2/3 h-auto gap-3 items-center mb-8">
        <h1 className="text-4xl font-Bold text-gray-100">{category}</h1>
        <h2 className="text-3xl font-light text-white mt-1">Category</h2>
      </div>

      <div className="flex flex-col gap-3 cursor-pointer">
        {rankingData.map((info, index) => (
          <div
            key={index}
            className="flex items-center bg-[#111111] hover:bg-[#161616] border border-white/5 p-4 rounded-xl transition-all duration-200"
          >
            {/* Rank */}
            <div className="w-10 flex justify-center mr-3">
              {renderRankBadge(index + 1)}
            </div>

            {/* Avatar */}
            <div
              className="w-12 h-12 mr-4 flex-shrink-0"
              onClick={() => handleOpenProfile(info.user)}
            >
              {info.user.profileImageUrl ? (
                <img
                  src={info.user.profileImageUrl}
                  alt={info.user.userName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-zinc-700 flex items-center justify-center">
                  <UserRound />
                </div>
              )}
            </div>

            {/* Name */}
            <div
              className="flex-1 min-w-[160px]"
              onClick={() => handleOpenProfile(info.user)}
            >
              <p className="text-gray-200 font-medium hover:text-white">
                {info.user.userName}
              </p>
            </div>

            {/* Rating & Reviews */}
            <div className="w-36 text-center">
              <div className="flex items-center justify-center gap-1 text-white font-medium">
                <Star size={14} fill="white" />
                <span>{Number(info.ratingStats.avgRating).toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400">
                {info.ratingStats.totalReviews} reviews
              </p>
            </div>

            {/* Actions */}
            {user?._id === info.user._id ? (
              <p className="text-sm text-gray-400 w-28 text-right">
                This is you
              </p>
            ) : (
              <div className="w-28 flex justify-end items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (RequestedId.includes(info.user._id)) {
                      toast.warning('Request already sent!');
                      return;
                    }
                    setSelectedReceiverId(info.user._id);
                    setOpenRequestModal(true);
                  }}
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  {RequestedId.includes(info.user._id)
                    ? <UserCheck2 className="w-5 h-5" />
                    : <UserPlus className="w-5 h-5 cursor-pointer" />}
                </button>

                <button onClick={() => navigate(`/dashboard/messages/chats/${info.user._id}`)} className="text-gray-400 hover:text-teal-400 transition-colors cursor-pointer">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isOpen && userData && (
        <Modal
          title={`${profileUserName}'s Profile`}
          isClose={handleSetClose}
          className={'absolute w-full h-full'}
          type='profile'
        >
          <Profile userData={userData} />
        </Modal>
      )}

      {user && openRequestModal && (
        <Modal
          isClose={() => setOpenRequestModal(false)}
          className={'absolute w-full h-full'}
        >
          <div className='flex flex-col gap-5 py-5 px-25'>
            <p>Select The Skill you Are Going to offer to Teach</p>

            <select
              value={selectOfferingSkill}
              onChange={(e) => setSelectOfferingSkill(e.target.value)}
              className='w-full h-10 border border-white rounded-xl bg-black px-5'
            >
              <option value="" disabled>Select a Skill</option>
              {user.skillsKnow.map((item, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </select>

            <div className="flex gap-5">
              <button
                onClick={() => setOpenRequestModal(false)}
                className="w-full py-3 bg-white text-black rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={() => handleSendNotification(selectedReceiverId)}
                className="w-full py-3 bg-blue-400 text-white rounded-xl"
              >
                Send
              </button>
            </div>

            {error && <p className="text-red-400">{error}</p>}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Ranking;
