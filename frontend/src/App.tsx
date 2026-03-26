import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar/Sidebar";
import AdminDashboard from "./pages/AdminDashboard";
import Attendance from "./pages/Attendance";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddEmployee from "./pages/AddEmployee";
import TeamDirectory from "./components/TeamDirectory";
import LeaveApproval from "./pages/LeaveApproval";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/addemployee" element={<AddEmployee/>}/>
         <Route path="/attendance" element={<Attendance/>}/>
        <Route path="/teamstatus" element={<TeamDirectory/>}/> 
        <Route path="/leaverequests" element={<LeaveApproval />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <div style={{ display: "flex" }}>
                <Sidebar />
                <div style={{ padding: "20px", flex: 1 }}>
                  <Routes>
                    <Route path="" element={<AdminDashboard />} />
                    <Route path="attendance" element={<Attendance />} />
                    <Route path="team" element={<TeamDirectory/>}/>
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRole="USER">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;