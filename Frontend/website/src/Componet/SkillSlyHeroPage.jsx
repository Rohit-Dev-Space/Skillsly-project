import React, { useContext } from 'react';
import WorkFlow from '../Componet/WorkFlow';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './Context/UserContext';

const IMAGES = {
  characterOlder: '/Whiteman.png',
  characterYounger: '/BlueChadiBoy.png',
  paperAirplane: '/PaperRocket.png',

  greenBlob: '/HeroGreenBig.png',
  blueBlob: '/BlueBlob.png',
};

const SkillSlyHeroPage = () => {

  const navigate = useNavigate();
  const { user, clearUser } = useContext(UserContext)

  return (
    <div className="min-h-screen bg-[#292524] text-white p-4 overflow-hidden relative" id='heropg'>


      <header className="flex justify-between items-center py-4 px-6 md:px-12 relative z-50">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">SkillSly</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
          <a href="#heropg" className="hover:text-green-400 transition-colors">Home</a>
          <a href="#workflow" className="hover:text-green-400 transition-colors">How It Works</a>
          <a href="" className="hover:text-green-400 transition-colors">Find Peers</a>
          <a href="#FAQ" className="hover:text-green-400 transition-colors">FAQ</a>
          <a href="#footer" className="hover:text-green-400 transition-colors">Contact us</a>
        </nav>

        {/* Sign In Button */}
        {user ? (
          <div className='flex items-center gap-3'>
            <img src={user.profileImageUrl} alt="profile image" className='w-12 h-12 rounded-full object-cover border-2 border-white' />
            <div className='flex flex-col justify-center items-start'>
              <h1 className='text-xl font-bold'>{user.userName}</h1>
              <button onClick={clearUser} className='text-trasparent hover:text-red-500 text-sm cursor-pointer' style={{ WebkitTextStroke: "0.2px white" }}>Log out</button>
            </div>
          </div>
        ) : (
          <button className="px-6 py-2 border border-white text-white rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-colors" onClick={() => navigate('/authenticate')}>
            SIGN IN / LOGIN
          </button>
        )}
      </header>

      {/* -------------------- HERO SECTION CONTENT -------------------- */}
      <main className="relative flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 min-h-[calc(100vh-80px)]"> {/* Adjusted min-height for content */}

        {/* Left Side: Text and Buttons */}
        <div className="max-w-xl lg:w-1/2 mb-12 lg:mb-0 relative z-20">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Peer-to-Peer <br />
            Learning for <span className="text-green-400">Everyone.</span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg max-w-sm">
            Connect with peers worldwide to share knowledge, study together, and accelerate your learning through collaborative education
          </p>

          <div className="absolute top-[20%] left-[80%] md:left-[60%] lg:left-[calc(100%-80px)] transform -translate-y-1/2 z-10 w-24 h-24">
            <img
              src={IMAGES.paperAirplane}
              alt="Paper airplane"
              className="w-full h-full -rotate-6 scale-250 -ml-10 object-contain"
            />
          </div>

          <div className="flex space-x-4 mt-8">
            <button className="px-8 py-3 bg-green-500 hover:bg-[#B8FB70] text-white hover:text-black font-bold rounded-lg transition-colors shadow-lg" onClick={() => navigate('/authenticate')}>
              SIGN UP
            </button>
            <button className="px-8 py-3 border border-gray-400 hover:bg-[#B8FB70] text-white hover:text-black font-bold rounded-lg bg-transparent transition-colors" onClick={() => navigate('/dashboard')}>
              {user ? 'Get Started' : 'Explore Now'}
            </button>
          </div>
        </div>

        {/* Right Side: Illustration Images and Background Shapes */}
        <div className="relative lg:w-1/2 flex justify-center lg:justify-end min-h-[400px] lg:min-h-[600px] mt-10 lg:mt-0">

          {/* Background Blob Shapes */}
          {/* Green Blob */}
          <img
            src={IMAGES.greenBlob}
            alt="Decorative green background blob"
            className="absolute top-0 right-0 w-full lg:w-[600px] h-auto object-cover z-0"
            style={{
              transform: 'translateX(10%) translateY(-20%)', // Adjust position
              maxWidth: '800px', // Prevent it from getting too large
            }}
          />

          {/* Blue Blob */}
          <img
            src='/BlueBlob.png'
            alt="Decorative blue background blob"
            className="absolute bottom-0 right-0 w-full scale-50 lg:w-[600px] h-auto object-cover z-0"
            style={{
              transform: 'translateX(72%) translateY(90%)', // Adjust position
              maxWidth: '800px', // Prevent it from getting too large
            }}
          />

          {/* Character Illustrations Container */}
          <div className="relative z-10 w-full mt-10 scale-110 max-w-lg h-full flex justify-center items-end">

            {/* Older Character with Tablet */}
            <img
              src={IMAGES.characterOlder}
              alt="Older person learning with a tablet"
              className="absolute bottom-0 right-1/4 transform translate-x-1/2 w-[45%] md:w-[47%] h-auto object-contain top-2 left-10"
              style={{ minWidth: '180px', zIndex: 30 }}
            />

            {/* Younger Character with Phone */}
            <img
              src={IMAGES.characterYounger}
              alt="Younger person learning with a phone"
              className="absolute bottom-0 right-0 w-[40%] md:w-[45%] h-auto object-contain top-0"
              style={{ minWidth: '180px', zIndex: 40 }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SkillSlyHeroPage;