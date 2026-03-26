export default function UserDashboard() {
  const username = localStorage.getItem("username");

  return (
    <div style={{ padding: "24px" }}>
      <h1>Welcome, {username}</h1>
      <p>This is User Dashboard</p>
    </div>
  );
}