// import { createContext, useContext, useEffect, useState } from "react";

// const API = "http://localhost:5000/api";
// const getToken = () => localStorage.getItem("token") || "";

// const AttendanceContext = createContext<any>(null);

// export function AttendanceProvider({ children }: { children: React.ReactNode }) {
//   const [today, setToday] = useState<any>(null);
//   const [isClockedIn, setIsClockedIn] = useState(false);

//   const fetchToday = async () => {
//     const res = await fetch(`${API}/attendance/today`, {
//       headers: { Authorization: `Bearer ${getToken()}` },
//     });
//     const data = await res.json();
//     setToday(data);
//     setIsClockedIn(!!(data?.attendance?.clockIn && !data?.attendance?.clockOut));
//   };

//   const clockIn = async () => {
//     await fetch(`${API}/attendance/clock-in`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${getToken()}` },
//     });
//     await fetchToday();
//   };

//   const clockOut = async () => {
//     await fetch(`${API}/attendance/clock-out`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${getToken()}` },
//     });
//     await fetchToday();
//   };

//   useEffect(() => { fetchToday(); }, []);

//   return (
//     <AttendanceContext.Provider value={{ today, isClockedIn, clockIn, clockOut, fetchToday }}>
//       {children}
//     </AttendanceContext.Provider>
//   );
// }

// export const useAttendance = () => useContext(AttendanceContext);