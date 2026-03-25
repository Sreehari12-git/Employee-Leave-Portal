function Dashboard() {
    const today = new Date();
   const options = { weekday: "long", month: "long", day: "numeric" } as const;
    const formattedDate = today.toLocaleDateString("en-US", options);  
return (
    <div>

      {/* Header */}
      <input 
        type="text" 
        placeholder="Search employees, records..." 
        style={{ padding: "10px", width: "300px" }}
      />

      <h1>Good morning, Sreehari</h1>
      <p>
          {formattedDate} • You are currently{" "}
        <span style={{ color: "green" }}>Clocked Out</span>
      </p>

      {/* Layout */}
      <div style={{ display: "flex", gap: "20px" }}>

        {/* Clock Card */}
        <div
          style={{
            background: "#f5f5f5",
            padding: "20px",
            borderRadius: "10px",
            width: "400px"
          }}
        >
          <p>CURRENT SESSION</p>
          <h1>00:00:00</h1>

          <button style={{ background: "green", color: "white", marginRight: "10px" }}>
            Clock In
          </button>

          <button>Clock Out</button>
        </div>

        {/* Team Presence */}
        <div
          style={{
            background: "#f5f5f5",
            padding: "20px",
            borderRadius: "10px",
            width: "250px"
          }}
        >
          <h3>Team Presence</h3>
          <p>Online Now: 12 / 15</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;