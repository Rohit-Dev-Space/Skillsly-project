import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserContext } from '../Context/UserContext';
// 1. Import the Autoplay plugin
import Autoplay from "embla-carousel-autoplay";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "../../components/ui/carousel";

const userSkills = ["Python", "Editing", "Java", "Guitar"];
const Testis = [
    {
        img: "/p2.png",
        words: "1",
        designation: "Software Engineer",
    },
    {
        img: "/p1.png",
        words: "2",
        designation: "Student",
    },
    {
        img: "/",
        words: "3",
        designation: "Professor",
    },
    {
        img: "/p4.png",
        words: "4",
        designation: "Professor",
    },
    {
        img: "/",
        words: "5",
        designation: "Professor",
    },
    {
        img: "/",
        words: "6",
        designation: "Professor",
    },
    {
        img: "/",
        words: "7",
        designation: "Professor",
    },
    {
        img: "/",
        words: "8",
        designation: "Professor",
    },
    {
        img: "",
        words: "9",
        designation: "Professor",
    },
];

const UserProfile = () => {
    const { user } = React.useContext(UserContext);

    // 2. Initialize the Autoplay plugin
    const plugin = useRef(
        Autoplay({ delay: 2000, stopOnInteraction: false })
    );

    return (
        <div className="p-6 md:p-10 w-full min-h-screen bg-[#0a0a0a] text-white">
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-10 mb-12">
                {/* Profile Image & Skills */}
                <div className="flex flex-col items-center md:items-start min-w-[150px]">
                    <div className="relative w-32 h-32 rounded-full border-2 border-gray-700 overflow-hidden bg-gray-700 mb-6">
                        <User className="absolute inset-0 m-auto w-24 h-24 text-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 w-full max-w-[150px]">
                        {userSkills.map((skill, index) => (
                            <span
                                key={index}
                                className="text-xs text-center font-medium text-white bg-[#1a1a1a] py-2 px-3 rounded-md border border-gray-700"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* User Info */}
                <div className="flex-grow">
                    <h1 className="text-3xl font-semibold mb-4">{user?.userName || "User Name"}</h1>
                    <p className="text-gray-300 leading-relaxed mb-6">
                        Creative technologist with a passion for storytelling and automation.
                        Skilled in video editing and Python programming, blending visual artistry
                        with smart scripting to produce engaging content and efficient workflows.
                    </p>

                    <p className="text-sm text-teal-400 mb-8 truncate">
                        https://www.figma.com/design/Q7hZykJTikcwal1sxcl/SkillSly-web-Design
                    </p>

                    <h2 className="text-xl font-medium mb-4">Badges</h2>
                    <div className="flex space-x-4 mb-10">
                        <div className="w-12 h-12 rounded-full bg-gray-600 border-2 border-white/30"></div>
                        <div className="w-12 h-12 rounded-full bg-gray-600 border-2 border-white/30"></div>
                        <div className="w-12 h-12 rounded-full bg-gray-600 border-2 border-white/30"></div>
                    </div>

                    {/* --- CAROUSEL SECTION START --- */}
                    <div className="w-full max-w-4xl px-10"> 
                        <h2 className="text-xl font-medium mb-6">Testimonials</h2>
                        <Carousel 
                            // 3. Attach the plugin here
                            plugins={[plugin.current]}
                            opts={{ align: "start", loop: true }} 
                            className="w-full"
                            // Optional: pause on hover
                            onMouseEnter={plugin.current.stop}
                            onMouseLeave={plugin.current.reset}
                        >
                            <CarouselContent className="-ml-4">
                                {Testis.map((item, index) => (
                                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                        <div className="bg-[#161616] border border-gray-800 p-6 rounded-2xl h-full flex flex-col justify-between">
                                            <p className="text-gray-400 text-sm italic mb-4">"{item.words}"</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden">
                                                    {item.img && item.img !== "/" ? (
                                                        <img src={item.img} className="w-full h-full object-cover" alt="user" />
                                                    ) : (
                                                        <User className="w-full h-full p-2 text-gray-400" />
                                                    )}
                                                </div>
                                                <p className="text-xs font-bold text-teal-500">{item.designation}</p>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white" />
                            <CarouselNext className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white" />
                        </Carousel>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default UserProfile;