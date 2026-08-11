import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import ActionCard from "../components/ActionCard";
import RecentCard from "../components/RecentCard";
import "./Dashboard.css"

function Dashboard() {
  return (
    <>
      <Navbar />

      <div className="dashboard">

        <div className="welcome">
          <h1>Hello, Sakshi 👋</h1>

          <p>Welcome back! Ready to create something amazing?</p>
        </div>

        <div className="stats">

          <StatsCard title="Images Generated" value="24" />

          <StatsCard title="Favorites" value="8" />

          <StatsCard title="Downloads" value="15" />

          <StatsCard title="History" value="24" />

        </div>

        <h2>Quick Actions</h2>

        <div className="actions">

          <ActionCard
            title="Generate Image"
            description="Create AI images from text prompts."
          />

          <ActionCard
            title="Explore Gallery"
            description="Browse community generated artwork."
          />

        </div>

        <h2>Recent Generations</h2>

        <div className="recent">

          <RecentCard />

          <RecentCard />

          <RecentCard />

        </div>

      </div>

    </>
  );
}

export default Dashboard;