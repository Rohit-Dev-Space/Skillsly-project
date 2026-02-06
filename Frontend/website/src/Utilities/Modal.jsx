import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ isClose, title, type = '', children, className }) {

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                isClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isClose]);

    return (
        <div className={`fixed inset-0 bg-black/40 backdrop-blur-xl z-40 p-10 text-white ${className} overflow-y-scroll`}>
            <div className={`${type === 'profile' ? 'bg-black' : 'bg-black/30'} rounded-2xl ${type === 'notification' ? 'h-[500px] w-2/4 pb-20' : 'w-6/7 h-fit'} w-fit mx-auto mt-20 border flex flex-col justify-start items-center`}>
                <div className="relative flex justify-between w-full h-fit p-5">
                    {title && <h1 className={`text-3xl text-center w-full h-fit font-light p-5`}>{title}</h1>}
                    <button className="absolute top-5 right-5 w-fit h-fit p-3 cursor-pointer border text-white rounded-2xl hover:text-red-500 hover:border-red-300" onClick={isClose}><X /></button>
                </div>
                {children}
            </div>
        </div>
    )
}