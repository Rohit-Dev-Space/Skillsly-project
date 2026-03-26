import CardSwap, { Card } from '../components/CardSwap'
import CountUp from '../components/CountUp'
import { Gamepad2, NotebookPen, Video } from 'lucide-react';

export default function Feature() {

    const cards = [
        {
            title: "Connect with peers Through Video Chat!",
            desc: "Video chat provides Users with a medium to connect with other Users and can eases the process of swapping knowledge.",
            bg: "linear-gradient(135deg, #34d399, #60a5fa)"
        },
        {
            title: "Real-time Chat & request Schedule",
            desc: "Personalized learning paths and skill suggestions based on your interests, career goals, and market trends.",
            bg: "linear-gradient(135deg, #a78bfa, #f472b6)"
        },
        {
            title: "Gamification of The process",
            desc: "Earn points, unlock badges, and level up as you learn. Track progress with engaging achievements and leaderboards.",
            bg: "linear-gradient(135deg, #fbbf24, #f97316)"
        },
        {
            title: "Save Notes simeltenously during the session",
            desc: "Notes can be saved during the session these notes can be later accessed through our “saved notes” section , helping to learn more efficiently and making the process more smooth.",
            bg: "linear-gradient(135deg, #fbbf24, #f97316)"
        }
    ];

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-[#292524] to-[#000000] overflow-hidden pt-16 sm:pt-20 pb-24 sm:pb-40 text-center relative">

            <div className="bg-[#4DDCB7] blur-3xl rounded-full absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 w-40 h-40 sm:w-72 sm:h-72 lg:w-96 lg:h-96"></div>

            <div className='flex flex-col lg:flex-row items-center justify-between gap-16 px-6 sm:px-10 lg:px-16'>

                <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2">

                    <div className='w-full flex flex-col items-center lg:items-start gap-8'>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white font-semibold">
                            Why Use
                            <span className="bg-gradient-to-t from-[#4DDCB7] to-[#B8FB70] pl-3 bg-clip-text text-transparent">
                                Skillsly ?
                            </span>
                        </h1>

                        <p className="text-sm sm:text-base max-w-xl text-white font-light">
                            SkillSly is more than just a learning platform — it’s a peer-to-peer ecosystem where skills are exchanged, not just consumed. Instead of one-way courses, SkillSly connects learners and mentors directly, allowing users to teach what they know and learn what they need in real time.
                        </p>
                    </div>

                    <div className='w-full flex flex-col sm:flex-row justify-center lg:justify-start gap-12 sm:gap-20 items-center text-3xl sm:text-4xl lg:text-5xl mt-16'>

                        <div className='flex flex-col items-center'>
                            <div>
                                <CountUp
                                    from={0}
                                    to={100}
                                    separator=","
                                    direction="up"
                                    duration={1}
                                    className="count-up-text"
                                />%
                            </div>
                            <h2 className='text-slate-400 text-sm sm:text-lg'>Customer <br /> Satisfication</h2>
                        </div>

                        <div className='flex flex-col items-center'>
                            <div>
                                <CountUp
                                    from={100}
                                    to={0}
                                    separator=","
                                    direction="up"
                                    duration={1}
                                    className="count-up-text"
                                />
                            </div>
                            <h2 className='text-slate-400 text-sm sm:text-lg pt-2'>Registered <br />Users</h2>
                        </div>

                        <div className='flex flex-col items-center'>
                            <div>
                                <CountUp
                                    from={100}
                                    to={10}
                                    separator=","
                                    direction="up"
                                    duration={1}
                                    className="count-up-text"
                                />+
                            </div>
                            <h2 className='text-slate-400 text-sm sm:text-lg'>Skill <br />Categories</h2>
                        </div>

                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex justify-center">
                    <div className="text-white w-full max-w-md sm:max-w-lg h-[350px] sm:h-[400px] relative">
                        <CardSwap
                            cardDistance={60}
                            verticalDistance={70}
                            delay={2000}
                            pauseOnHover={true}
                            easing='linear'
                            skewAmount={6}
                        >
                            <Card>
                                <div className='flex flex-col gap-5'>
                                    <div className='flex flex-col py-2 border-b-2 border-white items-start gap-6 p-5'>
                                        <h3 className='flex w-full justify-center items-end gap-3 text-sm sm:text-base'>
                                            <Video size={22} /> | <span>Video Chat To Connect</span>
                                        </h3>
                                    </div>
                                    <div className='px-5 text-start'>
                                        <p className="text-sm sm:text-base">
                                            Video chat provides Users with a medium to connect with other Users and can eases the process of swapping knowledge.
                                        </p>
                                        <img className='w-full h-auto rotate-6 mt-4' src="/VideoChat.png" alt="" />
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <div>
                                    <div className='flex flex-col py-2 border-b-2 border-white items-start gap-6 p-5'>
                                        <h3 className='flex w-full justify-center items-end gap-3 text-sm sm:text-base'>
                                            <Video size={22} /> | <span>Real Time Chat</span>
                                        </h3>
                                    </div>
                                    <div className='px-5 text-start'>
                                        <p className='pt-5 text-sm sm:text-base'>
                                            Personalized learning paths and skill suggestions based on your interests, career goals, and market trends.
                                        </p>
                                        <img className='w-full h-auto mt-4' src="/RealTimeChat.png" alt="" />
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <div>
                                    <div className='flex flex-col py-2 border-b-2 border-white items-start gap-6 p-5'>
                                        <h3 className='flex w-full justify-center items-end gap-3 text-sm sm:text-base'>
                                            <Gamepad2 size={22} /> | <span>Gamifying The Process</span>
                                        </h3>
                                    </div>
                                    <div className='px-5 text-start'>
                                        <p className='pt-5 text-sm sm:text-base'>
                                            Earn points, unlock badges, and level up as you learn. Track progress with engaging achievements and leaderboards.
                                        </p>
                                        <img className='w-full h-auto mt-4' src="/GamifyFeature.png" alt="" />
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <div>
                                    <div className='flex flex-col py-2 border-b-2 border-white items-start gap-6 p-5'>
                                        <h3 className='flex w-full justify-center items-end gap-3 text-sm sm:text-base'>
                                            <NotebookPen size={22} /> | <span>Revisit what You Learned</span>
                                        </h3>
                                    </div>
                                    <div className='px-5 flex flex-col text-start'>
                                        <p className='pt-5 text-sm sm:text-base'>
                                            Notes can be saved during the session these notes can be later accessed through our “saved notes” section , helping to learn more efficiently and making the process more smooth.
                                        </p>
                                        <img className='w-full h-auto mt-4' src="/notesFeature.png" alt="" />
                                    </div>
                                </div>
                            </Card>

                        </CardSwap>
                    </div>
                </div>

            </div>
        </div>
    )
}