import { useContext, useEffect, useState } from "react";
import Stepper, { Step } from "../../components/Stepper"
import ProfilePicSelector from "../ProfilePicSelector";
import Inputs from "../Inputs/Inputs";
import MultiImageSelector from "../MultiImageSelector";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import axiosinstance from "../../Utilities/axiosIntance";
import { uploadWorkImages } from "../Inputs/UploadToSupabase";
import Loader from "../../Utilities/Loader";

export default function SignUpInfo() {

    const languages = ["English", "Hindi", "French", "Spanish", "Marathi", "Kannada", "Tamil", "Telugu", "Malyali"]

    const [skillsKnown, setSkillsKnown] = useState([]);
    const [skillWantToKnow, setSkillWantToKnow] = useState([])
    const [workProofImg, setWorkProofImg] = useState([])
    const [url, setUrl] = useState('')
    const [bio, setBio] = useState('')
    const [languageKnown, setLanguageKnown] = useState([])
    const [error, setError] = useState([]);
    const { user, updateUser } = useContext(UserContext);
    const [skillsList, setSkillsList] = useState([]);
    const [isLoader, setIsLoader] = useState(false)
    const navigate = useNavigate();

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
        console.log(skillsKnown);
    };

    const toggleSkillWantToKnow = (skill) => {
        setSkillWantToKnow(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
        console.log(skillWantToKnow);
    };

    const toggleLanguageKnow = (lang) => {
        setLanguageKnown(prev =>
            prev.includes(lang)
                ? prev.filter(s => s !== lang)
                : [...prev, lang]
        );
    };

    const handleSubmitSignInInfo = async (e) => {
        e.preventDefault();
        setIsLoader(true);

        const errors = [];

        if (skillsKnown.length === 0) errors.push('Enter the skills you know (Step 1)');
        if (skillWantToKnow.length === 0) errors.push('Enter the skills you want to learn (Step 1)');
        if (languageKnown.length === 0) errors.push('Enter languages you know (Step 3)');

        if (errors.length > 0) {
            setError(errors);
            setIsLoader(false);
            return;
        }

        setError([]);

        try {
            const workImageUrl = await uploadWorkImages(workProofImg, user.email);

            const response = await axiosinstance.put(
                'http://localhost:5000/api/auth/register-final',
                {
                    email: user.email,
                    skillsKnow: skillsKnown,
                    skillsWantToKnow: skillWantToKnow,
                    socialLink: url,
                    languages: languageKnown,
                    workImageUrl,
                    bio
                }
            );

            if (response?.data?.user) {
                updateUser(response.data);

                setTimeout(() => {
                    setIsLoader(false);
                    navigate('/dashboard');
                }, 4000);
            }

        } catch (err) {
            console.error(err);
            setIsLoader(false);
        }
    };

    useEffect(() => {
        handleGetSkillList();
    }, [])

    return (
        <div className="flex h-fit bg-[#292524] justify-between text-white items-center w-full">
            <form className="w-full h-auto ">
                <Stepper
                    initialStep={1}
                    onComplete={handleSubmitSignInInfo}
                    backButtonText="Previous"
                    nextButtonText="Next"
                >
                    <Step >
                        <div className="flex flex-col gap-10 justify-center py-2 items-center">
                            <div className="w-full h-auto flex flex-col gap-10">
                                <h2><span className="text-xl">Welcome!</span>  Enter The Skills as per Your Needs </h2>
                                <input
                                    type="hidden"
                                    name="skillsKnown"
                                    value={skillsKnown.join(",")}
                                />
                                <div className="flex flex-col gap-5 justify-center">
                                    <h2 className="text-sm pl-2">Select The Skills <span className="text-lg text-green-400">" YOU " </span> Know :</h2>
                                    <div className="flex flex-wrap gap-3 h-23 text-white overflow-y-scroll">
                                        {skillsList.map((skill, index) => (
                                            <button
                                                type="button"
                                                key={index}
                                                onClick={() => toggleSkill(skill)}
                                                className={`px-4 py-2 rounded-full text-sm border transition
                                                ${skillsKnown.includes(skill)
                                                        ? "bg-green-500 text-white border-green-500"
                                                        : "bg-transparent text-white border-gray-500 hover:border-green-400"
                                                    }`}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="w-full h-auto flex flex-col gap-10">
                                <input
                                    type="hidden"
                                    name="skillsKnown"
                                    value={skillWantToKnow.join(",")}
                                />
                                <div className="flex flex-col gap-5 justify-center">
                                    <h2 className="text-sm pl-2">Select The Skills you<span className="text-lg text-green-400"> " WANT " </span>to Learn :</h2>
                                    <div className="flex flex-wrap gap-3 h-23 text-white overflow-y-scroll">
                                        {skillsList.map(skill => (
                                            <button
                                                type="button"
                                                key={skill}
                                                onClick={() => toggleSkillWantToKnow(skill)}
                                                className={`px-4 py-2 rounded-full text-sm border transition
                                                ${skillWantToKnow.includes(skill)
                                                        ? "bg-green-500 text-white border-green-500"
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
                    </Step>
                    <Step>
                        <div className="py-5 flex flex-col gap-10 -mt-5">
                            <div className="flex flex-col gap-5">
                                <div>
                                    <p className="text-[16px]">Social platform/Protfolio website URL :<br /><span className="text-gray-500 text-sm">(optional but reccomended)</span></p>
                                    <Inputs type="url" value={url} onChange={(e) => { setUrl(e.target.value) }} placeholder="https://example.com" />
                                </div>
                                <div>
                                    <p className="text-[16px]">Short Bio/Description :<br /><span className="text-gray-500 text-sm">(optional but reccomended)</span></p>
                                    <textarea value={bio} onChange={(e) => { setBio(e.target.value) }} className="w-full h-3/5 outline-none bg-slate-200 text-black rounded-xl p-3 " placeholder="Tell others what you’re good at, how you like to teach/learn…" >
                                    </textarea>
                                </div>
                            </div>
                        </div>
                    </Step>
                    <Step>
                        <div className="flex flex-col gap-5 py-5 px-3">
                            <p>Language You Know :</p>
                            <div className="flex flex-wrap gap-2 w-full">
                                {languages.map(lang => (
                                    <button
                                        type="button"
                                        key={lang}
                                        onClick={() => toggleLanguageKnow(lang)}
                                        className={`px-4 py-2 rounded-full text-sm border transition
                                                ${languageKnown.includes(lang)
                                                ? "bg-green-500 text-white border-green-500"
                                                : "bg-transparent text-white border-gray-500 hover:border-green-400"
                                            }`}
                                    >
                                        {lang}
                                    </button>

                                ))}
                            </div>
                            <p className="text-sm text-gray-300">
                                Upload your work (max 5 images)
                            </p>
                            <MultiImageSelector images={workProofImg} setImages={setWorkProofImg} max={5} />
                        </div>
                    </Step>
                    <Step>
                        <div className="flex justify-evenly items-center py-5">
                            <img className="scale-90 h-60" src={error.length > 0 ? '/SadStep-1.png' : '/Final-step1.png'} alt="" />
                            <div className="flex flex-col justify-center items-center gap-4">
                                {error.length > 0 ?
                                    (
                                        <div className="flex flex-col gap-7">
                                            <h1 className="text-center text-2xl">There were some <br /> Mistakes </h1>
                                            {error.length > 0 && (
                                                error.map((err, index) => (
                                                    <p className="text-red-500 font-light text-sm"><span className="text-white text-sm mr-2">{index + 1}.</span>{err}</p>
                                                ))
                                            )
                                            }
                                        </div>
                                    ) :
                                    (
                                        <>
                                            <h1 className="text-2xl">You Made it !!</h1>
                                            <p className="text-sm text-gray-400">make sure all the information is right <br /> if not you can go back to Previous steps </p>
                                        </>
                                    )
                                }
                            </div>
                            <img className="scale-90 h-60" src={error.length > 0 ? '/SadStep-2.png' : '/Final-step2.png'} alt="" />
                        </div>

                    </Step>
                </Stepper>
            </form>
            <img src="/parnesh2.png" alt="person loging in" className="w-2/6 h-dvh" />
            {isLoader && <Loader />}
        </div>
    )
}

