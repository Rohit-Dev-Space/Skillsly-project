import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ isOpen, isClose, title, data, className }) {

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                isClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-xl w-full h-full z-40 p-10 text-white`}>
            <div className="bg-black/30 rounded-2xl w-2/4 h-[500px] mx-auto mt-20 border flex flex-col justify-start items-center">
                <div className="relative flex justify-between w-full h-fit p-5">
                    <h1 className="text-3xl text-center w-full h-fit font-light p-5">{title}</h1>
                    <button className="absolute top-5 right-5 w-fit h-fit p-3 cursor-pointer border text-white rounded-2xl" onClick={isClose}><X /></button>
                </div>
                <div className="text-center w-full h-fit p-5 mx-3">{data}</div>
            </div>
        </div>
    )
}