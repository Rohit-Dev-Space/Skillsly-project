import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import LandingPg from '../Pages/LandingPg'
import Authenticate from '../Pages/Authenticate'
import SignUpInfo from '../Pages/SignUpInfo'
import Dashboard from '../Pages/Dashboard'
import UserProvider from "./Componet/Context/UserContext"

import AdminPg from "../Pages/AdminPg"

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPg />} />
          <Route path="/authenticate" element={<Authenticate />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/Sign-up-info" element={<SignUpInfo />} />
          <Route path="/admin/*" element={<AdminPg />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;