import React from "react";
import { Check, X, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const messageInvitations = [
  { id: 1, user: "User1", role: "a learner", date: "27/08/25", time: "5:00 PM" },
  { id: 2, user: "User1", role: "a learner", date: "29/08/25", time: "5:00 PM" },
  { id: 3, user: "User2", role: "a learner", date: "27/08/25", time: "9:00 PM" },
];

const MessageInvitation = ({ user, role, date, time, onAccept, onDecline }) => (
  <div className="relative p-4 md:p-5 rounded-xl text-sm max-w-sm ml-auto mr-auto bg-gray-700">
    <p className="text-white font-medium">{user}</p>
    <p className="text-gray-300 mb-2">as {role}</p>
    <p className="text-gray-400 text-xs">
      Date: {date} / Time: {time}
    </p>

    <div className="absolute right-3 top-3 flex space-x-2 text-gray-400">
      <button
        onClick={onAccept}
        className="p-1 rounded-full hover:bg-black/50 hover:text-teal-400 transition-colors"
      >
        <Check className="w-5 h-5" />
      </button>

      <button
        onClick={onDecline}
        className="p-1 rounded-full hover:bg-black/50 hover:text-red-500 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const MessagesList = () => {
  const navigate = useNavigate();

  const handleJoinSession = () => {
    // create a unique room id (can be backend-driven later)
    const roomId = `skill-session-${Date.now()}`;
    navigate(`/dashboard/session/${roomId}`);
  };

  return (
    <div className="p-6 md:p-10 w-full h-full flex flex-col">
      <div className="flex-grow space-y-4 mb-8">
        {messageInvitations.map((msg) => (
          <MessageInvitation
            key={msg.id}
            {...msg}
            onAccept={() => console.log("Accepted")}
            onDecline={() => console.log("Declined")}
          />
        ))}

        {/* JOIN SESSION CARD */}
        <div className="flex justify-end pr-0 md:pr-10">
          <div className="w-56 p-3 bg-[#1a1a1a] rounded-xl flex flex-col items-end">
            <p className="text-gray-300 text-sm mb-2">Join Session</p>
            <button
              onClick={handleJoinSession}
              className="flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <Video className="w-5 h-5 mr-2" />
              Join
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-center space-x-4 pt-4 border-t border-gray-800">
        <button className="bg-[#1a1a1a] text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors">
          Real Time Chat
        </button>
        <button className="bg-[#1a1a1a] text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors">
          Schedule session
        </button>
      </div>
    </div>
  );
};

export default MessagesList;
