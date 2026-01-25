import { useEffect, useState } from 'react';
import { BellRing, Search, X, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../Context/UserContext'
import Modal from '../../Utilities/Modal';
import axiosinstance from '../../Utilities/axiosIntance';

const SearchSkills = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [skillCategories, setSkillCategories] = useState([]);
  const [reccomendedSkills, setReccomendedSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState('');

  const handleGetSkillCategories = async () => {
    const response = await axiosinstance.get('http://localhost:5000/skills/GetSkillCategories');
    if (!response) {
      console.error("Error fetching user data:", error);
    } else {
      setSkillCategories(response.data.data);
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 23) return "Good Evening";
  };

  const searching = (e) => {
    setSkillSearch(e.target.value)
    document.getElementById('skillcategories').scrollIntoView({ behavior: 'smooth' })
  }

  const handleSkillClick = (category) => {
    console.log(category.title)
    const slug = category.title
      .toLowerCase()
      .replace(/\s+/g, '-');
    navigate(`/dashboard/ranking/${slug}`);
  };

  const { user } = useContext(UserContext);

  const userCaps = user?.name.charAt(0).toUpperCase() + user?.name.slice(1);
  const topFourSkills = (user?.skillsWantToKnow ?? []).slice(0, 4);

  const handleGetRecommendedSkill = async () => {
    console.log("Sending skills:", topFourSkills);
    const response = await axiosinstance.post('http://localhost:5000/skills/getReccomendedSkills', {
      skills: topFourSkills
    });
    if (!response) {
      console.error("Error fetching user data:", error);
    } else {
      console.log(response.data.data)
      setReccomendedSkills(response.data.data);
    }
  }

  useEffect(() => {
    if (topFourSkills.length > 0) {
      handleGetRecommendedSkill();
    }
  }, [user])

  useEffect(() => {
    handleGetSkillCategories();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      if (!skillSearch.trim()) {
        setSkillCategories([]);
        return;
      }

      try {
        const res = await axiosinstance.get(
          `http://localhost:5000/skills/searchSkill?q=${skillSearch}`
        );
        setSkillCategories(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSkills();

    if (!skillSearch) {
      handleGetSkillCategories();
    }
  }, [skillSearch])

  return (
    <div className="p-6 md:p-15 md:px-20 w-full h-full bg-[#0a0a0a]">
      <div className=" fixed w-full max-w-lg z-40">
        <input
          type="text"
          placeholder="Search Skill category ..."
          className="w-full bg-black border border-gray-700 text-white py-3 pl-5 pr-12 rounded-full outline-none focus:border-teal-500"
          value={skillSearch}
          onChange={searching}
        />
        {skillSearch && <X onClick={() => setSkillSearch('')} className='absolute right-16 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 hover:text-red-400 cursor-pointer' />}
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 hover:text-teal-500 cursor-pointer" />
      </div>
      <div className="flex justify-end items-center mb-10">
        <button className='border border-white rounded-xl text-white p-3 cursor-pointer' onClick={() => setIsOpen(true)}><BellRing /></button>
      </div>
      <div className='flex flex-col gap-7'>
        <div className='flex flex-col'>
          <h1 className="text-3xl md:text-5xl font-light text-white mb-3">{getGreeting()},</h1>
          <p className='text-white font-light text-4xl -mt-2'>{userCaps} !</p>
        </div>
        <p className="w-2/4 font-poppins font-light text-gray-300 text-lg">Welcome to our website! Search for skills you want to learn and help others to skill up.</p>
        <h2 className="text-xl md:text-3xl font-medium text-teal-200 mb-6">Top Recommendation</h2>
      </div>

      <div className="flex flex-wrap gap-8 z-10">
        {reccomendedSkills.map((skill) => (
          <div
            key={skill._id}
            onClick={() => handleSkillClick(skill)}
            className="flex flex-col items-center text-center p-3 cursor-pointer group transition-all"
          >
            <div className={`w-fit min-w-52 h-fit min-h-42 max-w-42 bg-slate-200 rounded-2xl mb-3 flex flex-col items-center justify-center p-3 shadow-lg group-hover:scale-105 group-hover:translate-y-2 transition-transform duration-300`}>
              <div>

              </div>
              <img
                src={skill.iconUrl}
                alt={skill.title}
                className="w-full min-w-[184px] min-h-[184px] h-full object-contain rounded-2xl"
                style={{ backgroundColor: skill.iconBg }}
              />              <p className="text-sm text-center font-medium text-black group-hover:text-teal-700 mt-2">{skill.title}</p>
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-xl md:text-3xl bg-[#0a0a0a] font-medium text-teal-200 mb-6" id='skillcategories'>{skillSearch ? <p className='w-full flex gap-2 items-center'>Search Results <Search size={35} className='text-teal-200' /></p> : "Skill Categories"}</h2>
      <div className='flex flex-wrap bg-[#0a0a0a] gap-5 mt-10 z-10'>
        {skillCategories && (
          skillCategories.map((category) => (
            <div
              key={category._id}
              onClick={() => handleSkillClick(category)}
              className="flex flex-col items-center text-center p-3 cursor-pointer group transition-all"
            >
              <div className="w-fit min-w-52 min-h-42 bg-slate-200 rounded-2xl mb-3 flex flex-col items-center justify-center p-3 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <img
                  src={category.iconUrl}
                  alt={category.title}
                  className="w-[184px] h-[184px] object-contain rounded-2xl"
                  style={{ backgroundColor: category.iconBg }}
                />
                <p className="text-sm font-medium text-black group-hover:text-teal-700 mt-2">
                  {category.title}
                </p>
              </div>
            </div>
          ))
        )}

        {skillCategories.length <= 0 && (
          <div className='w-full h-full mx-auto py-10'>
            <h1 className='text-white'>No skill Categories found</h1>
          </div>
        )}
      </div>
      {isOpen && <Modal isOpen={isOpen} type={'notification'} title='Notifications' data={user?.notifications ? user.notifications : "Notifications Coming Soon!"} isClose={() => setIsOpen(false)} className='' />}
    </div>
  );
};

export default SearchSkills;