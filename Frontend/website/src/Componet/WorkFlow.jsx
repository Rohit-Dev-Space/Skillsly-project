import React from "react"

export default function WorkFlow() {
    return (
        <section className="bg-black py-10 pb-20 md:pb-30 overflow-hidden text-center" id="workflow">
            {/* Header Section */}
            <div className="flex flex-col items-center mx-auto text-center gap-6 md:gap-10 px-4">
                <h1 className="flex flex-wrap justify-center text-4xl md:text-5xl text-white font-semibold">
                    How SkillSly
                    <span className="bg-[radial-gradient(ellipse_at_center,_#4DDCB7_0%,_#B8FB70_100%)] pl-3 bg-clip-text text-transparent">
                        Works ?
                    </span>
                </h1>
                <p className="w-full md:w-3/5 mx-auto text-white z-20 text-sm md:text-base">
                    SkillSly has made working on these platform smooth as butter. 
                    Some steps are listed down which makes the process more simpler.
                </p>
            </div>

            {/* Background Decoration - Hidden on small mobile to prevent horizontal scroll */}
            <div className="hidden md:block bg-[#4DDCB7] blur-3xl rounded-full z-10 w-96 h-92 gap-10 -mt-30 -ml-20 opacity-50"></div>
            
            {/* Main Cards Grid */}
            <div className="flex flex-wrap w-11/12 md:w-5/6 mt-10 md:-mt-40 h-fit gap-6 md:gap-10 justify-center mx-auto">
                
                {/* Card 1 */}
                <div className="w-full md:w-[30%] min-h-[350px] md:h-90 z-30 bg-[#292524] p-4 rounded-lg overflow-hidden">
                    <div className="flex p-3 items-start justify-between gap-4 text-white">
                        <h2 className="text-lg md:text-xl text-left">Login / Register Yourself</h2>
                        <p className="text-5xl md:text-6xl font-bold opacity-20">1</p>
                    </div>
                    <p className="w-full md:w-4/6 pl-3 -mt-2 text-left text-xs text-white">Create a Profile or make one by giving some basic info like name, email and password.</p>
                    <div className="relative mt-8">
                        <img src="/login.png" alt="login page" className="w-2/3 h-auto z-30 pl-5" />
                        <img src="/skillpg.png" alt="skill adding page" className="w-3/5 h-auto absolute top-10 left-24 z-10" />
                    </div>
                </div>

                {/* Card 2 */}
                <div className="w-full md:w-[30%] min-h-[350px] md:h-90 z-30 bg-[#292524] p-4 rounded-lg overflow-hidden">
                    <div className="flex p-3 items-start justify-between gap-4 text-white">
                        <h2 className="text-lg md:text-xl text-left">Find a Skill Category</h2>
                        <p className="text-5xl md:text-6xl font-bold opacity-20">2</p>
                    </div>
                    <p className="w-full md:w-4/6 pl-3 -mt-2 text-left text-xs text-white">Select from top recommendations based on preference.</p>
                    <div className="relative mt-10 h-40">
                        <img src="/skillsly-dashboard.png" alt="" className="mx-auto shadow-2xl z-10 scale-90 md:scale-60 -rotate-12" />
                    </div>
                </div>

                {/* Card 3 */}
                <div className="w-full md:w-[30%] min-h-[350px] md:h-90 z-30 bg-[#292524] p-4 rounded-lg overflow-hidden">
                    <div className="flex p-3 items-start justify-between gap-4 text-white">
                        <h2 className="text-lg md:text-xl text-left">Try & Find for a match</h2>
                        <p className="text-5xl md:text-6xl font-bold opacity-20">3</p>
                    </div>
                    <p className="w-full md:w-4/6 pl-3 -mt-2 text-left text-xs text-white">Rankings based on ratings and direct messaging for swapping.</p>
                    <div className="relative mt-5 h-40">
                         <img src="/ranking.png" alt="rankings" className="scale-75 md:scale-60 mx-auto z-10" />
                         <img src="/chat.png" alt="chat icon" className="absolute top-0 right-0 w-12 md:w-20 scale-75" />
                    </div>
                </div>

                {/* Card 4 - Larger Card */}
                <div className="w-full md:w-[46%] min-h-[350px] md:h-90 p-4 bg-[#292524] rounded-lg overflow-hidden">
                    <div className="flex p-3 items-start justify-between md:justify-evenly gap-10 text-white">
                        <h2 className="text-lg md:text-xl text-left">Connect & Schedule Sessions</h2>
                        <p className="text-5xl md:text-6xl font-bold opacity-20">4</p>
                    </div>
                    <p className="w-full md:w-5/6 pl-3 -mt-2 text-left text-xs text-white">After acceptance, a group is formed where you can chat and schedule sessions.</p>
                    <div className="flex justify-center items-center mt-10 relative h-32">
                        <img src="/group.png" alt="group" className="-rotate-12 w-1/3 shadow-2xl z-20" />
                        <img src="/group-layout.png" alt="group" className="rotate-12 w-1/3 -ml-10 z-10" />
                    </div>
                </div>

                {/* Card 5 - Larger Card */}
                <div className="w-full md:w-[46%] min-h-[350px] md:h-90 p-4 z-30 bg-[#292524] rounded-lg overflow-hidden">
                    <div className="flex p-3 items-start justify-between md:justify-evenly gap-10 text-white">
                        <h2 className="text-lg md:text-xl text-left">Use Video call & swap skills</h2>
                        <p className="text-5xl md:text-6xl font-bold opacity-20">5</p>
                    </div>
                    <p className="w-full md:w-5/6 pl-3 -mt-2 text-left text-xs text-white">Use built-in video calls and the notes section to save important points.</p>
                    <div className="mt-5">
                        <img src="/VideoChatWork.png" className="w-full md:scale-75 object-contain" alt="" />
                    </div>
                </div>

            </div>
            
            {/* Bottom Glow */}
            <div className="hidden md:block bg-[#4DDCB7] blur-3xl rounded-full z-10 w-96 h-92 -mt-20 -mb-50 ml-[80%] opacity-40"></div>
        </section>
    )
}