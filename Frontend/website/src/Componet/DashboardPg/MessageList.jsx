import React, { useState, useEffect, useRef, useContext } from 'react';
import { Search, MoreVertical, Paperclip, Send, Smile, ArrowLeft, Users, X, UserRoundX, User, MessageCircleMore } from 'lucide-react';
import axiosinstance from '../../Utilities/axiosIntance';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import socket from '../../Utilities/Socket';

export default function MessageList() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedUser, setSearchedUser] = useState([]);
  const [showAllResults, setShowAllResults] = useState([]);
  const [allConversations, setAllConversations] = useState([]);
  const { user } = useContext(UserContext)
  const navigate = useNavigate();

  const handleOpenChat = async (info) => {
    await axiosinstance.patch('/message/mark-read', {
      user2: info
    });

    navigate(`chats/${info}`);
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
          `/message/fetch-users?q=${searchTerm}`
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

  // Scroll to bottom helper
  // useEffect(() => {
  //   if (selectedGroup) {
  //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages, selectedGroup]);

  // Handle Send

  const handleConversations = async () => {
    const response = await axiosinstance.get('/message/fetch-conversations')
    if (response) {
      setAllConversations(response.data)
    }
  }
  // --- RENDER LOGIC ---

  const visibleUsers = showAllResults
    ? searchedUser
    : searchedUser.slice(0, 3);

  useEffect(() => {
    handleConversations();
  }, [])

  useEffect(() => {
    socket.on("conversation-updated", (data) => {
      setAllConversations(prev =>
        prev.map(conv =>
          conv._id === data.conversationId
            ? {
              ...conv,
              lastMessage: {
                text: data.lastMessage,
                senderId: data.senderId
              },
              updatedAt: new Date()
            }
            : conv
        )
      );
    });

    return () => socket.off("conversation-updated");
  }, []);


  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] text-white p-4">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-light mb-4">All Messages</h1>
        <div className="relative max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user name , name, email..."
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
                      className="flex items-center justify-between p-3 hover:bg-teal-900/10 cursor-pointer border-b border-gray-800/50 last:border-none group/item"
                    >
                      <div onClick={() => handleOpenChat(result._id)} className="flex w-full items-center justify-between gap-3 group">
                        <div className='flex gap-5 items-center'>
                          <div className="h-8 w-8 rounded-full bg-teal-900/30 flex items-center justify-center text-teal-400">
                            <img src={result.profileImageUrl} alt="" className='object-cover rounded-full w-8 h-8' />
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
                        <MessageCircleMore size={20} className='opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-teal-400' />
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
      </div>
      <div className="flex-grow overflow-y-auto">
        {console.log(allConversations)}
        {allConversations.length > 0 ? (
          allConversations.map((info, index) => (
            <div key={index} onClick={() => handleOpenChat(info.participants[0]._id === user?._id ? info.participants[1]._id : info.participants[0]._id)} className="p-5 border border-gray-700 hover:bg-[#1a1a1a] cursor-pointer rounded-2xl flex my-2 items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 text-teal-400"><Users /></div>
              <div className="flex-grow flex justify-between">
                <div>
                  {info.participants.length === 1 ? <h3 className='font-semibold'>You</h3> : <h3 className="font-semibold">{info.participants[0]._id === user?._id ? info.participants[1].userName : info.participants[0].userName}</h3>}                  <p className="text-sm text-gray-400 truncate">{info.lastMessage.text}</p>
                </div>
                {!info.lastMessage.readBy.includes(user?._id) && <p className='p-2 text-black bg-teal-400 font-semibold rounded-full'>New Message</p>}
              </div>
            </div>
          ))
        ) : (
          <div className='w-full h-full py-20 flex flex-col items-center justify-center'>
            <h1 className='text-white text-xl mb-6'>No Messages Yet</h1>
          </div>
        )}
      </div>
    </div>
  );
}


