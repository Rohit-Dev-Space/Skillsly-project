import Lottie from "lottie-react";
import loader from './loader.json';
import { useEffect, useRef } from "react";
import animationData from "./loader.json";


export default function Loader() {

    const lottieRef = useRef();

    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.setSpeed(0.8);
            lottieRef.current.playSegments([0, 40], true);
        }
    }, []);

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xl z-40 p-10 overflow-y-scrolll">
            <div className="w-full mx-auto mt-52 scale-180 flex flex-col justify-start items-center">
                <Lottie
                    lottieRef={lottieRef}
                    animationData={animationData}
                    loop={true}
                    autoplay={true}
                    rendererSettings={{
                        clearCanvas: false,
                    }}
                    style={{ width: 120, height: 120 }}
                />
            </div>
        </div>
    );
}