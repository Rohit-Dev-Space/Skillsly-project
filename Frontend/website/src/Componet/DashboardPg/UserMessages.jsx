import { ArrowLeft, Check, CheckCheck, Flag, MoreVertical, Paperclip, Send, Smile } from "lucide-react";
import axiosinstance from "../../Utilities/axiosIntance";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import Modal from "../../Utilities/Modal";
import { UserContext } from "../Context/UserContext";
import { toast, Toaster } from "sonner";
import socket from "../../Utilities/Socket";

export default function UserMessages() {

    const { userId } = useParams();
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [reportModal, setReportModal] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [error, setError] = useState('');
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const onEmojiClick = (emojiData) => {
        setNewMessage(prev => prev + emojiData.emoji);
    };

    const reasons = [
        'Sexual Harassment',
        'Unattended Review',
        'Misrepresentation of Skills',
        'Vulgar Language',
        'Spam',
        'False Reporter'
    ];

    const handleGetInfo = async () => {
        const response = await axiosinstance.post('/message/user-info', { userId });
        if (response?.data) {
            setUserInfo(response.data);
        }
    };

    const getAllMessage = async () => {
        const response = await axiosinstance.post('/message/fetch-messages', {
            user2: userId
        });
        if (response?.data) {
            setMessages(response.data);
        }
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (newMessage.trim() === '') return;

        const response = await axiosinstance.post('/message/send-message', {
            text: newMessage,
            receiverId: userId
        });

        if (response?.data) {
            const newMsg = response.data;
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
            socket.emit("send-message", newMsg);
        }
    };

    const handleCheckReportExists = async () => {
        const alreadyExists = await axiosinstance.post(
            '/report/already-reported',
            { userId: user._id, reportedId: userId }
        );

        if (alreadyExists.data.exist) {
            toast.info("You Have already Reported these user");
        } else {
            setReportModal(true);
        }
    };

    const handleReportUser = async () => {
        if (!reportReason) {
            setError("Must Select atleast One Reason");
            return;
        }

        const response = await axiosinstance.post('/report/report-user', {
            reportedId: userId,
            userId: user._id,
            reporterName: user.userName,
            reason: reportReason
        });

        if (response?.data) {
            toast.success("User Reported SuccessFully");
            setReportModal(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleBackToInbox = () => {
        setUserInfo([]);
        navigate('/dashboard/messages');
    };

    useEffect(() => {
        handleGetInfo();
        getAllMessage();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (user?._id) {
            socket.emit("setup", user._id);
        }
    }, [user]);

    useEffect(() => {
        socket.on("receive-message", (message) => {
            if (message.senderId?._id === userId) {
                setMessages(prev => [...prev, message]);
                console.log("Real-time message received:", message);
            }
        });

        return () => {
            socket.off("receive-message");
        };
    }, [userId]);


    return (
        <div className="flex flex-col h-full bg-[#0d0d0d] text-white overflow-hidden">
            <Toaster position="top-center" />

            <div className="flex items-center justify-between p-4 bg-[#1a1a1a] border-b border-gray-800">
                <div className="flex items-center space-x-4">
                    <button onClick={handleBackToInbox} className="p-2 hover:bg-[#262626] rounded-full">
                        <ArrowLeft className="w-6 h-6 text-teal-400" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-teal-900/30 border border-teal-500 flex items-center justify-center">
                        <img
                            src={userInfo?.profileImageUrl}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    </div>
                    <h2 className="font-bold">{userInfo?.userName}</h2>
                </div>
                <button
                    onClick={handleCheckReportExists}
                    className="text-red-400 border border-white p-2 rounded-lg"
                >
                    <Flag size={16} />
                </button>
            </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-[#0a0a0a]">
                {messages.map(msg => (
                    <div
                        key={msg._id}
                        className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={` relative p-4 rounded-2xl max-w-[85%] break-words whitespace-pre-wrap ${msg.isMe
                                ? 'bg-teal-800 text-white rounded-tr-none'
                                : 'bg-[#1a1a1a] border border-gray-800 rounded-tl-none'
                                }`}
                        >
                            <p className="text-sm">{msg.text}</p>
                            {msg.isMe && <p className="absolute bottom-1 right-2">{msg.readBy.includes(userId) ? <CheckCheck size={15} className="text-blue-400 font-bold" /> : <Check size={15} className="text-white" />}</p>}
                        </div>
                        <span className="text-[10px] text-gray-600 mt-1">
                            {msg.time}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-[#1a1a1a] border-t border-gray-800">
                <div className="flex items-center space-x-3 bg-[#0d0d0d] p-3 rounded-xl border border-gray-800">
                    <button onClick={() => setShowEmoji(!showEmoji)} className="text-gray-500">
                        <Smile />
                    </button>

                    <textarea
                        ref={textareaRef}
                        rows="1"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-grow bg-transparent text-white resize-none outline-none"
                        placeholder="Type your message..."
                    />

                    <button onClick={handleSendMessage} className="bg-teal-500 p-2 rounded-lg">
                        <Send className="w-5 h-5 text-black" />
                    </button>

                    {showEmoji && (
                        <div className="absolute bottom-24 left-10 z-50">
                            <EmojiPicker theme="dark" onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                </div>
            </div>

            {reportModal && (
                <Modal
                    isClose={() => setReportModal(false)}
                    className="absolute w-full h-full"
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
                                <button onClick={handleReportUser} className="cursor-pointer mt-7 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500">Report User</button>
                                {error && <p className="text-red-400">{error}</p>}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
