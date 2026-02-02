import React, { useContext, useEffect, useState } from "react";
import { Check, X, Video } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../Utilities/Modal";
import axiosinstance from "../../Utilities/axiosIntance";
import moment from "moment";
import { UserContext } from "../Context/UserContext";

const GroupMessages = () => {
  const navigate = useNavigate();
  const { groupName, groupId } = useParams();
  const { user } = useContext(UserContext);

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [sessionRequests, setSessionRequests] = useState([]);
  const [joinSessions, setJoinSessions] = useState([]);

  const getTodayDate = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split("T")[0];
  };

  const handleJoinSession = (item) => {
    const roomId = `skill-session-${Date.now()}`;
    navigate(`/dashboard/session/${roomId}`);
  };


  const getSessionRequests = async () => {
    try {
      const res = await axiosinstance.get(
        `/session-requests/get-session-requests/${groupId}`
      );
      setSessionRequests(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getJoinSessions = async () => {
    try {
      const res = await axiosinstance.get(
        `/session-requests/get-join-sessions/${groupId}`
      );
      setJoinSessions(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendSessionRequest = async () => {
    if (!date || !time) {
      setError("Please fill all fields");
      return;
    }

    await axiosinstance.post("/session-requests/send-session-request", {
      groupId,
      date,
      time,
    });

    setIsOpen(false);
    getSessionRequests();
  };

  const handleCreateJoinSession = async (item) => {
    await axiosinstance.post(
      `/session-requests/create-join-session/${item._id}`,
      {
        groupId,
        senderId: item.senderId._id,
        date: item.date,
        time: item.time,
      }
    );

    getJoinSessions();
    getSessionRequests();
  };

  const handleDeleteRequest = async (id) => {
    await axiosinstance.delete(
      `/session-requests/delete-session-request/${id}`
    );
    getSessionRequests();
  };

  useEffect(() => {
    getSessionRequests();
    getJoinSessions();
  }, []);


  const allMessages = [
    ...sessionRequests.map((item) => ({ ...item, type: "request" })),
    ...joinSessions.map((item) => ({ ...item, type: "join" })),
  ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));


  return (
    <div className="h-screen w-full flex flex-col bg-black">

      {/* HEADER */}
      <div className="h-20 px-6 flex items-center border-b border-white/20">
        <p className="text-white text-xl font-medium truncate">{groupName}</p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        {allMessages.map((msg, index) => {
          if (!msg.senderId) return null;

          const isMe =
            user?._id?.toString() === msg.senderId._id?.toString();

          return (
            <div
              key={index}
              className={`flex w-full ${isMe ? "justify-end" : "justify-start"
                }`}
            >
              {/* SESSION REQUEST */}
              {msg.type === "request" && (
                <div className="relative w-2/5 p-4 rounded-xl bg-gray-700">
                  <div className="flex items-center gap-2">
                    <img
                      src={msg.senderId.profileImageUrl}
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="text-white font-medium">
                      {msg.senderId.userName}
                    </p>
                  </div>

                  <p className="text-gray-400 text-sm mt-2">
                    Meet on {moment(msg.date).format("DD MMM YYYY")} at{" "}
                    {msg.time}
                  </p>

                  {!isMe && (
                    <div className="absolute right-2 top-2 flex gap-2">
                      <button
                        onClick={() => handleCreateJoinSession(msg)}
                        className="p-1 text-white hover:text-teal-400 hover:bg-black/40 rounded-full"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(msg._id)}
                        className="p-1 text-white hover:text-red-400 hover:bg-black/40 rounded-full"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* JOIN SESSION CARD */}
              {msg.type === "join" && (
                <div className="w-full flex justify-center">
                  <div className="max-w-md w-full p-4 bg-[#1a1a1a] rounded-xl">
                    <p className="text-gray-300 text-center mb-3">
                      Join Session
                    </p>
                    <button
                      onClick={() => handleJoinSession(msg)}
                      className="mx-auto flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg"
                    >
                      <Video size={18} /> Join
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="h-24 px-6 flex items-center justify-center gap-4 border-t border-gray-800">
        <button
          onClick={() => setIsOpen(true)}
          className="w-1/3 bg-[#1a1a1a] cursor-pointer text-white py-3 rounded-lg"
        >
          Schedule Session
        </button>
        <button className="w-1/3 bg-[#1a1a1a] cursor-pointer text-white py-3 rounded-lg">
          Message Partner
        </button>
      </div>

      {/* MODAL */}
      {isOpen && (
        <Modal
          isClose={() => setIsOpen(false)}
          className={`absolute w-full h-full`}
        >
          <div className="flex flex-col gap-5 p-10 mx-20">
            <p className="text-white text-xl font-medium w-full text-center">Select Date & Time</p>
            <input
              min={getTodayDate()}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-[#111] w-full text-white px-3 py-2 rounded"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-[#111] w-full text-white px-3 py-2 rounded"
            />
            <button
              onClick={handleSendSessionRequest}
              className="bg-blue-500 w-full text-white py-3 rounded"
            >
              Send
            </button>
            {error && <p className="text-red-400">{error}</p>}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GroupMessages;
