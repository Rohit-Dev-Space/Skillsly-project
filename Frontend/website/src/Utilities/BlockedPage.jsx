import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BLOCK_DURATION_MS = 48 * 60 * 60 * 1000;

export default function BlockedPage() {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem("blockedUser");

        if (!stored) {
            // navigate("/authenticate", { replace: true });
            return;
        }

        let parsed;
        try {
            parsed = JSON.parse(stored);
        } catch {
            localStorage.removeItem("blockedUser");
            navigate("/authenticate", { replace: true });
            return;
        }

        if (!parsed.blockedAt) {
            navigate("/authenticate", { replace: true });
            return;
        }

        const unblockTime =
            new Date(parsed.blockedAt).getTime() + BLOCK_DURATION_MS;

        const interval = setInterval(() => {
            const remaining = Math.max(
                Math.floor((unblockTime - Date.now()) / 1000),
                0
            );
            setTimeLeft(remaining);

            if (remaining === 0) {
                clearInterval(interval);
                localStorage.removeItem("blockedUser");
                navigate("/authenticate", { replace: true });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [navigate]);

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    return (
        <section className="w-full h-screen bg-[#1a1a1a] flex justify-center items-center">
            <div className="w-full h-fit bg-[#1a1a1a] mx-auto flex flex-col items-center justify-center">
                <h1 className="w-full text-center font-extrabold text-6xl text-white">
                    You Have been <br /> Blocked For
                </h1>
                <p className="text-2xl text-white font-extrabold mt-5">
                    <span className="silkscreen-bold ml-3 text-5xl text-red-400">
                        {String(hours).padStart(2, "0")}:
                        {String(minutes).padStart(2, "0")}:
                        {String(seconds).padStart(2, "0")}
                    </span>
                </p>
                <p className="text-xl border border-white rounded-xl bg-black p-5 text-white font-extrabold mt-3">
                    For Repeated Violation of Decorum
                </p>
            </div>
        </section>
    );
}