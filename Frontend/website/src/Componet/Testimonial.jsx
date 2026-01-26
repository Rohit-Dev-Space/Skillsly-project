import React, { useEffect, useRef, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "../components/ui/carousel";

export default function Testimonial() {


    const Testis = [
        {
            img: "/p5.png",
            words: "Skillsly is the ultimate resource for career growth. The personalized paths helped me gain the exact skills needed for my next promotion!",
            designation: "Software Engineer",
        },
        {
            img: "/p6.png",
            words: "I love the community focus on Skillsly. It's more than just a platform—it's a supportive place to exchange expertise and master new topics.",
            designation: "Student",
        },
        {
            img: "/p7.png",
            words: "The structured content on Skillsly makes complex subjects so easy to grasp. It's the most efficient way to truly understand and apply new knowledge.",
            designation: "Driver",
        },
        {
            img: "/p8.png",
            words: "Finally, a platform that prioritizes application over theory. Skillsly is the ultimate tool for efficient learning.",
            designation: "Police",

        },
        {
            img: "/p1.png",
            words: "Skillsly excels at deconstructing intricate concepts into intuitive, manageable insights. It is, without question, the most streamlined methodology for bridging the gap between theoretical understanding and practical execution.",
            designation: "Engineer",
        },
        {
            img: "/p5.png",
            words: " The architecture of Skillsly’s content eliminates the friction usually found in high-level learning. It provides a high-velocity path to mastery, ensuring that complex ideas are not just learned, but fully integrated and ready for application",
            designation: "Professor",
        },
        {
            img: "/p6.png",
            words: "By distilling complex subjects into a logical flow, Skillsly transforms the learning experience. It is a powerful catalyst for anyone looking to bypass the fluff and gain a deep, functional command of new expertise.",
            designation: "doctor",
        },
        {
            img: "/p7.png",
            words: "The structured content on Skillsly makes complex subjects so easy to grasp. It's the most efficient way to truly understand and apply new knowledge.",
            designation: "Nurse",
        },
        {
            img: "/p8.png",
            words: "The brilliance of Skillsly lies in its ability to simplify the profound. It strips away the noise from dense subjects, providing a high-impact roadmap that empowers learners to master and deploy new skills with absolute confidence.",
            designation: "Teacher"    ,
        },
    ];

    return (
        <section className="bg-black py-10 pb-30 overflow-hidden text-center">
            <h1 className="flex flex-col text-5xl text-white font-semibold">
                Our Users
                <span className="bg-[radial-gradient(ellipse_at_center,_#4DDCB7_0%,_#B8FB70_100%)] bg-clip-text text-transparent">
                    Testimonials
                </span>
            </h1>
            <div className="bg-[#4DDCB7] blur-2xl rounded-full w-68 h-60 -mt-50 -ml-20"></div>
            <div className="mt-30 relative overflow-visible">
                <Carousel>
                    <CarouselContent className="px-3 sm:px-5 space-x-5 flex items-end">
                        {Testis.map((item, index) => (
                            <CarouselItem
                                key={index}
                                className="basis-[60%] sm:basis-1/6 transition-transform duration-300 ease-in-out"
                            >
                                <div className="bg-white w-full text-black pb-10 p-5 rounded-2xl shadow-md hover:-translate-y-6 transition-transform flex flex-col justify-between h-[320px]">
                                    <img
                                        src={item.img}
                                        alt="profile"
                                        width={80}
                                        height={80}
                                        className="rounded-full -mt-25 scale-150 h-50 w-full"
                                    />
                                    <h2 className="font-bold text-base">{item.designation}</h2>
                                    <p className="text-sm leading-relaxed">{item.words}</p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
}
