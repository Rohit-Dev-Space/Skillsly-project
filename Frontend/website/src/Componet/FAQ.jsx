import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion"

export default function FAQ() {
    const FAQS = [
        {
            q: 'Can I register on SkillSly with my Google account?',
            a: 'Yes, you can! To make getting started as quick as possible, we offer a "One-Click Sign Up" via Google. Simply click the "Continue with Google" button on the registration page to link your account instantly.'
        },
        {
            q: 'Can we register as a teacher only?',
            a: 'On SkillSly, we believe every great teacher is also a lifelong learner! Therefore, we don’t have separate "Teacher-only" accounts. Your profile automatically allows you to both host sessions and enroll in others.'
        },
        {
            q: 'Can I schedule and manage multiple sessions?',
            a: 'Yes, you can! SkillSly allows you to request multiple sessions. Once you submit your requested dates, they are sent to the instructor for approval. Once accepted, they are locked into your schedule.'
        },
        {
            q: 'How do I access video calls on the website?',
            a: 'You can access video calls through our "Join Session" feature. Once an instructor accepts your request, a Join link will appear in your active sessions. Just click the link to start your video consultation directly in your browser.'
        },
        {
            q: 'What is the use of badges in the profile?',
            a: 'Badges serve as a visual verification of your expertise. They showcase achievements—like high ratings or course completions—acting as a "seal of trust" for the community.'
        },
    ]

    return (
        <section className="bg-gradient-to-b from-[#000000] to-[#292524] w-full min-h-screen flex flex-col justify-start py-20 px-6 md:px-0 items-center gap-12 md:gap-20" id="FAQ">
            
            {/* Header with responsive text size */}
            <h1 className="flex flex-col items-center text-4xl md:text-5xl text-white">
                <span className="bg-[radial-gradient(ellipse_at_center,_#4DDCB7_0%,_#B8FB70_100%)] bg-clip-text font-bold text-transparent">
                    FAQ'S
                </span>
                Section
            </h1>

            {/* Accordion Container - responsive width */}
            <div className="text-white w-full max-w-4xl md:w-3/4 lg:w-2/4 h-auto">
                <Accordion type="single" collapsible className="w-full">
                    {FAQS.map((value, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-gray-700">
                            <AccordionTrigger className="text-left text-sm md:text-base hover:text-[#4DDCB7] transition-all py-4">
                                {value.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                {value.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}