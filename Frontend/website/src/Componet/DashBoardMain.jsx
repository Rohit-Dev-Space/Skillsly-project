// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';

// import Sidebar from './DashboardPg/SideBarMenu';
// import UserProfile from './DashboardPg/Profile';
// import SearchSkills from './DashboardPg/SearchSkills';
// import GroupsList from './DashboardPg/GroupsList';
// import NotesList from './DashboardPg/NotesList';
// import MessagesList from './DashboardPg/MessagesList';

// const GroupSection = () => {
//   return (
//     <div className="flex h-screen bg-black font-sans">
//       <div className="w-1/4 min-w-[250px] max-w-xs hidden lg:block border-r border-[#1a1a1a]">
//         <Sidebar />
//       </div>

//       <main className="flex-grow overflow-y-auto">
//         <Routes>
//           <Route index element={<UserProfile />} />

//           <Route path="search" element={<SearchSkills />} />
//           <Route path="groups" element={<GroupsList />} />
//           <Route path="notes" element={<NotesList />} />
//           <Route path="messages" element={<MessagesList />} />

//           <Route path="*" element={<Navigate to="/dashboard" />} />
//         </Routes>
//       </main>
//     </div>
//   );
// };

// export default GroupSection;

import { Outlet } from "react-router-dom";
import Sidebar from "./DashboardPg/SideBarMenu";

const DashboardMain = () => {
  return (
    <div className="flex h-screen bg-black font-sans">
      <div className="w-2/4 min-w-[250px] max-w-xs hidden lg:block border-r border-[#1a1a1a]">
        <Sidebar />
      </div>

      <main className="flex-grow overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardMain;
