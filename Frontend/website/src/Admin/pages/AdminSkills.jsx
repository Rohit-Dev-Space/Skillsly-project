import { Trash2 } from 'lucide-react';
import axiosinstance from '../../Utilities/axiosIntance';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

const AdminSkills = () => {

  const [userRequests, setUserRequests] = useState([]);

  // Skill category state (existing)
  const [title, setTitle] = useState('');
  const [iconBg, setIconBg] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [skillError, setSkillError] = useState('');
  const [badgeError, setBadgeError] = useState('');

  // Badge creation state (new but minimal)
  const [badgeType, setBadgeType] = useState('');
  const [badgeTitle, setBadgeTitle] = useState('');
  const [badgeSkill, setBadgeSkill] = useState('');
  const [badgeDescription, setBadgeDescription] = useState('');

  // Progressive badge levels
  const [levels, setLevels] = useState({
    level3: { icon: '', rating: '', reviews: '' },
    level2: { icon: '', rating: '', reviews: '' },
    guru: { icon: '', rating: '', reviews: '' }
  });

  // Achievement badge
  const [achievementIcon, setAchievementIcon] = useState('');
  const [achievementCondition, setAchievementCondition] = useState('');
  const [achievementCount, setAchievementCount] = useState('');

  const handleGetUserRequest = async () => {
    const response = await axiosinstance.get('/Admin/user-requests');
    if (response) setUserRequests(response.data);
  };

  useEffect(() => {
    handleGetUserRequest();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();

    if (!title || !iconBg || !iconUrl) {
      setError("All Feilds Are Required");
      return;
    }

    const response = await axiosinstance.post('/Admin/add-skill', {
      title,
      iconBg,
      iconUrl
    });

    if (response) {
      toast.success('Skill Category Added Succesfully');
      setTitle('');
      setIconBg('');
      setIconUrl('');
      setSkillError('');
    }
  };

  const handleCreateBadge = async (e) => {
    e.preventDefault();
    let payload = {};

    if (badgeType === 'Progressive') {
      if (!badgeSkill || !badgeDescription || !levels) {
        setBadgeError('Must Fill All the Fields')
        return
      }
      payload = {
        skill: badgeSkill,
        type: "SKILL",
        description: badgeDescription,
        levels: [
          {
            name: "Efficiency III",
            minAvgRating: Number(levels.level3.rating),
            minReviews: Number(levels.level3.reviews),
            iconUrl: levels.level3.icon
          },
          {
            name: "Efficiency II",
            minAvgRating: Number(levels.level2.rating),
            minReviews: Number(levels.level2.reviews),
            iconUrl: levels.level2.icon
          },
          {
            name: "Guru",
            minAvgRating: Number(levels.guru.rating),
            minReviews: Number(levels.guru.reviews),
            iconUrl: levels.guru.icon
          }
        ]
      };
    }

    if (badgeType === 'Non-skill') {
      if (!badgeTitle || !badgeDescription || !achievementIcon || !achievementCondition || !achievementCount) {
        setBadgeError('Must Fill All the Fields')
        return
      }
      payload = {
        title: badgeTitle,
        type: "ACHIEVEMENT",
        description: badgeDescription,
        iconUrl: achievementIcon,
        condition: achievementCondition,
        count: achievementCount
      };
    }

    const response = await axiosinstance.post('/Admin/create-badge', payload)

    if (response) {
      setBadgeType('')
      setBadgeTitle('');
      setBadgeSkill('');
      setLevels({
        level3: { icon: '', rating: '', reviews: '' },
        level2: { icon: '', rating: '', reviews: '' },
        guru: { icon: '', rating: '', reviews: '' }
      });
      setBadgeDescription('');
      setAchievementIcon('');
      setAchievementCondition('');
      setAchievementCount('');

      toast.success('Badge Created Successfully')
    }
  };

  return (
    <div className='flex flex-col gap-20'>
      <Toaster position='top-center' />

      <div className="-mt-15 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT: REQUESTS */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-teal-400">User Requested Skills</h3>
          <div className="space-y-2 bg-black border border-gray-800 p-4 rounded-xl h-full overflow-y-auto">
            {userRequests.map((skill, i) => (
              <div key={i} className="bg-gray-700/20 p-4 m-4 rounded-lg border border-gray-800 flex justify-between items-center">
                <span><i>{skill.title}</i></span>
                <button className='hover:bg-red-400/20 rounded-full p-3 cursor-pointer'>
                  <Trash2 size={18} className='text-red-400' />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: ADD BADGE */}
        <div className='space-y-4'>
          <h3 className="text-xl font-semibold text-teal-400">Add New badge</h3>
          <div className="bg-black p-8 rounded-2xl border border-gray-800 h-full">
            <form className="space-y-10" onSubmit={handleCreateBadge}>

              <label className='mr-4 bg-black text-white'>Select the badge type :</label>
              <select
                value={badgeType}
                onChange={(e) => setBadgeType(e.target.value)}
                className='outline-1 outline-white p-2 rounded-lg'
              >
                <option className='bg-black text-white' value="">Select</option>
                <option className='bg-black text-white' value="Progressive">Progressive Badge</option>
                <option className='bg-black text-white' value="Non-skill">Non-skill Badge</option>
              </select>

              {badgeType === 'Progressive' && (
                <div className='flex flex-col gap-3'>
                  <input
                    value={badgeSkill}
                    onChange={(e) => setBadgeSkill(e.target.value)}
                    placeholder='Skill Name'
                    className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                  />
                  <input
                    value={badgeDescription}
                    onChange={(e) => setBadgeDescription(e.target.value)}
                    placeholder='Badge Description'
                    className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                  />

                  {["level3", "level2", "guru"].map((lvl, i) => (
                    <div key={lvl} className='flex gap-3'>
                      <input
                        placeholder='Image Link'
                        className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                        onChange={(e) =>
                          setLevels({ ...levels, [lvl]: { ...levels[lvl], icon: e.target.value } })
                        }
                      />
                      <input
                        placeholder='Min Rating'
                        className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                        onChange={(e) =>
                          setLevels({ ...levels, [lvl]: { ...levels[lvl], rating: e.target.value } })
                        }
                      />
                      <input
                        placeholder='Min Reviews'
                        className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                        onChange={(e) =>
                          setLevels({ ...levels, [lvl]: { ...levels[lvl], reviews: e.target.value } })
                        }
                      />
                    </div>
                  ))}
                </div>
              )}

              {badgeType === 'Non-skill' && (
                <div className='flex flex-col gap-4'>
                  <input
                    value={badgeTitle}
                    onChange={(e) => setBadgeTitle(e.target.value)}
                    type="text"
                    placeholder='Badge Name'
                    className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3 outline-none focus:border-teal-500"
                  />
                  <input
                    value={badgeDescription}
                    onChange={(e) => setBadgeDescription(e.target.value)}
                    placeholder='Badge Description'
                    className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                  />
                  <input
                    value={achievementIcon}
                    placeholder='Badge Image Link'
                    className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                    onChange={(e) => setAchievementIcon(e.target.value)}
                  />
                  <input
                    value={achievementCondition}
                    placeholder='Achievement Condition (e.g groups_created)'
                    className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                    onChange={(e) => setAchievementCondition(e.target.value)}
                  />
                  <input
                    value={achievementCount}
                    placeholder='Minimum Count'
                    className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                    onChange={(e) => setAchievementCount(e.target.value)}
                  />
                </div>
              )}
              {badgeError && <p className='text-red-400'>{badgeError}</p>}
              <button
                disabled={badgeType === '' ? true : false}
                type="submit"
                className={`w-full py-3 ${badgeType === '' ? 'bg-teal-800 cursor-not-allowed' : 'bg-teal-600 cursor-pointer'}  rounded-lg font-bold mt-4 hover:bg-teal-700 transition`}
              >
                Add Badge
              </button>

            </form>
          </div>
        </div>
      </div>

      {/* EXISTING SKILL CATEGORY FORM */}
      <div className='space-y-4'>
        <h3 className="text-xl font-semibold text-teal-400">Add New Skill Category</h3>
        <div className="bg-black p-8 rounded-2xl border border-gray-800 h-full">
          <form className="space-y-10" onSubmit={handleAddSkill}>
            <div className='flex gap-10'>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Skill Name'
                className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
              />
              <input
                value={iconBg}
                onChange={(e) => setIconBg(e.target.value)}
                placeholder='Icon background'
                className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
              />
            </div>
            <input
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder='Icon URL'
              className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
            />
            {skillError && <p className='text-red-400'>{skillError}</p>}
            <button className="w-full py-3 bg-teal-600 rounded-lg font-bold hover:bg-teal-700">
              Add Skill Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSkills;
