import { Outlet } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";

const AdminLayout = () => {

    const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);

    return (
        <div className="flex min-h-screen bg-black text-white">
            <AnimatePresence mode="wait">
                <motion.div
                    animate={{ width: isSideMenuOpen ? '25%' : '7%' }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className={`relative max-w-xs hidden lg:block border-r border-[#1a1a1a]`}>
                    <AdminSidebar />
                    <motion.div
                        onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
                        animate={{ rotate: isSideMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }} className={`absolute -right-7 cursor-pointer top-[40%] w-fit h-fit py-7 px-3 border border-white rounded-full `}>
                        <ChevronRightIcon size={30} className='text-white' />
                    </motion.div>
                </motion.div>
            </AnimatePresence>
            <main className="flex-grow overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;