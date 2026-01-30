import { Carousel, CarouselContent, CarouselItem } from "../../components/ui/carousel";
import { User } from "lucide-react";
import { UserContext } from "../Context/UserContext";
import { useContext } from "react";

export default function Profile({ userData = '' }) {

    const userSkills = ["Python", "Editing", "Java", "Guitar"];
    const { user } = useContext(UserContext)

    const profileUser = userData ? userData : user;

    return (
        <section className="w-full h-full bg-black flex pt-5 px-10 flex-col">
            <div className="p-6 md:p-10 w-full h-full">
                <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-15 mb-12">

                    <div className="flex flex-col items-center md:items-center min-w-[150px]">
                        <div className="relative w-32 h-32 rounded-full border-2 border-gray-700 overflow-hidden bg-gray-700 mb-6">
                            <img src={profileUser?.profileImageUrl} className="object-cover  w-full h-full text-white" />
                        </div>

                        <div className="grid grid-cols-2 place-items-center gap-2 w-full max-w-[150px]">
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
                        <h1 className="text-3xl font-semibold text-white mb-4">{profileUser?.userName}</h1>
                        <p className="text-gray-300 leading-relaxed mb-6">
                            {profileUser?.bio || "User didnt care to add bio"}
                        </p>

                        <div className="flex gap-1">
                            <p>Languages known :</p>
                            <p className="pb-5">[{profileUser?.languages?.map((lang, index) => <span key={index} className="m-2">{lang}{index === profileUser?.languages.length - 1 ? "" : ", "}</span>) || "No languages specified"}]</p>
                        </div>
                        {userData && <div className="flex gap-1">
                            <p>Skills Want To Learn :</p>
                            <p className="pb-5">[{profileUser?.skillsWantToKnow?.map((lang, index) => <span key={index} className="m-2">{lang}{index === profileUser?.languages.length - 1 ? "" : ", "}</span>) || "No languages specified"}]</p>
                        </div>}

                        <p className={`text-sm cursor-${profileUser?.socialLink ? "pointer" : "none"} text-teal-400 mb-8 truncate`}>
                            {profileUser?.socialLink || "No social link provided"}
                        </p>

                        <h2 className="text-xl font-medium text-white mb-4">Badges</h2>
                        <div className="flex space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gray-600 border-2 border-white/30"></div>
                            <div className="w-12 h-12 rounded-full bg-gray-600 border-2 border-white/30"></div>
                            <div className="w-12 h-12 rounded-full bg-gray-600 border-2 border-white/30"></div>
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
        </section>
    )
}