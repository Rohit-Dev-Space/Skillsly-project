import { Routes, Route } from "react-router-dom";

import DashboardMain from "../src/Componet/DashBoardMain";
import UserProfile from "../src/Componet/DashboardPg/Profile";
import SearchSkills from "../src/Componet/DashboardPg/SearchSkills";
import GroupsList from "../src/Componet/DashboardPg/GroupsList";
import NotesList from "../src/Componet/DashboardPg/NotesList";
import GroupMessages from "../src/Componet/DashboardPg/GroupMessages";
import Ranking from "../src/Componet/DashboardPg/Ranking";
import CallJoin from "../src/Componet/DashboardPg/Calljoin";
import UserMessages from "../src/Componet/DashboardPg/UserMessages"
import MessageList from "../src/Componet/DashboardPg/MessageList"
import ProtectedNavigation from "../src/Utilities/ProtectedNavigation";

export default function Dashboard() {
  return (
    <ProtectedNavigation>
      <Routes>
        <Route element={<DashboardMain />}>
          <Route path="profile" element={<UserProfile />} />
          <Route index element={<SearchSkills />} />
          <Route path="ranking/:category/:categoryId" element={<Ranking />} />
          <Route path="groups" element={<GroupsList />} />
          <Route path="messages" element={<MessageList />} />
          <Route path="notes" element={<NotesList />} />
          <Route path="groups/:groupName/:groupId" element={<GroupMessages />} />
          <Route path="messages/chats/:userId" element={<UserMessages />} />
        </Route>
        <Route path="session/:groupName/:roomId/:sessionToken" element={<CallJoin />} />
      </Routes >
    </ProtectedNavigation>

  );
}




