import { Outlet } from "react-router-dom";
import Sidebar from "./DashboardPg/SideBarMenu";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";

const DashboardMain = () => {

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);

  return (
    <div className="flex h-screen bg-black font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ width: isSideMenuOpen ? '40%' : '7%' }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`relative max-w-xs hidden lg:block border-r border-[#1a1a1a]`}>
          <Sidebar isOpen={isSideMenuOpen} />
          <motion.div
            onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
            animate={{ rotate: isSideMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }} className={`absolute -right-7 cursor-pointer top-[35%] w-fit h-fit py-5 px-3 border border-white rounded-full bg-black/80 hover:border-teal-300 hover:text-teal-300`}>
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

export default DashboardMain;
