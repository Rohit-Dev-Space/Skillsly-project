import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './Context/UserContext';


const CallToAction = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);


    const ROCKET_URL = "/rocket.png";
    const CLOUD_URL = "/cloud1.png";
    const PAPER_URL = "/notepaper.png";
    const PINTACK_URL = "/pin.png";
    const R_URL = "https://placehold.co/30x30/000000/FFFFFF?text=R";

    return (
        <div className="h-screen w-full pt-5 bg-black text-white overflow-hidden font-inter relative">

            {/* Custom Keyframes for Animations */}
            <style jsx="true">{`
                @keyframes cloudMove {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes rocketFly {
                    0% { transform: translate(0, 0) rotate(-15deg); }
                    25% { transform: translate(10px, -15px) rotate(-10deg); }
                    50% { transform: translate(-10px, -30px) rotate(-15deg); }
                    75% { transform: translate(5px, -40px) rotate(-10deg); }
                    100% { transform: translate(0, 0) rotate(-15deg); }
                }

                .animate-cloud {
                    animation: cloudMove 4s ease-in-out infinite;
                }
                .animate-rocket-fly {
                    animation: rocketFly 6s ease-in-out infinite;
                }
                
                /* Gradient Glow for background */
                .gradient-glow-bl {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(63, 255, 128, 0.4) 0%, transparent 70%);
                    opacity: 0.2;
                    filter: blur(80px);
                }
            `}</style>

            {/* Background Glow */}
            <div className="gradient-glow-bl"></div>

            {/* Main Content Grid */}
            <div className="container mx-auto px-6 -mt-10 lg:py-24 grid lg:grid-cols-2 items-center">

                {/* === LEFT COLUMN: Text and Buttons === */}
                <div className="relative z-10 space-y-8">

                    {/* Sticky Note / Paper Graphic */}
                    <div className="relative -mt-10 w-full h-auto">
                        <img
                            src={PAPER_URL}
                            alt="Note paper background"
                            className="w-[700px] -ml-5 h-auto object-contain"
                            style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))' }}
                            onError={(e) => e.target.src = 'https://placehold.co/400x300/F4F4F4/000000?text=Paper+Note'}
                        />

                        {/* Pin Tack */}
                        <img
                            src={PINTACK_URL}
                            alt="Pin tack"
                            className="absolute ml-35 -mt-108 object-contain"
                            onError={(e) => e.target.src = 'https://placehold.co/30x30/33A852/FFFFFF?text=P'}
                        />

                        {/* Text (Connect Collaborate Cultivate) - Positioned over paper */}
                        <div className="absolute ml-10 inset-0 p-8 pt-10 flex flex-col justify-start items-start">
                            <h1 className="text-5xl md:text-7xl font-extrabold leading-none tracking-tight ml-5 mt-15"
                                style={{
                                    lineHeight: '0.9', // Adjust line height to match image tight spacing
                                    background: 'linear-gradient(to bottom, #38CC85, #85F2C8)', // Gradient colors
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                Connect<br />Collaborate<br />Cultivate
                            </h1>
                        </div>
                    </div>
                    <div className='w-full ml-25 -mt-10 gap-10 flex flex-col items-start'>
                        {/* Description Text */}
                        <p className="text-white font-light max-w-lg -ml-8">
                            Connect with learners like you, collaborate to share skills, and cultivate new knowledge every session. With SkillSly, growth isn't a solo journey — it's a community effort. Join today and start building skills together.
                        </p>
                        <div className='w-full flex -ml-5 gap-10'>
                            {user ? (
                                <button onClick={() => navigate('/dashboard')} className="w-2/5 pointer-cursor px-8 py-3 bg-green-500 hover:bg-[#B8FB70] text-white hover:text-black font-bold rounded-lg transition-colors shadow-lg">
                                    Go to Dashboard
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => navigate('/Authenticate')} className="w-1/4 px-8 pointer-cursor py-3 bg-green-500 hover:bg-[#B8FB70] text-white hover:text-black font-bold rounded-lg transition-colors shadow-lg">
                                        Register
                                    </button>
                                    <button onClick={() => navigate('/Authenticate')} className="w-1/4 px-8 pointer-cursor py-3 bg-green-500 hover:bg-[#B8FB70] text-white hover:text-black font-bold rounded-lg transition-colors shadow-lg">
                                        Sign In
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">

                    </div>
                </div>

                {/* === RIGHT COLUMN: Rocket and Clouds Animation === */}
                <div className="relative flex justify-center items-center ml-30 scale-110 h-full min-h-[400px]">

                    {/* Cloud 1 (Top Right) */}
                    <img
                        src={CLOUD_URL}
                        alt="Cloud"
                        className="absolute w-64 z-20 h-auto bottom-40 left-65 right-0 animate-cloud"
                        style={{ animationDelay: '0s', opacity: 0.9 }}
                        onError={(e) => e.target.src = 'https://placehold.co/300x200/FFFFFF/000000?text=Cloud'}
                    />

                    {/* Cloud 2 (Middle Left) */}
                    <img
                        src={CLOUD_URL}
                        alt="Cloud"
                        className="absolute w-64  h-auto top-5 left-10 animate-cloud"
                        style={{ animationDelay: '2s', opacity: 0.9 }}
                        onError={(e) => e.target.src = 'https://placehold.co/300x200/FFFFFF/000000?text=Cloud'}
                    />

                    {/* Rocket Image with Flying Animation */}
                    <div className="absolute z-10" style={{ transform: 'rotate(-15deg)' }}>
                        <img
                            src={ROCKET_URL}
                            alt="3D Rocket"
                            className="w-[90%]  h-[50%] animate-rocket-fly rotate-24"
                            onError={(e) => e.target.src = 'https://placehold.co/400x400/FF5733/FFFFFF?text=Rocket'}
                        />
                    </div>


                </div>
            </div>
            <div className="bg-[#4DDCB7] blur-2xl rounded-full z-10 w-96 h-92 -mt-60 -mb-50 ml-[80%]"></div>
        </div>
    );
};

export default CallToAction;
