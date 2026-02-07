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
            q: ' Can i register on SkillSly with my google account ?',
            a: 'Yes, you can! To make getting started as quick as possible, we offer a "One-Click Sign Up" via Google. Simply click the "Continue with Google" button on the registration page to link your account instantly.'
        },
        {
            q: 'Can we register as a teacher only ?',
            a: 'On SkillSly, we believe every great teacher is also a lifelong learner! Therefore, we dont have separate "Teacher-only" accounts. When you register, your account automatically gives you the power to both host your own courses and enroll in others. You can switch between your Instructor Dashboard and Student View seamlessly within a single profile'
        },
        {
            q: 'Can i schedule and manage multiple sessions ?',
            a: 'Yes, you can! SkillSly allows you to request multiple sessions to fit your learning or project goals. Once you submit your requested dates and times, they will be sent to the instructor for approval. As soon as the instructor accepts, your sessions will be officially locked into your schedule.'
        },
        {
            q: 'How do i access video call on the website ?',
            a: 'You can access video calls through our "Join Session" feature. Simply navigate to the instructors profile or your dashboard and click Request Session Once the instructor accepts your request, a Join link will appear in your active sessions. At the scheduled time, just click the link to start your face-to-face video consultation directly in your browser.'
        },
        {
            q: 'what is the use of badges in the profile ?',
            a: 'Badges serve as a visual verification of your performance and expertise. They showcase your achievements—such as completing high-level courses, maintaining a high student rating, or being a consistent contributor—to the entire community. For teachers, these badges act as a "seal of trust" that helps attract more students to your sessions'
        },
    ]
    return (
        <section className="bg-gradient-to-b from-[#000000] to-[#292524] w-full h-full flex flex-col justify-start py-20 items-center gap-20" id="FAQ">
            <h1 className="flex flex-col items-center text-5xl text-white"><span className="bg-[radial-gradient(ellipse_at_center,_#4DDCB7_0%,_#B8FB70_100%)] bg-clip-text font-bold text-transparent">FAQ'S</span>Section</h1>
            <div className="text-white w-2/4 h-auto">
                <Accordion type="single" collapsible>
                    {FAQS.map((value, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger>{value.q}</AccordionTrigger>
                            <AccordionContent>
                                {value.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}