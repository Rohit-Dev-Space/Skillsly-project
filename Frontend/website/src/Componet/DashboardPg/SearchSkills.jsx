import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const skillRecommendations = [
  { title: "Python Language", id: "python", iconBg: "bg-blue-600", iconUrl: "https://placehold.co/60x60/1E40AF/ffffff?text=P" },
  { title: "Figma Basics", id: "figma", iconBg: "bg-fuchsia-600", iconUrl: "https://placehold.co/60x60/9D174D/ffffff?text=F" },
  { title: "Guitar Lessons", id: "guitar", iconBg: "bg-lime-500", iconUrl: "https://placehold.co/60x60/84CC16/000000?text=G" },
];

const SearchSkills = () => {
  const navigate = useNavigate();

  const handleSkillClick = (category) => {
    // Navigating to the absolute path ensures it hits the Ranking route
    navigate(`/dashboard/ranking/${category}`);
  

  };

  return (
    <div className="p-6 md:p-10 w-full h-full bg-[#0a0a0a]">
      <div className="flex justify-between items-center mb-10">
        <div className="relative w-full max-w-lg">
          <input 
            type="text" 
            placeholder="Search Skill category ..." 
            className="w-full bg-black border border-gray-700 text-white py-3 pl-5 pr-12 rounded-full outline-none focus:border-teal-500" 
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
      </div>

      <h1 className="text-3xl md:text-5xl font-light text-white mb-3">Good Morning!</h1>
      <h2 className="text-xl md:text-2xl font-medium text-teal-400 mb-6">Top Recommendation</h2>
      
      <div className="flex flex-wrap gap-8">
        {skillRecommendations.map((skill) => (
          <div 
            key={skill.id}
            onClick={() => handleSkillClick(skill.id)}
            className="flex flex-col items-center text-center p-3 cursor-pointer group transition-all"
          >
            <div className={`w-20 h-20 rounded-2xl mb-3 flex items-center justify-center p-3 ${skill.iconBg} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
              <img src={skill.iconUrl} alt={skill.title} className="w-full h-full object-contain" />
            </div>
            <p className="text-sm font-medium text-white group-hover:text-teal-400">{skill.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSkills;