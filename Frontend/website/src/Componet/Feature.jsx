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
        <div className="w-full h-full bg-gradient-to-b from-[#292524] to-[#000000] overflow-hidden pt-20 pb-40 text-center">
            <div className="bg-[#4DDCB7] blur-3xl rounded-full ml-[78%] -mt-30 z-10 w-96 h-92 gap-10 "></div>
            <div className='flex items-center -mt-60 py-10 mx-10'>
                <div className="flex flex-col items-start text-center">
                    <div className='w-2/3 -ml-4 flex flex-col items-center gap-10'>
                        <h1 className="text-5xl text-white font-semibold">
                            Why Use
                            <span className="bg-gradient-to-t from-[#4DDCB7] to-[#B8FB70] pl-3 bg-clip-text text-transparent">
                                Skillsly ?
                            </span>
                        </h1>
                        <p className="text-sm w-6/8 text-white font-light">SkillSly is more than just a learning platform — it’s a peer-to-peer ecosystem where skills are exchanged, not just consumed. Instead of one-way courses, SkillSly connects learners and mentors directly, allowing users to teach what they know and learn what they need in real time.</p>
                    </div>

                    <div className='w-5/8 text-white flex justify-center gap-35 items-center text-5xl mt-30'>
                        <div className='flex flex-col items-center justify-center'>
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
                            <h2 className='text-slate-400 text-lg'>Customer <br /> Satisfication</h2>
                        </div>
                        <div className='flex flex-col items-center justify-center'>
                            <div>
                                <CountUp
                                    from={0}
                                    to={20}
                                    separator=","
                                    direction="up"
                                    duration={1}
                                    className="count-up-text"
                                />+
                            </div>
                            <h2 className='text-slate-400 text-lg pt-2'>Registered <br />Users</h2>
                        </div>
                        <div className='flex flex-col items-center justify-center'>
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
                            <h2 className='text-slate-400 text-lg'>Skill <br />Categories</h2>
                        </div>
                    </div>
                </div>
                <div style={{ color: 'white', height: '400px', position: 'relative' }}>
                    <CardSwap
                        cardDistance={60}
                        verticalDistance={70}
                        delay={2000}
                        pauseOnHover={true}
                        easing='linear'
                        skewAmount={6}
                    >
                        <Card>
                            <div className='bg- flex flex-col gap-5'>
                                <div className='flex flex-col py-2 border-b-2 border-white items-start gap-10 p-5'>
                                    <h3 className='flex w-full justify-center items-end gap-5'><Video size={25} className='ml-2' />| <span className=''>Video Chat To Connect</span></h3>
                                </div>
                                <div className='px-5 w-2/3 text-start'>
                                    <p>Video chat provides Users with a medium to connect with other Users and can eases the process of swapping knowledge.</p>
                                    <img className='w-full h-auto rotate-6 ml-10 -mt-5' src="/VideoChat.png" alt="" />
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className=''>
                                <div className='flex flex-col py-2 border-b-2 border-white items-start gap-10 p-5'>
                                    <h3 className='flex w-full justify-center items-end gap-5'><Video size={25} className='ml-2' />| <span className=''>Real Time Chat</span></h3>
                                </div>
                                <div className='px-5 w-full text-start'>
                                    <p className='pt-5'>Personalized learning paths and skill suggestions based on your interests, career goals, and market trends.</p>
                                    <img className='scale-80 -mt-10' src="/RealTimeChat.png" alt="" />
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className='bg-'>
                                <div className='flex flex-col py-2 border-b-2 border-white items-start gap-10 p-5'>
                                    <h3 className='flex w-full justify-center items-end gap-5'><Gamepad2 size={25} className='ml-2' />| <span className=''>Gamifying The Process</span></h3>
                                </div>
                                <div className='px-5 w-full justify-between text-start'>
                                    <p className='pt-5'>Earn points, unlock badges, and level up as you learn. Track progress with engaging achievements and leaderboards.</p>
                                    <img className='-mt-50 scale-70' src="/GamifyFeature.png" alt="" />
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className='bg-'>
                                <div className='flex flex-col py-2 border-b-2 border-white items-start gap-10 p-5'>
                                    <h3 className='flex w-full justify-center items-end gap-5'><NotebookPen size={25} className='ml-2' />| <span className=''>Revisit what You Learned</span></h3>
                                </div>
                                <div className='px-5 w-full flex flex-col justify-between text-start'>
                                    <p className='pt-10'>Notes can be saved during the session these notes can be later accessed through our “saved notes” section , helping to learn more efficiently and making the process more smooth.</p>
                                    <img className='scale-40 -mt-60' src="/notesFeature.png" alt="" />
                                </div>
                            </div>
                        </Card>
                    </CardSwap>
                </div>
            </div>
        </div >
    )
}