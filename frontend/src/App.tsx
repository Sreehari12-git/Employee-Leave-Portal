import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Sidebar } from "./components/Sidebar/Sidebar"
import Dashboard from "./pages/Dashboard"
import Attendance from "./pages/Attendance"

function App() {
  return (
    <BrowserRouter>
       <div style={{ display: "flex" }}>
        <Sidebar />

        <div style={{ padding: "20px", flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
