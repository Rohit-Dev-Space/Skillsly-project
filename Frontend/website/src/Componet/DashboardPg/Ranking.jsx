import React from 'react';
import { UserPlus, MessageSquare, Trophy } from 'lucide-react';

const rankingData = [
  { id: 1, name: "User1 Name", rank: 1, points: 1250, img: "" },
  { id: 2, name: "User2 Name", rank: 2, points: 1100, img: "" },
  { id: 3, name: "User3 Name", rank: 3, points: 950, img: "" },
  { id: 4, name: "User4 Name", rank: 4, points: 800, img: "" },
  { id: 5, name: "User5 Name", rank: 5, points: 750, img: "" },
  { id: 6, name: "User6 Name", rank: 6, points: 600, img: "" },
  { id: 7, name: "User7 Name", rank: 7, points: 550, img: "" },
  { id: 8, name: "User8 Name", rank: 8, points: 400, img: "" },
];

const Ranking = () => {
  const renderRankBadge = (rank) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400 fill-gray-400/20" />;
    if (rank === 3) return <Trophy className="w-5 h-5 text-orange-400 fill-orange-400/20" />;
    return <span className="text-gray-500 font-medium w-5 text-center">{rank}</span>;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-[#0a0a0a] min-h-screen text-white">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-100">Python language</h1>
        <h2 className="text-4xl font-bold text-white mt-1">Category</h2>
      </div>

      {/* Ranking List */}
      <div className="flex flex-col gap-3">
        {rankingData.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-[#111111] hover:bg-[#161616] border border-white/5 p-3 rounded-xl transition-all duration-200 group"
          >
            {/* Left side: Avatar and Name */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-400 flex-shrink-0">
                {user.img ? (
                  <img src={user.img} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-zinc-700 border border-white/10" />
                )}
              </div>
              <span className="text-gray-200 font-medium group-hover:text-white transition-colors">
                {user.name}
              </span>
            </div>

            {/* Right side: Rank and Actions */}
            <div className="flex items-center gap-8 md:gap-16 pr-4">
              {/* Rank Icon */}
              <div className="flex items-center justify-center min-w-[30px]">
                {renderRankBadge(user.rank)}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-6">
                <button className="text-gray-400 hover:text-teal-400 transition-colors">
                  <UserPlus className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-teal-400 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;



