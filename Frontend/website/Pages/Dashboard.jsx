import { Routes, Route } from "react-router-dom";

import DashboardMain from "../src/Componet/DashboardMain";
import UserProfile from "../src/Componet/DashboardPg/Profile";
import SearchSkills from "../src/Componet/DashboardPg/SearchSkills";
import GroupsList from "../src/Componet/DashboardPg/GroupsList";
import NotesList from "../src/Componet/DashboardPg/NotesList";
import GroupMessages from "../src/Componet/DashboardPg/GroupMessages";
import Ranking from "../src/Componet/DashboardPg/Ranking";
import CallJoin from "../src/Componet/DashboardPg/CallJoin";

export default function Dashboard() {
  return (
    <Routes>
      <Route element={<DashboardMain />}>
        <Route path="profile" element={<UserProfile />} />
        <Route index element={<SearchSkills />} />
        <Route path="ranking/:category" element={<Ranking />} />
        <Route path="groups" element={<GroupsList />} />
        <Route path="notes" element={<NotesList />} />
        <Route path="groups/:groupName/:groupId" element={<GroupMessages />} />
        <Route path="session/:roomId" element={<CallJoin />} />
        <Route path="session/:roomId" element={<CallJoin />} />
      </Route>
    </Routes>
  );
}




