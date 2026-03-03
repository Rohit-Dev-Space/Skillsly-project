import React, { useContext, useEffect, useRef, useState } from "react";
import { Check, X, Video, Flag, Star, Trash } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../Utilities/Modal";
import axiosinstance from "../../Utilities/axiosIntance";
import moment from "moment";
import { motion } from "framer-motion";
import { UserContext } from "../Context/UserContext";
import { Toaster } from "sonner";
import { toast } from "sonner";

const GroupMessages = () => {
  const navigate = useNavigate();
  const { groupName, groupId } = useParams();
  const { user } = useContext(UserContext);
  const [partnerId, setPartnerId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [value, setValue] = useState(0);
  const [joinSessions, setJoinSessions] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [reportModal, setReportModal] = useState({
    openModal: false,
    data: ''
  });
  const [reportReason, setReportReason] = useState("");

  const messagesEndRef = useRef(null);

  const reasons = ['Sexual Harassment', 'Unattended Review', 'Misrepresentation of Skills', 'Vulgar Language', 'Spam', 'False Reporter']

  const getTodayDate = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split("T")[0];
  };

  const handleJoinSession = (item) => {
    navigate(`/dashboard/session/${groupName}/$${item.roomId}/${item.sessionToken}`);
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

  const getPartnerId = async () => {
    const res = await axiosinstance.get("/groups/get-one-group/" + groupId);

    const { memberOne, memberTwo } = res.data.data;

    const otherUserId =
      user?._id === memberOne ? memberTwo : memberOne;

    setPartnerId(otherUserId);
  };


  const handleSendSessionRequest = async () => {
    let skillWantToLearn = "";

    if (!date || !time) {
      setError("Please fill all fields");
      return;
    }

    const response = await axiosinstance.get(
      "/groups/get-one-group/" + groupId
    );

    if (user?._id === response?.data.data.memberOne) {
      skillWantToLearn = response?.data.data.memberTwoSkill;
    } else {
      skillWantToLearn = response?.data.data.memberOneSkill;
    }

    await axiosinstance.post("/session-requests/send-session-request", {
      groupId,
      date,
      time,
      skillWantToLearn,
    });

    setIsOpen(false);
    handleGetAllMessages();
  };

  const handleCreateJoinSession = async (item) => {
    const response = await axiosinstance.post(
      `/session-requests/create-join-session/${item._id}`,
      {
        groupId,
        senderId: item.senderId._id,
        date: item.date,
        time: item.time,
      }
    );
    if (response.data) {
      getJoinSessions();
      handleGetAllMessages();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const handleDeleteRequest = async (item) => {
    await axiosinstance.delete(
      `/session-requests/delete-session-request/${item._id}`
    );
    handleGetAllMessages();
  };

  const handleGetAllMessages = async () => {
    const response = await axiosinstance.get(
      `/session-requests/group-messages/${groupId}`
    );
    if (response) {
      setAllMessages(response.data.data || []);
    }
  };

  useEffect(() => {
    handleGetAllMessages();
    getJoinSessions();
    getPartnerId();
  }, []);

  const isJoinDisabled = (msg) => {
    const sessionDate = new Date(msg.date);
    const [h, m] = msg.time.split(":");
    sessionDate.setHours(h, m, 0, 0);

    const now = new Date();
    const diffMinutes = (now - sessionDate) / 60000;

    if (diffMinutes < 0) return "upcoming";
    if (diffMinutes > 15) return "Session Completed";
    return "active";
  };

  useEffect(() => {
    joinSessions.forEach((msg) => {
      const status = isJoinDisabled(msg);
      axiosinstance.put(
        `/session-requests/update-status/${msg.sessionToken}`,
        { status }
      );
    });
  }, [joinSessions]);

  const hasUpcomingOrActiveSession = joinSessions.some((session) => {
    const status = isJoinDisabled(session);
    return status === "upcoming" || status === "active";
  });

  const handleReportUser = async (reportedId) => {
    if (!reportReason) {
      setError("Must Select atleast One Reason")
      return;
    }
    const response = await axiosinstance.post(`/report/report-user`, { reportedId: reportedId, userId: user._id, reporterName: user.userName, reason: reportReason })
    if (response.data) {
      toast.success("User Reported SuccessFully")
      setReportModal({ openModal: false, data: '' })
    }

  }

  const handleCheckReportExists = async (reportedId) => {
    const alreadyExists = await axiosinstance.post('/report/already-reported', { userId: user._id, reportedId: reportedId })

    if (alreadyExists.data.exist) {
      toast.info("You Have already Reported these user")
    } else {
      setReportModal({
        openModal: true,
        data: reportedId.toString()
      })
    }
  }

  const hasPendingReview = joinSessions.some((session) => {
    return (
      session.status === "Session Over" &&
      session.isReviewed === false &&
      session.type === "session_created"
    );
  });

  const conditionMet = hasUpcomingOrActiveSession || hasPendingReview;

  const handleScheduleClick = () => {
    if (conditionMet) {
      toast.error(
        hasPendingReview
          ? "Please complete the pending review before scheduling a new session"
          : "You already have an upcoming or active session"
      );
      return;
    }
    setIsOpen(true);
  };

  const handleSendReview = async (msg) => {
    const response = await axiosinstance.post(
      "/session-requests/give-review",
      {
        mentorId: msg.reviewedId,
        rating: value,
        skillWantToLearn: msg.skillWantToLearn,
        reviewId: msg.reviewId,
      }
    );
    if (response.data) {
      handleGetAllMessages();
      console.log(msg.reviewedId, msg.skillWantToLearn);
      setTimeout(() => {
        toast.success("Review Sent Successfully");
      }, 500);
    }
  };

  const handleDeleteJoinSession = async (msg) => {
    const response = await axiosinstance.delete(`/session-requests/delete-join-session/${msg._id}`)
    if (response) {
      handleGetAllMessages();
    }
  }

  return (
    <div className="h-screen w-full flex flex-col bg-black">
      <Toaster position="top-center" />

      <div className="h-20 px-6 flex items-center border-b border-white/20">
        <p className="text-white text-xl font-medium truncate">{groupName}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-2">
        {allMessages.map((msg, index) => {
          if (msg.type !== "review" && msg.type !== "system" && !msg.senderId) {
            return null;
          }
          const isMe =
            user?._id?.toString() === msg.senderId?._id?.toString();

          return (
            <div
              key={index}
              className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
            >
              {msg.type === "session_request" && (
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
                        onClick={() => handleDeleteRequest(msg)}
                        className="p-1 text-white hover:text-red-400 hover:bg-black/40 rounded-full"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {msg.type === "system" &&
                <div className="w-1/2 mx-auto my-10 p-5 rounded-xl bg-gray-600 text-white text-cente">
                  {msg.text}
                </div>
              }

              {msg.type === "session_created" &&
                (() => {
                  const status = isJoinDisabled(msg);
                  return (
                    <div className=" w-full flex justify-center">
                      <div className="group relative max-w-md flex justify-evenly items-center w-full p-4 bg-[#1a1a1a] rounded-xl">
                        <div className="flex flex-col">
                          <p className="text-gray-300 text-center mb-3">
                            Join Session
                          </p>
                          {(status === "upcoming" || status === "active") &&
                            user?._id === msg.senderId._id && (
                              <button onClick={() => handleDeleteJoinSession(msg)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Trash className="text-red-300" size={19} />
                              </button>)}
                          <button
                            disabled={status !== "active"}
                            onClick={() => handleJoinSession(msg)}
                            className={`mx-auto flex items-center gap-2 py-2 px-6 rounded-lg ${status === "active"
                              ? "bg-teal-600 hover:bg-teal-700 cursor-pointer"
                              : "bg-gray-600 cursor-not-allowed"
                              } text-white`}
                          >
                            <Video size={18} />
                            {status === "upcoming" && "Not Started"}
                            {status === "active" && "Join"}
                            {status === "Session Completed" && "Session Over"}
                          </button>
                        </div>

                        <div className="flex flex-col gap-5">
                          <p className="text-gray-400 text-sm">
                            created by {msg.senderId.userName}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Scheduled at{" "}
                            {moment(msg.date).format("DD MMM YYYY")} at{" "}
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              {msg.type === "review" && msg.isReviewed === false ? (
                <div className="w-2/4 h-fit mx-auto my-5 flex flex-col items-center border border-gray-600 rounded-xl p-5">
                  {user?._id === msg.reviewerId._id ? (
                    <>
                      <div className="w-full flex justify-between">
                        <h1 className="w-full text-white text-center">
                          Based on the previous session give a review
                        </h1>
                        <button onClick={() => handleCheckReportExists(msg.reviewedId)} className="bg-red-400 hover:bg-red-500 text-white p-2 cursor-pointer rounded-lg">
                          <Flag size={20} />
                        </button>
                      </div>

                      <div className="relative mt-7 w-2/3">
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.5"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-lg appearance-none cursor-pointer"
                        />
                        <motion.div
                          animate={{ left: `${value * 10}%` }}
                          className="absolute -top-7 text-white font-bold"
                        >
                          {value}
                        </motion.div>
                      </div>

                      <div className="flex gap-5 items-center justify-evenly w-full mt-4">
                        <p className="text-gray-400">
                          {value < 3 && "Disappointed"}
                          {value >= 3 && value <= 5.5 && "Needs Improvement"}
                          {value >= 6 && value <= 7.5 && "Very helpful"}
                          {value > 7.5 && "Outstanding!"}
                        </p>

                        <button
                          onClick={() => handleSendReview(msg)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                        >
                          Send Review
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full flex justify-between gap-10 text-white">
                      <p className="w-full text-center mt-2">{msg.reviewerId.userName} Has Not Reviewed Yet</p>
                      <button onClick={() => handleCheckReportExists(msg.reviewerId._id)} className="bg-red-400 hover:bg-red-500 text-white p-2 cursor-pointer rounded-lg">
                        <Flag size={20} />
                      </button>
                    </div>
                  )}

                </div>
              ) : msg.type === "review" && msg.isReviewed === true ? (
                <div className="w-1/2 mx-auto my-10 p-5 rounded-xl bg-gray-600 text-white text-center">
                  {user?._id === msg.reviewerId._id ? (
                    <p className="flex justify-center gap-2">
                      You rated your partner
                      <span className="font-bold flex gap-2"> {msg.rating} <Star fill="white" /></span>for{" "}
                      <span className="italic">Teaching {msg.skillWantToLearn}</span>
                    </p>
                  ) : (
                    <p className="flex justify-center gap-2">
                      Your partner rated you
                      <span className="font-bold flex gap-2">{msg.rating} <Star fill="white" /></span> for{" "}
                      <span className="italic">Teaching {msg.skillWantToLearn}</span>
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="h-24 w-full px-6 flex items-center justify-center gap-4 border-t border-gray-800">
        <button
          onClick={handleScheduleClick}
          className={`w-full py-3 rounded-lg ${conditionMet
            ? "bg-gray-700 cursor-not-allowed text-gray-400"
            : "bg-[#1a1a1a] cursor-pointer text-white"
            }`}
        >
          Schedule Session
        </button>

        <button onClick={() => navigate(`/dashboard/messages/chats/${partnerId}`)} className="w-full bg-[#1a1a1a] cursor-pointer text-white py-3 rounded-lg">
          Message Partner
        </button>
      </div>

      {isOpen && (
        <Modal isClose={() => setIsOpen(false)} className="absolute w-full h-full">
          <div className="flex flex-col gap-5 p-10 mx-20">
            <p className="text-white text-xl font-medium text-center">
              Select Date & Time
            </p>

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

      {reportModal.openModal && (
        <Modal
          isClose={() => setReportModal({ openModal: false })}
          className={`absolute w-full h-full`}
        >
          <div className="w-full h-fit mx-20 my-10 flex flex-col items-center">
            <div className="mx-auto">
              <h1 className="flex flex-col text-center">Select A Reason For Report :</h1>
              <div className="flex flex-col mt-7">
                {reasons.map((item, index) => (
                  <div className="flex gap-3" key={index}>
                    <input type="radio"
                      name="reportGroup"
                      value={item}
                      onChange={(e) => setReportReason(e.target.value)} />
                    <p>{item}</p>
                  </div>
                ))}
                <button onClick={() => handleReportUser(reportModal.data)} className="cursor-pointer mt-7 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500">Report User</button>
                {error && <p className="text-red-400">{error}</p>}
              </div>
            </div>
          </div>
        </Modal>
      )
      }
    </div>
  );
};

export default GroupMessages;
