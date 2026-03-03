import { Trash2 } from 'lucide-react';
import axiosinstance from '../../Utilities/axiosIntance';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import MultiImageSelector from '../../Componet/MultiImageSelector';
import { uploadSkillImage, uploadBadgeImages } from '../../Componet/Inputs/UploadToSupabase';

const AdminSkills = () => {
  const [userRequests, setUserRequests] = useState([]);

  // Skill category state
  const [title, setTitle] = useState('');
  const [iconBg, setIconBg] = useState('#FFFFFF');
  const [iconUrl, setIconUrl] = useState([]);
  const [skillError, setSkillError] = useState('');
  const [Guru, setGuru] = useState([]);
  const [EfficiencyIII, setEfficiencyIII] = useState([]);
  const [EfficiencyII, setEfficiencyII] = useState([]);
  const [badgeError, setBadgeError] = useState('');
  const [skillCategories, setSkillCategories] = useState([]);

  // Badge creation state
  const [badgeType, setBadgeType] = useState('SELECT'); // badge type select
  const [badgeTitle, setBadgeTitle] = useState('');
  const [badgeSkill, setBadgeSkill] = useState('');
  const [badgeDescription, setBadgeDescription] = useState('');
  const [achievementCondition, setAchievementCondition] = useState('');
  const [achievementCount, setAchievementCount] = useState('');
  const [achievementIcon, setAchievementIcon] = useState([]);

  const mastery = [
    { name: 'Guru', state: Guru, setState: setGuru },
    { name: 'Efficiency II', state: EfficiencyII, setState: setEfficiencyII },
    { name: 'Efficiency III', state: EfficiencyIII, setState: setEfficiencyIII },
  ];

  const [levels, setLevels] = useState({
    EfficiencyIII: { icon: '', rating: '', reviews: '' },
    EfficiencyII: { icon: '', rating: '', reviews: '' },
    Guru: { icon: '', rating: '', reviews: '' }
  });

  const handleGetUserRequest = async () => {
    const response = await axiosinstance.get('/Admin/user-requests');
    if (response) setUserRequests(response.data);
  };

  const handleGetSkillCategories = async () => {
    const response = await axiosinstance.get('/skills/GetSkillCategories');
    if (response.data?.data) setSkillCategories(response.data.data);
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!title || !iconBg || iconUrl.length === 0) {
      setSkillError("All Fields Are Required");
      return;
    }
    const skillImage = await uploadSkillImage(iconUrl[0]?.file);
    const response = await axiosinstance.post('/Admin/add-skill', {
      title,
      iconBg,
      iconUrl: skillImage
    });
    if (response) {
      toast.success('Skill Category Added Successfully');
      setTitle('');
      setIconBg('#FFFFFF');
      setIconUrl([]);
      setSkillError('');
    }
  };

  const handleCreateBadge = async (e) => {
    e.preventDefault();
    let payload = {};

    if (badgeType === 'SELECT') {
      setBadgeError('Please select a badge type');
      return;
    }

    if (badgeType === 'SKILL') {
      if (!badgeSkill || !badgeDescription || !levels || !Guru.length || !EfficiencyII.length || !EfficiencyIII.length) {
        setBadgeError('All Skill Badge Fields Are Required');
        return;
      }

      const uploadedIcons = await uploadBadgeImages({ Guru, EfficiencyII, EfficiencyIII });

      payload = {
        skill: badgeSkill,
        type: "SKILL",
        description: badgeDescription,
        levels: [
          {
            name: "Efficiency III",
            minAvgRating: Number(levels.EfficiencyIII.rating),
            minReviews: Number(levels.EfficiencyIII.reviews),
            iconUrl: uploadedIcons.EfficiencyIII
          },
          {
            name: "Efficiency II",
            minAvgRating: Number(levels.EfficiencyII.rating),
            minReviews: Number(levels.EfficiencyII.reviews),
            iconUrl: uploadedIcons.EfficiencyII
          },
          {
            name: "Guru",
            minAvgRating: Number(levels.Guru.rating),
            minReviews: Number(levels.Guru.reviews),
            iconUrl: uploadedIcons.Guru
          }
        ]
      };
    } else if (badgeType === 'ACHIEVEMENT') {
      if (!badgeTitle || !badgeDescription || !achievementCondition || !achievementCount || achievementIcon.length === 0) {
        setBadgeError('All Achievement Badge Fields Are Required');
        return;
      }

      const iconUploaded = await uploadSkillImage(achievementIcon[0]?.file);

      payload = {
        title: badgeTitle,
        type: "ACHIEVEMENT",
        description: badgeDescription,
        condition: achievementCondition,
        count: Number(achievementCount),
        iconUrl: iconUploaded
      };
    }

    const response = await axiosinstance.post('/Admin/create-badge', payload);
    if (response) {
      toast.success('Badge Created Successfully');
      setBadgeTitle('');
      setBadgeSkill('');
      setLevels({
        EfficiencyIII: { icon: '', rating: '', reviews: '' },
        EfficiencyII: { icon: '', rating: '', reviews: '' },
        Guru: { icon: '', rating: '', reviews: '' }
      });
      setBadgeDescription('');
      setAchievementIcon([]);
      setAchievementCondition('');
      setAchievementCount('');
      setBadgeError('');
      setGuru([]);
      setEfficiencyII([]);
      setEfficiencyIII([]);
      setBadgeType('SELECT');
    }
  };

  useEffect(() => {
    handleGetUserRequest();
    handleGetSkillCategories();
  }, []);

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

        {/* RIGHT: ADD SKILL CATEGORY FORM */}
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
                <div className="flex items-center gap-4 w-full">
                  <input
                    type="color"
                    value={iconBg}
                    onChange={(e) => setIconBg(e.target.value)}
                    className="w-14 h-14 cursor-pointer border border-gray-700 bg-transparent"
                  />
                  <input
                    type="text"
                    value={iconBg}
                    readOnly
                    placeholder="#000000"
                    className="flex-1 bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                  />
                </div>
              </div>
              <p>Skill Category Image :</p>
              <div><MultiImageSelector images={iconUrl} setImages={setIconUrl} max={1} /></div>
              {skillError && <p className='text-red-400'>{skillError}</p>}
              <button className="w-full py-3 bg-teal-600 rounded-lg font-bold hover:bg-teal-700">
                Add Skill Category
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ADD BADGE SECTION */}
      <div className='space-y-4'>
        <h3 className="text-xl font-semibold text-teal-400">Add New Badge</h3>
        <div className="bg-black p-8 rounded-2xl border border-gray-800 h-full">
          <form className="space-y-10" onSubmit={handleCreateBadge}>
            <select
              value={badgeType}
              onChange={(e) => setBadgeType(e.target.value)}
              className='w-full h-10 border border-white rounded-xl bg-black px-5'
            >
              <option value="SELECT">Select Badge Type</option>
              <option value="SKILL">Skill</option>
              <option value="ACHIEVEMENT">Achievement</option>
            </select>

            {/* Skill Badge Form */}
            {badgeType === 'SKILL' && (
              <>
                <select
                  value={badgeSkill}
                  onChange={(e) => setBadgeSkill(e.target.value)}
                  className='w-full h-10 border border-white rounded-xl bg-black px-5'
                >
                  <option value="" disabled>Select a Skill</option>
                  {skillCategories.map((item, index) => (
                    <option key={index} value={item.title}>{item.title}</option>
                  ))}
                </select>
                <input
                  value={badgeDescription}
                  onChange={(e) => setBadgeDescription(e.target.value)}
                  placeholder='Badge Description'
                  className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                />
                {mastery.map((lvl, i) => (
                  <div key={i} className='flex flex-col gap-3 my-2'>
                    <p>Skill Level {lvl.name}</p>
                    <div className='flex gap-2 items-end'>
                      <MultiImageSelector images={lvl.state} setImages={lvl.setState} max={1} />
                      <input
                        placeholder='Min Rating'
                        className="w-full h-15 bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                        onChange={(e) =>
                          setLevels({ ...levels, [lvl.name.replace(" ", "")]: { ...levels[lvl.name.replace(" ", "")], rating: e.target.value } })
                        }
                      />
                      <input
                        placeholder='Min Reviews'
                        className="w-full h-15 bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                        onChange={(e) =>
                          setLevels({ ...levels, [lvl.name.replace(" ", "")]: { ...levels[lvl.name.replace(" ", "")], reviews: e.target.value } })
                        }
                      />
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Achievement Badge Form */}
            {badgeType === 'ACHIEVEMENT' && (
              <>
                <input
                  value={badgeTitle}
                  onChange={(e) => setBadgeTitle(e.target.value)}
                  placeholder='Badge Title'
                  className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                />
                <input
                  value={badgeDescription}
                  onChange={(e) => setBadgeDescription(e.target.value)}
                  placeholder='Badge Description'
                  className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                />
                <input
                  value={achievementCondition}
                  onChange={(e) => setAchievementCondition(e.target.value)}
                  placeholder='Condition'
                  className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                />
                <input
                  value={achievementCount}
                  onChange={(e) => setAchievementCount(e.target.value)}
                  placeholder='Count'
                  type="number"
                  className="w-full bg-gray-700/20 border border-gray-700 rounded-lg p-3"
                />
                <p>Achievement Icon:</p>
                <MultiImageSelector images={achievementIcon} setImages={setAchievementIcon} max={1} />
              </>
            )}

            {badgeError && <p className='text-red-400'>{badgeError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 cursor-pointer rounded-lg font-bold mt-4 hover:bg-teal-700 transition"
            >
              Add Badge
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSkills;