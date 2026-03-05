import { Carousel, CarouselContent, CarouselItem } from "../../components/ui/carousel";
import { Award, PenBox, Save, User, X } from "lucide-react";
import { UserContext } from "../Context/UserContext";
import { useContext, useEffect, useState } from "react";
import axiosinstance from "../../Utilities/axiosIntance";
import Modal from "../../Utilities/Modal";
import Inputs from "../Inputs/Inputs";
import { toast, Toaster } from "sonner";

export default function Profile({ userData = '' }) {

    const { user, updateUser } = useContext(UserContext)
    const profileUser = userData ? userData : user;
    const editAvailable = profileUser?._id === user?._id;
    const [editDescription, setEditDescription] = useState(false)
    const [editLink, setEditLink] = useState(false)
    const [description, setDescription] = useState(profileUser?.bio)
    const [editModal, setEditModal] = useState(false)
    const [skillsKnown, setSkillsKnown] = useState([]);
    const [skillWantToKnow, setSkillWantToKnow] = useState([])
    const [skillsList, setSkillsList] = useState([]);
    const [url, setUrl] = useState(profileUser?.socialLink)
    const [languageKnown, setLanguageKnown] = useState([])
    const [Badges, setBadges] = useState([]);

    const languages = ["English", "Hindi", "French", "Spanish", "Marathi", "Kannada", "Tamil", "Telugu", "Malyali"]

    const handleEditDesciption = async () => {
        const response = await axiosinstance.post('/edit/update-description', { text: description })
        if (response) {
            setEditDescription(false);
        }
    }

    const handleGetSkillList = async () => {
        const response = await axiosinstance.get('/skills/get-skillList')
        if (response) {
            setSkillsList(response.data.map(item => item.title));
        }
    }

    const toggleSkill = (skill) => {
        if (skillsKnown.includes(skill)) {
            setSkillsKnown(skillsKnown.filter(s => s !== skill));
        } else {
            setSkillsKnown([...skillsKnown, skill]);
        }
    };

    const toggleSkillWantToKnow = (skill) => {
        setSkillWantToKnow(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    const toggleLanguageKnow = (lang) => {
        setLanguageKnown(prev =>
            prev.includes(lang)
                ? prev.filter(s => s !== lang)
                : [...prev, lang]
        );
    };

    const handleEditLink = async () => {
        const response = await axiosinstance.post('/edit/update-socialLink', { link: url });
        if (response) {
            setEditLink(false);
        }
    }

    const handleEditIterables = async () => {
        const response = await axiosinstance.post('/edit/update-iterables', { skillsKnow: skillsKnown, skillsWantToKnow: skillWantToKnow, languages: languageKnown })
        if (response) {
            updateUser({
                ...user,
                skillsKnow: skillsKnown,
                skillsWantToKnow: skillWantToKnow,
                languages: languageKnown
            });

            setEditModal(false);
            toast.success('Updated Successfully');
        }
    }

    const handleGetBadges = async (userId) => {
        const response = await axiosinstance.get(`/edit/user-badges?userId=${userId}`);
        if (response) {
            setBadges(response.data);
        }
    };

    useEffect(() => {
        handleGetBadges(profileUser?._id);
    }, [profileUser?._id]);

    useEffect(() => {
        handleGetSkillList();
    }, [editModal])

    useEffect(() => {
        if (editModal) {
            setSkillsKnown(profileUser?.skillsKnow || []);
            setSkillWantToKnow(profileUser?.skillsWantToKnow || []);
            setLanguageKnown(profileUser?.languages || []);
        }
    }, [editModal]);


    return (
        <section className="w-full h-full bg-black flex pt-5 px-10 flex-col">
            <Toaster position="top-center" />
            <div className="p-6 md:p-10 w-full h-full">
                <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-15 mb-12">

                    <div className="flex flex-col items-center md:items-center min-w-[150px]">
                        <div className="relative w-32 h-32 rounded-full border-2 border-gray-700 overflow-hidden bg-gray-700 mb-6">
                            <img src={profileUser?.profileImageUrl} className="object-cover  w-full h-full text-white" />
                        </div>

                        <div className="flex flex-wrap gap-2 w-full max-w-[150px]">
                            {profileUser?.skillsKnow?.map((skill, index) => (
                                <span
                                    key={index}
                                    className={`text-xs text-center font-medium text-white bg-[#1a1a1a] py-2 px-3 rounded-md border border-gray-700
        ${profileUser.skillsKnow.length === 1 || 3 ? "col-span-2 mx-auto" : ""}`}                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex-grow text-white">
                        <h1 className="w-full flex justify-between text-3xl font-semibold text-white mb-4">{profileUser?.userName}{editAvailable && <PenBox onClick={() => setEditModal(true)} size={30} className="cursor-pointer" />}</h1>
                        <div className="flex gap-2 items-center">
                            <p className="text-xl font-light"><i>Description</i></p>
                            {editAvailable &&
                                <div>
                                    {!editDescription ?
                                        <button onClick={() => { setEditDescription(true) }} className="cursor-pointer">
                                            <PenBox size={16} />
                                        </button>
                                        :
                                        <div className="ml-3 flex gap-5">
                                            <button onClick={handleEditDesciption}> <Save size={16} /></button>
                                            <button className="cursor-pointer" onClick={() => setEditDescription(false)}> <X size={16} /></button>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                        {!editDescription ?
                            < p className="text-gray-400 leading-relaxed mb-6">
                                {profileUser?.bio || "User didnt care to add bio"}
                            </p> :
                            <textarea className="w-full h-25 p-2 border border-white rounded-xl my-2 text-white" value={description} onChange={(e) => setDescription(e.target.value)}>
                                {profileUser?.bio || "Add Your Description"}
                            </textarea>}
                        <div className="flex justify-start items-start gap-20">
                            <div className="flex flex-col w-1/2 flex-wrap">
                                <div className="flex flex-wrap w-full items-center gap-4 my-1">
                                    <p className="font-light text-lg">Skills Want To Learn :</p>
                                    {profileUser?.skillsWantToKnow?.map((lang, index) => (
                                        <p key={index} className=" bg-gray-400/20 py-1.5 px-4 flex items-center rounded-lg">{lang}</p>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-lg font-light">Languages Spoken </p>
                                    <div className="flex flex-wrap gap-2">
                                        {profileUser?.languages?.map((lang, index) => (
                                            <p key={index} className=" bg-gray-400/20 py-1.5 px-4 flex items-center rounded-lg">{lang}</p>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col -space-y-3 mt-4">
                                    <div className="flex gap-5 items-center">
                                        <span className="text-lg font-light">Social Link</span>
                                        {editAvailable &&
                                            <div>
                                                {!editLink ?
                                                    <button onClick={() => { setEditLink(true) }} className="cursor-pointer">
                                                        <PenBox size={16} />
                                                    </button>
                                                    :
                                                    <div className="ml-3 flex gap-5">
                                                        <button onClick={handleEditLink} className="hover:text-teal-300 cursor-pointer"> <Save size={16} /></button>
                                                        <button className="cursor-pointer hover:text-red-400" onClick={() => setEditLink(false)}> <X size={16} /></button>
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>
                                    {!editLink ? <a className={`text-sm cursor-${profileUser?.socialLink ? "pointer" : "none"} text-teal-400 my-4 truncate`} target="_blank" rel="noopener noreferrer" href={profileUser?.socialLink || ''}>{profileUser?.socialLink || "No social link provided"}</a> : <textarea type="url" value={url} onChange={(e) => { setUrl(e.target.value) }} placeholder="https://example.com" className="border border-white mt-3 rounded-lg px-3 text-teal-500" />}
                                </div>
                            </div>
                            <div className="-mt-10  w-1/2">
                                <div className="mt-10">
                                    <h2 className="text-xl font-light text-white mb-4 flex gap-1"><Award className='w-10 h-8' /> Badges</h2>
                                    {console.log(Badges)}
                                    {Badges.length > 0 ? (
                                        <div className="flex flex-wrap gap-4">
                                            {Badges.map((info, index) => {
                                                if (info.badgeId.type === "ACHIEVEMENT") {
                                                    return (
                                                        <div key={index} className="flex flex-col items-center gap-1" title={info.badgeId.description}>
                                                            <div className="w-14 h-14 rounded-full bg-gray-700 border-2 border-teal-400 overflow-hidden">
                                                                {info.badgeId.iconUrl ? (
                                                                    <img
                                                                        src={info.badgeId.iconUrl || "https://via.placeholder.com/50"}
                                                                        alt={info.badgeId.title}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-xs text-white">
                                                                        {info.badgeId.title}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-300 text-center">{info.badgeId.title}</p>
                                                        </div>
                                                    );
                                                } else {
                                                    const levelInfo = info.badgeId?.levels?.find(lvl => lvl.name === info.level);
                                                    return (
                                                        <div key={index} className="flex flex-col items-center gap-1" title={`${info.badgeId.skill} - ${info.level}`}>
                                                            <div className="w-14 h-14 rounded-full bg-gray-700 border-2 border-teal-400 overflow-hidden">
                                                                {levelInfo?.iconUrl ? (
                                                                    <img
                                                                        src={levelInfo.iconUrl}
                                                                        alt={info.level}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-xs text-white">
                                                                        {info.level}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-300 text-center">{info.level}</p>
                                                        </div>
                                                    );
                                                }
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-xl text-gray-400/40">No Badges Obtained</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-fit overflow-hidden py-10">
                    <Carousel>
                        <CarouselContent className="px-1 sm:px-5 cursor-pointer space-x-5 flex items-end">
                            {profileUser?.workImageUrl?.map((item, index) => (
                                <CarouselItem
                                    key={index}
                                    className="basis-[100%] sm:basis-2/5 transition-transform object-fill duration-300 ease-in-out"
                                >
                                    <img
                                        src={item}
                                        alt="Work Done"
                                        width={50}
                                        height={100}
                                        className="rounded-lg object-cover h-82 w-full"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
            {editModal && <Modal
                title={'Edit Profile'}
                isClose={() => setEditModal(false)}
            >
                <div className="flex flex-col p-5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col space-y-15 justify-between">
                        <div>
                            <input
                                type="hidden"
                                name="skillsKnown"
                                value={skillsKnown.join(",")}
                            />
                            <div className="flex flex-col gap-5 w-fit justify-center items-center">
                                <h2 className="text-sm pl-2">Select The Skills <span className="text-lg text-green-400">" YOU " </span> Know :</h2>
                                <div className="flex flex-wrap gap-3 w-3/4 h-23 text-white overflow-y-scroll">
                                    {skillsList.map((skill, index) => (
                                        <button
                                            type="button"
                                            key={index}
                                            onClick={() => toggleSkill(skill)}
                                            className={`px-4 py-2 rounded-full text-sm border transition
                                                ${skillsKnown.includes(skill)
                                                    ? "bg-green-500 border-green-500 text-black"
                                                    : "bg-transparent text-white border-gray-500 hover:border-green-400"
                                                }`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <input
                                type="hidden"
                                name="skillsKnown"
                                value={skillWantToKnow.join(",")}
                            />
                            <div className="flex flex-col gap-5 w-fit justify-center items-center">
                                <h2 className="text-sm pl-2">Select The Skills you<span className="text-lg text-green-400"> " WANT " </span>to Learn :</h2>
                                <div className="flex flex-wrap gap-3 w-3/4 h-23 text-white overflow-y-scroll">
                                    {skillsList.map(skill => (
                                        <button
                                            type="button"
                                            key={skill}
                                            onClick={() => toggleSkillWantToKnow(skill)}
                                            className={`px-4 py-2 rounded-full text-sm border transition
                                                ${skillWantToKnow.includes(skill)
                                                    ? "bg-green-500 border-green-500 text-black"
                                                    : "bg-transparent text-white border-gray-500 hover:border-green-400"
                                                }`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-center my-5 mt-10 items-center w-full">
                        <div className="flex flex-col gap-3 items-center justify-center w-full">
                            <p>Language You Know :</p>
                            <div className="flex flex-wrap gap-2 w-full justify-center">
                                {languages.map(lang => (
                                    <button
                                        type="button"
                                        key={lang}
                                        onClick={() => toggleLanguageKnow(lang)}
                                        className={`px-4 py-2 rounded-full text-sm border transition
                                                ${languageKnown.includes(lang)
                                                ? "bg-green-500 border-green-500 text-black"
                                                : "bg-transparent text-white border-gray-500 hover:border-green-400"
                                            }`}
                                    >
                                        {lang}
                                    </button>

                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center w-full justify-center">
                        <button onClick={handleEditIterables} className="flex gap-5 items-center justify-center cursor-pointer w-1/3 rounded-lg m-4 py-2 bg-teal-600 hover:bg-teal-500 text-white"><Save className="text-white" size={20} /> Save </button>
                    </div>
                </div>
            </Modal>}
        </section >
    )
}