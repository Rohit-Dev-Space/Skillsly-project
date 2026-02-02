import { AnimatePresence } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import NotesPanel from "./NotePanel";
import { UserContext } from "../Context/UserContext";
import axiosinstance from "../../Utilities/axiosIntance";
import Modal from "../../Utilities/Modal";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { Flag } from "lucide-react";

const CallJoin = () => {
  const jitsiContainerRef = useRef(null);
  const navigate = useNavigate();
  const { roomId, sessionToken } = useParams();
  const [sessionData, setSessionData] = useState(null)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [currentMentor, setCurrentMentor] = useState(null);
  const [currentMentorId, setCurrentMentorId] = useState(null);
  const [skillWantToLearn, setSkillWantToLearn] = useState("");
  const [value, setValue] = useState(0);
  const [reportReason, setReportReason] = useState("")
  const [reportModal, setReportModal] = useState(false)
  const [error, SetError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const { user } = useContext(UserContext)

  const reasons = ['Sexual Harassment', 'Unattended Review', 'Misrepresentation of Skills', 'Vulgar Language', 'Spam', 'False Reporter']

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await axiosinstance.get(
          `/session-requests/verify/${sessionToken}`
        );

        setSessionData(res.data.data);
        if (res.data.data.status === "expired") {
          setSessionExpired(true);
        }
      } catch {
        navigate("/dashboard/groups");
      }
    };
    verifySession();
  }, []);

  const handleIsreview = () => {
    if (!sessionData) return;


    const isLearner = sessionData.senderId._id === user._id;

    if (sessionData.status !== 'active') {
      if (isLearner && !sessionData.isReviewed) {
        setCurrentMentor(sessionData.recevierId.userName);
        setCurrentMentorId(sessionData.recevierId._id);
        setSkillWantToLearn(sessionData.skillWantToLearn);
        setIsOpen(true);
        return;
      }
      navigate(`/dashboard/groups/get-one-group/${sessionData.groupId}`);
    } else {
      navigate(`/dashboard/groups/get-one-group/${sessionData.groupId}`);
    }
  };


  const handleSendReview = async () => {
    const response = await axiosinstance.post('/session-requests/give-review', {
      mentorId: currentMentorId,
      rating: value,
      skillWantToLearn: skillWantToLearn
    })
    if (response.data) {
      console.log(response.data.data)
      navigate(`/dashboard/groups/get-one-group/${sessionData.groupId}`);
      setTimeout(() => {
        toast.success("Review Sent Successfully");
      }, 500);
    }
  };

  const handleCheckReportExists = async () => {
    let id = ''
    if (user._id === sessionData.senderId._id) {
      id = sessionData.recevierId._id
    } else {
      id = sessionData.senderId._id
    }

    const alreadyExists = await axiosinstance.post('/report/already-reported', { userId: user._id, reportedId: id })

    if (alreadyExists.data.exist) {
      toast.info("You Have already Reported these user")
    } else {
      setReportModal(true)
    }
  }

  const handleReportUser = async () => {
    if (!reportReason) {
      SetError("Must Select atleast One Reason")
      return;
    }

    let id = ''
    if (user._id === sessionData.senderId._id) {
      id = sessionData.recevierId._id
    } else {
      id = sessionData.senderId._id
    }

    setReportModal(true)
    const response = await axiosinstance.post(`/report/report-user`, { reportedId: id, userId: user._id, reporterName: user.userName, reason: reportReason })
    if (response.data) {
      toast.success("User Reported SuccessFully")
      setReportModal(false)
    }

  }

  useEffect(() => {
    if (!window.JitsiMeetExternalAPI) {
      alert("Jitsi Meet API not loaded");
      return;
    }

    const domain = "meet.jit.si";

    const options = {
      roomName: roomId || "SkillSlySessionRoom",
      parentNode: jitsiContainerRef.current,
      width: "100%",
      height: "100%",

      userInfo: {
        displayName: user?.userName,
      },

      configOverwrite: {
        prejoinPageEnabled: true,
        startWithAudioMuted: false,
        startWithVideoMuted: false,
      },

      interfaceConfigOverwrite: {
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DISABLE_PROFILE: false,
        DISABLE_DISPLAY_NAME_EDIT: true,
        TOOLBAR_BUTTONS: [
          "microphone",
          "camera",
          "desktop",
          "fullscreen",
          "fodeviceselection",
          "hangup",
          "chat",
          "settings",
          "raisehand",
          "videoquality",
          "tileview",
        ],
      },
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);

    // When call ends
    api.addEventListener("readyToClose", handleIsreview);

    return () => {
      api.dispose();
    };
  }, [navigate, roomId]);

  useEffect(() => {
    const handleBack = (event) => {
      event.preventDefault();
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black flex flex-col">
      <Toaster position="top-center" />
      {/* HEADER */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-[#1a1a1a]">
        <h1 className="text-white text-lg font-medium">
          Live Call Session
        </h1>

        <div className="flex gap-5">
          <button onClick={handleCheckReportExists} className="bg-red-400 hover:bg-red-500 text-white w-fit h-fit p-2 cursor-pointer rounded-lg">
            <Flag size={20} />
          </button>
          <button
            onClick={handleIsreview}
            className="text-sm px-4 py-1 rounded bg-red-600 text-white hover:bg-red-500"
          >
            Leave Call Session
          </button>
        </div>
      </div>

      {/* JITSI VIDEO CONTAINER */}
      <div className="flex w-full h-full overflow-hidden">
        <div ref={jitsiContainerRef} className="flex-1 h-full bg-black" />
        <AnimatePresence>
          <motion.div
            animate={{ width: isSideMenuOpen ? '20%' : '0%' }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`relative max-w-xs hidden lg:block border-r border-[#242424]`}>
            <NotesPanel func={() => setIsSideMenuOpen(!isSideMenuOpen)} isSideMenuOpen={isSideMenuOpen} />
          </motion.div>
        </AnimatePresence>
      </div>
      {isOpen && (
        <Modal
          isClose={() => setIsOpen(false)}
          className={`absolute w-full h-full`}
        >
          <div className="w-full h-fit mx-20 my-10 flex flex-col items-center">
            <div className="mx-auto">
              <h1 className="flex flex-col text-center">Based On these Session Give a Review To Your Partner <span className="text-2xl">"{currentMentor}"</span></h1>
              <div className="relative mt-7">
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
                  className="absolute -top-5 text-white font-bold"
                >
                  {value}
                </motion.div>
              </div>
              <div className="flex gap-5 items-center justify-evenly w-full">
                <p className="text-center mt-4 text-gray-400">
                  {value < 3 && "Dissapointed"}
                  {value >= 3 && value <= 5.5 && "Needs Improvement"}
                  {value >= 6 && value <= 7.5 && "Very helpful"}
                  {value > 7.5 && "Outstanding!"}
                </p>
                <button onClick={handleSendReview} className="cursor-pointer mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">Send Review</button>
              </div>
            </div>
          </div>
        </Modal>
      )
      }
      {reportModal && (
        <Modal
          isClose={() => setReportModal(false)}
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
                <button onClick={handleReportUser} className="cursor-pointer mt-7 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500">Report User</button>
                {error && <p className="text-red-400">{error}</p>}
              </div>
            </div>
          </div>
        </Modal>
      )
      }
    </div >

  );
};

export default CallJoin;
