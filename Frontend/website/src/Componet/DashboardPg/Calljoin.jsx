import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CallJoin = () => {
  const jitsiContainerRef = useRef(null);
  const navigate = useNavigate();
  const { roomId } = useParams(); // dynamic room name

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
        displayName: "User",
      },

      configOverwrite: {
        prejoinPageEnabled: false,
        startWithAudioMuted: false,
        startWithVideoMuted: false,
      },

      interfaceConfigOverwrite: {
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
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
    api.addEventListener("readyToClose", () => {
      navigate("/dashboard/messages");
    });

    return () => {
      api.dispose();
    };
  }, [navigate, roomId]);

  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* HEADER */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-[#1a1a1a]">
        <h1 className="text-white text-lg font-medium">
          Live Call Session
        </h1>

        <button
          onClick={() => navigate("/dashboard/messages")}
          className="text-sm px-4 py-1 rounded bg-red-600 text-white hover:bg-red-500"
        >
          Leave Call
        </button>
      </div>

      {/* JITSI VIDEO CONTAINER */}
      <div
        ref={jitsiContainerRef}
        className="flex-1 bg-black"
      />
    </div>
  );
};

export default CallJoin;
