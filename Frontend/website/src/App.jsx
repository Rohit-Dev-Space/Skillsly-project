import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import LandingPg from '../Pages/LandingPg'
import Authenticate from '../Pages/Authenticate'
import SignUpInfo from '../Pages/SignUpInfo'
import Dashboard from '../Pages/Dashboard'
import Dashboard2 from '../Pages/Dashboard2'
import UserProvider from "./Componet/Context/UserContext"
import AdmindashboardPages from '../Pages/AdmindashboardPages'

// IMPORTANT: Importing the sub-pages from your Component folder
import AdminDashboard from './Componet/admindashboard/AdminDashboard'
import AdminUsers from './Componet/admindashboard/AdminUsers'
import AdminSkills from './Componet/admindashboard/AdminSkills'

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPg />} />
          <Route path="/authenticate" element={<Authenticate />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/dashboard2" element={<Dashboard2 />} />
          <Route path="/Sign-up-info" element={<SignUpInfo />} />
          
          {/* NECESSARY CHANGE: Added children routes here */}
          <Route path="/admindashboardpages" element={<AdmindashboardPages />}>
            {/* This shows the Dashboard by default when you go to /admindashboardpages */}
            <Route index element={<AdminDashboard />} /> 
            
            {/* These routes render inside the <Outlet /> of AdmindashboardPages */}
            <Route path="main" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="skills" element={<AdminSkills />} />
          </Route>
          
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;